import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Camera, Map, Clock, Shield } from "lucide-react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function DashboardPage() {
  const { user } = useAuthContext();


  const logo = "/LogoLongWhite.svg";

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true,
      anchorPlacement: 'top-bottom',
      disable: false,
      startEvent: 'DOMContentLoaded',
      throttleDelay: 16,
    });

    window.addEventListener('resize', () => {
      AOS.refresh();
    });

    return () => {
      window.removeEventListener('resize', () => {
        AOS.refresh();
      });
    };
  }, []);

  const locationImages = [
    "/locations/Rannapungerja-tuletorn_okt2023-EXT-45.png",
    "/locations/Kaevandusmuuseum_okt2023-EXT-1.jpg",
    "/locations/Kreenholm-Narva-nov2023_EXT-54.jpg",
    "https://vff.ee/wp-content/uploads/2019/04/32410962703_2035979324_o-1024x687.jpg",
    "https://vff.ee/wp-content/uploads/2019/04/2011_Virumaa-loodus_Elina-Nikolas_csc-7242-1024x683.jpg",
    "https://vff.ee/wp-content/uploads/2019/04/2011_Kontrastiderikas-Virumaa_Aleksandr-Korb_losi-1024x625.jpg",
    "https://www.traveller.ee/blog/wp-content/uploads/2016/04/Taust.jpg",
    "https://visitestonia.com/content-images/500775/top-nature-tour-destinations-in-estonia-en-001-visit-estonia.jpg"
  ];

  // Image location mappings (add linking to specific locations)
  const imageLocationMappings = {
    0: "1", // First image (Rannapungerja lighthouse) links to location with ID 1
    1: "2", // Second image (Kaevandusmuuseum) links to location with ID 2
    2: "3", // Third image (Kreenholm) links to location with ID 3
  };

  // Function to handle image click
  const handleImageClick = (index: number) => {
    if (imageLocationMappings[index as keyof typeof imageLocationMappings]) {
      window.location.href = `/locations/${imageLocationMappings[index as keyof typeof imageLocationMappings]}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://natourest.ee/wp-content/uploads/2020/12/05JJ0806049-1920x800.jpg)",
          }}
        ></div>

        <div className="container px-4 md:px-6 relative z-20">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4" data-aos="fade-right">
              <div className="mb-4">
                <img
                  src={logo}
                  alt="SceneHunter Logo"
                  className="max-w-[240px] md:max-w-[300px] h-auto"
                  data-aos="fade-down"
                  data-aos-delay="100"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none foreground drop-shadow-md">
                  Find the Perfect Location for Your Shoot
                </h1>
                <p className="max-w-[600px] secondary md:text-xl drop-shadow-md">
                  Connect with location owners and book the ideal space for your next photoshoot, film, or creative project
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-primary/90 hover:bg-primary shadow-lg">
                  <Link to="/locations">
                    Browse Locations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!user ? (
                  <Button variant="outline" size="lg" asChild className="bg-white/10 accent-foreground border-accent/30 backdrop-blur-sm hover:bg-white/20">
                    <Link to="/auth/register">List Your Location</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="lg" asChild className="bg-white/10 accent-foreground border-accent/30 backdrop-blur-sm hover:bg-white/20">
                    <Link to="/locations/new">List Your Location</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last" data-aos="fade-left" data-aos-delay="200">
              <div className="relative w-full h-full bg-transparent">
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="w-full py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4 text-card-foreground">Inspiration for Your Projects</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Browse our collection of unique and breathtaking locations for your creative projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {locationImages.slice(0, 4).map((image, index) => (
              <div
                key={`top-${index}`}
                className="overflow-hidden rounded-xl aspect-[4/3]"
                data-aos="zoom-in"
                data-aos-delay={100 * index}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image}
                  alt={`Location ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {locationImages.slice(4, 8).map((image, index) => (
              <div
                key={`bottom-${index}`}
                className="overflow-hidden rounded-xl aspect-square"
                data-aos="zoom-in"
                data-aos-delay={100 * (index + 4)}
              >
                <img
                  src={image}
                  alt={`Location ${index + 5}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center" data-aos="fade-up">
            <Button asChild size="lg" className="bg-primary/90 hover:bg-primary">
              <Link to="/locations">
                View All Locations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12" data-aos="fade-up">
            <div className="inline-block rounded-lg text-primary-foreground bg-primary/10 px-3 py-1 text-sm">Benefits</div>
            <h2 className="text-3xl font-bold text-primary-foreground tracking-tighter md:text-4xl">Everything You Need For Your Project</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Our platform provides all the tools to find and book the perfect shooting location
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-xl p-6 bg-card shadow-sm border transition-all hover:shadow-md" data-aos="fade-up" data-aos-delay="100">
              <div className="rounded-full bg-primary p-3 foreground">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-foreground">Curated Locations</h3>
              <p className="text-muted-foreground text-center">
                Carefully selected collection of unique spaces that meet professional standards
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-xl p-6 bg-card shadow-sm border transition-all hover:shadow-md" data-aos="fade-up" data-aos-delay="200">
              <div className="rounded-full bg-primary p-3 foreground">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-foreground">Instant Booking</h3>
              <p className="text-muted-foreground text-center">
                Book locations instantly with our streamlined booking system
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-xl p-6 bg-card shadow-sm border transition-all hover:shadow-md" data-aos="fade-up" data-aos-delay="300">
              <div className="rounded-full bg-primary p-3 foreground">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-foreground">Secure Payments</h3>
              <p className="text-muted-foreground text-center">
                Protected transactions with transparent pricing and no hidden fees
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12 mt-8">
            <div className="overflow-hidden rounded-xl shadow-lg" data-aos="fade-right">
              <img
                alt="Luxurious interior space for photo shoots"
                className="aspect-video object-cover w-full transition-transform duration-500 hover:scale-105"
                src="https://visitbaltics.net/wp-content/uploads/2020/08/107513299_1958635880935897_4293986116916895669_o.jpg"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg" data-aos="fade-left">
              <img
                alt="Modern architectural space for film shoots"
                className="aspect-video object-cover w-full transition-transform duration-500 hover:scale-105"
                src="https://visitestonia.com/content-images/501912/hiking-in-estonia-en-003-visit-estonia.jpg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center" data-aos="fade-up">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-muted-foreground">How SceneHunter Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Connecting creative professionals with perfect shooting locations in just a few steps
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-xl border p-6 bg-card shadow-sm transition-all hover:shadow-md" data-aos="fade-up" data-aos-delay="100">
              <div className="rounded-full bg-primary p-4 text-4xl font-bold foreground flex items-center justify-center">
                <Map className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-muted-foreground">Find</h3>
              <p className="text-muted-foreground text-center">
                Browse hundreds of unique locations with detailed information and quality photos
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-xl border p-6 bg-card shadow-sm transition-all hover:shadow-md" data-aos="fade-up" data-aos-delay="200">
              <div className="rounded-full bg-primary p-4 text-4xl font-bold foreground flex items-center justify-center">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-muted-foreground">Book</h3>
              <p className="text-muted-foreground text-center">
                Select dates, submit booking requests and easily secure your perfect location
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-xl border p-6 bg-card shadow-sm transition-all hover:shadow-md" data-aos="fade-up" data-aos-delay="300">
              <div className="rounded-full bg-primary p-4 text-4xl font-bold foreground flex items-center justify-center">
                <Camera className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-muted-foreground">Shoot</h3>
              <p className="text-muted-foreground text-center">
                Arrive at the location and bring your creative vision to life in the perfect setting
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center mt-8" data-aos="zoom-in">
            <Button asChild size="lg" className="bg-primary/90 hover:bg-primary">
              <Link to="/locations">
                Find Your Location Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="w-full py-12 md:py-16 bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8" data-aos="fade-up">
            <h2 className="text-2xl font-bold tracking-tighter md:text-3xl text-primary-foreground">Our Partners</h2>

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center justify-center py-8">
            {/* Partner logos without grayscale effect */}
            <div className="flex items-center justify-center p-4" data-aos="fade-up" data-aos-delay="100">
              <img
                src="https://www.tehnopol.ee/wp-content/uploads/2021/01/Tehnopol_logo_RGB.png"
                alt="Partner 1"
                className="h-12 md:h-16 w-auto object-contain scale-150"
              />
            </div>
            <div className="flex items-center justify-center p-4" data-aos="fade-up" data-aos-delay="200">
              <img
                src="https://www.tehnopol.ee/wp-content/uploads/2021/01/TSI_logo_ENG_RGB.png"
                alt="Partner 2"
                className="h-12 md:h-16 w-auto object-contain scale-150"
              />
            </div>
            <div className="flex items-center justify-center p-4" data-aos="fade-up" data-aos-delay="300">
              <img
                src="/partners/VFF_LOGO.png"
                alt="Partner 3"
                className="h-12 md:h-16 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center p-4" data-aos="fade-up" data-aos-delay="300">
              <img
                src="/partners/IH_Logo.png"
                alt="Partner 3"
                className="h-12 md:h-16 w-auto object-contain scale-150"
              />
            </div>
            <div className="flex items-center justify-center p-4" data-aos="fade-up" data-aos-delay="300">
              <img
                src="/partners/EUIF_Logo.png"
                alt="Partner 3"
                className="h-12 md:h-16 w-auto object-contain scale-250"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col gap-10 px-4 py-10 md:px-6 md:py-16">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-primary-foreground">SceneHunter</h3>
              </div>
              <p className="max-w-[300px] text-muted-foreground text-sm">
                Find the perfect location for photo or video shooting in our collection of unique spaces.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary-foreground">Quick Links</h3>
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
              <h3 className="text-lg font-semibold text-primary-foreground">Legal Information</h3>
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
              <h3 className="text-lg font-semibold text-primary-foreground">Join Us</h3>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Subscribe to our newsletter for latest updates</p>
                <form className="flex space-x-2">
                  <input
                    className="max-w-lg flex-1 border px-3 py-2 text-sm rounded-md text-muted-foreground"
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
              Powered by <span className="font-semibold">Scenest</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}