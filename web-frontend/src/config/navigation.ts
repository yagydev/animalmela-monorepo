export interface NavItem {
  name: string;
  path: string;
  icon?: string;
  description?: string;
  children?: NavItem[];
  cta?: boolean;          // Call-to-action highlighting
  highlight?: boolean;    // Visually important item
  roles?: ('guest' | 'farmer' | 'vendor')[]; // Access visibility
}

export interface NavigationConfig {
  unified: NavItem[];
  footer: NavItem[];
}

export const navigationConfig: NavigationConfig = {
  unified: [
    {
      name: "Home",
      path: "/",
      icon: "🏠",
      description: "Dashboard and highlights",
      roles: ["guest", "farmer", "vendor"]
    },
    {
      name: "Events",
      path: "/events",
      icon: "🚜",
      description: "Agricultural fairs and exhibitions",
      roles: ["guest", "farmer", "vendor"],
      children: [
        { 
          name: "Upcoming Melas", 
          path: "/events/upcoming", 
          description: "Next agricultural fairs",
          roles: ["guest", "farmer", "vendor"]
        },
        { 
          name: "Past Highlights", 
          path: "/events/past", 
          description: "Previous event galleries",
          roles: ["guest", "farmer", "vendor"]
        },
        { 
          name: "Photo Gallery", 
          path: "/events/gallery", 
          description: "Event photos and videos",
          roles: ["guest", "farmer", "vendor"]
        },
        // Farmer's call-to-action event
        { 
          name: "Join Mela", 
          path: "/events/register", 
          icon: "🎪", 
          description: "Register for upcoming events", 
          roles: ["farmer"], 
          cta: true, 
          highlight: true 
        }
      ]
    },
    {
      name: "Marketplace",
      path: "/marketplace",
      icon: "🛒",
      description: "Buy and sell agricultural products",
      roles: ["guest", "farmer", "vendor"],
      children: [
        { 
          name: "Browse All", 
          path: "/marketplace", 
          description: "All marketplace listings",
          roles: ["guest", "farmer", "vendor"]
        },
        { 
          name: "Agricultural Equipment", 
          path: "/marketplace/equipment", 
          icon: "🚜",
          description: "Farm machinery, tools, and equipment",
          roles: ["guest", "farmer", "vendor"]
        },
        { 
          name: "Livestock & Cattle", 
          path: "/marketplace/livestock", 
          icon: "🐄",
          description: "Cattle, poultry, and farm animals",
          roles: ["guest", "farmer", "vendor"]
        },
        { 
          name: "Agricultural Produce", 
          path: "/marketplace/product", 
          icon: "🌾",
          description: "Fresh fruits, vegetables, grains",
          roles: ["guest", "farmer", "vendor"]
        },
        { 
          name: "Buy Seeds & Tools", 
          path: "/marketplace/buy", 
          icon: "🛍️",
          description: "Quality seeds and equipment",
          roles: ["guest", "farmer", "vendor"]
        },
        { 
          name: "Sell Items", 
          path: "/marketplace/sell", 
          icon: "💰", 
          description: "List your agricultural items", 
          roles: ["farmer"], 
          highlight: true,
          cta: true
        },
        { 
          name: "Organic Products", 
          path: "/marketplace/organic", 
          icon: "🌿",
          description: "Certified organic products",
          roles: ["guest", "farmer", "vendor"]
        }
      ]
    },
    {
      name: "Training & Learning",
      path: "/training",
      icon: "📚",
      description: "Educational resources and workshops",
      roles: ["farmer", "guest"],
      children: [
        { 
          name: "Workshops", 
          path: "/training/workshops", 
          description: "Hands-on training",
          roles: ["farmer", "guest"]
        },
        { 
          name: "Subsidy Guidance", 
          path: "/training/subsidies", 
          description: "Government schemes",
          roles: ["farmer", "guest"]
        },
        { 
          name: "Agri Tech Updates", 
          path: "/training/tech", 
          description: "New farming technology",
          roles: ["farmer", "guest"]
        },
        { 
          name: "My Progress", 
          path: "/training/progress", 
          description: "Track your learning", 
          roles: ["farmer"],
          highlight: true 
        },
        { 
          name: "Subsidy Tracking", 
          path: "/training/subsidies/tracking", 
          description: "Monitor applications",
          roles: ["farmer"]
        }
      ]
    },
    {
      name: "Vendors",
      path: "/vendors",
      icon: "🏪",
      description: "Vendor tools and participation",
      roles: ["vendor"],
      children: [
        { 
          name: "Book Stall / Advertise", 
          path: "/vendors/book-stall", 
          description: "Reserve exhibition space", 
          roles: ["vendor"],
          cta: true, 
          highlight: true 
        },
        { 
          name: "Upload Catalog", 
          path: "/vendors/catalog", 
          description: "Manage listings",
          roles: ["vendor"]
        },
        { 
          name: "Analytics Dashboard", 
          path: "/vendors/dashboard", 
          description: "Performance metrics",
          roles: ["vendor"]
        }
      ]
    },
    {
      name: "News & Blogs",
      path: "/news",
      icon: "📰",
      description: "Latest agricultural news and stories",
      roles: ["guest", "farmer", "vendor"],
      children: [
        { 
          name: "Farmer Stories", 
          path: "/news/farmer-stories", 
          description: "Success stories",
          roles: ["guest", "farmer", "vendor"]
        },
        { 
          name: "Innovation Hub", 
          path: "/news/innovation", 
          description: "Research and innovation",
          roles: ["guest", "farmer", "vendor"]
        }
      ]
    },
    {
      name: "Contact",
      path: "/contact",
      icon: "📞",
      description: "Get in touch with us",
      roles: ["guest", "farmer", "vendor"]
    }
  ],

  footer: [
    { name: "About Kisan Mela", path: "/about", description: "Our mission" },
    { name: "Privacy Policy", path: "/privacy", description: "Data protection" },
    { name: "Terms of Use", path: "/terms", description: "Usage terms" },
    { name: "Partner with Us", path: "/partners", description: "Partnership opportunities" },
    { name: "Support", path: "/support", description: "Help center" },
    { name: "Press Kit", path: "/press", description: "Media resources" }
  ]
};

export default navigationConfig;