import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { getServerSession } from "next-auth/next"
import slugify from "slugify"

const dataFilePath = path.join(process.cwd(), "data", "news.json")

// GET - Získání konkrétní aktuality podle ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await fs.readFile(dataFilePath, "utf8")
    const news = JSON.parse(data)
    
    const newsItem = news.find((item: any) => item.id === params.id)
    
    if (!newsItem) {
      return NextResponse.json({ error: "Aktualita nebyla nalezena" }, { status: 404 })
    }
    
    return NextResponse.json(newsItem)
  } catch (error) {
    return NextResponse.json({ error: "Chyba při načítání aktuality" }, { status: 500 })
  }
}

// PUT - Aktualizace aktuality
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
    const news = JSON.parse(data)
    
    const itemIndex = news.findIndex((item: any) => item.id === params.id)
    
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Aktualita nebyla nalezena" }, { status: 404 })
    }
    
    const updatedItem = await request.json()
    
    // Zachováme ID a datum vytvoření, aktualizujeme zbytek
    news[itemIndex] = {
      ...updatedItem,
      id: params.id,
      createdAt: news[itemIndex].createdAt,
      updatedAt: new Date().toISOString()
    }
    
    await fs.writeFile(dataFilePath, JSON.stringify(news, null, 2), "utf8")
    
    return NextResponse.json(news[itemIndex])
  } catch (error) {
    return NextResponse.json({ error: "Chyba při aktualizaci aktuality" }, { status: 500 })
  }
}

// DELETE - Smazání aktuality
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
    const news = JSON.parse(data)
    
    const filteredNews = news.filter((item: any) => item.id !== params.id)
    
    if (filteredNews.length === news.length) {
      return NextResponse.json({ error: "Aktualita nebyla nalezena" }, { status: 404 })
    }
    
    await fs.writeFile(dataFilePath, JSON.stringify(filteredNews, null, 2), "utf8")
    
    return NextResponse.json({ message: "Aktualita byla úspěšně odstraněna" })
  } catch (error) {
    return NextResponse.json({ error: "Chyba při odstraňování aktuality" }, { status: 500 })
  }
}
