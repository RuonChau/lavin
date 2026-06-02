import type { NextRequest } from 'next/server';

const API_BASE_URL = process.env.API_PROXY_TARGET ?? 'http://localhost:8700/api/v1';
const TIME_ZONE = 'Asia/Ho_Chi_Minh';

type AnyRecord = Record<string, unknown>;

function toRecord(value: unknown): AnyRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as AnyRecord)
    : undefined;
}

function toNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function toDateKey(value: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(value);
}

function addDays(value: Date, days: number): Date {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

function sameDate(value: unknown, dateKey: string): boolean {
  if (!value) return false;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return false;
  return toDateKey(date) === dateKey;
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function unwrapPayload<T = unknown>(value: unknown): T {
  const response = toRecord(value);
  if (!response) return value as T;

  for (const key of [
    'data',
    'items',
    'order',
    'orders',
    'product',
    'products',
    'resources',
  ]) {
    if (response[key] !== undefined) return response[key] as T;
  }

  return value as T;
}

function unwrapList(value: unknown): AnyRecord[] {
  const payload = unwrapPayload(value);
  if (Array.isArray(payload)) return payload.filter(toRecord) as AnyRecord[];

  const record = toRecord(payload);
  if (!record) return [];

  if (Array.isArray(record.items)) return record.items.filter(toRecord) as AnyRecord[];
  if (Array.isArray(record.data)) return record.data.filter(toRecord) as AnyRecord[];

  return [];
}

function buildHeaders(request: NextRequest): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const authorization = request.headers.get('authorization');
  const cookie = request.headers.get('cookie');

  if (authorization) headers.Authorization = authorization;
  if (cookie) headers.Cookie = cookie;

  return headers;
}

function buildUrl(path: string, params?: Record<string, string | number>): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function fetchUpstream(
  request: NextRequest,
  path: string,
  params?: Record<string, string | number>,
): Promise<Response> {
  return fetch(buildUrl(path, params), {
    headers: buildHeaders(request),
    cache: 'no-store',
  });
}

async function fetchJson(
  request: NextRequest,
  path: string,
  params?: Record<string, string | number>,
) {
  const response = await fetchUpstream(request, path, params);
  const data = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

function normalizeOrderStatus(value: unknown): string {
  switch (String(value ?? '').toUpperCase()) {
    case 'DELIVERED':
    case 'COMPLETED':
      return 'completed';
    case 'PROCESSING':
    case 'PREPARING':
      return 'preparing';
    case 'SHIPPED':
    case 'READY':
      return 'ready';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return 'pending';
  }
}

function normalizePaymentStatus(value: unknown): string {
  switch (String(value ?? '').toUpperCase()) {
    case 'PAID':
      return 'paid';
    case 'REFUNDED':
    case 'CANCELLED':
      return 'refunded';
    default:
      return 'unpaid';
  }
}

function getOrderTotal(order: AnyRecord): number {
  return toNumber(
    order.total_amount ??
      order.totalAmount ??
      order.final_total ??
      order.finalTotal ??
      order.final_amount ??
      order.total,
  );
}

function mapRecentOrder(order: AnyRecord, index: number) {
  const customer = toRecord(order.customer);
  const branch = toRecord(order.branch);

  return {
    id: String(order.id ?? order._id ?? index),
    orderNumber: String(order.order_code ?? order.orderNumber ?? order.code ?? order.id ?? `ORD-${index + 1}`),
    customerName: String(order.customer_name ?? customer?.name ?? customer?.phone ?? 'Khách vãng lai'),
    customerPhone: order.customer_phone || customer?.phone ? String(order.customer_phone ?? customer?.phone) : undefined,
    branchName: String(order.branch_name ?? branch?.name ?? 'Chi nhánh'),
    paymentMethod: String(order.payment_method ?? order.paymentMethod ?? 'COD'),
    paymentStatus: normalizePaymentStatus(order.payment_status ?? order.paymentStatus),
    status: normalizeOrderStatus(order.order_status ?? order.status),
    totalAmount: getOrderTotal(order),
    createdAt: String(order.created_at ?? order.createdAt ?? new Date().toISOString()),
  };
}

function isCanceled(order: AnyRecord): boolean {
  return normalizeOrderStatus(order.order_status ?? order.status) === 'cancelled';
}

function getProductImage(product: AnyRecord): string | undefined {
  const image = toRecord(product.image ?? product.primary_image ?? product.primaryImage);
  if (image?.file_url || image?.url || image?.src) {
    return String(image.file_url ?? image.url ?? image.src);
  }

  const variants = unwrapList(product.variants ?? product.product_variants ?? product.productVariants);
  for (const variant of variants) {
    const variantImage = toRecord(variant.image ?? variant.primary_image ?? variant.primaryImage);
    if (variantImage?.file_url || variantImage?.url || variantImage?.src) {
      return String(variantImage.file_url ?? variantImage.url ?? variantImage.src);
    }
    const images = unwrapList(variant.images);
    const firstImage = images.map(toRecord).find(Boolean);
    if (firstImage?.file_url || firstImage?.url || firstImage?.src) {
      return String(firstImage.file_url ?? firstImage.url ?? firstImage.src);
    }
  }

  return typeof product.image === 'string' ? product.image : undefined;
}

function aggregateTopProducts(orders: AnyRecord[], products: AnyRecord[], reportTopProducts: AnyRecord[]) {
  const productsByName = new Map(
    products.map((product) => [String(product.name ?? '').toLowerCase(), product]),
  );

  if (reportTopProducts.length > 0) {
    return reportTopProducts.slice(0, 4).map((item, index) => {
      const matchedProduct = productsByName.get(String(item.name ?? '').toLowerCase());
      const revenue = toNumber(item.revenue);
      const sold = toNumber(item.sold ?? item.quantity);

      return {
        id: String(item.id ?? matchedProduct?.id ?? index),
        name: String(item.name ?? matchedProduct?.name ?? 'Sản phẩm'),
        sold,
        revenue,
        price: sold > 0 ? Math.round(revenue / sold) : toNumber(matchedProduct?.base_price ?? matchedProduct?.price),
        image: getProductImage(matchedProduct ?? {}),
      };
    });
  }

  const grouped = new Map<string, { id: string; name: string; sold: number; revenue: number; image?: string }>();

  orders.forEach((order) => {
    const items = unwrapList(order.items ?? order.order_items);
    items.forEach((item) => {
      const product = toRecord(item.product);
      const productId = String(item.product_id ?? product?.id ?? item.id ?? item.product_name ?? item.productName ?? '');
      const productName = String(item.product_name ?? item.productName ?? product?.name ?? 'Sản phẩm');
      const quantity = toNumber(item.quantity, 1);
      const price = toNumber(item.final_price ?? item.price ?? item.unit_price ?? product?.base_price);
      const current = grouped.get(productId) ?? {
        id: productId,
        name: productName,
        sold: 0,
        revenue: 0,
        image: getProductImage(product ?? item),
      };

      current.sold += quantity;
      current.revenue += price * quantity;
      grouped.set(productId, current);
    });
  });

  return Array.from(grouped.values())
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4)
    .map((item) => ({
      ...item,
      price: item.sold > 0 ? Math.round(item.revenue / item.sold) : 0,
    }));
}

function countInventoryWarnings(stocks: AnyRecord[]): number {
  return stocks.filter((stock) => {
    const status = String(stock.stock_status ?? stock.status ?? '').toUpperCase();
    if (['LOW_STOCK', 'OUT_OF_STOCK', 'WARNING'].includes(status)) return true;

    const available = toNumber(
      stock.available_quantity ??
        stock.current_quantity ??
        stock.quantity ??
        stock.stock,
    );
    const threshold = toNumber(stock.min_quantity ?? stock.min_stock ?? stock.threshold, 10);

    return available <= threshold;
  }).length;
}

function countActiveEmployees(timekeepings: AnyRecord[], schedules: AnyRecord[], dateKey: string): number {
  const checkedIn = timekeepings.filter((item) => {
    const status = String(item.status ?? '').toUpperCase();
    const hasCheckedIn = sameDate(item.check_in ?? item.checkIn ?? item.created_at, dateKey);
    const hasCheckedOut = Boolean(item.check_out ?? item.checkOut);

    return hasCheckedIn && (!hasCheckedOut || ['CHECKED_IN', 'PRESENT', 'WORKING'].includes(status));
  });

  if (checkedIn.length > 0) return checkedIn.length;

  return schedules.filter((item) => sameDate(item.work_date ?? item.workDate ?? item.date, dateKey)).length;
}

function buildOperationTip(params: {
  inventoryWarnings: number;
  topProducts: Array<{ name: string; sold: number }>;
  todayOrders: number;
  activeEmployees: number;
}) {
  if (params.inventoryWarnings > 0) {
    return `Có ${params.inventoryWarnings} nguyên liệu đang dưới ngưỡng an toàn. Nên kiểm tra tồn kho trước khung giờ cao điểm.`;
  }

  const bestProduct = params.topProducts[0];
  if (bestProduct && bestProduct.sold > 0) {
    return `${bestProduct.name} đang bán tốt nhất hôm nay với ${bestProduct.sold} đơn. Hãy đảm bảo quầy pha chế và nguyên liệu luôn sẵn sàng.`;
  }

  if (params.todayOrders > 0 && params.activeEmployees === 0) {
    return 'Hôm nay đã có đơn phát sinh nhưng chưa ghi nhận nhân viên đang trực. Nên kiểm tra lịch làm việc hoặc chấm công.';
  }

  return 'Dữ liệu vận hành đang ổn định. Hãy tải lại định kỳ để theo dõi doanh thu, đơn hàng và tồn kho trong ngày.';
}

export async function GET(request: NextRequest) {
  const dashboardResponse = await fetchUpstream(request, '/dashboard/overview');

  if (dashboardResponse.ok) {
    return Response.json(await dashboardResponse.json());
  }

  if (![404, 405].includes(dashboardResponse.status)) {
    const error = await dashboardResponse.json().catch(() => ({
      success: false,
      message: 'Không thể tải dữ liệu dashboard.',
    }));

    return Response.json(error, { status: dashboardResponse.status });
  }

  const [reportsResult, ordersResult, inventoryResult, employeesResult, timekeepingsResult, schedulesResult, productsResult] =
    await Promise.all([
      fetchJson(request, '/reports', { range: 'TODAY' }),
      fetchJson(request, '/orders', { page: 1, limit: 500 }),
      fetchJson(request, '/inventory-stocks', { page: 1, limit: 500 }),
      fetchJson(request, '/employees', { page: 1, limit: 500 }),
      fetchJson(request, '/timekeepings', { page: 1, limit: 500 }),
      fetchJson(request, '/work-schedules', { page: 1, limit: 500 }),
      fetchJson(request, '/products', { page: 1, limit: 300 }),
    ]);

  const authError = [reportsResult, ordersResult, inventoryResult, employeesResult, timekeepingsResult, schedulesResult, productsResult]
    .find((result) => !result.ok && [401, 403].includes(result.status));

  if (authError) {
    return Response.json(authError.data ?? { success: false, message: 'Unauthorized' }, {
      status: authError.status,
    });
  }

  const reports = toRecord(unwrapPayload(reportsResult.data)) ?? {};
  const reportTotals = toRecord(reports.totals) ?? {};
  const reportTopProducts = unwrapList(reports.topProducts);

  const orders = ordersResult.ok ? unwrapList(ordersResult.data) : [];
  const inventoryStocks = inventoryResult.ok ? unwrapList(inventoryResult.data) : [];
  const employees = employeesResult.ok ? unwrapList(employeesResult.data) : [];
  const timekeepings = timekeepingsResult.ok ? unwrapList(timekeepingsResult.data) : [];
  const schedules = schedulesResult.ok ? unwrapList(schedulesResult.data) : [];
  const products = productsResult.ok ? unwrapList(productsResult.data) : [];

  const todayKey = toDateKey(new Date());
  const yesterdayKey = toDateKey(addDays(new Date(), -1));
  const todayOrders = orders.filter((order) => sameDate(order.created_at ?? order.createdAt, todayKey));
  const yesterdayOrders = orders.filter((order) => sameDate(order.created_at ?? order.createdAt, yesterdayKey));
  const billableTodayOrders = todayOrders.filter((order) => !isCanceled(order));
  const billableYesterdayOrders = yesterdayOrders.filter((order) => !isCanceled(order));

  const computedTodayRevenue = billableTodayOrders.reduce((sum, order) => sum + getOrderTotal(order), 0);
  const computedYesterdayRevenue = billableYesterdayOrders.reduce((sum, order) => sum + getOrderTotal(order), 0);

  const topProducts = aggregateTopProducts(todayOrders.length > 0 ? todayOrders : orders, products, reportTopProducts);
  const inventoryWarnings = countInventoryWarnings(inventoryStocks);
  const activeEmployees = countActiveEmployees(timekeepings, schedules, todayKey);
  const yesterdayActiveEmployees = countActiveEmployees(timekeepings, schedules, yesterdayKey);

  const overview = {
    stats: {
      todayRevenue: toNumber(reportTotals.todayRevenue, computedTodayRevenue),
      revenueChangePercent: percentChange(computedTodayRevenue, computedYesterdayRevenue),
      todayOrders: toNumber(reportTotals.totalOrders, todayOrders.length),
      orderChangePercent: percentChange(todayOrders.length, yesterdayOrders.length),
      inventoryWarnings,
      inventoryWarningsChange: 0,
      activeEmployees: activeEmployees || (schedules.length === 0 && timekeepings.length === 0 ? employees.length : activeEmployees),
      activeEmployeesChange: activeEmployees - yesterdayActiveEmployees,
    },
    recentOrders: orders
      .map(mapRecentOrder)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    topProducts,
    operationTip: buildOperationTip({
      inventoryWarnings,
      topProducts,
      todayOrders: todayOrders.length,
      activeEmployees,
    }),
    generatedAt: new Date().toISOString(),
    source: 'aggregated-api' as const,
  };

  return Response.json({
    success: true,
    data: overview,
  });
}
