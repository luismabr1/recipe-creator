"use client"

import { useEffect, useState } from "react"
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

// Registrar fuentes para el PDF
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
  ],
})

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 20,
    fontFamily: "Roboto",
  },
  section: {
    width: "50%",
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 10,
    textAlign: "center",
    color: "#1e40af",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 8,
    marginBottom: 4,
    color: "#374151",
  },
  text: {
    fontSize: 10,
    marginBottom: 6,
    color: "#4b5563",
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  ingredientName: {
    fontSize: 10,
    width: "70%",
  },
  ingredientAmount: {
    fontSize: 10,
    width: "30%",
    textAlign: "right",
  },
  procedimiento: {
    fontSize: 10,
    marginTop: 4,
    lineHeight: 1.4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginVertical: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
})

// Componente para renderizar una receta en el PDF
const RecipeItem = ({ recipe }) => (
  <View style={styles.section}>
    <Text style={styles.title}>{recipe.preparacion}</Text>

    {recipe.vida_util && (
      <>
        <Text style={styles.subtitle}>Vida Útil:</Text>
        <Text style={styles.text}>{recipe.vida_util}</Text>
      </>
    )}

    {recipe.rendimiento && (
      <>
        <Text style={styles.subtitle}>Rendimiento:</Text>
        <Text style={styles.text}>{recipe.rendimiento}</Text>
      </>
    )}

    {recipe.vajilla && (
      <>
        <Text style={styles.subtitle}>Vajilla:</Text>
        <Text style={styles.text}>{recipe.vajilla}</Text>
      </>
    )}

    {Object.keys(recipe.ingredientes).length > 0 && (
      <>
        <Text style={styles.subtitle}>Ingredientes:</Text>
        {Object.entries(recipe.ingredientes).map(([nombre, cantidad], index) => (
          <View key={index} style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>• {nombre}</Text>
            <Text style={styles.ingredientAmount}>{cantidad}</Text>
          </View>
        ))}
      </>
    )}

    {recipe.procedimiento && (
      <>
        <Text style={styles.subtitle}>Procedimiento:</Text>
        <Text style={styles.procedimiento}>{recipe.procedimiento}</Text>
      </>
    )}

    <View style={styles.divider} />
  </View>
)

// Documento PDF con recetas
const RecipeDocument = ({ recipes }) => {
  // Agrupar recetas de dos en dos para cada página
  const recipePages = []
  for (let i = 0; i < recipes.length; i += 2) {
    recipePages.push(recipes.slice(i, i + 2))
  }

  return (
    <Document>
      {recipePages.map((pageRecipes, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {pageRecipes.map((recipe, index) => (
            <RecipeItem key={recipe.id || index} recipe={recipe} />
          ))}
          {pageRecipes.length === 1 && <View style={styles.section} />}
          <Text style={styles.footer}>
            Recetario - Página {pageIndex + 1} de {recipePages.length}
          </Text>
        </Page>
      ))}
    </Document>
  )
}

export default function RecipePDFButton({ recipes }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Button disabled>
        <FileDown className="mr-2 h-4 w-4" />
        Preparando PDF...
      </Button>
    )
  }

  return (
    <PDFDownloadLink document={<RecipeDocument recipes={recipes} />} fileName="recetas.pdf">
      {({ loading }) => (
        <Button disabled={loading}>
          <FileDown className="mr-2 h-4 w-4" />
          {loading ? "Generando PDF..." : "Descargar Recetas en PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  )
}

