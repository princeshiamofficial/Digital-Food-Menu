"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Header from "./components/Header";

// High-fidelity Product Data replicating the mockup layout exactly
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Phone Holder Sakti",
    category: "Other",
    image: "https://i.imgur.com/yb9UQKL.jpeg",
    rating: "5.0",
    reviews: "1.2k",
    price: "29.90"
  },
  {
    id: 2,
    name: "Headsound",
    category: "Music",
    image: "https://i.imgur.com/yVeIeDa.jpeg",
    rating: "5.0",
    reviews: "1.2k",
    price: "12.00"
  },
  {
    id: 3,
    name: "Adudu Cleaner",
    category: "Other",
    image: "https://i.imgur.com/keVCVIa.jpeg",
    rating: "4.4",
    reviews: "1k",
    price: "29.90"
  },
  {
    id: 4,
    name: "CCTV Maling",
    category: "Home",
    image: "https://i.imgur.com/Qphac99.jpeg",
    rating: "4.8",
    reviews: "120",
    price: "50.00"
  },
  {
    id: 5,
    name: "Stuffsus Peker 32",
    category: "Other",
    image: "https://i.imgur.com/LGk9Jn2.jpeg",
    rating: "5.0",
    reviews: "1.2k",
    price: "9.90"
  },
  {
    id: 6,
    name: "Stuffsus R175",
    category: "Music",
    image: "https://i.imgur.com/YaSqa06.jpeg",
    rating: "4.8",
    reviews: "2.4k",
    price: "34.10"
  },
  // Row 3 (Duplicates representing identical product rails as requested)
  {
    id: 7,
    name: "CCTV Maling",
    category: "Home",
    image: "https://i.imgur.com/3oXNBst.jpeg",
    rating: "4.8",
    reviews: "120",
    price: "50.00"
  },
  {
    id: 8,
    name: "Stuffsus Peker 32",
    category: "Other",
    image: "https://i.imgur.com/w3Y8NwQ.jpeg",
    rating: "5.0",
    reviews: "1.2k",
    price: "9.90"
  },
  {
    id: 9,
    name: "Stuffsus R175",
    category: "Music",
    image: "https://i.imgur.com/ZANVnHE.jpeg",
    rating: "4.8",
    reviews: "2.4k",
    price: "34.10"
  }
];

// Explore recommendations section mock data replicating the user's mockup precisely
const RECOMMENDATION_PRODUCTS = [
  {
    id: 101,
    name: "TWS Bujug",
    category: "Other",
    image: "https://i.imgur.com/jByJ4ih.jpeg",
    rating: "5.0",
    reviews: "1.2k",
    price: "29.90"
  },
  {
    id: 102,
    name: "Headsound Baptis",
    category: "Music",
    image: "https://i.imgur.com/KXj6Tpb.jpeg",
    rating: "5.0",
    reviews: "1.2k",
    price: "12.00"
  },
  {
    id: 103,
    name: "Adudu Cleaner",
    category: "Music",
    image: "https://i.imgur.com/afHY7v2.jpeg",
    rating: "4.4",
    reviews: "1k",
    price: "29.90"
  },
  {
    id: 104,
    name: "Adudu Cleaner Grand Pro",
    category: "Music",
    image: "https://i.imgur.com/OKn1KFI.jpeg",
    rating: "4.9",
    reviews: "950",
    price: "89.90"
  }
];

export default function Home() {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recommendationScrollRef = useRef<HTMLDivElement>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (name: string) =>
    setOpenCategory(prev => (prev === name ? null : name));

  const scrollRecommendations = (direction: "left" | "right") => {
    if (recommendationScrollRef.current) {
      const container = recommendationScrollRef.current;
      const firstChild = container.firstElementChild as HTMLElement;
      if (firstChild) {
        const itemWidth = firstChild.offsetWidth;
        const gap = parseInt(window.getComputedStyle(container).gap) || 16;
        const scrollAmount = direction === "left" ? -(itemWidth + gap) : (itemWidth + gap);
        container.scrollLeft += scrollAmount;
      }
    }
  };

  // Handles real-time search filtering + sidebar clicks
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(activeSearch.toLowerCase());

      if (!selectedSubCategory) return matchesSearch;

      // Categorization links
      if (selectedSubCategory === "Home" && product.category === "Home") return matchesSearch;
      if (selectedSubCategory === "Music" && product.category === "Music") return matchesSearch;
      if (selectedSubCategory === "Phone" && product.category === "Other" && product.name.includes("Phone")) return matchesSearch;
      if (selectedSubCategory === "Storage" && product.category === "Other" && !product.name.includes("Phone")) return matchesSearch;

      return false;
    });
  }, [selectedSubCategory, activeSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-neutral-900 transition-colors duration-300">

      {/* Floating Premium Header sitting above the hero section (Sticky & Overlay) */}
      <div className="sticky top-0 w-full h-0 z-50">
        <Header />
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full pb-0 relative z-10">

        {/* Luxury Hero Card - Full Width (40% Shorter Height on Mobile) */}
        <div className="relative w-full h-[276px] md:h-[600px] overflow-hidden bg-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          {/* Hero Background Image - premium_living_room.png */}
          <Image
            src="/premium_living_room.png"
            alt="Premium Living Room Showcase"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Breathtaking Curated Storefront Grid - Overlapping the Hero Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-20 md:-mt-28 relative z-20 bg-white rounded-[32px] p-6 md:p-10 border border-neutral-100 shadow-[0_25px_60px_rgba(0,0,0,0.03)] flex flex-col gap-6 md:gap-10">

          {/* Store Sub-header with Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
            <h2 className="text-2xl md:text-[32px] font-black tracking-tight text-neutral-950 font-sans">
              Give All You Need
            </h2>

            {/* Elegant Search Container */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-neutral-50 border border-neutral-200/80 rounded-full pl-5 pr-2 py-1.5 w-full md:w-[420px] transition-all duration-300 focus-within:border-neutral-400 focus-within:bg-white shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-neutral-400 mr-2.5 flex-shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search on Stuffsus"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-neutral-800 placeholder-neutral-400 font-medium"
              />
              <button
                type="submit"
                className="bg-neutral-950 hover:bg-neutral-850 text-white rounded-full px-5 py-1.5 text-xs font-extrabold transition-all duration-200 active:scale-95"
              >
                Search
              </button>
            </form>
          </div>

          {/* Layout Split: Sidebar Filter + Product Grid */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* Left Filter Sidebar */}
            <aside className="w-full lg:w-[260px] flex-shrink-0 flex flex-col gap-6">

              <h3 className="text-[19px] font-extrabold tracking-tight text-neutral-950 font-sans">
                Category
              </h3>

              {/* Vertical Menu Tree */}
              <div className="flex flex-col gap-3">

                {/* Active All Product Group */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setSelectedSubCategory(null); setActiveSearch(""); setSearchQuery(""); toggleCategory("allProduct"); }}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl border transition-all duration-300 font-sans ${openCategory === "allProduct" ? 'bg-neutral-50 border-neutral-200/60 text-neutral-950 font-bold shadow-[0_4px_12px_rgba(0,0,0,0.03)]' : 'bg-transparent border-transparent text-neutral-400 font-semibold hover:text-neutral-900'}`}
                  >
                    <div className="flex items-center gap-2.5 text-[14px]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4.5 h-4.5"
                      >
                        <path d="M4 19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10z" />
                        <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                      <span>All Product</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#f43f5e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
                        32
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ transform: openCategory === "allProduct" ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
                        className="w-3.5 h-3.5 text-neutral-400"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  {openCategory === "allProduct" && (
                    <div className="relative pl-8 ml-4 flex flex-col gap-4 py-1">
                      {/* Continuous Tree Trunk Line (No Gaps) */}
                      <div className="absolute left-[14px] top-[-12px] bottom-[24px] w-[1.5px] bg-neutral-200/90"></div>

                      {/* For Home */}
                      <button
                        onClick={() => setSelectedSubCategory("Home")}
                        className={`relative flex items-center gap-2.5 text-[13.5px] w-full text-left transition-all duration-200 pl-2 ${selectedSubCategory === "Home" ? 'text-[#f43f5e] font-bold' : 'text-neutral-500 hover:text-neutral-900 font-semibold'}`}
                      >
                        {/* Tree Branch Tick */}
                        <div className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-[22px] h-[1.5px] bg-neutral-200/90"></div>

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 flex-shrink-0 text-neutral-400"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <rect x="9" y="13" width="6" height="6" rx="1" />
                        </svg>
                        <span>For Home</span>
                      </button>

                      {/* For Music */}
                      <button
                        onClick={() => setSelectedSubCategory("Music")}
                        className={`relative flex items-center gap-2.5 text-[13.5px] w-full text-left transition-all duration-200 pl-2 ${selectedSubCategory === "Music" ? 'text-[#f43f5e] font-bold' : 'text-neutral-500 hover:text-neutral-900 font-semibold'}`}
                      >
                        {/* Tree Branch Tick */}
                        <div className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-[22px] h-[1.5px] bg-neutral-200/90"></div>

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 flex-shrink-0 text-neutral-400"
                        >
                          <path d="M9 18V5l12-2v12" />
                          <circle cx="6" cy="18" r="3" />
                          <circle cx="18" cy="15" r="3" />
                          <line x1="14" y1="8" x2="18" y2="8" />
                          <line x1="16" y1="6" x2="16" y2="10" />
                        </svg>
                        <span>For Music</span>
                      </button>

                      {/* For Phone */}
                      <button
                        onClick={() => setSelectedSubCategory("Phone")}
                        className={`relative flex items-center gap-2.5 text-[13.5px] w-full text-left transition-all duration-200 pl-2 ${selectedSubCategory === "Phone" ? 'text-[#f43f5e] font-bold' : 'text-neutral-500 hover:text-neutral-900 font-semibold'}`}
                      >
                        {/* Tree Branch Tick */}
                        <div className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-[22px] h-[1.5px] bg-neutral-200/90"></div>

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 flex-shrink-0 text-neutral-400"
                        >
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                          <line x1="12" y1="18" x2="12.01" y2="18" />
                        </svg>
                        <span>For Phone</span>
                      </button>

                      {/* For Storage */}
                      <button
                        onClick={() => setSelectedSubCategory("Storage")}
                        className={`relative flex items-center gap-2.5 text-[13.5px] w-full text-left transition-all duration-200 pl-2 ${selectedSubCategory === "Storage" ? 'text-[#f43f5e] font-bold' : 'text-neutral-500 hover:text-neutral-900 font-semibold'}`}
                      >
                        {/* Curved tree line branch at the bottom */}
                        <div className="absolute -left-[18px] top-0 h-[10px] w-[1.5px] bg-neutral-200/90"></div>
                        <div className="absolute -left-[18px] top-[1.5px] w-[22px] h-[9px] border-l-[1.5px] border-b-[1.5px] border-neutral-200/90 rounded-bl-[6px]"></div>

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 flex-shrink-0 text-neutral-400"
                        >
                          <path d="M4 20c0-6 4-10 10-10" />
                          <polyline points="10 6 14 10 10 14" />
                          <line x1="17" y1="17" x2="21" y2="21" />
                          <line x1="21" y1="17" x2="17" y2="21" />
                        </svg>
                        <span>For Storage</span>
                      </button>

                    </div>
                  )}
                </div>

                {/* Collapsible New Arrival Category */}
                <button
                  onClick={() => toggleCategory("newArrival")}
                  className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl border transition-all duration-300 font-sans ${openCategory === "newArrival" ? 'bg-neutral-50 border-neutral-200/60 text-neutral-950 font-bold shadow-[0_4px_12px_rgba(0,0,0,0.03)]' : 'bg-transparent border-transparent text-neutral-400 font-semibold hover:text-neutral-900'}`}
                >
                  <div className="flex items-center gap-2.5 text-[14px]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4.5 h-4.5 text-neutral-400"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span>New Arrival</span>
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: openCategory === "newArrival" ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
                    className="w-3.5 h-3.5 text-neutral-400"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openCategory === "newArrival" && (
                  <div className="pl-8 ml-4 flex flex-col gap-2 py-1 text-[13px] text-neutral-400 font-semibold">
                    <span className="text-neutral-300 italic">Coming soon…</span>
                  </div>
                )}

                {/* Collapsible Best Seller Category */}
                <button
                  onClick={() => toggleCategory("bestSeller")}
                  className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl border transition-all duration-300 font-sans ${openCategory === "bestSeller" ? 'bg-neutral-50 border-neutral-200/60 text-neutral-950 font-bold shadow-[0_4px_12px_rgba(0,0,0,0.03)]' : 'bg-transparent border-transparent text-neutral-400 font-semibold hover:text-neutral-900'}`}
                >
                  <div className="flex items-center gap-2.5 text-[14px]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4.5 h-4.5 text-neutral-400"
                    >
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5z" />
                    </svg>
                    <span>Best Seller</span>
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: openCategory === "bestSeller" ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
                    className="w-3.5 h-3.5 text-neutral-400"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openCategory === "bestSeller" && (
                  <div className="pl-8 ml-4 flex flex-col gap-2 py-1 text-[13px] text-neutral-400 font-semibold">
                    <span className="text-neutral-300 italic">Coming soon…</span>
                  </div>
                )}

                {/* Collapsible On Discount Category */}
                <button
                  onClick={() => toggleCategory("onDiscount")}
                  className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl border transition-all duration-300 font-sans ${openCategory === "onDiscount" ? 'bg-neutral-50 border-neutral-200/60 text-neutral-950 font-bold shadow-[0_4px_12px_rgba(0,0,0,0.03)]' : 'bg-transparent border-transparent text-neutral-400 font-semibold hover:text-neutral-900'}`}
                >
                  <div className="flex items-center gap-2.5 text-[14px]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4.5 h-4.5 text-neutral-400"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <circle cx="9.5" cy="9.5" r="1.5" />
                      <circle cx="14.5" cy="14.5" r="1.5" />
                    </svg>
                    <span>On Discount</span>
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: openCategory === "onDiscount" ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
                    className="w-3.5 h-3.5 text-neutral-400"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openCategory === "onDiscount" && (
                  <div className="pl-8 ml-4 flex flex-col gap-2 py-1 text-[13px] text-neutral-400 font-semibold">
                    <span className="text-neutral-300 italic">Coming soon…</span>
                  </div>
                )}

              </div>
            </aside>

            {/* Right Product Grid Column */}
            <div className="flex-1 w-full">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center gap-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-12 h-12 text-neutral-300"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span className="text-neutral-400 text-sm font-semibold">
                    No products found matching your search.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                  {filteredProducts.map((product, idx) => (
                    <div key={`${product.id}-${idx}`} className="group flex flex-col gap-4 animate-in fade-in duration-500">

                      {/* Product Isolated Image Box (Soft Studio Backdrop with Drop Shadow) */}
                      <div className="relative w-full aspect-square rounded-2xl bg-[#f3f4f6] overflow-hidden flex items-center justify-center p-0 shadow-[0_15px_45px_rgba(0,0,0,0.04)] border border-neutral-200/10 transition-all duration-300 group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.085)] group-hover:-translate-y-0.5">

                        {/* Remote Unsplash Product Photo with cover fit to fill full card area */}
                        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        </div>

                        {/* Category Label Overlay */}
                        <div className="absolute top-1.5 right-1.5 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full px-1.5 sm:px-3 py-0.5 sm:py-1 border border-neutral-100/50 shadow-sm">
                          <span className="text-[7.5px] xs:text-[8px] sm:text-[10px] font-bold text-neutral-500 tracking-wide uppercase leading-none">
                            {product.category}
                          </span>
                        </div>

                      </div>

                      {/* Product Content Meta Info */}
                      <div className="flex flex-col px-1.5">

                        {/* Title */}
                        <h4 className="text-[13px] sm:text-[16px] font-bold text-neutral-900 tracking-tight leading-snug group-hover:text-neutral-750 transition-colors duration-200">
                          {product.name}
                        </h4>

                        {/* Star Rating & Price Alignment Row */}
                        <div className="flex items-center justify-between mt-1 mb-3">

                          {/* Rating & Review count */}
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <svg
                              viewBox="0 0 24 24"
                              fill="#f59e0b"
                              stroke="#f59e0b"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <span className="text-[10.5px] sm:text-[11.5px] font-bold text-neutral-950">{product.rating}</span>
                            <span className="text-[9.5px] sm:text-[11px] font-semibold text-neutral-400">({product.reviews})</span>
                          </div>

                          {/* Price */}
                          <span className="text-[14px] sm:text-[17px] font-black tracking-tight text-neutral-950">
                            ${product.price}
                          </span>

                        </div>

                        {/* Button Action Trigger Row */}
                        <div className="flex items-center gap-2 sm:grid sm:grid-cols-2 sm:gap-3 w-full">

                          {/* Add to Cart */}
                          <button
                            className="bg-[#f3f4f6] hover:bg-[#e5e7eb] text-neutral-800 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center p-2 sm:py-2 sm:px-4 aspect-square sm:aspect-auto flex-shrink-0 sm:flex-shrink w-9 h-9 sm:w-auto sm:h-auto"
                            aria-label="Add to Cart"
                          >
                            {/* Mobile Cart Icon - Visible only on mobile */}
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4 text-neutral-800 sm:hidden"
                            >
                              <circle cx="9" cy="21" r="1" />
                              <circle cx="20" cy="21" r="1" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>

                            {/* Desktop Add to Cart Text - Visible on sm and up */}
                            <span className="hidden sm:inline text-[11.5px] font-bold leading-none">Add to Cart</span>
                          </button>

                          {/* Buy Now */}
                          <button className="bg-neutral-950 hover:bg-neutral-850 text-white text-[11.5px] sm:text-[11.5px] font-extrabold py-2 sm:py-2 px-4 rounded-full transition-all duration-200 active:scale-95 shadow-sm text-center leading-none flex-1 sm:flex-initial h-9 sm:h-auto flex items-center justify-center">
                            Buy Now
                          </button>

                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              )}

              {/* Premium Minimalist Pagination Bar */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-6 mt-12 w-full font-sans text-[13px] font-semibold text-neutral-800">

                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 hover:text-neutral-950 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-neutral-600 font-bold"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span>Previous</span>
                </button>

                {/* Numeric Pagination Group - Hidden on mobile, flex on desktop */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 text-[13.5px] ${currentPage === page ? 'bg-neutral-100 text-neutral-950 font-bold' : 'text-neutral-500 hover:text-neutral-900 font-semibold'}`}
                    >
                      {page}
                    </button>
                  ))}

                  <span className="px-1 text-neutral-400 font-medium">...</span>

                  {[8, 9, 10].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 text-[13.5px] ${currentPage === page ? 'bg-neutral-100 text-neutral-950 font-bold' : 'text-neutral-500 hover:text-neutral-900 font-semibold'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Simplified Mobile Page Counter - Visible on mobile only */}
                <div className="flex sm:hidden items-center text-[12.5px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-full px-3 py-1 shadow-sm">
                  <span>{currentPage} / 10</span>
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(10, prev + 1))}
                  disabled={currentPage === 10}
                  className="flex items-center gap-2 hover:text-neutral-950 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-neutral-600 font-bold"
                >
                  <span>Next</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>

              </div>
            </div>

          </div>

          {/* Explore our recomendations slider section */}
          <div className="flex flex-col gap-5 sm:gap-8 pt-6 sm:pt-10 mt-3 sm:mt-6 border-t border-neutral-100/80 w-full">

            {/* Recommendations Header Row */}
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl sm:text-[24px] md:text-[28px] font-black tracking-tight text-neutral-950 font-sans truncate whitespace-nowrap">
                <span className="inline sm:hidden">Explore</span>
                <span className="hidden sm:inline">Explore our recommendations</span>
              </h3>

              {/* Minimalist arrow buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => scrollRecommendations("left")}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-950 hover:border-neutral-900 hover:bg-neutral-50 active:scale-95 transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() => scrollRecommendations("right")}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-950 hover:border-neutral-900 hover:bg-neutral-50 active:scale-95 transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrolling Product Carousel Container */}
            <div
              ref={recommendationScrollRef}
              className="flex gap-4 sm:gap-8 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory pb-4 w-full"
            >
              {RECOMMENDATION_PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[calc((100%-16px)/2.2)] sm:w-[320px] snap-start flex flex-col gap-4 group"
                >
                  {/* Image Card - matching the medium radius rounded-2xl */}
                  <div className="relative w-full aspect-square rounded-2xl bg-[#f3f4f6] overflow-hidden flex items-center justify-center p-0 shadow-[0_15px_45px_rgba(0,0,0,0.04)] border border-neutral-200/10 transition-all duration-300 group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.085)] group-hover:-translate-y-0.5">

                    <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>

                    {/* Category Label Overlay */}
                    <div className="absolute top-1.5 right-1.5 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full px-1.5 sm:px-3 py-0.5 sm:py-1 border border-neutral-100/50 shadow-sm">
                      <span className="text-[7.5px] xs:text-[8px] sm:text-[10px] font-bold text-neutral-500 tracking-wide uppercase leading-none">
                        {product.category}
                      </span>
                    </div>

                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-col px-1.5">
                    <h4 className="text-[13px] sm:text-[16px] font-bold text-neutral-900 tracking-tight leading-snug group-hover:text-neutral-750 transition-colors duration-200">
                      {product.name}
                    </h4>

                    {/* Star Rating & Price */}
                    <div className="flex items-center justify-between mt-1 mb-3">

                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <svg
                          viewBox="0 0 24 24"
                          fill="#f59e0b"
                          stroke="#f59e0b"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="text-[10.5px] sm:text-[11.5px] font-bold text-neutral-950">{product.rating}</span>
                        <span className="text-[9.5px] sm:text-[11px] font-semibold text-neutral-400">({product.reviews})</span>
                      </div>

                      <span className="text-[14px] sm:text-[17px] font-black tracking-tight text-neutral-950">
                        ${product.price}
                      </span>

                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 sm:grid sm:grid-cols-2 sm:gap-3 w-full">

                      {/* Add to Cart */}
                      <button
                        className="bg-[#f3f4f6] hover:bg-[#e5e7eb] text-neutral-800 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center p-2 sm:py-2 sm:px-4 aspect-square sm:aspect-auto flex-shrink-0 sm:flex-shrink w-9 h-9 sm:w-auto sm:h-auto"
                        aria-label="Add to Cart"
                      >
                        {/* Mobile Cart Icon - Visible only on mobile */}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4 text-neutral-800 sm:hidden"
                        >
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>

                        {/* Desktop Add to Cart Text - Visible on sm and up */}
                        <span className="hidden sm:inline text-[11.5px] font-bold leading-none">Add to Cart</span>
                      </button>

                      {/* Buy Now */}
                      <button className="bg-neutral-950 hover:bg-neutral-850 text-white text-[10.5px] sm:text-[11.5px] font-extrabold py-2 sm:py-2 px-4 rounded-full transition-all duration-200 active:scale-95 shadow-sm text-center leading-none flex-1 sm:flex-initial h-9 sm:h-auto flex items-center justify-center">
                        Buy Now
                      </button>

                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Stunning Dark Luxury Newsletter Banner Block */}
          <div className="bg-neutral-950 rounded-2xl p-8 md:p-16 mt-3 sm:mt-16 w-full text-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-16">

            {/* Left Column: Headline and Input Form */}
            <div className="flex flex-col gap-6 w-full md:w-auto">
              <h3 className="text-[15px] xs:text-[18px] sm:text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-white font-sans whitespace-nowrap sm:whitespace-normal">
                Ready to Get<br className="hidden sm:inline" />Our New Stuff?
              </h3>

              {/* Sleek White Pill Input Container */}
              <div className="flex items-center bg-white rounded-full pl-5 pr-2 py-1.5 w-full sm:w-[360px] shadow-sm focus-within:ring-2 focus-within:ring-white/20 transition-all duration-300">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-transparent border-none outline-none text-sm w-full text-neutral-800 placeholder-neutral-400 font-semibold"
                />
                <button className="bg-neutral-950 hover:bg-neutral-850 text-white rounded-full px-5 py-1.5 text-xs font-extrabold transition-all duration-200 active:scale-95 flex-shrink-0">
                  Send
                </button>
              </div>
            </div>

            {/* Right Column: Brand Statement Meta Info */}
            <div className="hidden md:flex flex-col max-w-[420px] md:self-end md:mb-2">
              <span className="text-neutral-400 text-[11.5px] font-bold uppercase tracking-wider mb-2 font-sans">
                Stuffsus for Homes and Needs
              </span>
              <p className="text-neutral-400 text-[13px] leading-relaxed font-medium">
                We'll listen to your needs, identify the best approach, and then create a bespoke smart EV charging solution that's right for you.
              </p>
            </div>

          </div>

          {/* Premium Minimalist Footer Section (Nested inside the White Card for pixel-perfect integration) */}
          <footer className="w-full mt-10 pt-10 border-t border-neutral-100 flex flex-col gap-10">

            {/* Footer Upper Group */}
            <div className="flex flex-col md:flex-row justify-between gap-8">

              {/* Left/Middle Content Links Grid */}
              <div className="grid grid-cols-2 gap-8 sm:flex sm:gap-20 w-full md:w-auto">

                {/* About Column */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-[15px] font-black text-neutral-950 tracking-tight font-sans">
                    About
                  </h4>
                  <div className="flex flex-col gap-3.5 text-[13px] font-semibold text-neutral-500 max-w-[220px] sm:max-w-[280px]">
                    <a href="#" className="hover:text-neutral-900 transition-colors duration-200">Blog</a>
                    <a href="#" className="hover:text-neutral-900 transition-colors duration-200">Meet The Team</a>
                    {/* Desktop Address - Hidden on mobile, docked on desktop */}
                    <p className="hidden sm:block text-neutral-400 font-medium leading-relaxed mt-1.5 text-[12px] border-t border-neutral-100/80 pt-2.5 max-w-[240px] sm:max-w-none">
                      House No. 14, Road No. A, Block A, Sontek,<br />
                      South Kajla, Jatrabari, Dhaka - 1236
                    </p>
                  </div>
                </div>

                {/* Support Column */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-[15px] font-black text-neutral-950 tracking-tight font-sans">
                    Support
                  </h4>
                  <div className="flex flex-col gap-3.5 text-[13px] font-semibold text-neutral-500">
                    <a href="#" className="hover:text-neutral-900 transition-colors duration-200">Contact Us</a>
                    <a href="#" className="hover:text-neutral-900 transition-colors duration-200">Shipping & Return</a>
                    <a href="tel:+8801919-760626" className="hidden sm:flex text-neutral-400 hover:text-neutral-900 transition-colors duration-200 font-medium mt-1.5 text-[12px] border-t border-neutral-100/80 pt-2.5 items-center gap-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>+8801919-760626</span>
                    </a>
                  </div>
                </div>

                {/* Mobile Address & Contact - Spans full width (col-span-2) at the bottom, visible on mobile only */}
                <div className="col-span-2 sm:hidden border-t border-neutral-100/80 pt-3.5 -mt-2 flex flex-col gap-2.5">
                  {/* Header Row */}
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-sans flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>Address</span>
                    </span>
                    <a href="tel:+8801919-760626" className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider hover:text-neutral-900 transition-colors duration-200 font-sans flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>+8801919-760626</span>
                    </a>
                  </div>
                  {/* Address Content - Spans full width for exactly 2 lines */}
                  <p className="text-neutral-400 font-medium leading-relaxed text-[12px] w-full">
                    House No. 14, Road No. A, Block A, Sontek,<br />
                    South Kajla, Jatrabari, Dhaka - 1236
                  </p>
                </div>

              </div>

              {/* Right/Social Column */}
              <div className="flex flex-col gap-4 items-center md:items-end">
                <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider font-sans">
                  Social Media
                </span>
                <div className="flex items-center gap-3">

                  {/* X Icon */}
                  <a href="#" className="social-btn rounded-full bg-neutral-950 text-white flex items-center justify-center hover:bg-neutral-800 transition-all duration-200 active:scale-95 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                    </svg>
                  </a>

                  {/* Facebook Icon */}
                  <a href="#" className="social-btn rounded-full bg-neutral-950 text-white flex items-center justify-center hover:bg-neutral-800 transition-all duration-200 active:scale-95 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>

                  {/* LinkedIn Icon */}
                  <a href="#" className="social-btn rounded-full bg-neutral-950 text-white flex items-center justify-center hover:bg-neutral-800 transition-all duration-200 active:scale-95 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </a>

                  {/* Instagram Icon */}
                  <a href="#" className="social-btn rounded-full bg-neutral-950 text-white flex items-center justify-center hover:bg-neutral-800 transition-all duration-200 active:scale-95 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>

                </div>
              </div>

            </div>

            {/* Footer Lower Group */}
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-neutral-100 pt-6 gap-4 text-[12px] font-semibold text-neutral-400">
              <span>
                Copyright © 2026 Stuffsus. All Rights Reserved.
              </span>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-neutral-900 transition-colors duration-200">Terms of Service</a>
                <a href="#" className="hover:text-neutral-900 transition-colors duration-200">Privacy Policy</a>
              </div>
            </div>

          </footer>

        </div>

      </main>

    </div>
  );
}
