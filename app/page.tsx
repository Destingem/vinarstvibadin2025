import { headers } from "next/headers"
import { SiteHeader } from "@/components/site-header"
import { PromoPopup } from "@/components/promo-popup"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { AboutSection } from "@/components/home/about-section"
import { NewsSection } from "@/components/home/news-section"
import { WinesSection } from "@/components/home/wines-section"
import { ContactSection } from "@/components/home/contact-section"
import { ContentData } from "@/types"
import { fetchContent, fetchNews, fetchWines } from "@/lib/api"

// Fallback data pokud se nepodaří načíst obsah
const fallbackContent: ContentData = {
  hero: {
    badge: "Rodinné vinařství od roku 1960",
    title: "Vinařství Badin",
    subtitle: "Tradiční rodinné vinařství v Moravských Bránicích, kde každá láhev vypráví příběh naší rodiny a našeho terroir.",
    buttonPrimary: "Objevte naše vína",
    buttonSecondary: "Navštivte nás",
    backgroundImage: "/vinice.jpeg"
  },
  about: {
    badge: "Od roku 1960",
    title: "Rodinné vinařství s tradicí",
    paragraphs: [
      "Malé rodinné vinařství Badinovi bylo založeno v roce 1992. Navázali jsme na zkušenosti našich rodičů a prarodičů, kteří se věnovali vínu již od roku 1960.",
      "Snažíme se o produkci vín z hroznů vypěstovaných převážně ve vlastních vinicích."
    ],
    timeline: [
      { year: "1960", title: "Začátek rodinné tradice", description: "Naši rodiče a prarodiče začali s pěstováním vinné révy a výrobou vína." },
      { year: "1992", title: "Založení vinařství", description: "Oficiální založení Vinařství Badin a pokračování v rodinné tradici." },
      { year: "2008", title: "Otevření vinného sklepa", description: "Začali jsme prodávat víno ve vlastním sklepě v Moravských Bránicích." },
      { year: "2020", title: "Rekonstrukce sklepa", description: "Kompletní rekonstrukce vinného sklepa pro lepší zážitek našich zákazníků." }
    ],
    cta: "Navštivte nás"
  },
  news: {
    title: "Aktuality",
    subtitle: "Nejnovější informace z našeho vinařství, pozvánky na akce a novinky v nabídce vín."
  },
  wines: {
    title: "Naše vína",
    subtitle: "Vyrábíme kvalitní vína z hroznů z vlastních vinic. Každá láhev je výsledkem naší péče a lásky k vinařskému řemeslu.",
    cta: "Navštivte naši vinotéku"
  },
  contact: {
    title: "Kde nás najdete",
    intro: "Víno prodáváme ve vlastním sklepě v Moravských Bránicích od roku 2008. V roce 2020 jsme sklep rekonstruovali. V nabídce máme prodej vín v lahvích, v bag in boxech a stáčených do PET lahví.",
    details: {
      company: {
        name: "Vinařství Badin",
        ico: "46912126"
      },
      owner: "František Badin",
      address: "Moravské Bránice č.p. 383",
      phones: ["+420731658533", "+420734853217"],
      email: "info@vinarstvibadin.cz",
      openingHours: "Návštěvu prosím domluvte předem telefonicky",
      gps: "49.1769719N, 16.4129109E"
    }
  },
  features: [
    {
      icon: "GrapeIcon",
      title: "Vlastní vinice",
      description: "Pěstujeme hrozny ve vlastních vinicích s láskou a péčí."
    },
    {
      icon: "WineIcon",
      title: "Tradiční výroba",
      description: "Navazujeme na rodinnou tradici výroby vína od roku 1960."
    },
    {
      icon: "MapPinIcon",
      title: "Moravské Bránice",
      description: "Najdete nás v srdci moravského vinařského regionu."
    }
  ],
  popup: {
    title: "Jarní otevřené sklepy 2023",
    description: "Navštivte naše sklepy ve dnech 15.-16. dubna a ochutnejte nové ročníky našich vín. Těšíme se na vás!",
    buttonText: "Více informací",
    buttonLink: "#aktuality",
    imageUrl: "/vineyard-event.jpg",
    enabled: true
  }
};

export default async function Home() {
  try {
    // Use our safe fetch methods that handle production SSR
    const content = await fetchContent();
    const news = await fetchNews();
    const wines = await fetchWines();

    // Použijeme načtený obsah nebo fallback
    const pageContent = content || fallbackContent;

    return (
      <div className="flex flex-col">
        <SiteHeader />
        
        {/* Promo Popup - podmíněné zobrazení */}
        {pageContent.popup?.enabled && (
          <PromoPopup
            title={pageContent.popup.title}
            description={pageContent.popup.description}
            buttonText={pageContent.popup.buttonText}
            buttonLink={pageContent.popup.buttonLink}
            imageUrl={pageContent.popup.imageUrl}
          />
        )}

        {/* Hero Section */}
        <HeroSection 
          badge={pageContent.hero.badge}
          title={pageContent.hero.title}
          subtitle={pageContent.hero.subtitle}
          buttonPrimary={pageContent.hero.buttonPrimary}
          buttonSecondary={pageContent.hero.buttonSecondary}
          backgroundImage={pageContent.hero.backgroundImage}
        />

        {/* Features Section */}
        <FeaturesSection features={pageContent.features} />

        {/* About Section */}
        <AboutSection 
          badge={pageContent.about.badge}
          title={pageContent.about.title}
          paragraphs={pageContent.about.paragraphs}
          timeline={pageContent.about.timeline}
          cta={pageContent.about.cta}
        />

        {/* News Section */}
        <NewsSection 
          title={pageContent.news.title}
          subtitle={pageContent.news.subtitle}
          news={news || []}
        />

        {/* Wines Section */}
        <WinesSection 
          title={pageContent.wines.title}
          subtitle={pageContent.wines.subtitle}
          cta={pageContent.wines.cta}
          wines={wines || []}
        />

        {/* Contact Section */}
        <ContactSection 
          title={pageContent.contact.title}
          intro={pageContent.contact.intro}
          details={pageContent.contact.details}
        />
      </div>
    )
  } catch (error) {
    console.error("Error fetching data:", error);
    // Show fallback UI
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Načítání obsahu...</h1>
        <p>Pokud vidíte tuto zprávu déle než několik sekund, zkuste obnovit stránku.</p>
      </div>
    );
  }
}

