import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t py-12 md:py-16 lg:py-20 bg-muted/20">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-4">Vinařství Badin</h3>
            <p className="text-sm text-muted-foreground">
              Rodinné vinařství s tradicí od roku 1960.
              Přijďte ochutnat naše kvalitní vína.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Moravské Bránice č.p. 383</p>
              <p>Tel: +420 731 658 533</p>
              <p>Email: info@vinarstvibadin.cz</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Odkazy</h3>
            <div className="space-y-2 text-sm">
              <p><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Domů</Link></p>
              <p><Link href="/aktuality" className="text-muted-foreground hover:text-primary transition-colors">Aktuality</Link></p>
              <p><Link href="/#o-nas" className="text-muted-foreground hover:text-primary transition-colors">O nás</Link></p>
              <p><Link href="/#vina" className="text-muted-foreground hover:text-primary transition-colors">Naše vína</Link></p>
              <p><Link href="/#kontakt" className="text-muted-foreground hover:text-primary transition-colors">Kontakt</Link></p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vinařství Badin. Všechna práva vyhrazena.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/zasady-soukromi" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Zásady soukromí
            </Link>
            <Link href="/obchodni-podminky" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Obchodní podmínky
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
