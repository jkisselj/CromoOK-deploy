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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/useLocations";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapView } from '@/components/map/map-view';
import { DeleteLocationDialog } from '@/components/locations/delete-location-dialog';
import { useAuthContext } from '@/context/AuthContext';
import { cn } from "@/lib/utils";

export default function LocationDetailsPage() {
    const { id } = useParams();
    const { data: location, isLoading } = useLocation(id!);
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const isOwner = user && location?.ownerId === user.id;

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!location) {
        return <div className="flex items-center justify-center min-h-screen">Location not found</div>;
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b text-card-foreground">
                <div className="container flex items-center h-16 gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/locations">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-xl font-semibold truncate">{location.title}</h1>
                    <div className="ml-auto flex items-center gap-2">
                        {isOwner && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="text-primary"
                                onClick={() => navigate(`/locations/edit/${location.id}`)}
                            >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Редактировать локацию</span>
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" aria-label="Share location">
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Save to favorites">
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Gallery */}
            <div className="container mt-6">
                <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden aspect-[2/1] text-card-foreground">
                    {(location.images.length ? location.images : Array(5).fill(location.images[0])).map((image, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative group cursor-pointer overflow-hidden",
                                index === 0 && "col-span-2 row-span-2"
                            )}
                        >
                            <img
                                src={image || 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=2940&auto=format&fit=crop'}
                                alt={`${location.title} - photo ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {index === 4 && (
                                <Button
                                    className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-foreground"
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
            <div className="container mt-8 text-card-foreground">
                <div className="grid grid-cols-1 md:grid-cols-[1fr,400px] gap-12">
                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Title and Price */}
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-2xl font-semibold">{location.title}</h1>
                                    <Badge variant="secondary" className="ml-2">
                                        {location.status === "published" ? "Available" : location.status}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {location.address}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-semibold">{location.price}€</p>
                                <p className="text-muted-foreground">per hour</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Owner actions - delete button */}
                        {isOwner && (
                            <>
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Manage Location</h2>
                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2"
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
                                </div>
                                <Separator />
                            </>
                        )}

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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="bg-background/50 hover:bg-background transition-colors">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <div className="bg-primary/10 text-primary rounded-full p-2">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Capacity</p>
                                        <p className="text-sm text-muted-foreground">Up to {location.features?.maxCapacity || 10} people</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-background/50 hover:bg-background transition-colors">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <div className="bg-primary/10 text-primary rounded-full p-2">
                                        <Camera className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Space</p>
                                        <p className="text-sm text-muted-foreground">{location.area}m² area</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-background/50 hover:bg-background transition-colors">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <div className="bg-primary/10 text-primary rounded-full p-2">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Verified</p>
                                        <p className="text-sm text-muted-foreground">Quality checked location</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Separator />

                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">About this location</h2>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {location.description}
                                </p>
                            </div>
                        </div>

                        {/* Amenities */}
                        {location.amenities.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                        {location.amenities.map((amenity, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                <span className="text-muted-foreground">{amenity}</span>
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
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {location.rules.map((rule, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">{rule}</span>
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
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-baseline gap-1 mb-1">
                                                <span className="text-2xl font-bold">{location.price}€</span>
                                                <span className="text-muted-foreground">/hour</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>Minimum booking: 2 hours</span>
                                            </div>
                                        </div>

                                        <div className="rounded-md border p-4">
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <Button variant="outline" className="justify-start h-auto py-3">
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-xs text-muted-foreground">Date</span>
                                                        <div className="flex items-center gap-2">
                                                            <CalendarRange className="h-4 w-4" />
                                                            <span>Select date</span>
                                                        </div>
                                                    </div>
                                                </Button>
                                                <Button variant="outline" className="justify-start h-auto py-3">
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-xs text-muted-foreground">Time</span>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Select time</span>
                                                        </div>
                                                    </div>
                                                </Button>
                                            </div>
                                            <Button variant="outline" className="justify-start h-auto py-3 w-full">
                                                <div className="flex flex-col items-start">
                                                    <span className="text-xs text-muted-foreground">Guests</span>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4" />
                                                        <span>Add guests</span>
                                                    </div>
                                                </div>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" size="lg">Book now</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}