"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// Import recipes data
import recipesData from "@/data/recipes.json"

export default function SeedDatabase() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const seedDatabase = async () => {
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      // Llamar a la función RPC para crear la tabla
      const { error: createTableError } = await supabase.rpc("create_recipes_table")

      if (createTableError) throw createTableError

      // Verificar si ya existen datos en la tabla
      const { data: existingData, error: checkError } = await supabase.from("recipes").select("id").limit(1)

      if (checkError) throw checkError

      // Si no hay datos, insertamos las recetas
      if (existingData && existingData.length === 0) {
        const { error: insertError } = await supabase.from("recipes").insert(recipesData)

        if (insertError) throw insertError

        setSuccess(true)
      } else {
        setSuccess(true)
        console.log("La tabla ya contiene datos. No se insertaron nuevas recetas.")
      }
    } catch (err) {
      console.error("Error seeding database:", err)
      setError(err.message || "Error al inicializar la base de datos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={seedDatabase} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Inicializando base de datos...
          </>
        ) : (
          "Inicializar base de datos con recetas"
        )}
      </Button>

      {success && (
        <Alert className="bg-green-50 border-green-500">
          <AlertTitle>¡Éxito!</AlertTitle>
          <AlertDescription>La base de datos ha sido inicializada correctamente con las recetas.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-500">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

