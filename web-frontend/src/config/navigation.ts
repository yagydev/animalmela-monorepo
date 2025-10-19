export interface NavItem {
  name: string;
  path: string;
  icon?: string;
  description?: string;
  children?: NavItem[];
  cta?: boolean;
  highlight?: boolean;
}

export interface NavigationConfig {
  main: NavItem[];
  farmerFlow: NavItem[];
  vendorFlow: NavItem[];
  footer: NavItem[];
}

export const navigationConfig: NavigationConfig = {
  main: [
    {
      name: "Home",
      path: "/",
      icon: "🏠",
      description: "Dashboard and highlights"
    },
    {
      name: "Events",
      path: "/events",
      icon: "🚜",
      description: "Agricultural fairs and exhibitions",
      children: [
        {
          name: "Upcoming Melas",
          path: "/events?filter=upcoming",
          description: "Next agricultural fairs"
        },
        {
          name: "Past Highlights",
          path: "/events?filter=past",
          description: "Previous event galleries"
        },
        {
          name: "Photo Gallery",
          path: "/events/gallery",
          description: "Event photos and videos"
        }
      ]
    },
    {
      name: "Marketplace",
      path: "/marketplace",
      icon: "🛒",
      description: "Buy and sell agricultural products",
      children: [
        {
          name: "Buy Seeds & Tools",
          path: "/marketplace?category=seeds",
          description: "Quality seeds and farming equipment"
        },
        {
          name: "Sell Produce",
          path: "/marketplace/sell",
          description: "List your agricultural products"
        },
        {
          name: "Organic Products",
          path: "/marketplace?category=organic",
          description: "Certified organic products"
        }
      ]
    },
    {
      name: "Training & Learning",
      path: "/training",
      icon: "📚",
      description: "Educational resources and workshops",
      children: [
        {
          name: "Workshops",
          path: "/training/workshops",
          description: "Hands-on training sessions"
        },
        {
          name: "Subsidy Guidance",
          path: "/training/subsidies",
          description: "Government scheme information"
        },
        {
          name: "Agri Tech Updates",
          path: "/training/tech",
          description: "Latest agricultural technology"
        },
        {
          name: "My Progress",
          path: "/training/progress",
          description: "Track your learning journey",
          highlight: true
        },
        {
          name: "Application Tracking",
          path: "/training/subsidies/tracking",
          description: "Monitor subsidy applications"
        }
      ]
    },
    {
      name: "Vendors",
      path: "/vendors",
      icon: "🏪",
      description: "Vendor tools and participation",
      children: [
        {
          name: "Book Stall / Advertise",
          path: "/vendors/book-stall",
          description: "Reserve your exhibition space",
          cta: true,
          highlight: true
        },
        {
          name: "Upload Catalog",
          path: "/vendors/catalog",
          description: "Manage your product listings"
        },
        {
          name: "Analytics Dashboard",
          path: "/vendors/dashboard",
          description: "Track your performance"
        }
      ]
    },
    {
      name: "News & Blogs",
      path: "/news",
      icon: "📰",
      description: "Latest agricultural news and stories",
      children: [
        {
          name: "Farmer Stories",
          path: "/news/farmer-stories",
          description: "Success stories from farmers"
        },
        {
          name: "Innovation Hub",
          path: "/news/innovation",
          description: "Agricultural innovations and research"
        }
      ]
    },
    {
      name: "Contact",
      path: "/contact",
      icon: "📞",
      description: "Get in touch with us"
    }
  ],
  
  farmerFlow: [
    {
      name: "Join Mela",
      path: "/events/register",
      icon: "🎪",
      description: "Register for upcoming events",
      cta: true,
      highlight: true
    },
    {
      name: "Sell Products",
      path: "/marketplace/sell",
      icon: "💰",
      description: "List your agricultural products"
    },
    {
      name: "Learn & Grow",
      path: "/training",
      icon: "🌱",
      description: "Educational resources"
    }
  ],
  
  vendorFlow: [
    {
      name: "Book Stall",
      path: "/vendors/book-stall",
      icon: "🏪",
      description: "Reserve exhibition space",
      cta: true,
      highlight: true
    },
    {
      name: "Upload Catalog",
      path: "/vendors/catalog",
      icon: "📋",
      description: "Manage product listings"
    },
    {
      name: "Analytics",
      path: "/vendors/dashboard",
      icon: "📊",
      description: "Track performance"
    }
  ],
  
  footer: [
    {
      name: "About Kisan Mela",
      path: "/about",
      description: "Our mission and vision"
    },
    {
      name: "Privacy Policy",
      path: "/privacy",
      description: "Data protection and privacy"
    },
    {
      name: "Terms of Use",
      path: "/terms",
      description: "Terms and conditions"
    },
    {
      name: "Partner with Us",
      path: "/partners",
      description: "Become a partner or sponsor"
    },
    {
      name: "Support",
      path: "/support",
      description: "Help and support center"
    },
    {
      name: "Press Kit",
      path: "/press",
      description: "Media resources and downloads"
    }
  ]
};

export default navigationConfig;
