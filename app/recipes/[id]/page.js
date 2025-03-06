"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../../lib/supabase"
import RecipeForm from "../../../components/RecipeForm"

export default function EditRecipePage() {
  const params = useParams()
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    async function fetchRecipe() {
      const { data, error } = await supabase.from("recipes").select("*").eq("id", params.id).single()

      if (error) {
        console.error("Error fetching recipe:", error)
      } else {
        setRecipe(data)
      }
    }

    fetchRecipe()
  }, [params.id])

  if (!recipe) return <div>Cargando...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Editar Receta</h1>
      <RecipeForm recipe={recipe} />
    </div>
  )
}

