import { useParams, Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Clock,
    Share2,
    Heart,
    Camera,
    Users,
    Shield,
    AlertCircle,
    CalendarRange,
    Edit,
    Info,
    ChevronRight,
    LayoutGrid,
    Ruler,
    Check,
    X,
    ChevronLeft,
    MinusCircle,
    PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/useLocations";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapView } from '@/components/map/map-view';
import { DeleteLocationDialog } from '@/components/locations/delete-location-dialog';
import { useAuthContext } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LocationDetailsPage() {
    const { id } = useParams();
    const { data: location, isLoading } = useLocation(id!);
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showGallery, setShowGallery] = useState(false);
    const [showFullscreenImage, setShowFullscreenImage] = useState(false);

    const [bookingHours, setBookingHours] = useState(2);

    const [autoplayPaused, setAutoplayPaused] = useState(false);

    useEffect(() => {
        if (location?.minimumBookingHours) {
            setBookingHours(location.minimumBookingHours);
        }
    }, [location]);

    useEffect(() => {
        if (autoplayPaused) return;

        const timer = setInterval(() => {
            if (location?.images?.length && !showGallery && !showFullscreenImage) {
                setActiveImageIndex(prev =>
                    prev === (location.images.length - 1) ? 0 : prev + 1
                );
            }
        }, 5000);

        return () => clearInterval(timer);
    }, [location?.images?.length, autoplayPaused, showGallery, showFullscreenImage]);

    const pauseAutoplay = () => setAutoplayPaused(true);
    const resumeAutoplay = () => setAutoplayPaused(false);

    const isOwner = user && location?.ownerId === user.id;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-muted-foreground">Loading location details...</p>
                </div>
            </div>
        );
    }

    if (!location) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-6 px-4">
                <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-3xl font-semibold text-center">Location not found</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    The location you're looking for may have been removed or doesn't exist.
                </p>
                <Button asChild size="lg" className="mt-4">
                    <Link to="/locations">Browse other locations</Link>
                </Button>
            </div>
        );
    }

    const displayImages = location.images?.length
        ? location.images
        : Array(5).fill('https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=2940&auto=format&fit=crop');

    const navigateImages = (direction: string) => {
        pauseAutoplay();
        if (direction === 'next') {
            setActiveImageIndex(prev =>
                prev === displayImages.length - 1 ? 0 : prev + 1
            );
        } else {
            setActiveImageIndex(prev =>
                prev === 0 ? displayImages.length - 1 : prev - 1
            );
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Full-width hero area with main image and title overlay */}
            <div
                className="relative w-full rounded-3xl overflow-hidden"
                style={{
                    height: "calc(100vh - 64px)",
                    maxHeight: "75vh",
                    minHeight: "320px"
                }}
                onMouseEnter={pauseAutoplay}
                onMouseLeave={resumeAutoplay}
            >
                <div className="absolute inset-0 overflow-hidden">
                    {displayImages.map((image, idx) => (
                        <img
                            key={idx}
                            src={image}
                            alt={`${location.title} - photo ${idx + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${activeImageIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                                }`}
                        />
                    ))}
                </div>

                {/* Gradient overlay with enhanced aesthetic */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Image navigation controls */}
                <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors z-20"
                    onClick={() => navigateImages('prev')}
                    aria-label="Previous image"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors z-20"
                    onClick={() => navigateImages('next')}
                    aria-label="Next image"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>

                {/* Back button */}
                <Button
                    variant="secondary"
                    size="icon"
                    asChild
                    className="absolute top-6 left-6 rounded-full shadow-lg bg-background/80 backdrop-blur-md z-20"
                >
                    <Link to="/locations">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>

                {/* Action buttons */}
                <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full shadow-lg bg-background/80 backdrop-blur-md"
                        onClick={() => setShowGallery(true)}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full shadow-lg bg-background/80 backdrop-blur-md"
                    >
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full shadow-lg bg-background/80 backdrop-blur-md"
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                </div>

                {/* Fullscreen action */}
                <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-6 right-6 rounded-lg shadow-lg bg-background/80 backdrop-blur-md gap-2 z-20"
                    onClick={() => {
                        setShowFullscreenImage(true);
                        pauseAutoplay();
                    }}
                >
                    <Camera className="h-4 w-4" />
                    <span>View photo</span>
                </Button>

                {/* Image gallery indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {displayImages.slice(0, 5).map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-10 h-1.5 rounded-full transition-all ${activeImageIndex === idx
                                ? "bg-white"
                                : "bg-white/40 hover:bg-white/60"
                                }`}
                            onClick={() => {
                                setActiveImageIndex(idx);
                                pauseAutoplay();
                            }}
                            aria-label={`View image ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Title container with improved styling */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 z-10">
                    <div className="max-w-4xl">
                        <Badge className="mb-3 bg-primary/90 hover:bg-primary text-white">
                            {location.status === "published" ? "Available" : location.status}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                            {location.title}
                        </h1>
                        <div className="flex items-center gap-2 text-white/90">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">{location.address}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left sidebar with admin tools and price */}
                    <div className="order-2 lg:order-1">
                        {/* Price card */}
                        <Card className="sticky top-6">
                            <CardContent className="p-6">
                                <div className="flex items-baseline justify-between mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold">{location.price}€</span>
                                        <span className="text-muted-foreground text-lg">/hour</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>Min {location.minimumBookingHours || 2}h</span>
                                    </div>
                                </div>

                                {/* Booking form */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="h-14 text-left justify-start p-3">
                                            <div className="flex flex-col items-start">
                                                <span className="text-xs text-muted-foreground">Date</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <CalendarRange className="h-4 w-4" />
                                                    <span>Select date</span>
                                                </div>
                                            </div>
                                        </Button>

                                        <Button variant="outline" className="h-14 text-left justify-start p-3">
                                            <div className="flex flex-col items-start">
                                                <span className="text-xs text-muted-foreground">Time</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Select time</span>
                                                </div>
                                            </div>
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border rounded-md h-14">
                                        <div className="flex flex-col items-start">
                                            <span className="text-xs text-muted-foreground">Duration</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Clock className="h-4 w-4" />
                                                <span>{bookingHours} hours</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const minHours = location.minimumBookingHours || 2;
                                                    if (bookingHours > minHours) {
                                                        setBookingHours(bookingHours - 1);
                                                    }
                                                }}
                                                disabled={bookingHours <= (location.minimumBookingHours || 2)}
                                            >
                                                <MinusCircle className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setBookingHours(bookingHours + 1)}
                                            >
                                                <PlusCircle className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full h-14 text-left justify-start p-3">
                                        <div className="flex flex-col items-start">
                                            <span className="text-xs text-muted-foreground">Guests</span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Users className="h-4 w-4" />
                                                <span>Number of people</span>
                                            </div>
                                        </div>
                                    </Button>
                                </div>

                                <Separator className="my-6" />

                                {/* Price breakdown */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span>{location.price}€ × {bookingHours} hours</span>
                                        <span>{location.price * bookingHours}€</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Service fee</span>
                                        <span>{Math.round(location.price * bookingHours * 0.1)}€</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>{location.price * bookingHours + Math.round(location.price * bookingHours * 0.1)}€</span>
                                    </div>
                                </div>

                                <Button className="w-full" size="lg">Book now</Button>
                            </CardContent>
                            <div className="p-4 border-t bg-muted/20">
                                <div className="flex items-center gap-2 text-sm">
                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        You won't be charged yet
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Admin tools section */}
                        {isOwner && (
                            <Card className="mt-6">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">Location management</h2>
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex items-center justify-center gap-2 w-full"
                                            onClick={() => navigate(`/locations/edit/${location.id}`)}
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit Location
                                        </Button>

                                        <DeleteLocationDialog
                                            locationId={location.id}
                                            locationTitle={location.title}
                                            isOwner={isOwner}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Main content middle section */}
                    <div className="order-1 lg:order-2 lg:col-span-2">
                        {/* Quick info cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                            <Card className="border-0 shadow-none bg-muted/20">
                                <CardContent className="p-4 md:p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Capacity</p>
                                            <p className="text-sm text-muted-foreground">
                                                Up to {location.features?.maxCapacity || 10} people
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-none bg-muted/20">
                                <CardContent className="p-4 md:p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                                            <Ruler className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Space</p>
                                            <p className="text-sm text-muted-foreground">
                                                {location.area}m² area
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-none bg-muted/20">
                                <CardContent className="p-4 md:p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-full bg-primary/10 text-primary">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Verified</p>
                                            <p className="text-sm text-muted-foreground">
                                                Qualified location
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tabs for content */}
                        <Tabs defaultValue="details" className="w-full mb-10">
                            <TabsList className="mb-6">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                                <TabsTrigger value="rules">Rules</TabsTrigger>
                                <TabsTrigger value="map">Map</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">About this location</h2>
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="text-muted-foreground whitespace-pre-line">
                                            {location.description}
                                        </p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="amenities">
                                <h2 className="text-2xl font-semibold mb-6">What this place offers</h2>
                                {location.amenities?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                        {location.amenities.map((amenity, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <Check className="h-4 w-4 text-primary" />
                                                <span>{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No amenities listed for this location.</p>
                                )}
                            </TabsContent>

                            <TabsContent value="rules">
                                <h2 className="text-2xl font-semibold mb-6">Location rules</h2>
                                {location.rules?.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {location.rules.map((rule, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-full bg-muted">
                                                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <span>{rule}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No specific rules for this location.</p>
                                )}
                            </TabsContent>

                            <TabsContent value="map">
                                <h2 className="text-2xl font-semibold mb-6">Location on map</h2>
                                {location.coordinates ? (
                                    <MapView
                                        latitude={location.coordinates.latitude}
                                        longitude={location.coordinates.longitude}
                                        zoom={15}
                                        interactive={true}
                                        className="w-full h-[500px] rounded-xl overflow-hidden"
                                    />
                                ) : (
                                    <p className="text-muted-foreground">Map location not available.</p>
                                )}
                            </TabsContent>
                        </Tabs>

                        {/* Image gallery - улучшенная */}
                        <div className="mt-10">
                            <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {displayImages.slice(0, 6).map((image, idx) => (
                                    <div
                                        key={idx}
                                        className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                                        onClick={() => {
                                            setActiveImageIndex(idx);
                                            setShowFullscreenImage(true);
                                        }}
                                    >
                                        <img
                                            src={image}
                                            alt={`Gallery image ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Camera className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                ))}

                                {displayImages.length > 6 && (
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-center gap-2 aspect-[4/3]"
                                        onClick={() => setShowGallery(true)}
                                    >
                                        <Camera className="h-5 w-5 mr-1" />
                                        View all {displayImages.length} photos
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile bottom action bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-40 flex items-center justify-between">
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold">{location.price}€</span>
                        <span className="text-muted-foreground">/hour</span>
                    </div>
                </div>
                <Button size="lg">Book now</Button>
            </div>

            {/* Полноэкранное изображение */}
            {showFullscreenImage && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col">
                    <div className="p-4 flex items-center justify-between text-white/90 bg-black/50">
                        <h3 className="font-medium">Photo {activeImageIndex + 1} of {displayImages.length}</h3>
                        <Button variant="ghost" size="icon" className="text-white hover:text-white/80" onClick={() => setShowFullscreenImage(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex-1 relative">
                        <img
                            src={displayImages[activeImageIndex]}
                            alt={`${location.title} - photo ${activeImageIndex + 1}`}
                            className="absolute inset-0 w-full h-full object-contain"
                        />

                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                            onClick={() => navigateImages('prev')}
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>

                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                            onClick={() => navigateImages('next')}
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            )}

            {/* Улучшенная галерея для просмотра всех фотографий */}
            {showGallery && (
                <div className="fixed inset-0 bg-background z-50 flex flex-col">
                    <div className="p-4 flex items-center justify-between border-b">
                        <h3 className="font-medium">Gallery - {displayImages.length} photos</h3>
                        <Button variant="ghost" size="icon" onClick={() => setShowGallery(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {displayImages.map((image, idx) => (
                                <div
                                    key={idx}
                                    className="relative rounded-md overflow-hidden cursor-pointer group flex items-center justify-center bg-muted/10"
                                    style={{ height: "300px" }}
                                    onClick={() => {
                                        setActiveImageIndex(idx);
                                        setShowGallery(false);
                                        setShowFullscreenImage(true);
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt={`Gallery image ${idx + 1}`}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-black/60 px-3 py-1.5 rounded-md text-white text-sm">
                                            View full size
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}