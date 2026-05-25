import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import type { Category, Product } from '../domain/entities/product.entity';

export const exportProductsToExcel = (products: Product[], categories: Category[]) => {
  // 1. Chuẩn bị dữ liệu thô cho các hàng Excel
  const rawData = products.map((product, index) => {
    // Lấy tên danh mục
    const categoryName = categories.find((c) => c.id === product.category_id)?.name || 'Chưa phân loại';

    // Lấy trạng thái hoạt động
    const statusText = product.is_active ? 'Đang bán' : 'Ngưng bán';

    // Định dạng thông tin các biến thể (kích thước và giá của biến thể đó)
    const variantsText = product.variants && product.variants.length > 0
      ? product.variants.map((v) => `${v.size}: ${Number(v.price).toLocaleString('vi-VN')} VND`).join(', ')
      : 'Không';

    // Định dạng ngày tạo
    const createdDateText = product.created_at
      ? dayjs(product.created_at).format('DD/MM/YYYY')
      : 'N/A';

    return {
      'STT': index + 1,
      'Mã SKU': product.sku || 'N/A',
      'Tên sản phẩm': product.name,
      'Danh mục': categoryName,
      'Giá cơ bản (VND)': product.base_price,
      'Tiền tệ': product.currency?.currency || 'VND',
      'Biến thể & Giá': variantsText,
      'Trạng thái': statusText,
      'Ngày tạo': createdDateText,
    };
  });

  // 2. Tạo worksheet từ dữ liệu JSON
  const worksheet = XLSX.utils.json_to_sheet(rawData);

  // 3. Tự động điều chỉnh độ rộng cột dựa trên nội dung dài nhất
  if (rawData.length > 0) {
    const colWidths = Object.keys(rawData[0]).map((key) => {
      const maxLen = Math.max(
        key.length + 5, // Độ dài tối thiểu của header + padding
        ...rawData.map((row) => {
          const val = row[key as keyof typeof row];
          return val !== null && val !== undefined ? String(val).length + 2 : 2;
        })
      );
      return { wch: maxLen };
    });
    worksheet['!cols'] = colWidths;
  }

  // 4. Tạo workbook mới và chèn worksheet vào
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách sản phẩm');

  // 5. Xuất file và kích hoạt trình tải xuống ở client
  const dateStr = dayjs().format('YYYYMMDD_HHmmss');
  const fileName = `Lavin_Menu_San_Pham_${dateStr}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
