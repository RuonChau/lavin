import z from "zod";

export const editProductSchema = z.object({
  name: z.string().min(3, 'Tên sản phẩm ít nhất 3 ký tự'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  basePrice: z.number().min(0, 'Giá không được âm'),
  baseCurrency: z.string().min(1, 'Vui lòng chọn đơn vị'),
  description: z.string().optional(),
  isActive: z.boolean(),
  sizes: z.array(z.string()),
  sizeConfigs: z.record(z.string(), z.object({
    price: z.number().min(0, 'Giá không được âm'),
  })).optional(),
});

export type EditProductFormData = z.infer<typeof editProductSchema>;