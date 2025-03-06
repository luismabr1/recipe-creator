"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

const RecipeContext = createContext()

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refreshRecipes = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("recipes").select("*").order("preparacion", { ascending: true })

      if (error) {
        throw error
      }

      setRecipes(data || [])
    } catch (err) {
      console.error("Error fetching recipes:", err)
      setError("Error al cargar las recetas")
    } finally {
      setLoading(false)
    }
  }, [])

  const addRecipe = async (recipe) => {
    try {
      const { error } = await supabase.from("recipes").insert([recipe])

      if (error) {
        throw error
      }

      await refreshRecipes()
    } catch (err) {
      console.error("Error adding recipe:", err)
      setError("Error al añadir la receta")
    }
  }

  const updateRecipe = async (id, recipe) => {
    try {
      const { error } = await supabase.from("recipes").update(recipe).eq("id", id)

      if (error) {
        throw error
      }

      setRecipes(recipes.map((r) => (r.id === id ? { ...r, ...recipe } : r)))
    } catch (err) {
      console.error("Error updating recipe:", err)
      setError("Error al actualizar la receta")
    }
  }

  const deleteRecipe = async (id) => {
    try {
      const { error } = await supabase.from("recipes").delete().eq("id", id)

      if (error) {
        throw error
      }

      setRecipes(recipes.filter((r) => r.id !== id))
    } catch (err) {
      console.error("Error deleting recipe:", err)
      setError("Error al eliminar la receta")
    }
  }

  useEffect(() => {
    refreshRecipes()
  }, [refreshRecipes])

  const value = {
    recipes,
    loading,
    error,
    refreshRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  }

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
}

export function useRecipes() {
  const context = useContext(RecipeContext)
  if (context === undefined) {
    throw new Error("useRecipes must be used within a RecipeProvider")
  }
  return context
}

