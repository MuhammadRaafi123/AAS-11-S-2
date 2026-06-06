"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      router.replace("/login");
      return;
    }

    setLoading(false);
  }, [router]);

  // ⛔ jangan render apa pun sebelum dicek
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white">
        Checking session...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 pb-0">
          <Topbar title="Dashboard" subtitle="Selamat datang kembali 👋" />
        </div>

        <div className="px-6 pb-10">
          <HeaderSection />
          <Statcard />
          <GallerySection />
          <StepsSection />
          <FAQSection />
          <FooterSection />
        </div>
      </main>
    </div>
  );
}