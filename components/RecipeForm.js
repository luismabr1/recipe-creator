"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRecipes } from "../context/RecipeContext"

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
        <label className="block mb-1">Preparación:</label>
        <input
          type="text"
          name="preparacion"
          value={formData.preparacion}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1">Vajilla:</label>
        <input
          type="text"
          name="vajilla"
          value={formData.vajilla}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1">Vida útil:</label>
        <input
          type="text"
          name="vida_util"
          value={formData.vida_util}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1">Ingredientes:</label>
        {Object.entries(formData.ingredientes).map(([nombre, cantidad], index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              name="nombre"
              value={nombre}
              onChange={(e) => handleIngredientChange(e, index)}
              placeholder="Nombre"
              className="w-1/2 p-2 border rounded-l"
            />
            <input
              type="text"
              name="cantidad"
              value={cantidad}
              onChange={(e) => handleIngredientChange(e, index)}
              placeholder="Cantidad"
              className="w-1/2 p-2 border rounded-r"
            />
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
        <button type="button" onClick={addIngredient} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
          Añadir Ingrediente
        </button>
      </div>
      <div>
        <label className="block mb-1">Rendimiento:</label>
        <input
          type="text"
          name="rendimiento"
          value={formData.rendimiento}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1">Procedimiento:</label>
        <textarea
          name="procedimiento"
          value={formData.procedimiento}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="4"
        ></textarea>
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        {recipe ? "Actualizar Receta" : "Crear Receta"}
      </button>
    </form>
  )
}

