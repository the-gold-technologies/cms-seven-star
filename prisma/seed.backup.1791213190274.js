require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// 1. Admin User Data
const usersData = [
  {
    id: "cmtwx8n4h0000yl3paqmu43nc",
    name: "Admin",
    email: "admin@sevenstars.co.uk",
    password: "$2b$10$GJ.9rzcsLiNuIBJSP/CsSeaOjF3FcvgEFNTHK15hxwJQB0uZTALCu",
  },
];

// 2. Global Configuration Data
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
      url: "https://instagram.com/sevenstarsmarshbaldon",
      name: "Instagram",
    },
    {
      url: "https://facebook.com/sevenstarsmarshbaldon",
      name: "Facebook",
    },
  ],
  canonicalOrdering: "default",
  sitemapEnabled: true,
  sitemapCustomContent: null,
  robotsTxt:
    "User-agent: *\nAllow: /\n\nSitemap: https://sevenstarsatmarshbaldon.co.uk/sitemap.xml",
  schema: null,
};

// 3. Navigation Links Data
const navLinksData = [
  {
    id: "cmtwx8od10001yl3pgzai5rgb",
    label: "About Us",
    url: "/about",
    type: "Dropdown",
    parent: "-",
    order: 1,
    description: null,
    title: null,
    isStatic: true,
  },
  {
    id: "cmtwx8oxm0002yl3pzomqvvko",
    label: "About Us",
    url: "/about",
    type: "Sub-link",
    parent: "cmtwx8od10001yl3pgzai5rgb",
    order: 1,
    description: null,
    title: null,
    isStatic: true,
  },
  {
    id: "cmtwx8r7b0006yl3pnqgz2807",
    label: "Christmas",
    url: "/christmas",
    type: "Sub-link",
    parent: "cmtwx8qmu0005yl3pebipza9t",
    order: 1,
    description: null,
    title: null,
    isStatic: true,
  },
  {
    id: "cmtwx8rrs0007yl3pjc46fvjx",
    label: "Events",
    url: "/events",
    type: "Sub-link",
    parent: "cmtwx8qmu0005yl3pebipza9t",
    order: 2,
    description: null,
    title: null,
    isStatic: true,
  },
  {
    id: "cmtwx8q2e0004yl3pgsqycyc3",
    label: "Dining",
    url: "/dining",
    type: "Main Link",
    parent: "-",
    order: 2,
    description: null,
    title: null,
    isStatic: true,
  },
  {
    id: "cmtwx8phz0003yl3pcxxxrbfa",
    label: "Our Story",
    url: "/our-story",
    type: "Sub-link",
    parent: "cmtwx8od10001yl3pgzai5rgb",
    order: 2,
    description: null,
    title: null,
    isStatic: true,
  },
  {
    id: "cmtwx8qmu0005yl3pebipza9t",
    label: "Events",
    url: "/events",
    type: "Dropdown",
    parent: "-",
    order: 3,
    description: null,
    title: null,
    isStatic: true,
  },
  {
    id: "cmtwx8sc50008yl3p0fhttmpo",
    label: "Menu",
    url: "/menu",
    type: "Main Link",
    parent: "-",
    order: 4,
    description: null,
    title: null,
    isStatic: true,
  },
  {
    id: "cmtwx8swh0009yl3pbjea5n7c",
    label: "Gallery",
    url: "/gallery",
    type: "Main Link",
    parent: "-",
    order: 5,
    description: null,
    title: null,
    isStatic: true,
  },
  {
    id: "cmtwx8th0000ayl3p7vhidq10",
    label: "News & Blog",
    url: "/blog",
    type: "Main Link",
    parent: "-",
    order: 6,
    description: null,
    title: null,
    isStatic: true,
  },
];

// 4. Pages and Sections Data (All 20 pages + blog posts with their sections)
const pagesData = [
  {
    id: "cmtwx8v6o000byl3phso1flxk",
    title: "Home",
    slug: "home",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "Main Homepage of The Seven Stars Pub",
    metaTitle: "The Seven Stars | Community Pub in Marsh Baldon",
    metaDescription:
      "Welcome to The Seven Stars - traditional countryside pub in Marsh Baldon, Oxfordshire serving fresh seasonal food and cask ales.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx8v6o000cyl3ppa0spftl",
        type: "HeroSection",
        content: {
          images: [
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686626397-SEVEN_STARS_2026_02_09-338.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686607452-SEVEN_STARS_2026_02_09-0028.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686614010-SEVEN_STARS_2026_02_09-210.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686621461-SEVEN_STARS_2026_02_09-145.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686610741-SEVEN_STARS_2026_02_09-0076.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686617797-SEVEN_STARS_2026_02_09-0113.webp",
          ],
          heroImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781160541188-SEVEN_STARS_2026_02_09-207.webp",
          headingTag: "h1",
          youtubeUrl: "",
          description: "",
          facebookUrl: "https://www.facebook.com/sevenstarsatmarshbaldon",
          googleRating: "",
          instagramUrl: "https://www.instagram.com/sevenstarsatmarshbaldon/",
          marqueePills: [
            "Sunday Roasts",
            "Local Ales",
            "Beer Garden",
            "Private Barn",
            "Seasonal Specials",
          ],
          headlineLine1: "Where Village  Warmth Meets",
          primaryBtnUrl: "/menu",
          primaryBtnLabel: "Discover Menu",
          secondaryBtnUrl:
            "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
          googleReviewsUrl: "",
          secondaryBtnLabel: "Book a Table",
          googleReviewsCount: "",
          headlineLine2Italic: "Great Food",
        },
        order: 0,
      },
      {
        id: "cmtwx8v6o000dyl3p2939tpsj",
        type: "FirstTimePopup",
        content: {
          image:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1789993417696-Christmasmenu.webp",
          title: "Send an Enquiry",
          isEnabled: true,
          imageTitle: " ",
          description: "We aim to respond to all enquiries within 24 hours.",
          welcomeText: " ",
          imageSubtitle: " ",
        },
        order: 1,
      },
      {
        id: "cmtwx8v6o000eyl3pu1uhz67y",
        type: "AboutUs",
        content: {
          image:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781163080123-SEVEN_STARS_2026_02_09-0005.webp",
          stats: [
            {
              label: "Years of Heritage",
              value: "300+",
            },
            {
              label: "Community Shareholders",
              value: "75+",
            },
            {
              label: "Local Craft Beers",
              value: "12",
            },
          ],
          title: "Welcome to The Seven Stars at Marsh Baldon",
          ctaUrl: "/dining",
          ctaLabel: "EXPLORE OUR DINING",
          imageAlt: "The Seven Stars historic exterior and green",
          subtitle: "Community Owned & Operated",
          upperTag: "OUR STORY",
          buttonUrl: "/our-story",
          doorImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781163080123-SEVEN_STARS_2026_02_09-0005.webp",
          buttonText: "Read Our Story",
          paragraphs: [
            "Tucked away in the beautiful village of Marsh Baldon, The Seven Stars is everything a great British pub should be. Community-owned and community-run, every pint poured and every plate served is a small act of keeping something genuinely valuable alive.",
            "We believe that a great British pub should do three things well: serve excellent food, pour a proper drink, and make every single person who walks through the door feel welcome. Whether you're joining us for a relaxed Sunday evening or celebrating with friends, our warm atmosphere invites you to stay a while.",
          ],
          description:
            "Saved by local residents in 2013, Seven Stars is more than just a pub—it is the vibrant social heart of Marsh Baldon.",
          headingLabel: "Welcome to",
          sectionNumber: "01",
          headingItalicHighlight: "The Seven Stars at Marsh Baldon",
        },
        order: 2,
      },
      {
        id: "cmtwx8v6o000fyl3pbm3s43kb",
        type: "FeatureTiles",
        content: {
          title: "What Makes Us Special",
          features: [
            {
              title: "Sunday Roasts",
              images: [
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687988901-SEVEN_STARS_2026_02_09-81.webp",
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687981908-SEVEN_STARS_2026_02_09-114.webp",
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787575973421-SEVEN_STARS_2026_02_09-206.webp",
              ],
              description:
                "The ultimate British tradition, perfected with local meats.",
            },
            {
              title: "Pub Classics",
              images: [
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687990034-SEVEN_STARS_2026_02_09-306.webp",
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687991208-SEVEN_STARS_2026_02_09-329.webp",
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087452994-SEVEN_STARS_2026_02_09-349.webp",
              ],
              description:
                "Time-honored favorites with a sophisticated gourmet twist.",
            },
            {
              title: "Seasonal Specials",
              images: [
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787553095858-1781087027455-SEVEN_STARS_2026_02_09-126.webp",
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781688388195-SEVEN_STARS_2026_02_09-155.webp",
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781688390427-SEVEN_STARS_2026_02_09-138.webp",
              ],
              description:
                "Fresh, local ingredients inspired by the changing seasons.",
            },
          ],
          subtitle: "Experience true countryside charm",
          tagLabel: "Gastro Pub Experience",
          italicHeading: "Pub Traditions",
          regularHeading: "Discover Our",
        },
        order: 3,
      },
      {
        id: "cmtwx8v6o000gyl3p4harbwzd",
        type: "MenuFeatured",
        content: {
          btnUrl: "/menu",
          dishes: [
            {
              name: "Pan-Seared Duck Breast",
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787556994844-1781688390427-SEVEN_STARS_2026_02_09-138.webp",
              price: "£24.00",
              description:
                "Dauphinoise Potatoes, Garlic Kale, Cherry Tomatoes, Red Wine Jus",
            },
            {
              name: "Spiced Poached Pear",
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781688775136-SEVEN_STARS_2026_02_09-0173.webp",
              price: "£8.50",
              description:
                "Firm pear poached in spiced red wine, star anise and cinnamon, served with orange sorbet",
            },
            {
              name: "Spiced Home-Reared Lamb Kofta",
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781071047399-SEVEN_STARS_2026_02_09-35.webp",
              price: "£12.95",
              description:
                "Red pepper hummus, lightly spiced onion, tzatziki, warm pita.",
            },
          ],
          btnLabel: "Explore Full Menu",
          upperTag: "The Chef's Selection",
          badgeText: "Culinary excellence in every bite.",
          watermark: "Signature Dishes",
          badgeLabel: "Chef's Signature",
          btnSublabel: "See our complete seasonal collection",
          description:
            "Experience our most celebrated seasonal creations, each crafted with locally sourced ingredients and culinary passion.",
          italicHeading: "Exceptional",
          regularHeading: "Taste the",
        },
        order: 4,
      },
      {
        id: "cmtwx8v6o000hyl3p1ssnh1p7",
        type: "EventGallery",
        content: {
          title: "Upcoming Gatherings & Events",
          images: [
            {
              alt: "Mother's Day Special Luncheon",
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686607452-SEVEN_STARS_2026_02_09-0028.webp",
            },
            {
              alt: "Mother's Day Celebration Table",
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686610741-SEVEN_STARS_2026_02_09-0076.webp",
            },
            {
              alt: "Mother's Day Experience Preview",
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687988901-SEVEN_STARS_2026_02_09-81.webp",
            },
            {
              alt: "Indian Heritage Banquet",
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781163080123-SEVEN_STARS_2026_02_09-0005.webp",
            },
            {
              alt: "Pub Atmosphere",
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686626397-SEVEN_STARS_2026_02_09-338.webp",
            },
          ],
          subtitle: "Live music, pub quizzes, and seasonal celebrations",
          upperTag: "Events & Celebrations",
          headingPart1: "Perfect For",
          headingItalicHighlight: "Every Moment",
        },
        order: 5,
      },
      {
        id: "cmtwx8v6o000iyl3pwb9fr6rw",
        type: "Gallery",
        content: {
          title: "Life at Seven Stars",
          images: [
            {
              alt: "Authentic Pub Atmosphere",
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686626397-SEVEN_STARS_2026_02_09-338.webp",
              url: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686626397-SEVEN_STARS_2026_02_09-338.webp",
              caption: "Cozy Bar Seating",
            },
            {
              alt: "Vibrant Main Bar",
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687981908-SEVEN_STARS_2026_02_09-114.webp",
              url: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687981908-SEVEN_STARS_2026_02_09-114.webp",
              caption: "Summer Garden Terrace",
            },
            {
              alt: "Traditional Pub Character",
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687990034-SEVEN_STARS_2026_02_09-306.webp",
              url: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687990034-SEVEN_STARS_2026_02_09-306.webp",
              caption: "Fireside Dining",
            },
            {
              alt: "Restaurant Interior Detail",
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687991208-SEVEN_STARS_2026_02_09-329.webp",
              url: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687991208-SEVEN_STARS_2026_02_09-329.webp",
              caption: "Local Cask & Craft Ales",
            },
            {
              alt: "Atmospheric Interiors",
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686621461-SEVEN_STARS_2026_02_09-145.webp",
              url: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686621461-SEVEN_STARS_2026_02_09-145.webp",
              caption: "Traditional Facade",
            },
            {
              alt: "Gourmet Dining Setup",
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781160176550-SEVEN_STARS_2026_02_09-137.webp",
              url: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781160176550-SEVEN_STARS_2026_02_09-137.webp",
              caption: "Dining Room",
            },
          ],
          subtitle: "A glimpse inside our pub and gardens",
          upperTag: "Visual Journey",
          description:
            "A comprehensive look into the Seven Stars. Explore our historic architecture, vibrant interiors, and the premium gastro experience across our entire curated collection.",
          italicHeading: "Gallery",
          regularHeading: "Our",
        },
        order: 6,
      },
      {
        id: "cmtwx8v6o000jyl3pg3mhdzux",
        type: "Testimonials",
        content: {
          title: "What Our Guests Say",
          subtitle: "Reviews from locals and travelers alike",
          testimonials: [
            {
              name: "James Harrison",
              role: "Local Food Critic",
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686610741-SEVEN_STARS_2026_02_09-0076.webp",
              quote:
                "The atmosphere at Seven Stars is unmatched. From the warm welcome to the exquisite Middle Eastern influences in their Sunday roast, it's a truly wonderful pub experience.",
              author: "James Harrison",
              rating: 5,
              comment:
                "The atmosphere at Seven Stars is unmatched. From the warm welcome to the exquisite Middle Eastern influences in their Sunday roast, it's a truly wonderful pub experience.",
            },
            {
              name: "Sarah Jenkins",
              role: "Frequent Guest",
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781688388195-SEVEN_STARS_2026_02_09-155.webp",
              quote:
                "A perfect blend of British tradition and modern culinary art. Their orange and cognac crème brulée is quite literally the best dessert I've had this year.",
              author: "Sarah Jenkins",
              rating: 5,
              comment:
                "A perfect blend of British tradition and modern culinary art. Their orange and cognac crème brulée is quite literally the best dessert I've had this year.",
            },
            {
              name: "Robert & Elena",
              role: "Regular Guests",
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781688953515-SEVEN_STARS_2026_02_09-0006.webp",
              quote:
                "We hosted our anniversary here and the team went above and beyond. The setting is stunning, especially in the evening when the glow hits the stone walls.",
              author: "Robert & Elena",
              rating: 5,
              comment:
                "We hosted our anniversary here and the team went above and beyond. The setting is stunning, especially in the evening when the glow hits the stone walls.",
            },
          ],
          testimonialImages: [
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686610741-SEVEN_STARS_2026_02_09-0076.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781688388195-SEVEN_STARS_2026_02_09-155.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781688953515-SEVEN_STARS_2026_02_09-0006.webp",
          ],
        },
        order: 7,
      },
      {
        id: "cmtwx8v6o000kyl3pbcp42938",
        type: "ReadyToVisit",
        content: {
          image:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781160176550-SEVEN_STARS_2026_02_09-137.webp",
          lines: ["Book online or give us a call.", "We'd love to see you."],
          title: "Ready to Experience Seven Stars?",
          image1:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779094138324-food-gourmet.webp",
          image2:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087458738-SEVEN_STARS_2026_02_09-0012.webp",
          bookUrl: "/contact",
          heading: "Ready to Visit?",
          phoneUrl: "tel:01865343337",
          subtitle: "Book your table online or stop by for a pint.",
          upperTag: "PLAN YOUR VISIT",
          bookLabel: "Book a Table",
          buttonUrl:
            "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
          buttonText: "Book Table Now",
          phoneLabel: "Call Us",
        },
        order: 8,
      },
      {
        id: "cmtwx8v6o000lyl3ppretaagq",
        type: "FooterCMS",
        content: {
          ctaUrl:
            "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
          address:
            "The Seven Stars at Marsh Baldon,\nThe Green, Baldon Lane, Marsh\nBaldon, Oxford - OX44 9LP",
          tagline: "Countryside Gastro Pub",
          ctaLabel: "BOOK A TABLE",
          watermark: "Seven Stars",
          youtubeUrl: "#",
          companyName: "SEVEN STARS",
          facebookUrl: "https://www.facebook.com/sevenstarsatmarshbaldon",
          phoneNumber: "01865 343337",
          emailAddress: "info@sevenstarsatmb.co.uk",
          instagramUrl: "https://www.instagram.com/sevenstarsatmarshbaldon/",
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
          backgroundImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779093880678-footer-bg.webp",
          footerDescription:
            "Born from a passion for exceptional hospitality, Seven Stars merges the warmth of a countryside pub with the sophistication of a premium dining experience.",
        },
        order: 9,
      },
    ],
  },
  {
    id: "cmtwx8xhf000myl3p3nl41iae",
    title: "About Us",
    slug: "about",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "About The Seven Stars Pub",
    metaTitle: "About Us | The Seven Stars Marsh Baldon",
    metaDescription:
      "Learn about the history, community buyout, and warm hospitality of The Seven Stars in Marsh Baldon.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx8xhf000nyl3p5bu9svdr",
        type: "AboutHero",
        content: {
          title: "About Us",
          tagline: "OUR STORY",
          badgeText: "Est. 17th Century",
          headingPart1: "About",
          backgroundImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781689296201-SEVEN_STARS_2026_02_09-0166.webp",
          headingItalicHighlight: "Us",
        },
        order: 0,
      },
      {
        id: "cmtwx8xhf000oyl3paqo3gh2m",
        type: "AboutRoots",
        content: {
          image:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781085714533-SEVEN_STARS_2026_02_09-0008.webp",
          title: "A village pub, owned by the people it serves.",
          pillar1: "Community Owned",
          pillar2: "Warm Hospitality",
          pillar3: "Local Produce",
          rootsTag: "OUR STORY",
          rootsDesc1:
            "Nestled in the heart of Marsh Baldon, The Seven Stars is one of the few community-owned pubs in Oxfordshire. More than a local landmark, it is a shared commitment—kept alive by the people who cherish it.",
          rootsDesc2:
            "Every pint poured, every meal served, and every guest welcomed helps preserve a pub that continues to bring people together, just as it has for generations.",
          description:
            "Nestled in the heart of Marsh Baldon, The Seven Stars is one of the few community-owned pubs in Oxfordshire.",
          rootsImages: [
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781084597937-Gemini_Generated_Image_3ongbm3ongbm3ong.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781084593652-Gemini_Generated_Image_zdu2vbzdu2vbzdu2.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781084589375-Gemini_Generated_Image_b3lys7b3lys7b3ly.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781080100388-Screenshot_20260530_212418.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781080099243-Screenshot_20260530_212407.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781080098132-Screenshot_20260530_212349.webp",
          ],
          rootsHeading: "A village pub, owned by the",
          rootsHeadingItalic: "people it serves.",
        },
        order: 1,
      },
      {
        id: "cmtwx8xhf000pyl3pgucn7rsp",
        type: "AboutPhilosophy",
        content: {
          quote:
            "We believe a great British pub does three things well: serves excellent food, pours a proper drink, and makes everyone who walks through its doors feel at home.",
          title: "Our Hospitality Philosophy",
          author: "The Seven Stars Team",
          philosophyQuote:
            "We believe a great British pub does three things well: serves excellent food, pours a proper drink, and makes everyone who walks through its doors feel at home.",
        },
        order: 2,
      },
      {
        id: "cmtwx8xhf000qyl3pn4nkyd97",
        type: "AboutExperience",
        content: {
          title: "Life at The Seven Stars...",
          subTitle: "More than a meal. More than a drink.",
          highlights: [
            "The character of a classic Oxfordshire village.",
            "Warmth of local open fires and aged beams.",
            "A place where everyone is welcome.",
          ],
          paragraph2:
            "Whatever brings you here, you'll leave having shared more than just good food and drink—you'll have experienced the warmth and easy charm of a pub that's been bringing people together for generations.",
          description:
            "The Seven Stars is the kind of place where time slows down. Set beside the village green, it welcomes walkers fresh from the countryside, families gathering around the table, friends meeting over a pint, and visitors discovering Marsh Baldon for the first time. In winter, the open fires invite you to linger indoors. In summer, the garden becomes the perfect place to settle in for the afternoon.",
          differentTag: "LIFE AT THE SEVEN STARS...",
          differentDesc:
            "Walk into The Seven Stars and you'll find the character and warmth of a classic village. Local open fires, aged beams, and the hum of good conversation create an atmosphere that is both nostalgic and vibrantly alive.",
          differentImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687990034-SEVEN_STARS_2026_02_09-306.webp",
          differentHeading: "Experience the",
          differentHeadingItalic: "best of both worlds.",
        },
        order: 3,
      },
      {
        id: "cmtwx8xhf000ryl3p6ctw896d",
        type: "AboutAmenities",
        content: {
          amenities: [
            {
              icon: "Car",
              label: "Free Parking",
            },
            {
              icon: "Sun",
              label: "Beer Garden",
            },
            {
              icon: "Flame",
              label: "Open Fireplace",
            },
            {
              icon: "Beer",
              label: "Local Ales & Ciders",
            },
            {
              icon: "Home",
              label: "Private Barn",
            },
            {
              icon: "Music",
              label: "Live Music",
            },
            {
              icon: "CloudRain",
              label: "Covered Outdoor Space",
            },
          ],
          amenitiesTag: "WHAT WE OFFER",
          amenitiesHeading: "Pub Features & Amenities",
        },
        order: 4,
      },
      {
        id: "cmtwx8xhg000syl3plgsm55il",
        type: "AboutCta",
        content: {
          ctaDesc:
            "From intimate dinners and milestone birthdays to weddings, anniversaries, christenings, and private celebrations—The Seven Stars is a place to come together. For larger gatherings, our private barn offers a characterful setting where every celebration feels truly special.",
          ctaHeading: "The Backdrop to Life's Celebrations",
          ctaButtonUrl: "/contact",
          ctaButtonLabel: "Book a Table",
        },
        order: 5,
      },
    ],
  },
  {
    id: "cmtwx8znl000tyl3p45rn3n5e",
    title: "Dining",
    slug: "dining",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "Dining Experience at Seven Stars",
    metaTitle: "Countryside Dining | The Seven Stars ",
    metaDescription:
      "Fresh seasonal menus, Sunday roasts, and locally sourced Oxfordshire ingredients at The Seven Stars.",
    targetKeywords: null,
    canonicalUrl: "https://sevenstarsatmarshbaldon.co.uk/dining",
    noIndex: false,
    featuredImage: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: {
      heroHeadingTag: "h1",
    },
    sections: [
      {
        id: "cmtwx8znm000uyl3p0ryk7qd6",
        type: "DiningHero",
        content: {
          tagline: "SEASONAL DINING",
          headingPart1: "Dining",
          backgroundImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781687988901-SEVEN_STARS_2026_02_09-81.webp",
          headingItalicHighlight: "Experience",
        },
        order: 0,
      },
      {
        id: "cmtwx8znm000vyl3pvzyupzu5",
        type: "Dining",
        content: {
          btnUrl: "/menu",
          btnLabel: "View Our Menus",
          imageAlt: "Gourmet dish at Seven Stars",
          upperTag: "Food Tales",
          mainQuote:
            "Our kitchen works with fresh, carefully sourced ingredients to create craft-heartening dishes that become the season to bond together.",
          paragraph1:
            "At The Seven Stars, every dish begins with fresh, carefully sourced ingredients and a respect for the seasons. Rooted in the traditions of the British pub, our menu is complemented by subtle influences from the Middle East, Europe and South Asia, bringing fresh perspectives to familiar favourites.",
          paragraph2:
            "Whether you're stopping by for a leisurely lunch, sharing a cheese board over drinks, enjoying one of our open sandwiches, or ending your meal with our orange and cognac crème brûlée, every plate is prepared with care and designed to be enjoyed together.",
          headingPart1: "The",
          headingPart3: "Experience",
          showcaseImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686621461-SEVEN_STARS_2026_02_09-145.webp",
          gardenCapacity: "150",
          indoorCapacity: "76",
          imageOverlayTitle: "Proper Food",
          imageOverlaySubtitle: "Honouring British Pub Tradition",
          headingItalicHighlight: "Dining",
        },
        order: 1,
      },
      {
        id: "cmtwx8znm000wyl3p4fc3omxu",
        type: "DiningIntro",
        content: {
          introDesc1:
            "A great pub is as much about what's in the glass as what's on the plate. Alongside our seasonal menus, you'll find a carefully kept selection of cask ales, craft beers, fine wines, premium spirits, and cocktails, chosen to suit every occasion—from a quiet pint after a countryside walk to a celebratory toast with family and friends.",
          introDesc2:
            "What brings it all together is our approach to hospitality. Relaxed, genuine and without pretence, it's the kind of service that lets you settle in, linger a little longer, and enjoy good food, good drink and even better company.",
          introImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780554493244-SEVEN_STARS_2026_02_09-120.webp",
          introTagline: "The Dining Experience",
          introFeature1: "EXPERT CHEFS",
          introFeature2: "FRESH FLAVORS",
          introHeadingPart1: "Serious food,",
          introHeadingPart2: "hospitality.",
          introHeadingItalic: "unfussy",
        },
        order: 2,
      },
      {
        id: "cmtwx8znm000xyl3pjwdtugd9",
        type: "DiningQuote",
        content: {
          quotePart1:
            "Food is the ingredient that binds us together, And at Seven Stars, we make sure it's",
          quoteHighlight: "extraordinary.",
        },
        order: 3,
      },
      {
        id: "cmtwx8znm000yyl3p73pwz8y4",
        type: "DiningPillars",
        content: {
          heading: "Classic Foundations,",
          pillars: [
            {
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686617797-SEVEN_STARS_2026_02_09-0113.webp",
              title: "British Classics",
              description:
                "We serve British pub classics prepared properly. No shortcuts, just traditional recipes elevated with premium ingredients.",
            },
            {
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779094138324-food-gourmet.webp",
              title: "Seasonal Specials",
              description:
                "Our specials draw on European, Middle Eastern and South Asian flavours, bringing a contemporary twist to the village pub.",
            },
            {
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781195615052-WhatsAppImage2026-06-11at21.23.03.jpeg",
              title: "Not To Be Missed",
              description:
                "Our fortnightly Indian Thali Nights and Sunday Roasts are designated the highlight of the week.",
            },
          ],
          upperTag: "OUR MENU",
          headingHighlight: "Global Inspirations",
        },
        order: 4,
      },
      {
        id: "cmtwx8znm000zyl3prrceit12",
        type: "DiningBarn",
        content: {
          barnDesc:
            "Set apart from the main pub, The Barn offers a warm and characterful setting for private gatherings. Whether you're hosting an intimate celebration, a family occasion or a small corporate event, it's a flexible space paired with thoughtful hospitality and seasonal menus.",
          barnImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781085738861-SEVEN_STARS_2026_02_09-0040.webp",
          barnCtaText: "Enquire Barn Hire",
          barnHeading: "The",
          barnTagline: "PRIVATE DINING",
          beerTentDesc:
            "A covered Beer Tent provides a flexible outdoor setting for larger celebrations.",
          capacityDesc: "Designed for gatherings of up to 40 guests.",
          beerTentTitle: "Outdoor Extension",
          capacityTitle: "Capacity",
          barnHeadingItalic: "Barn",
        },
        order: 5,
      },
      {
        id: "cmtwx8znm0010yl3pumlo84ee",
        type: "DiningOutdoor",
        content: {
          outdoorDesc:
            "When the weather is kind, there's nowhere better to be than our garden overlooking the village green. Settle in for a leisurely meal, enjoy a drink with friends, or simply take in the peaceful surroundings.",
          outdoorImages: [
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781156724977-SEVEN_STARS_2026_02_09-0106.webp",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686617797-SEVEN_STARS_2026_02_09-0113.webp",
          ],
          outdoorCtaLink: "#",
          outdoorCtaText: "Book a Table",
          outdoorHeading: "Outdoor",
          outdoorHeadingItalic: "Seating",
        },
        order: 6,
      },
    ],
  },
  {
    id: "cmtwx91tb0011yl3p1b8bjt8l",
    title: "Menu",
    slug: "menu",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "Food and Drink Menus",
    metaTitle: "Food & Drink Menus | The Seven Stars",
    metaDescription:
      "Browse our lunch, dinner, Sunday roast, and drinks menus at The Seven Stars Marsh Baldon.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx91tc0012yl3pjg9x5zfu",
        type: "MenuHero",
        content: {
          tagline: "SEASONAL SELECTION",
          headingPart1: "Our ",
          backgroundImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637784295-SEVEN_STARS_2026_02_09-34.webp",
          headingHighlight: "Menu",
        },
        order: 0,
      },
      {
        id: "cmtwx91tc0013yl3ptz18jecc",
        type: "MenuBook",
        content: {
          ctaLink: "/contact",
          ctaText: "ENQUIRE FOR PRIVATE DINING",
          tagline: "SEASONAL SELECTION",
          menuPdfs: [
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1785413495467-summermenu2.pdf",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1785413456217-DessertMenu.pdf",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1785413432718-SundayMenu.pdf",
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787728547908-winemenu.pdf",
          ],
          coverImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686617797-SEVEN_STARS_2026_02_09-0113.webp",
          description:
            "At The Seven Stars, fresh, carefully sourced ingredients are at the heart of everything we serve, creating dishes that celebrate the seasons and the joy of sharing a meal.",
          headingPart1: "Our",
          locationName: "Marsh Baldon",
          menuSections: [
            {
              id: "main",
              pdf: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1785413495467-summermenu2.pdf",
              pages: [{}],
              title: "MAIN MENU",
            },
            {
              id: "dessert",
              pdf: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1785413456217-DessertMenu.pdf",
              pages: [{}],
              title: "DESSERT MENU",
            },
            {
              id: "sunday",
              pdf: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1785413432718-SundayMenu.pdf",
              pages: [{}],
              title: "Sunday Menu",
            },
            {
              id: "wine-list",
              pdf: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787728547908-winemenu.pdf",
              pages: [{}],
              title: "Wine List",
            },
          ],
          sectionNumber: "03",
          locationCounty: "OXFORDSHIRE",
          headingItalicHighlight: "Menu",
        },
        order: 1,
      },
      {
        id: "cmtwx91tc0014yl3px3mvoaf5",
        type: "MenuCurated",
        content: {
          heading: "Curated Courses",
          upperTag: "THE COLLECTION",
          menuCategories: [
            {
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637679964-SEVEN_STARS_2026_02_09-265.webp",
              items: [
                "Marinated Olives",
                "Focaccia With Balsamic",
                "Devil Crispy Whitebait",
                "Honey BBQ Chicken Wings",
                "Truffle Arancini",
              ],
              title: "Small Plates & Starters",
            },
            {
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637682165-SEVEN_STARS_2026_02_09-235.webp",
              items: [
                "Beer-Battered Haddock & Chips",
                "Seven Stars Cheeseburger",
                "Fish & Chips",
                "Classic Burger",
              ],
              title: "Pub Classics",
            },
            {
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637684315-SEVEN_STARS_2026_02_09-344.webp",
              items: [
                "Pan-Seared Duck Breast",
                "Golden Squash Risotto",
                "Arabic Crème Chicken Skewers",
                "Spiced Lamb Kofta",
                "Garlic & Chili King Prawns",
              ],
              title: "Mains",
            },
            {
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637685212-SEVEN_STARS_2026_02_09-94.webp",
              items: [
                "Slow-Roasted Sirloin of Beef",
                "Roast Leg of English Lamb",
                "Free-Range Roast Chicken",
                "Nut Roast & Mushroom Tart",
              ],
              title: "Sunday Roast",
              description: "Served every Sunday 12:00 – 18:00",
            },
            {
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781164162893-SEVEN_STARS_2026_02_09-0142.webp",
              items: [
                "Orange & Cognac Crème Brûlée",
                "Warm Chocolate Lava Cake",
                "Sticky Toffee Pudding",
                "Artisan Cheese Selection",
              ],
              title: "Desserts",
            },
          ],
        },
        order: 2,
      },
      {
        id: "cmtwx91tc0015yl3pdedyywzu",
        type: "MenuCellar",
        content: {
          title: "The Cellar",
          heading: "We take our drinks",
          tagline: "THE CELLAR",
          sideImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781086062051-SEVEN_STARS_2026_02_09-5.webp",
          description:
            "A perfectly kept pint, a thoughtfully chosen wine or a favourite cocktail—whatever your drink of choice, you'll find a bar that's stocked with care. Alongside local ales, lagers and ciders, we proudly support producers from across the region.",
          headingHighlight: "as seriously as our food.",
        },
        order: 3,
      },
      {
        id: "cmtwx91tc0016yl3p3pgq5odw",
        type: "MenuIntro",
        content: {
          quote: "Dietary Options & Special Nights",
          subtext:
            "Don't miss our fortnightly Indian Thali Nights and seasonal specials, bringing exciting new flavours to Marsh Baldon throughout the year.",
        },
        order: 4,
      },
    ],
  },
  {
    id: "cmtwx93z00017yl3pb5jivl2f",
    title: "Events & Functions",
    slug: "events",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "Pub Events & Private Hiring",
    metaTitle: "Events & Celebrations | The Seven Stars",
    metaDescription:
      "Live music, pub quizzes, weddings, and private barn hires at The Seven Stars Marsh Baldon.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx93z00018yl3pbrfwop2x",
        type: "EventsHero",
        content: {
          tagline: "OCCASIONS & CELEBRATIONS",
          headingPart1: "Events &",
          backgroundImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780554968912-SEVEN_STARS_2026_02_09-122.webp",
          headingHighlight: "Celebrations",
        },
        order: 0,
      },
      {
        id: "cmtwx93z10019yl3poljzc50e",
        type: "UpcomingEvents",
        content: {
          ctaLink: "",
          ctaText: "Request Table",
          heading: "Upcoming & Past Occasions",
          upperTag: "SEVEN STARS CALENDAR",
          ctaSubtitle: "Inquire about our upcoming occasions",
          description:
            "There's always something happening at The Seven Stars. Discover our upcoming dining experiences, seasonal celebrations and community events, or look back at some of the memorable moments we've shared together.",
          upcomingEvents: [
            {
              date: "26th Aug",
              time: "7:30 PM",
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787723231766-WhatsAppImage2026-08-26at11.15.04.webp",
              title: "Quiz Night",
              category: "PUB EVENT",
              highlight: "Test your trivia knowledge & win prizes",
              description:
                "Join us for our popular Quiz Night at The Seven Stars! Test your knowledge, enjoy great drinks, and compete for exciting prizes with friends.",
            },
            {
              date: "Saturday, 29th August",
              time: "7:00 PM",
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787665142170-jubly-Brass.webp",
              title: "Jubilee Brass",
              category: "LIVE MUSIC",
              highlight: "Live brass band performance on the green",
              description:
                "Enjoy a fantastic evening of live brass music with the Jubilee Brass band playing live at The Seven Stars.",
            },
            {
              date: "3rd & 17th Sep, 1st, 15th & 29th Oct",
              time: "6:00 PM",
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787665286058-Indian-Desi-Thali-Template.webp",
              title: "Indian Desi Thali",
              category: "DINING EXPERIENCE",
              highlight: "Authentic Indian curries & fresh naan",
              description:
                "Experience our popular Indian Desi Thali nights, featuring authentic curries, daals, warm naan, and delicious traditional side dishes.",
            },
            {
              date: "15th Sep",
              time: "5:00 PM",
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787723315522-WhatsAppImage2026-08-26at11.15.16.webp",
              title: "Classic Car Show",
              category: "SPECIAL GATHERING",
              highlight: "Vintage cars & classics on the green",
              description:
                "Admire a fantastic collection of classic cars and vintage vehicles on Marsh Baldon Green. Enjoy great food and drinks while meeting fellow car enthusiasts.",
            },
          ],
        },
        order: 1,
      },
      {
        id: "cmtwx93z1001ayl3pjjmvg017",
        type: "InstagramRibbon",
        content: {
          posts: [],
          title: "Follow Us on Intagram",
          subtitle: "https://www.instagram.com/sevenstarsatmarshbaldon/",
          instagramToken:
            "IGAARzG8c1FB5BZAFpMR2tpZAnVtZA1MyX1pnZAGtPUld2dUVVZADk0U3lXTTgxZAk4zb1JmZAWFjMmM1b3A3UnhpbUhfdHd6VzBfaVE1MWpKdm1sXzdsZAl9tOGgwSlZAoV2ZAhT2h2THZAFWmFRQjYya1ZApSWxiams1eFRiTHNuMmVkczAwdwZDZD",
          lastRefreshedAt: 1787642472250,
          instagramAccountId: "27233851499571609",
        },
        order: 2,
      },
      {
        id: "cmtwx93z1001byl3pvm58as8g",
        type: "WhatWeHost",
        content: {
          image:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780555071861-Weddingpic.webp",
          items: [
            "Birthday celebrations and milestone occasions",
            "Family gatherings and reunion dinners",
            "Corporate lunches and team away days",
            "Wedding receptions and pre-wedding celebrations",
            "Summer BBQs and garden parties",
            "Christmas and New Year's celebrations",
            "Community events and fundraisers",
          ],
          heading: "Occasions We Host",
          subtext:
            "From intimate celebrations to large gatherings, we have the perfect setting for every occasion.",
          tagline: "PERFECT FOR EVERY OCCASION",
        },
        order: 3,
      },
      {
        id: "cmtwx93z1001cyl3pd2nskbq4",
        type: "EventsCapabilities",
        content: {
          heading: "Function Features",
          upperTag: "OUR SPACES",
          capabilities: [
            {
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781160176550-SEVEN_STARS_2026_02_09-137.webp",
              title: "Main Bar & Dining Area",
              iconName: "PartyPopper",
              description:
                "Seats 76 guests, warmed by an open fireplace in winter and filled with light in summer.",
            },
            {
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686607452-SEVEN_STARS_2026_02_09-0028.webp",
              title: "The Private Barn",
              iconName: "Warehouse",
              description:
                "Flexible private space accommodating up to 40 guests for celebrations or corporate dining, with covered Beer Tent option.",
            },
            {
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781195516243-IMG_4523.webp",
              title: "Sprawling Beer Garden",
              iconName: "Sun",
              description:
                "One of the finest beer gardens in Oxfordshire, seating 120 to 150 guests for slow summer afternoons.",
            },
          ],
          headingHighlight: "& Spaces",
        },
        order: 4,
      },
    ],
  },
  {
    id: "cmtwx9652001dyl3p4midsarx",
    title: "Gallery",
    slug: "gallery",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "Photo Gallery",
    metaTitle: "Photo Gallery | The Seven Stars",
    metaDescription:
      "Take a visual tour of The Seven Stars pub, gardens, dining room, and events.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9653001eyl3pigoo6h3b",
        type: "GalleryHero",
        content: {
          title: "Photo Gallery",
          tagline: "VISUAL JOURNEY",
          headingPart1: "Photo",
          backgroundImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686626397-SEVEN_STARS_2026_02_09-338.webp",
          headingItalicHighlight: "Gallery",
        },
        order: 0,
      },
      {
        id: "cmtwx9653001fyl3ptww4rakd",
        type: "GalleryGrid",
        content: {
          title: "Our Image Collection",
          description:
            "From cosy interiors and the garden overlooking the village green to memorable meals and special occasions...explore the spaces, flavours and moments that make The Seven Stars what it is.",
          galleryItems: [
            {
              id: 1,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781086645604-SEVEN_STARS_2026_02_09-169.webp",
              title: "Seven Stars Gallery Photo 1",
              aspect: "aspect-square",
              category: "Food",
            },
            {
              id: 2,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779096151673-gallery-8.webp",
              title: "Seven Stars Gallery Photo 2",
              aspect: "aspect-[4/3]",
              category: "Outdoor",
            },
            {
              id: 3,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686610741-SEVEN_STARS_2026_02_09-0076.webp",
              title: "Seven Stars Gallery Photo 3",
              aspect: "aspect-[3/4]",
              category: "Indoor",
            },
            {
              id: 4,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779093880678-footer-bg.webp",
              title: "Seven Stars Gallery Photo 4",
              aspect: "aspect-[4/5]",
              category: "Food",
            },
            {
              id: 5,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779095839457-barn.webp",
              title: "Seven Stars Gallery Photo 5",
              aspect: "aspect-[16/9]",
              category: "Outdoor",
            },
            {
              id: 6,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686607452-SEVEN_STARS_2026_02_09-0028.webp",
              title: "Seven Stars Gallery Photo 6",
              aspect: "aspect-square",
              category: "Indoor",
            },
            {
              id: 7,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779094138324-food-gourmet.webp",
              title: "Seven Stars Gallery Photo 7",
              aspect: "aspect-[4/3]",
              category: "Food",
            },
            {
              id: 8,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779095838769-gallery-4.webp",
              title: "Seven Stars Gallery Photo 8",
              aspect: "aspect-[3/4]",
              category: "Outdoor",
            },
            {
              id: 9,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087467006-SEVEN_STARS_2026_02_09-0043.webp",
              title: "Seven Stars Gallery Photo 9",
              aspect: "aspect-[4/5]",
              category: "Indoor",
            },
            {
              id: 10,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779095841739-event-celebration.webp",
              title: "Seven Stars Gallery Photo 10",
              aspect: "aspect-[16/9]",
              category: "Food",
            },
            {
              id: 11,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781688953515-SEVEN_STARS_2026_02_09-0006.webp",
              title: "Seven Stars Gallery Photo 11",
              aspect: "aspect-square",
              category: "Outdoor",
            },
            {
              id: 12,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087463543-SEVEN_STARS_2026_02_09-0050.webp",
              title: "Seven Stars Gallery Photo 12",
              aspect: "aspect-[4/3]",
              category: "Indoor",
            },
            {
              id: 13,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779102563583-SEVEN_STARS_2026_02_09-0065.webp",
              title: "Seven Stars Gallery Photo 13",
              aspect: "aspect-[3/4]",
              category: "Food",
            },
            {
              id: 14,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686614010-SEVEN_STARS_2026_02_09-210.webp",
              title: "Seven Stars Gallery Photo 14",
              aspect: "aspect-[4/5]",
              category: "Outdoor",
            },
            {
              id: 15,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087454735-SEVEN_STARS_2026_02_09-0048.webp",
              title: "Seven Stars Gallery Photo 15",
              aspect: "aspect-[16/9]",
              category: "Indoor",
            },
            {
              id: 16,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779102629081-feature-classic-1.webp",
              title: "Seven Stars Gallery Photo 16",
              aspect: "aspect-square",
              category: "Food",
            },
            {
              id: 17,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781195516243-IMG_4523.webp",
              title: "Seven Stars Gallery Photo 17",
              aspect: "aspect-[4/3]",
              category: "Outdoor",
            },
            {
              id: 18,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087435267-SEVEN_STARS_2026_02_09-0058.webp",
              title: "Seven Stars Gallery Photo 18",
              aspect: "aspect-[3/4]",
              category: "Indoor",
            },
            {
              id: 19,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779102630377-feature-special-1.webp",
              title: "Seven Stars Gallery Photo 19",
              aspect: "aspect-[4/5]",
              category: "Food",
            },
            {
              id: 20,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781156724977-SEVEN_STARS_2026_02_09-0106.webp",
              title: "Seven Stars Gallery Photo 20",
              aspect: "aspect-[16/9]",
              category: "Outdoor",
            },
            {
              id: 21,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087019487-SEVEN_STARS_2026_02_09-0066.webp",
              title: "Seven Stars Gallery Photo 21",
              aspect: "aspect-square",
              category: "Indoor",
            },
            {
              id: 22,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779446831444-SEVEN_STARS_2026_02_09-10.webp",
              title: "Seven Stars Gallery Photo 22",
              aspect: "aspect-[4/3]",
              category: "Food",
            },
            {
              id: 23,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087458738-SEVEN_STARS_2026_02_09-0012.webp",
              title: "Seven Stars Gallery Photo 23",
              aspect: "aspect-[3/4]",
              category: "Outdoor",
            },
            {
              id: 24,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781086666152-SEVEN_STARS_2026_02_09-0057.webp",
              title: "Seven Stars Gallery Photo 24",
              aspect: "aspect-[4/5]",
              category: "Indoor",
            },
            {
              id: 25,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637514694-SEVEN_STARS_2026_02_09-349.webp",
              title: "Seven Stars Gallery Photo 25",
              aspect: "aspect-[16/9]",
              category: "Food",
            },
            {
              id: 26,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087445795-SEVEN_STARS_2026_02_09-0023.webp",
              title: "Seven Stars Gallery Photo 26",
              aspect: "aspect-square",
              category: "Outdoor",
            },
            {
              id: 27,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781086662028-SEVEN_STARS_2026_02_09-0080.webp",
              title: "Seven Stars Gallery Photo 27",
              aspect: "aspect-[4/3]",
              category: "Indoor",
            },
            {
              id: 28,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637679964-SEVEN_STARS_2026_02_09-265.webp",
              title: "Seven Stars Gallery Photo 28",
              aspect: "aspect-[3/4]",
              category: "Food",
            },
            {
              id: 29,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087440607-SEVEN_STARS_2026_02_09-0016.webp",
              title: "Seven Stars Gallery Photo 29",
              aspect: "aspect-[4/5]",
              category: "Outdoor",
            },
            {
              id: 30,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781086655447-SEVEN_STARS_2026_02_09-0025.webp",
              title: "Seven Stars Gallery Photo 30",
              aspect: "aspect-[16/9]",
              category: "Indoor",
            },
            {
              id: 31,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637684315-SEVEN_STARS_2026_02_09-344.webp",
              title: "Seven Stars Gallery Photo 31",
              aspect: "aspect-square",
              category: "Food",
            },
            {
              id: 32,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087039804-SEVEN_STARS_2026_02_09-0011.webp",
              title: "Seven Stars Gallery Photo 32",
              aspect: "aspect-[4/3]",
              category: "Outdoor",
            },
            {
              id: 33,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781085738861-SEVEN_STARS_2026_02_09-0040.webp",
              title: "Seven Stars Gallery Photo 33",
              aspect: "aspect-[3/4]",
              category: "Indoor",
            },
            {
              id: 34,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1780637685212-SEVEN_STARS_2026_02_09-94.webp",
              title: "Seven Stars Gallery Photo 34",
              aspect: "aspect-[4/5]",
              category: "Food",
            },
            {
              id: 35,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781087033121-SEVEN_STARS_2026_02_09-0106.webp",
              title: "Seven Stars Gallery Photo 35",
              aspect: "aspect-[16/9]",
              category: "Outdoor",
            },
            {
              id: 36,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781085721419-SEVEN_STARS_2026_02_09-0032.webp",
              title: "Seven Stars Gallery Photo 36",
              aspect: "aspect-square",
              category: "Indoor",
            },
            {
              id: 37,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781071047399-SEVEN_STARS_2026_02_09-35.webp",
              title: "Seven Stars Gallery Photo 37",
              aspect: "aspect-[4/3]",
              category: "Food",
            },
            {
              id: 38,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781086064541-SEVEN_STARS_2026_02_09-0022.webp",
              title: "Seven Stars Gallery Photo 38",
              aspect: "aspect-[3/4]",
              category: "Outdoor",
            },
            {
              id: 39,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779100598226-gallery-25.webp",
              title: "Seven Stars Gallery Photo 39",
              aspect: "aspect-[4/5]",
              category: "Indoor",
            },
            {
              id: 40,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781074152897-SEVEN_STARS_2026_02_09-5.webp",
              title: "Seven Stars Gallery Photo 40",
              aspect: "aspect-[16/9]",
              category: "Food",
            },
            {
              id: 41,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779099397728-gallery-25.webp",
              title: "Seven Stars Gallery Photo 41",
              aspect: "aspect-square",
              category: "Indoor",
            },
            {
              id: 42,
              src: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781085731650-SEVEN_STARS_2026_02_09-125.webp",
              title: "Seven Stars Gallery Photo 42",
              aspect: "aspect-[4/3]",
              category: "Food",
            },
          ],
        },
        order: 1,
      },
    ],
  },
  {
    id: "cmtwx98es001gyl3pu9cbkaby",
    title: "Our Story",
    slug: "our-story",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "Heritage & Community History",
    metaTitle: "Our Story | The Seven Stars Marsh Baldon",
    metaDescription:
      "Discover how the community of Marsh Baldon united to save and operate The Seven Stars.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx98es001hyl3p5xhk0tke",
        type: "StoryHero",
        content: {
          tagline: "OUR STORY",
          headingPart1: "Our Story &",
          backgroundImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781073689384-SEVEN_STARS_2026_02_09-0104.webp",
          headingItalicHighlight: "Community",
        },
        order: 0,
      },
      {
        id: "cmtwx98es001iyl3p9jxqhqbo",
        type: "StoryIntro",
        content: {
          introDesc:
            "The Seven Stars is more than a village pub—it is a story of a community coming together to preserve a place they couldn't imagine losing.",
          introHeading: "Saved by the community.",
          introTagline: "Our Story",
          introHeadingItalic: "Sustained by its people.",
        },
        order: 1,
      },
      {
        id: "cmtwx98es001jyl3pz54r9z6p",
        type: "StoryTimeline",
        content: {
          timelineSteps: [
            {
              desc: "After years of instability, the pub closed its doors. The villages lost a 350-year-old central hub for community joy.",
              year: "Late 2012",
              lines: {
                mobile: "down",
                tablet: "right",
                desktop: "right",
              },
              title: "Late 2012",
              subtitle: "CLOSURE",
              gridClass:
                "lg:col-span-2 lg:col-start-1 lg:row-start-1 md:col-span-2 md:col-start-1 md:row-start-1",
            },
            {
              desc: "What began as conversations turned into a mission. Residents formed the Baldons and Nuneham Community Society (BNCS).",
              year: "Dec 2012",
              lines: {
                mobile: "down",
                tablet: "down",
                desktop: "right",
              },
              title: "Dec 2012",
              subtitle: "MISSION",
              gridClass:
                "lg:col-span-2 lg:col-start-3 lg:row-start-1 md:col-span-2 md:col-start-3 md:row-start-1",
            },
            {
              desc: "Through community investment and grants, the society purchased the pub. On March 30th, the Seven Stars reopened.",
              year: "Mar 2013",
              lines: {
                mobile: "down",
                tablet: "right",
                desktop: "down-left",
              },
              title: "Mar 2013",
              subtitle: "REOPENING",
              gridClass:
                "lg:col-span-2 lg:col-start-5 lg:row-start-1 md:col-span-2 md:col-start-1 md:row-start-2",
            },
            {
              desc: "Named CAMRA Pub of the Year in 2016. Continuous improvements and community support helped navigate challenges like COVID.",
              year: "2016",
              lines: {
                mobile: "down",
                tablet: "down",
                desktop: "left",
              },
              title: "The Journey",
              subtitle: "MILESTONES",
              gridClass:
                "lg:col-span-2 lg:col-start-4 lg:row-start-2 md:col-span-2 md:col-start-3 md:row-start-2",
            },
            {
              desc: "Under new stewards Namit and Sunit, the pub stays true to its roots with fresh energy. A true story of renewal.",
              year: "2023 & Beyond",
              lines: {
                mobile: "none",
                tablet: "none",
                desktop: "none",
              },
              title: "2023 & Beyond",
              subtitle: "RENEWAL",
              gridClass:
                "lg:col-span-2 lg:col-start-2 lg:row-start-2 md:col-span-2 md:col-start-2 md:row-start-3",
            },
          ],
        },
        order: 2,
      },
      {
        id: "cmtwx98es001kyl3pzwi60v1k",
        type: "StoryHub",
        content: {
          exp1: "Friends catching up over a pint",
          exp2: "Families enjoying Sunday lunch",
          exp3: "Neighbours celebrating special moments",
          exp4: "Visitors discovering a true village pub",
          cardDesc:
            "From quiz nights and live acoustic sessions to seasonal celebrations — there's always something on at The Seven Stars.",
          hubDesc1:
            "We are truly community-owned, bought by the community and restored by it. This takes our attention away from short-term profit to long-term stability.",
          hubDesc2:
            "Our doors are open to both locals and visitors alike. The love showered by our people has made us so resilient. We are always going to be a people-first pub, delivering quality food and warm service to guests.",
          hubDesc3:
            "We value our community members who not only saved us but are continually helping us grow by supporting in-house events.",
          cardTitle: "Live Music & Events",
          hubHeading: "A Pub By the People,",
          hubTagline: "COMMUNITY HUB",
          rightImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781084589375-Gemini_Generated_Image_b3lys7b3lys7b3ly.webp",
          rightImageTitle: "The Seven Stars, Marsh Baldon, c. 1868",
          hubHeadingItalic: "For the People",
        },
        order: 3,
      },
    ],
  },
  {
    id: "cmtwx9ak4001lyl3plq8coris",
    title: "Christmas 2026",
    slug: "christmas",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "Christmas Festive Celebrations",
    metaTitle: "Christmas 2026 | The Seven Stars",
    metaDescription:
      "Celebrate the festive season at The Seven Stars. View our Christmas lunch and dinner menus.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9ak4001myl3pfqu784b9",
        type: "ChristmasVisibility",
        content: {
          enabled: true,
          showInNav: true,
          visibility: "published",
          isPublished: true,
        },
        order: 0,
      },
      {
        id: "cmtwx9ak4001nyl3po24dyibz",
        type: "ChristmasHero",
        content: {
          title: "Celebrate Christmas at Seven Stars",
          tagline: "FESTIVE SEASON 2026",
          ctaLink1:
            "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
          ctaLink2: "#menus",
          ctaText1: "Reserve Your Table",
          ctaText2: "Discover Menus",
          headingTag: "h1",
          musicTrack:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1782451660185-christmas-tune.mp3",
          description:
            "Step into the warmth of our decorated countryside pub in Marsh Baldon, Oxford. Savor award-winning festive menus, cozy up next to glowing fireplaces, and celebrate the season in style.",
          headingPart1: "Celebrate",
          headingPart2: "at Seven Stars",
          headingSuffix: "at Seven Stars",
          backgroundImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1788169569525-Christmas.webp",
          primaryButtonUrl:
            "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
          primaryButtonText: "RESERVE YOUR TABLE",
          secondaryButtonUrl: "#menus",
          secondaryButtonText: "DISCOVER MENUS",
          headingItalicHighlight: "Christmas",
        },
        order: 1,
      },
      {
        id: "cmtwx9ak4001oyl3p8ik0g7he",
        type: "ChristmasIntro",
        content: {
          title: "Celebrate Christmas at Seven Stars in Marsh Baldon!",
          heading: "Celebrate Christmas at",
          reason1:
            "Cosy Pub with beautiful Christmas décor, spreading warmth and festive cheer.",
          reason2:
            "Savor festive Christmas dishes prepared by our chefs for the occasion.",
          reason3:
            "Our Pub serves wine, cocktails, and seasonal drinks to enhance Christmas joy.",
          tagline: "WARMTH & FESTIVE CHEER 🎄",
          whyTitle: "WHY CHOOSE SEVEN STARS:",
          whyBullets: [
            "Cosy Pub with beautiful Christmas décor, spreading warmth and festive cheer.",
            "Savor festive Christmas dishes prepared by our chefs for the occasion.",
            "Our Pub serves wine, cocktails, and seasonal drinks to enhance Christmas day.",
          ],
          description:
            "Are you looking for the perfect place to celebrate Christmas with your loved ones? Located in Marsh Baldon, Oxford, Seven Stars is here to make your Christmas Day magical!",
          headingPart1: "Celebrate Christmas at",
          showcaseImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1788169802092-ChristmasSenta.webp",
          headingHighlight: "Seven Stars in Marsh Baldon!",
          whyChooseHeading: "Why Choose Seven Stars:",
          headingItalicHighlight: "Seven Stars in Marsh Baldon!",
        },
        order: 2,
      },
      {
        id: "cmtwx9ak4001pyl3pzeetv5d5",
        type: "ChristmasFeatures",
        content: {
          title: "Special Christmas Party Features",
          ctaLink:
            "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
          ctaText: "BOOK YOUR CHRISTMAS PARTY NOW!",
          tagline: "EXCLUSIVE EXPERIENCES 🎁",
          rewardTag: "EARLY BOOKING REWARD",
          termsText: "*Terms and Conditions apply.",
          highlights: [
            "Special Seating arrangements tailored for families and group bookings.",
            "Elegant options for Private Celebrations and large corporate/friend gatherings.",
            "Book Before October to secure a £20 Voucher reward.",
          ],
          rewardTitle: "Secure a £20 Voucher",
          headingPart1: "Special Christmas",
          cardFooterNote:
            "Tables are filling fast – don't miss your chance to make this Christmas unforgettable!",
          rewardDescription:
            "Book your party of 5 or more before 31st of October to receive a complimentary £20 voucher redeemable in the New Year.",
          headingItalicHighlight: "Party Features",
        },
        order: 3,
      },
      {
        id: "cmtwx9ak4001qyl3pjlgzvjxr",
        type: "ChristmasMenus",
        content: {
          title: "Download Our Festive Menus",
          pdfUrl:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1785413495467-summermenu2.pdf",
          heading: "Download Our",
          tagline: "CULINARY DELIGHTS 🥂",
          menusList: [
            {
              link: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1785413495467-summermenu2.pdf",
              image:
                "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/christmas-celebration-2.webp",
              title: "Festive Party Menu",
              subtitle:
                "Our Festive Menu Is Here! Book Your Table and Enjoy Holiday Favorites!",
              highlights: [
                "Smoked Salmon Starter",
                "Traditional Roast Turkey",
                "Spiced Plum Pudding",
              ],
              description:
                "Don't forget if you book your Christmas Party before the end of October 2025 you will receive a £20 voucher to use towards your booking. Minimum of 8 people dining and booking made before end of October 2025.",
            },
            {
              link: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1785413432718-SundayMenu.pdf",
              image:
                "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/25-dec.webp",
              title: "Christmas Day Menu",
              subtitle:
                "Indulge in our Special Christmas Menu: From Turkey to Truffles!",
              highlights: [
                "Glass of Champagne on arrival",
                "Slow-Roasted Prime Beef Sirloin",
                "Traditional Christmas Pudding with Brandy Butter",
              ],
              description:
                "Why Cook on Christmas Day when we can do it for you?\nBook your Christmas Lunch with us here at Seven Stars instead.\nView our Christmas Day Menu below",
            },
            {
              link: "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1785413456217-DessertMenu.pdf",
              image:
                "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/children-christmas.webp",
              title: "Children's Christmas Day Menu",
              subtitle: "Little Elves Festive Feast",
              highlights: [
                "Mini Turkey Roast with all the trimmings",
                "Ice Cream Sundae",
                "Festive Fruit Punch",
              ],
              description:
                "To make Christmas extra special for families, we've prepared a dedicated children's menu — light, delicious, and perfect for younger guests.",
            },
          ],
          description:
            "Plan your holiday celebration with our festive lunch, dinner, and Christmas Day menu packages.",
          headingHighlight: "Festive Menus",
        },
        order: 4,
      },
      {
        id: "cmtwx9ak4001ryl3p60eqc6lu",
        type: "ChristmasDishes",
        content: {
          heading: "Our Christmas",
          tagline: "VISUAL FEAST",
          dishesList: [
            {
              name: "Pan-Seared White Fish",
              image:
                "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish1.webp",
              tagline: "FESTIVE SEAFOOD",
              description:
                "A golden-brown fish fillet served with roasted baby potatoes, steamed green beans, and a fresh lemon wedge.",
            },
            {
              name: "Herb-Crusted White Fish",
              image:
                "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish2.webp",
              tagline: "ELEGANT MAIN",
              description:
                "Succulent fish fillet garnished with fresh green herbs, accompanied by bright asparagus spears and roasted cherry tomatoes.",
            },
            {
              name: "Baked Camembert",
              image:
                "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish3.webp",
              tagline: "WARM STARTER",
              description:
                "A whole warm cheese wheel topped with caramelized nuts, served with red berry compote and crispy breadsticks.",
            },
            {
              name: "Red Wine Poached Pear",
              image:
                "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1788170281583-BakedCamembert.webp",
              tagline: "FRUITY DESSERT",
              description:
                "Classic poached pear paired with a refreshing scoop of orange sorbet and a drizzle of reduction syrup.",
            },
            {
              name: "Festive Fruit Crumble",
              image:
                "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish5.webp",
              tagline: "COMFORT DESSERT",
              description:
                "Warm mixed berry and apple crumble with a golden topping, served with rich, creamy custard.",
            },
            {
              name: "Decadent Chocolate Mousse",
              image:
                "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish6.webp",
              tagline: "RICH DESSERT",
              description:
                "Soft chocolate cake cubes on a bed of chocolate soil, served with vibrant red berry sorbet.",
            },
            {
              name: "Roasted Duck Breast",
              image:
                "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish7.webp",
              tagline: "SIGNATURE MAIN",
              description:
                "Tender, medium-rare slices of roasted meat elegantly plated over a vibrant green vegetable puree with savory jus.",
            },
            {
              name: "Savoury Wellington",
              image:
                "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish8.webp",
              tagline: "VEGETARIAN DELIGHT",
              description:
                "Golden, flaky puff pastry wrapped around a rich, dark filling and fresh spinach, served on a bed of savory crumbs.",
            },
          ],
          headingHighlight: "Special Dishes",
        },
        order: 5,
      },
      {
        id: "cmtwx9ak4001syl3pbxuq9pbu",
        type: "ChristmasReservation",
        content: {
          title: "Book Your Christmas Table",
          buttonUrl:
            "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
          buttonText: "Reserve Christmas Table",
          description: "Early booking recommended for holiday parties.",
        },
        order: 6,
      },
    ],
  },
  {
    id: "cmtwx9cpx001tyl3p29mi1wim",
    title: "Contact",
    slug: "contact",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "Contact Details & Table Reservations",
    metaTitle: "Contact & Book a Table | The Seven Stars",
    metaDescription:
      "Contact information, address, map, and table booking for The Seven Stars Marsh Baldon.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9cpx001uyl3pt4f9n89f",
        type: "ContactHero",
        content: {
          tagline: "FIND US IN MARSH BALDON",
          headingPart1: "Get in",
          backgroundImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781164162893-SEVEN_STARS_2026_02_09-0142.webp",
          headingItalicHighlight: "Touch",
        },
        order: 0,
      },
      {
        id: "cmtwx9cpx001vyl3p5bicbt6y",
        type: "ContactInfo",
        content: {
          infoDesc:
            "Whether you have a question about reservations, private hire, or anything else, our team is ready to assist.",
          mapHeading: "Locate Us",
          infoHeading: "We'd Love to",
          mapEmbedUrl:
            "https://maps.google.com/maps?q=The%20Seven%20Stars%20at%20Marsh%20Baldon,%20Oxford,%20OX44%209LP&t=&z=16&ie=UTF8&iwloc=&output=embed",
          phoneNumber: "01865 343337",
          addressLine1: "The Green, Baldon Lane, Marsh Baldon",
          addressLine2: "Oxford - OX44 9LP",
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
          locationTitle: "The Seven Stars",
          mapDescription:
            "The Seven Stars, The Green, Marsh Baldon, Oxford, OX44 9LP",
          infoHeadingItalic: "Hear from You",
        },
        order: 1,
      },
    ],
  },
  {
    id: "cmtwx9evg001wyl3pjo3tm3g8",
    title: "Blog",
    slug: "blog",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "Blog & Articles Landing Page",
    metaTitle: "Blog & News | The Seven Stars",
    metaDescription:
      "Read the latest news, recipe guides, and stories from The Seven Stars Marsh Baldon.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9evg001xyl3pqf8zamtd",
        type: "BlogHero",
        content: {
          tagline: "GUIDES & ARTICLES",
          description: "",
          headingPart1: "The Seven Stars",
          backgroundImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781160436858-SEVEN_STARS_2026_02_09-16.webp",
          headingItalicHighlight: "Blogs & News",
        },
        order: 0,
      },
    ],
  },
  {
    id: "cmtwx9h0t001yyl3pkkram9z3",
    title: "Privacy Policy",
    slug: "privacy-policy",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "Privacy Policy Information",
    metaTitle: "Privacy Policy | The Seven Stars",
    metaDescription: "Privacy Policy for The Seven Stars website.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9h0t001zyl3po5uy8p0e",
        type: "PrivacyPolicyContent",
        content: {
          title: "Privacy Policy",
          content:
            '<h1><span style="color: rgb(91, 99, 104);">Privacy&nbsp;Policy</span></h1><p><span style="color: rgb(91, 99, 104);">We&nbsp;are&nbsp;committed&nbsp;to&nbsp;protecting&nbsp;your&nbsp;privacy.&nbsp;In&nbsp;this&nbsp;notice,&nbsp;you&nbsp;can&nbsp;read&nbsp;about&nbsp;the&nbsp;information&nbsp;we&nbsp;collect&nbsp;from&nbsp;you&nbsp;and&nbsp;how&nbsp;we&nbsp;use&nbsp;it.&nbsp;If&nbsp;you&nbsp;have&nbsp;any&nbsp;questions&nbsp;or&nbsp;concerns,&nbsp;you&nbsp;can&nbsp;email&nbsp;us&nbsp;at:&nbsp;info@sevenstarsatmb.co.uk</span></p><p><strong style="color: rgb(91, 99, 104);">1.&nbsp;Information&nbsp;we&nbsp;collect</strong></p><p><span style="color: rgb(91, 99, 104);">This&nbsp;notice&nbsp;applies&nbsp;to&nbsp;all&nbsp;information&nbsp;collected&nbsp;or&nbsp;submitted&nbsp;on&nbsp;our&nbsp;website.&nbsp;We&nbsp;collect&nbsp;this&nbsp;information&nbsp;to&nbsp;conveniently&nbsp;provide&nbsp;you&nbsp;with&nbsp;our&nbsp;products&nbsp;and&nbsp;services,&nbsp;or&nbsp;for&nbsp;technical&nbsp;reasons.</span></p><ul><li><span style="color: rgb(91, 99, 104);">Personally&nbsp;identifiable&nbsp;information&nbsp;we&nbsp;may&nbsp;collect&nbsp;includes:</span></li><li><span style="color: rgb(91, 99, 104);">Name&nbsp;and&nbsp;job&nbsp;title</span></li><li><span style="color: rgb(91, 99, 104);">Contact&nbsp;information&nbsp;including&nbsp;email&nbsp;address</span></li><li><span style="color: rgb(91, 99, 104);">Demographic&nbsp;information&nbsp;such&nbsp;as&nbsp;postcode,&nbsp;preferences&nbsp;and&nbsp;interests</span></li><li><span style="color: rgb(91, 99, 104);">Non-personally&nbsp;identifiable&nbsp;information&nbsp;we&nbsp;may&nbsp;collect&nbsp;includes:</span></li><li><span style="color: rgb(91, 99, 104);">The&nbsp;type&nbsp;of&nbsp;device&nbsp;you&nbsp;are&nbsp;using&nbsp;to&nbsp;view&nbsp;the&nbsp;website</span></li><li><span style="color: rgb(91, 99, 104);">Anonymous&nbsp;usage&nbsp;statistics</span></li><li><span style="color: rgb(91, 99, 104);">Anonymous&nbsp;information,&nbsp;such&nbsp;as&nbsp;your&nbsp;internet&nbsp;service&nbsp;provider,&nbsp;IP&nbsp;address&nbsp;and&nbsp;internet&nbsp;browsing&nbsp;software,&nbsp;collected&nbsp;by&nbsp;our&nbsp;website</span></li><li><span style="color: rgb(91, 99, 104);">“Cookies,”&nbsp;which&nbsp;enable&nbsp;the&nbsp;website&nbsp;to&nbsp;remember&nbsp;your&nbsp;information&nbsp;if&nbsp;you&nbsp;return&nbsp;to&nbsp;the&nbsp;site,&nbsp;such&nbsp;as&nbsp;to&nbsp;keep&nbsp;you&nbsp;logged&nbsp;in&nbsp;or&nbsp;to&nbsp;remember&nbsp;your&nbsp;login&nbsp;credentials&nbsp;if&nbsp;you&nbsp;return&nbsp;to&nbsp;the&nbsp;site</span></li></ul><p><strong style="color: rgb(91, 99, 104);">2.&nbsp;Visitors&nbsp;to&nbsp;our&nbsp;website</strong></p><p><strong style="color: rgb(91, 99, 104);">Google&nbsp;Analytics:</strong></p><p><span style="color: rgb(91, 99, 104);">When&nbsp;someone&nbsp;visits&nbsp;our&nbsp;website,&nbsp;we&nbsp;use&nbsp;a&nbsp;third&nbsp;party&nbsp;service,&nbsp;Google&nbsp;Analytics,&nbsp;to&nbsp;collect&nbsp;standard&nbsp;internet&nbsp;log&nbsp;information&nbsp;and&nbsp;details&nbsp;of&nbsp;visitor&nbsp;behaviour&nbsp;patterns.&nbsp;We&nbsp;do&nbsp;this&nbsp;to&nbsp;find&nbsp;out&nbsp;things&nbsp;such&nbsp;as&nbsp;the&nbsp;number&nbsp;of&nbsp;visitors&nbsp;to&nbsp;the&nbsp;various&nbsp;parts&nbsp;of&nbsp;the&nbsp;site.&nbsp;This&nbsp;information&nbsp;is&nbsp;only&nbsp;processed&nbsp;in&nbsp;a&nbsp;way&nbsp;which&nbsp;does&nbsp;not&nbsp;identify&nbsp;anyone.&nbsp;We&nbsp;do&nbsp;not&nbsp;make,&nbsp;and&nbsp;do&nbsp;not&nbsp;allow&nbsp;Google&nbsp;to&nbsp;make,&nbsp;any&nbsp;attempt&nbsp;to&nbsp;find&nbsp;out&nbsp;the&nbsp;identities&nbsp;of&nbsp;those&nbsp;visiting&nbsp;our&nbsp;website.&nbsp;If&nbsp;we&nbsp;do&nbsp;want&nbsp;to&nbsp;collect&nbsp;personally&nbsp;identifiable&nbsp;information&nbsp;through&nbsp;our&nbsp;website,&nbsp;we&nbsp;will&nbsp;be&nbsp;up&nbsp;front&nbsp;about&nbsp;this.&nbsp;We&nbsp;will&nbsp;make&nbsp;it&nbsp;clear&nbsp;when&nbsp;we&nbsp;collect&nbsp;personal&nbsp;information&nbsp;and&nbsp;will&nbsp;explain&nbsp;what&nbsp;we&nbsp;intend&nbsp;to&nbsp;do&nbsp;with&nbsp;it.</span></p><p><strong style="color: rgb(91, 99, 104);">Use&nbsp;of&nbsp;cookies:</strong></p><p><span style="color: rgb(91, 99, 104);">You&nbsp;can&nbsp;read&nbsp;more&nbsp;about&nbsp;how&nbsp;we&nbsp;use&nbsp;cookies&nbsp;on&nbsp;our&nbsp;Cookies&nbsp;Page.</span></p><p><strong style="color: rgb(91, 99, 104);">Newsletter:</strong></p><p><span style="color: rgb(91, 99, 104);">If&nbsp;you&nbsp;sign&nbsp;up&nbsp;for&nbsp;our&nbsp;newsletter,&nbsp;which&nbsp;is&nbsp;administered&nbsp;through&nbsp;Mailchimp,&nbsp;we&nbsp;will&nbsp;store&nbsp;some&nbsp;of&nbsp;your&nbsp;information,&nbsp;including&nbsp;your&nbsp;email&nbsp;address,&nbsp;IP&nbsp;address&nbsp;and&nbsp;certain&nbsp;information&nbsp;about&nbsp;the&nbsp;links&nbsp;you&nbsp;click&nbsp;within&nbsp;the&nbsp;emails&nbsp;we&nbsp;send&nbsp;you,&nbsp;on&nbsp;a&nbsp;Mailchimp&nbsp;server.&nbsp;Neither&nbsp;Mailchimp&nbsp;nor&nbsp;we&nbsp;will&nbsp;ever&nbsp;sell&nbsp;your&nbsp;email&nbsp;address&nbsp;or&nbsp;share&nbsp;it&nbsp;with&nbsp;any&nbsp;other&nbsp;party,&nbsp;unless&nbsp;we&nbsp;are&nbsp;legally&nbsp;compelled&nbsp;to&nbsp;do&nbsp;so.&nbsp;If&nbsp;you&nbsp;contact&nbsp;Mailchimp&nbsp;directly&nbsp;regarding&nbsp;your&nbsp;subscription&nbsp;to&nbsp;our&nbsp;newsletter,&nbsp;Mailchimp&nbsp;may&nbsp;contact&nbsp;you&nbsp;directly;&nbsp;otherwise,&nbsp;Mailchimp&nbsp;will&nbsp;never&nbsp;contact&nbsp;you.&nbsp;Only&nbsp;authorised&nbsp;Mailchimp&nbsp;employees&nbsp;have&nbsp;access&nbsp;to&nbsp;our&nbsp;subscriber&nbsp;list.</span></p><p><span style="color: rgb(91, 99, 104);">You&nbsp;are&nbsp;always&nbsp;free&nbsp;to&nbsp;unsubscribe&nbsp;from&nbsp;our&nbsp;newsletter&nbsp;at&nbsp;any&nbsp;time&nbsp;by&nbsp;following&nbsp;the&nbsp;instructions&nbsp;contained&nbsp;within&nbsp;the&nbsp;email&nbsp;or&nbsp;by&nbsp;sending&nbsp;an&nbsp;email&nbsp;to&nbsp;the&nbsp;address&nbsp;provided&nbsp;at&nbsp;the&nbsp;top&nbsp;of&nbsp;this&nbsp;page,&nbsp;but&nbsp;as&nbsp;long&nbsp;as&nbsp;you&nbsp;are&nbsp;registered,&nbsp;we&nbsp;may&nbsp;use&nbsp;Mailchimp&nbsp;to&nbsp;send&nbsp;you&nbsp;information&nbsp;about&nbsp;your&nbsp;account.</span></p><p><strong style="color: rgb(91, 99, 104);">3.&nbsp;How&nbsp;we&nbsp;use&nbsp;your&nbsp;information</strong></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;will&nbsp;not&nbsp;sell,&nbsp;distribute&nbsp;or&nbsp;lease&nbsp;your&nbsp;personal&nbsp;information&nbsp;to&nbsp;third&nbsp;parties&nbsp;except&nbsp;(such&nbsp;as&nbsp;in&nbsp;the&nbsp;case&nbsp;of&nbsp;Mailchimp)&nbsp;when&nbsp;it’s&nbsp;necessary&nbsp;to&nbsp;complete&nbsp;the&nbsp;functions&nbsp;of&nbsp;the&nbsp;website.</span></p><p><span style="color: rgb(91, 99, 104);">When&nbsp;you&nbsp;email&nbsp;us,&nbsp;we&nbsp;will&nbsp;use&nbsp;your&nbsp;email&nbsp;address&nbsp;only&nbsp;for&nbsp;the&nbsp;purpose&nbsp;of&nbsp;responding&nbsp;to&nbsp;you&nbsp;and&nbsp;for&nbsp;no&nbsp;other&nbsp;purpose.</span></p><p><span style="color: rgb(91, 99, 104);">Sometimes&nbsp;we&nbsp;may&nbsp;use&nbsp;anonymous&nbsp;information&nbsp;about&nbsp;your&nbsp;use&nbsp;of&nbsp;our&nbsp;site&nbsp;in&nbsp;combination&nbsp;with&nbsp;other&nbsp;users’&nbsp;usage&nbsp;to&nbsp;make&nbsp;decisions&nbsp;about&nbsp;the&nbsp;contents&nbsp;and&nbsp;design&nbsp;of&nbsp;the&nbsp;web&nbsp;site.</span></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;may&nbsp;disclose&nbsp;your&nbsp;information&nbsp;in&nbsp;response&nbsp;to&nbsp;court&nbsp;orders,&nbsp;or&nbsp;other&nbsp;legal&nbsp;process,&nbsp;or&nbsp;to&nbsp;establish&nbsp;or&nbsp;exercise&nbsp;our&nbsp;legal&nbsp;rights&nbsp;or&nbsp;to&nbsp;defend&nbsp;against&nbsp;legal&nbsp;claims.</span></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;may&nbsp;disclose&nbsp;your&nbsp;information&nbsp;when&nbsp;we&nbsp;believe&nbsp;it&nbsp;necessary&nbsp;or&nbsp;desirable&nbsp;in&nbsp;order&nbsp;to&nbsp;investigate,&nbsp;prevent,&nbsp;or&nbsp;take&nbsp;action&nbsp;regarding&nbsp;illegal&nbsp;activities,&nbsp;suspected&nbsp;fraud,&nbsp;situations&nbsp;involving&nbsp;potential&nbsp;threats&nbsp;to&nbsp;the&nbsp;physical&nbsp;safety&nbsp;of&nbsp;any&nbsp;person,&nbsp;violations&nbsp;of&nbsp;our&nbsp;policies,&nbsp;and/or&nbsp;to&nbsp;protect&nbsp;our&nbsp;rights&nbsp;and&nbsp;property.</span></p><p><span style="color: rgb(91, 99, 104);">If&nbsp;you&nbsp;believe&nbsp;that&nbsp;any&nbsp;information&nbsp;we&nbsp;are&nbsp;holding&nbsp;on&nbsp;you&nbsp;is&nbsp;incorrect&nbsp;or&nbsp;incomplete,&nbsp;please&nbsp;write&nbsp;to&nbsp;or&nbsp;email&nbsp;us&nbsp;as&nbsp;soon&nbsp;as&nbsp;possible.&nbsp;We&nbsp;will&nbsp;promptly&nbsp;correct&nbsp;any&nbsp;information&nbsp;found&nbsp;to&nbsp;be&nbsp;incorrect.</span></p><p><strong style="color: rgb(91, 99, 104);">4.&nbsp;Data&nbsp;security</strong></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;are&nbsp;committed&nbsp;to&nbsp;ensuring&nbsp;that&nbsp;your&nbsp;information&nbsp;is&nbsp;secure.&nbsp;We&nbsp;will&nbsp;never&nbsp;provide&nbsp;access&nbsp;to&nbsp;our&nbsp;databases&nbsp;to&nbsp;any&nbsp;third&nbsp;party,&nbsp;except&nbsp;to&nbsp;the&nbsp;extent&nbsp;necessary&nbsp;to&nbsp;conduct&nbsp;the&nbsp;operations&nbsp;of&nbsp;the&nbsp;web&nbsp;site&nbsp;(such&nbsp;as&nbsp;providing&nbsp;user&nbsp;data&nbsp;to&nbsp;Mailchimp).</span></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;cannot&nbsp;ensure&nbsp;or&nbsp;warrant&nbsp;the&nbsp;security&nbsp;of&nbsp;any&nbsp;information&nbsp;you&nbsp;transmit&nbsp;to&nbsp;us&nbsp;or&nbsp;guarantee&nbsp;that&nbsp;your&nbsp;information&nbsp;on&nbsp;our&nbsp;web&nbsp;site&nbsp;may&nbsp;not&nbsp;be&nbsp;accessed,&nbsp;disclosed,&nbsp;altered&nbsp;or&nbsp;destroyed&nbsp;by&nbsp;breach&nbsp;of&nbsp;any&nbsp;of&nbsp;our&nbsp;industry&nbsp;standard&nbsp;physical,&nbsp;technical&nbsp;or&nbsp;managerial&nbsp;safeguards.&nbsp;When&nbsp;you&nbsp;enter&nbsp;sensitive&nbsp;information&nbsp;(such&nbsp;as&nbsp;contact&nbsp;form&nbsp;credentials)&nbsp;on&nbsp;our&nbsp;contact&nbsp;form,&nbsp;we&nbsp;encrypt&nbsp;that&nbsp;information&nbsp;using&nbsp;secure&nbsp;socket&nbsp;layer&nbsp;technology&nbsp;(SSL).&nbsp;No&nbsp;method&nbsp;of&nbsp;transmission&nbsp;over&nbsp;the&nbsp;Internet&nbsp;or&nbsp;method&nbsp;of&nbsp;electronic&nbsp;storage&nbsp;is&nbsp;100%&nbsp;secure,&nbsp;however.&nbsp;Therefore,&nbsp;we&nbsp;cannot&nbsp;guarantee&nbsp;its&nbsp;absolute&nbsp;security.</span></p><p><strong style="color: rgb(91, 99, 104);">5.&nbsp;Access&nbsp;to&nbsp;Personal&nbsp;Information</strong></p><p><span style="color: rgb(91, 99, 104);">How&nbsp;to&nbsp;access&nbsp;your&nbsp;information</span></p><p><span style="color: rgb(91, 99, 104);">To&nbsp;access&nbsp;your&nbsp;information,&nbsp;you&nbsp;will&nbsp;need&nbsp;to&nbsp;put&nbsp;your&nbsp;request&nbsp;in&nbsp;writing.</span></p><p><span style="color: rgb(91, 99, 104);">You&nbsp;will&nbsp;need&nbsp;to&nbsp;provide&nbsp;information&nbsp;for&nbsp;us&nbsp;to&nbsp;identify&nbsp;you&nbsp;from&nbsp;our&nbsp;records,&nbsp;suchas&nbsp;yourr&nbsp;name&nbsp;and&nbsp;email&nbsp;address.&nbsp;You&nbsp;will&nbsp;also&nbsp;need&nbsp;to&nbsp;tell&nbsp;us&nbsp;what&nbsp;kind&nbsp;of&nbsp;information&nbsp;you&nbsp;are&nbsp;requesting&nbsp;to&nbsp;enable&nbsp;us&nbsp;to&nbsp;locate&nbsp;the&nbsp;information.&nbsp;Send&nbsp;your&nbsp;request&nbsp;to&nbsp;the&nbsp;address&nbsp;provided&nbsp;at&nbsp;the&nbsp;top&nbsp;of&nbsp;this&nbsp;page.</span></p><p><strong style="color: rgb(91, 99, 104);">Proof&nbsp;of&nbsp;identity</strong></p><p><span style="color: rgb(91, 99, 104);">When&nbsp;we&nbsp;receive&nbsp;a&nbsp;request&nbsp;for&nbsp;information,&nbsp;we&nbsp;must&nbsp;make&nbsp;sure&nbsp;you&nbsp;are&nbsp;who&nbsp;you&nbsp;say&nbsp;you&nbsp;are.&nbsp;We&nbsp;need&nbsp;proof&nbsp;of&nbsp;identity.&nbsp;These&nbsp;include:</span></p><ul><li><span style="color: rgb(91, 99, 104);">Your&nbsp;full&nbsp;name</span></li><li><span style="color: rgb(91, 99, 104);">Email&nbsp;Address</span></li></ul><p><span style="color: rgb(91, 99, 104);">The&nbsp;following&nbsp;documents&nbsp;can&nbsp;be&nbsp;accepted&nbsp;to&nbsp;verify&nbsp;your&nbsp;identity.&nbsp;We&nbsp;require&nbsp;two&nbsp;forms&nbsp;of&nbsp;ID:</span></p><ul><li><span style="color: rgb(91, 99, 104);">Current&nbsp;UK/EEA&nbsp;passport</span></li><li><span style="color: rgb(91, 99, 104);">UK&nbsp;photocard&nbsp;driving&nbsp;licence&nbsp;(full&nbsp;or&nbsp;provisional)</span></li><li><span style="color: rgb(91, 99, 104);">Firearms&nbsp;licence/shotgun&nbsp;certificate</span></li><li><span style="color: rgb(91, 99, 104);">EEA&nbsp;national&nbsp;identity&nbsp;card</span></li><li><span style="color: rgb(91, 99, 104);">Full&nbsp;UK&nbsp;paper&nbsp;driving&nbsp;licence</span></li><li><span style="color: rgb(91, 99, 104);">State&nbsp;benefits&nbsp;entitlement&nbsp;document*</span></li><li><span style="color: rgb(91, 99, 104);">State&nbsp;pension&nbsp;entitlement&nbsp;document*</span></li><li><span style="color: rgb(91, 99, 104);">HMRC&nbsp;tax&nbsp;credit&nbsp;document*</span></li><li><span style="color: rgb(91, 99, 104);">Local&nbsp;authority&nbsp;benefit&nbsp;document*</span></li><li><span style="color: rgb(91, 99, 104);">State/local&nbsp;authority&nbsp;educational&nbsp;grant&nbsp;document*</span></li><li><span style="color: rgb(91, 99, 104);">HMRC&nbsp;tax&nbsp;notification&nbsp;document</span></li><li><span style="color: rgb(91, 99, 104);">Disabled&nbsp;driver’s&nbsp;pass</span></li><li><span style="color: rgb(91, 99, 104);">Financial&nbsp;statement&nbsp;issued&nbsp;by&nbsp;bank,&nbsp;building&nbsp;society&nbsp;or&nbsp;credit&nbsp;card&nbsp;company</span></li><li><span style="color: rgb(91, 99, 104);">Judiciary&nbsp;document&nbsp;such&nbsp;as&nbsp;a&nbsp;notice&nbsp;of&nbsp;hearing,&nbsp;summons&nbsp;or&nbsp;court&nbsp;order+</span></li><li><span style="color: rgb(91, 99, 104);">Utility&nbsp;bill&nbsp;for&nbsp;supply&nbsp;of&nbsp;gas,&nbsp;electric,&nbsp;water&nbsp;or&nbsp;telephone&nbsp;landline+</span></li><li><span style="color: rgb(91, 99, 104);">Most&nbsp;recent&nbsp;mortgage&nbsp;statement</span></li><li><span style="color: rgb(91, 99, 104);">Most&nbsp;recent&nbsp;council&nbsp;tax&nbsp;bill/demand&nbsp;or&nbsp;statement</span></li><li><span style="color: rgb(91, 99, 104);">Current&nbsp;council&nbsp;rent&nbsp;card</span></li><li><span style="color: rgb(91, 99, 104);">Current&nbsp;council&nbsp;tenancy&nbsp;agreement</span></li><li><span style="color: rgb(91, 99, 104);">Building&nbsp;society&nbsp;passbook&nbsp;which&nbsp;shows&nbsp;a&nbsp;transaction&nbsp;in&nbsp;the&nbsp;last&nbsp;three&nbsp;months&nbsp;and&nbsp;your&nbsp;address</span></li></ul><p><span style="color: rgb(91, 99, 104);">*&nbsp;Must&nbsp;be&nbsp;the&nbsp;most&nbsp;recently&nbsp;issued&nbsp;and&nbsp;less&nbsp;than&nbsp;12&nbsp;months&nbsp;old.</span></p><p><span style="color: rgb(91, 99, 104);">+&nbsp;Must&nbsp;be&nbsp;the&nbsp;most&nbsp;recently&nbsp;issued&nbsp;and&nbsp;less&nbsp;than&nbsp;three&nbsp;months&nbsp;old&nbsp;(except&nbsp;water&nbsp;bills&nbsp;–&nbsp;less&nbsp;than&nbsp;12&nbsp;months&nbsp;old).</span></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;will&nbsp;accept&nbsp;copies&nbsp;of&nbsp;these&nbsp;documents.&nbsp;However,&nbsp;we&nbsp;reserve&nbsp;the&nbsp;right&nbsp;to&nbsp;ask&nbsp;for&nbsp;originals&nbsp;if&nbsp;photocopies&nbsp;are&nbsp;not&nbsp;of&nbsp;a&nbsp;good&nbsp;quality.</span></p><p><span style="color: rgb(91, 99, 104);">A&nbsp;‘reasonable&nbsp;fee’&nbsp;will&nbsp;be&nbsp;charged&nbsp;when&nbsp;a&nbsp;request&nbsp;is&nbsp;manifestly&nbsp;unfounded&nbsp;or&nbsp;excessive,&nbsp;particularly&nbsp;if&nbsp;it&nbsp;is&nbsp;repetitive.&nbsp;We&nbsp;may&nbsp;also&nbsp;charge&nbsp;a&nbsp;reasonable&nbsp;fee&nbsp;to&nbsp;comply&nbsp;with&nbsp;requests&nbsp;for&nbsp;further&nbsp;copies&nbsp;of&nbsp;the&nbsp;same&nbsp;information.</span></p><p><strong style="color: rgb(91, 99, 104);">6.&nbsp;Changes&nbsp;to&nbsp;this&nbsp;policy</strong></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;reserve&nbsp;the&nbsp;right&nbsp;to&nbsp;change&nbsp;this&nbsp;policy&nbsp;at&nbsp;any&nbsp;time.&nbsp;Although&nbsp;we&nbsp;will&nbsp;notify&nbsp;users&nbsp;appropriately&nbsp;when&nbsp;changes&nbsp;are&nbsp;made&nbsp;to&nbsp;this&nbsp;policy,&nbsp;you&nbsp;are&nbsp;responsible&nbsp;for&nbsp;checking&nbsp;this&nbsp;page&nbsp;for&nbsp;changes.&nbsp;Your&nbsp;use&nbsp;of&nbsp;our&nbsp;website&nbsp;constitutes&nbsp;agreement&nbsp;to&nbsp;this&nbsp;privacy&nbsp;policy.</span></p><p><strong style="color: rgb(91, 99, 104);">7.&nbsp;Links&nbsp;to&nbsp;other&nbsp;websites</strong></p><p><span style="color: rgb(91, 99, 104);">Our&nbsp;website&nbsp;may&nbsp;contain&nbsp;links&nbsp;to&nbsp;other&nbsp;websites&nbsp;of&nbsp;interest.&nbsp;However,&nbsp;once&nbsp;you&nbsp;have&nbsp;used&nbsp;these&nbsp;links&nbsp;to&nbsp;leave&nbsp;our&nbsp;site,&nbsp;you&nbsp;should&nbsp;note&nbsp;that&nbsp;we&nbsp;do&nbsp;not&nbsp;have&nbsp;any&nbsp;control&nbsp;over&nbsp;that&nbsp;other&nbsp;website.&nbsp;Therefore,&nbsp;we&nbsp;cannot&nbsp;be&nbsp;responsible&nbsp;for&nbsp;the&nbsp;protection&nbsp;and&nbsp;privacy&nbsp;of&nbsp;any&nbsp;information&nbsp;which&nbsp;you&nbsp;provide&nbsp;whilst&nbsp;visiting&nbsp;such&nbsp;sites&nbsp;and&nbsp;such&nbsp;sites&nbsp;are&nbsp;not&nbsp;governed&nbsp;by&nbsp;this&nbsp;privacy&nbsp;statement.&nbsp;You&nbsp;should&nbsp;exercise&nbsp;caution&nbsp;and&nbsp;look&nbsp;at&nbsp;the&nbsp;privacy&nbsp;statement&nbsp;applicable&nbsp;to&nbsp;the&nbsp;website&nbsp;in&nbsp;question.</span></p><p></p><p></p>',
          introduction: "",
          backgroundImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781195615052-WhatsAppImage2026-06-11at21.23.03.jpeg",
        },
        order: 0,
      },
    ],
  },
  {
    id: "cmtwx9j720020yl3pgexrond4",
    title: "Terms of Service",
    slug: "terms-of-service",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "Terms of Service Information",
    metaTitle: "Terms of Service | The Seven Stars",
    metaDescription:
      "Terms of Service for using The Seven Stars website and table reservations.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9j720021yl3pge3t7lkt",
        type: "TermsOfServiceContent",
        content: {
          title: "Terms of Service",
          content:
            '<h1><span style="color: rgb(91, 99, 104);">Cookie&nbsp;Policy</span></h1><p><span style="color: rgb(91, 99, 104);">Hi&nbsp;Baldon&nbsp;Ltd&nbsp;(“us”,&nbsp;“we”,&nbsp;or&nbsp;“our”)&nbsp;uses&nbsp;cookies&nbsp;on&nbsp;sevenstarsatmarshbaldon.co.uk&nbsp;(the&nbsp;“Service”).</span></p><p><span style="color: rgb(91, 99, 104);">Our&nbsp;Cookies&nbsp;Policy&nbsp;explains&nbsp;what&nbsp;cookies&nbsp;are,&nbsp;how&nbsp;we&nbsp;use&nbsp;cookies,&nbsp;how&nbsp;third-parties&nbsp;we&nbsp;may&nbsp;partner&nbsp;with&nbsp;may&nbsp;use&nbsp;cookies&nbsp;on&nbsp;the&nbsp;Service,&nbsp;your&nbsp;choices&nbsp;regarding&nbsp;cookies&nbsp;and&nbsp;further&nbsp;information&nbsp;about&nbsp;cookies.</span></p><p><strong style="color: rgb(91, 99, 104);">What&nbsp;are&nbsp;cookies?</strong></p><p><span style="color: rgb(91, 99, 104);">Cookies&nbsp;are&nbsp;small&nbsp;pieces&nbsp;of&nbsp;text&nbsp;sent&nbsp;by&nbsp;your&nbsp;web&nbsp;browser&nbsp;to&nbsp;a&nbsp;website&nbsp;you&nbsp;visit.&nbsp;A&nbsp;cookie&nbsp;file&nbsp;is&nbsp;stored&nbsp;in&nbsp;your&nbsp;web&nbsp;browser&nbsp;and&nbsp;allows&nbsp;the&nbsp;Service&nbsp;or&nbsp;a&nbsp;third&nbsp;party&nbsp;to&nbsp;recognise&nbsp;you,&nbsp;making&nbsp;your&nbsp;next&nbsp;visit&nbsp;easier&nbsp;and&nbsp;more&nbsp;efficient.&nbsp;You&nbsp;can&nbsp;find&nbsp;out&nbsp;more&nbsp;information&nbsp;about&nbsp;cookies&nbsp;at&nbsp;www.allaboutcookies.org</span></p><p><span style="color: rgb(91, 99, 104);">The&nbsp;law&nbsp;states&nbsp;that&nbsp;we&nbsp;can&nbsp;store&nbsp;cookies&nbsp;on&nbsp;your&nbsp;machine&nbsp;if&nbsp;they&nbsp;are&nbsp;essential&nbsp;to&nbsp;the&nbsp;operation&nbsp;of&nbsp;this&nbsp;site&nbsp;but&nbsp;that&nbsp;we&nbsp;need&nbsp;your&nbsp;permission&nbsp;before&nbsp;using&nbsp;any&nbsp;other&nbsp;type&nbsp;of&nbsp;cookie.</span></p><p><span style="color: rgb(91, 99, 104);">Cookies&nbsp;can&nbsp;be&nbsp;“persistent”&nbsp;or&nbsp;“session”&nbsp;cookies.</span></p><p><strong style="color: rgb(91, 99, 104);">How&nbsp;&nbsp;sevenstarsatmarshbaldon.co.uk&nbsp;</strong></p><p><span style="color: rgb(91, 99, 104);">When&nbsp;you&nbsp;use&nbsp;and&nbsp;access&nbsp;the&nbsp;Service,&nbsp;we&nbsp;may&nbsp;place&nbsp;several&nbsp;cookie&nbsp;files&nbsp;in&nbsp;your&nbsp;web&nbsp;Browser.</span></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;use&nbsp;cookies&nbsp;for&nbsp;the&nbsp;following&nbsp;purposes:&nbsp;to&nbsp;enable&nbsp;certain&nbsp;functions&nbsp;of&nbsp;the&nbsp;Service,&nbsp;to&nbsp;provide&nbsp;analytics,&nbsp;to&nbsp;store&nbsp;your&nbsp;preferences,&nbsp;to&nbsp;enable&nbsp;advertisement&nbsp;delivery,&nbsp;including&nbsp;behavioural&nbsp;advertising.</span></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;use&nbsp;both&nbsp;session&nbsp;and&nbsp;persistent&nbsp;cookies&nbsp;on&nbsp;the&nbsp;Service,&nbsp;and&nbsp;we&nbsp;use&nbsp;different&nbsp;types&nbsp;of&nbsp;cookies&nbsp;to&nbsp;run&nbsp;the&nbsp;Service:</span></p><p><span style="color: rgb(91, 99, 104);">Essential&nbsp;cookies.&nbsp;We&nbsp;may&nbsp;use&nbsp;essential&nbsp;cookies&nbsp;to&nbsp;authenticate&nbsp;users&nbsp;and&nbsp;prevent&nbsp;fraudulent&nbsp;use&nbsp;of&nbsp;user&nbsp;accounts.</span></p><p><strong style="color: rgb(91, 99, 104);">Third-party&nbsp;cookies</strong></p><p><span style="color: rgb(91, 99, 104);">In&nbsp;addition&nbsp;to&nbsp;our&nbsp;own&nbsp;cookies,&nbsp;we&nbsp;may&nbsp;also&nbsp;use&nbsp;various&nbsp;third-parties&nbsp;cookies&nbsp;to&nbsp;report&nbsp;usage&nbsp;statistics&nbsp;of&nbsp;the&nbsp;Service,&nbsp;deliver&nbsp;advertisements&nbsp;on&nbsp;and&nbsp;through&nbsp;the&nbsp;Service,&nbsp;and&nbsp;so&nbsp;on.</span></p><p><strong style="color: rgb(91, 99, 104);">The&nbsp;cookies&nbsp;we&nbsp;use</strong></p><p><span style="color: rgb(91, 99, 104);">We&nbsp;use&nbsp;the&nbsp;following&nbsp;types&nbsp;of&nbsp;cookies&nbsp;on&nbsp;our&nbsp;website:</span></p><p><span style="color: rgb(91, 99, 104);">Google&nbsp;Analytics&nbsp;cookies:</span></p><p><span style="color: rgb(91, 99, 104);">These&nbsp;cookies&nbsp;collect&nbsp;information&nbsp;about&nbsp;how&nbsp;visitors&nbsp;use&nbsp;a&nbsp;website,e&nbsp;e.g.&nbsp;which&nbsp;pages&nbsp;visitors&nbsp;go&nbsp;to&nbsp;most&nbsp;often.&nbsp;These&nbsp;cookies&nbsp;do&nbsp;not&nbsp;collect&nbsp;information&nbsp;that&nbsp;identifies&nbsp;a&nbsp;visitor&nbsp;but&nbsp;provide&nbsp;a&nbsp;free&nbsp;web&nbsp;analytics&nbsp;service&nbsp;to&nbsp;website&nbsp;owners.</span></p><p><span style="color: rgb(91, 99, 104);">_ga</span></p><p><span style="color: rgb(91, 99, 104);">Used&nbsp;to&nbsp;distinguish&nbsp;users</span></p><p><span style="color: rgb(91, 99, 104);">Default&nbsp;expiration&nbsp;time:&nbsp;2&nbsp;years</span></p><p><span style="color: rgb(91, 99, 104);">_gid</span></p><p><span style="color: rgb(91, 99, 104);">Used&nbsp;to&nbsp;distinguish&nbsp;users</span></p><p><span style="color: rgb(91, 99, 104);">Default&nbsp;expiration&nbsp;time:&nbsp;24&nbsp;hours</span></p><p><span style="color: rgb(91, 99, 104);">_gat</span></p><p><span style="color: rgb(91, 99, 104);">Used&nbsp;to&nbsp;throttle&nbsp;request&nbsp;rate</span></p><p><span style="color: rgb(91, 99, 104);">Default&nbsp;expiration&nbsp;time:&nbsp;1&nbsp;minute</span></p><p><span style="color: rgb(91, 99, 104);">AMP_TOKEN</span></p><p><span style="color: rgb(91, 99, 104);">Contains&nbsp;a&nbsp;token&nbsp;that&nbsp;can&nbsp;be&nbsp;used&nbsp;to&nbsp;retrieve&nbsp;a&nbsp;Client&nbsp;ID&nbsp;fromthe&nbsp;&nbsp;AMP&nbsp;Client&nbsp;ID&nbsp;service.&nbsp;Other&nbsp;possible&nbsp;values&nbsp;indicate&nbsp;opt-out,&nbsp;inflight&nbsp;request&nbsp;or&nbsp;an&nbsp;error&nbsp;retrieving&nbsp;a&nbsp;Client&nbsp;ID&nbsp;from&nbsp;the&nbsp;AMP&nbsp;Client&nbsp;ID&nbsp;service</span></p><p><span style="color: rgb(91, 99, 104);">Default&nbsp;expiration&nbsp;time:&nbsp;30&nbsp;seconds&nbsp;to&nbsp;1&nbsp;year</span></p><p><span style="color: rgb(91, 99, 104);">_gac_&nbsp;Contains&nbsp;campaign-related&nbsp;information&nbsp;for&nbsp;the&nbsp;user.&nbsp;If&nbsp;you&nbsp;have&nbsp;linked&nbsp;your&nbsp;Google&nbsp;Analytics&nbsp;and&nbsp;AdWords&nbsp;accounts,&nbsp;AdWords&nbsp;website&nbsp;conversion&nbsp;tags&nbsp;will&nbsp;read&nbsp;this&nbsp;cookie&nbsp;unless&nbsp;you&nbsp;opt&nbsp;out.</span></p><p><span style="color: rgb(91, 99, 104);">Default&nbsp;expiration&nbsp;time:&nbsp;90&nbsp;days</span></p><p><strong style="color: rgb(91, 99, 104);">What&nbsp;are&nbsp;your&nbsp;choices&nbsp;regarding&nbsp;cookies?</strong></p><p><span style="color: rgb(91, 99, 104);">When&nbsp;accessing&nbsp;the&nbsp;Service,e&nbsp;the&nbsp;cookies&nbsp;noted&nbsp;above&nbsp;are&nbsp;automatically&nbsp;added&nbsp;to&nbsp;your&nbsp;computer.&nbsp;You&nbsp;may&nbsp;choose&nbsp;to&nbsp;block&nbsp;cookies&nbsp;by&nbsp;activating&nbsp;the&nbsp;setting&nbsp;on&nbsp;your&nbsp;browser&nbsp;that&nbsp;allows&nbsp;you&nbsp;to&nbsp;refuse&nbsp;the&nbsp;setting&nbsp;of&nbsp;all&nbsp;or&nbsp;some&nbsp;cookies.</span></p><p><span style="color: rgb(91, 99, 104);">Please&nbsp;note,&nbsp;however,&nbsp;that&nbsp;if&nbsp;you&nbsp;delete&nbsp;cookies&nbsp;or&nbsp;refuse&nbsp;to&nbsp;accept&nbsp;them,&nbsp;you&nbsp;might&nbsp;not&nbsp;be&nbsp;able&nbsp;to&nbsp;use&nbsp;all&nbsp;of&nbsp;the&nbsp;features&nbsp;we&nbsp;offer,&nbsp;you&nbsp;may&nbsp;not&nbsp;be&nbsp;able&nbsp;to&nbsp;store&nbsp;your&nbsp;preferences,&nbsp;and&nbsp;some&nbsp;of&nbsp;our&nbsp;pages&nbsp;might&nbsp;not&nbsp;display&nbsp;properly.</span></p><p><strong style="color: rgb(91, 99, 104);">Your&nbsp;consent</strong></p><p><span style="color: rgb(91, 99, 104);">By&nbsp;clicking&nbsp;on&nbsp;the&nbsp;“Accept&nbsp;Cookies”&nbsp;tab&nbsp;on&nbsp;the&nbsp;cookie&nbsp;pop-up&nbsp;on&nbsp;our&nbsp;site&nbsp;or&nbsp;by&nbsp;continuing&nbsp;to&nbsp;use&nbsp;the&nbsp;Service,&nbsp;we&nbsp;deem&nbsp;that&nbsp;you&nbsp;have&nbsp;provided&nbsp;your&nbsp;consent&nbsp;to&nbsp;the&nbsp;use&nbsp;of&nbsp;the&nbsp;above-named&nbsp;cookies.</span></p><p><strong style="color: rgb(91, 99, 104);">Contact&nbsp;us</strong></p><p><span style="color: rgb(91, 99, 104);">If&nbsp;you&nbsp;have&nbsp;any&nbsp;queries&nbsp;about&nbsp;your&nbsp;personal&nbsp;information&nbsp;or&nbsp;any&nbsp;questions&nbsp;on&nbsp;our&nbsp;use&nbsp;of&nbsp;the&nbsp;information,&nbsp;please&nbsp;contact&nbsp;info@sevenstarsatmb.co.uk</span></p><p></p>',
          introduction: "",
          backgroundImage:
            "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781160176550-SEVEN_STARS_2026_02_09-137.webp",
        },
        order: 0,
      },
    ],
  },
  {
    id: "cmtwx9lgu0022yl3p7oo1ib71",
    title: "Cricket Legend Visits Oxfordshire Pub Next to Village Green",
    slug: "cricket-legend-visits-oxfordshire-pub",
    parent: "-",
    order: 0,
    type: "blog",
    visibility: "published",
    isStatic: false,
    description: null,
    metaTitle: "Cricket Legend Visits Seven Stars - Oxford Mail Feature",
    metaDescription:
      "Oxford Mail reports on a cricket legend visiting The Seven Stars at Marsh Baldon.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage:
      "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787557315939-download.webp",
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9lgu0023yl3pfi5220ue",
        type: "BlogDetail",
        content: {
          tag: "Press & News",
          area: "Oxford Mail Feature",
          date: "June 2026",
          link: "https://www.oxfordmail.co.uk/news/26159216.cricket-legend-visits-oxfordshire-pub-next-village-green/",
          views: 245,
          content:
            '<p>The Seven Stars at Marsh Baldon was recently highlighted in an Oxford Mail feature following an exciting visit from a renowned international cricket legend. Situated right on the picturesque Marsh Baldon village green—where cricket has been played by local teams for generations—the pub served as the ideal setting for a summer afternoon of sports talk, warm hospitality, and traditional pub refreshments.</p><h3>A Village Green Steeped in History</h3><p>Marsh Baldon Green is famous across South Oxfordshire as one of the largest and most scenic village greens in England. For over a century, summer weekends have seen local cricket matches played against the backdrop of historic thatched cottages and mature oak trees.</p><p>During the visit, patrons and local residents gathered in the pub garden to share memories, take photos, and discuss classic cricket fixtures over cold pints of local cask ale and freshly cooked British pub dishes.</p><h3>Celebrating Community & Sports</h3><p>"It’s an incredible honor to have sporting figures visit our community pub," said landlord Namit. "The connection between village green cricket and a traditional English pub is timeless. Events like these bring residents and visitors together in celebration of local heritage."</p>',
          excerpt:
            "Oxford Mail featured The Seven Stars as a cricket legend visited our traditional village green pub in Marsh Baldon.",
          postType: "news",
          readTime: "3 min read",
        },
        order: 0,
      },
    ],
  },
  {
    id: "cmtwx9nn00024yl3ppnp839qx",
    title: "Five Oxfordshire Country Pubs With Best Food Revealed",
    slug: "five-oxfordshire-country-pubs-best-food",
    parent: "-",
    order: 0,
    type: "blog",
    visibility: "published",
    isStatic: false,
    description: null,
    metaTitle: "Five Oxfordshire Country Pubs With Best Food Revealed",
    metaDescription:
      "The Seven Stars recognized as one of Oxfordshire's top country pubs for exceptional dining.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage:
      "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787662018756-18990479.webp",
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9nn00025yl3pkwnsll8o",
        type: "BlogDetail",
        content: {
          tag: "Award & Press",
          area: "Oxford Mail Feature",
          date: "January 2025",
          link: "https://www.oxfordmail.co.uk/news/24868629.five-oxfordshire-country-pubs-best-food-revealed/",
          views: 312,
          content:
            '<p>The Oxford Mail has published its annual culinary guide featuring the top five country pubs across Oxfordshire for outstanding food, hospitality, and atmosphere. We are thrilled to announce that The Seven Stars at Marsh Baldon has been officially named among this elite group of destinations!</p><h3>Elevated Pub Classics & Global Inspirations</h3><p>The feature highlighted our kitchen’s dual philosophy: perfecting traditional British pub staples like ale-battered fish and chips, slow-cooked Sunday roasts, and gourmet steak burgers, while also introducing vibrant international specials like our fortnightly Indian Thali nights.</p><blockquote>"The Seven Stars strikes the perfect balance between a quintessential countryside local and a destination gastropub serving extraordinary food." — Oxford Mail</blockquote><h3>Sourcing Local Oxfordshire Ingredients</h3><p>Our commitment to quality starts with local partnerships. Our chefs work closely with local farms, butchery suppliers, and organic vegetable growers across South Oxfordshire to ensure seasonal freshness in every plate. Whether dining inside our cozy 350-year-old dining room by the log fire or enjoying lunch on the garden patio, guests can expect exceptional quality every time.</p>',
          excerpt:
            "The Oxford Mail named The Seven Stars among the top five country pubs in Oxfordshire for outstanding food and service.",
          postType: "news",
          readTime: "4 min read",
        },
        order: 0,
      },
    ],
  },
  {
    id: "cmtwx9pse0026yl3ppdjw8muw",
    title: "Staff at Village Green Pub Get Ready for Beer Festival",
    slug: "staff-village-green-pub-beer-festival",
    parent: "-",
    order: 0,
    type: "blog",
    visibility: "published",
    isStatic: false,
    description: null,
    metaTitle: "Beer Festival at The Seven Stars - Oxford Mail Feature",
    metaDescription:
      "Oxford Mail highlights the annual beer festival preparations at The Seven Stars Marsh Baldon.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage:
      "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781195516243-IMG_4523.webp",
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9pse0027yl3porqxdsim",
        type: "BlogDetail",
        content: {
          tag: "Events & Media",
          area: "Beer Festival",
          date: "July 2024",
          link: "https://www.oxfordmail.co.uk/news/24423574.staff-village-green-pub-gets-ready-beer-festival/",
          views: 189,
          content:
            "<p>The Seven Stars team is gearing up for our annual Summer Beer & Cider Festival on Marsh Baldon Green! As reported in the Oxford Mail, the event promises to showcase over 25 guest ales, craft beers, and artisan ciders from microbreweries across Oxfordshire and surrounding counties.</p><h3>Festival Highlights & Local Craft Brews</h3><p>Visitors can look forward to a diverse selection of beverages ranging from crisp pale ales to rich stouts and fruity traditional ciders. Highlights of the weekend include:</p><ul><li>Over 20 hand-pulled cask ales from Oxfordshire microbreweries</li><li>Live acoustic music performances on the garden lawn</li><li>Wood-fired pizza oven and gourmet BBQ food stalls</li><li>Family-friendly outdoor games and Aunt Sally competitions</li></ul><h3>Gathering the Community</h3><p>Our spacious beer garden overlooking the village green will be equipped with stretch tents, seating for over 150 guests, and an outdoor bar tap system. Entrance is free, and all community members and visitors are invited to celebrate the best of British brewing tradition with us.</p>",
          excerpt:
            "Preparations underway at Marsh Baldon Green for our annual beer festival featuring local microbreweries and cask ciders.",
          postType: "news",
          readTime: "3 min read",
        },
        order: 0,
      },
    ],
  },
  {
    id: "cmtwx9ryx0028yl3ph3it8ui7",
    title: "Sunday Roasts Selling Fast at Village Pub Near Oxford",
    slug: "sunday-roasts-selling-fast-village-pub",
    parent: "-",
    order: 0,
    type: "blog",
    visibility: "published",
    isStatic: false,
    description: null,
    metaTitle: "Popular Sunday Roasts at Seven Stars Marsh Baldon",
    metaDescription:
      "Oxford Mail features the highly popular Sunday Roast dinners at The Seven Stars.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage:
      "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1779094138324-food-gourmet.webp",
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9ryx0029yl3pkwyx0lxu",
        type: "BlogDetail",
        content: {
          tag: "Food Feature",
          area: "Sunday Luncheon",
          date: "July 2023",
          link: "https://www.oxfordmail.co.uk/news/23651506.sunday-roasts-selling-village-pub-near-oxford/",
          views: 420,
          content:
            "<p>Sunday roast at The Seven Stars has quickly become one of the most sought-after weekend dining reservations in South Oxfordshire. The Oxford Mail recently featured our Sunday lunch service, highlighting why tables fill up days in advance.</p><h3>The Perfect Sunday Feast</h3><p>Every Sunday, our chefs prepare a traditional roast feast served with giant homemade Yorkshire puddings, duck-fat roasted potatoes, honey-glazed root vegetables, and rich 48-hour bone marrow gravy. Our menu features:</p><ul><li><strong>28-Day Aged British Beef Sirloin:</strong> Served cooked to perfection with horseradish cream.</li><li><strong>Slow-Roasted Pork Belly:</strong> With crispy crackling, spiced apple sauce, and seasonal greens.</li><li><strong>Free-Range Roast Chicken Breast:</strong> Accompanied by sage and onion stuffing.</li><li><strong>Nut Roast & Vegetarian Specials:</strong> Served with vegetarian gravy and seasonal produce.</li></ul><p>Due to high demand, early reservation is highly recommended. Book your Sunday table online or call our team on 01865 343337.</p>",
          excerpt:
            "Why our Sunday Roasts with fluffy roast potatoes, giant Yorkshire puddings, and rich gravies are a local favourite.",
          postType: "news",
          readTime: "3 min read",
        },
        order: 0,
      },
    ],
  },
  {
    id: "cmtwx9uf5002ayl3pnx9i1drx",
    title: "Village Pub Near Oxford Taken Over by New Managers",
    slug: "village-pub-near-oxford-taken-over-new-managers",
    parent: "-",
    order: 0,
    type: "blog",
    visibility: "published",
    isStatic: false,
    description: null,
    metaTitle: "New Management at The Seven Stars - Oxford Mail",
    metaDescription:
      "New stewards Namit & Sunit bring fresh energy and local passion to The Seven Stars.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage:
      "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781686607452-SEVEN_STARS_2026_02_09-0028.webp",
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9uf5002byl3p9isan82k",
        type: "BlogDetail",
        content: {
          tag: "Pub History",
          area: "Community News",
          date: "June 2023",
          link: "https://www.oxfordmail.co.uk/news/23615560.village-pub-near-oxford-taken-new-managers/",
          views: 298,
          content:
            "<p>An exciting new chapter began for The Seven Stars at Marsh Baldon as experienced stewards Namit and Sunit assumed leadership of the historic community-owned pub, as reported by the Oxford Mail.</p><h3>Preserving History, Breathing New Energy</h3><p>Purchased by over 75 local shareholders through the Baldons and Nuneham Community Society (BNCS) in 2013, The Seven Stars stands as a beacon of community preservation. Namit and Sunit bring years of hospitality expertise and a deep commitment to maintaining the pub’s warm, welcoming character while introducing modern refinements.</p><h3>What’s New at The Seven Stars?</h3><p>Under new stewardship, the pub has launched refreshed seasonal dining menus, upgraded the outdoor beer garden facilities, introduced regular live music and quiz nights, and launched our popular fortnightly Indian Thali nights. The team remains dedicated to ensuring every guest—whether a lifelong local resident or a first-time visitor—feels right at home.</p>",
          excerpt:
            "Under new stewards Namit and Sunit, the historic community-owned pub begins an exciting chapter of hospitality.",
          postType: "news",
          readTime: "4 min read",
        },
        order: 0,
      },
    ],
  },
  {
    id: "cmtwx9woz002cyl3p12xc1kyo",
    title: "Authentic Indian Desi Thali Nights at The Seven Stars",
    slug: "authentic-indian-desi-thali-nights",
    parent: "-",
    order: 0,
    type: "blog",
    visibility: "published",
    isStatic: false,
    description: null,
    metaTitle: "Indian Desi Thali Nights - Seven Stars Marsh Baldon",
    metaDescription:
      "Join us for our popular fortnightly Indian Thali nights featuring authentic curries and fresh naan.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage:
      "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787659089858-1781195615052-WhatsAppImage2026-06-11at21.23.03.webp",
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9woz002dyl3pvzm748wm",
        type: "BlogDetail",
        content: {
          tag: "Dining Night",
          area: "Special Event",
          date: "Fortnightly",
          link: "",
          views: 510,
          content:
            "<p>Every fortnight, The Seven Stars transforms its kitchen to host our hugely popular Indian Desi Thali Nights—a unique dining experience in South Oxfordshire that combines authentic Indian home-style cooking with traditional pub warmth.</p><h3>What is a Thali?</h3><p>A Thali is a traditional Indian meal arrangement where a balanced assortment of dishes is served on a single large platter. It offers diners a harmonious blend of sweet, savory, spicy, and tangy flavors in one complete feast.</p><h3>On the Thali Menu</h3><p>Each Thali night features a thoughtfully curated menu that changes regularly to showcase regional Indian specialties:</p><ul><li><strong>Authentic Curries:</strong> From aromatic Butter Chicken and Slow-Cooked Lamb Rogan Josh to Paneer Tikka Masala and Dal Makhani.</li><li><strong>Freshly Baked Breads:</strong> Piping hot garlic naan and butter roti served straight from the oven.</li><li><strong>Accompaniments:</strong> Fragrant basmati pilau rice, crispy vegetable samosas, tangy mango chutney, and refreshing cucumber raita.</li></ul><p>Tables sell out quickly for Thali nights! Check our events schedule or contact us directly to reserve your place at the next event.</p>",
          excerpt:
            "Experience our popular Indian Desi Thali nights, featuring authentic regional curries, daals, warm naan, and side dishes.",
          postType: "blog",
          readTime: "3 min read",
        },
        order: 0,
      },
    ],
  },
  {
    id: "cmtwx9yug002eyl3pcblh7b5f",
    title: "Summer Evenings on Marsh Baldon Green",
    slug: "summer-in-marsh-baldon",
    parent: "-",
    order: 0,
    type: "blog",
    visibility: "published",
    isStatic: false,
    description: null,
    metaTitle: "Summer Evenings on Marsh Baldon Green - Seven Stars",
    metaDescription:
      "Enjoy outdoor dining and craft beer on the village green this summer.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage:
      "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787659182710-1781156724977-SEVEN_STARS_2026_02_09-0106.webp",
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwx9yug002fyl3pwfpa315c",
        type: "BlogDetail",
        content: {
          tag: "Seasonal Update",
          area: "Marsh Baldon",
          date: "10 Aug 2026",
          link: "",
          views: 142,
          content:
            "<p>As long summer days arrive in South Oxfordshire, there is no finer location to spend an evening than the spacious garden at The Seven Stars, overlooking the tranquil expanse of Marsh Baldon Green.</p><h3>Outdoor Dining &amp; Garden Bar</h3><p>Our expansive outdoor seating area accommodates over 120 guests, complete with wooden picnic benches, shaded patio umbrellas, and a covered stretch tent for evening comfort. Throughout the summer season, our outdoor garden bar serves icy draught beers, craft ciders, Pimms pitchers, and chilled rosé.</p><h3>Live Music &amp; Sunday Sessions</h3><p>Join us every weekend for acoustic music sessions on the green, wood-fired pizza specials, and relaxed outdoor gatherings. Whether stopping by after a countryside walk with your dog or meeting friends for an early evening drink, summer at The Seven Stars offers quintessential English village charm at its best.</p>",
          excerpt:
            "Discover how we are celebrating summer with wood-fired pizzas, outdoor bar taps, and acoustic Sunday sessions on the green.",
          postType: "blog",
          readTime: "3 min read",
        },
        order: 0,
      },
    ],
  },
  {
    id: "cmtwxa10c002gyl3p23r8hg7l",
    title: "Meet Our Local Farms & Food Suppliers",
    slug: "locally-sourced-oxfordshire-produce",
    parent: "-",
    order: 0,
    type: "blog",
    visibility: "published",
    isStatic: false,
    description: null,
    metaTitle: "Meet Our Local Farms & Food Suppliers - Seven Stars",
    metaDescription:
      "Learn about the local farmers who supply our kitchen daily.",
    targetKeywords: null,
    canonicalUrl: null,
    noIndex: false,
    featuredImage:
      "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1781160436858-SEVEN_STARS_2026_02_09-16.webp",
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    schema: null,
    headingOptions: null,
    sections: [
      {
        id: "cmtwxa10c002hyl3pragsqf8b",
        type: "BlogDetail",
        content: {
          tag: "Food & Drink",
          area: "Oxfordshire",
          date: "05 Aug 2026",
          link: "",
          views: 98,
          content:
            "<p>At The Seven Stars, our culinary philosophy centers on fresh, ethically sourced ingredients. We believe that great food starts with exceptional produce grown and raised right here in Oxfordshire and neighboring counties.</p><h3>Our Local Sourcing Partners</h3><p>We are proud to partner with local farms, dairies, and independent artisan suppliers who share our passion for quality and sustainability:</p><ul><li><strong>Oxfordshire Butchery:</strong> Supplying 28-day dry-aged British beef, free-range pork, and locally reared lamb.</li><li><strong>Regional Organic Growers:</strong> Delivering seasonal vegetables, fresh herbs, and crisp salad greens directly to our kitchen.</li><li><strong>Local Breweries & Distilleries:</strong> Crafting the real ales, craft beers, and gins featured on our bar taps and spirit shelf.</li></ul><p>By keeping our supply chain short and local, we support neighboring farm businesses while ensuring our diners enjoy maximum flavor and freshness in every meal.</p>",
          excerpt:
            "A deep dive into our farm-to-table culinary philosophy and our partnerships with local growers.",
          postType: "blog",
          readTime: "5 min read",
        },
        order: 0,
      },
    ],
  },
];

// 5. Customer Enquiries Data (51 live customer enquiries)
const enquiriesData = [
  {
    id: "cmuu46hgk000pzt38fw4uhuoo",
    name: "Jo-Ann Wheble",
    email: "jowheble@sky.com",
    interestedIn: "Christmas Day",
    budget: null,
    projectGoals:
      "Can you please advise if you have a table for four people during the first sitting on Christmas Day?\n\nPreferred Date: 2026-12-25",
    createdAt: "2026-10-04T17:48:06.428Z",
  },
  {
    id: "cmuu2wqhb000ozt38ncy0s6um",
    name: "Laura Gorse-Burton",
    email: "laura@gorse.org.uk",
    interestedIn: "Christmas Day",
    budget: null,
    projectGoals:
      "Hi there. Do you still have availability for Christmas Day? First sitting ideally. \n\nWe are 4 adults and 2 children. \n\nHowever 2 adults preferably would like smaller portions (1 myself has had a gastric sleeve so can only eat small portions and the other has had a stroke and now has a small appetite). No worries if not possible just a shame for the waste. \n\nWe’ve never visited your pub before but as we don’t live far away we can’t believe we haven’t been! \n\nMany thanks\n\nLaura \n\nPreferred Date: 2026-12-25",
    createdAt: "2026-10-04T17:12:31.942Z",
  },
  {
    id: "cmuthfe4f000nzt38dqfiqtpa",
    name: "Alison Godwin",
    email: "alisongodwin1@hotmail.com",
    interestedIn: "Private Event Enquiry",
    budget: null,
    projectGoals:
      "How much do you charge for a Christmas meal in the Barn? We are an NHS team who did this a couple of years ago and it was great",
    createdAt: "2026-10-04T07:11:10.806Z",
  },
  {
    id: "cmur9hlpd000mzt38yjjobt7s",
    name: "Rijaab Aashir",
    email: "rijaabakhtar@gmail.com",
    interestedIn: "General Question",
    budget: null,
    projectGoals: "Hi,\n\nDo you serve halal meat? \n\n",
    createdAt: "2026-10-02T17:53:24.672Z",
  },
  {
    id: "cmupyb3z7000lzt38dbflxwhy",
    name: "Julia Nisbet-Fahy",
    email: "julianisbet@hotmail.com",
    interestedIn: "Christmas Day",
    budget: null,
    projectGoals:
      "Hello, we would love to join your for Christmas lunch but when we tried to book online it did not show the noon sitting. There are two of us so we would be pleased to know if we can book and how to pay.\nMany thanks\nJulia\n\nPreferred Date: 2026-12-25",
    createdAt: "2026-10-01T19:52:39.907Z",
  },
  {
    id: "cmuppsi6t000kzt3833n7r27u",
    name: "Pat Chapman-Pincher",
    email: "patcp@patchapmanpincher.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals: "Sunday lunch 4th October 3 people ",
    createdAt: "2026-10-01T15:54:14.857Z",
  },
  {
    id: "cmulcuwyq000jzt3862sskg39",
    name: "Susan",
    email: "davies.598@btinternet.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Please may I book a table for tomorrow Tuesday Sept 29 at 12.30 for 2 people \nThank you",
    createdAt: "2026-09-28T14:41:07.511Z",
  },
  {
    id: "cmuk3r5bo000izt38jfvvz220",
    name: "Victoria Attewell",
    email: "vixattewell@outlook.com",
    interestedIn: "Christmas Day",
    budget: null,
    projectGoals:
      "Early seating (12pm) booking for x6 adults and x4 children \n\nPreferred Date: 2026-12-25",
    createdAt: "2026-09-27T17:38:29.080Z",
  },
  {
    id: "cmuikla5j000hzt38kgud5exo",
    name: "Helen",
    email: "sansom5@hotmail.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Hi, I had an enquiry about the thali night 15th October, I was looking for two diners but one would be a vegan (and the other not) would a vegan thali be an option?\nMany thanks\nHelen",
    createdAt: "2026-09-26T15:54:16.526Z",
  },
  {
    id: "cmuibndps000gzt38ybna57t3",
    name: "Anne Lee ",
    email: "annelee4@sky.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Hi, I  notice that to have the Xmas menu there should be 8 people. We are 3 friends who would like the Christmas menu at a lunchtime. Is this at all possible??. Best wishes.  Anne \n\nPreferred Date: 2026-12-16",
    createdAt: "2026-09-26T11:43:57.898Z",
  },
  {
    id: "cmufp0l38000fzt38jsjq2qqg",
    name: "Catherine Cockfield",
    email: "catherine.cockfield@oxfordhealth.nhs.uk",
    interestedIn: "General Question",
    budget: null,
    projectGoals:
      "Hi,  I’m booked in for a Christmas meal on 8th December, as part of a booking by Claire Elms.  I have numerous allergies, so please could you provide me with the allergens list for the Festive Menu.\nMany thanks,\nCatherine",
    createdAt: "2026-09-24T15:34:50.482Z",
  },
  {
    id: "cmufghjyl000ezt383jmzxjnw",
    name: "Claire Elms",
    email: "claire.elms@oxfordhealth.nhs.uk",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Hi this is to follow up on an earlier message sent in August to confirm reservation for 13 for Oxford Health Performance and Information team.  Please can you forward to Christmas Menu and reply to my August enquiry.  Claire Elms",
    createdAt: "2026-09-24T11:36:05.698Z",
  },
  {
    id: "cmue6lrze000dzt384tldwtqz",
    name: "victoria marsh",
    email: "Victoria.Marsh@hachette.co.uk",
    interestedIn: "Christmas Party",
    budget: null,
    projectGoals:
      "Please can you let me know if you have availability for a Christmas menu for 15 people on the 09.12.26 as about 12.30 Thanks   \n\nPreferred Date: 2026-12-09",
    createdAt: "2026-09-23T14:11:40.294Z",
  },
  {
    id: "cmuco3avy000czt38s36pn0td",
    name: "Shelley",
    email: "blondeshells@hotmail.com",
    interestedIn: "Christmas Day",
    budget: null,
    projectGoals:
      "Hello, \nWe are interested in dining with you for Christmas Day. A table of 8 would be required. Could you please advise if there is any service charge, deposit required etc. Many thanks! \n\nPreferred Date: 2026-12-25",
    createdAt: "2026-09-22T12:45:37.608Z",
  },
  {
    id: "cmu8v8qog0009zt38ewouz5gl",
    name: "Isabelle Terry",
    email: "isabelle.terry@icloud.com",
    interestedIn: "Christmas Party",
    budget: null,
    projectGoals:
      "Looking to book a table for 10 people please! 1330 if possible please?\nWith grateful thanks,\nIzzy and Luke\n\nPreferred Date: 2026-12-13",
    createdAt: "2026-09-19T20:54:45.073Z",
  },
  {
    id: "cmu87h9cw0008zt382gpjx1mc",
    name: "Tina wei",
    email: "tinaw.wr@gmail.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Hi,\nI would like to book a table for 3 at 12:10 noon on Sunday 20th (tomorrow) please?\n\nThanks, Tina",
    createdAt: "2026-09-19T09:49:31.726Z",
  },
  {
    id: "cmu5sebdo0007zt38r13tm9oe",
    name: "Sue Brown",
    email: "suey59@outlook.com",
    interestedIn: "General Enquiry",
    budget: null,
    projectGoals: "",
    createdAt: "2026-09-17T17:11:48.176Z",
  },
  {
    id: "cmu5sdpla0006zt38u4etj4g8",
    name: "Suzanne Brown",
    email: "uksupplies@hotmail.com",
    interestedIn: "Christmas Day",
    budget: null,
    projectGoals:
      "Could I book a table for three on Christmas Day for the first sitting ",
    createdAt: "2026-09-17T17:11:19.940Z",
  },
  {
    id: "cmu469dwx0005zt38houwwn5v",
    name: "Jade Pitson",
    email: "jade@1to1care.co.uk",
    interestedIn: "Christmas Party",
    budget: null,
    projectGoals:
      "Would it be possible to book our works Christmas party for 18 people at 2pm please?\n\nPreferred Date: 2026-12-07",
    createdAt: "2026-09-16T14:04:20.455Z",
  },
  {
    id: "cmu39sf9c0004zt38czns1ayf",
    name: "Michael P Cook",
    email: "cowleyoxford05@yahoo.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Can we book a table for tomorrow 16 September at 7.30pm for 4 people please. Regards Michael ",
    createdAt: "2026-09-15T22:55:21.333Z",
  },
  {
    id: "cmu2fyfpl0003zt388zvbe36t",
    name: "Rebecca",
    email: "beccaknowles@yahoo.co.uk",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Please could I book a table for 4 people on the 29th October for the Thali evening, at 7.30pm? Thank you! ",
    createdAt: "2026-09-15T09:00:13.370Z",
  },
  {
    id: "cmu150crs0002zt38rg3aqt2b",
    name: "Paige Stephens",
    email: "paige.stephens@lhh.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals: "5 people\nThurs 8th October\n12:30pm",
    createdAt: "2026-09-14T11:06:00.927Z",
  },
  {
    id: "cmu00u88i0001zt38t6696t5m",
    name: "Catherine Semmence",
    email: "c.semmence@yahoo.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Hi can we please book a table for 7 people (one of the guests will be a high chair).\n\nThank you ",
    createdAt: "2026-09-13T16:21:30.476Z",
  },
  {
    id: "cmtzwt26z0000zt38bf0uytia",
    name: "Lynch Family",
    email: "davidandmikhaela@gmail.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Hello!  We are a multi-generational family from Canada coming to spend Christmas in Marsh Baldon.  We are looking to book a table for 13 people: 8 adults and 5 children, ranging in age from five to nine.  As for dietary concerns, my parents will come in to talk to you about their requirements.  They are already in Marsh Baldon.\n\nPreferred Date: 2026-12-23",
    createdAt: "2026-09-13T14:28:37.523Z",
  },
  {
    id: "cmtx6m28p0000ztu34sizrk5c",
    name: "TeamkTGT",
    email: "hello@test.com",
    interestedIn: "Christmas Party",
    budget: null,
    projectGoals:
      "Hi, this is a test. If you receive this email, please let me know.\nThank You\n\nPreferred Date: 2026-09-10",
    createdAt: "2026-09-11T16:39:48.697Z",
  },
  {
    id: "cmtx6gbvn0000zte1hsvzdgd8",
    name: "Team",
    email: "hello@test.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals: "ff",
    createdAt: "2026-09-11T16:35:21.178Z",
  },
  {
    id: "cmtx62vi90000ztfqhs6cx54y",
    name: "Ayush",
    email: "ayushkushwaha381@gmail.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals: "sasasa",
    createdAt: "2026-09-11T16:24:53.433Z",
  },
  {
    id: "cmtx3pfzz0013zt2okvx1sqqw",
    name: "Jennah Brain",
    email: "jennah_jones@hotmail.com",
    interestedIn: "Private Event Enquiry",
    budget: null,
    projectGoals:
      "Hi im looking somewhere to hot my grandads 75th birthday where we would like a private room and a sit down meal. There will be approximately 25 of us. Is this something you could support with and provide prices/ options please. We chose your location as my grandad was brought up in Nuneham Courtenay/ Marsh Baldon so would be a nice venue.",
    createdAt: "2026-09-11T15:18:27.573Z",
  },
  {
    id: "cmtwyaekg0004ylm0r8hts81w",
    name: "Sudeesh Kumar",
    email: "sude8920esh@gmail.com",
    interestedIn: "Christmas Party",
    budget: null,
    projectGoals: "sgsdg\n\nPreferred Date: 2026-09-28",
    createdAt: "2026-09-11T12:46:47.624Z",
  },
  {
    id: "cmtwy732z0003ylm0taoyky0m",
    name: "Verification User",
    email: "verification@example.com",
    interestedIn: "Private Event",
    budget: "£500",
    projectGoals: "Testing post-fix delivery",
    createdAt: "2026-09-11T12:44:09.171Z",
  },
  {
    id: "cmtwy62u10002ylm0thehcb5k",
    name: "Sudeesh Kumar",
    email: "sude8920esh@gmail.com",
    interestedIn: "Christmas Party",
    budget: null,
    projectGoals: "ddg\n\nPreferred Date: 2026-10-06",
    createdAt: "2026-09-11T12:43:25.830Z",
  },
  {
    id: "cmtwy5hhe0001ylm0o7ni83j4",
    name: "Test Form",
    email: "test@example.com",
    interestedIn: "Pub Table Booking",
    budget: "N/A",
    projectGoals: "Testing enquiry fix",
    createdAt: "2026-09-11T12:42:58.208Z",
  },
  {
    id: "cmtwy0usy0000ylm0rnmxpnvl",
    name: "LALIT SHARMA",
    email: "Test@gmail.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals: "This is test\n\nPreferred Date: 2026-10-05",
    createdAt: "2026-09-11T12:39:21.249Z",
  },
  {
    id: "cmtwu447j0012zt2oxb3np6ce",
    name: "Janine Jenkins ",
    email: "janine_wolfe@hotmail.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals: "Sunday 12.30 for 4 adults including 1x wheelchair user. ",
    createdAt: "2026-09-11T10:49:55.562Z",
  },
  {
    id: "cmtwtmz8k0000kx0458ntcj96",
    name: "Test Christmas User",
    email: "test@example.com",
    interestedIn: "General Enquiry",
    budget: null,
    projectGoals: "",
    createdAt: "2026-09-11T10:36:36.299Z",
  },
  {
    id: "cmtwtkcq00001l304fateshpr",
    name: "Sudeesh Kumar",
    email: "Test@gmail.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals: "This is Dummy\n\nPreferred Date: 2026-09-10",
    createdAt: "2026-09-11T10:34:33.812Z",
  },
  {
    id: "cmtwthjzv0000l304mdbgaya8",
    name: "Test Bot",
    email: "test@example.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals: "",
    createdAt: "2026-09-11T10:32:23.263Z",
  },
  {
    id: "cmtwlgbm60011zt2o6hgwtqr7",
    name: "Namit Julka",
    email: "namitjulka@gmail.com",
    interestedIn: "Private Event Enquiry",
    budget: null,
    projectGoals: "Ban",
    createdAt: "2026-09-11T06:47:28.974Z",
  },
  {
    id: "cmtviwln60010zt2ow6zqb3qt",
    name: "sarah metcalf",
    email: "sarahbrightwell55@icloud.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "We have a reservation for 4 for lunch on Friday 11.  Just to let you know that we will be bringing a small, well-behaved dog with us.",
    createdAt: "2026-09-10T12:48:23.367Z",
  },
  {
    id: "cmtvgylih000zzt2o76j0gu9r",
    name: "Ayush Kushwaha",
    email: "ayushkushwaha381@gmail.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals: "Testing",
    createdAt: "2026-09-10T11:53:57.353Z",
  },
  {
    id: "cmtvd1zi7000yzt2ob16w3w8u",
    name: "Namit Julka",
    email: "namitjulka@gmail.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals: "Hi",
    createdAt: "2026-09-10T10:04:36.913Z",
  },
  {
    id: "cmtvc2d2w0000l0049ll9xu0u",
    name: "Ravi",
    email: "ebrandpromotech3@gmail.com",
    interestedIn: "Christmas Party",
    budget: null,
    projectGoals:
      "I want 5 persons table researve\n\nPreferred Date: 2026-12-11",
    createdAt: "2026-09-10T09:36:54.817Z",
  },
  {
    id: "cmtuhjcod000tzt2o3nb68npj",
    name: "SUNIT BANSODE",
    email: "info@sevenstarsatmb.co.uk",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals: "hhh",
    createdAt: "2026-09-09T19:22:19.501Z",
  },
  {
    id: "cmtuhfx17000szt2o8t9uctfj",
    name: "namit julka",
    email: "namitjulka@gmail.com",
    interestedIn: "Private Event Enquiry",
    budget: null,
    projectGoals: "sfsvf",
    createdAt: "2026-09-09T19:19:39.187Z",
  },
  {
    id: "cmtucij5p000rzt2oeenyvwun",
    name: "Sue",
    email: "suecundy@gmail.com",
    interestedIn: "General Question",
    budget: null,
    projectGoals:
      "Hi, I'm unable to open or download your Christmas Menus.  I've tried on three separate devices without success.",
    createdAt: "2026-09-09T17:01:42.714Z",
  },
  {
    id: "cmtr9n1ht000qzt2oduj697wh",
    name: "nicolle ",
    email: "nicolle811@outlook.com",
    interestedIn: "General Question",
    budget: null,
    projectGoals:
      "hi, I'm just wondering when we can book book a table for a family of 7 to eat on  Christmas Day? and whether its a set menu/price per person?  ",
    createdAt: "2026-09-07T13:17:56.100Z",
  },
  {
    id: "cmtobli7c000pzt2o0pk2jzu6",
    name: "Rebecca Knowles",
    email: "beccaknowles@yahoo.co.uk",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Hi, please could I book a table for 4 people for the Desi Thali evening on 29th October, for 7.30pm? Thank you 🙏🏻 ",
    createdAt: "2026-09-05T11:49:25.225Z",
  },
  {
    id: "cmtlwdd0c000czt2odm0kw44w",
    name: "Marie Bradley",
    email: "marie.abbo@ntlworld.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Can I please book a table for 2 on Sunday ? On the small round table by the toilets if possible ? \nI have tried to telephone you,  but there seems to be a problem getting through. \nKind Regards Marie Bradley \nMobile 0779 089 2428  can you please confirm my booking. Many thanks ",
    createdAt: "2026-09-03T19:07:38.575Z",
  },
  {
    id: "cmtcywvyy0008zt2otql46gbz",
    name: "Claire",
    email: "claire.elms@oxfordhealth.nhs.uk",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Christmas Party NHS P&I Team Christmas Lunch 08/12/26 - Further to the message just sent the preliminary numbers have risen to 14 apologies.",
    createdAt: "2026-08-28T13:08:53.338Z",
  },
  {
    id: "cmtcyuu8w0007zt2owr9m3zbx",
    name: "Claire Elms",
    email: "claire.elms@oxfordhealth.nhs.uk",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Good Afternoon\nWe have celebrated our team Christmas Lunch with you the past few years and would like to do the same this year initial numbers are 13 please can you send me the Christmas menu and we will provide selections and full payment for food in advance.  I would also like to enquire if the 10% NHS discount will be applied to the overall food bill.  All drinks will be paid for on the day by individually.  If you could send the menu with costing and allergens at your earliest opportunity we will return by the date you advise.",
    createdAt: "2026-08-28T13:07:17.714Z",
  },
  {
    id: "cmtbdbvic0006zt2ooddbfp7y",
    name: "Annemarie wren",
    email: "annemariewren999@hotmail.com",
    interestedIn: "Table Reservation",
    budget: null,
    projectGoals:
      "Hiya, I thought I had booked a table for 2 on the 2nd Sept at 1200, but I don't think I have received confirmation. Please can you check? Many thanks. Annemarie.",
    createdAt: "2026-08-27T10:16:54.774Z",
  },
];

async function main() {
  console.log("🌱 Database seeding started...");
  console.log("📦 Loaded seed data:");
  console.log("   - Users: " + usersData.length);
  console.log("   - GlobalConfig: " + (globalConfigData ? "Present" : "None"));
  console.log("   - NavLinks: " + navLinksData.length);
  console.log("   - Pages: " + pagesData.length);
  console.log("   - Enquiries: " + enquiriesData.length);

  // Clean existing database records
  console.log("\n🧹 Cleaning existing database records...");
  await prisma.section.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.navLink.deleteMany({});
  await prisma.globalConfig.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.enquiry.deleteMany({});
  console.log("✅ Cleared previous records.");

  // 1. Seed Users
  console.log("\n👤 Seeding admin user...");
  for (const u of usersData) {
    const password = u.password || (await bcrypt.hash("1234asdf@", 10));
    await prisma.user.create({
      data: {
        id: u.id,
        name: u.name || "Admin",
        email: u.email,
        password: password,
      },
    });
    console.log("  └─ Created user: " + u.email);
  }

  // 2. Seed Global Configuration
  console.log("\n⚙️ Seeding global config...");
  if (globalConfigData) {
    await prisma.globalConfig.create({
      data: globalConfigData,
    });
    console.log(`  └─ Created global config: "${globalConfigData.siteTitle}"`);
  }

  // 3. Seed Navigation Links
  console.log("\n🔗 Seeding navigation links...");
  const parentLinks = navLinksData.filter((n) => n.parent === "-" || !n.parent);
  const subLinks = navLinksData.filter((n) => n.parent && n.parent !== "-");

  for (const link of parentLinks) {
    await prisma.navLink.create({
      data: {
        id: link.id,
        label: link.label,
        url: link.url,
        type: link.type || "Main Link",
        parent: link.parent || "-",
        order: link.order || 0,
        description: link.description || null,
        title: link.title || null,
        isStatic: Boolean(link.isStatic),
      },
    });
    console.log(`  └─ Created parent link: "${link.label}" (${link.url})`);
  }

  for (const link of subLinks) {
    await prisma.navLink.create({
      data: {
        id: link.id,
        label: link.label,
        url: link.url,
        type: link.type || "Sub-link",
        parent: link.parent,
        order: link.order || 0,
        description: link.description || null,
        title: link.title || null,
        isStatic: Boolean(link.isStatic),
      },
    });
    console.log(
      `  └─ Created sub-link: "${link.label}" -> parent [${link.parent}]`,
    );
  }
  console.log(`✅ Seeded ${navLinksData.length} navigation links.`);

  // 4. Seed Pages and Sections
  console.log("\n📄 Seeding pages and layout sections...");
  for (const p of pagesData) {
    const { sections = [], ...pageData } = p;

    await prisma.page.create({
      data: {
        ...pageData,
        sections: {
          create: sections.map((s) => ({
            id: s.id,
            type: s.type,
            content: s.content,
            order: s.order || 0,
          })),
        },
      },
    });
    console.log(
      `  └─ Created page: "${p.title || p.slug}" (/${p.slug}) with ${sections.length} sections`,
    );
  }
  console.log(`✅ Seeded ${pagesData.length} pages.`);

  // 5. Seed Enquiries
  console.log("\n📬 Seeding customer enquiries...");
  if (enquiriesData.length > 0) {
    const formattedEnquiries = enquiriesData.map((e) => ({
      id: e.id,
      name: e.name,
      email: e.email,
      interestedIn: e.interestedIn || null,
      budget: e.budget || null,
      projectGoals: e.projectGoals || null,
      createdAt: e.createdAt ? new Date(e.createdAt) : new Date(),
    }));

    await prisma.enquiry.createMany({
      data: formattedEnquiries,
    });
    console.log(`✅ Seeded ${enquiriesData.length} customer enquiries.`);
  }

  console.log("\n🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
