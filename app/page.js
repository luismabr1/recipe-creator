"use client"

import { useEffect, useState } from "react"
import RecipeList from "@/components/recipe-list"
import SeedDatabase from "@/scripts/seed-database"
import RecipePDFButton from "@/components/recipe-pdf" // Import the PDF button component
import { supabase } from "@/lib/supabase" // Assuming you have a Supabase client
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch recipes from Supabase on mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data, error } = await supabase.from("recipes").select("*")
        if (error) throw error
        setRecipes(data)
      } catch (err) {
        console.error("Error fetching recipes:", err)
        setError("Error al cargar las recetas")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Gestor de Recetas</h1>
        <p className="text-gray-500">Administra tus recetas de forma sencilla</p>
      </div>

      <div className="flex justify-between items-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Inicialización de la Base de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-500">
              Si es la primera vez que usas la aplicación, haz clic en el botón para inicializar la base de datos con las recetas.
            </p>
            <SeedDatabase />
          </CardContent>
        </Card>
        {/* Add the RecipePDFButton here */}
        {recipes.length > 0 && <RecipePDFButton recipes={recipes} />}
      </div>

      {loading && <p className="text-center">Cargando recetas...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && <RecipeList recipes={recipes} />}
    </div>
  )
}



