export interface Ingrediente {
  [key: string]: string
}

export interface Recipe {
  id: number
  preparacion: string
  vajilla: string
  vida_util: string
  ingredientes: Ingrediente
  rendimiento: string
  procedimiento: string
  created_at?: string
}

export type RecipeFormData = Omit<Recipe, "id" | "created_at">

