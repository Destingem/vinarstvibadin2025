import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir, access } from 'fs/promises';
import path from 'path';
import { ContentData } from '@/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { setCorsHeaders, handleCorsPreflightRequest } from '@/lib/cors';

const contentFilePath = path.join(process.cwd(), 'data/content.json');

// Ensure the data directory and file exist
async function ensureDataFile() {
  const dir = path.join(process.cwd(), "data");
  try {
    await access(dir);
  } catch {
    // Create directory if it doesn't exist
    await mkdir(dir, { recursive: true });
  }

  try {
    await access(contentFilePath);
  } catch {
    // Create default content file if it doesn't exist
    const defaultContent: ContentData = {
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
    await writeFile(contentFilePath, JSON.stringify(defaultContent, null, 2), "utf8");
  }
}

// GET - Get content
export async function GET() {
  try {
    await ensureDataFile();
    const fileContents = await readFile(contentFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    const response = NextResponse.json(data);
    return setCorsHeaders(response);
  } catch (error) {
    console.error('Error reading content file:', error);
    const response = NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
    return setCorsHeaders(response);
  }
}

// PUT - Update content
export async function PUT(request: NextRequest) {
  try {
    // Verify admin access
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureDataFile();
    const content: ContentData = await request.json();
    
    // Validate data
    if (!content) {
      return NextResponse.json({ error: 'Invalid content data' }, { status: 400 });
    }

    // Save content to file
    await writeFile(contentFilePath, JSON.stringify(content, null, 2), 'utf8');

    // Revalidate cache for the main page
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/revalidate?path=/`);
    } catch (error) {
      console.error('Error revalidating cache:', error);
      // Continue even if revalidation fails
    }

    const response = NextResponse.json({ 
      success: true, 
      message: 'Content updated successfully' 
    });
    return setCorsHeaders(response);

  } catch (error) {
    console.error('Error updating content:', error);
    const response = NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    return setCorsHeaders(response);
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return handleCorsPreflightRequest();
}
