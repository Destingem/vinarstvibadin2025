import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth/next";

const dataFilePath = path.join(process.cwd(), "data", "wines.json");

// Zajistíme existenci adresáře a souboru
async function ensureDataFile() {
  const dir = path.join(process.cwd(), "data");
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  try {
    await fs.access(dataFilePath);
  } catch {
    // Vytvoříme výchozí data
    const defaultData = [
      {
        id: "1",
        name: "Tramín červený",
        year: "2021",
        description: "Ve vůni i chuti, tohoto vydařeného Tramínu, najdeme tóny citrusů, čajové růže a liči. Barva zlatavá, vyvážený poměr kyseliny a zbytkového cukru vytváří z tohoto vína jedinečný zážitek pro všechny milovníky aromatických odrůd vín",
        price: "120 Kč",
        image: "/placeholder.svg?height=400&width=300",
        type: "bile",
        attributes: ["polosuché", "aromatické"],
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Frankovka",
        year: "2018",
        description: "Víno má jasně granátovou barvu s fialovými odlesky. Vůně je ovocná s aroma drobného zahradního ovoce, jako jsou například višně a nebo černý bez.",
        price: "95 Kč",
        image: "/placeholder.svg?height=400&width=300",
        type: "cervene",
        attributes: ["suché", "ovocné"],
        createdAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "Zweigeltrebe",
        year: "2018",
        description: "Víno granátové barvy s vůní červeného ovoce. V chuti dominují alkoholizované višně. Plné harmonické víno s delší dochutí.",
        price: "95 Kč",
        image: "/placeholder.svg?height=400&width=300",
        type: "cervene",
        attributes: ["suché", "plné"],
        createdAt: new Date().toISOString()
      }
    ];
    await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2), "utf8");
  }
}

// GET - Získání všech vín
export async function GET() {
  try {
    await ensureDataFile();
    const data = await fs.readFile(dataFilePath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: "Chyba při načítání vín" }, { status: 500 });
  }
}

// POST - Přidání nového vína
export async function POST(request: Request) {
  try {
    // Ověření přihlášení administrátora
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Neautorizovaný přístup" }, { status: 401 })
    }

    await ensureDataFile()
    
    const data = await fs.readFile(dataFilePath, "utf8")
    const wines = JSON.parse(data)
    
    const newWine = await request.json()
    const id = uuidv4()
    
    const wineToAdd = {
      ...newWine,
      id,
      createdAt: new Date().toISOString()
    }
    
    wines.push(wineToAdd)
    
    await fs.writeFile(dataFilePath, JSON.stringify(wines, null, 2), "utf8")
    
    // Revalidace hlavní stránky
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/revalidate?path=/`)
    } catch (error) {
      console.error("Chyba při revalidaci:", error)
    }
    
    return NextResponse.json(wineToAdd)
  } catch (error) {
    return NextResponse.json({ error: "Chyba při přidávání vína" }, { status: 500 })
  }
}
