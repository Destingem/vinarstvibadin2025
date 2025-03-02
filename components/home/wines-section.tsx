"use client"
import React, { useState } from "react" // Přidán import Reactu
import { Button } from "@/components/ui/button"
import { Wine } from "@/types"
import { WineTypeDisplay } from "./wine-type-display"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface WinesSectionProps {
  title: string
  subtitle: string
  cta: string
  wines: Wine[]
}

export function WinesSection({ title, subtitle, cta, wines }: WinesSectionProps) {
  // State pro aktuální typ vína
  const [activeType, setActiveType] = useState<"all" | "bile" | "ruzove" | "cervene">("all")

  // Funkce pro získání počtu vín podle typu
  const getWineCount = (type: "all" | "bile" | "ruzove" | "cervene") => {
    if (type === "all") return wines.length;
    return wines.filter(wine => wine.type === type).length;
  }

  return (
    <section id="vina" className="scroll-mt-16 py-24 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="mt-16">
          {/* Desktop přepínač (tablet a větší) */}
          <div className="hidden md:flex justify-center mb-8">
            <div className="inline-flex rounded-md p-1 bg-muted border">
              <Button 
                variant={activeType === "all" ? "default" : "ghost"}
                onClick={() => setActiveType("all")}
                className="rounded-md hover:bg-background/80"
              >
                Všechna vína ({getWineCount("all")})
              </Button>
              <Button 
                variant={activeType === "bile" ? "default" : "ghost"}
                onClick={() => setActiveType("bile")}
                className="rounded-md hover:bg-background/80"
              >
                Bílá vína ({getWineCount("bile")})
              </Button>
              <Button 
                variant={activeType === "ruzove" ? "default" : "ghost"}
                onClick={() => setActiveType("ruzove")}
                className="rounded-md hover:bg-background/80"
              >
                Růžová vína ({getWineCount("ruzove")})
              </Button>
              <Button 
                variant={activeType === "cervene" ? "default" : "ghost"}
                onClick={() => setActiveType("cervene")}
                className="rounded-md hover:bg-background/80"
              >
                Červená vína ({getWineCount("cervene")})
              </Button>
            </div>
          </div>

          {/* Mobilní přepínač (pouze pro mobilní zařízení) */}
          <div className="md:hidden flex justify-center mb-8">
            <Select value={activeType} onValueChange={(value: "all" | "bile" | "ruzove" | "cervene") => setActiveType(value)}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Vyberte typ vína" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechna vína ({getWineCount("all")})</SelectItem>
                <SelectItem value="bile">Bílá vína ({getWineCount("bile")})</SelectItem>
                <SelectItem value="ruzove">Růžová vína ({getWineCount("ruzove")})</SelectItem>
                <SelectItem value="cervene">Červená vína ({getWineCount("cervene")})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Zobrazení vín podle vybraného typu */}
          <div className="mt-6">
            {activeType === "all" && (
              <WineTypeDisplay 
                wines={wines}
                type="all"
                bgClass="bg-gradient-to-tr from-yellow-100/50 via-pink-100/50 to-red-100/50"
                secondaryBgClass="bg-gradient-to-bl from-yellow-100/30 via-pink-100/30 to-red-100/30"
              />
            )}
            {activeType === "bile" && (
              <WineTypeDisplay 
                wines={wines}
                type="bile"
                bgClass="bg-gradient-to-br from-white-100 to-white-50/80"
                secondaryBgClass="bg-yellow-50"
              />
            )}
            {activeType === "ruzove" && (
              <WineTypeDisplay 
                wines={wines}
                type="ruzove"
                bgClass="bg-gradient-to-bl from-pink-100/70 to-pink-50/60"
                secondaryBgClass="bg-pink-100/50"
              />
            )}
            {activeType === "cervene" && (
              <WineTypeDisplay 
                wines={wines}
                type="cervene"
                bgClass="bg-gradient-to-bl from-red-100/70 to-red-50/60"
                secondaryBgClass="bg-red-100/50"
              />
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" variant="outline" asChild>
            <a href="#kontakt">{cta}</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
