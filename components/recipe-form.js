"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRecipes } from "@/context/RecipeContext"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function RecipeForm({ recipe }) {
  const router = useRouter()
  const { addRecipe, updateRecipe } = useRecipes()
  const [formData, setFormData] = useState({
    preparacion: "",
    vajilla: "",
    vida_util: "",
    ingredientes: {},
    rendimiento: "",
    procedimiento: "",
  })

  useEffect(() => {
    if (recipe) {
      setFormData(recipe)
    }
  }, [recipe])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleIngredientChange = (e, index) => {
    const { name, value } = e.target
    const updatedIngredientes = { ...formData.ingredientes }
    const keys = Object.keys(updatedIngredientes)
    if (name === "nombre") {
      const oldKey = keys[index]
      const oldValue = updatedIngredientes[oldKey]
      delete updatedIngredientes[oldKey]
      updatedIngredientes[value] = oldValue
    } else {
      updatedIngredientes[keys[index]] = value
    }
    setFormData((prev) => ({ ...prev, ingredientes: updatedIngredientes }))
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredientes: { ...prev.ingredientes, "": "" },
    }))
  }

  const removeIngredient = (index) => {
    const updatedIngredientes = { ...formData.ingredientes }
    const keys = Object.keys(updatedIngredientes)
    delete updatedIngredientes[keys[index]]
    setFormData((prev) => ({ ...prev, ingredientes: updatedIngredientes }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (recipe) {
      await updateRecipe(recipe.id, formData)
    } else {
      await addRecipe(formData)
    }
    router.push("/")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">Preparación:</label>
        <Input
          type="text"
          name="preparacion"
          value={formData.preparacion}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">Vajilla:</label>
        <Input type="text" name="vajilla" value={formData.vajilla} onChange={handleChange} className="w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">Vida útil:</label>
        <Input type="text" name="vida_util" value={formData.vida_util} onChange={handleChange} className="w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">Ingredientes:</label>
        {Object.entries(formData.ingredientes).map(([nombre, cantidad], index) => (
          <div key={index} className="flex mb-2 space-x-2">
            <Input
              type="text"
              name="nombre"
              value={nombre}
              onChange={(e) => handleIngredientChange(e, index)}
              placeholder="Nombre"
              className="w-1/2"
            />
            <Input
              type="text"
              name="cantidad"
              value={cantidad}
              onChange={(e) => handleIngredientChange(e, index)}
              placeholder="Cantidad"
              className="w-1/2"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => removeIngredient(index)}>
              Eliminar
            </Button>
          </div>
        ))}
        <Button type="button" size="sm" onClick={addIngredient}>
          Añadir Ingrediente
        </Button>
      </div>
      <div>
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">Rendimiento:</label>
        <Input type="text" name="rendimiento" value={formData.rendimiento} onChange={handleChange} className="w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
          Procedimiento:
        </label>
        <Textarea
          name="procedimiento"
          value={formData.procedimiento}
          onChange={handleChange}
          className="w-full"
          rows={4}
        />
      </div>
      <Button type="submit">{recipe ? "Actualizar Receta" : "Crear Receta"}</Button>
    </form>
  )
}

