"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [cartCount, setCartCount] = useState(12);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="w-full px-0 md:px-6 bg-transparent relative z-50">
      {/* Flawless Floating White Card Container sitting flush at the top */}
      <div className="mx-auto max-w-7xl bg-white rounded-none md:rounded-b-[28px] border-b border-neutral-100/70 md:border md:border-t-0 shadow-sm md:shadow-[0_8px_30px_rgb(0,0,0,0.015)] px-6 py-4 md:px-8 md:py-4.5 flex items-center justify-between transition-all duration-300">

        {/* Brand Logo and Text */}
        <a href="#" className="flex items-center gap-3 group">
          {/* Custom precision organic loop logo from the mockup */}
          <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[25px] h-[25px] text-black"
            >
              <path d="M4 18c0-3 3-5 6-5s4.5-1 5.5-3S15.5 4 13.5 4s-4 2-4 5c0 4 3 6 6 8s3.5 3 4.5 3" />
            </svg>
          </div>
          <span className="text-[19px] font-bold tracking-[-0.02em] text-black font-sans">
            Stuffsus
          </span>
        </a>

        {/* Center Navigation Links (Identical to image: no dot active indicator, pure bold black text) */}
        <nav className="hidden md:flex items-center gap-10">
          <a
            href="#"
            className="text-[14px] font-medium text-neutral-400 hover:text-black transition-colors duration-200"
          >
            Beranda
          </a>
          <a
            href="#"
            className="text-[14px] font-bold text-black transition-colors"
          >
            Shop
          </a>
          <a
            href="#"
            className="text-[14px] font-medium text-neutral-400 hover:text-black transition-colors duration-200"
          >
            Blog
          </a>
        </nav>

        {/* Right Action Circle Buttons */}
        <div className="flex items-center gap-3">
          {/* Search Circle Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white border border-neutral-100 hover:bg-neutral-50 hover:scale-[1.03] transition-all duration-200 group focus:outline-none shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            aria-label="Search"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[17px] h-[17px] text-black group-hover:scale-[1.03] transition-transform"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Cart Circle Button with Red Badge */}
          <button
            className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white border border-neutral-100 hover:bg-neutral-50 hover:scale-[1.03] transition-all duration-200 group focus:outline-none shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            aria-label="Shopping Cart"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[17px] h-[17px] text-black group-hover:scale-[1.03] transition-transform"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>

            {/* Red Notification Badge - Recreated perfectly */}
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#f43f5e] text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile Sunglasses Avatar - Identical to Mockup */}
          <button
            className="relative hidden md:flex items-center justify-center w-11 h-11 rounded-full overflow-hidden border border-neutral-100 hover:scale-[1.04] transition-all duration-200 focus:outline-none shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            aria-label="User Account"
          >
            <Image
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=128&q=80"
              alt="User Avatar"
              width={44}
              height={44}
              className="object-cover w-full h-full scale-[1.1]"
              priority
            />
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center justify-center w-11 h-11 rounded-full bg-white border border-neutral-100 hover:bg-neutral-50 hover:scale-[1.03] transition-all duration-200 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-black"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-black"
              >
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/35 backdrop-blur-sm transition-all duration-300 flex flex-col justify-start pt-24 px-4">
          <div className="w-full max-w-md mx-auto bg-white rounded-[24px] border border-neutral-100 shadow-2xl p-6 flex flex-col gap-5 animate-in slide-in-from-top-12 duration-300">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Navigation</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-bold text-neutral-500 hover:text-black"
              >
                Close
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[15px] font-medium text-neutral-400 hover:text-black transition-colors py-1"
              >
                Beranda
              </a>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[15px] font-bold text-black py-1"
              >
                Shop
              </a>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[15px] font-medium text-neutral-400 hover:text-black transition-colors py-1"
              >
                Blog
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
