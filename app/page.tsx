import Demo from "@/components/home/Demo";
import Features from "@/components/home/features";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/hero";
import HowWorks from "@/components/home/howWorks";
import Testimonial from "@/components/home/testimonial";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "codex",
};

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Testimonial />
      <Features />
      <HowWorks />

      <Demo />
      <Footer />
    </>
  );
}
