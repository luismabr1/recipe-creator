import "./globals.css"
import { RecipeProvider } from "@/context/RecipeContext"

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <RecipeProvider>
          <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto py-8 px-4">{children}</main>
          </div>
        </RecipeProvider>
      </body>
    </html>
  )
}

