import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"

// Revalidace cache pro specifikovanou cestu
export async function GET(request: NextRequest) {
  try {
    // Extrahujeme cestu k revalidaci z query parametrů
    const path = request.nextUrl.searchParams.get("path") || "/"
    
    // Revalidace cesty
    revalidatePath(path)
    
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path
    })
  } catch (error) {
    return NextResponse.json({
      revalidated: false,
      now: Date.now(),
      error: "Chyba při revalidaci"
    })
  }
}

// POST - bezpečnější endpoint vyžadující autentizaci
export async function POST(request: Request) {
  try {
    // Ověření administrátorského přístupu
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: "Neautorizovaný přístup" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const path = body?.path || "/"
    
    // Revalidace cesty
    revalidatePath(path)
    
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path
    })
  } catch (error) {
    return NextResponse.json({
      revalidated: false,
      now: Date.now(),
      error: "Chyba při revalidaci"
    })
  }
}
