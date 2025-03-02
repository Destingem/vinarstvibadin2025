import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { getServerSession } from "next-auth/next"

const dataFilePath = path.join(process.cwd(), "data", "wines.json")

// GET - Získání konkrétního vína podle ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await fs.readFile(dataFilePath, "utf8")
    const wines = JSON.parse(data)
    
    const wine = wines.find((wine: any) => wine.id === params.id)
    
    if (!wine) {
      return NextResponse.json({ error: "Víno nebylo nalezeno" }, { status: 404 })
    }
    
    return NextResponse.json(wine)
  } catch (error) {
    return NextResponse.json({ error: "Chyba při načítání vína" }, { status: 500 })
  }
}

// PUT - Aktualizace vína
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ověření přihlášení administrátora
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Neautorizovaný přístup" }, { status: 401 })
    }
    
    const data = await fs.readFile(dataFilePath, "utf8")
    const wines = JSON.parse(data)
    
    const wineIndex = wines.findIndex((wine: any) => wine.id === params.id)
    
    if (wineIndex === -1) {
      return NextResponse.json({ error: "Víno nebylo nalezeno" }, { status: 404 })
    }
    
    const updatedWine = await request.json()
    
    // Zachováme ID a datum vytvoření, aktualizujeme zbytek
    wines[wineIndex] = {
      ...updatedWine,
      id: params.id,
      createdAt: wines[wineIndex].createdAt,
      updatedAt: new Date().toISOString()
    }
    
    await fs.writeFile(dataFilePath, JSON.stringify(wines, null, 2), "utf8")
    
    return NextResponse.json(wines[wineIndex])
  } catch (error) {
    return NextResponse.json({ error: "Chyba při aktualizaci vína" }, { status: 500 })
  }
}

// DELETE - Smazání vína
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ověření přihlášení administrátora
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Neautorizovaný přístup" }, { status: 401 })
    }
    
    const data = await fs.readFile(dataFilePath, "utf8")
    const wines = JSON.parse(data)
    
    const filteredWines = wines.filter((wine: any) => wine.id !== params.id)
    
    if (filteredWines.length === wines.length) {
      return NextResponse.json({ error: "Víno nebylo nalezeno" }, { status: 404 })
    }
    
    await fs.writeFile(dataFilePath, JSON.stringify(filteredWines, null, 2), "utf8")
    
    return NextResponse.json({ message: "Víno bylo úspěšně odstraněno" })
  } catch (error) {
    return NextResponse.json({ error: "Chyba při odstraňování vína" }, { status: 500 })
  }
}
