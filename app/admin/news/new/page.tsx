import { NewsForm } from "@/components/admin/news-form"

export default function NewNewsItem() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Přidat novou aktualitu</h2>
      </div>
      
      <div>
        <NewsForm />
      </div>
    </div>
  )
}
