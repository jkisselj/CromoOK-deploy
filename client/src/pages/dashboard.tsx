import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function DashboardPage() {
  const { user } = useAuthContext();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Find Your Perfect Shooting Location
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Connect with location owners and book the ideal space for your next photoshoot, film, or creative project
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link to="/locations">
                    Browse Locations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!user ? (
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/auth/register">List Your Space</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/locations/new">List Your Space</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last">
              <video
                className="aspect-video object-cover w-full h-full"
                autoPlay
                muted
                loop
                playsInline
                poster="https://images.unsplash.com/photo-1596079890744-c1a0462d0975?q=80&w=1920&auto=format&fit=crop"
              >
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything You Need</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Our platform provides all the tools needed to find and book the perfect shooting location
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Curated Locations</h3>
              <p className="text-muted-foreground text-center">
                Handpicked selection of unique spaces that meet professional standards
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Instant Booking</h3>
              <p className="text-muted-foreground text-center">
                Secure your location immediately with our streamlined booking system
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Secure Payments</h3>
              <p className="text-muted-foreground text-center">
                Protected transactions with transparent pricing and no hidden fees
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
            <div className="overflow-hidden rounded-xl">
              <img
                alt="Luxurious interior space for photoshoots"
                className="aspect-video object-cover w-full"
                src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1920&auto=format&fit=crop"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-xl">
              <img
                alt="Modern architectural space for film production"
                className="aspect-video object-cover w-full"
                src="https://images.unsplash.com/photo-1486304873000-235643847519?q=80&w=1920&auto=format&fit=crop"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How SceneHunter Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Connecting creative professionals with perfect shooting locations in just a few steps
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-4">
              <div className="rounded-full bg-primary p-4 text-4xl font-bold text-primary-foreground">
                🔍
              </div>
              <h3 className="text-xl font-bold">Discover</h3>
              <p className="text-muted-foreground text-center">
                Browse through hundreds of unique locations with detailed information and high-quality photos
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-4">
              <div className="rounded-full bg-primary p-4 text-4xl font-bold text-primary-foreground">
                📅
              </div>
              <h3 className="text-xl font-bold">Book</h3>
              <p className="text-muted-foreground text-center">
                Select your dates, send booking requests, and secure your perfect location with ease
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-4">
              <div className="rounded-full bg-primary p-4 text-4xl font-bold text-primary-foreground">
                📸
              </div>
              <h3 className="text-xl font-bold">Shoot</h3>
              <p className="text-muted-foreground text-center">
                Arrive at your location and bring your creative vision to life in the perfect setting
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Button asChild size="lg">
              <Link to="/locations">
                Find Your Location Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col gap-10 px-4 py-10 md:px-6 md:py-16">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">SceneHunter</h3>
              <p className="max-w-[300px] text-muted-foreground text-sm">
                Find the perfect location for your photo or video shoot with our curated collection of unique spaces.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/locations" className="text-muted-foreground hover:text-foreground transition-colors">
                    Locations
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connect</h3>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Subscribe to our newsletter for the latest updates</p>
                <form className="flex space-x-2">
                  <input
                    className="max-w-lg flex-1 border px-3 py-2 text-sm rounded-md"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit" size="sm">
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">© 2025 SceneHunter. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">
              Powered by <span className="font-semibold">SceneHunter Technologies</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}