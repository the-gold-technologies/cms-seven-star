const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Supabase Storage Public Image Base URL & Asset References
const STORAGE_BASE =
  "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket";

const IMAGES = {
  EXTERIOR_MAIN: `${STORAGE_BASE}/1781686621461-SEVEN_STARS_2026_02_09-145.webp`,
  HERO_ATMOSPHERIC: `${STORAGE_BASE}/1781160541188-SEVEN_STARS_2026_02_09-207.webp`,
  HERO_INTERIOR: `${STORAGE_BASE}/1781160176550-SEVEN_STARS_2026_02_09-137.webp`,
  DINING_HALL: `${STORAGE_BASE}/1781687988901-SEVEN_STARS_2026_02_09-81.webp`,
  DINING_TABLE: `${STORAGE_BASE}/1781687985102-SEVEN_STARS_2026_02_09-206.webp`,
  FOOD_STEAK: `${STORAGE_BASE}/1781686614010-SEVEN_STARS_2026_02_09-210.webp`,
  FOOD_SPECIAL: `${STORAGE_BASE}/1781686617797-SEVEN_STARS_2026_02_09-0113.webp`,
  FOOD_SEASONAL_170: `${STORAGE_BASE}/1781688386177-SEVEN_STARS_2026_02_09-170.webp`,
  EVENT_GATHERING: `${STORAGE_BASE}/1781686607452-SEVEN_STARS_2026_02_09-0028.webp`,
  EVENT_MUSIC: `${STORAGE_BASE}/1781686610741-SEVEN_STARS_2026_02_09-0076.webp`,
  STORY_HERITAGE: `${STORAGE_BASE}/1781163080123-SEVEN_STARS_2026_02_09-0005.webp`,
  GALLERY_BAR: `${STORAGE_BASE}/1781686626397-SEVEN_STARS_2026_02_09-338.webp`,
  GALLERY_GARDEN: `${STORAGE_BASE}/1781687981908-SEVEN_STARS_2026_02_09-114.webp`,
  GALLERY_COZY: `${STORAGE_BASE}/1781687990034-SEVEN_STARS_2026_02_09-306.webp`,
  GALLERY_DRINKS: `${STORAGE_BASE}/1781687991208-SEVEN_STARS_2026_02_09-329.webp`,
  CHRISTMAS_HERO: `${STORAGE_BASE}/1781195516243-IMG_4523.webp`,
  CONTACT_HERO: `${STORAGE_BASE}/1781164162893-SEVEN_STARS_2026_02_09-0142.webp`,
  BLOG_SUMMER: `${STORAGE_BASE}/1781195615052-WhatsAppImage2026-06-11at21.23.03.jpeg`,
  BLOG_LOCAL: `${STORAGE_BASE}/1781160436858-SEVEN_STARS_2026_02_09-16.webp`,
};

// All 116 uploaded files from Supabase Storage bucket 'myBucket'
const ALL_SUPABASE_FILES = [
  "1779093878328-481171001_957353706531406_1040071741557670337_nlow1.webp",
  "1779093879496-481171001_957353706531406_1040071741557670337_nlow.webp",
  "1779093879853-481171001_957353706531406_1040071741557670337_nlow.png",
  "1779093880266-481983309_18036627329600436_7680148243878380970_nlow.webp",
  "1779093880678-footer-bg.webp",
  "1779094138324-food-gourmet.webp",
  "1779095835279-gallery-1.webp",
  "1779095837442-gallery-2.webp",
  "1779095838130-gallery-3.webp",
  "1779095838769-gallery-4.webp",
  "1779095839457-barn.webp",
  "1779095840311-gallery-6.webp",
  "1779095840930-gallery-8.webp",
  "1779095841739-event-celebration.webp",
  "1779095842659-gallery-25.webp",
  "1779096150075-food-gourmet.webp",
  "1779096151673-gallery-8.webp",
  "1779096899568-footer-bg.webp",
  "1779099397728-gallery-25.webp",
  "1779100598226-gallery-25.webp",
  "1779100831425-music.webp",
  "1779100907926-footer-bg.webp",
  "1779101283901-feature-classic-1.webp",
  "1779102563583-SEVEN_STARS_2026_02_09-0065.webp",
  "1779102629081-feature-classic-1.webp",
  "1779102630377-feature-special-1.webp",
  "1779103383312-event-celebration.webp",
  "1779125163275-SEVEN_STARS_2026_02_09-0072.webp",
  "1779446831444-SEVEN_STARS_2026_02_09-10.webp",
  "1780554493244-SEVEN_STARS_2026_02_09-120.webp",
  "1780554689649-SEVEN_STARS_2026_02_09-0028.webp",
  "1780554765261-SEVEN_STARS_2026_02_09-0113.webp",
  "1780554968912-SEVEN_STARS_2026_02_09-122.webp",
  "1780555071861-Weddingpic.webp",
  "1780555073064-SEVEN_STARS_2026_02_09-0040.webp",
  "1780637514694-SEVEN_STARS_2026_02_09-349.webp",
  "1780637679964-SEVEN_STARS_2026_02_09-265.webp",
  "1780637682165-SEVEN_STARS_2026_02_09-235.webp",
  "1780637684315-SEVEN_STARS_2026_02_09-344.webp",
  "1780637685212-SEVEN_STARS_2026_02_09-94.webp",
  "1780637784295-SEVEN_STARS_2026_02_09-34.webp",
  "1781071047399-SEVEN_STARS_2026_02_09-35.webp",
  "1781073689384-SEVEN_STARS_2026_02_09-0104.webp",
  "1781074152897-SEVEN_STARS_2026_02_09-5.webp",
  "1781078308869-82e86b0f-9c24-42cb-873a-73ee51ed02cb.webp",
  "1781080098132-Screenshot_20260530_212349.webp",
  "1781080099243-Screenshot_20260530_212407.webp",
  "1781080100388-Screenshot_20260530_212418.webp",
  "1781084589375-Gemini_Generated_Image_b3lys7b3lys7b3ly.webp",
  "1781084593652-Gemini_Generated_Image_zdu2vbzdu2vbzdu2.webp",
  "1781084597937-Gemini_Generated_Image_3ongbm3ongbm3ong.webp",
  "1781085714533-SEVEN_STARS_2026_02_09-0008.webp",
  "1781085721419-SEVEN_STARS_2026_02_09-0032.webp",
  "1781085727303-SEVEN_STARS_2026_02_09-0151.webp",
  "1781085731650-SEVEN_STARS_2026_02_09-125.webp",
  "1781085738861-SEVEN_STARS_2026_02_09-0040.webp",
  "1781085742647-SEVEN_STARS_2026_02_09-0107.webp",
  "1781085747049-SEVEN_STARS_2026_02_09-124.webp",
  "1781086062051-SEVEN_STARS_2026_02_09-5.webp",
  "1781086064541-SEVEN_STARS_2026_02_09-0022.webp",
  "1781086073951-SEVEN_STARS_2026_02_09-149.webp",
  "1781086353031-SEVEN_STARS_2026_02_09-114.webp",
  "1781086359829-SEVEN_STARS_2026_02_09-0107.webp",
  "1781086645604-SEVEN_STARS_2026_02_09-169.webp",
  "1781086655447-SEVEN_STARS_2026_02_09-0025.webp",
  "1781086662028-SEVEN_STARS_2026_02_09-0080.webp",
  "1781086666152-SEVEN_STARS_2026_02_09-0057.webp",
  "1781087019487-SEVEN_STARS_2026_02_09-0066.webp",
  "1781087027455-SEVEN_STARS_2026_02_09-126.webp",
  "1781087033121-SEVEN_STARS_2026_02_09-0106.webp",
  "1781087039804-SEVEN_STARS_2026_02_09-0011.webp",
  "1781087045656-SEVEN_STARS_2026_02_09-0170.webp",
  "1781087435267-SEVEN_STARS_2026_02_09-0058.webp",
  "1781087440607-SEVEN_STARS_2026_02_09-0016.webp",
  "1781087445795-SEVEN_STARS_2026_02_09-0023.webp",
  "1781087452135-SEVEN_STARS_2026_02_09-329.webp",
  "1781087452994-SEVEN_STARS_2026_02_09-349.webp",
  "1781087454735-SEVEN_STARS_2026_02_09-0048.webp",
  "1781087458738-SEVEN_STARS_2026_02_09-0012.webp",
  "1781087463543-SEVEN_STARS_2026_02_09-0050.webp",
  "1781087467006-SEVEN_STARS_2026_02_09-0043.webp",
  "1781156724977-SEVEN_STARS_2026_02_09-0106.webp",
  "1781160176550-SEVEN_STARS_2026_02_09-137.webp",
  "1781160436858-SEVEN_STARS_2026_02_09-16.webp",
  "1781160541188-SEVEN_STARS_2026_02_09-207.webp",
  "1781163080123-SEVEN_STARS_2026_02_09-0005.webp",
  "1781164162893-SEVEN_STARS_2026_02_09-0142.webp",
  "1781195516243-IMG_4523.webp",
  "1781195615052-WhatsAppImage2026-06-11at21.23.03.jpeg",
  "1781686607452-SEVEN_STARS_2026_02_09-0028.webp",
  "1781686610741-SEVEN_STARS_2026_02_09-0076.webp",
  "1781686614010-SEVEN_STARS_2026_02_09-210.webp",
  "1781686617797-SEVEN_STARS_2026_02_09-0113.webp",
  "1781686621461-SEVEN_STARS_2026_02_09-145.webp",
  "1781686626397-SEVEN_STARS_2026_02_09-338.webp",
  "1781687981908-SEVEN_STARS_2026_02_09-114.webp",
  "1781687985102-SEVEN_STARS_2026_02_09-206.webp",
  "1781687988901-SEVEN_STARS_2026_02_09-81.webp",
  "1781687990034-SEVEN_STARS_2026_02_09-306.webp",
  "1781687991208-SEVEN_STARS_2026_02_09-329.webp",
  "1781688386177-SEVEN_STARS_2026_02_09-170.webp",
  "1781688388195-SEVEN_STARS_2026_02_09-155.webp",
  "1781688390427-SEVEN_STARS_2026_02_09-138.webp",
  "1781688771511-SEVEN_STARS_2026_02_09-142.webp",
  "1781688775136-SEVEN_STARS_2026_02_09-0173.webp",
  "1781688950147-SEVEN_STARS_2026_02_09-116.webp",
  "1781688952007-SEVEN_STARS_2026_02_09-250.webp",
  "1781688953515-SEVEN_STARS_2026_02_09-0006.webp",
  "1781689296201-SEVEN_STARS_2026_02_09-0166.webp",
  "1781689481570-SEVEN_STARS_2026_02_09-0066.webp",
  "1782451657572-christmas-pub-hero.webp",
  "1782451660185-christmas-tune.mp3",
  "1782451876166-christmas-santaclaus.webp",
  "1785413432718-SundayMenu.pdf",
  "1785413456217-DessertMenu.pdf",
  "1785413495467-summermenu2.pdf",
].map((filename) => `${STORAGE_BASE}/${filename}`);

async function main() {
  console.log("🌱 Database seeding started...");

  // 1. Clean existing database
  console.log("🧹 Cleaning existing database records...");
  await prisma.section.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.navLink.deleteMany({});
  await prisma.globalConfig.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.enquiry.deleteMany({});

  // 2. Create Default Admin User
  console.log("👤 Creating default admin user...");
  const hashedPassword = await bcrypt.hash("1234asdf@", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@sevenstars.co.uk" },
    update: {
      name: "Admin",
      password: hashedPassword,
    },
    create: {
      name: "Admin",
      email: "admin@sevenstars.co.uk",
      password: hashedPassword,
    },
  });
  console.log("✅ Created/updated admin user:", adminUser.email);

  // 3. Create Global Configuration
  console.log("⚙️ Creating global config...");
  const globalConfigData = {
    id: "global",
    siteTitle: "The Seven Stars",
    siteDescription:
      "Community-owned traditional pub in Marsh Baldon, Oxfordshire serving local ales, fine food, and warm hospitality.",
    favicon: "/favicon.ico",
    googleAnalyticsId: "G-7STARS1234",
    gtmId: "GTM-7STARS1",
    searchConsoleId: "7stars-search-console",
    customHeaderScripts: null,
    customFooterScripts: null,
    socialLinks: [
      {
        name: "Instagram",
        url: "https://instagram.com/sevenstarsmarshbaldon",
      },
      {
        name: "Facebook",
        url: "https://facebook.com/sevenstarsmarshbaldon",
      },
    ],
    canonicalOrdering: "default",
    sitemapEnabled: true,
    robotsTxt:
      "User-agent: *\nAllow: /\n\nSitemap: https://sevenstarsatmarshbaldon.co.uk/sitemap.xml",
  };

  await prisma.globalConfig.upsert({
    where: { id: "global" },
    update: globalConfigData,
    create: globalConfigData,
  });
  console.log("✅ Created/updated global config");

  // 4. Create Navigation Links
  console.log("🔗 Creating navigation links...");
  const aboutLink = await prisma.navLink.create({
    data: {
      label: "About Us",
      url: "/about",
      type: "Dropdown",
      parent: "-",
      order: 1,
      isStatic: true,
    },
  });
  await prisma.navLink.create({
    data: {
      label: "About Us",
      url: "/about",
      type: "Sub-link",
      parent: aboutLink.id,
      order: 1,
      isStatic: true,
    },
  });
  await prisma.navLink.create({
    data: {
      label: "Our Story",
      url: "/our-story",
      type: "Sub-link",
      parent: aboutLink.id,
      order: 2,
      isStatic: true,
    },
  });

  await prisma.navLink.create({
    data: {
      label: "Dining",
      url: "/dining",
      type: "Main Link",
      parent: "-",
      order: 2,
      isStatic: true,
    },
  });
  const eventsLink = await prisma.navLink.create({
    data: {
      label: "Events",
      url: "/events",
      type: "Dropdown",
      parent: "-",
      order: 3,
      isStatic: true,
    },
  });
  await prisma.navLink.create({
    data: {
      label: "Events",
      url: "/events",
      type: "Sub-link",
      parent: eventsLink.id,
      order: 1,
      isStatic: true,
    },
  });
  await prisma.navLink.create({
    data: {
      label: "Christmas",
      url: "/christmas",
      type: "Sub-link",
      parent: eventsLink.id,
      order: 2,
      isStatic: true,
    },
  });

  await prisma.navLink.create({
    data: {
      label: "Menu",
      url: "/menu",
      type: "Main Link",
      parent: "-",
      order: 4,
      isStatic: true,
    },
  });
  await prisma.navLink.create({
    data: {
      label: "Gallery",
      url: "/gallery",
      type: "Main Link",
      parent: "-",
      order: 5,
      isStatic: true,
    },
  });
  await prisma.navLink.create({
    data: {
      label: "News & Blog",
      url: "/blog",
      type: "Main Link",
      parent: "-",
      order: 6,
      isStatic: true,
    },
  });

  console.log("✅ Seeded navigation links with dropdown hierarchy");

  // 5. Static Pages & Sections Definition
  console.log("📄 Creating pages and sections with Supabase Storage Images...");

  const pagesData = [
    // -------------------------------------------------------------
    // HOME PAGE
    // -------------------------------------------------------------
    {
      title: "Home",
      slug: "home",
      type: "static",
      isStatic: true,
      visibility: "published",
      description: "Main Homepage of The Seven Stars Pub",
      metaTitle: "The Seven Stars | Community Pub in Marsh Baldon",
      metaDescription:
        "Welcome to The Seven Stars - traditional countryside pub in Marsh Baldon, Oxfordshire serving fresh seasonal food and cask ales.",
      sections: [
        {
          type: "HeroSection",
          order: 0,
          content: {
            headlineLine1: "Where Village \n Warmth Meets",
            headlineLine2Italic: "Great Food",
            primaryBtnLabel: "Discover Menu",
            primaryBtnUrl: "/menu",
            secondaryBtnLabel: "Book a Table",
            secondaryBtnUrl:
              "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
            heroImage: IMAGES.HERO_ATMOSPHERIC,
            images: [
              `${STORAGE_BASE}/1781686626397-SEVEN_STARS_2026_02_09-338.webp`,
              `${STORAGE_BASE}/1781686607452-SEVEN_STARS_2026_02_09-0028.webp`,
              `${STORAGE_BASE}/1781686614010-SEVEN_STARS_2026_02_09-210.webp`,
              `${STORAGE_BASE}/1781686621461-SEVEN_STARS_2026_02_09-145.webp`,
              `${STORAGE_BASE}/1781686610741-SEVEN_STARS_2026_02_09-0076.webp`,
              `${STORAGE_BASE}/1781686617797-SEVEN_STARS_2026_02_09-0113.webp`,
            ],
            marqueePills: [
              "Sunday Roasts",
              "Local Ales",
              "Beer Garden",
              "Private Barn",
              "Seasonal Specials",
            ],
            instagramUrl: "https://www.instagram.com/sevenstarsatmarshbaldon/",
            facebookUrl: "https://www.facebook.com/sevenstarsatmarshbaldon",
            youtubeUrl: "",
            googleRating: "",
            googleReviewsCount: "",
            googleReviewsUrl: "",
            headingTag: "h1",
          },
        },
        {
          type: "FirstTimePopup",
          order: 1,
          content: {
            isEnabled: true,
            title: "Send an Enquiry",
            description: "We aim to respond to all enquiries within 24 hours.",
            welcomeText: "Welcome",
            imageTitle: "Seven Stars",
            imageSubtitle: "Marsh Baldon, Oxford",
          },
        },
        {
          type: "AboutUs",
          order: 2,
          content: {
            sectionNumber: "01",
            upperTag: "OUR STORY",
            headingLabel: "Welcome to",
            headingItalicHighlight: "The Seven Stars at Marsh Baldon",
            paragraphs: [
              "Tucked away in the beautiful village of Marsh Baldon, The Seven Stars is everything a great British pub should be. Community-owned and community-run, every pint poured and every plate served is a small act of keeping something genuinely valuable alive.",
              "We believe that a great British pub should do three things well: serve excellent food, pour a proper drink, and make every single person who walks through the door feel welcome. Whether you're joining us for a relaxed Sunday evening or celebrating with friends, our warm atmosphere invites you to stay a while.",
            ],
            ctaLabel: "EXPLORE OUR DINING",
            ctaUrl: "/dining",
            image: `${STORAGE_BASE}/1781163080123-SEVEN_STARS_2026_02_09-0005.webp`,
            doorImage: `${STORAGE_BASE}/1781163080123-SEVEN_STARS_2026_02_09-0005.webp`,
            imageAlt: "The Seven Stars historic exterior and green",
            title: "Welcome to The Seven Stars at Marsh Baldon",
            subtitle: "Community Owned & Operated",
            description:
              "Saved by local residents in 2013, Seven Stars is more than just a pub—it is the vibrant social heart of Marsh Baldon.",
            buttonText: "Read Our Story",
            buttonUrl: "/our-story",
            stats: [
              { label: "Years of Heritage", value: "300+" },
              { label: "Community Shareholders", value: "75+" },
              { label: "Local Craft Beers", value: "12" },
            ],
          },
        },
        {
          type: "FeatureTiles",
          order: 3,
          content: {
            regularHeading: "Discover Our",
            italicHeading: "Pub Traditions",
            tagLabel: "Boutique Gastro Experience",
            title: "What Makes Us Special",
            subtitle: "Experience true countryside charm",
            features: [
              {
                title: "Sunday Roasts",
                images: [
                  `${STORAGE_BASE}/1781687988901-SEVEN_STARS_2026_02_09-81.webp`,
                  `${STORAGE_BASE}/1781687981908-SEVEN_STARS_2026_02_09-114.webp`,
                  `${STORAGE_BASE}/1781687985102-SEVEN_STARS_2026_02_09-206.webp`,
                ],
                description:
                  "The ultimate British tradition, perfected with local meats.",
                icon: "Utensils",
              },
              {
                title: "Pub Classics",
                images: [
                  `${STORAGE_BASE}/1781687990034-SEVEN_STARS_2026_02_09-306.webp`,
                  `${STORAGE_BASE}/1781687991208-SEVEN_STARS_2026_02_09-329.webp`,
                  `${STORAGE_BASE}/1781087452994-SEVEN_STARS_2026_02_09-349.webp`,
                ],
                description:
                  "Time-honored favorites with a sophisticated gourmet twist.",
                icon: "GlassWater",
              },
              {
                title: "Seasonal Specials",
                images: [
                  `${STORAGE_BASE}/SEVEN_STARS_2026_02_09-384.webp`,
                  `${STORAGE_BASE}/1781688388195-SEVEN_STARS_2026_02_09-155.webp`,
                  `${STORAGE_BASE}/1781688390427-SEVEN_STARS_2026_02_09-138.webp`,
                ],
                description:
                  "Fresh, local ingredients inspired by the changing seasons.",
                icon: "Sun",
              },
            ],
          },
        },
        {
          type: "MenuFeatured",
          order: 4,
          content: {
            upperTag: "The Chef's Selection",
            regularHeading: "Taste the",
            italicHeading: "Exceptional",
            description:
              "Experience our most celebrated seasonal creations, each crafted with locally sourced ingredients and culinary passion.",
            watermark: "Signature Dishes",
            badgeLabel: "Chef's Signature",
            badgeText: "Culinary excellence in every bite.",
            ctaLabel: "Explore Full Menu",
            ctaUrl: "/menu",
            dishes: [
              {
                name: "Pan-Seared Duck Breast",
                price: "£24.00",
                description:
                  "Fondant potato, braised red cabbage, blackberry reduction, toasted hazelnuts.",
                image: `${STORAGE_BASE}/1781687985102-SEVEN_STARS_2026_02_09-206.webp`,
              },
              {
                name: "Spiced Poached Pear",
                price: "£8.50",
                description:
                  "Red wine gastrique, vanilla bean gelato, cinnamon oat crumble.",
                image: `${STORAGE_BASE}/1781688775136-SEVEN_STARS_2026_02_09-0173.webp`,
              },
              {
                name: "Spiced Home-Reared Lamb Kofta",
                price: "£12.95",
                description:
                  "Red pepper hummus, lightly spiced onion, tzatziki, warm pita.",
                image: `${STORAGE_BASE}/1781071047399-SEVEN_STARS_2026_02_09-35.webp`,
              },
            ],
          },
        },
        {
          type: "EventGallery",
          order: 5,
          content: {
            upperTag: "Events & Celebrations",
            headingPart1: "Perfect For",
            headingItalicHighlight: "Every Moment",
            title: "Upcoming Gatherings & Events",
            subtitle: "Live music, pub quizzes, and seasonal celebrations",
            images: [
              {
                src: IMAGES.EVENT_GATHERING,
                alt: "Mother's Day Special Luncheon",
              },
              {
                src: IMAGES.EVENT_MUSIC,
                alt: "Mother's Day Celebration Table",
              },
              {
                src: IMAGES.DINING_HALL,
                alt: "Mother's Day Experience Preview",
              },
              {
                src: IMAGES.STORY_HERITAGE,
                alt: "Indian Heritage Banquet",
              },
              {
                src: IMAGES.GALLERY_BAR,
                alt: "Club Atmosphere",
              },
            ],
          },
        },
        {
          type: "Gallery",
          order: 6,
          content: {
            upperTag: "Visual Journey",
            regularHeading: "Our",
            italicHeading: "Gallery",
            description:
              "A comprehensive look into the Seven Stars. Explore our historic architecture, vibrant interiors, and the premium gastro experience across our entire curated collection.",
            title: "Life at Seven Stars",
            subtitle: "A glimpse inside our pub and gardens",
            images: [
              {
                src: IMAGES.GALLERY_BAR,
                url: IMAGES.GALLERY_BAR,
                alt: "Authentic Pub Atmosphere",
                caption: "Cozy Bar Seating",
              },
              {
                src: IMAGES.GALLERY_GARDEN,
                url: IMAGES.GALLERY_GARDEN,
                alt: "Vibrant Main Bar",
                caption: "Summer Garden Terrace",
              },
              {
                src: IMAGES.GALLERY_COZY,
                url: IMAGES.GALLERY_COZY,
                alt: "Traditional Pub Character",
                caption: "Fireside Dining",
              },
              {
                src: IMAGES.GALLERY_DRINKS,
                url: IMAGES.GALLERY_DRINKS,
                alt: "Restaurant Interior Detail",
                caption: "Local Cask & Craft Ales",
              },
              {
                src: IMAGES.EXTERIOR_MAIN,
                url: IMAGES.EXTERIOR_MAIN,
                alt: "Atmospheric Interiors",
                caption: "Traditional Facade",
              },
              {
                src: IMAGES.HERO_INTERIOR,
                url: IMAGES.HERO_INTERIOR,
                alt: "Gourmet Dining Setup",
                caption: "Dining Room",
              },
            ],
          },
        },
        {
          type: "Testimonials",
          order: 7,
          content: {
            title: "What Our Guests Say",
            subtitle: "Reviews from locals and travelers alike",
            testimonials: [
              {
                quote:
                  "The atmosphere at Seven Stars is unmatched. From the warm welcome to the exquisite Middle Eastern influences in their Sunday roast, it's a truly boutique experience.",
                author: "James Harrison",
                name: "James Harrison",
                role: "Local Food Critic",
                comment:
                  "The atmosphere at Seven Stars is unmatched. From the warm welcome to the exquisite Middle Eastern influences in their Sunday roast, it's a truly boutique experience.",
                rating: 5,
                image: `${STORAGE_BASE}/1781686610741-SEVEN_STARS_2026_02_09-0076.webp`,
              },
              {
                quote:
                  "A perfect blend of British tradition and modern culinary art. Their orange and cognac crème brulée is quite literally the best dessert I've had this year.",
                author: "Sarah Jenkins",
                name: "Sarah Jenkins",
                role: "Frequent Guest",
                comment:
                  "A perfect blend of British tradition and modern culinary art. Their orange and cognac crème brulée is quite literally the best dessert I've had this year.",
                rating: 5,
                image: `${STORAGE_BASE}/1781688388195-SEVEN_STARS_2026_02_09-155.webp`,
              },
              {
                quote:
                  "We hosted our anniversary here and the team went above and beyond. The setting is stunning, especially in the evening when the glow hits the stone walls.",
                author: "Robert & Elena",
                name: "Robert & Elena",
                role: "Club Members",
                comment:
                  "We hosted our anniversary here and the team went above and beyond. The setting is stunning, especially in the evening when the glow hits the stone walls.",
                rating: 5,
                image: `${STORAGE_BASE}/1781688953515-SEVEN_STARS_2026_02_09-0006.webp`,
              },
            ],
            testimonialImages: [
              `${STORAGE_BASE}/1781686610741-SEVEN_STARS_2026_02_09-0076.webp`,
              `${STORAGE_BASE}/1781688388195-SEVEN_STARS_2026_02_09-155.webp`,
              `${STORAGE_BASE}/1781688953515-SEVEN_STARS_2026_02_09-0006.webp`,
            ],
          },
        },
        {
          type: "ReadyToVisit",
          order: 8,
          content: {
            upperTag: "PLAN YOUR VISIT",
            heading: "Ready to Visit?",
            lines: ["Book online or give us a call.", "We'd love to see you."],
            bookLabel: "Book a Table",
            bookUrl: "/contact",
            phoneLabel: "Call Us",
            phoneUrl: "tel:01865343337",
            image1: `${STORAGE_BASE}/1779094138324-food-gourmet.webp`,
            image2: `${STORAGE_BASE}/1781087458738-SEVEN_STARS_2026_02_09-0012.webp`,
            title: "Ready to Experience Seven Stars?",
            subtitle: "Book your table online or stop by for a pint.",
            buttonText: "Book Table Now",
            buttonUrl:
              "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
            image: IMAGES.HERO_INTERIOR,
          },
        },
        {
          type: "FooterCMS",
          order: 9,
          content: {
            companyName: "SEVEN STARS",
            tagline: "Countryside Gastro Club Pub",
            footerDescription:
              "Born from a passion for exceptional hospitality, Seven Stars merges the warmth of a countryside pub with the sophistication of a premium gastro club.",
            ctaLabel: "BOOK A TABLE",
            ctaUrl:
              "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
            instagramUrl: "https://www.instagram.com/sevenstarsatmarshbaldon/",
            facebookUrl: "https://www.facebook.com/sevenstarsatmarshbaldon",
            youtubeUrl: "#",
            address:
              "The Seven Stars at Marsh Baldon,\nThe Green, Baldon Lane, Marsh\nBaldon, Oxford - OX44 9LP",
            phoneNumber: "01865 343337",
            emailAddress: "info@sevenstarsatmb.co.uk",
            watermark: "Seven Stars",
            backgroundImage: `${STORAGE_BASE}/1779093880678-footer-bg.webp`,
            openingHours: [
              {
                day: "MONDAY",
                hours: "CLOSED (Open on Bank Holiday Monday)",
              },
              {
                day: "TUESDAY - SATURDAY",
                hours: "12:00 - 23:00",
              },
              {
                day: "SUNDAY",
                hours: "12:00 - 20:00",
              },
            ],
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // ABOUT PAGE
    // -------------------------------------------------------------
    {
      title: "About Us",
      slug: "about",
      type: "static",
      isStatic: true,
      visibility: "published",
      description: "About The Seven Stars Pub",
      metaTitle: "About Us | The Seven Stars Marsh Baldon",
      metaDescription:
        "Learn about the history, community buyout, and warm hospitality of The Seven Stars in Marsh Baldon.",
      sections: [
        {
          type: "AboutHero",
          order: 0,
          content: {
            tagline: "OUR STORY",
            headingPart1: "About",
            headingItalicHighlight: "Us",
            title: "About Us",
            backgroundImage: `${STORAGE_BASE}/1781689296201-SEVEN_STARS_2026_02_09-0166.webp`,
            badgeText: "Est. 17th Century",
          },
        },
        {
          type: "AboutRoots",
          order: 1,
          content: {
            rootsTag: "OUR STORY",
            rootsHeading: "A village pub, owned by the",
            rootsHeadingItalic: "people it serves.",
            rootsDesc1:
              "Nestled in the heart of Marsh Baldon, The Seven Stars is one of the few community-owned pubs in Oxfordshire. More than a local landmark, it is a shared commitment—kept alive by the people who cherish it.",
            rootsDesc2:
              "Every pint poured, every meal served, and every guest welcomed helps preserve a pub that continues to bring people together, just as it has for generations.",
            pillar1: "Community Owned",
            pillar2: "Warm Hospitality",
            pillar3: "Local Produce",
            rootsImages: [
              `${STORAGE_BASE}/1781084597937-Gemini_Generated_Image_3ongbm3ongbm3ong.webp`,
              `${STORAGE_BASE}/1781084593652-Gemini_Generated_Image_zdu2vbzdu2vbzdu2.webp`,
              `${STORAGE_BASE}/1781084589375-Gemini_Generated_Image_b3lys7b3lys7b3ly.webp`,
              `${STORAGE_BASE}/1781080100388-Screenshot_20260530_212418.webp`,
              `${STORAGE_BASE}/1781080099243-Screenshot_20260530_212407.webp`,
              `${STORAGE_BASE}/1781080098132-Screenshot_20260530_212349.webp`,
            ],
            title: "A village pub, owned by the people it serves.",
            description:
              "Nestled in the heart of Marsh Baldon, The Seven Stars is one of the few community-owned pubs in Oxfordshire.",
            image: `${STORAGE_BASE}/1781085714533-SEVEN_STARS_2026_02_09-0008.webp`,
          },
        },
        {
          type: "AboutPhilosophy",
          order: 2,
          content: {
            philosophyQuote:
              "We believe a great British pub does three things well: serves excellent food, pours a proper drink, and makes everyone who walks through its doors feel at home.",
            title: "Our Hospitality Philosophy",
            quote:
              "We believe a great British pub does three things well: serves excellent food, pours a proper drink, and makes everyone who walks through its doors feel at home.",
            author: "The Seven Stars Team",
          },
        },
        {
          type: "AboutExperience",
          order: 3,
          content: {
            differentTag: "LIFE AT THE SEVEN STARS...",
            differentHeading: "Experience the",
            differentHeadingItalic: "best of both worlds.",
            differentDesc:
              "Walk into The Seven Stars and you'll find the character and warmth of a classic village. Local open fires, aged beams, and the hum of good conversation create an atmosphere that is both nostalgic and vibrantly alive.",
            differentImage: IMAGES.GALLERY_COZY,
            highlights: [
              "The character of a classic Oxfordshire village.",
              "Warmth of local open fires and aged beams.",
              "A place where everyone is welcome.",
            ],
            title: "Life at The Seven Stars...",
            subTitle: "More than a meal. More than a drink.",
            description:
              "The Seven Stars is the kind of place where time slows down. Set beside the village green, it welcomes walkers fresh from the countryside, families gathering around the table, friends meeting over a pint, and visitors discovering Marsh Baldon for the first time. In winter, the open fires invite you to linger indoors. In summer, the garden becomes the perfect place to settle in for the afternoon.",
            paragraph2:
              "Whatever brings you here, you'll leave having shared more than just good food and drink—you'll have experienced the warmth and easy charm of a pub that's been bringing people together for generations.",
          },
        },
        {
          type: "AboutAmenities",
          order: 4,
          content: {
            amenitiesTag: "WHAT WE OFFER",
            amenitiesHeading: "Pub Features & Amenities",
            title: "Pub Features & Amenities",
            amenities: [
              { icon: "Car", label: "Free Parking" },
              { icon: "Sun", label: "Beer Garden" },
              { icon: "Flame", label: "Open Fireplace" },
              { icon: "Beer", label: "Local Ales & Ciders" },
              { icon: "Home", label: "Private Barn" },
              { icon: "Music", label: "Live Music" },
              { icon: "CloudRain", label: "Covered Outdoor Space" },
            ],
          },
        },
        {
          type: "AboutCta",
          order: 5,
          content: {
            ctaHeading: "The Backdrop to Life's Celebrations",
            ctaDesc:
              "From intimate dinners and milestone birthdays to weddings, anniversaries, christenings, and private celebrations—The Seven Stars is a place to come together. For larger gatherings, our private barn offers a characterful setting where every celebration feels truly special.",
            ctaButtonUrl: "/contact",
            ctaButtonLabel: "Book a Table",
            title: "The Backdrop to Life's Celebrations",
            description:
              "From intimate dinners and milestone birthdays to weddings, anniversaries, christenings, and private celebrations—The Seven Stars is a place to come together. For larger gatherings, our private barn offers a characterful setting where every celebration feels truly special.",
            buttonText: "Book Table Now",
            buttonUrl:
              "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
            image: IMAGES.EXTERIOR_MAIN,
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // DINING PAGE
    // -------------------------------------------------------------
    {
      title: "Dining",
      slug: "dining",
      type: "static",
      isStatic: true,
      visibility: "published",
      description: "Dining Experience at Seven Stars",
      metaTitle: "Countryside Dining | The Seven Stars",
      metaDescription:
        "Fresh seasonal menus, Sunday roasts, and locally sourced Oxfordshire ingredients at The Seven Stars.",
      sections: [
        {
          type: "DiningHero",
          order: 0,
          content: {
            tagline: "SEASONAL DINING",
            headingPart1: "The Dining",
            headingItalicHighlight: "Experience",
            title: "The Dining Experience",
            backgroundImage: IMAGES.DINING_HALL,
          },
        },
        {
          type: "Dining",
          order: 1,
          content: {
            upperTag: "Food Tales",
            headingPart1: "The",
            headingItalicHighlight: "Dining",
            headingPart3: "Experience",
            mainQuote: "Honest food, thoughtfully prepared.",
            paragraph1:
              "At The Seven Stars, every dish begins with fresh, carefully sourced ingredients and a respect for the seasons. Rooted in the traditions of the British pub, our menu is complemented by subtle influences from the Middle East, Europe and South Asia, bringing fresh perspectives to familiar favourites.",
            paragraph2:
              "Whether you're stopping by for a leisurely lunch, sharing a cheese board over drinks, enjoying one of our open sandwiches, or ending your meal with our orange and cognac crème brûlée, every plate is prepared with care and designed to be enjoyed together.",
            btnLabel: "View Our Menus",
            btnUrl: "/menu",
            indoorCapacity: "76",
            gardenCapacity: "150",
            showcaseImage: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686621461-SEVEN_STARS_2026_02_09-145.webp",
            imageAlt: "Gourmet dish at Seven Stars",
            imageOverlayTitle: "Proper Food",
            imageOverlaySubtitle: "Honouring British Pub Tradition",
          },
        },
        {
          type: "DiningIntro",
          order: 2,
          content: {
            introTagline: "The Dining Experience",
            introHeadingPart1: "Serious food,",
            introHeadingItalic: "unfussy",
            introHeadingPart2: "hospitality.",
            introDesc1:
              "A great pub is as much about what's in the glass as what's on the plate. Alongside our seasonal menus, you'll find a carefully kept selection of cask ales, craft beers, fine wines, premium spirits, and cocktails, chosen to suit every occasion—from a quiet pint after a countryside walk to a celebratory toast with family and friends.",
            introDesc2:
              "What brings it all together is our approach to hospitality. Relaxed, genuine and without pretence, it's the kind of service that lets you settle in, linger a little longer, and enjoy good food, good drink and even better company.",
            introFeature1: "Locally Sourced Ingredients",
            introFeature2: "Seasonal Menus",
            introImage: `${STORAGE_BASE}/1780554493244-SEVEN_STARS_2026_02_09-120.webp`,
            title: "Serious food, unfussy hospitality.",
          },
        },
        {
          type: "DiningQuote",
          order: 3,
          content: {
            quote:
              "Food is the ingredient that binds us together, And at Seven Stars, we make sure it's extraordinary.",
            quotePart1:
              "Food is the ingredient that binds us together, And at Seven Stars, we make sure it's",
            quoteHighlight: "extraordinary.",
            author:
              "Food has always brought people together.\nAt The Seven Stars, we simply make it worth gathering for.",
          },
        },
        {
          type: "DiningPillars",
          order: 4,
          content: {
            upperTag: "OUR MENU",
            heading: "Classic Foundations,",
            headingHighlight: "Global Inspirations",
            title: "Classic Foundations, Global Inspirations",
            subtitle: "British Traditions. Worldly Flavours.",
            pillars: [
              {
                title: "British Classics",
                description:
                  "We serve British pub classics prepared properly. No shortcuts, just traditional recipes elevated with premium ingredients.",
                image: `${STORAGE_BASE}/1781686617797-SEVEN_STARS_2026_02_09-0113.webp`,
              },
              {
                title: "Seasonal Specials",
                description:
                  "Our specials draw on European, Middle Eastern and South Asian flavours, bringing a contemporary twist to the village pub.",
                image: `${STORAGE_BASE}/SEVEN_STARS_2026_02_09-342.webp`,
              },
              {
                title: "Not To Be Missed",
                description:
                  "Our fortnightly Indian Thali Nights and Sunday Roasts are designated the highlight of the week.",
                image: `${STORAGE_BASE}/1781195615052-WhatsAppImage2026-06-11at21.23.03.jpeg`,
              },
            ],
          },
        },
        {
          type: "DiningBarn",
          order: 5,
          content: {
            barnTagline: "PRIVATE DINING",
            barnHeading: "The",
            barnHeadingItalic: "Barn",
            barnDesc:
              "Set apart from the main pub, The Barn offers a warm and characterful setting for private gatherings. Whether you're hosting an intimate celebration, a family occasion or a small corporate event, it's a flexible space paired with thoughtful hospitality and seasonal menus.",
            barnImage: `${STORAGE_BASE}/1781085738861-SEVEN_STARS_2026_02_09-0040.webp`,
            capacityTitle: "Capacity",
            capacityDesc: "Designed for gatherings of up to 40 guests.",
            beerTentTitle: "Outdoor Extension",
            beerTentDesc:
              "A covered Beer Tent provides a flexible outdoor setting for larger celebrations.",
            barnCtaText: "Enquire Barn Hire",
          },
        },
        {
          type: "DiningOutdoor",
          order: 6,
          content: {
            title: "Outdoor Seating",
            description:
              "When the weather is kind, there's nowhere better to be than our garden overlooking the village green. Settle in for a leisurely meal, enjoy a drink with friends, or simply take in the peaceful surroundings.",
            outdoorHeading: "Outdoor",
            outdoorHeadingItalic: "Seating",
            outdoorDesc:
              "When the weather is kind, there's nowhere better to be than our garden overlooking the village green. Settle in for a leisurely meal, enjoy a drink with friends, or simply take in the peaceful surroundings.",
            outdoorImages: [
              `${STORAGE_BASE}/1781156724977-SEVEN_STARS_2026_02_09-0106.webp`,
              `${STORAGE_BASE}/1781686617797-SEVEN_STARS_2026_02_09-0113.webp`,
            ],
            outdoorCtaText: "Book a Table",
            outdoorCtaLink: "#",
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // MENU PAGE
    // -------------------------------------------------------------
    {
      title: "Menu",
      slug: "menu",
      type: "static",
      isStatic: true,
      visibility: "published",
      description: "Food and Drink Menus",
      metaTitle: "Food & Drink Menus | The Seven Stars",
      metaDescription:
        "Browse our lunch, dinner, Sunday roast, and drinks menus at The Seven Stars Marsh Baldon.",
      sections: [
        {
          type: "MenuHero",
          order: 0,
          content: {
            tagline: "SEASONAL SELECTION",
            headingPart1: "Food &",
            headingHighlight: "Drink Menus",
            title: "Food & Drink Menus",
            backgroundImage: `${STORAGE_BASE}/1780637784295-SEVEN_STARS_2026_02_09-34.webp`,
          },
        },
        {
          type: "MenuBook",
          order: 1,
          content: {
            sectionNumber: "03",
            tagline: "SEASONAL SELECTION",
            upperTag: "SEASONAL SELECTION",
            headingPart1: "Our",
            headingItalicHighlight: "Menu",
            title: "Our Menu",
            subtitle: "Our Menu",
            description:
              "At The Seven Stars, fresh, carefully sourced ingredients are at the heart of everything we serve, creating dishes that celebrate the seasons and the joy of sharing a meal.",
            locationName: "Marsh Baldon",
            locationCounty: "OXFORDSHIRE",
            ctaText: "ENQUIRE FOR PRIVATE DINING",
            ctaLink: "/contact",
            coverImage: IMAGES.FOOD_SPECIAL,
            mainMenuPdf: `${STORAGE_BASE}/1785413495467-summermenu2.pdf`,
            sundayMenuPdf: `${STORAGE_BASE}/1785413432718-SundayMenu.pdf`,
            dessertMenuPdf: `${STORAGE_BASE}/1785413456217-DessertMenu.pdf`,
            pdfUrl: `${STORAGE_BASE}/1785413495467-summermenu2.pdf`,
            menuPdfs: [
              `${STORAGE_BASE}/1785413495467-summermenu2.pdf`,
              `${STORAGE_BASE}/1785413432718-SundayMenu.pdf`,
              `${STORAGE_BASE}/1785413456217-DessertMenu.pdf`,
            ],
            pdfMenus: [
              {
                id: "main",
                name: "Main Menu",
                title: "MAIN MENU",
                url: `${STORAGE_BASE}/1785413495467-summermenu2.pdf`,
                pdfUrl: `${STORAGE_BASE}/1785413495467-summermenu2.pdf`,
              },
              {
                id: "sunday",
                name: "Sunday Menu",
                title: "SUNDAY MENU",
                url: `${STORAGE_BASE}/1785413432718-SundayMenu.pdf`,
                pdfUrl: `${STORAGE_BASE}/1785413432718-SundayMenu.pdf`,
              },
              {
                id: "dessert",
                name: "Dessert Menu",
                title: "DESSERT MENU",
                url: `${STORAGE_BASE}/1785413456217-DessertMenu.pdf`,
                pdfUrl: `${STORAGE_BASE}/1785413456217-DessertMenu.pdf`,
              },
            ],
            menuSections: [
              {
                id: "main",
                title: "MAIN MENU",
                pdf: `${STORAGE_BASE}/1785413495467-summermenu2.pdf`,
                pages: [
                  {
                    categories: [
                      {
                        name: "Small Plates",
                        items: [
                          {
                            name: "Marinated Olives",
                            price: "£4.95",
                            desc: "(VG) (GF)",
                          },
                          {
                            name: "Focaccia With Balsamic and Olive Oil",
                            price: "£5.95",
                            desc: "(VG)",
                          },
                          { name: "Devil Crispy Whitebait", price: "£6.50" },
                          {
                            name: "Honey BBQ Chicken Wings",
                            price: "£6.95",
                            desc: "Chives, Scallions (GF)",
                          },
                          {
                            name: "Halloumi Fries",
                            price: "£7.50",
                            desc: "With Honey Chili Sauce (GF/V)",
                          },
                        ],
                      },
                      {
                        name: "To Start",
                        items: [
                          {
                            name: "Soup Of The Day",
                            price: "£7.50",
                            desc: "Served with Sourdough",
                          },
                          {
                            name: "Pressed Beef Brisket",
                            price: "£11.95",
                            desc: "Oriental Coleslaw, Chimichurri",
                          },
                          {
                            name: "Hoisin Crispy Duck Salad",
                            price: "£10.95",
                            desc: "Cucumber, Scallions, Pomegranate, Roasted Cashew Nuts, Red Wine Gastrique",
                          },
                          {
                            name: "Arabic Crème Chicken Skewers",
                            price: "£10.50",
                            desc: "Chermoula, Scallions, Pomegranate, Levantine Spiced Salad (GF)",
                          },
                          {
                            name: "Spiced Home-Reared Lamb Kofta",
                            price: "£12.95",
                            desc: "Red Pepper Hummus, Lightly Spiced Onion, Tzatziki (GF)",
                          },
                          {
                            name: "Garlic & Chili King Prawns",
                            price: "£14.95",
                            desc: "Roasted Tomatoes, Sourdough",
                          },
                          {
                            name: "Truffle Arancini",
                            price: "£10.95",
                            desc: "Wild Creamy Mushroom Sauce, Parmigiano, Tarragon (V)",
                          },
                          {
                            name: "Harissa Roasted Heart Artichoke",
                            price: "£10.95",
                            desc: "Green Hummus, Pomegranate, Paprika & Pita Bread (VG)",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: "sunday",
                title: "SUNDAY MENU",
                pdf: `${STORAGE_BASE}/1785413432718-SundayMenu.pdf`,
                pages: [
                  {
                    categories: [
                      {
                        name: "Sunday Roasts (Served 12:00 - 18:00)",
                        items: [
                          {
                            name: "Slow-Roasted Sirloin of Beef",
                            price: "£22.50",
                            desc: "Yorkshire pudding, roast potatoes, seasonal vegetables, rich gravy",
                          },
                          {
                            name: "Roast Leg of English Lamb",
                            price: "£21.50",
                            desc: "Yorkshire pudding, roast potatoes, mint sauce, seasonal vegetables",
                          },
                          {
                            name: "Free-Range Roast Chicken",
                            price: "£19.50",
                            desc: "Sage & onion stuffing, Yorkshire pudding, roast potatoes, gravy",
                          },
                          {
                            name: "Nut Roast & Mushroom Tart",
                            price: "£17.50",
                            desc: "Vegetarian gravy, roast potatoes, seasonal vegetables (V/VG)",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: "dessert",
                title: "DESSERT MENU",
                pdf: `${STORAGE_BASE}/1785413456217-DessertMenu.pdf`,
                pages: [
                  {
                    categories: [
                      {
                        name: "Desserts",
                        items: [
                          {
                            name: "Orange & Cognac Crème Brûlée",
                            price: "£9.00",
                            desc: "Classic rich burnt custard infused with orange zest and cognac",
                          },
                          {
                            name: "Warm Chocolate Lava Cake",
                            price: "£9.50",
                            desc: "Vanilla bean gelato, fresh berries",
                          },
                          {
                            name: "Sticky Toffee Pudding",
                            price: "£8.50",
                            desc: "Warm butterscotch sauce, clotted cream",
                          },
                          {
                            name: "Selection of Artisan Cheeses",
                            price: "£11.95",
                            desc: "Local Oxfordshire cheeses, biscuits, chutney",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          type: "MenuCurated",
          order: 2,
          content: {
            upperTag: "THE COLLECTION",
            heading: "Curated Courses",
            menuCategories: [
              {
                title: "Small Plates & Starters",
                image: `${STORAGE_BASE}/1780637679964-SEVEN_STARS_2026_02_09-265.webp`,
                items: [
                  "Marinated Olives",
                  "Focaccia With Balsamic",
                  "Devil Crispy Whitebait",
                  "Honey BBQ Chicken Wings",
                  "Truffle Arancini",
                ],
              },
              {
                title: "Pub Classics",
                image: `${STORAGE_BASE}/1780637682165-SEVEN_STARS_2026_02_09-235.webp`,
                items: [
                  "Beer-Battered Haddock & Chips",
                  "Seven Stars Cheeseburger",
                  "Fish & Chips",
                  "Classic Burger",
                ],
              },
              {
                title: "Mains",
                image: `${STORAGE_BASE}/1780637684315-SEVEN_STARS_2026_02_09-344.webp`,
                items: [
                  "Pan-Seared Duck Breast",
                  "Golden Squash Risotto",
                  "Arabic Crème Chicken Skewers",
                  "Spiced Lamb Kofta",
                  "Garlic & Chili King Prawns",
                ],
              },
              {
                title: "Sunday Roast",
                image: `${STORAGE_BASE}/1780637685212-SEVEN_STARS_2026_02_09-94.webp`,
                description: "Served every Sunday 12:00 – 18:00",
                items: [
                  "Slow-Roasted Sirloin of Beef",
                  "Roast Leg of English Lamb",
                  "Free-Range Roast Chicken",
                  "Nut Roast & Mushroom Tart",
                ],
              },
              {
                title: "Desserts",
                image: `${STORAGE_BASE}/1781164162893-SEVEN_STARS_2026_02_09-0142.webp`,
                items: [
                  "Orange & Cognac Crème Brûlée",
                  "Warm Chocolate Lava Cake",
                  "Sticky Toffee Pudding",
                  "Artisan Cheese Selection",
                ],
              },
            ],
          },
        },
        {
          type: "MenuCellar",
          order: 3,
          content: {
            tagline: "THE CELLAR",
            heading: "We take our drinks",
            headingHighlight: "as seriously as our food.",
            title: "The Cellar",
            description:
              "A perfectly kept pint, a thoughtfully chosen wine or a favourite cocktail—whatever your drink of choice, you'll find a bar that's stocked with care. Alongside local ales, lagers and ciders, we proudly support producers from across the region.",
            sideImage: `${STORAGE_BASE}/1781086062051-SEVEN_STARS_2026_02_09-5.webp`,
          },
        },
        {
          type: "MenuIntro",
          order: 4,
          content: {
            title: "Dietary Options & Special Nights",
            subtext:
              "Don't miss our fortnightly Indian Thali Nights and seasonal specials, bringing exciting new flavours to Marsh Baldon throughout the year.",
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // EVENTS PAGE
    // -------------------------------------------------------------
    {
      title: "Events & Functions",
      slug: "events",
      type: "static",
      isStatic: true,
      visibility: "published",
      description: "Pub Events & Private Hiring",
      metaTitle: "Events & Celebrations | The Seven Stars",
      metaDescription:
        "Live music, pub quizzes, weddings, and private barn hires at The Seven Stars Marsh Baldon.",
      sections: [
        {
          type: "EventsHero",
          order: 0,
          content: {
            tagline: "OCCASIONS & CELEBRATIONS",
            headingPart1: "Events &",
            headingHighlight: "Celebrations",
            title: "Events & Celebrations",
            backgroundImage: `${STORAGE_BASE}/1780554968912-SEVEN_STARS_2026_02_09-122.webp`,
          },
        },
        {
          type: "UpcomingEvents",
          order: 1,
          content: {
            upperTag: "SEVEN STARS CALENDAR",
            heading: "Upcoming & Past Occasions",
            title: "Upcoming and Past Events",
            description:
              "There's always something happening at The Seven Stars. Discover our upcoming dining experiences, seasonal celebrations and community events, or look back at some of the memorable moments we've shared together.",
            upcomingEvents: [
              {
                title: "Quiz Night",
                date: "12th Aug, 26th Aug",
                time: "7:30 PM",
                category: "PUB EVENT",
                highlight: "Test your trivia knowledge & win prizes",
                description:
                  "Join us for our popular Quiz Night at The Seven Stars! Test your knowledge, enjoy great drinks, and compete for exciting prizes with friends.",
                image: `https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/10/Quizz-Poster-New.jpg`,
              },
              {
                title: "Classic Car Show",
                date: "18th Aug, 15th Sep",
                time: "5:00 PM",
                category: "SPECIAL GATHERING",
                highlight: "Vintage cars & classics on the green",
                description:
                  "Admire a fantastic collection of classic cars and vintage vehicles on Marsh Baldon Green. Enjoy great food and drinks while meeting fellow car enthusiasts.",
                image: `https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2026/07/seven-stars-car-show.jpg`,
              },
              {
                title: "Indian Desi Thali",
                date: "20th Aug, 3rd & 17th Sep",
                time: "6:00 PM",
                category: "DINING EXPERIENCE",
                highlight: "Authentic Indian curries & fresh naan",
                description:
                  "Experience our popular Indian Desi Thali nights, featuring authentic curries, daals, warm naan, and delicious traditional side dishes.",
                image: `https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2026/06/Desi-thali.jpg`,
              },
              {
                title: "Aunt Sally Season",
                date: "Starting Soon",
                time: "6:30 PM",
                category: "TRADITIONAL PUB SPORT",
                highlight: "Traditional Oxfordshire pub game",
                description:
                  "Get ready for the traditional Oxfordshire Aunt Sally pub game season at The Seven Stars! Join the local team or cheer from the garden.",
                image: `https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2026/04/Aunt-Sally.jpg`,
              },
              {
                title: "Mother's Day Lunch",
                date: "30th March",
                time: "Lunchtime",
                category: "SPECIAL EVENT",
                highlight: "2/3 Course Set Luncheon",
                description:
                  "Celebrate Mother's Day with a special 2 or 3 course set luncheon at Seven Stars at Marsh Baldon. Includes a complimentary glass of prosecco for moms! Call 01865 343337 to book.",
                image: `${STORAGE_BASE}/1779093878328-481171001_957353706531406_1040071741557670337_nlow1.webp`,
              },
            ],
          },
        },
        {
          type: "InstagramRibbon",
          order: 2,
          content: {
            title: "Follow Us on Intagram",
            subtitle: "https://www.instagram.com/sevenstarsatmarshbaldon/",
            instagramAccountId: "27233851499571609",
            instagramToken:
              "IGAARzG8c1FB5BZAFpMR2tpZAnVtZA1MyX1pnZAGtPUld2dUVVZADk0U3lXTTgxZAk4zb1JmZAWFjMmM1b3A3UnhpbUhfdHd6VzBfaVE1MWpKdm1sXzdsZAl9tOGgwSlZAoV2ZAhT2h2THZAFWmFRQjYya1ZApSWxiams1eFRiTHNuMmVkczAwdwZDZD",
            posts: [],
          },
        },
        {
          type: "WhatWeHost",
          order: 3,
          content: {
            tagline: "PERFECT FOR EVERY OCCASION",
            heading: "What We Host",
            title: "Occasions we host",
            subtext:
              "From intimate celebrations to large gatherings, we have the perfect setting for every occasion.",
            items: [
              "Birthday celebrations and milestone occasions",
              "Family gatherings and reunion dinners",
              "Corporate lunches and team away days",
              "Wedding receptions and pre-wedding celebrations",
              "Summer BBQs and garden parties",
              "Christmas and New Year's celebrations",
              "Community events and fundraisers",
            ],
            image: `${STORAGE_BASE}/1781164162893-SEVEN_STARS_2026_02_09-0142.webp`,
          },
        },
        {
          type: "EventsCapabilities",
          order: 4,
          content: {
            upperTag: "OUR SPACES",
            heading: "Function Features",
            headingHighlight: "& Spaces",
            title: "Function Features & Spaces",
            capabilities: [
              {
                title: "Main Bar & Dining Area",
                description:
                  "Seats 76 guests, warmed by an open fireplace in winter and filled with light in summer.",
                iconName: "PartyPopper",
                image: `${STORAGE_BASE}/1781160176550-SEVEN_STARS_2026_02_09-137.webp`,
              },
              {
                title: "The Private Barn",
                description:
                  "Flexible private space accommodating up to 40 guests for celebrations or corporate dining, with covered Beer Tent option.",
                iconName: "Warehouse",
                image: `${STORAGE_BASE}/1781686607452-SEVEN_STARS_2026_02_09-0028.webp`,
              },
              {
                title: "Sprawling Beer Garden",
                description:
                  "One of the finest beer gardens in Oxfordshire, seating 120 to 150 guests for slow summer afternoons.",
                iconName: "Sun",
                image:
                  "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781195516243-IMG_4523.webp",
              },
            ],
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // GALLERY PAGE
    // -------------------------------------------------------------
    {
      title: "Gallery",
      slug: "gallery",
      type: "static",
      isStatic: true,
      visibility: "published",
      description: "Photo Gallery",
      metaTitle: "Photo Gallery | The Seven Stars",
      metaDescription:
        "Take a visual tour of The Seven Stars pub, gardens, dining room, and events.",
      sections: [
        {
          type: "GalleryHero",
          order: 0,
          content: {
            tagline: "VISUAL JOURNEY",
            headingPart1: "Photo",
            headingItalicHighlight: "Gallery",
            title: "Photo Gallery",
            backgroundImage: IMAGES.GALLERY_BAR,
          },
        },
        {
          type: "GalleryGrid",
          order: 1,
          content: {
            title: "Our Image Collection",
            description:
              "From cosy interiors and the garden overlooking the village green to memorable meals and special occasions...explore the spaces, flavours and moments that make The Seven Stars what it is.",
            images: ALL_SUPABASE_FILES.filter(
              (url) => !url.endsWith(".pdf") && !url.endsWith(".mp3"),
            ).map((url, idx) => ({
              url: url,
              src: url,
              category:
                idx % 4 === 0
                  ? "Exterior"
                  : idx % 4 === 1
                    ? "Food"
                    : idx % 4 === 2
                      ? "Interior"
                      : "Events",
              title: `Seven Stars Gallery Photo ${idx + 1}`,
            })),
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // OUR STORY PAGE
    // -------------------------------------------------------------
    {
      title: "Our Story",
      slug: "our-story",
      type: "static",
      isStatic: true,
      visibility: "published",
      description: "Heritage & Community History",
      metaTitle: "Our Story | The Seven Stars Marsh Baldon",
      metaDescription:
        "Discover how the community of Marsh Baldon united to save and operate The Seven Stars.",
      sections: [
        {
          type: "StoryHero",
          order: 0,
          content: {
            tagline: "OUR STORY",
            headingPart1: "Our Story &",
            headingItalicHighlight: "Community",
            title: "Saved by the community. Sustained by its people.",
            backgroundImage: `${STORAGE_BASE}/1781073689384-SEVEN_STARS_2026_02_09-0104.webp`,
          },
        },
        {
          type: "StoryIntro",
          order: 1,
          content: {
            introTagline: "Our Story",
            introHeading: "Saved by the community.",
            introHeadingItalic: "Sustained by its people.",
            introDesc:
              "The Seven Stars is more than a village pub—it is a story of a community coming together to preserve a place they couldn't imagine losing.",
            title: "A Pub by the People, for the People",
            content:
              "The Seven Stars is one of the few pubs in the country to be owned by the very community it serves. When its future was uncertain, the people of Marsh Baldon came together to secure it, ensuring this much-loved village pub would remain part of local life for generations to come.\n\nThat spirit continues to shape everything we do. While our roots are firmly in the village, our doors are open to everyone—whether you're a familiar face or visiting for the very first time. Every meal shared, every pint poured and every gathering held here helps sustain a place that belongs not to one person, but to an entire community.\n\nMore than a pub, The Seven Stars is a shared legacy—cared for by its people and enjoyed by all who walk through its doors.",
            image: `${STORAGE_BASE}/1781686607452-SEVEN_STARS_2026_02_09-0028.webp`,
          },
        },
        {
          type: "StoryTimeline",
          order: 2,
          content: {
            title: "Key Milestones in Our Journey",
            timelineSteps: [
              {
                subtitle: "CLOSURE",
                year: "Late 2012",
                title: "Late 2012",
                desc: "After years of instability, the pub closed its doors. The villages lost a 350-year-old central hub for community joy.",
                gridClass:
                  "lg:col-span-2 lg:col-start-1 lg:row-start-1 md:col-span-2 md:col-start-1 md:row-start-1",
                lines: {
                  mobile: "down",
                  tablet: "right",
                  desktop: "right",
                },
              },
              {
                subtitle: "MISSION",
                year: "Dec 2012",
                title: "Dec 2012",
                desc: "What began as conversations turned into a mission. Residents formed the Baldons and Nuneham Community Society (BNCS).",
                gridClass:
                  "lg:col-span-2 lg:col-start-3 lg:row-start-1 md:col-span-2 md:col-start-3 md:row-start-1",
                lines: {
                  mobile: "down",
                  tablet: "down",
                  desktop: "right",
                },
              },
              {
                subtitle: "REOPENING",
                year: "Mar 2013",
                title: "Mar 2013",
                desc: "Through community investment and grants, the society purchased the pub. On March 30th, the Seven Stars reopened.",
                gridClass:
                  "lg:col-span-2 lg:col-start-5 lg:row-start-1 md:col-span-2 md:col-start-1 md:row-start-2",
                lines: {
                  mobile: "down",
                  tablet: "right",
                  desktop: "down-left",
                },
              },
              {
                subtitle: "MILESTONES",
                year: "2016",
                title: "The Journey",
                desc: "Named CAMRA Pub of the Year in 2016. Continuous improvements and community support helped navigate challenges like COVID.",
                gridClass:
                  "lg:col-span-2 lg:col-start-4 lg:row-start-2 md:col-span-2 md:col-start-3 md:row-start-2",
                lines: {
                  mobile: "down",
                  tablet: "down",
                  desktop: "left",
                },
              },
              {
                subtitle: "RENEWAL",
                year: "2023 & Beyond",
                title: "2023 & Beyond",
                desc: "Under new stewards Namit and Sunit, the pub stays true to its roots with fresh energy. A true story of renewal.",
                gridClass:
                  "lg:col-span-2 lg:col-start-2 lg:row-start-2 md:col-span-2 md:col-start-2 md:row-start-3",
                lines: {
                  mobile: "none",
                  tablet: "none",
                  desktop: "none",
                },
              },
            ],
            milestones: [
              {
                year: "1600s",
                title: "Pub Opened",
                description:
                  "Established as a roadside tavern facing the village green.",
              },
              {
                year: "2013",
                title: "Community Buyout",
                description:
                  "Over 75 local shareholders rallied to save the pub.",
              },
              {
                year: "Present",
                title: "Thriving Hub",
                description:
                  "Recognized as one of Oxfordshire's premier community pubs.",
              },
            ],
          },
        },
        {
          type: "StoryHub",
          order: 3,
          content: {
            hubTagline: "COMMUNITY HUB",
            hubHeading: "A Pub By the People,",
            hubHeadingItalic: "For the People",
            hubDesc1:
              "We are truly community-owned, bought by the community and restored by it. This takes our attention away from short-term profit to long-term stability.",
            hubDesc2:
              "Our doors are open to both locals and visitors alike. The love showered by our people has made us so resilient. We are always going to be a people-first pub, delivering quality food and warm service to guests.",
            hubDesc3:
              "We value our community members who not only saved us but are continually helping us grow by supporting in-house events.",
            cardTitle: "Live Music & Events",
            cardDesc:
              "From quiz nights and live acoustic sessions to seasonal celebrations — there's always something on at The Seven Stars.",
            rightImage: `${STORAGE_BASE}/1781084589375-Gemini_Generated_Image_b3lys7b3lys7b3ly.webp`,
            rightImageTitle: "The Seven Stars, Marsh Baldon, c. 1868",
            exp1: "Friends catching up over a pint",
            exp2: "Families enjoying Sunday lunch",
            exp3: "Neighbours celebrating special moments",
            exp4: "Visitors discovering a true village pub",
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // CHRISTMAS PAGE
    // -------------------------------------------------------------
    {
      title: "Christmas 2026",
      slug: "christmas",
      type: "static",
      isStatic: true,
      visibility: "published",
      description: "Christmas Festive Celebrations",
      metaTitle: "Christmas 2026 | The Seven Stars",
      metaDescription:
        "Celebrate the festive season at The Seven Stars. View our Christmas lunch and dinner menus.",
      sections: [
        {
          type: "ChristmasVisibility",
          order: 0,
          content: {
            enabled: true,
            isPublished: true,
            visibility: "published",
            showInNav: true,
          },
        },
        {
          type: "ChristmasHero",
          order: 1,
          content: {
            tagline: "FESTIVE SEASON 2026",
            headingPart1: "Celebrate",
            headingItalicHighlight: "Christmas",
            headingSuffix: "at Seven Stars",
            title: "Celebrate Christmas at Seven Stars",
            primaryButtonText: "RESERVE YOUR TABLE",
            primaryButtonUrl:
              "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
            secondaryButtonText: "DISCOVER MENUS",
            secondaryButtonUrl: "#menus",
            backgroundImage: `${STORAGE_BASE}/1782451657572-christmas-pub-hero.webp`,
            musicTrack: `${STORAGE_BASE}/1782451660185-christmas-tune.mp3`,
          },
        },
        {
          type: "ChristmasIntro",
          order: 2,
          content: {
            tagline: "WARMTH & FESTIVE CHEER 🎄",
            headingPart1: "Celebrate Christmas at",
            headingItalicHighlight: "Seven Stars in Marsh Baldon!",
            title: "Celebrate Christmas at Seven Stars in Marsh Baldon!",
            description:
              "Are you looking for the perfect place to celebrate Christmas with your loved ones? Located in Marsh Baldon, Oxford, Seven Stars is here to make your Christmas Day magical!",
            whyTitle: "WHY CHOOSE SEVEN STARS:",
            whyBullets: [
              "Cosy Pub with beautiful Christmas décor, spreading warmth and festive cheer.",
              "Savor festive Christmas dishes prepared by our chefs for the occasion.",
              "Our Pub serves wine, cocktails, and seasonal drinks to enhance Christmas day.",
            ],
            showcaseImage: `${STORAGE_BASE}/1782451876166-christmas-santaclaus.webp`,
          },
        },
        {
          type: "ChristmasFeatures",
          order: 3,
          content: {
            tagline: "EXCLUSIVE EXPERIENCES 🎁",
            title: "Special Christmas Party Features",
            headingPart1: "Special Christmas",
            headingItalicHighlight: "Party Features",
            highlights: [
              "Special Seating arrangements tailored for families and group bookings.",
              "Elegant options for Private Celebrations and large corporate/friend gatherings.",
              "Book Before October to secure a £20 Voucher reward.",
            ],
            rewardTag: "EARLY BOOKING REWARD",
            rewardTitle: "Secure a £20 Voucher",
            rewardDescription:
              "Book your party of 5 or more before 31st of October to receive a complimentary £20 voucher redeemable in the New Year.",
            termsText: "*Terms and Conditions apply.",
            cardFooterNote:
              "Tables are filling fast – don't miss your chance to make this Christmas unforgettable!",
            ctaText: "BOOK YOUR CHRISTMAS PARTY NOW!",
            ctaLink:
              "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
          },
        },
        {
          type: "ChristmasMenus",
          order: 4,
          content: {
            tagline: "CULINARY DELIGHTS 🥂",
            heading: "Download Our",
            headingHighlight: "Festive Menus",
            title: "Download Our Festive Menus",
            description:
              "Plan your holiday celebration with our festive lunch, dinner, and Christmas Day menu packages.",
            pdfUrl: `${STORAGE_BASE}/1785413495467-summermenu2.pdf`,
            menusList: [
              {
                title: "Festive Party Menu",
                subtitle:
                  "Our Festive Menu Is Here! Book Your Table and Enjoy Holiday Favorites!",
                description:
                  "Don't forget if you book your Christmas Party before the end of October 2025 you will receive a £20 voucher to use towards your booking. Minimum of 8 people dining and booking made before end of October 2025.",
                link: `${STORAGE_BASE}/1785413495467-summermenu2.pdf`,
                image:
                  "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/christmas-celebration-2.webp",
                highlights: [
                  "Smoked Salmon Starter",
                  "Traditional Roast Turkey",
                  "Spiced Plum Pudding",
                ],
              },
              {
                title: "Christmas Day Menu",
                subtitle:
                  "Indulge in our Special Christmas Menu: From Turkey to Truffles!",
                description:
                  "Why Cook on Christmas Day when we can do it for you?\nBook your Christmas Lunch with us here at Seven Stars instead.\nView our Christmas Day Menu below",
                link: `${STORAGE_BASE}/1785413432718-SundayMenu.pdf`,
                image:
                  "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/25-dec.webp",
                highlights: [
                  "Glass of Champagne on arrival",
                  "Slow-Roasted Prime Beef Sirloin",
                  "Traditional Christmas Pudding with Brandy Butter",
                ],
              },
              {
                title: "Children's Christmas Day Menu",
                subtitle: "Little Elves Festive Feast",
                description:
                  "To make Christmas extra special for families, we've prepared a dedicated children's menu — light, delicious, and perfect for younger guests.",
                link: `${STORAGE_BASE}/1785413456217-DessertMenu.pdf`,
                image:
                  "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/children-christmas.webp",
                highlights: [
                  "Mini Turkey Roast with all the trimmings",
                  "Ice Cream Sundae",
                  "Festive Fruit Punch",
                ],
              },
            ],
          },
        },
        {
          type: "ChristmasDishes",
          order: 5,
          content: {
            tagline: "VISUAL FEAST",
            heading: "Our Christmas",
            headingHighlight: "Special Dishes",
            title: "Featured Festive Dishes",
            dishesList: [
              {
                name: "Roasted Norfolk Turkey",
                tagline: "TRADITIONAL MAIN",
                description:
                  "Sage & onion stuffing, pigs in blankets, roast potatoes, and cranberry jus.",
                image: `${STORAGE_BASE}/1781687988901-SEVEN_STARS_2026_02_09-81.webp`,
              },
              {
                name: "Cured Scottish Salmon",
                tagline: "FESTIVE STARTER",
                description:
                  "Citrus-cured salmon, pickled cucumber, radish, and herb emulsion.",
                image: `${STORAGE_BASE}/1781078308869-82e86b0f-9c24-42cb-873a-73ee51ed02cb.webp`,
              },
              {
                name: "Traditional Christmas Pudding",
                tagline: "FESTIVE DESSERT",
                description:
                  "Served warm with rich brandy butter, vanilla cream, and festive holly.",
                image: `${STORAGE_BASE}/1782451835616-christmas-children-feast.webp`,
              },
            ],
          },
        },
        {
          type: "ChristmasReservation",
          order: 6,
          content: {
            title: "Book Your Christmas Table",
            description: "Early booking recommended for holiday parties.",
            buttonText: "Reserve Christmas Table",
            buttonUrl:
              "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // CONTACT PAGE
    // -------------------------------------------------------------
    {
      title: "Contact",
      slug: "contact",
      type: "static",
      isStatic: true,
      visibility: "published",
      description: "Contact Details & Table Reservations",
      metaTitle: "Contact & Book a Table | The Seven Stars",
      metaDescription:
        "Contact information, address, map, and table booking for The Seven Stars Marsh Baldon.",
      sections: [
        {
          type: "ContactHero",
          order: 0,
          content: {
            tagline: "FIND US IN MARSH BALDON",
            headingPart1: "Get in",
            headingItalicHighlight: "Touch",
            backgroundImage: `${STORAGE_BASE}/1781164162893-SEVEN_STARS_2026_02_09-0142.webp`,
          },
        },
        {
          type: "ContactInfo",
          order: 1,
          content: {
            infoHeading: "We'd Love to",
            infoHeadingItalic: "Hear from You",
            infoDesc:
              "Whether you have a question about reservations, private hire, or anything else, our team is ready to assist.",
            locationTitle: "The Seven Stars",
            addressLine1: "The Green, Baldon Lane, Marsh Baldon",
            addressLine2: "Oxford - OX44 9LP",
            phoneNumber: "01865 343337",
            emailAddress: "info@sevenstarsatmb.co.uk",
            openingHours: [
              {
                days: "Monday",
                hours: "CLOSED (Open Bank Holidays)",
              },
              {
                days: "Tuesday - Saturday",
                hours: "12:00 - 23:00",
              },
              {
                days: "Sunday",
                hours: "12:00 - 20:00",
              },
            ],
            mapHeading: "Locate Us",
            mapDescription:
              "The Seven Stars, The Green, Marsh Baldon, Oxford, OX44 9LP",
            mapEmbedUrl:
              "https://maps.google.com/maps?q=The%20Seven%20Stars%20at%20Marsh%20Baldon,%20Oxford,%20OX44%209LP&t=&z=16&ie=UTF8&iwloc=&output=embed",
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // BLOG PAGE
    // -------------------------------------------------------------
    {
      title: "Blog",
      slug: "blog",
      type: "static",
      isStatic: true,
      visibility: "published",
      description: "Blog & Articles Landing Page",
      metaTitle: "Blog & News | The Seven Stars",
      metaDescription:
        "Read the latest news, recipe guides, and stories from The Seven Stars Marsh Baldon.",
      sections: [
        {
          type: "BlogHero",
          order: 0,
          content: {
            title: "Articles & News",
            backgroundImage: IMAGES.BLOG_SUMMER,
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // PRIVACY POLICY PAGE
    // -------------------------------------------------------------
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      type: "static",
      isStatic: true,
      visibility: "published",
      description: "Privacy Policy Information",
      metaTitle: "Privacy Policy | The Seven Stars",
      metaDescription: "Privacy Policy for The Seven Stars website.",
      sections: [
        {
          type: "PrivacyPolicyContent",
          order: 0,
          content: {
            title: "Privacy Policy",
            introduction:
              "We value your privacy and are committed to protecting your personal data.",
            backgroundImage: IMAGES.HERO_INTERIOR,
            content: `<h3>1. Important Information and Who We Are</h3><p>Seven Stars, located in Marsh Baldon, Oxford (referred to as "we", "us" or "our" in this privacy policy) is the controller and responsible for this website.</p><p>If you have any questions about this privacy policy, including any requests to exercise your legal rights, please contact us using the details set out below.</p><h3>2. The Data We Collect About You</h3><p>Personal data, or personal information, means any information about an individual from which that person can be identified.</p>`,
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // TERMS OF SERVICE PAGE
    // -------------------------------------------------------------
    {
      title: "Terms of Service",
      slug: "terms-of-service",
      type: "static",
      isStatic: true,
      visibility: "published",
      description: "Terms of Service Information",
      metaTitle: "Terms of Service | The Seven Stars",
      metaDescription:
        "Terms of Service for using The Seven Stars website and table reservations.",
      sections: [
        {
          type: "TermsOfServiceContent",
          order: 0,
          content: {
            title: "Terms of Service",
            introduction:
              "Please read these Terms of Service carefully before accessing our website or placing table bookings.",
            backgroundImage: IMAGES.HERO_INTERIOR,
            content: `<h3>1. Acceptance of Terms</h3><p>By accessing or using any part of our website or reservation service, you agree to be bound by these Terms of Service.</p><h3>2. Bookings, Cancellations and Deposits</h3><p>We use third-party tools to manage reservations. Bookings can be modified or canceled up to 24 hours prior to your scheduled time.</p>`,
          },
        },
      ],
    },
  ];

  for (const p of pagesData) {
    const { sections, ...pageFields } = p;
    await prisma.section.deleteMany({
      where: { page: { slug: pageFields.slug } },
    });
    await prisma.page.deleteMany({ where: { slug: pageFields.slug } });
    const page = await prisma.page.create({
      data: {
        ...pageFields,
        sections: {
          create: sections,
        },
      },
    });
    console.log(
      `  └─ Created page: ${page.title} (/${page.slug}) with ${sections.length} sections`,
    );
  }

  // 6. Create Blog Posts (Page type "blog" with "BlogDetail" section)
  console.log(
    "📰 Creating sample blog posts with real Supabase Storage images...",
  );

  const blogsData = [
    {
      title: "Summer Evenings on Marsh Baldon Green",
      slug: "summer-in-marsh-baldon",
      type: "blog",
      isStatic: false,
      visibility: "published",
      featuredImage: IMAGES.BLOG_SUMMER,
      metaTitle: "Summer Evenings on Marsh Baldon Green - Seven Stars",
      metaDescription:
        "Enjoy outdoor dining and craft beer on the village green this summer.",
      sections: [
        {
          type: "BlogDetail",
          order: 0,
          content: {
            excerpt:
              "Discover how we are celebrating summer with wood-fired pizzas, outdoor bar taps, and acoustic Sunday sessions on the green.",
            content:
              "<p>Summer has arrived at Marsh Baldon! Join us as we serve fresh pizzas, seasonal cocktails, and ice-cold cask ales on our sunny garden patio.</p><p>Our garden bar is now open every Friday to Sunday evening.</p>",
            postType: "blog",
            link: "",
            area: "Marsh Baldon",
            readTime: "3 min read",
            tag: "Seasonal Update",
            views: 142,
            date: "10 Aug 2026",
          },
        },
      ],
    },
    {
      title: "Meet Our Local Farms & Food Suppliers",
      slug: "locally-sourced-oxfordshire-produce",
      type: "blog",
      isStatic: false,
      visibility: "published",
      featuredImage: IMAGES.BLOG_LOCAL,
      metaTitle: "Meet Our Local Farms & Food Suppliers - Seven Stars",
      metaDescription:
        "Learn about the local farmers who supply our kitchen daily.",
      sections: [
        {
          type: "BlogDetail",
          order: 0,
          content: {
            excerpt:
              "A deep dive into our farm-to-table culinary philosophy and our partnerships with local growers.",
            content:
              "<p>We take pride in serving high-quality dishes made with produce grown right here in Oxfordshire.</p><p>From local organic vegetables to free-range meat, discover the farms behind your favorite dishes.</p>",
            postType: "news",
            link: "",
            area: "Oxfordshire",
            readTime: "5 min read",
            tag: "Food & Drink",
            views: 98,
            date: "05 Aug 2026",
          },
        },
      ],
    },
  ];

  for (const b of blogsData) {
    const { sections, ...blogFields } = b;
    await prisma.section.deleteMany({
      where: { page: { slug: blogFields.slug } },
    });
    await prisma.page.deleteMany({ where: { slug: blogFields.slug } });
    const blogPage = await prisma.page.create({
      data: {
        ...blogFields,
        sections: {
          create: sections,
        },
      },
    });
    console.log(
      `  └─ Created blog post: ${blogPage.title} (/blog/${blogPage.slug})`,
    );
  }

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
