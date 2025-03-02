import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { v4 as uuidv4 } from "uuid"
import { getServerSession } from "next-auth/next"

// Podporované typy obrázků
const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

// Maximální velikost souboru (5MB)
const MAX_SIZE = 10 * 1024 ** 2

export async function POST(req: NextRequest) {
  try {
    // Ověření přihlášení administrátora 
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Neautorizovaný přístup" }, { status: 401 })
    }

    // Parsování multipart form data
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Žádný soubor nebyl nahrán" }, { status: 400 })
    }

    // Validace typu a velikosti souboru
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Nepodporovaný formát souboru. Povolené formáty: JPG, PNG, WEBP" }, { status: 400 })
    }
    
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Soubor je příliš velký. Maximální velikost je 5MB" }, { status: 400 })
    }

    // Generování jedinečného názvu souboru
    const fileExtension = file.name.split(".").pop() || ""
    const uniqueFilename = `${uuidv4()}.${fileExtension}`
    
    // Vytvoření adresáře pro uložení obrázků, pokud neexistuje
    const uploadDir = path.join(process.cwd(), "public/uploads")
    try {
      await fs.access(uploadDir)
    } catch (error) {
      await fs.mkdir(uploadDir, { recursive: true })
    }
    
    // Cesta k souboru
    const filePath = path.join(uploadDir, uniqueFilename)
    
    // Převedení File na ArrayBuffer
    const buffer = await file.arrayBuffer()
    
    // Zápis souboru
    await fs.writeFile(filePath, Buffer.from(buffer))
    
    // Vrácíme URL uloženého obrázku
    const fileUrl = `/uploads/${uniqueFilename}`
    
    return NextResponse.json({ 
      url: fileUrl,
      message: "Soubor byl úspěšně nahrán" 
    })

  } catch (error) {
    console.error("[API] Upload error:", error)
    return NextResponse.json({ error: "Chyba při nahrávání souboru" }, { status: 500 })
  }
}
