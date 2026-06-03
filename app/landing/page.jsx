import HeroSection from "./components/HeroSection";
import StepsSection from "./components/StepsSection";
import StatsSection from "./components/StatsSection";
import GallerySection from "./components/GallerySection";
import CTASection from "./components/CTASection";
import FAQSection from "./components/FAQSection";
import FooterSection from "./components/FooterSection";

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <StepsSection />
            <StatsSection />
            <GallerySection />
            <CTASection />
            <FAQSection />
            <FooterSection />
        </>
    );
}