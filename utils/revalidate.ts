import { revalidatePath } from "next/cache"

export async function revalidateHomePage() {
  'use server'
  // Revalidace hlavní stránky při změně dat
  revalidatePath("/")
}
