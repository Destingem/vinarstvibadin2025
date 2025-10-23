import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const dataFilePath = path.join(process.cwd(), "data", "news.json")

// Zajistíme existenci adresáře a souboru
async function ensureDataFile() {
  const dir = path.join(process.cwd(), "data")
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }

  try {
    await fs.access(dataFilePath)
  } catch {
    // Vytvoříme výchozí data
    const defaultData = [
      {
        id: "1",
        date: "10. 4. 2023",
        title: "Jarní otevřené sklepy 2023",
        content: "Zveme vás na tradiční jarní otevřené sklepy, které se konají 15. a 16. dubna 2023. Ochutnáte nové ročníky našich vín a dozvíte se více o naší práci ve vinicích.",
        imageUrl: "/vineyard-event.jpg",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        date: "5. 3. 2023",
        title: "Nová vína v nabídce",
        content: "Do naší nabídky jsme nově zařadili Rulandské šedé 2022 a Pálavou 2022. Vína jsou k dispozici v našem vinném sklepě.",
        imageUrl: "/new-wines.jpg",
        createdAt: new Date().toISOString()
      },
      {
        id: "3",
        date: "18. 2. 2023",
        title: "Ocenění na výstavě vín",
        content: "Náš Tramín červený 2021 získal zlatou medaili na regionální výstavě vín v Dolních Kounicích. Děkujeme za podporu!",
        imageUrl: "/wine-awards.jpg",
        createdAt: new Date().toISOString()
      }
    ]
    await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2), "utf8")
  }
}

// GET - Získání všech aktualit
export async function GET() {
  try {
    await ensureDataFile()
    
    const data = await fs.readFile(dataFilePath, "utf8")
    // Vrátíme seřazené od nejnovějších
    const news = JSON.parse(data).sort((a: { createdAt: string }, b: { createdAt: string }) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return NextResponse.json(news)
  } catch {
    return NextResponse.json({ error: "Chyba při načítání aktualit" }, { status: 500 })
  }
}

// POST - Přidání nové aktuality
export async function POST(request: Request) {
  try {
    // Ověření přihlášení administrátora
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Neautorizovaný přístup" }, { status: 401 })
    }

    await ensureDataFile()
    
    const data = await fs.readFile(dataFilePath, "utf8")
    const news = JSON.parse(data)
    
    const newItem = await request.json()
    const id = uuidv4()
    
    const newsItemToAdd = {
      ...newItem,
      id,
      createdAt: new Date().toISOString()
    }
    
    news.push(newsItemToAdd)
    
    await fs.writeFile(dataFilePath, JSON.stringify(news, null, 2), "utf8")
    
    // Revalidace hlavní stránky a stránky aktualit
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:2456'
      await fetch(`${baseUrl}/api/revalidate?path=/`)
      await fetch(`${baseUrl}/api/revalidate?path=/aktuality`)
      console.log('[NEWS] Pages revalidated successfully')
    } catch (error) {
      console.error("Chyba při revalidaci:", error)
    }
    
    return NextResponse.json(newsItemToAdd)
  } catch {
    return NextResponse.json({ error: "Chyba při přidávání aktuality" }, { status: 500 })
  }
}
