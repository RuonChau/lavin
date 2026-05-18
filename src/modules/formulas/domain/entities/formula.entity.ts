export interface FormulaIngredient {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface Formula {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  category: string;
  ingredients: FormulaIngredient[];
  totalCost: number;
  updatedAt: string;
}
