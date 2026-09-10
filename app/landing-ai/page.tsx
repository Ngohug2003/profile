"use client";

import React, { useState } from "react";
import { ArrowRight, Shield, Database, Cpu, Menu, X, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function LandingAiPage() {
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  const navLinks = [
    { label: "Overview", href: "#overview" },
    { label: "Features", href: "#features" },
    { label: "Architecture", href: "#architecture" },
    { label: "Console", href: "#console" }
  ];

  const features = [
    {
      title: "01 / TWILIGHT COMPUTING",
      subtitle: "Edge infrastructure at high altitude",
      desc: "Deploy serverless workloads on mountain-top nodes. Reduced atmospheric interference, pure solar-powered hardware, and direct satellite uplinks for sub-millisecond global propagation."
    },
    {
      title: "02 / ANOMALY ISOLATION",
      subtitle: "Zero-trust network containment",
      desc: "Real-time threat monitoring powered by autonomous agents. Isolate compromised nodes instantly at the physical layer without interrupting adjacent processes."
    },
    {
      title: "03 / SPECTRAL STORAGE",
      subtitle: "Quantum-encrypted cold vaulting",
      desc: "Store critical assets inside granite-shielded cryptographic storage complexes. Immutable history, distributed multi-region replication, and offline recovery protocols."
    }
  ];

  return (
    <div className="min-h-screen bg-deep-space text-starlight font-sans selection:bg-mercury-blue selection:text-pure-white overflow-x-hidden">
      
      {/* 1. Header (Sticky Pill Navigation) */}
      <header className="sticky top-0 z-50 w-full border-b border-lead/20 bg-deep-space/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group text-starlight">
            <span className="font-sans font-medium text-lg tracking-[0.02em] uppercase">
              MERCURY <span className="text-mercury-blue font-light">AI</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-starlight hover:text-ghost-blue transition-colors duration-200 tracking-wider font-light"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Action Button (Translucent Ghost Blue) */}
          <div className="hidden md:block">
            <a
              href="#console"
              className="inline-flex items-center justify-center px-5 py-2 text-sm font-light text-starlight bg-ghost-blue/10 hover:bg-ghost-blue/20 transition-all duration-200 rounded-[40px] tracking-wider border border-lead/30"
            >
              Access Console
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-starlight hover:text-ghost-blue transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-deep-space border-b border-lead/35 py-6 px-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base text-starlight hover:text-ghost-blue transition-colors duration-250 font-light"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-lead/20">
              <a
                href="#console"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full py-3 text-sm font-light text-starlight bg-ghost-blue/10 hover:bg-ghost-blue/20 transition-all duration-200 rounded-[40px] tracking-wider border border-lead/30"
              >
                Access Console
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section (Full-bleed twilight natural landscape) */}
      <section className="relative w-full h-[calc(100vh-80px)] min-h-[600px] flex items-center justify-center overflow-hidden bg-midnight-slate">
        
        {/* Background Image: Twilight Mountain Peak */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-lighten pointer-events-none"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&q=80&w=1920')` 
          }}
        />
        
        {/* Darkening bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-space via-deep-space/60 to-transparent" />

        {/* Hero Content */}
        <div className="max-w-[1200px] mx-auto px-6 z-10 text-center flex flex-col items-center justify-center space-y-8">
          
          <div className="space-y-4 max-w-[800px]">
            <span className="text-xs uppercase tracking-[0.2em] text-silver font-light">
              Autonomous Command Infrastructure
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[65px] font-sans font-light tracking-[0.02em] leading-[1.1] text-starlight uppercase">
              Mountain Top Command Center
            </h1>
            <p className="text-lg sm:text-[21px] font-sans text-silver font-light leading-[1.4] max-w-[620px] mx-auto pt-2">
              Deep space connectivity. Zero trust compute environments. Designed for sovereign intelligence applications.
            </p>
          </div>

          {/* Email Capture Input Group */}
          <div className="w-full max-w-[500px]">
            {subscribed ? (
              <div className="p-4 bg-graphite border border-lead/40 rounded-[4px] flex items-center justify-center gap-3 text-silver animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-5 h-5 text-mercury-blue shrink-0" />
                <span className="text-sm font-light">Secure channel link dispatched to your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter secure email address..."
                  className="flex-1 bg-deep-space/40 backdrop-blur-sm border border-r-0 border-lead text-starlight placeholder-silver/40 text-sm px-6 py-4 rounded-l-[32px] focus:outline-none focus:border-mercury-blue transition-all"
                />
                <button
                  type="submit"
                  className="bg-mercury-blue hover:bg-[#4353d8] text-pure-white px-8 py-4 text-sm font-normal rounded-r-[32px] tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <span>Request Key</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
          
        </div>
      </section>

      {/* 3. Overview Metrics (Minimal single column cards with 0px radius) */}
      <section id="overview" className="relative w-full py-24 sm:py-32 bg-deep-space border-t border-lead/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 bg-midnight-slate border border-lead/20 rounded-[0px] space-y-4">
              <Cpu className="w-6 h-6 text-silver" />
              <div className="space-y-1">
                <span className="text-xs text-silver uppercase tracking-wider font-light">Processing</span>
                <h3 className="text-2xl font-light text-starlight tracking-wide">3.8 EFLOPS</h3>
              </div>
              <p className="text-sm text-silver/70 font-light leading-relaxed">
                Edge compute arrays backed by liquid-cooled superconducting clusters.
              </p>
            </div>

            <div className="p-8 bg-midnight-slate border border-lead/20 rounded-[0px] space-y-4">
              <Database className="w-6 h-6 text-silver" />
              <div className="space-y-1">
                <span className="text-xs text-silver uppercase tracking-wider font-light">Latency</span>
                <h3 className="text-2xl font-light text-starlight tracking-wide">0.84 MS</h3>
              </div>
              <p className="text-sm text-silver/70 font-light leading-relaxed">
                Direct laser satellite relays bypassing standard fiber grid pipelines.
              </p>
            </div>

            <div className="p-8 bg-midnight-slate border border-lead/20 rounded-[0px] space-y-4">
              <Shield className="w-6 h-6 text-silver" />
              <div className="space-y-1">
                <span className="text-xs text-silver uppercase tracking-wider font-light">Isolation</span>
                <h3 className="text-2xl font-light text-starlight tracking-wide">LEVEL 5</h3>
              </div>
              <p className="text-sm text-silver/70 font-light leading-relaxed">
                Granite-shielded containment vaulting with zero network seepage potential.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Interactive Features List (Stark, border-bottom style, 0px radius) */}
      <section id="features" className="w-full py-24 sm:py-32 bg-midnight-slate border-t border-lead/10">
        <div className="max-w-[1200px] mx-auto px-6">
          
          <div className="max-w-[600px] space-y-4 mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-silver font-light">Operational Directives</span>
            <h2 className="text-3xl sm:text-4xl font-sans font-light tracking-[0.02em] text-starlight uppercase">
              Command Suite Modules
            </h2>
          </div>

          <div className="border-t border-lead/30 divide-y divide-lead/35">
            {features.map((feat, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className="w-full text-left py-8 focus:outline-none transition-all duration-300 group block"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className={`text-xl sm:text-2xl font-sans tracking-[0.02em] font-light uppercase transition-colors ${activeFeature === index ? 'text-mercury-blue' : 'text-starlight group-hover:text-ghost-blue'}`}>
                      {feat.title}
                    </h3>
                    <p className="text-sm text-silver tracking-wider uppercase font-light">
                      {feat.subtitle}
                    </p>
                  </div>
                  
                  <div className="max-w-[550px]">
                    <p className={`text-sm sm:text-base font-light leading-relaxed transition-all duration-300 ${activeFeature === index ? 'text-silver' : 'text-silver/50 group-hover:text-silver/70'}`}>
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Terminal Console / Call To Action */}
      <section id="console" className="w-full py-24 sm:py-32 bg-deep-space">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-midnight-slate border border-lead/20 rounded-[0px] p-8 sm:p-12 space-y-8 max-w-[900px] mx-auto">
            
            <div className="flex items-center justify-between border-b border-lead/20 pb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-mercury-blue/40" />
                <span className="text-xs text-silver/80 font-mono tracking-widest">SYS.MERCURY_CONSOLE.V09</span>
              </div>
              <span className="text-xs text-silver/45 font-mono">STATUS: PENDING_AUTH</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-sans font-light tracking-[0.02em] text-starlight uppercase">
                Authorize Terminal Connection
              </h2>
              <p className="text-sm sm:text-base text-silver font-light leading-relaxed max-w-[600px]">
                Submit your credentials to initialize connection to high-altitude command arrays. Authorization keys are issued exclusively via secure physical media or verified pgp channels.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setSubscribed(true)}
                className="bg-mercury-blue hover:bg-[#4353d8] text-pure-white px-8 py-4 text-sm font-normal rounded-[32px] tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Initialize Secure Link</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <a
                href="#features"
                className="bg-graphite hover:bg-[#2e2e3f] text-starlight border border-lead/40 px-8 py-4 text-sm font-light rounded-[32px] tracking-wider transition-colors text-center inline-flex items-center justify-center"
              >
                Read Documentation
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Footer (Minimal, Silver text) */}
      <footer className="w-full py-16 bg-deep-space border-t border-lead/10 text-silver">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          
          <div className="flex items-center gap-2 font-light">
            <span className="uppercase tracking-wider">MERCURY AI</span>
            <span className="text-lead">•</span>
            <span className="text-xs font-light text-silver/50">High-Altitude Command Infrastructure © 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-starlight transition-colors font-light text-xs tracking-wider">SECURE DIRECTIVE</a>
            <a href="#" className="hover:text-starlight transition-colors font-light text-xs tracking-wider">NODE STATUS</a>
            <a href="#" className="hover:text-starlight transition-colors font-light text-xs tracking-wider">PGP KEYS</a>
          </div>

        </div>
      </footer>

    </div>
  );
}
