"use client";

import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import HeaderSection from "./components/HeaderSection";
import Statcard from "./components/Statcard";
import StepsSection from "./components/StepsSection";
import GallerySection from "./components/GallerySection";
import FAQSection from "./components/FAQSection";
import FooterSection from "./components/FooterSection";

export default function HomePage() {

  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">

      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">

        {/* Topbar */}
        <div className="p-6 pb-0">
          <Topbar
            title="Dashboard"
            subtitle="Selamat datang kembali 👋"
          />
        </div>

        {/* Content */}
        <div className="px-6 pb-10">

          {/* Header */}
          <HeaderSection />

          {/* Statistics */}
          <Statcard />

          {/* Gallery */}
          <GallerySection/>

          {/* Steps */}
          <StepsSection />

          {/* FAQ */}
          <FAQSection/>

          {/* footer */}
          <FooterSection/>

        </div>

      </main>

    </div>
  );
}