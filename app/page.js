import { ChevronRight, Car, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SignedOut } from "@clerk/nextjs";
import { getFeaturedCars } from "@/actions/home";
import { CarCard } from "@/components/car-card";
import { HomeSearch } from "@/components/home-search";
import Link from "next/link";
import Image from "next/image";
import { bodyTypes, carMakes, faqItems } from "@/lib/data";

export default async function Home() {
  const featuredCars = await getFeaturedCars();

  return (
    <div className="flex flex-col pt-20">
      {/* Hero Section with Gradient Title */}
      <section className="relative py-16 md:py-32 dotted-background overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          <div className="mb-12 space-y-6">
            <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-4 leading-tight">
              <span className="text-white">Find your </span>
              <span className="gradient-title">Dream Car</span>
              <span className="text-white"> with AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              Experience the future of car buying. Advanced AI-powered search, virtual tours, and instant booking.
            </p>
          </div>

          {/* Search Component (Client) */}
          <HomeSearch />
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold font-heading text-white mb-2">Featured Fleet</h2>
              <p className="text-gray-400">Handpicked premium vehicles just for you</p>
            </div>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/5 text-blue-400 hover:text-blue-300 transition-all" asChild>
              <Link href="/cars">
                View Collection <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Make */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-heading text-white mb-2">Browse by Brand</h2>
              <p className="text-gray-400">Explore vehicles from top manufacturers</p>
            </div>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/5 text-blue-400 hover:text-blue-300" asChild>
              <Link href="/cars">
                See All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {carMakes.map((make) => (
              <Link
                key={make.name}
                href={`/cars?make=${make.name}`}
                className="group bg-white/5 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/20 hover:-translate-y-1"
              >
                <div className="h-16 w-full relative mb-4 flex items-center justify-center">
                  <Image
                    src={
                      make.imageUrl || `/make/${make.name.toLowerCase()}.webp`
                    }
                    alt={make.name}
                    width={64}
                    height={64}
                    className="object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>
                <h3 className="font-medium text-gray-300 group-hover:text-white">{make.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">
              Why Choose Vehiql?
            </h2>
            <p className="text-xl text-gray-400">
              We're redefining the car buying experience with trust, transparency, and technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-3xl text-center hover:bg-white/5 transition-colors group">
              <div className="bg-blue-500/10 text-blue-400 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Car className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Wide Selection</h3>
              <p className="text-gray-400 leading-relaxed">
                Thousands of verified vehicles from trusted dealerships and private sellers.
              </p>
            </div>
            <div className="glass-panel p-8 rounded-3xl text-center hover:bg-white/5 transition-colors group">
              <div className="bg-purple-500/10 text-purple-400 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Easy Test Drive</h3>
              <p className="text-gray-400 leading-relaxed">
                Book a test drive online in minutes, with flexible scheduling options suited for you.
              </p>
            </div>
            <div className="glass-panel p-8 rounded-3xl text-center hover:bg-white/5 transition-colors group">
              <div className="bg-green-500/10 text-green-400 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Process</h3>
              <p className="text-gray-400 leading-relaxed">
                Verified listings and secure booking process for complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Body Type */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-heading text-white mb-2">Shop by Style</h2>
              <p className="text-gray-400">Find the perfect body type for your lifestyle</p>
            </div>
            <Button variant="ghost" className="flex items-center hover:bg-white/5 text-blue-400 hover:text-blue-300" asChild>
              <Link href="/cars">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bodyTypes.map((type) => (
              <Link
                key={type.name}
                href={`/cars?bodyType=${type.name}`}
                className="relative group cursor-pointer overflow-hidden rounded-2xl border border-white/10"
              >
                <div className="flex justify-end h-40 relative bg-gradient-to-br from-gray-900 to-black">
                  <Image
                    src={
                      type.imageUrl || `/body/${type.name.toLowerCase()}.webp`
                    }
                    alt={type.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition duration-500 opacity-80 group-hover:opacity-100"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-6">
                  <h3 className="text-white text-xl font-bold group-hover:text-blue-400 transition-colors">
                    {type.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12 font-heading text-white">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 rounded-xl bg-white/5 px-6">
                <AccordionTrigger className="text-white hover:text-blue-400 hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-400">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/40 opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading text-white">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect
            vehicle through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg h-14 px-8" asChild>
              <Link href="/cars">View All Cars</Link>
            </Button>
            <SignedOut>
              <Button size="lg" className="bg-transparent border border-white/20 text-white hover:bg-white/10 text-lg h-14 px-8" asChild>
                <Link href="/sign-up">Sign Up Now</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>
    </div>
  );
}
