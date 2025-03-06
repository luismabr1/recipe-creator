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
    padding: 30,
    fontFamily: "Roboto",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 20,
    textAlign: "center",
    color: "#1e40af",
  },
  section: {
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 8,
    color: "#374151",
    backgroundColor: "#f3f4f6",
    padding: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    color: "#4b5563",
  },
  ingredientsTable: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    padding: 8,
  },
  tableCell: {
    fontSize: 12,
    width: "70%",
  },
  tableCellAmount: {
    fontSize: 12,
    width: "30%",
    textAlign: "right",
  },
  procedimiento: {
    fontSize: 12,
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#9ca3af",
  },
})

// Documento PDF para una receta individual
const RecipeDetailDocument = ({ recipe }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{recipe.preparacion}</Text>

      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {recipe.vida_util && (
            <View style={{ width: "48%" }}>
              <Text style={styles.subtitle}>Vida Útil</Text>
              <Text style={styles.text}>{recipe.vida_util}</Text>
            </View>
          )}

          {recipe.rendimiento && (
            <View style={{ width: "48%" }}>
              <Text style={styles.subtitle}>Rendimiento</Text>
              <Text style={styles.text}>{recipe.rendimiento}</Text>
            </View>
          )}
        </View>

        {recipe.vajilla && (
          <>
            <Text style={styles.subtitle}>Vajilla</Text>
            <Text style={styles.text}>{recipe.vajilla}</Text>
          </>
        )}
      </View>

      {Object.keys(recipe.ingredientes).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Ingredientes</Text>
          <View style={styles.ingredientsTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCell}>Ingrediente</Text>
              <Text style={styles.tableCellAmount}>Cantidad</Text>
            </View>
            {Object.entries(recipe.ingredientes).map(([nombre, cantidad], index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{nombre}</Text>
                <Text style={styles.tableCellAmount}>{cantidad}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {recipe.procedimiento && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Procedimiento</Text>
          <Text style={styles.procedimiento}>{recipe.procedimiento}</Text>
        </View>
      )}

      <Text style={styles.footer}>Receta generada desde Gestor de Recetas</Text>
    </Page>
  </Document>
)

export default function RecipeDetailPDFButton({ recipe }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Button variant="outline" disabled>
        <FileDown className="mr-2 h-4 w-4" />
        Preparando PDF...
      </Button>
    )
  }

  return (
    <PDFDownloadLink
      document={<RecipeDetailDocument recipe={recipe} />}
      fileName={`receta-${recipe.preparacion.toLowerCase().replace(/\s+/g, "-")}.pdf`}
    >
      {({ loading }) => (
        <Button variant="outline" disabled={loading}>
          <FileDown className="mr-2 h-4 w-4" />
          {loading ? "Generando PDF..." : "Descargar PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  )
}

