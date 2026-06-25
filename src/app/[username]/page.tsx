"use client";

import React, { useState, useMemo, use } from "react";
import Image from "next/image";
import { notFound, useSearchParams } from "next/navigation";

import { RESTAURANTS } from "../data/restaurants";
import {
  Star,
  MapPin,
  ShoppingBag,
  Plus,
  Minus,
  Search,
  CheckCircle,
  Clock,
  Phone,
  Info,
  ThumbsUp,
  UserCheck,
  UserPlus,
  Share2,
  Calendar,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface PageProps {
  params: Promise<{ username: string }>;
}

// Mock reviews data to simulate actual client ratings
const MOCK_REVIEWS_MAP: { [key: number]: Array<{ author: string; date: string; stars: number; text: string; avatar: string }> } = {
  1: [
    { author: "Ariful Islam", date: "2 days ago", stars: 5, text: "The Smoked BBQ Bacon Burger is absolutely massive! The preparation was super fast, and the sauce is stellar.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" },
    { author: "Nusrat Jahan", date: "1 week ago", stars: 5, text: "Great digital ordering experience. Scan, click, and food arrives in minutes. The Truffle Fries are to die for!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" },
    { author: "Tahmid Rahman", date: "3 weeks ago", stars: 4, text: "Solid burgers and fresh Mint Lemonade. Really liked the automated table routing system.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" }
  ],
  2: [
    { author: "Sabrina Chowdhury", date: "1 day ago", stars: 5, text: "Hands down the best Truffle Mushroom Pizza in town! Cozy vibes and fast table service.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80" },
    { author: "Rashedul Amin", date: "5 days ago", stars: 5, text: "Authentic Carbonara. Creamy, rich, and cured pancetta was perfectly crispy. 10/10 recommendation.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" },
    { author: "Mariya Sultana", date: "2 weeks ago", stars: 4, text: "Beautiful Margerita and great Tiramisu. Perfect spot for family dinners.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80" }
  ],
  3: [
    { author: "Kazi Ashraful", date: "3 days ago", stars: 5, text: "The Dragon Sushi Roll is a work of art. Melt-in-your-mouth eel. Will definitely order again.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" },
    { author: "Sonia Mirza", date: "1 week ago", stars: 5, text: "Phenomenal Tonkotsu Ramen broth. Super rich and deep flavor. Highly clean and premium sushi bar.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" },
    { author: "Adnan Sami", date: "1 month ago", stars: 5, text: "Top notch Japanese food in Banani. Sake was warm and matcha ice cream was extremely premium.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" }
  ],
  4: [
    { author: "Fahim Shahriar", date: "4 days ago", stars: 5, text: "Outstanding Sichuan wontons! The chilli oil is spicy, numbing, and has a sweet tang. Incredible flavor.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" },
    { author: "Anika Bushra", date: "1 week ago", stars: 4, text: "Very tasty Kung Pao chicken and silken mapo tofu. Fast turnaround for lunch hours.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80" },
    { author: "Imran Hasan", date: "3 weeks ago", stars: 5, text: "Best place for authentic Chinese food lovers. Steamed jasmine rice is extremely fragrant.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" }
  ]
};

export default function RestaurantMenuPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table") || "12";

  // Find the restaurant by username slug
  const restaurant = useMemo(() => {
    return RESTAURANTS.find(
      (r) => r.username.toLowerCase() === username.toLowerCase()
    );
  }, [username]);

  // Handle page-level 404 fallback
  if (!restaurant) {
    notFound();
  }

  // Active Tab state (Facebook profile style: Menu, About, Reviews)
  const [activeTab, setActiveTab] = useState<"menu" | "about" | "reviews">("menu");

  // Follower interaction states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(parseInt(restaurant.reviews) * 3 + 245);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Cart state: Record of item id to quantity
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Trigger Toast notifications
  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  // Copy Profile Link Share
  const handleShareProfile = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        triggerToast("Link copied to clipboard! Share it with your friends.");
      })
      .catch(() => {
        triggerToast("Failed to copy link.");
      });
  };

  // Extract menu categories dynamically
  const categories = useMemo(() => {
    const cats = new Set(restaurant.menuItems.map((item) => item.category));
    return ["All", "Popular", ...Array.from(cats)];
  }, [restaurant]);

  // Dynamic review comments list
  const reviewsList = useMemo(() => {
    return MOCK_REVIEWS_MAP[restaurant.id] || [];
  }, [restaurant]);

  // Filter menu items by active tab category and search term
  const filteredItems = useMemo(() => {
    return restaurant.menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Popular" && item.popular) ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [restaurant, searchQuery, selectedCategory]);

  // Cart operations
  const addToCart = (itemId: number) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[itemId] <= 1) {
        delete updated[itemId];
      } else {
        updated[itemId] -= 1;
      }
      return updated;
    });
  };

  // Cart Summary details
  const cartItemsList = useMemo(() => {
    return Object.keys(cart).map((idStr) => {
      const id = parseInt(idStr);
      const item = restaurant.menuItems.find((m) => m.id === id)!;
      return {
        item,
        quantity: cart[id],
      };
    }).filter(entry => entry.item !== undefined);
  }, [cart, restaurant]);

  const totalItems = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cartItemsList.reduce(
      (sum, entry) => sum + entry.quantity * entry.item.price,
      0
    );
  }, [cartItemsList]);

  // Trigger simulated order submission
  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setCart({});
    setIsCartExpanded(false);
    triggerToast(`Order placed successfully for Table #${tableNumber}!`);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col font-sans antialiased pb-0 select-none text-neutral-800">
      {/* Sticky Header */}


      {/* Main Content Layout Container */}
      <main className="flex-1 w-full flex flex-col">

        {/* Facebook Style Cover Photo Card Container */}
        <div className="w-full bg-[#f0f2f5] border-b border-neutral-200 shadow-sm">
          <div className="max-w-6xl mx-auto relative">
            {/* Cover image wrap */}
            <div className="relative w-full h-[180px] sm:h-[300px] md:h-[350px] overflow-hidden bg-neutral-200 md:rounded-b-xl">
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* White info area overlapping cover photo */}
            <div className="bg-white rounded-t-2xl sm:rounded-t-3xl -mt-10 sm:-mt-16 md:-mt-20 pt-3 relative z-10 shadow-md">

              {/* Profile Details Row */}
              <div className="px-6 sm:px-8 pb-6 flex items-center gap-5">

                {/* Left Side: Avatar Profile Image & Text Info */}
                <div className="flex flex-row items-end sm:items-center gap-4 sm:gap-5 text-left">
                  {/* Circular Profile Avatar (Logo) */}
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white bg-white overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] relative flex-shrink-0 -mt-12 sm:-mt-18 md:-mt-22">
                    <Image
                      src={restaurant.logoImage}
                      alt={`${restaurant.name} logo`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 112px, 144px"
                    />
                  </div>

                  {/* Brand details */}
                  <div className="flex flex-col pb-1 min-w-0 relative -top-6 sm:-top-12 gap-1">
                    <h1 className="text-lg sm:text-[22px] font-black text-neutral-900 tracking-tight leading-none truncate">
                      {restaurant.name}
                    </h1>
                    <span className="text-[11px] sm:text-xs text-neutral-500 font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{restaurant.location}</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* Profile Navigation Tabs Bar */}
              <div className="border-t border-neutral-200/80 px-6 sm:px-8 bg-white flex items-center justify-between gap-4 w-full rounded-b-2xl sm:rounded-b-3xl">
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                  {[
                    { id: "menu", label: "Menu Items" },
                    { id: "about", label: "About" }
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative py-3.5 px-3.5 text-xs sm:text-sm font-bold tracking-tight cursor-pointer whitespace-nowrap outline-none transition-colors ${isActive
                            ? "text-emerald-700 font-extrabold"
                            : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
                          }`}
                      >
                        <span>{tab.label}</span>
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-700 rounded-t-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right side search option */}
                <div className="relative flex items-center shrink-0 my-1">
                  <div className="absolute left-3 text-neutral-400 pointer-events-none">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white text-xs font-semibold text-neutral-800 placeholder-neutral-400 pl-9 pr-8 py-1.5 rounded-full border border-neutral-200 focus:border-emerald-600 outline-none w-36 sm:w-48 md:w-56 transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 w-4 h-4 rounded-full bg-neutral-200/50 hover:bg-neutral-200 flex items-center justify-center text-[8px] text-neutral-500 transition-colors"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

        <div className={`w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mt-6 flex flex-col md:flex-row gap-6 items-start ${
          totalItems > 0 ? "pb-48" : "pb-32"
        }`}>

          {/* LEFT SIDEBAR: Intro Card Box */}
          {activeTab !== "menu" && (
            <div className="w-full md:w-[350px] shrink-0 flex flex-col gap-4 text-left">
              {/* Intro Card */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm flex flex-col gap-4">
                <h3 className="text-lg font-black text-neutral-900 tracking-tight leading-none">
                  Intro
                </h3>

                {/* Bio description info */}
                <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                  Welcome to <strong className="text-neutral-800 font-bold">{restaurant.name}</strong> digital menu. Scan our unique QR codes directly at your table to place real-time kitchen orders instantly.
                </p>

                <div className="flex flex-col gap-3.5 border-t border-neutral-100 pt-4 text-xs sm:text-sm font-semibold text-neutral-600">
                  <div className="flex items-center gap-3">
                    <Star className="w-[18px] h-[18px] text-amber-500 fill-amber-500 shrink-0" />
                    <span>
                      Rated <strong className="text-neutral-800 font-bold">{restaurant.rating} Stars</strong> ({restaurant.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-[18px] h-[18px] text-neutral-400 shrink-0" />
                    <span className="truncate">Located at {restaurant.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-[18px] h-[18px] text-neutral-400 shrink-0" />
                    <span>Average preparation time: {restaurant.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="w-[18px] h-[18px] text-emerald-600 shrink-0" />
                    <span>Cuisine type: {restaurant.cuisine}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT SIDE CONTENT: Active Tab details (Menu list, About description, reviews feed) */}
          <div className="flex-grow w-full flex flex-col gap-4 text-left">

            {/* TAB CONTENT: Menu List */}
            {activeTab === "menu" && (
              <div className="flex flex-col gap-4 w-full">


                {/* Food Items List */}
                {filteredItems.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/80 flex flex-col items-center justify-center gap-4 shadow-sm">
                    <Search className="w-12 h-12 text-neutral-300" />
                    <h3 className="text-lg font-bold text-neutral-800 leading-none">No menu items found</h3>
                    <p className="text-xs sm:text-sm text-neutral-500 font-semibold max-w-sm px-6 leading-relaxed">
                      We couldn't find any dishes matching "{searchQuery}" under "{selectedCategory}".
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
                    {filteredItems.map((item) => {
                      const qtyInCart = cart[item.id] || 0;
                      return (
                        <div key={item.id} className="flex flex-col h-full group">
                          {/* Card 1: Details Card (Image, Title, Description) */}
                          <div className="flex-grow flex flex-col bg-white rounded-t-2xl rounded-br-2xl border border-neutral-200/80 border-b-0 shadow-sm hover:shadow-[0_6px_20px_rgba(0,0,0,0.025)] transition-all duration-300">
                            {/* Food Photo Box */}
                            <div className="relative w-full aspect-[4/3] flex-shrink-0 bg-neutral-100 overflow-hidden rounded-t-2xl">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 640px) 180px, 240px"
                              />
                              {item.popular && (
                                <div className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full z-10 shadow-sm">
                                  Popular
                                </div>
                              )}
                            </div>

                            {/* Food Info details */}
                            <div className="flex-grow p-3.5 flex flex-col justify-between">
                              <div>
                                <h4 className="text-sm sm:text-base font-bold text-neutral-900 truncate">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] sm:text-xs text-neutral-500 font-semibold leading-relaxed mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Card 2: Two horizontal cards — Price card & Button card */}
                          <div className="flex gap-1">
                            {/* Price Card — no top gap, flush with details card */}
                            <div className="flex-1 bg-white rounded-b-2xl border border-t-0 border-neutral-200/80 shadow-sm flex items-center justify-center h-10 px-3 group-hover:border-neutral-300 transition-colors duration-300">
                              <span className="text-xs sm:text-sm font-black text-deep-emerald-950">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>

                            {/* Button Card — keeps top gap */}
                            <div className="mt-1 bg-white rounded-xl border border-neutral-200/80 shadow-sm flex items-center justify-center h-10 group-hover:border-neutral-300 transition-colors duration-300">
                              {qtyInCart > 0 ? (
                                <div className="flex items-center gap-1.5 px-2.5">
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="w-5 h-5 rounded-full bg-deep-emerald-900/10 hover:bg-deep-emerald-900/20 text-deep-emerald-950 flex items-center justify-center cursor-pointer transition-colors"
                                  >
                                    <Minus className="w-2.5 h-2.5" />
                                  </button>
                                  <span className="text-xs font-black text-deep-emerald-950 min-w-[14px] text-center">
                                    {qtyInCart}
                                  </span>
                                  <button
                                    onClick={() => addToCart(item.id)}
                                    className="w-5 h-5 rounded-full bg-deep-emerald-950 text-white hover:bg-emerald-900 flex items-center justify-center cursor-pointer transition-all duration-200"
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(item.id)}
                                  className="w-10 h-full flex items-center justify-center bg-transparent text-emerald-700 hover:text-deep-emerald-950 hover:scale-110 transition-all duration-200 cursor-pointer active:scale-95"
                                  title="Add to Cart"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: About Details */}
            {activeTab === "about" && (
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-sm flex flex-col gap-6 w-full">

                {/* Category block */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-neutral-500" />
                    <span>Restaurant Information</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                    Welcome to <strong className="text-neutral-800 font-bold">{restaurant.name}</strong>, where we specialize in serving premium quality {restaurant.cuisine.toLowerCase()} options in {restaurant.location}. Our digital ordering platform enables customers to scan table QR codes to enjoy immediate kitchen preparation status tracking and side payment checkout simulations.
                  </p>
                </div>

                {/* List Details Group */}
                <div className="border-t border-neutral-100 pt-5 flex flex-col gap-4 text-xs sm:text-sm font-semibold text-neutral-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col text-left">
                      <span className="text-neutral-900 font-bold">Address / Location</span>
                      <span className="text-neutral-500 mt-0.5">{restaurant.location}, House 14, Block A, Dhaka</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col text-left">
                      <span className="text-neutral-900 font-bold">Opening Hours</span>
                      <span className="text-neutral-500 mt-0.5">Open Daily: 11:00 AM - 11:30 PM</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col text-left">
                      <span className="text-neutral-900 font-bold">Phone Number</span>
                      <a href="tel:+8801919-760626" className="text-emerald-700 font-bold hover:underline mt-0.5">+8801919-760626</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col text-left">
                      <span className="text-neutral-900 font-bold">Additional Facilities</span>
                      <span className="text-neutral-500 mt-0.5">Air Conditioned, Wifi, Table QR ordering, bKash payments accepted</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: Customer Reviews */}
            {activeTab === "reviews" && (
              <div className="flex flex-col gap-4 w-full">

                {/* Overall Rating card */}
                <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm flex flex-col sm:flex-row items-center gap-6 w-full">
                  <div className="flex flex-col items-center justify-center text-center px-4">
                    <span className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-none">
                      {restaurant.rating}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500 mt-2.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4.5 h-4.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-neutral-400 mt-1.5 uppercase tracking-wider">
                      {restaurant.reviews} ratings
                    </span>
                  </div>

                  <div className="flex-1 w-full flex flex-col gap-2 border-t sm:border-t-0 sm:border-l border-neutral-100 pt-4 sm:pt-0 sm:pl-6 text-left">
                    <h3 className="text-sm sm:text-base font-black text-neutral-950 tracking-tight">
                      Rating Breakdown
                    </h3>
                    {/* Stars bar breakdown */}
                    {[
                      { stars: 5, pct: "85%" },
                      { stars: 4, pct: "10%" },
                      { stars: 3, pct: "4%" },
                      { stars: 2, pct: "1%" },
                      { stars: 1, pct: "0%" }
                    ].map((row) => (
                      <div key={row.stars} className="flex items-center gap-3 w-full text-xs font-semibold text-neutral-500">
                        <span className="w-3 text-right">{row.stars}</span>
                        <div className="flex-grow h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: row.pct }} />
                        </div>
                        <span className="w-8 text-right">{row.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Feed list */}
                <div className="flex flex-col gap-4 w-full">
                  {reviewsList.map((rev, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm flex flex-col gap-3.5 text-left"
                    >
                      {/* Reviewer Header */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-250 relative bg-neutral-100">
                            <img src={rev.avatar} className="object-cover w-full h-full" alt={rev.author} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm font-black text-neutral-900 leading-tight">{rev.author}</span>
                            <span className="text-[10px] font-bold text-neutral-400 mt-0.5">{rev.date}</span>
                          </div>
                        </div>

                        {/* Stars indicator */}
                        <div className="flex items-center gap-0.5 text-amber-500 flex-shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.stars ? "fill-amber-500" : "text-neutral-200 fill-none"}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Comment Text */}
                      <p className="text-xs sm:text-sm text-neutral-600 font-semibold leading-relaxed">
                        "{rev.text}"
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

      </main>

      {/* Floating Bottom Cart Drawer */}
      {totalItems > 0 && (
        <div className={`fixed bottom-0 left-0 right-0 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-3xl z-40 bg-white border-t border-neutral-200/85 md:border-x shadow-[0_-12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 pb-safe ${isCartExpanded ? "rounded-t-[28px]" : "rounded-t-none md:rounded-t-[28px]"
          }`}>
          {/* Inner constraint */}
          <div className="max-w-3xl mx-auto flex flex-col">

            {/* Header/Collapse Handle */}
            <div
              onClick={() => setIsCartExpanded(!isCartExpanded)}
              className="px-6 py-4 flex items-center justify-between border-b border-neutral-100/80 cursor-pointer hover:bg-neutral-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center relative">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-black text-neutral-900">Your Selection</span>
                  <span className="text-[11px] font-semibold text-neutral-500">
                    Subtotal: <span className="text-emerald-700 font-bold">${totalPrice.toFixed(2)}</span>
                  </span>
                </div>
              </div>

              {/* Chevron indicator */}
              <div className="text-neutral-400">
                {isCartExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              </div>
            </div>

            {/* Expandable Cart Items list container */}
            {isCartExpanded && (
              <div className="px-6 py-5 flex flex-col gap-4 max-h-[300px] overflow-y-auto divide-y divide-neutral-50 animate-in slide-in-from-bottom-8 duration-300">
                {cartItemsList.map((entry) => (
                  <div key={entry.item.id} className="flex items-center justify-between pt-3 first:pt-0">
                    <div className="flex flex-col text-left min-w-0 pr-4">
                      <span className="text-sm font-bold text-neutral-900 truncate">
                        {entry.item.name}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600">
                        ${(entry.item.price * entry.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity Selector inside cart */}
                    <div className="flex items-center gap-2.5 bg-neutral-100 rounded-full p-1 border border-neutral-200/40">
                      <button
                        onClick={() => removeFromCart(entry.item.id)}
                        className="w-6 h-6 rounded-full bg-white hover:bg-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-700 cursor-pointer transition-colors"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-neutral-800">
                        {entry.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(entry.item.id)}
                        className="w-6 h-6 rounded-full bg-white hover:bg-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-700 cursor-pointer transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Checkout Actions Area */}
            <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between gap-4">
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Total Bill</span>
                <span className="text-xl font-black text-neutral-950 mt-1">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full sm:w-auto flex-1 sm:flex-initial bg-deep-emerald-950 hover:bg-deep-emerald-850 text-white text-sm font-bold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-98 shadow-md cursor-pointer"
              >
                <span>Confirm & Place Order</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Simulated Successful Checkout modal */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-deep-emerald-950/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full flex flex-col items-center text-center gap-6 shadow-2xl border border-neutral-100 animate-in fade-in zoom-in duration-300">

            {/* Green Animated Checkmark */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center animate-bounce shadow-inner border border-emerald-100">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-black text-neutral-950 tracking-tight leading-tight">
                Order Received!
              </h3>
              <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-1.5 bg-emerald-50/70 px-3 py-1 rounded-full w-fit mx-auto border border-emerald-100/50">
                Table #{tableNumber}
              </p>
              <p className="text-[13px] font-semibold text-neutral-500 leading-relaxed mt-4">
                Your order is confirmed and has been routed to the kitchen display at <strong className="text-neutral-800">{restaurant.name}</strong>. Sit back and relax while your food is prepared!
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setOrderPlaced(false)}
              className="w-full bg-deep-emerald-950 hover:bg-deep-emerald-850 text-white text-sm font-bold py-3 rounded-2xl transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
            >
              Order Something Else
            </button>
          </div>
        </div>
      )}

      {/* Action Toast Notifications overlay */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 bg-deep-emerald-950 text-white border border-deep-emerald-800 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[13.5px] font-bold font-sans">{actionToast}</span>
        </div>
      )}

    </div>
  );
}
