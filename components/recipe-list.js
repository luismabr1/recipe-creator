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
    return <div className="text-center py-10">Cargando recetas...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.preparacion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recetas ({recipes.length})</h2>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Receta
          </Link>
        </Button>
      </div>

      <Input
        placeholder="Buscar recetas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
      />

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No se encontraron recetas</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{recipe.preparacion}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
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

