import { useParams, Link } from "react-router-dom";
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
    ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/useLocations";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapView } from '@/components/map/map-view';
import { useState } from "react";

export default function LocationDetailsPage() {
    const { id } = useParams();
    const { data: location, isLoading } = useLocation(id!);
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

    const handleImageError = (index: number) => {
        setImageErrors(prev => ({ ...prev, [index]: true }));
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!location) {
        return <div className="flex items-center justify-center min-h-screen">Location not found</div>;
    }

    return (
        <div className="min-h-screen pb-10 md:pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
                <div className="container flex items-center h-14 md:h-16 gap-4">
                    <Button variant="ghost" size="icon" asChild className="flex md:hidden">
                        <Link to="/locations">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="hidden md:flex items-center">
                        <Link to="/locations">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Locations
                        </Link>
                    </Button>
                    <h1 className="text-lg md:text-xl font-semibold truncate">{location.title}</h1>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Gallery */}
            <div className="container mt-4 md:mt-6 px-4 md:px-6">
                {location.images && location.images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 rounded-xl overflow-hidden aspect-auto md:aspect-[2/1]">
                        <div className="relative group cursor-pointer overflow-hidden md:col-span-2 md:row-span-2">
                            {!imageErrors[0] ? (
                                <img
                                    src={location.images[0]}
                                    alt={`${location.title} - photo 1`}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    onError={() => handleImageError(0)}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                    <ImageIcon className="h-20 w-20 text-muted-foreground/40" />
                                </div>
                            )}
                        </div>
                        {location.images.slice(1, 5).map((image, index) => (
                            <div
                                key={index + 1}
                                className="relative group cursor-pointer overflow-hidden hidden md:block"
                            >
                                {!imageErrors[index + 1] ? (
                                    <img
                                        src={image}
                                        alt={`${location.title} - photo ${index + 2}`}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        onError={() => handleImageError(index + 1)}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                        <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                                    </div>
                                )}
                                {index === 3 && location.images.length > 5 && (
                                    <Button
                                        className="absolute bottom-2 right-2 bg-background/90 hover:bg-background"
                                        size="sm"
                                    >
                                        <Camera className="h-4 w-4 mr-2" />
                                        Show all photos ({location.images.length})
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl overflow-hidden bg-muted aspect-[2/1] flex items-center justify-center">
                        <Camera className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="container mt-6 md:mt-8 px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-6 md:gap-12">
                    {/* Main Content */}
                    <div className="space-y-6 md:space-y-8">
                        {/* Title and Price */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div>
                                <h1 className="text-xl md:text-2xl font-semibold mb-1">{location.title}</h1>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                    <span className="line-clamp-1">{location.address}</span>
                                </p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-xl md:text-2xl font-semibold">{location.price}₽</p>
                                <p className="text-muted-foreground">per hour</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Map */}
                        {location.coordinates && (
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold mb-4">Location</h2>
                                <MapView
                                    latitude={location.coordinates.latitude}
                                    longitude={location.coordinates.longitude}
                                    zoom={15}
                                    interactive={true}
                                    className="w-full h-[250px] md:h-[400px] rounded-lg overflow-hidden"
                                />
                            </div>
                        )}

                        <Separator />

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                            {[
                                { icon: Users, label: "Up to 10 people" },
                                { icon: Camera, label: `${location.area}m² space` },
                                { icon: Shield, label: "Verified location" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 p-3 md:p-4 rounded-lg border">
                                    <item.icon className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                                    <span className="font-medium text-sm md:text-base">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <Separator />

                        {/* Description */}
                        <div>
                            <h2 className="text-lg md:text-xl font-semibold mb-4">About this location</h2>
                            <p className="text-muted-foreground whitespace-pre-line text-sm md:text-base">
                                {location.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        {location.amenities && location.amenities.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h2 className="text-lg md:text-xl font-semibold mb-4">What this place offers</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                        {location.amenities.map((amenity, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                <span className="text-sm md:text-base">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Rules */}
                        {location.rules && location.rules.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h2 className="text-lg md:text-xl font-semibold mb-4">Location rules</h2>
                                    <div className="grid gap-2">
                                        {location.rules.map((rule, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-sm md:text-base">{rule}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Booking Card */}
                    <div className="relative">
                        <div className="lg:sticky lg:top-24">
                            <Card className="p-4 md:p-6">
                                <div className="space-y-4 md:space-y-6">
                                    <div>
                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span className="text-xl md:text-2xl font-bold">{location.price}₽</span>
                                            <span className="text-muted-foreground">/hour</span>
                                        </div>

                                        <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>Minimum booking: 2 hours</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="border rounded-lg p-3">
                                                <div className="text-xs md:text-sm font-medium">Date</div>
                                                <div className="text-muted-foreground text-xs md:text-sm">Select date</div>
                                            </div>
                                            <div className="border rounded-lg p-3">
                                                <div className="text-xs md:text-sm font-medium">Time</div>
                                                <div className="text-muted-foreground text-xs md:text-sm">Select time</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border rounded-lg p-3">
                                        <div className="text-xs md:text-sm font-medium">Guests</div>
                                        <div className="text-muted-foreground text-xs md:text-sm">Add guests</div>
                                    </div>

                                    <Button className="w-full">Book now</Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}