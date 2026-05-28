import { api } from '@/shared/lib/axios';
import { Formula, FormulaIngredient } from '../../domain/entities/formula.entity';

export const formulaService = {
  getFormulas: async (): Promise<Formula[]> => {
    const response = await api.get('/recipes?limit=1000');
    const recipeRows = response.data.data || [];

    // Group recipes by variant_id
    const grouped: Record<string, Formula> = {};

    recipeRows.forEach((row: any) => {
      const variantId = row.variant_id;
      if (!variantId) return;

      const variant = row.variant || {};
      const product = variant.product || {};
      const categoryName = product.category?.name || row.ingredient?.category || "Khác";
      const ingredient = row.ingredient || {};

      const ingredientCost = Number(row.quantity) * Number(ingredient.price_per_unit || 0);

      const formulaIngredient: FormulaIngredient = {
        id: row.id,
        materialId: row.ingredient_id,
        materialName: ingredient.name || "Nguyên liệu",
        quantity: Number(row.quantity),
        unit: ingredient.unit || "đơn vị",
        cost: ingredientCost,
      };

      if (!grouped[variantId]) {
        grouped[variantId] = {
          id: variantId,
          productId: product.id || "unknown",
          productName: variant.variant_name || product.name || "Sản phẩm",
          productImage: variant.images?.[0]?.file_url || undefined,
          category: categoryName,
          ingredients: [],
          totalCost: 0,
          updatedAt: row.updatedAt || new Date().toISOString(),
          variantPrice: Number(variant.price || 0),
        };
      }

      grouped[variantId].ingredients.push(formulaIngredient);
      grouped[variantId].totalCost += ingredientCost;

      if (new Date(row.updatedAt) > new Date(grouped[variantId].updatedAt)) {
        grouped[variantId].updatedAt = row.updatedAt;
      }
    });

    return Object.values(grouped);
  },

  createFormula: async (data: { variant_id: string; ingredients: { ingredient_id: string; quantity: number | string }[] }): Promise<any> => {
    const response = await api.post('/recipe/bulk', data);
    return response.data.data;
  },

  updateFormula: async (id: string, data: { ingredients: { ingredient_id: string; quantity: number | string }[] }): Promise<any> => {
    const response = await api.post('/recipe/bulk', {
      variant_id: id,
      ingredients: data.ingredients,
    });
    return response.data.data;
  },

  getIngredients: async (): Promise<any[]> => {
    const response = await api.get('/ingredients');
    return response.data.data || [];
  },

  getProductVariants: async (): Promise<any[]> => {
    const response = await api.get('/product-variants');
    return response.data.data || [];
  }
};

