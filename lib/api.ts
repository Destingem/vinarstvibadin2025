import { Wine, NewsItem, ContentData } from "@/types"

// Simple base URL helper
function getBaseUrl() {
  // In the browser, use relative paths
  if (typeof window !== 'undefined') {
    return '';
  }
  
  // In development server-side, use the port from environment or the one we know is being used
  if (process.env.NODE_ENV === 'development') {
    // Use port 2456 which is what your server is running on
    return 'http://localhost:2456';
  }
  
  // In production server-side, use the configured URL or default to empty (relative)
  return process.env.NEXT_PUBLIC_API_BASE_URL || '';
}

// ==================== CONTENT API ====================
export async function fetchContent(): Promise<ContentData> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/content`, {
      next: { revalidate: 60 }, // Revalidace každých 60 sekund
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching content:', error);
    // Return a minimal valid ContentData object to prevent null reference errors
    return {
      hero: {
        title: "Vinařství Badin",
        subtitle: "Načítání obsahu...",
        badge: "",
        buttonPrimary: "",
        buttonSecondary: "",
        backgroundImage: ""
      },
      about: { title: "", badge: "", paragraphs: [], timeline: [], cta: "" },
      news: { title: "", subtitle: "" },
      wines: { title: "", subtitle: "", cta: "" },
      contact: {
        title: "",
        intro: "",
        details: {
          company: { name: "", ico: "" },
          owner: "",
          address: "",
          phones: [],
          email: "",
          openingHours: "",
          gps: ""
        }
      },
      features: [],
      popup: {
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        imageUrl: "",
        enabled: false
      }
    };
  }
}

export async function updateContent(content: ContentData): Promise<{ success: boolean }> {
  const response = await fetch('/api/content', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Neznámá chyba' }))
    throw new Error(error.message || 'Nepodařilo se aktualizovat obsah')
  }
  
  return response.json()
}

// ==================== WINES API ====================
export async function fetchWines(): Promise<Wine[]> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/wines`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch wines');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching wines:', error);
    return [];
  }
}

export async function fetchWine(id: string): Promise<Wine> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/wines/${id}`);
    
    if (!response.ok) {
      throw new Error(`Nepodařilo se načíst víno (${response.status})`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching wine ${id}:`, error);
    throw new Error('Nepodařilo se načíst víno');
  }
}

export async function createWine(wine: Omit<Wine, 'id' | 'createdAt'>): Promise<Wine> {
  const response = await fetch('/api/wines', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(wine)
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Neznámá chyba' }))
    throw new Error(error.message || 'Nepodařilo se vytvořit víno')
  }
  
  return response.json()
}

export async function updateWine(id: string, wine: Partial<Wine>): Promise<Wine> {
  const response = await fetch(`/api/wines/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(wine)
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Neznámá chyba' }))
    throw new Error(error.message || 'Nepodařilo se aktualizovat víno')
  }
  
  return response.json()
}

export async function deleteWine(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/wines/${id}`, {
    method: 'DELETE'
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Neznámá chyba' }))
    throw new Error(error.message || 'Nepodařilo se smazat víno')
  }
  
  return response.json()
}

// ==================== NEWS API ====================
export async function fetchNews(): Promise<NewsItem[]> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 60 }, // Revalidace každých 60 sekund
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// Podobně implementujte další funkce pro aktuality (fetchNewsItem, createNews, updateNews, deleteNews)

// ==================== UTILITY FUNCTIONS ====================
export async function revalidatePath(path: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/revalidate?path=${path}`)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Neznámá chyba' }))
    throw new Error(error.message || 'Nepodařilo se revalidovat cestu')
  }
  
  return response.json()
}
