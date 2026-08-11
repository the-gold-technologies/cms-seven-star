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
            tagLabel: "Gastro Pub Experience",
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
            btnLabel: "Explore Full Menu",
            btnSublabel: "See our complete seasonal collection",
            btnUrl: "/menu",
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
                alt: "Pub Atmosphere",
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
                  "The atmosphere at Seven Stars is unmatched. From the warm welcome to the exquisite Middle Eastern influences in their Sunday roast, it's a truly wonderful pub experience.",
                author: "James Harrison",
                name: "James Harrison",
                role: "Local Food Critic",
                comment:
                  "The atmosphere at Seven Stars is unmatched. From the warm welcome to the exquisite Middle Eastern influences in their Sunday roast, it's a truly wonderful pub experience.",
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
                role: "Regular Guests",
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
            tagline: "Countryside Gastro Pub",
            footerDescription:
              "Born from a passion for exceptional hospitality, Seven Stars merges the warmth of a countryside pub with the sophistication of a premium dining experience.",
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
            mainQuote:
              "Our kitchen works with fresh, carefully sourced ingredients to create craft-heartening dishes that become the season to bond together.",
            paragraph1:
              "At The Seven Stars, every dish begins with fresh, carefully sourced ingredients and a respect for the seasons. Rooted in the traditions of the British pub, our menu is complemented by subtle influences from the Middle East, Europe and South Asia, bringing fresh perspectives to familiar favourites.",
            paragraph2:
              "Whether you're stopping by for a leisurely lunch, sharing a cheese board over drinks, enjoying one of our open sandwiches, or ending your meal with our orange and cognac crème brûlée, every plate is prepared with care and designed to be enjoyed together.",
            btnLabel: "View Our Menus",
            btnUrl: "/menu",
            indoorCapacity: "76",
            gardenCapacity: "150",
            showcaseImage:
              "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686621461-SEVEN_STARS_2026_02_09-145.webp",
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
            introFeature1: "EXPERT CHEFS",
            introFeature2: "FRESH FLAVORS",
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
                image: `${STORAGE_BASE}/1779094138324-food-gourmet.webp`,
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
            headingPart1: "Our ",
            headingHighlight: "Menus",
            backgroundImage: `${STORAGE_BASE}/1780637784295-SEVEN_STARS_2026_02_09-34.webp`,
          },
        },
        {
          type: "MenuBook",
          order: 1,
          content: {
            sectionNumber: "03",
            tagline: "SEASONAL SELECTION",
            headingPart1: "Our",
            headingItalicHighlight: "Menu",
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
            quote: "Dietary Options & Special Nights",
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
            backgroundImage: `${STORAGE_BASE}/1780554968912-SEVEN_STARS_2026_02_09-122.webp`,
          },
        },
        {
          type: "UpcomingEvents",
          order: 1,
          content: {
            upperTag: "SEVEN STARS CALENDAR",
            heading: "Upcoming & Past Occasions",
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
            heading: "Occasions We Host",
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
            image: `https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780555071861-Weddingpic.webp`,
          },
        },
        {
          type: "EventsCapabilities",
          order: 4,
          content: {
            upperTag: "OUR SPACES",
            heading: "Function Features",
            headingHighlight: "& Spaces",
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
            galleryItems: [
              {
                id: 1,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781086645604-SEVEN_STARS_2026_02_09-169.webp",
                category: "Food",
                aspect: "aspect-square",
                title: "Seven Stars Gallery Photo 1",
              },
              {
                id: 2,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779096151673-gallery-8.webp",
                category: "Outdoor",
                aspect: "aspect-[4/3]",
                title: "Seven Stars Gallery Photo 2",
              },
              {
                id: 3,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686610741-SEVEN_STARS_2026_02_09-0076.webp",
                category: "Indoor",
                aspect: "aspect-[3/4]",
                title: "Seven Stars Gallery Photo 3",
              },
              {
                id: 4,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779093880678-footer-bg.webp",
                category: "Food",
                aspect: "aspect-[4/5]",
                title: "Seven Stars Gallery Photo 4",
              },
              {
                id: 5,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779095839457-barn.webp",
                category: "Outdoor",
                aspect: "aspect-[16/9]",
                title: "Seven Stars Gallery Photo 5",
              },
              {
                id: 6,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686607452-SEVEN_STARS_2026_02_09-0028.webp",
                category: "Indoor",
                aspect: "aspect-square",
                title: "Seven Stars Gallery Photo 6",
              },
              {
                id: 7,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779094138324-food-gourmet.webp",
                category: "Food",
                aspect: "aspect-[4/3]",
                title: "Seven Stars Gallery Photo 7",
              },
              {
                id: 8,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779095838769-gallery-4.webp",
                category: "Outdoor",
                aspect: "aspect-[3/4]",
                title: "Seven Stars Gallery Photo 8",
              },
              {
                id: 9,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087467006-SEVEN_STARS_2026_02_09-0043.webp",
                category: "Indoor",
                aspect: "aspect-[4/5]",
                title: "Seven Stars Gallery Photo 9",
              },
              {
                id: 10,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779095841739-event-celebration.webp",
                category: "Food",
                aspect: "aspect-[16/9]",
                title: "Seven Stars Gallery Photo 10",
              },
              {
                id: 11,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781688953515-SEVEN_STARS_2026_02_09-0006.webp",
                category: "Outdoor",
                aspect: "aspect-square",
                title: "Seven Stars Gallery Photo 11",
              },
              {
                id: 12,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087463543-SEVEN_STARS_2026_02_09-0050.webp",
                category: "Indoor",
                aspect: "aspect-[4/3]",
                title: "Seven Stars Gallery Photo 12",
              },
              {
                id: 13,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779102563583-SEVEN_STARS_2026_02_09-0065.webp",
                category: "Food",
                aspect: "aspect-[3/4]",
                title: "Seven Stars Gallery Photo 13",
              },
              {
                id: 14,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686614010-SEVEN_STARS_2026_02_09-210.webp",
                category: "Outdoor",
                aspect: "aspect-[4/5]",
                title: "Seven Stars Gallery Photo 14",
              },
              {
                id: 15,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087454735-SEVEN_STARS_2026_02_09-0048.webp",
                category: "Indoor",
                aspect: "aspect-[16/9]",
                title: "Seven Stars Gallery Photo 15",
              },
              {
                id: 16,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779102629081-feature-classic-1.webp",
                category: "Food",
                aspect: "aspect-square",
                title: "Seven Stars Gallery Photo 16",
              },
              {
                id: 17,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781195516243-IMG_4523.webp",
                category: "Outdoor",
                aspect: "aspect-[4/3]",
                title: "Seven Stars Gallery Photo 17",
              },
              {
                id: 18,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087435267-SEVEN_STARS_2026_02_09-0058.webp",
                category: "Indoor",
                aspect: "aspect-[3/4]",
                title: "Seven Stars Gallery Photo 18",
              },
              {
                id: 19,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779102630377-feature-special-1.webp",
                category: "Food",
                aspect: "aspect-[4/5]",
                title: "Seven Stars Gallery Photo 19",
              },
              {
                id: 20,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781156724977-SEVEN_STARS_2026_02_09-0106.webp",
                category: "Outdoor",
                aspect: "aspect-[16/9]",
                title: "Seven Stars Gallery Photo 20",
              },
              {
                id: 21,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087019487-SEVEN_STARS_2026_02_09-0066.webp",
                category: "Indoor",
                aspect: "aspect-square",
                title: "Seven Stars Gallery Photo 21",
              },
              {
                id: 22,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779446831444-SEVEN_STARS_2026_02_09-10.webp",
                category: "Food",
                aspect: "aspect-[4/3]",
                title: "Seven Stars Gallery Photo 22",
              },
              {
                id: 23,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087458738-SEVEN_STARS_2026_02_09-0012.webp",
                category: "Outdoor",
                aspect: "aspect-[3/4]",
                title: "Seven Stars Gallery Photo 23",
              },
              {
                id: 24,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781086666152-SEVEN_STARS_2026_02_09-0057.webp",
                category: "Indoor",
                aspect: "aspect-[4/5]",
                title: "Seven Stars Gallery Photo 24",
              },
              {
                id: 25,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637514694-SEVEN_STARS_2026_02_09-349.webp",
                category: "Food",
                aspect: "aspect-[16/9]",
                title: "Seven Stars Gallery Photo 25",
              },
              {
                id: 26,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087445795-SEVEN_STARS_2026_02_09-0023.webp",
                category: "Outdoor",
                aspect: "aspect-square",
                title: "Seven Stars Gallery Photo 26",
              },
              {
                id: 27,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781086662028-SEVEN_STARS_2026_02_09-0080.webp",
                category: "Indoor",
                aspect: "aspect-[4/3]",
                title: "Seven Stars Gallery Photo 27",
              },
              {
                id: 28,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637679964-SEVEN_STARS_2026_02_09-265.webp",
                category: "Food",
                aspect: "aspect-[3/4]",
                title: "Seven Stars Gallery Photo 28",
              },
              {
                id: 29,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087440607-SEVEN_STARS_2026_02_09-0016.webp",
                category: "Outdoor",
                aspect: "aspect-[4/5]",
                title: "Seven Stars Gallery Photo 29",
              },
              {
                id: 30,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781086655447-SEVEN_STARS_2026_02_09-0025.webp",
                category: "Indoor",
                aspect: "aspect-[16/9]",
                title: "Seven Stars Gallery Photo 30",
              },
              {
                id: 31,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637684315-SEVEN_STARS_2026_02_09-344.webp",
                category: "Food",
                aspect: "aspect-square",
                title: "Seven Stars Gallery Photo 31",
              },
              {
                id: 32,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087039804-SEVEN_STARS_2026_02_09-0011.webp",
                category: "Outdoor",
                aspect: "aspect-[4/3]",
                title: "Seven Stars Gallery Photo 32",
              },
              {
                id: 33,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781085738861-SEVEN_STARS_2026_02_09-0040.webp",
                category: "Indoor",
                aspect: "aspect-[3/4]",
                title: "Seven Stars Gallery Photo 33",
              },
              {
                id: 34,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637685212-SEVEN_STARS_2026_02_09-94.webp",
                category: "Food",
                aspect: "aspect-[4/5]",
                title: "Seven Stars Gallery Photo 34",
              },
              {
                id: 35,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087033121-SEVEN_STARS_2026_02_09-0106.webp",
                category: "Outdoor",
                aspect: "aspect-[16/9]",
                title: "Seven Stars Gallery Photo 35",
              },
              {
                id: 36,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781085721419-SEVEN_STARS_2026_02_09-0032.webp",
                category: "Indoor",
                aspect: "aspect-square",
                title: "Seven Stars Gallery Photo 36",
              },
              {
                id: 37,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781071047399-SEVEN_STARS_2026_02_09-35.webp",
                category: "Food",
                aspect: "aspect-[4/3]",
                title: "Seven Stars Gallery Photo 37",
              },
              {
                id: 38,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781086064541-SEVEN_STARS_2026_02_09-0022.webp",
                category: "Outdoor",
                aspect: "aspect-[3/4]",
                title: "Seven Stars Gallery Photo 38",
              },
              {
                id: 39,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779100598226-gallery-25.webp",
                category: "Indoor",
                aspect: "aspect-[4/5]",
                title: "Seven Stars Gallery Photo 39",
              },
              {
                id: 40,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781074152897-SEVEN_STARS_2026_02_09-5.webp",
                category: "Food",
                aspect: "aspect-[16/9]",
                title: "Seven Stars Gallery Photo 40",
              },
              {
                id: 41,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779099397728-gallery-25.webp",
                category: "Indoor",
                aspect: "aspect-square",
                title: "Seven Stars Gallery Photo 41",
              },
              {
                id: 42,
                src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781085731650-SEVEN_STARS_2026_02_09-125.webp",
                category: "Food",
                aspect: "aspect-[4/3]",
                title: "Seven Stars Gallery Photo 42",
              },
            ],
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
          },
        },
        {
          type: "StoryTimeline",
          order: 2,
          content: {
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
                name: "Pan-Seared White Fish",
                tagline: "FESTIVE SEAFOOD",
                description:
                  "A golden-brown fish fillet served with roasted baby potatoes, steamed green beans, and a fresh lemon wedge.",
                image:
                  "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish1.webp",
              },
              {
                name: "Herb-Crusted White Fish",
                tagline: "ELEGANT MAIN",
                description:
                  "Succulent fish fillet garnished with fresh green herbs, accompanied by bright asparagus spears and roasted cherry tomatoes.",
                image:
                  "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish2.webp",
              },
              {
                name: "Baked Camembert",
                tagline: "WARM STARTER",
                description:
                  "A whole warm cheese wheel topped with caramelized nuts, served with red berry compote and crispy breadsticks.",
                image:
                  "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish3.webp",
              },
              {
                name: "Red Wine Poached Pear",
                tagline: "FRUITY DESSERT",
                description:
                  "Classic poached pear paired with a refreshing scoop of orange sorbet and a drizzle of reduction syrup.",
                image:
                  "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish4.webp",
              },
              {
                name: "Festive Fruit Crumble",
                tagline: "COMFORT DESSERT",
                description:
                  "Warm mixed berry and apple crumble with a golden topping, served with rich, creamy custard.",
                image:
                  "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish5.webp",
              },
              {
                name: "Decadent Chocolate Mousse",
                tagline: "RICH DESSERT",
                description:
                  "Soft chocolate cake cubes on a bed of chocolate soil, served with vibrant red berry sorbet.",
                image:
                  "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish6.webp",
              },
              {
                name: "Roasted Duck Breast",
                tagline: "SIGNATURE MAIN",
                description:
                  "Tender, medium-rare slices of roasted meat elegantly plated over a vibrant green vegetable puree with savory jus.",
                image:
                  "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish7.webp",
              },
              {
                name: "Savoury Wellington",
                tagline: "VEGETARIAN DELIGHT",
                description:
                  "Golden, flaky puff pastry wrapped around a rich, dark filling and fresh spinach, served on a bed of savory crumbs.",
                image:
                  "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish8.webp",
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
            backgroundImage: IMAGES.BLOG_LOCAL,
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
            backgroundImage: `${STORAGE_BASE}/1781195615052-WhatsAppImage2026-06-11at21.23.03.jpeg`,
            content: `<h1><span style="color: rgb(91, 99, 104);">Privacy&nbsp;Policy</span></h1><p><span style="color: rgb(91, 99, 104);">We&nbsp;are&nbsp;committed&nbsp;to&nbsp;protecting&nbsp;your&nbsp;privacy.&nbsp;In&nbsp;this&nbsp;notice,&nbsp;you&nbsp;can&nbsp;read&nbsp;about&nbsp;the&nbsp;information&nbsp;we&nbsp;collect&nbsp;from&nbsp;you&nbsp;and&nbsp;how&nbsp;we&nbsp;use&nbsp;it.&nbsp;If&nbsp;you&nbsp;have&nbsp;any&nbsp;questions&nbsp;or&nbsp;concerns,&nbsp;you&nbsp;can&nbsp;email&nbsp;us&nbsp;at:&nbsp;info@sevenstarsatmb.co.uk</span></p><p><strong style="color: rgb(91, 99, 104);">1.&nbsp;Information&nbsp;we&nbsp;collect</strong></p><p><span style="color: rgb(91, 99, 104);">This&nbsp;notice&nbsp;applies&nbsp;to&nbsp;all&nbsp;information&nbsp;collected&nbsp;or&nbsp;submitted&nbsp;on&nbsp;our&nbsp;website.&nbsp;We&nbsp;collect&nbsp;this&nbsp;information&nbsp;to&nbsp;conveniently&nbsp;provide&nbsp;you&nbsp;with&nbsp;our&nbsp;products&nbsp;and&nbsp;services,&nbsp;or&nbsp;for&nbsp;technical&nbsp;reasons.</span></p><ul><li><span style="color: rgb(91, 99, 104);">Personally&nbsp;identifiable&nbsp;information&nbsp;we&nbsp;may&nbsp;collect&nbsp;includes:</span></li><li><span style="color: rgb(91, 99, 104);">Name&nbsp;and&nbsp;job&nbsp;title</span></li><li><span style="color: rgb(91, 99, 104);">Contact&nbsp;information&nbsp;including&nbsp;email&nbsp;address</span></li><li><span style="color: rgb(91, 99, 104);">Demographic&nbsp;information&nbsp;such&nbsp;as&nbsp;postcode,&nbsp;preferences&nbsp;and&nbsp;interests</span></li><li><span style="color: rgb(91, 99, 104);">Non-personally&nbsp;identifiable&nbsp;information&nbsp;we&nbsp;may&nbsp;collect&nbsp;includes:</span></li><li><span style="color: rgb(91, 99, 104);">The&nbsp;type&nbsp;of&nbsp;device&nbsp;you&nbsp;are&nbsp;using&nbsp;to&nbsp;view&nbsp;the&nbsp;website</span></li><li><span style="color: rgb(91, 99, 104);">Anonymous&nbsp;usage&nbsp;statistics</span></li><li><span style="color: rgb(91, 99, 104);">Anonymous&nbsp;information,&nbsp;such&nbsp;as&nbsp;your&nbsp;internet&nbsp;service&nbsp;provider,&nbsp;IP&nbsp;address&nbsp;and&nbsp;internet&nbsp;browsing&nbsp;software,&nbsp;collected&nbsp;by&nbsp;our&nbsp;website</span></li><li><span style="color: rgb(91, 99, 104);">“Cookies,”&nbsp;which&nbsp;enable&nbsp;the&nbsp;website&nbsp;to&nbsp;remember&nbsp;your&nbsp;information&nbsp;if&nbsp;you&nbsp;return&nbsp;to&nbsp;the&nbsp;site,&nbsp;such&nbsp;as&nbsp;to&nbsp;keep&nbsp;you&nbsp;logged&nbsp;in&nbsp;or&nbsp;to&nbsp;remember&nbsp;your&nbsp;login&nbsp;credentials&nbsp;if&nbsp;you&nbsp;return&nbsp;to&nbsp;the&nbsp;site</span></li></ul><p><strong style="color: rgb(91, 99, 104);">2.&nbsp;Visitors&nbsp;to&nbsp;our&nbsp;website</strong></p><p><strong style="color: rgb(91, 99, 104);">Google&nbsp;Analytics:</strong></p><p><span style="color: rgb(91, 99, 104);">When&nbsp;someone&nbsp;visits&nbsp;our&nbsp;website,&nbsp;we&nbsp;use&nbsp;a&nbsp;third&nbsp;party&nbsp;service,&nbsp;Google&nbsp;Analytics,&nbsp;to&nbsp;collect&nbsp;standard&nbsp;internet&nbsp;log&nbsp;information&nbsp;and&nbsp;details&nbsp;of&nbsp;visitor&nbsp;behaviour&nbsp;patterns.&nbsp;We&nbsp;do&nbsp;this&nbsp;to&nbsp;find&nbsp;out&nbsp;things&nbsp;such&nbsp;as&nbsp;the&nbsp;number&nbsp;of&nbsp;visitors&nbsp;to&nbsp;the&nbsp;various&nbsp;parts&nbsp;of&nbsp;the&nbsp;site.&nbsp;This&nbsp;information&nbsp;is&nbsp;only&nbsp;processed&nbsp;in&nbsp;a&nbsp;way&nbsp;which&nbsp;does&nbsp;not&nbsp;identify&nbsp;anyone.&nbsp;We&nbsp;do&nbsp;not&nbsp;make,&nbsp;and&nbsp;do&nbsp;not&nbsp;allow&nbsp;Google&nbsp;to&nbsp;make,&nbsp;any&nbsp;attempt&nbsp;to&nbsp;find&nbsp;out&nbsp;the&nbsp;identities&nbsp;of&nbsp;those&nbsp;visiting&nbsp;our&nbsp;website.&nbsp;If&nbsp;we&nbsp;do&nbsp;want&nbsp;to&nbsp;collect&nbsp;personally&nbsp;identifiable&nbsp;information&nbsp;through&nbsp;our&nbsp;website,&nbsp;we&nbsp;will&nbsp;be&nbsp;up&nbsp;front&nbsp;about&nbsp;this.&nbsp;We&nbsp;will&nbsp;make&nbsp;it&nbsp;clear&nbsp;when&nbsp;we&nbsp;collect&nbsp;personal&nbsp;information&nbsp;and&nbsp;will&nbsp;explain&nbsp;what&nbsp;we&nbsp;intend&nbsp;to&nbsp;do&nbsp;with&nbsp;it.</span></p><p><strong style="color: rgb(91, 99, 104);">Use&nbsp;of&nbsp;cookies:</strong></p><p><span style="color: rgb(91, 99, 104);">You&nbsp;can&nbsp;read&nbsp;more&nbsp;about&nbsp;how&nbsp;we&nbsp;use&nbsp;cookies&nbsp;on&nbsp;our&nbsp;Cookies&nbsp;Page.</span></p><p><strong style="color: rgb(91, 99, 104);">Newsletter:</strong></p><p><span style="color: rgb(91, 99, 104);">If&nbsp;you&nbsp;sign&nbsp;up&nbsp;for&nbsp;our&nbsp;newsletter,&nbsp;which&nbsp;is&nbsp;administered&nbsp;through&nbsp;Mailchimp,&nbsp;we&nbsp;will&nbsp;store&nbsp;some&nbsp;of&nbsp;your&nbsp;information,&nbsp;including&nbsp;your&nbsp;email&nbsp;address,&nbsp;IP&nbsp;address&nbsp;and&nbsp;certain&nbsp;information&nbsp;about&nbsp;the&nbsp;links&nbsp;you&nbsp;click&nbsp;within&nbsp;the&nbsp;emails&nbsp;we&nbsp;send&nbsp;you,&nbsp;on&nbsp;a&nbsp;Mailchimp&nbsp;server.&nbsp;Neither&nbsp;Mailchimp&nbsp;nor&nbsp;we&nbsp;will&nbsp;ever&nbsp;sell&nbsp;your&nbsp;email&nbsp;address&nbsp;or&nbsp;share&nbsp;it&nbsp;with&nbsp;any&nbsp;other&nbsp;party,&nbsp;unless&nbsp;we&nbsp;are&nbsp;legally&nbsp;compelled&nbsp;to&nbsp;do&nbsp;so.&nbsp;If&nbsp;you&nbsp;contact&nbsp;Mailchimp&nbsp;directly&nbsp;regarding&nbsp;your&nbsp;subscription&nbsp;to&nbsp;our&nbsp;newsletter,&nbsp;Mailchimp&nbsp;may&nbsp;contact&nbsp;you&nbsp;directly;&nbsp;otherwise,&nbsp;Mailchimp&nbsp;will&nbsp;never&nbsp;contact&nbsp;you.&nbsp;Only&nbsp;authorised&nbsp;Mailchimp&nbsp;employees&nbsp;have&nbsp;access&nbsp;to&nbsp;our&nbsp;subscriber&nbsp;list.</span></p><p><span style="color: rgb(91, 99, 104);">You&nbsp;are&nbsp;always&nbsp;free&nbsp;to&nbsp;unsubscribe&nbsp;from&nbsp;our&nbsp;newsletter&nbsp;at&nbsp;any&nbsp;time&nbsp;by&nbsp;following&nbsp;the&nbsp;instructions&nbsp;contained&nbsp;within&nbsp;the&nbsp;email&nbsp;or&nbsp;by&nbsp;sending&nbsp;an&nbsp;email&nbsp;to&nbsp;the&nbsp;address&nbsp;provided&nbsp;at&nbsp;the&nbsp;top&nbsp;of&nbsp;this&nbsp;page,&nbsp;but&nbsp;as&nbsp;long&nbsp;as&nbsp;you&nbsp;are&nbsp;registered,&nbsp;we&nbsp;may&nbsp;use&nbsp;Mailchimp&nbsp;to&nbsp;send&nbsp;you&nbsp;information&nbsp;about&nbsp;your&nbsp;account.</span></p><p><strong style="color: rgb(91, 99, 104);">3.&nbsp;How&nbsp;we&nbsp;use&nbsp;your&nbsp;information</strong></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;will&nbsp;not&nbsp;sell,&nbsp;distribute&nbsp;or&nbsp;lease&nbsp;your&nbsp;personal&nbsp;information&nbsp;to&nbsp;third&nbsp;parties&nbsp;except&nbsp;(such&nbsp;as&nbsp;in&nbsp;the&nbsp;case&nbsp;of&nbsp;Mailchimp)&nbsp;when&nbsp;it’s&nbsp;necessary&nbsp;to&nbsp;complete&nbsp;the&nbsp;functions&nbsp;of&nbsp;the&nbsp;website.</span></p><p><span style="color: rgb(91, 99, 104);">When&nbsp;you&nbsp;email&nbsp;us,&nbsp;we&nbsp;will&nbsp;use&nbsp;your&nbsp;email&nbsp;address&nbsp;only&nbsp;for&nbsp;the&nbsp;purpose&nbsp;of&nbsp;responding&nbsp;to&nbsp;you&nbsp;and&nbsp;for&nbsp;no&nbsp;other&nbsp;purpose.</span></p><p><span style="color: rgb(91, 99, 104);">Sometimes&nbsp;we&nbsp;may&nbsp;use&nbsp;anonymous&nbsp;information&nbsp;about&nbsp;your&nbsp;use&nbsp;of&nbsp;our&nbsp;site&nbsp;in&nbsp;combination&nbsp;with&nbsp;other&nbsp;users’&nbsp;usage&nbsp;to&nbsp;make&nbsp;decisions&nbsp;about&nbsp;the&nbsp;contents&nbsp;and&nbsp;design&nbsp;of&nbsp;the&nbsp;web&nbsp;site.</span></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;may&nbsp;disclose&nbsp;your&nbsp;information&nbsp;in&nbsp;response&nbsp;to&nbsp;court&nbsp;orders,&nbsp;or&nbsp;other&nbsp;legal&nbsp;process,&nbsp;or&nbsp;to&nbsp;establish&nbsp;or&nbsp;exercise&nbsp;our&nbsp;legal&nbsp;rights&nbsp;or&nbsp;to&nbsp;defend&nbsp;against&nbsp;legal&nbsp;claims.</span></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;may&nbsp;disclose&nbsp;your&nbsp;information&nbsp;when&nbsp;we&nbsp;believe&nbsp;it&nbsp;necessary&nbsp;or&nbsp;desirable&nbsp;in&nbsp;order&nbsp;to&nbsp;investigate,&nbsp;prevent,&nbsp;or&nbsp;take&nbsp;action&nbsp;regarding&nbsp;illegal&nbsp;activities,&nbsp;suspected&nbsp;fraud,&nbsp;situations&nbsp;involving&nbsp;potential&nbsp;threats&nbsp;to&nbsp;the&nbsp;physical&nbsp;safety&nbsp;of&nbsp;any&nbsp;person,&nbsp;violations&nbsp;of&nbsp;our&nbsp;policies,&nbsp;and/or&nbsp;to&nbsp;protect&nbsp;our&nbsp;rights&nbsp;and&nbsp;property.</span></p><p><span style="color: rgb(91, 99, 104);">If&nbsp;you&nbsp;believe&nbsp;that&nbsp;any&nbsp;information&nbsp;we&nbsp;are&nbsp;holding&nbsp;on&nbsp;you&nbsp;is&nbsp;incorrect&nbsp;or&nbsp;incomplete,&nbsp;please&nbsp;write&nbsp;to&nbsp;or&nbsp;email&nbsp;us&nbsp;as&nbsp;soon&nbsp;as&nbsp;possible.&nbsp;We&nbsp;will&nbsp;promptly&nbsp;correct&nbsp;any&nbsp;information&nbsp;found&nbsp;to&nbsp;be&nbsp;incorrect.</span></p><p><strong style="color: rgb(91, 99, 104);">4.&nbsp;Data&nbsp;security</strong></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;are&nbsp;committed&nbsp;to&nbsp;ensuring&nbsp;that&nbsp;your&nbsp;information&nbsp;is&nbsp;secure.&nbsp;We&nbsp;will&nbsp;never&nbsp;provide&nbsp;access&nbsp;to&nbsp;our&nbsp;databases&nbsp;to&nbsp;any&nbsp;third&nbsp;party,&nbsp;except&nbsp;to&nbsp;the&nbsp;extent&nbsp;necessary&nbsp;to&nbsp;conduct&nbsp;the&nbsp;operations&nbsp;of&nbsp;the&nbsp;web&nbsp;site&nbsp;(such&nbsp;as&nbsp;providing&nbsp;user&nbsp;data&nbsp;to&nbsp;Mailchimp).</span></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;cannot&nbsp;ensure&nbsp;or&nbsp;warrant&nbsp;the&nbsp;security&nbsp;of&nbsp;any&nbsp;information&nbsp;you&nbsp;transmit&nbsp;to&nbsp;us&nbsp;or&nbsp;guarantee&nbsp;that&nbsp;your&nbsp;information&nbsp;on&nbsp;our&nbsp;web&nbsp;site&nbsp;may&nbsp;not&nbsp;be&nbsp;accessed,&nbsp;disclosed,&nbsp;altered&nbsp;or&nbsp;destroyed&nbsp;by&nbsp;breach&nbsp;of&nbsp;any&nbsp;of&nbsp;our&nbsp;industry&nbsp;standard&nbsp;physical,&nbsp;technical&nbsp;or&nbsp;managerial&nbsp;safeguards.&nbsp;When&nbsp;you&nbsp;enter&nbsp;sensitive&nbsp;information&nbsp;(such&nbsp;as&nbsp;contact&nbsp;form&nbsp;credentials)&nbsp;on&nbsp;our&nbsp;contact&nbsp;form,&nbsp;we&nbsp;encrypt&nbsp;that&nbsp;information&nbsp;using&nbsp;secure&nbsp;socket&nbsp;layer&nbsp;technology&nbsp;(SSL).&nbsp;No&nbsp;method&nbsp;of&nbsp;transmission&nbsp;over&nbsp;the&nbsp;Internet&nbsp;or&nbsp;method&nbsp;of&nbsp;electronic&nbsp;storage&nbsp;is&nbsp;100%&nbsp;secure,&nbsp;however.&nbsp;Therefore,&nbsp;we&nbsp;cannot&nbsp;guarantee&nbsp;its&nbsp;absolute&nbsp;security.</span></p><p><strong style="color: rgb(91, 99, 104);">5.&nbsp;Access&nbsp;to&nbsp;Personal&nbsp;Information</strong></p><p><span style="color: rgb(91, 99, 104);">How&nbsp;to&nbsp;access&nbsp;your&nbsp;information</span></p><p><span style="color: rgb(91, 99, 104);">To&nbsp;access&nbsp;your&nbsp;information,&nbsp;you&nbsp;will&nbsp;need&nbsp;to&nbsp;put&nbsp;your&nbsp;request&nbsp;in&nbsp;writing.</span></p><p><span style="color: rgb(91, 99, 104);">You&nbsp;will&nbsp;need&nbsp;to&nbsp;provide&nbsp;information&nbsp;for&nbsp;us&nbsp;to&nbsp;identify&nbsp;you&nbsp;from&nbsp;our&nbsp;records,&nbsp;suchas&nbsp;yourr&nbsp;name&nbsp;and&nbsp;email&nbsp;address.&nbsp;You&nbsp;will&nbsp;also&nbsp;need&nbsp;to&nbsp;tell&nbsp;us&nbsp;what&nbsp;kind&nbsp;of&nbsp;information&nbsp;you&nbsp;are&nbsp;requesting&nbsp;to&nbsp;enable&nbsp;us&nbsp;to&nbsp;locate&nbsp;the&nbsp;information.&nbsp;Send&nbsp;your&nbsp;request&nbsp;to&nbsp;the&nbsp;address&nbsp;provided&nbsp;at&nbsp;the&nbsp;top&nbsp;of&nbsp;this&nbsp;page.</span></p><p><strong style="color: rgb(91, 99, 104);">Proof&nbsp;of&nbsp;identity</strong></p><p><span style="color: rgb(91, 99, 104);">When&nbsp;we&nbsp;receive&nbsp;a&nbsp;request&nbsp;for&nbsp;information,&nbsp;we&nbsp;must&nbsp;make&nbsp;sure&nbsp;you&nbsp;are&nbsp;who&nbsp;you&nbsp;say&nbsp;you&nbsp;are.&nbsp;We&nbsp;need&nbsp;proof&nbsp;of&nbsp;identity.&nbsp;These&nbsp;include:</span></p><ul><li><span style="color: rgb(91, 99, 104);">Your&nbsp;full&nbsp;name</span></li><li><span style="color: rgb(91, 99, 104);">Email&nbsp;Address</span></li></ul><p><span style="color: rgb(91, 99, 104);">The&nbsp;following&nbsp;documents&nbsp;can&nbsp;be&nbsp;accepted&nbsp;to&nbsp;verify&nbsp;your&nbsp;identity.&nbsp;We&nbsp;require&nbsp;two&nbsp;forms&nbsp;of&nbsp;ID:</span></p><ul><li><span style="color: rgb(91, 99, 104);">Current&nbsp;UK/EEA&nbsp;passport</span></li><li><span style="color: rgb(91, 99, 104);">UK&nbsp;photocard&nbsp;driving&nbsp;licence&nbsp;(full&nbsp;or&nbsp;provisional)</span></li><li><span style="color: rgb(91, 99, 104);">Firearms&nbsp;licence/shotgun&nbsp;certificate</span></li><li><span style="color: rgb(91, 99, 104);">EEA&nbsp;national&nbsp;identity&nbsp;card</span></li><li><span style="color: rgb(91, 99, 104);">Full&nbsp;UK&nbsp;paper&nbsp;driving&nbsp;licence</span></li><li><span style="color: rgb(91, 99, 104);">State&nbsp;benefits&nbsp;entitlement&nbsp;document*</span></li><li><span style="color: rgb(91, 99, 104);">State&nbsp;pension&nbsp;entitlement&nbsp;document*</span></li><li><span style="color: rgb(91, 99, 104);">HMRC&nbsp;tax&nbsp;credit&nbsp;document*</span></li><li><span style="color: rgb(91, 99, 104);">Local&nbsp;authority&nbsp;benefit&nbsp;document*</span></li><li><span style="color: rgb(91, 99, 104);">State/local&nbsp;authority&nbsp;educational&nbsp;grant&nbsp;document*</span></li><li><span style="color: rgb(91, 99, 104);">HMRC&nbsp;tax&nbsp;notification&nbsp;document</span></li><li><span style="color: rgb(91, 99, 104);">Disabled&nbsp;driver’s&nbsp;pass</span></li><li><span style="color: rgb(91, 99, 104);">Financial&nbsp;statement&nbsp;issued&nbsp;by&nbsp;bank,&nbsp;building&nbsp;society&nbsp;or&nbsp;credit&nbsp;card&nbsp;company</span></li><li><span style="color: rgb(91, 99, 104);">Judiciary&nbsp;document&nbsp;such&nbsp;as&nbsp;a&nbsp;notice&nbsp;of&nbsp;hearing,&nbsp;summons&nbsp;or&nbsp;court&nbsp;order+</span></li><li><span style="color: rgb(91, 99, 104);">Utility&nbsp;bill&nbsp;for&nbsp;supply&nbsp;of&nbsp;gas,&nbsp;electric,&nbsp;water&nbsp;or&nbsp;telephone&nbsp;landline+</span></li><li><span style="color: rgb(91, 99, 104);">Most&nbsp;recent&nbsp;mortgage&nbsp;statement</span></li><li><span style="color: rgb(91, 99, 104);">Most&nbsp;recent&nbsp;council&nbsp;tax&nbsp;bill/demand&nbsp;or&nbsp;statement</span></li><li><span style="color: rgb(91, 99, 104);">Current&nbsp;council&nbsp;rent&nbsp;card</span></li><li><span style="color: rgb(91, 99, 104);">Current&nbsp;council&nbsp;tenancy&nbsp;agreement</span></li><li><span style="color: rgb(91, 99, 104);">Building&nbsp;society&nbsp;passbook&nbsp;which&nbsp;shows&nbsp;a&nbsp;transaction&nbsp;in&nbsp;the&nbsp;last&nbsp;three&nbsp;months&nbsp;and&nbsp;your&nbsp;address</span></li></ul><p><span style="color: rgb(91, 99, 104);">*&nbsp;Must&nbsp;be&nbsp;the&nbsp;most&nbsp;recently&nbsp;issued&nbsp;and&nbsp;less&nbsp;than&nbsp;12&nbsp;months&nbsp;old.</span></p><p><span style="color: rgb(91, 99, 104);">+&nbsp;Must&nbsp;be&nbsp;the&nbsp;most&nbsp;recently&nbsp;issued&nbsp;and&nbsp;less&nbsp;than&nbsp;three&nbsp;months&nbsp;old&nbsp;(except&nbsp;water&nbsp;bills&nbsp;–&nbsp;less&nbsp;than&nbsp;12&nbsp;months&nbsp;old).</span></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;will&nbsp;accept&nbsp;copies&nbsp;of&nbsp;these&nbsp;documents.&nbsp;However,&nbsp;we&nbsp;reserve&nbsp;the&nbsp;right&nbsp;to&nbsp;ask&nbsp;for&nbsp;originals&nbsp;if&nbsp;photocopies&nbsp;are&nbsp;not&nbsp;of&nbsp;a&nbsp;good&nbsp;quality.</span></p><p><span style="color: rgb(91, 99, 104);">A&nbsp;‘reasonable&nbsp;fee’&nbsp;will&nbsp;be&nbsp;charged&nbsp;when&nbsp;a&nbsp;request&nbsp;is&nbsp;manifestly&nbsp;unfounded&nbsp;or&nbsp;excessive,&nbsp;particularly&nbsp;if&nbsp;it&nbsp;is&nbsp;repetitive.&nbsp;We&nbsp;may&nbsp;also&nbsp;charge&nbsp;a&nbsp;reasonable&nbsp;fee&nbsp;to&nbsp;comply&nbsp;with&nbsp;requests&nbsp;for&nbsp;further&nbsp;copies&nbsp;of&nbsp;the&nbsp;same&nbsp;information.</span></p><p><strong style="color: rgb(91, 99, 104);">6.&nbsp;Changes&nbsp;to&nbsp;this&nbsp;policy</strong></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;reserve&nbsp;the&nbsp;right&nbsp;to&nbsp;change&nbsp;this&nbsp;policy&nbsp;at&nbsp;any&nbsp;time.&nbsp;Although&nbsp;we&nbsp;will&nbsp;notify&nbsp;users&nbsp;appropriately&nbsp;when&nbsp;changes&nbsp;are&nbsp;made&nbsp;to&nbsp;this&nbsp;policy,&nbsp;you&nbsp;are&nbsp;responsible&nbsp;for&nbsp;checking&nbsp;this&nbsp;page&nbsp;for&nbsp;changes.&nbsp;Your&nbsp;use&nbsp;of&nbsp;our&nbsp;website&nbsp;constitutes&nbsp;agreement&nbsp;to&nbsp;this&nbsp;privacy&nbsp;policy.</span></p><p><strong style="color: rgb(91, 99, 104);">7.&nbsp;Links&nbsp;to&nbsp;other&nbsp;websites</strong></p><p><span style="color: rgb(91, 99, 104);">Our&nbsp;website&nbsp;may&nbsp;contain&nbsp;links&nbsp;to&nbsp;other&nbsp;websites&nbsp;of&nbsp;interest.&nbsp;However,&nbsp;once&nbsp;you&nbsp;have&nbsp;used&nbsp;these&nbsp;links&nbsp;to&nbsp;leave&nbsp;our&nbsp;site,&nbsp;you&nbsp;should&nbsp;note&nbsp;that&nbsp;we&nbsp;do&nbsp;not&nbsp;have&nbsp;any&nbsp;control&nbsp;over&nbsp;that&nbsp;other&nbsp;website.&nbsp;Therefore,&nbsp;we&nbsp;cannot&nbsp;be&nbsp;responsible&nbsp;for&nbsp;the&nbsp;protection&nbsp;and&nbsp;privacy&nbsp;of&nbsp;any&nbsp;information&nbsp;which&nbsp;you&nbsp;provide&nbsp;whilst&nbsp;visiting&nbsp;such&nbsp;sites&nbsp;and&nbsp;such&nbsp;sites&nbsp;are&nbsp;not&nbsp;governed&nbsp;by&nbsp;this&nbsp;privacy&nbsp;statement.&nbsp;You&nbsp;should&nbsp;exercise&nbsp;caution&nbsp;and&nbsp;look&nbsp;at&nbsp;the&nbsp;privacy&nbsp;statement&nbsp;applicable&nbsp;to&nbsp;the&nbsp;website&nbsp;in&nbsp;question.</span></p><p></p><p></p>`,
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
            content: `<h1><span style="color: rgb(91, 99, 104);">Cookie&nbsp;Policy</span></h1><p><span style="color: rgb(91, 99, 104);">Hi&nbsp;Baldon&nbsp;Ltd&nbsp;(“us”,&nbsp;“we”,&nbsp;or&nbsp;“our”)&nbsp;uses&nbsp;cookies&nbsp;on&nbsp;sevenstarsatmarshbaldon.co.uk&nbsp;(the&nbsp;“Service”).</span></p><p><span style="color: rgb(91, 99, 104);">Our&nbsp;Cookies&nbsp;Policy&nbsp;explains&nbsp;what&nbsp;cookies&nbsp;are,&nbsp;how&nbsp;we&nbsp;use&nbsp;cookies,&nbsp;how&nbsp;third-parties&nbsp;we&nbsp;may&nbsp;partner&nbsp;with&nbsp;may&nbsp;use&nbsp;cookies&nbsp;on&nbsp;the&nbsp;Service,&nbsp;your&nbsp;choices&nbsp;regarding&nbsp;cookies&nbsp;and&nbsp;further&nbsp;information&nbsp;about&nbsp;cookies.</span></p><p><strong style="color: rgb(91, 99, 104);">What&nbsp;are&nbsp;cookies?</strong></p><p><span style="color: rgb(91, 99, 104);">Cookies&nbsp;are&nbsp;small&nbsp;pieces&nbsp;of&nbsp;text&nbsp;sent&nbsp;by&nbsp;your&nbsp;web&nbsp;browser&nbsp;to&nbsp;a&nbsp;website&nbsp;you&nbsp;visit.&nbsp;A&nbsp;cookie&nbsp;file&nbsp;is&nbsp;stored&nbsp;in&nbsp;your&nbsp;web&nbsp;browser&nbsp;and&nbsp;allows&nbsp;the&nbsp;Service&nbsp;or&nbsp;a&nbsp;third&nbsp;party&nbsp;to&nbsp;recognise&nbsp;you,&nbsp;making&nbsp;your&nbsp;next&nbsp;visit&nbsp;easier&nbsp;and&nbsp;more&nbsp;efficient.&nbsp;You&nbsp;can&nbsp;find&nbsp;out&nbsp;more&nbsp;information&nbsp;about&nbsp;cookies&nbsp;at&nbsp;www.allaboutcookies.org</span></p><p><span style="color: rgb(91, 99, 104);">The&nbsp;law&nbsp;states&nbsp;that&nbsp;we&nbsp;can&nbsp;store&nbsp;cookies&nbsp;on&nbsp;your&nbsp;machine&nbsp;if&nbsp;they&nbsp;are&nbsp;essential&nbsp;to&nbsp;the&nbsp;operation&nbsp;of&nbsp;this&nbsp;site&nbsp;but&nbsp;that&nbsp;we&nbsp;need&nbsp;your&nbsp;permission&nbsp;before&nbsp;using&nbsp;any&nbsp;other&nbsp;type&nbsp;of&nbsp;cookie.</span></p><p><span style="color: rgb(91, 99, 104);">Cookies&nbsp;can&nbsp;be&nbsp;“persistent”&nbsp;or&nbsp;“session”&nbsp;cookies.</span></p><p><strong style="color: rgb(91, 99, 104);">How&nbsp;&nbsp;sevenstarsatmarshbaldon.co.uk&nbsp;</strong></p><p><span style="color: rgb(91, 99, 104);">When&nbsp;you&nbsp;use&nbsp;and&nbsp;access&nbsp;the&nbsp;Service,&nbsp;we&nbsp;may&nbsp;place&nbsp;several&nbsp;cookie&nbsp;files&nbsp;in&nbsp;your&nbsp;web&nbsp;Browser.</span></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;use&nbsp;cookies&nbsp;for&nbsp;the&nbsp;following&nbsp;purposes:&nbsp;to&nbsp;enable&nbsp;certain&nbsp;functions&nbsp;of&nbsp;the&nbsp;Service,&nbsp;to&nbsp;provide&nbsp;analytics,&nbsp;to&nbsp;store&nbsp;your&nbsp;preferences,&nbsp;to&nbsp;enable&nbsp;advertisement&nbsp;delivery,&nbsp;including&nbsp;behavioural&nbsp;advertising.</span></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;use&nbsp;both&nbsp;session&nbsp;and&nbsp;persistent&nbsp;cookies&nbsp;on&nbsp;the&nbsp;Service,&nbsp;and&nbsp;we&nbsp;use&nbsp;different&nbsp;types&nbsp;of&nbsp;cookies&nbsp;to&nbsp;run&nbsp;the&nbsp;Service:</span></p><p><span style="color: rgb(91, 99, 104);">Essential&nbsp;cookies.&nbsp;We&nbsp;may&nbsp;use&nbsp;essential&nbsp;cookies&nbsp;to&nbsp;authenticate&nbsp;users&nbsp;and&nbsp;prevent&nbsp;fraudulent&nbsp;use&nbsp;of&nbsp;user&nbsp;accounts.</span></p><p><strong style="color: rgb(91, 99, 104);">Third-party&nbsp;cookies</strong></p><p><span style="color: rgb(91, 99, 104);">In&nbsp;addition&nbsp;to&nbsp;our&nbsp;own&nbsp;cookies,&nbsp;we&nbsp;may&nbsp;also&nbsp;use&nbsp;various&nbsp;third-parties&nbsp;cookies&nbsp;to&nbsp;report&nbsp;usage&nbsp;statistics&nbsp;of&nbsp;the&nbsp;Service,&nbsp;deliver&nbsp;advertisements&nbsp;on&nbsp;and&nbsp;through&nbsp;the&nbsp;Service,&nbsp;and&nbsp;so&nbsp;on.</span></p><p><strong style="color: rgb(91, 99, 104);">The&nbsp;cookies&nbsp;we&nbsp;use</strong></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;use&nbsp;the&nbsp;following&nbsp;types&nbsp;of&nbsp;cookies&nbsp;on&nbsp;our&nbsp;website:</span></p><p><span style="color: rgb(91, 99, 104);">Google&nbsp;Analytics&nbsp;cookies:</span></p><p><span style="color: rgb(91, 99, 104);">These&nbsp;cookies&nbsp;collect&nbsp;information&nbsp;about&nbsp;how&nbsp;visitors&nbsp;use&nbsp;a&nbsp;website,e&nbsp;e.g.&nbsp;which&nbsp;pages&nbsp;visitors&nbsp;go&nbsp;to&nbsp;most&nbsp;often.&nbsp;These&nbsp;cookies&nbsp;do&nbsp;not&nbsp;collect&nbsp;information&nbsp;that&nbsp;identifies&nbsp;a&nbsp;visitor&nbsp;but&nbsp;provide&nbsp;a&nbsp;free&nbsp;web&nbsp;analytics&nbsp;service&nbsp;to&nbsp;website&nbsp;owners.</span></p><p><span style="color: rgb(91, 99, 104);">_ga</span></p><p><span style="color: rgb(91, 99, 104);">Used&nbsp;to&nbsp;distinguish&nbsp;users</span></p><p><span style="color: rgb(91, 99, 104);">Default&nbsp;expiration&nbsp;time:&nbsp;2&nbsp;years</span></p><p><span style="color: rgb(91, 99, 104);">_gid</span></p><p><span style="color: rgb(91, 99, 104);">Used&nbsp;to&nbsp;distinguish&nbsp;users</span></p><p><span style="color: rgb(91, 99, 104);">Default&nbsp;expiration&nbsp;time:&nbsp;24&nbsp;hours</span></p><p><span style="color: rgb(91, 99, 104);">_gat</span></p><p><span style="color: rgb(91, 99, 104);">Used&nbsp;to&nbsp;throttle&nbsp;request&nbsp;rate</span></p><p><span style="color: rgb(91, 99, 104);">Default&nbsp;expiration&nbsp;time:&nbsp;1&nbsp;minute</span></p><p><span style="color: rgb(91, 99, 104);">AMP_TOKEN</span></p><p><span style="color: rgb(91, 99, 104);">Contains&nbsp;a&nbsp;token&nbsp;that&nbsp;can&nbsp;be&nbsp;used&nbsp;to&nbsp;retrieve&nbsp;a&nbsp;Client&nbsp;ID&nbsp;fromthe&nbsp;&nbsp;AMP&nbsp;Client&nbsp;ID&nbsp;service.&nbsp;Other&nbsp;possible&nbsp;values&nbsp;indicate&nbsp;opt-out,&nbsp;inflight&nbsp;request&nbsp;or&nbsp;an&nbsp;error&nbsp;retrieving&nbsp;a&nbsp;Client&nbsp;ID&nbsp;from&nbsp;the&nbsp;AMP&nbsp;Client&nbsp;ID&nbsp;service</span></p><p><span style="color: rgb(91, 99, 104);">Default&nbsp;expiration&nbsp;time:&nbsp;30&nbsp;seconds&nbsp;to&nbsp;1&nbsp;year</span></p><p><span style="color: rgb(91, 99, 104);">_gac_&nbsp;Contains&nbsp;campaign-related&nbsp;information&nbsp;for&nbsp;the&nbsp;user.&nbsp;If&nbsp;you&nbsp;have&nbsp;linked&nbsp;your&nbsp;Google&nbsp;Analytics&nbsp;and&nbsp;AdWords&nbsp;accounts,&nbsp;AdWords&nbsp;website&nbsp;conversion&nbsp;tags&nbsp;will&nbsp;read&nbsp;this&nbsp;cookie&nbsp;unless&nbsp;you&nbsp;opt&nbsp;out.</span></p><p><span style="color: rgb(91, 99, 104);">Default&nbsp;expiration&nbsp;time:&nbsp;90&nbsp;days</span></p><p><strong style="color: rgb(91, 99, 104);">What&nbsp;are&nbsp;your&nbsp;choices&nbsp;regarding&nbsp;cookies?</strong></p><p><span style="color: rgb(91, 99, 104);">When&nbsp;accessing&nbsp;the&nbsp;Service,e&nbsp;the&nbsp;cookies&nbsp;noted&nbsp;above&nbsp;are&nbsp;automatically&nbsp;added&nbsp;to&nbsp;your&nbsp;computer.&nbsp;You&nbsp;may&nbsp;choose&nbsp;to&nbsp;block&nbsp;cookies&nbsp;by&nbsp;activating&nbsp;the&nbsp;setting&nbsp;on&nbsp;your&nbsp;browser&nbsp;that&nbsp;allows&nbsp;you&nbsp;to&nbsp;refuse&nbsp;the&nbsp;setting&nbsp;of&nbsp;all&nbsp;or&nbsp;some&nbsp;cookies.</span></p><p><span style="color: rgb(91, 99, 104);">Please&nbsp;note,&nbsp;however,&nbsp;that&nbsp;if&nbsp;you&nbsp;delete&nbsp;cookies&nbsp;or&nbsp;refuse&nbsp;to&nbsp;accept&nbsp;them,&nbsp;you&nbsp;might&nbsp;not&nbsp;be&nbsp;able&nbsp;to&nbsp;use&nbsp;all&nbsp;of&nbsp;the&nbsp;features&nbsp;we&nbsp;offer,&nbsp;you&nbsp;may&nbsp;not&nbsp;be&nbsp;able&nbsp;to&nbsp;store&nbsp;your&nbsp;preferences,&nbsp;and&nbsp;some&nbsp;of&nbsp;our&nbsp;pages&nbsp;might&nbsp;not&nbsp;display&nbsp;properly.</span></p><p><strong style="color: rgb(91, 99, 104);">Your&nbsp;consent</strong></p><p><span style="color: rgb(91, 99, 104);">By&nbsp;clicking&nbsp;on&nbsp;the&nbsp;“Accept&nbsp;Cookies”&nbsp;tab&nbsp;on&nbsp;the&nbsp;cookie&nbsp;pop-up&nbsp;on&nbsp;our&nbsp;site&nbsp;or&nbsp;by&nbsp;continuing&nbsp;to&nbsp;use&nbsp;the&nbsp;Service,&nbsp;we&nbsp;deem&nbsp;that&nbsp;you&nbsp;have&nbsp;provided&nbsp;your&nbsp;consent&nbsp;to&nbsp;the&nbsp;use&nbsp;of&nbsp;the&nbsp;above-named&nbsp;cookies.</span></p><p><strong style="color: rgb(91, 99, 104);">Contact&nbsp;us</strong></p><p><span style="color: rgb(91, 99, 104);">If&nbsp;you&nbsp;have&nbsp;any&nbsp;queries&nbsp;about&nbsp;your&nbsp;personal&nbsp;information&nbsp;or&nbsp;any&nbsp;questions&nbsp;on&nbsp;our&nbsp;use&nbsp;of&nbsp;the&nbsp;information,&nbsp;please&nbsp;contact&nbsp;info@sevenstarsatmb.co.uk</span></p><p></p>`,
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
