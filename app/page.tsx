import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { SizeGuideModal } from "@/components/SizeGuideModal";
import { Hero } from "@/components/sections/Hero";
import { DressShowcase } from "@/components/sections/DressShowcase";
import { NewArrivals } from "@/components/sections/NewArrivals";
import { ShopByOccasion } from "@/components/sections/ShopByOccasion";
import { FabricCraft } from "@/components/sections/FabricCraft";
import { Lookbook } from "@/components/sections/Lookbook";
import { Testimonials } from "@/components/sections/Testimonials";
import { InstagramStrip } from "@/components/sections/InstagramStrip";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DressShowcase />
        <NewArrivals />
        <ShopByOccasion />
        <FabricCraft />
        <Lookbook />
        <Testimonials />
        <InstagramStrip />
      </main>
      <Footer />
      <CartDrawer />
      <SizeGuideModal />
    </>
  );
}
