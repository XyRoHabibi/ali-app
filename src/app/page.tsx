import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Services from "@/components/sections/Services";
import Roadmap from "@/components/sections/Roadmap";
import BentoFeatures from "@/components/sections/BentoFeatures";
import Testimonials from "@/components/sections/Testimonials";
import Gallery from "@/components/sections/Gallery";
import BlogPreview from "@/components/sections/BlogPreview";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Trust Bar & Stats */}
      <Stats />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Services Section */}
      <Services />

      {/* AI Roadmap Section */}
      <Roadmap />

      {/* Why Choose Us (Bento Style) */}
      <BentoFeatures />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Gallery Section */}
      <Gallery />

      {/* Blog Preview Section */}
      <BlogPreview />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <CTA />
    </>
  );
}
