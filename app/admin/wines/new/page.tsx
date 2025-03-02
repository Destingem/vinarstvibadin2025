import { WineForm } from "@/components/admin/wine-form"

export default function NewWine() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Přidat nové víno</h2>
      </div>
      
      <div>
        <WineForm />
      </div>
    </div>
  )
}
