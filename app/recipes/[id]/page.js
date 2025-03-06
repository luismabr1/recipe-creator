"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import RecipeForm from "@/components/recipe-form"
import RecipeDetailPDFButton from "@/components/recipe-detail-pdf"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditRecipePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data, error } = await supabase.from("recipes").select("*").eq("id", id).single()

        if (error) {
          throw error
        }

        setRecipe(data)
      } catch (err) {
        console.error("Error fetching recipe:", err)
        setError("Error al cargar la receta")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  if (loading) {
    return <div className="text-center py-10">Cargando receta...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  if (!recipe) {
    return <div className="text-center py-10">Receta no encontrada</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la lista
        </Button>
        {recipe && <RecipeDetailPDFButton recipe={recipe} />}
      </div>
      <RecipeForm recipe={recipe} />
    </div>
  )
}



