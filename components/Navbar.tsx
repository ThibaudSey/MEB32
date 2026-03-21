"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X, Home } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";
import clsx from "clsx";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    const offset = 68;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset,
      behavior: "smooth",
    });
  };

  return (
    <nav
      aria-label="Navigation principale"
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-primary shadow-xl backdrop-blur"
          : "bg-primary/90 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* ── Logo ── */}
          <button
            onClick={() => scrollTo("#accueil")}
            className="flex items-center gap-2.5 cursor-pointer"
            aria-label="MEB32 – Accueil"
          >
            <span className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <Home className="w-5 h-5 text-white" aria-hidden />
            </span>
            <span>
              <span className="block font-heading font-extrabold text-xl text-white tracking-tight leading-none">
                MEB<span className="text-accent">32</span>
              </span>
              <span className="hidden sm:block text-white/50 text-xs font-body leading-none mt-0.5">
                Équipement Avicole
              </span>
            </span>
          </button>

          {/* ── Desktop links ── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("#contact")}
              className="ml-3 bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer"
            >
              Nous contacter
            </button>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {open
              ? <X className="w-6 h-6" />
              : <Menu className="w-6 h-6" />
            }
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        id="mobile-menu"
        className={clsx(
          "lg:hidden bg-primary-dark border-t border-white/10 overflow-hidden transition-all duration-300",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="w-full text-left text-white/80 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("#contact")}
            className="w-full bg-accent hover:bg-accent-dark text-white px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer mt-1"
          >
            Nous contacter
          </button>
        </div>
      </div>
    </nav>
  );
}
