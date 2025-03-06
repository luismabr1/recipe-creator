import RecipeList from "@/components/recipe-list"
import SeedDatabase from "@/scripts/seed-database"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Gestor de Recetas</h1>
        <p className="text-gray-500">Administra tus recetas de forma sencilla</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inicialización de la Base de Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-500">
            Si es la primera vez que usas la aplicación, haz clic en el botón para inicializar la base de datos con las
            recetas.
          </p>
          <SeedDatabase />
        </CardContent>
      </Card>

      <RecipeList />
    </div>
  )
}

