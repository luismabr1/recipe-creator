"use client"

import { useEffect, useState } from "react"
import RecipeList from "@/components/recipe-list"
import SeedDatabase from "@/scripts/seed-database"
import RecipePDFButton from "@/components/recipe-pdf" // Assuming this is the correct import
import { supabase } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function Home() {
  const [recipes, setRecipes] = useState([])
  const [filteredRecipes, setFilteredRecipes] = useState([]) // For search functionality
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isRecipeListOpen, setIsRecipeListOpen] = useState(true) // State for collapsible list
  const [searchQuery, setSearchQuery] = useState("") // State for search input

  // Fetch recipes from Supabase on mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data, error } = await supabase.from("recipes").select("*")
        if (error) throw error
        setRecipes(data || [])
        setFilteredRecipes(data || []) // Initialize filtered recipes
      } catch (err) {
        console.error("Error fetching recipes:", err)
        setError("Error al cargar las recetas")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  // Filter recipes based on search query
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredRecipes(recipes)
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.preparacion.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredRecipes(filtered)
    }
  }, [searchQuery, recipes])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Gestor de Recetas</h1>
          <p className="text-gray-500">Administra tus recetas de forma sencilla</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow mt-24 mb-16 max-w-4xl mx-auto w-full px-4">
        {/* Loading State */}
        {loading && (
          <div className="text-center mt-10">
            <p>Cargando recetas...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center mt-10 text-red-500">
            <p>{error}</p>
          </div>
        )}

        {/* Content when loaded */}
        {!loading && !error && (
          <>
            {/* Initializer (shown only if no recipes) */}
            {recipes.length === 0 && (
              <Card className="mb-6">
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
            )}

            {/* Recipe Section (Toggle Button and Search Bar) */}
            {recipes.length > 0 && (
              <div className="mb-6">
                {/* Toggle Button */}
                <div
                  onClick={() => setIsRecipeListOpen(!isRecipeListOpen)}
                  className="w-full flex justify-between items-center bg-gray-100 hover:bg-gray-200 text-gray-800 mb-4"
                  aria-expanded={isRecipeListOpen}
                >
                  <span>Lista de Recetas</span>
                  {isRecipeListOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}


                </div>



                {/* Collapsible Recipe List */}
                {isRecipeListOpen && (<div
                  className={`hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isRecipeListOpen ? "max-h-[calc(100vh-20rem)] overflow-y-auto" : "max-h-0"
                  }`}
                >
                  <RecipeList recipes={filteredRecipes} />
                </div>
                )}
              </div>
              
            )}

            {/* Empty State */}
            {!loading && !error && recipes.length === 0 && (
              <p className="text-center text-gray-500 mt-10">No hay recetas disponibles aún.</p>
            )}
          </>
        )}
      </main>

      {/* Fixed Footer with PDF Button */}
      {recipes.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-t-md z-10 p-4">
          <div className="max-w-4xl mx-auto flex justify-end">
            <RecipePDFButton recipes={recipes} />
          </div>
        </footer>
      )}
    </div>
  )
}