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
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/useLocations";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapView } from '@/components/map/map-view';

export default function LocationDetailsPage() {
    const { id } = useParams();
    const { data: location, isLoading } = useLocation(id!);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!location) {
        return <div className="flex items-center justify-center min-h-screen">Location not found</div>;
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
                <div className="container flex items-center h-16 gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/locations">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-xl font-semibold truncate">{location.title}</h1>
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
            <div className="container mt-6">
                <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden aspect-[2/1]">
                    {location.images.map((image, index) => (
                        <div
                            key={index}
                            className={`relative group cursor-pointer overflow-hidden ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
                        >
                            <img
                                src={image || location.images[0]}
                                alt={`${location.title} - photo ${index + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            {index === 4 && (
                                <Button
                                    className="absolute bottom-2 right-2 bg-white/90 hover:bg-white"
                                    size="sm"
                                >
                                    <Camera className="h-4 w-4 mr-2" />
                                    Show all photos
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="container mt-8">
                <div className="grid grid-cols-1 md:grid-cols-[1fr,400px] gap-12">
                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Title and Price */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-semibold mb-1">{location.title}</h1>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {location.address}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-semibold">{location.price}₽</p>
                                <p className="text-muted-foreground">per hour</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Map */}
                        {location.coordinates && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Location</h2>
                                <MapView
                                    latitude={location.coordinates.latitude}
                                    longitude={location.coordinates.longitude}
                                    zoom={15}
                                    interactive={true}
                                    className="w-full h-[400px] rounded-lg overflow-hidden"
                                />
                            </div>
                        )}

                        <Separator />

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: Users, label: "Up to 10 people" },
                                { icon: Camera, label: `${location.area}м² space` },
                                { icon: Shield, label: "Verified location" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 p-4 rounded-lg border">
                                    <item.icon className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <Separator />

                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">About this location</h2>
                            <p className="text-muted-foreground whitespace-pre-line">
                                {location.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        {location.amenities.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {location.amenities.map((amenity, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                <span>{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Rules */}
                        {location.rules.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Location rules</h2>
                                    <div className="grid gap-2">
                                        {location.rules.map((rule, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                                <span>{rule}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Booking Card */}
                    <div className="relative">
                        <div className="sticky top-24">
                            <Card className="p-6">
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-baseline gap-1 mb-1">
                                            <span className="text-2xl font-bold">{location.price}₽</span>
                                            <span className="text-muted-foreground">/hour</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>Minimum booking: 2 hours</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="border rounded-lg p-3">
                                                <div className="text-sm font-medium">Date</div>
                                                <div className="text-muted-foreground">Select date</div>
                                            </div>
                                            <div className="border rounded-lg p-3">
                                                <div className="text-sm font-medium">Time</div>
                                                <div className="text-muted-foreground">Select time</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border rounded-lg p-3">
                                        <div className="text-sm font-medium">Guests</div>
                                        <div className="text-muted-foreground">Add guests</div>
                                    </div>
                                </div>

                                <Button className="w-full">Book now</Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}