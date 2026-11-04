import { CTA } from "./-components/CTA";
import { Footer } from "./-components/Footer";
import { Header } from "./-components/Header";
import { Hero } from "./-components/Hero";
import { HowItWorks } from "./-components/HowItWorks";
import { PricingSection } from "./-components/PricingSection";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-background">
			<Header />
			<main>
				<Hero />
				<HowItWorks />
				<PricingSection />
				<CTA />
			</main>
			<Footer />
		</div>
	);
}
