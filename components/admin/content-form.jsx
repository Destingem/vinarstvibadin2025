"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Info, Trash2, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ContentForm({ initialContent }) {
  const [content, setContent] = useState({ ...initialContent })
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const { toast } = useToast()

  // Standardní funkce pro aktualizaci polí
  const updateField = (section, field, value) => {
    setContent((prevContent) => ({
      ...prevContent,
      [section]: {
        ...prevContent[section],
        [field]: value,
      },
    }))
  }

  // Pro vnořené objekty
  const updateNestedField = (section, parent, field, value) => {
    setContent((prevContent) => ({
      ...prevContent,
      [section]: {
        ...prevContent[section],
        [parent]: {
          ...prevContent[section][parent],
          [field]: value,
        },
      },
    }))
  }

  // Pro prvky časové osy (timeline)
  const updateTimelineItem = (index, field, value) => {
    setContent((prevContent) => {
      const newTimeline = [...prevContent.about.timeline];
      newTimeline[index] = {
        ...newTimeline[index],
        [field]: value
      };
      return {
        ...prevContent,
        about: {
          ...prevContent.about,
          timeline: newTimeline
        }
      };
    });
  }

  // Pro prvky features
  const updateFeatureItem = (index, field, value) => {
    setContent((prevContent) => {
      const newFeatures = [...prevContent.features];
      newFeatures[index] = {
        ...newFeatures[index],
        [field]: value
      };
      return {
        ...prevContent,
        features: newFeatures
      };
    });
  }

  // Přidání položky do časové osy
  const addTimelineItem = () => {
    setContent((prevContent) => ({
      ...prevContent,
      about: {
        ...prevContent.about,
        timeline: [
          ...prevContent.about.timeline, 
          { year: "", title: "", description: "" }
        ]
      }
    }))
  }

  // Odebrání položky z časové osy
  const removeTimelineItem = (index) => {
    setContent((prevContent) => ({
      ...prevContent,
      about: {
        ...prevContent.about,
        timeline: prevContent.about.timeline.filter((_, i) => i !== index)
      }
    }))
  }

  // Přidání feature
  const addFeature = () => {
    setContent((prevContent) => ({
      ...prevContent,
      features: [
        ...prevContent.features,
        { icon: "GrapeIcon", title: "", description: "" }
      ]
    }))
  }

  // Odebrání feature
  const removeFeature = (index) => {
    setContent((prevContent) => ({
      ...prevContent,
      features: prevContent.features.filter((_, i) => i !== index)
    }))
  }

  // Pomocná funkce pro formátování názvů polí
  const formatFieldName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .replace(/^\w/, c => c.toUpperCase())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      })

      if (!response.ok) {
        throw new Error("Nepodařilo se aktualizovat obsah")
      }

      toast({
        title: "Obsah byl aktualizován",
        description: "Změny byly úspěšně uloženy.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit změny. Zkuste to prosím znovu.",
      })
      console.error("Chyba při ukládání:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs 
        value={activeSection} 
        onValueChange={setActiveSection} 
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7">
          <TabsTrigger value="hero">Úvod</TabsTrigger>
          <TabsTrigger value="features">Výhody</TabsTrigger>
          <TabsTrigger value="about">O nás</TabsTrigger>
          <TabsTrigger value="news">Aktuality</TabsTrigger>
          <TabsTrigger value="wines">Vína</TabsTrigger>
          <TabsTrigger value="contact">Kontakt</TabsTrigger>
          <TabsTrigger value="popup">Popup</TabsTrigger>
        </TabsList>
        
        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Hlavní sekce</h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero-badge">Badge text</Label>
                  <Input
                    id="hero-badge"
                    value={content.hero.badge}
                    onChange={(e) => updateField("hero", "badge", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hero-title">Hlavní nadpis</Label>
                  <Input
                    id="hero-title"
                    value={content.hero.title}
                    onChange={(e) => updateField("hero", "title", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hero-subtitle">Podnadpis</Label>
                  <Textarea
                    id="hero-subtitle"
                    value={content.hero.subtitle}
                    onChange={(e) => updateField("hero", "subtitle", e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hero-button-primary">Text hlavního tlačítka</Label>
                    <Input
                      id="hero-button-primary"
                      value={content.hero.buttonPrimary}
                      onChange={(e) => updateField("hero", "buttonPrimary", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hero-button-secondary">Text druhého tlačítka</Label>
                    <Input
                      id="hero-button-secondary"
                      value={content.hero.buttonSecondary}
                      onChange={(e) => updateField("hero", "buttonSecondary", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Obrázek pozadí</Label>
                <ImageUploader
                  currentImage={content.hero.backgroundImage}
                  onImageUploaded={(url) => updateField("hero", "backgroundImage", url)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Features Section */}
        <TabsContent value="features" className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Výhody a benefity</h3>
              <Button 
                type="button"
                onClick={addFeature}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Přidat položku
              </Button>
            </div>

            <Alert variant="info">
              <Info className="h-4 w-4" />
              <AlertTitle>Tip</AlertTitle>
              <AlertDescription>
                Doporučujeme mít 3 položky, které se zobrazují v bílém boxu pod hlavním obrázkem.
              </AlertDescription>
            </Alert>

            {content.features.map((feature, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium mb-4">Položka {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      disabled={content.features.length <= 1}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Ikona</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={feature.icon}
                        onChange={(e) => updateFeatureItem(index, "icon", e.target.value)}
                      >
                        <option value="GrapeIcon">Hrozny</option>
                        <option value="WineIcon">Víno</option>
                        <option value="MapPinIcon">Místo</option>
                      </select>
                    </div>

                    <div>
                      <Label>Název</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateFeatureItem(index, "title", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Popis</Label>
                      <Textarea
                        value={feature.description}
                        onChange={(e) => updateFeatureItem(index, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* About Section - Timeline */}
        <TabsContent value="about" className="space-y-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Sekce "O nás"</h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="about-badge">Badge text</Label>
                  <Input
                    id="about-badge"
                    value={content.about.badge}
                    onChange={(e) => updateField("about", "badge", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="about-title">Nadpis sekce</Label>
                  <Input
                    id="about-title"
                    value={content.about.title}
                    onChange={(e) => updateField("about", "title", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="about-paragraph1">První odstavec</Label>
                  <Textarea
                    id="about-paragraph1"
                    value={content.about.paragraphs[0] || ""}
                    onChange={(e) => {
                      const newParagraphs = [...content.about.paragraphs];
                      newParagraphs[0] = e.target.value;
                      updateField("about", "paragraphs", newParagraphs);
                    }}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="about-paragraph2">Druhý odstavec</Label>
                  <Textarea
                    id="about-paragraph2"
                    value={content.about.paragraphs[1] || ""}
                    onChange={(e) => {
                      const newParagraphs = [...content.about.paragraphs];
                      newParagraphs[1] = e.target.value;
                      updateField("about", "paragraphs", newParagraphs);
                    }}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="about-cta">Text tlačítka</Label>
                  <Input
                    id="about-cta"
                    value={content.about.cta}
                    onChange={(e) => updateField("about", "cta", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Časová osa</Label>
                  <Button 
                    type="button"
                    onClick={addTimelineItem}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Přidat položku
                  </Button>
                </div>
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {content.about.timeline.map((item, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium mb-2">Událost {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimelineItem(index)}
                              disabled={content.about.timeline.length <= 1}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs">Rok</Label>
                              <Input
                                value={item.year}
                                onChange={(e) => updateTimelineItem(index, "year", e.target.value)}
                                size="sm"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">Název</Label>
                              <Input
                                value={item.title}
                                onChange={(e) => updateTimelineItem(index, "title", e.target.value)}
                                size="sm"
                              />
                            </div>

                            <div>
                              <Label className="text-xs">Popis</Label>
                              <Textarea
                                value={item.description}
                                onChange={(e) => updateTimelineItem(index, "description", e.target.value)}
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Ostatní sekce (News, Wines, Contact, Popup) */}
        <TabsContent value="news" className="space-y-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Sekce "Aktuality"</h3>
            
            <div className="grid gap-6">
              <div>
                <Label htmlFor="news-title">Nadpis sekce</Label>
                <Input
                  id="news-title"
                  value={content.news.title}
                  onChange={(e) => updateField("news", "title", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="news-subtitle">Podnadpis</Label>
                <Textarea
                  id="news-subtitle"
                  value={content.news.subtitle}
                  onChange={(e) => updateField("news", "subtitle", e.target.value)}
                  rows={3}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Poznámka</AlertTitle>
                <AlertDescription>
                  Jednotlivé aktuality se spravují v sekci "Aktuality" v hlavním menu administrace.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        {/* Wines Section */}
        <TabsContent value="wines" className="space-y-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Sekce "Naše vína"</h3>
            
            <div className="grid gap-6">
              <div>
                <Label htmlFor="wines-title">Nadpis sekce</Label>
                <Input
                  id="wines-title"
                  value={content.wines.title}
                  onChange={(e) => updateField("wines", "title", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="wines-subtitle">Podnadpis</Label>
                <Textarea
                  id="wines-subtitle"
                  value={content.wines.subtitle}
                  onChange={(e) => updateField("wines", "subtitle", e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="wines-cta">Text tlačítka</Label>
                <Input
                  id="wines-cta"
                  value={content.wines.cta}
                  onChange={(e) => updateField("wines", "cta", e.target.value)}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Poznámka</AlertTitle>
                <AlertDescription>
                  Jednotlivá vína se spravují v sekci "Vína" v hlavním menu administrace.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        {/* Contact Section */}
        <TabsContent value="contact" className="space-y-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Sekce "Kontakt"</h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact-title">Nadpis sekce</Label>
                  <Input
                    id="contact-title"
                    value={content.contact.title}
                    onChange={(e) => updateField("contact", "title", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-intro">Úvodní text</Label>
                  <Textarea
                    id="contact-intro"
                    value={content.contact.intro}
                    onChange={(e) => updateField("contact", "intro", e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Kontaktní údaje</h4>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="contact-company-name">Název firmy</Label>
                    <Input
                      id="contact-company-name"
                      value={content.contact.details.company.name}
                      onChange={(e) => updateNestedField("contact", "details", "company", {
                        ...content.contact.details.company,
                        name: e.target.value
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-company-ico">IČO</Label>
                    <Input
                      id="contact-company-ico"
                      value={content.contact.details.company.ico}
                      onChange={(e) => updateNestedField("contact", "details", "company", {
                        ...content.contact.details.company,
                        ico: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact-owner">Jméno majitele</Label>
                  <Input
                    id="contact-owner"
                    value={content.contact.details.owner}
                    onChange={(e) => updateNestedField("contact", "details", "owner", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-address">Adresa</Label>
                  <Input
                    id="contact-address"
                    value={content.contact.details.address}
                    onChange={(e) => updateNestedField("contact", "details", "address", e.target.value)}
                  />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="contact-phone1">Telefon 1</Label>
                    <Input
                      id="contact-phone1"
                      value={content.contact.details.phones[0] || ""}
                      onChange={(e) => {
                        const newPhones = [...content.contact.details.phones];
                        newPhones[0] = e.target.value;
                        updateNestedField("contact", "details", "phones", newPhones);
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-phone2">Telefon 2</Label>
                    <Input
                      id="contact-phone2"
                      value={content.contact.details.phones[1] || ""}
                      onChange={(e) => {
                        const newPhones = [...content.contact.details.phones];
                        newPhones[1] = e.target.value;
                        updateNestedField("contact", "details", "phones", newPhones);
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    value={content.contact.details.email}
                    onChange={(e) => updateNestedField("contact", "details", "email", e.target.value)}
                    type="email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-hours">Otevírací doba</Label>
                  <Input
                    id="contact-hours"
                    value={content.contact.details.openingHours}
                    onChange={(e) => updateNestedField("contact", "details", "openingHours", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact-gps">GPS souřadnice</Label>
                  <Input
                    id="contact-gps"
                    value={content.contact.details.gps}
                    onChange={(e) => updateNestedField("contact", "details", "gps", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Popup Section */}
        <TabsContent value="popup" className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Vyskakovací okno (Popup)</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={content.popup.enabled}
                  onCheckedChange={(checked) => updateField("popup", "enabled", checked)}
                  id="popup-enabled"
                />
                <Label htmlFor="popup-enabled">
                  {content.popup.enabled ? "Aktivní" : "Neaktivní"}
                </Label>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="popup-title">Nadpis</Label>
                  <Input
                    id="popup-title"
                    value={content.popup.title}
                    onChange={(e) => updateField("popup", "title", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="popup-description">Text</Label>
                  <Textarea
                    id="popup-description"
                    value={content.popup.description}
                    onChange={(e) => updateField("popup", "description", e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="popup-button-text">Text tlačítka</Label>
                    <Input
                      id="popup-button-text"
                      value={content.popup.buttonText}
                      onChange={(e) => updateField("popup", "buttonText", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="popup-button-link">Odkaz tlačítka</Label>
                    <Input
                      id="popup-button-link"
                      value={content.popup.buttonLink}
                      onChange={(e) => updateField("popup", "buttonLink", e.target.value)}
                      placeholder="např. #aktuality"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Obrázek pozadí</Label>
                <ImageUploader
                  currentImage={content.popup.imageUrl}
                  onImageUploaded={(url) => updateField("popup", "imageUrl", url)}
                  disabled={loading}
                />
                
                <Alert variant="info">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Doporučení</AlertTitle>
                  <AlertDescription>
                    Vyskakovací okno (popup) se zobrazí návštěvníkům po načtení stránky. Vhodné pro důležitá oznámení, akce nebo speciální nabídky.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8 pt-6 border-t">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Ukládání..." : "Uložit změny"}
        </Button>
      </div>
    </form>
  )
}
