import Navbar       from "@/components/Navbar";
import Hero         from "@/components/Hero";
import Stats        from "@/components/Stats";
import Presentation from "@/components/Presentation";
import Services     from "@/components/Services";
import Zones        from "@/components/Zones";
import Partners     from "@/components/Partners";
import Realisations from "@/components/Realisations";
import Contact      from "@/components/Contact";
import Footer       from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Presentation />
        <Services />
        <Zones />
        <Partners />
        <Realisations />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
