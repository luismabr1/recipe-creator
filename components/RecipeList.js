"use client"

import { useState } from "react"
import { useRecipes } from "../context/RecipeContext"
import Link from "next/link"

export default function RecipeList() {
  const { recipes, loading, error } = useRecipes()
  const [searchTerm, setSearchTerm] = useState("")

  if (loading) return <div>Cargando recetas...</div>
  if (error) return <div>Error: {error}</div>

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.preparacion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar recetas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      {filteredRecipes.map((recipe) => (
        <div key={recipe.id} className="mb-4 p-4 border rounded">
          <h3 className="text-xl font-bold">{recipe.preparacion}</h3>
          <p>Vida útil: {recipe.vida_util || "No especificada"}</p>
          <Link href={`/recipes/${recipe.id}`} className="text-blue-500 hover:underline">
            Ver detalles
          </Link>
        </div>
      ))}
    </div>
  )
}

