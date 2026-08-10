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
            description:
              "We're your neighborhood pub situated in the heart of Oxfordshire serving mouth-watering food, real ales, and a warm welcome.",
            primaryBtnLabel: "Discover Menu",
            primaryBtnUrl: "/menu",
            secondaryBtnLabel: "Book a Table",
            secondaryBtnUrl: "/contact",
            heroImage: IMAGES.HERO_ATMOSPHERIC,
            images: [
              IMAGES.HERO_ATMOSPHERIC,
              IMAGES.HERO_INTERIOR,
              IMAGES.EXTERIOR_MAIN,
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
            enabled: true,
            badge: "Welcome Offer",
            title: "Send an Enquiry",
            description: "We aim to respond to all enquiries within 24 hours.",
            welcomeText: "Welcome",
            imageTitle: "Seven Stars",
            imageSubtitle: "Marsh Baldon, Oxford",
            discountCode: "WELCOME10",
            buttonText: "Claim Voucher",
            buttonUrl: "/contact",
            image: IMAGES.EXTERIOR_MAIN,
            popupImage: IMAGES.EXTERIOR_MAIN,
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
                  IMAGES.FOOD_STEAK,
                  IMAGES.DINING_HALL,
                  IMAGES.DINING_TABLE,
                ],
                description:
                  "The ultimate British tradition, perfected with local meats.",
                icon: "Utensils",
              },
              {
                title: "Pub Classics",
                images: [
                  IMAGES.FOOD_SPECIAL,
                  IMAGES.GALLERY_BAR,
                  IMAGES.GALLERY_COZY,
                ],
                description:
                  "Time-honored favorites with a sophisticated gourmet twist.",
                icon: "GlassWater",
              },
              {
                title: "Seasonal Specials",
                images: [
                  IMAGES.GALLERY_DRINKS,
                  IMAGES.GALLERY_GARDEN,
                  IMAGES.STORY_HERITAGE,
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
                name: "Spiced Home-Reared Lamb Kofta",
                price: "£12.95",
                description:
                  "Red pepper hummus, lightly spiced onion, tzatziki, warm pita.",
                image: `${STORAGE_BASE}/1781071047399-SEVEN_STARS_2026_02_09-35.webp`,
              },
              {
                name: "Spiced Poached Pear",
                price: "£8.50",
                description:
                  "Red wine gastrique, vanilla bean gelato, cinnamon oat crumble.",
                image:
                  "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781688775136-SEVEN_STARS_2026_02_09-0173.webp",
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
                image: IMAGES.HERO_INTERIOR,
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
                image: IMAGES.DINING_HALL,
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
                image: IMAGES.DINING_TABLE,
              },
            ],
            testimonialImages: [
              IMAGES.HERO_INTERIOR,
              IMAGES.DINING_HALL,
              IMAGES.DINING_TABLE,
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
            phoneUrl: "+441865343337",
            image1: IMAGES.FOOD_STEAK,
            image2: IMAGES.GALLERY_COZY,
            title: "Ready to Experience Seven Stars?",
            subtitle: "Book your table online or stop by for a pint.",
            buttonText: "Book Table Now",
            buttonUrl: "/contact#book",
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
            ctaUrl: "/contact#book",
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
                hours: "12:00 - 22:00",
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
            quote:
              "More than a pub, it belongs to its community. The Seven Stars at Marsh Baldon is set in a picturesque Oxfordshire village. In the truest sense of the word, it belongs to the people who call this place home.",
            title: "About Us",
            subtitle:
              "A community-owned gem in the heart of Oxfordshire, where traditional hospitality meets a serious kitchen.",
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
              "The Seven Stars at Marsh Baldon is set in a picturesque Oxfordshire village. In the truest sense of the word, it belongs to the people who call this place home. Community-owned and community-run, every pint poured and every plate served is a small act of keeping something genuinely valuable alive.",
            rootsDesc2:
              "Nestled in the heart of Marsh Baldon, The Seven Stars is one of the few community-owned pubs in Oxfordshire. More than a local landmark, it is a shared commitment—kept alive by the people who cherish it. Every pint poured, every meal served, and every guest welcomed helps preserve a pub that continues to bring people together, just as it has for generations.",
            pillar1: "Community Owned",
            pillar2: "Warm Hospitality",
            pillar3: "Local Produce",
            rootsImages: [
              `${STORAGE_BASE}/1781163080123-SEVEN_STARS_2026_02_09-0005.webp`,
              `${STORAGE_BASE}/1781085714533-SEVEN_STARS_2026_02_09-0008.webp`,
              `${STORAGE_BASE}/1781085721419-SEVEN_STARS_2026_02_09-0032.webp`,
              `${STORAGE_BASE}/1781085727303-SEVEN_STARS_2026_02_09-0151.webp`,
              `${STORAGE_BASE}/1781085731650-SEVEN_STARS_2026_02_09-125.webp`,
              `${STORAGE_BASE}/1781085738861-SEVEN_STARS_2026_02_09-0040.webp`,
              `${STORAGE_BASE}/1781085742647-SEVEN_STARS_2026_02_09-0107.webp`,
              `${STORAGE_BASE}/1781085747049-SEVEN_STARS_2026_02_09-124.webp`,
              `${STORAGE_BASE}/1781686621461-SEVEN_STARS_2026_02_09-145.webp`,
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
              "We believe that a great British pub should do three things well: serve excellent food, pour a proper drink, and make every single person who walks through the door feel welcome.",
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
              "More than a meal. More than a drink.",
              "Set beside the village green, welcoming walkers, families, and friends.",
            ],
            title: "Life at The Seven Stars",
            description:
              "The Seven Stars is the kind of place where time slows down. Set beside the village green, it welcomes walkers fresh from the countryside, families gathering around the table, friends meeting over a pint, and visitors discovering Marsh Baldon for the first time.",
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
            ctaHeading: "Celebrate your special moments with us.",
            ctaDesc:
              "From intimate dinners to grand celebrations in our private barn, we make every occasion unforgettable. The Seven Stars is a place to come together.",
            ctaButtonUrl: "/contact",
            ctaButtonLabel: "Book a Table",
            title: "The Backdrop to Life's Celebrations",
            description:
              "From intimate dinners and milestone birthdays to weddings, anniversaries, christenings, and private celebrations—The Seven Stars is a place to come together. For larger gatherings, our private barn offers a characterful setting where every celebration feels truly special.",
            buttonText: "Book Table Now",
            buttonUrl: "/contact#book",
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
            description:
              "Our kitchen works with fresh, carefully sourced ingredients, honouring British classics while taking inspiration from across Europe, the Middle East and South Asia.",
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
              "Our kitchen works with fresh, carefully sourced ingredients to craft heartening dishes that become the season to bond together.",
            paragraph1:
              "At their heart, our dishes are rooted in British pub tradition but we love to bring in Middle Eastern, European and South Asian influences that keep things interesting.",
            paragraph2:
              "There's always something to look forward to with scrumptious open sandwiches, wholesome cheese boards and mouthwatering orange and cognac crème brulée.",
            btnLabel: "View Our Menus",
            btnUrl: "/menu",
            indoorCapacity: "76",
            gardenCapacity: "150",
            showcaseImage: `${STORAGE_BASE}/1781687985102-SEVEN_STARS_2026_02_09-206.webp`,
            imageAlt: "Gourmet dish at Seven Stars",
            imageOverlayTitle: "Proper Food",
            imageOverlaySubtitle: "Honouring British Pub Tradition",
          },
        },
        {
          type: "DiningIntro",
          order: 2,
          content: {
            introTagline: "THE DINING EXPERIENCE",
            introHeadingPart1: "Honest food,",
            introHeadingItalic: "thoughtfully",
            introHeadingPart2: "prepared.",
            introDesc1:
              "At The Seven Stars, every dish begins with fresh, carefully sourced ingredients and a respect for the seasons. Rooted in the traditions of the British pub, our menu is complemented by subtle influences from the Middle East, Europe and South Asia.",
            introDesc2:
              "Whether you're stopping by for a leisurely lunch, a Sunday roast, or ending your meal with our orange and cognac crème brûlée — every plate is prepared with care and designed to be enjoyed together.",
            introFeature1: "Locally Sourced Ingredients",
            introFeature2: "Seasonal Menus",
            introImage: IMAGES.DINING_TABLE,
            title: "Honest food, thoughtfully prepared.",
          },
        },
        {
          type: "DiningQuote",
          order: 3,
          content: {
            quote:
              "Food is the ingredient that binds us together, And at Seven Stars, we make sure it's extraordinary.",
            author:
              "Food has always brought people together. At The Seven Stars, we simply make it worth gathering for.",
          },
        },
        {
          type: "DiningPillars",
          order: 4,
          content: {
            title: "Classic Foundations, Global Inspirations",
            subtitle: "British Traditions. Worldly Flavours.",
            pillars: [
              {
                title: "British Classics",
                description:
                  "Timeless British favourites, prepared with care using fresh, seasonal ingredients. Familiar, comforting and full of flavour, they're the dishes you'll want to come back to.",
              },
              {
                title: "Seasonal Specials",
                description:
                  "Alongside our British favourites, our seasonal specials take inspiration from European, Middle Eastern and South Asian cuisines, offering new flavours to discover throughout the year.",
              },
              {
                title: "Signature Experiences / Weekly Rituals",
                description:
                  "Our fortnightly Indian Thali Nights sit comfortably alongside our celebrated Sunday Roasts, offering two dining experiences that guests look forward to throughout the year.",
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
            barnImage: `${STORAGE_BASE}/1781686607452-SEVEN_STARS_2026_02_09-0028.webp`,
            capacityTitle: "CAPACITY",
            capacityDesc: "Designed for gatherings of up to 40 guests.",
            beerTentTitle: "OUTDOOR EXTENSION",
            beerTentDesc:
              "A covered Beer Tent provides a flexible outdoor setting for larger celebrations.",
            barnCtaText: "Enquire Barn Hire",
          },
        },
        {
          type: "DiningOutdoor",
          order: 6,
          content: {
            outdoorHeading: "Outdoor",
            outdoorHeadingItalic: "Seating",
            outdoorDesc:
              "When the weather is kind, there's nowhere better to be than our garden overlooking the village green. Settle in for a leisurely meal, enjoy a drink with friends, or simply take in the peaceful surroundings.",
            outdoorImages: [
              `${STORAGE_BASE}/1781156724977-SEVEN_STARS_2026_02_09-0106.webp`,
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
            description:
              "At The Seven Stars, our kitchen starts with fresh, quality ingredients, honouring the classics while keeping things interesting with seasonal specials.",
            title: "Food & Drink Menus",
            backgroundImage: `${STORAGE_BASE}/1781687985102-SEVEN_STARS_2026_02_09-206.webp`,
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
                image: `${STORAGE_BASE}/1781085714533-SEVEN_STARS_2026_02_09-0008.webp`,
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
                image: `${STORAGE_BASE}/1781086645604-SEVEN_STARS_2026_02_09-169.webp`,
                items: [
                  "Beer-Battered Haddock & Chips",
                  "Seven Stars Cheeseburger",
                  "Fish & Chips",
                  "Classic Burger",
                ],
              },
              {
                title: "Mains",
                image: `${STORAGE_BASE}/1781687985102-SEVEN_STARS_2026_02_09-206.webp`,
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
                image: `${STORAGE_BASE}/1781687988901-SEVEN_STARS_2026_02_09-81.webp`,
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
            title: "Local Ales, Lagers & Fine Drinks",
            description:
              "We take our drinks as seriously as our food. The Seven Stars stocks a carefully chosen range of local ales, lagers and ciders while supporting producers from across the region.",
            image: IMAGES.GALLERY_DRINKS,
          },
        },
        {
          type: "MenuIntro",
          order: 4,
          content: {
            title: "Dietary Options & Special Nights",
            content:
              "We cater for vegetarian, vegan, and gluten-free diets. Don't miss our fortnightly Indian Thali Nights and seasonal specials!",
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
            title: "Events & Special Gatherings",
            subtitle:
              "Step through the door into a classic space or enjoy Oxfordshire's finest beer garden",
            backgroundImage: IMAGES.EVENT_GATHERING,
          },
        },
        {
          type: "UpcomingEvents",
          order: 1,
          content: {
            title: "Upcoming Pub Gatherings",
            description:
              "From summer BBQs in our sprawling beer garden to quiz nights, live music evenings, classic car meets and festive celebrations.",
            events: [
              {
                title: "Monthly Pub Quiz Night",
                date: "First Thursday of the Month",
                time: "7:30 PM",
                description:
                  "Test your trivia knowledge! Entry £2 per person, prizes for top teams.",
                image: IMAGES.EVENT_GATHERING,
              },
              {
                title: "Live Acoustic & Summer BBQ Sessions",
                date: "Every Alternate Sunday",
                time: "4:00 PM - 7:00 PM",
                description:
                  "Relax with local acoustic talent while enjoying great food and drinks in the garden.",
                image: IMAGES.EVENT_MUSIC,
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
            subtext:
              "From intimate celebrations to large gatherings, we have the perfect setting for every occasion.",
            items: [
              "Birthday parties & milestone celebrations",
              "Family get-togethers & reunion dinners",
              "Corporate lunches & team away days",
              "Wedding receptions & pre-wedding celebrations",
              "Summer BBQ parties",
              "Christmas parties & NYE celebrations",
              "Community events & fundraisers",
            ],
            image: `${STORAGE_BASE}/1781164162893-SEVEN_STARS_2026_02_09-0142.webp`,
          },
        },
        {
          type: "EventsCapabilities",
          order: 4,
          content: {
            title: "Function Features & Spaces",
            capabilities: [
              {
                title: "Main Bar & Dining Area",
                description:
                  "Seats 76 guests, warmed by an open fireplace in winter and filled with light in summer.",
              },
              {
                title: "The Private Barn",
                description:
                  "Flexible private space accommodating up to 40 guests for celebrations or corporate dining, with covered Beer Tent option.",
              },
              {
                title: "Sprawling Beer Garden",
                description:
                  "One of the finest beer gardens in Oxfordshire, seating 120 to 150 guests for slow summer afternoons.",
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
            title: "Photo Gallery",
            subtitle:
              "Check out our countryside charm, cosy interiors, roaring fireplace and finest beer garden",
            backgroundImage: IMAGES.GALLERY_BAR,
          },
        },
        {
          type: "GalleryGrid",
          order: 1,
          content: {
            title: "Our Image Collection",
            description:
              "Explore our interiors, beer garden and the events that bring our community together.",
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
            subtitle: "A Community That Creates Happy Moments",
            description:
              "Our story began when we started looking for ways to bring people together. These community members shared a common interest and shared purpose.",
            backgroundImage: `${STORAGE_BASE}/1781163080123-SEVEN_STARS_2026_02_09-0005.webp`,
          },
        },
        {
          type: "StoryIntro",
          order: 1,
          content: {
            introTagline: "OUR STORY",
            introHeading: "Saved by the community.",
            introHeadingItalic: "Sustained by its people.",
            introDesc:
              "The Seven Stars is more than a village pub—it is a story of a community coming together to preserve a place they couldn't imagine losing.",
            title: "A Pub by the People, for the People",
            content:
              "The Seven Stars is one of the few pubs in the country to be owned by the very community it serves. When its future was uncertain, the people of Marsh Baldon came together to secure it, ensuring this much-loved village pub would remain part of local life for generations to come.\n\nThat spirit continues to shape everything we do. While our roots are firmly in the village, our doors are open to everyone—whether you're a familiar face or visiting for the very first time. Every meal shared, every pint poured and every gathering held here helps sustain a place that belongs not to one person, but to an entire community.\n\nMore than a pub, The Seven Stars is a shared legacy—cared for by its people and enjoyed by all who walk through its doors.",
            image: `${STORAGE_BASE}/1781085714533-SEVEN_STARS_2026_02_09-0008.webp`,
          },
        },
        {
          type: "StoryTimeline",
          order: 2,
          content: {
            title: "Key Milestones in Our Journey",
            timelineSteps: [
              {
                year: "1660s",
                title: "350+ Years of Tradition",
                desc: "Established as a village pub central to life across Marsh Baldon, Toot Baldon, and Nuneham Courtenay.",
              },
              {
                year: "Dec 2012",
                title: "Community Society Formed",
                desc: "Residents formed the Baldons and Nuneham Community Society (BNCS) to buy and run the pub.",
              },
              {
                year: "Mar 2013",
                title: "Pub Reopened by Villagers",
                desc: "Purchased in March 2013 and restored by villagers, reopening on 30th March 2013 as a revived community hub.",
              },
              {
                year: "2016",
                title: "CAMRA Pub of the Year",
                desc: "Awarded CAMRA Pub of the Year with ongoing enhancements to dining, accessibility, and facilities.",
              },
              {
                year: "2023",
                title: "New Stewardship Chapter",
                desc: "A new chapter began under Namit Julka and Sunit Bansode, ensuring Seven Stars stays true to its roots with fresh energy.",
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
            subtitle:
              "Step into the warmth of our decorated countryside pub in Marsh Baldon, Oxford. Savor award-winning festive menus, cozy up next to glowing fireplaces, and celebrate the season in style.",
            primaryButtonText: "RESERVE YOUR TABLE",
            primaryButtonUrl: "/contact#book",
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
            buttonText: "BOOK YOUR CHRISTMAS PARTY NOW!",
            buttonUrl: "/contact#book",
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
                image: `${STORAGE_BASE}/1782451657572-christmas-pub-hero.webp`,
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
                image: `${STORAGE_BASE}/1782451790403-christmas-poster-day.webp`,
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
                image: `${STORAGE_BASE}/1782451835616-christmas-children-feast.webp`,
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
            buttonUrl: "/contact#christmas",
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
                hours: "12:00 - 22:00",
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
            subtitle:
              "Latest news, recipe guides, and stories from Marsh Baldon",
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
