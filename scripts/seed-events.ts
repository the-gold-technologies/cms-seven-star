import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.upsert({
    where: { slug: "events" },
    create: {
      title: "Events",
      slug: "events",
      type: "static",
      visibility: "published",
    },
    update: {},
  });

  const content = {
    upperTag: "Seven Stars Calendar",
    heading: "Upcoming & Past Occasions",
    description: "Experience the vibrant tapestry of events at Seven Stars, from live music to themed gastronomic nights.",
    upcomingEvents: [
      {
        title: "Summer Solstice Garden Party",
        date: "July 12th",
        time: "12:00 PM - 10:00 PM",
        description: "Celebrate the height of summer in our spacious, historic pub garden. Enjoy live acoustic music, a fully stocked outdoor gin & Pimm's bar, and an exquisite wood-fired pizza menu prepared by our head chef.",
        pricing: "FREE ENTRY / FOOD & DRINKS A LA CARTE",
        highlight: "OUTDOOR WOOD-FIRED PIZZA & LIVE MUSIC",
        contactInfo: "01865 343337 | info@sevenstars.co.uk",
        image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&auto=format&fit=crop&q=60",
        category: "Special Occasion",
      },
      {
        title: "Acoustic Friday Nights",
        date: "July 24th",
        time: "7:30 PM - 10:30 PM",
        description: "Join us every last Friday of the month for an intimate evening of live music. Local talent will be performing soul, folk, and classic rock covers inside our rustic lounge area by the fireplace.",
        pricing: "FREE ENTRY / BOOKING RECOMMENDED",
        highlight: "LIVE ACOUSTIC SETS & COCKTAILS",
        contactInfo: "01865 343337 | info@sevenstars.co.uk",
        image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=60",
        category: "Live Music",
      },
      {
        title: "Gourmet Wine & Cheese Tasting",
        date: "August 8th",
        time: "7:00 PM - 9:30 PM",
        description: "A curated gastronomic journey matching five award-winning local cheeses with fine wines selected by our sommelier. Learn about pairings and taste artisan crackers and homemade chutneys.",
        pricing: "£35.00 PER PERSON",
        highlight: "FIVE CURATED PAIRINGS",
        contactInfo: "01865 343337 | bookings@sevenstars.co.uk",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=60",
        category: "Food & Wine",
      },
      {
        title: "Sunday Roast & Jazz Session",
        date: "August 17th",
        time: "1:00 PM - 4:00 PM",
        description: "Indulge in our award-winning dry-aged roast beef with all the trimmings while enjoying smooth jazz classics performed live by the Oxford Jazz Trio.",
        pricing: "ROAST FROM £18.95 / RESERVATION STRONGLY ADVISED",
        highlight: "LIVE SMOOTH JAZZ & AWARD-WINNING ROASTS",
        contactInfo: "01865 343337 | bookings@sevenstars.co.uk",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=60",
        category: "Sunday Dining",
      },
      {
        title: "Craft Beer & Cider Festival",
        date: "August 30th",
        time: "2:00 PM - 11:00 PM",
        description: "Featuring over 20 guest ales, local ciders, and craft beers from independent Oxfordshire breweries. Plus live music, giant garden games, and a hog roast in the pub garden.",
        pricing: "TICKETS £10 (INCLUDES SOUVENIR GLASS & 3 HALFPINT TOKENS)",
        highlight: "20+ GUEST CASKS & LIVE HOG ROAST",
        contactInfo: "01865 343337 | events@sevenstars.co.uk",
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=60",
        category: "Beer Festival",
      },
      {
        title: "Autumn Harvest Dinner",
        date: "September 18th",
        time: "7:00 PM - 10:00 PM",
        description: "An exclusive 5-course degustation menu celebrating the autumn harvest. Our chefs will showcase produce sourced directly from our own allotment and local Oxfordshire farms.",
        pricing: "£55.00 PER PERSON",
        highlight: "ALLOTMENT-TO-TABLE 5-COURSE TASTING MENU",
        contactInfo: "01865 343337 | info@sevenstars.co.uk",
        image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop&q=60",
        category: "Fine Dining",
      }
    ]
  };

  const existingSection = await prisma.section.findFirst({
    where: { pageId: page.id, type: "UpcomingEvents" },
  });

  if (existingSection) {
    await prisma.section.update({
      where: { id: existingSection.id },
      data: { content },
    });
    console.log("Successfully updated existing UpcomingEvents section!");
  } else {
    await prisma.section.create({
      data: {
        pageId: page.id,
        type: "UpcomingEvents",
        content,
        order: 0,
      },
    });
    console.log("Successfully created new UpcomingEvents section!");
  }
}

main()
  .catch((err) => {
    console.error("Error seeding events:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
