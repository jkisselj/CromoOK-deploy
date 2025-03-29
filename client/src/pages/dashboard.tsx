import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Zap, Shield } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-12 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  Find Your Perfect <span className="text-primary">Shooting Location</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-[600px]">
                  Connect with location owners and book the ideal space for your next photoshoot, film, or creative project
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link to="/locations">
                    Browse Locations
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/locations/new">
                    List Your Space
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {[
                  { icon: MapPin, text: "Curated Locations" },
                  { icon: Zap, text: "Instant Booking" },
                  { icon: Shield, text: "Secure Payments" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <feature.icon className="h-5 w-5 text-primary" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1581859814481-bfd944e3122f?q=80&w=800&auto=format&fit=crop"
                  alt="Studio space example"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 aspect-square w-1/2 rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop"
                  alt="Photo shoot in progress"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">How SceneHunter Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connecting creative professionals with perfect shooting locations in just a few steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Discover",
                description: "Browse through hundreds of unique locations with detailed information and high-quality photos",
                icon: "🔍"
              },
              {
                title: "Book",
                description: "Select your dates, send booking requests, and secure your perfect location with ease",
                icon: "📅"
              },
              {
                title: "Shoot",
                description: "Arrive at your location and bring your creative vision to life in the perfect setting",
                icon: "📸"
              }
            ].map((step, i) => (
              <div key={i} className="bg-card border rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}