import NavBar from "./components/NavBar.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import CarLandingSection from "./components/CarLandingSection.jsx";
import BannerSection from "./components/BannerSection.jsx";
import Hero from "./components/Hero.jsx";
import ProductViewer from "./components/ProductViewer.jsx";
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/all";
import Performance from "./components/Performance.jsx";
import Showcase from "./components/Showcase.jsx";
import Features from "./components/Features.jsx";
import Highlights from "./components/Highlights.jsx";
import Waitlist from "./components/Waitlist.jsx";
import Footer from "./components/Footer.jsx";

gsap.registerPlugin(ScrollTrigger)

const App = () => {
    return (
        <main>
            <NavBar />
            <CarLandingSection />
            <Hero />
            {/* <BannerSection /> */}
            {/* <Performance /> */}
            {/* <ProductViewer /> */}
            <Showcase />
            <Features />
            <Highlights />
            <Waitlist />
            <Footer />
        {/* Floating AI chat widget — always visible */}
        <ChatWidget />
        </main>
    )
}

export default App
