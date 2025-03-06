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
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 12,
  },
  titlePage: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  manualTitle: {
    fontSize: 24,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 20,
  },
  cocinaTitle: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: "center",
  },
  indexTitle: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginTop: 20,
    marginBottom: 10,
  },
  indexItem: {
    fontSize: 12,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  recipeSection: {
    marginBottom: 20,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 8,
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    marginBottom: 6,
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  ingredientName: {
    fontSize: 12,
    width: "70%",
  },
  ingredientAmount: {
    fontSize: 12,
    width: "30%",
    textAlign: "right",
  },
  procedimiento: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
})

// Componente para renderizar una receta en el PDF
const RecipeItem = ({ recipe }) => (
  <View style={styles.recipeSection}>
    <Text style={styles.recipeTitle}>{recipe.preparacion}</Text>

    {recipe.vajilla && (
      <>
        <Text style={styles.subtitle}>Vajilla:</Text>
        <Text style={styles.text}>{recipe.vajilla}</Text>
      </>
    )}

    {recipe.vida_util && (
      <>
        <Text style={styles.subtitle}>Vida Útil:</Text>
        <Text style={styles.text}>{recipe.vida_util}</Text>
      </>
    )}

    {Object.keys(recipe.ingredientes).length > 0 && (
      <>
        <Text style={styles.subtitle}>Ingredientes:</Text>
        {Object.entries(recipe.ingredientes).map(([nombre, cantidad], index) => (
          <View key={index} style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>{nombre}</Text>
            <Text style={styles.ingredientAmount}>{cantidad}</Text>
          </View>
        ))}
      </>
    )}

    {recipe.rendimiento && (
      <>
        <Text style={styles.subtitle}>Rendimiento:</Text>
        <Text style={styles.text}>{recipe.rendimiento}</Text>
      </>
    )}

    {recipe.procedimiento && (
      <>
        <Text style={styles.subtitle}>Procedimiento:</Text>
        <Text style={styles.procedimiento}>{recipe.procedimiento}</Text>
      </>
    )}
  </View>
)

// Documento PDF con recetas
const RecipeDocument = ({ recipes }) => {
  // Separar recetas y sub-recetas
  const mainRecipes = [
    "ALITAS DE POLLO", "BURGER A LA TRUFFE", "BURGER LE BLEU", "BURGER LE BLEU MENÚ EJECUTIVO",
    "BURGER MINI", "CHICHARRÓN CABRON", "DEGUSTACIÓN DE TACOS", "ESCARGOTS SOBRE TUÉTANO",
    "GUACAMOLE POWER", "LOMITO CAFE PARIS", "LOMITO CAFE PARIS MENÚ EJECUTIVO", "NACHOS MACHOS DE BIRRIA",
    "NACHOS MACHOS DE CARNITAS", "NACHOS MACHOS DE CHILI CON CARNE", "NACHOS MACHOS DE POLLO ASADO",
    "NY ANGUS", "PARRILLA MIXTA", "PAPAS FRITAS", "PAPAS FRITAS TRUFADAS", "PESCA BLANCA MENÚ EJECUTIVO",
    "POLLO MEDITERRANEO", "POLLO MEDITERRANEO MENÚ EJECUTIVO", "PULPO A LA BRASA", "PURÉ DE BATATA",
    "PURÉ DE PAPA", "RIBEYE", "RISOTTO PORCINI", "SALMÓN A LA PLANCHA", "SALSA BERNESA",
    "SALSA CAFÉ PARIS", "SALSA PIMIENTA", "SOPA DE CEBOLLA GRATINADA", "SOPA DE CEBOLLA MENÚ EJECUTIVO",
    "TACO AL PASTOR", "TACO DE BIRRIA", "TACO DE CARNE ASADA", "TACO DE POLLO ASADO", "TENDERS DE POLLO"
  ]

  const subRecipesList = [
    "ADEREZO TZATZIKI", "ALIOLI TRUFADO", "ALITAS DE POLLO MARINADAS", "ARROZ ARBORIO PRECOCIDO",
    "BASE BERNESA", "BASE PIMIENTA", "BIRRIA", "CALDO DE SOPA DE CEBOLLA", "CALDO DE BIRRIA",
    "CARNE ASADA", "CARNE DE PARRILLA", "CARNITAS", "CEBOLLA A LA PLANCHA", "CEBOLLA CARAMELIZADA",
    "CEBOLLA CROCANTE", "CERDO AL PASTOR", "CHILI CON CARNE", "CREMOSO DE GRANA PADANO",
    "CROQUETA DE CHORIZO Y PAPA", "ENSALADA COLESLAW", "GUACAMOLE BASE", "HONGOS SALTEADOS",
    "MANTEQUILLA AROMÁTICA", "MANTEQUILLA DE AJO PEREJIL", "MANTEQUILLA MAITRE D’HOTEL",
    "MAYO-CHIPOTLE", "MAYO-CILANTRO", "MIEL-CHIPOTLE", "MOJO DE AJO", "PAN DE SOPA DE CEBOLLA",
    "PANCETA CRUJIENTE", "PAPITAS COLOMBIANAS", "PANGRATTATO", "PICO DE GALLO", "POLLO ASADO",
    "POLLO DE PARRILLA", "POLLO MEDITERRANEO MARINADO", "PORK BELLY PORCIONADO", "PURÉ DE BATATA",
    "PURÉ DE PAPA", "QUESO FUNDIDO", "SALSA BERNESA", "SALSA DE TEQUEÑOS", "SALSA DE TOMATE TATEMADO",
    "SALSA PIMIENTA", "SALSA ROMESCO", "SALSA VERDE", "SALSA VIERGE", "TOCINETA PRECOCIDA"
  ]

  // Filtrar recetas y sub-recetas de los datos proporcionados
  const recetas = recipes.filter(recipe => mainRecipes.includes(recipe.preparacion.toUpperCase()))
  const subRecetas = recipes.filter(recipe => subRecipesList.includes(recipe.preparacion.toUpperCase()))

  return (
    <Document>
      {/* Página de Título */}
      <Page size="A4" style={styles.page}>
        <View style={styles.titlePage}>
          <Text style={styles.manualTitle}>MANUAL DE PROCEDIMIENTOS</Text>
          <Text style={styles.cocinaTitle}>COCINA PB</Text>
        </View>
      </Page>

      {/* Página de Índice */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.indexTitle}>ÍNDICE</Text>

        <Text style={styles.sectionTitle}>RECETAS</Text>
        {mainRecipes.map((recipe, index) => (
          <Text key={index} style={styles.indexItem}>{recipe}</Text>
        ))}

        <Text style={styles.sectionTitle}>SUB-RECETAS</Text>
        {subRecipesList.map((recipe, index) => (
          <Text key={index} style={styles.indexItem}>{recipe}</Text>
        ))}

        <Text style={styles.footer}>Manual de Procedimientos - Cocina PB</Text>
      </Page>

      {/* Páginas de Recetas */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>RECETAS</Text>
        {recetas.map((recipe, index) => (
          <RecipeItem key={recipe.preparacion || index} recipe={recipe} />
        ))}
        <Text style={styles.footer}>Manual de Procedimientos - Cocina PB</Text>
      </Page>

      {/* Páginas de Sub-Recetas */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>SUB-RECETAS</Text>
        {subRecetas.map((recipe, index) => (
          <RecipeItem key={recipe.preparacion || index} recipe={recipe} />
        ))}
        <Text style={styles.footer}>Manual de Procedimientos - Cocina PB</Text>
      </Page>
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
    <PDFDownloadLink document={<RecipeDocument recipes={recipes} />} fileName="manual-procedimientos-cocina-pb.pdf">
      {({ loading }) => (
        <Button disabled={loading}>
          <FileDown className="mr-2 h-4 w-4" />
          {loading ? "Generando PDF..." : "Descargar Manual en PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  )
}