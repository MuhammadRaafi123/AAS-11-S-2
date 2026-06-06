// app/page.jsx
import HeroSection from "./components/HeroSection";
import StepsSection from "./components/StepsSection";
import StatsSection from "./components/StatsSection";
import GallerySection from "./components/GallerySection";
import CTASection from "./components/CTASection";
import FAQSection from "./components/FAQSection";
import FooterSection from "./components/FooterSection";
import Link from "next/link"; // Penting untuk navigasi

export default function HomePage() {
    return (
        <main className="bg-gray-950 text-white min-h-screen">
            {/* Navigasi Sederhana */}
            

            {/* Content Sections */}
            <HeroSection />
            <StepsSection />
            <StatsSection />
            <GallerySection />
            <CTASection />
            <FAQSection />
            
            <FooterSection />
        </main>
    );
}