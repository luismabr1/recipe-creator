"use client"

import RecipeForm from "../../../components/RecipeForm"

export default function NewRecipePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Nueva Receta</h1>
      <RecipeForm />
    </div>
  )
}

