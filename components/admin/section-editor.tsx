"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ImageUploader } from "@/components/admin/image-uploader"
import { ChevronDown, ChevronUp, Plus, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionEditorProps {
  title: string
  data: any
  path: string
  onChange: (path: string, value: any) => void
}

export function SectionEditor({ title, data, path, onChange }: SectionEditorProps) {
  const [expanded, setExpanded] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    onChange(`${path}.${field}`, value)
  }

  // Oprava handleArrayItemChange pro správné zpracování vnořených objektů
  const handleArrayItemChange = (field: string, index: number, value: any) => {
    const newArray = [...(data[field] || [])]
    newArray[index] = value
    handleInputChange(field, newArray)
  }

  const addArrayItem = (field: string, defaultItem: any) => {
    const newArray = [...(data[field] || [])]
    newArray.push(defaultItem)
    handleInputChange(field, newArray)
  }

  const removeArrayItem = (field: string, index: number) => {
    const newArray = [...data[field]]
    newArray.splice(index, 1)
    handleInputChange(field, newArray)
  }

  // Speciální funkce pro zpracování timeline položek
  const handleTimelineItemChange = (index: number, field: string, value: string) => {
    // Vytvoření kopie pole timeline
    const timeline = [...data.timeline];
    
    // Aktualizace konkrétního pole v konkrétním objektu
    timeline[index] = { 
      ...timeline[index],
      [field]: value
    };
    
    // Aktualizace celého pole timeline
    handleInputChange('timeline', timeline);
  }

  // Upravená funkce pro renderování polí, aby speciálně zpracovávala timeline
  const renderField = (key: string, value: any, fieldPath: string) => {
    // Speciální zpracování pro timeline
    if (key === 'timeline' && Array.isArray(value)) {
      return (
        <div key={key} className="space-y-3">
          <Label>{formatFieldName(key)}</Label>
          {value.map((item, index) => (
            <Card key={index} className="mb-4 border-primary/20">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base flex justify-between">
                  Položka {index + 1}
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => removeArrayItem(key, index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Rok</Label>
                    <Input 
                      value={item.year || ''} 
                      onChange={(e) => handleTimelineItemChange(index, 'year', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Název události</Label>
                    <Input 
                      value={item.title || ''} 
                      onChange={(e) => handleTimelineItemChange(index, 'title', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Popis</Label>
                    <Textarea 
                      value={item.description || ''} 
                      onChange={(e) => handleTimelineItemChange(index, 'description', e.target.value)} 
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const defaultTimelineItem = {
                year: "",
                title: "",
                description: ""
              };
              addArrayItem(key, defaultTimelineItem);
            }}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" /> Přidat položku
          </Button>
        </div>
      )
    }
    
    // Pokud jde o pole features, také speciální zpracování
    if (key === 'features' && Array.isArray(value)) {
      return (
        <div key={key} className="space-y-3">
          <Label>{formatFieldName(key)}</Label>
          {value.map((item, index) => (
            <Card key={index} className="mb-4 border-primary/20">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base flex justify-between">
                  Funkce {index + 1}
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => {
                      // Musíme upravu cesty, protože features jsou v root objektu
                      const newFeatures = [...data.features];
                      newFeatures.splice(index, 1);
                      onChange('features', newFeatures);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Ikona</Label>
                    <Input 
                      value={item.icon || ''} 
                      onChange={(e) => {
                        const newFeatures = [...data.features];
                        newFeatures[index] = { ...newFeatures[index], icon: e.target.value };
                        onChange('features', newFeatures);
                      }} 
                    />
                    <p className="text-xs text-muted-foreground">
                      Dostupné ikony: GrapeIcon, WineIcon, MapPinIcon
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Název funkce</Label>
                    <Input 
                      value={item.title || ''} 
                      onChange={(e) => {
                        const newFeatures = [...data.features];
                        newFeatures[index] = { ...newFeatures[index], title: e.target.value };
                        onChange('features', newFeatures);
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Popis</Label>
                    <Textarea 
                      value={item.description || ''} 
                      onChange={(e) => {
                        const newFeatures = [...data.features];
                        newFeatures[index] = { ...newFeatures[index], description: e.target.value };
                        onChange('features', newFeatures);
                      }} 
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const newFeatures = [...(data.features || [])];
              newFeatures.push({
                icon: "GrapeIcon",
                title: "",
                description: ""
              });
              onChange('features', newFeatures);
            }}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" /> Přidat funkci
          </Button>
        </div>
      )
    }

    if (typeof value === "string") {
      // Zvláštní zacházení pro pole obrázků
      if (key.toLowerCase().includes("image") || key.toLowerCase().includes("img") || key.toLowerCase().includes("url")) {
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={fieldPath}>{formatFieldName(key)}</Label>
            <ImageUploader
              currentImage={value}
              onImageUploaded={(url) => handleInputChange(key, url)}
            />
          </div>
        )
      } else {
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={fieldPath}>{formatFieldName(key)}</Label>
            {value.length > 50 ? (
              <Textarea
                id={fieldPath}
                value={value}
                onChange={(e) => handleInputChange(key, e.target.value)}
                rows={4}
              />
            ) : (
              <Input
                id={fieldPath}
                value={value}
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            )}
          </div>
        )
      }
    } else if (typeof value === "boolean") {
      return (
        <div key={key} className="flex items-center space-x-2">
          <input
            id={fieldPath}
            type="checkbox"
            checked={value}
            onChange={(e) => handleInputChange(key, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor={fieldPath}>{formatFieldName(key)}</Label>
        </div>
      )
    } else if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "string") {
        // Pole řetězců
        return (
          <div key={key} className="space-y-3">
            <Label>{formatFieldName(key)}</Label>
            {value.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newArray = [...value]
                    newArray[index] = e.target.value
                    handleInputChange(key, newArray)
                  }}
                />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeArrayItem(key, index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => addArrayItem(key, "")}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Přidat položku
            </Button>
          </div>
        )
      } else if (value.length > 0 && typeof value[0] === "object") {
        // Pole objektů
        return (
          <div key={key} className="space-y-3">
            <Label>{formatFieldName(key)}</Label>
            {value.map((item, index) => (
              <Card key={index} className="mb-4">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base flex justify-between">
                    Položka {index + 1}
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removeArrayItem(key, index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="space-y-3">
                    {Object.entries(item).map(([itemKey, itemValue]) => (
                      renderNestedField(itemKey, itemValue, `${key}[${index}].${itemKey}`, index)
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Vytvoří novou položku s podobnou strukturou jako první položka pole
                const defaultItem = {}
                if (value.length > 0) {
                  Object.keys(value[0]).forEach(k => {
                    (defaultItem as any)[k] = typeof value[0][k] === 'string' ? '' : value[0][k]
                  })
                }
                addArrayItem(key, defaultItem)
              }}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Přidat položku
            </Button>
          </div>
        )
      }
    } else if (typeof value === "object" && value !== null) {
      // Objekt (vnořený)
      return (
        <Card key={key} className="mb-4">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">{formatFieldName(key)}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="space-y-3">
              {Object.entries(value).map(([nestedKey, nestedValue]) => (
                renderNestedField(nestedKey, nestedValue, `${key}.${nestedKey}`)
              ))}
            </div>
          </CardContent>
        </Card>
      )
    }
    return null
  }

  // Oprava renderNestedField pro správné zpracování polí objektů (např. timeline)
  const renderNestedField = (key: string, value: any, fieldPath: string, index?: number) => {
    // Callback pro změnu vnořených hodnot
    const handleNestedChange = (nestedKey: string, newValue: any) => {
      if (index !== undefined) {
        // Pro pole objektů (např. timeline)
        const pathParts = nestedKey.split('.')
        const actualKey = pathParts[pathParts.length - 1]
        
        // Bezpečné přístup k datům
        const parentArray = data[key]
        if (!Array.isArray(parentArray)) {
          console.error(`Data chyba: data[${key}] není pole`, data)
          return
        }
        
        const currentItem = parentArray[index] || {}
        const newItem = { ...currentItem, [actualKey]: newValue }
        
        // Aktualizace celého pole
        const newArray = [...parentArray]
        newArray[index] = newItem
        handleInputChange(key, newArray)
      } else {
        // Pro vnořené objekty
        const pathParts = fieldPath.split('.')
        const parentPath = pathParts.slice(0, -1).join('.')
        const lastKey = pathParts[pathParts.length - 1]
        
        try {
          // Bezpečnější přístup k vnořeným objektům
          let parentObj
          
          if (parentPath === '') {
            // Pokud je přímý potomek data
            parentObj = data
          } else {
            // Zkusíme získat cestu, pokud neexistuje, vytvoříme prázdný objekt
            parentObj = parentPath.split('.').reduce((obj, key) => {
              if (!obj[key]) obj[key] = {}
              return obj[key]
            }, data)
          }
          
          // Vytvoříme nový objekt s aktualizovanou hodnotou
          const updatedObj = { ...parentObj, [lastKey]: newValue }
          
          // Aktualizujeme celou cestu
          if (parentPath === '') {
            handleInputChange(lastKey, newValue)
          } else {
            handleInputChange(parentPath, updatedObj)
          }
        } catch (error) {
          console.error(`Chyba při aktualizaci hodnoty na cestě ${fieldPath}:`, error)
        }
      }
    }

    // Vylepšené renderování pro vnořené objekty v polích (např. timeline)
    if (typeof value === "string") {
      return (
        <div key={fieldPath} className="space-y-2">
          <Label htmlFor={fieldPath}>{formatFieldName(key)}</Label>
          {key.toLowerCase().includes("image") || key.toLowerCase().includes("img") || key.toLowerCase().includes("url") ? (
            <ImageUploader
              currentImage={value}
              onImageUploaded={(url) => handleNestedChange(fieldPath, url)}
            />
          ) : value.length > 50 ? (
            <Textarea
              id={fieldPath}
              value={value}
              onChange={(e) => handleNestedChange(fieldPath, e.target.value)}
              rows={4}
            />
          ) : (
            <Input
              id={fieldPath}
              value={value}
              onChange={(e) => handleNestedChange(fieldPath, e.target.value)}
            />
          )}
        </div>
      )
    } else if (typeof value === "boolean") {
      return (
        <div key={fieldPath} className="flex items-center space-x-2">
          <input
            id={fieldPath}
            type="checkbox"
            checked={value}
            onChange={(e) => handleNestedChange(fieldPath, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor={fieldPath}>{formatFieldName(key)}</Label>
        </div>
      )
    } else if (Array.isArray(value)) {
      // Tohle je už příliš vnořené pro náš jednoduchý editor
      return (
        <div key={fieldPath} className="space-y-2">
          <Label>{formatFieldName(key)}</Label>
          <Textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                handleNestedChange(fieldPath, JSON.parse(e.target.value))
              } catch {
                // Neplatný JSON - nic neděláme
              }
            }}
            rows={6}
            className="font-mono text-sm"
          />
        </div>
      )
    } else if (typeof value === "object" && value !== null) {
      // Vylepšené zpracování pro objekty, aby fungovalo s časovou osou a dalšími podobnými strukturami
      return (
        <div key={fieldPath} className="space-y-4 border rounded-md p-4 mb-4">
          <div className="font-medium">{formatFieldName(key)}</div>
          <div className="space-y-3">
            {Object.entries(value).map(([nestedKey, nestedValue]) => {
              const nestedPath = `${fieldPath}.${nestedKey}`;
              // Rekurzivní volání pro vnořené hodnoty
              return renderNestedField(nestedKey, nestedValue, nestedPath);
            })}
          </div>
        </div>
      );
    }

    return null;
  }

  const formatFieldName = (name: string) => {
    // Převede camelCase nebo snake_case na normální text
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .replace(/^\w/, c => c.toUpperCase())
  }

  return (
    <Card className={cn(expanded ? "mb-6" : "mb-2")}>
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg"
        onClick={() => setExpanded(!expanded)}
      >
        <CardTitle className="flex justify-between items-center text-xl">
          {title}
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      
      {expanded && (
        <CardContent className="space-y-4">
          {Object.entries(data).map(([key, value]) => {
            // Pro about sekci zpracujeme timeline zvlášť
            if (path === "about" && key === "timeline") {
              return renderField(key, value, `${key}`);
            }
            // Pro features sekci také zvláštní zpracování
            else if (path === "" && key === "features") {
              return renderField(key, value, `${key}`);
            }
            // Ostatní klíče standardně
            else {
              return renderField(key, value, `${key}`);
            }
          })}
        </CardContent>
      )}
    </Card>
  )
}
