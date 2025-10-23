import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename
    
    // Zabránění directory traversal útokům
    if (filename.includes('..') || filename.includes('/')) {
      return new NextResponse('Invalid filename', { status: 400 })
    }
    
    // Cesta k souboru
    const filePath = path.resolve(process.cwd(), 'public', 'uploads', filename)
    
    // Kontrola zda soubor existuje
    try {
      await fs.access(filePath)
    } catch {
      return new NextResponse('Image not found', { status: 404 })
    }
    
    // Načtení souboru
    const fileBuffer = await fs.readFile(filePath)
    
    // Zjištění content type na základě přípony
    const ext = path.extname(filename).toLowerCase()
    const contentTypeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
    }
    const contentType = contentTypeMap[ext] || 'application/octet-stream'
    
    // Vrácení obrázku - převedení Buffer na Uint8Array
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('[IMAGE API] Error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
