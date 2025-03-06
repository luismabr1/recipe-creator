"use client"

import { useState } from "react"
import { useRecipes } from "@/context/RecipeContext"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function RecipeList() {
  const { recipes, loading, error } = useRecipes()
  const [searchTerm, setSearchTerm] = useState("")

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Cargando recetas...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.preparacion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Recetas <span className="text-gray-500">({recipes.length})</span>
        </h2>
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Link href="/recipes/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Receta
          </Link>
        </Button>
      </div>

      {/* Search Input */}
      <Input
        placeholder="Buscar recetas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Recipe Grid or Empty State */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-md">
          No se encontraron recetas
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
              <Card className="border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-200 bg-white">
                <CardHeader className="border-b border-gray-100 pb-3">
                  <CardTitle className="text-lg font-medium text-gray-900 line-clamp-1">
                    {recipe.preparacion}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-sm text-gray-600">
                    {recipe.vida_util ? `Vida útil: ${recipe.vida_util}` : "Sin vida útil especificada"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}