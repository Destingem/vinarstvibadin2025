// Kontrola, že všechny typy mají správné definice

export interface Wine {
  id: string;
  name: string;
  year: string;
  description: string;
  price: string;
  image: string;
  type: "bile" | "cervene" | "ruzove";
  attributes: string[];
  createdAt: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface ContentData {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    buttonPrimary: string;
    buttonSecondary: string;
    backgroundImage: string;
  };
  about: {
    badge: string;
    title: string;
    paragraphs: string[];
    timeline: Array<{
      year: string;
      title: string;
      description: string;
    }>;
    cta: string;
  };
  news: {
    title: string;
    subtitle: string;
  };
  wines: {
    title: string;
    subtitle: string;
    cta: string;
  };
  contact: {
    title: string;
    intro: string;
    details: {
      company: {
        name: string;
        ico: string;
      };
      owner: string;
      address: string;
      phones: string[];
      email: string;
      openingHours: string;
      gps: string;
    };
  };
  features: Feature[];
  popup: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    imageUrl: string;
    enabled: boolean;
  };
}
