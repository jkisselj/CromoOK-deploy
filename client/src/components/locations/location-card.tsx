import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users, Heart } from 'lucide-react';
import type { Location } from '@/types/location';

interface LocationCardProps {
    location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
    return (
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative">
                <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                        src={location.images[0]}
                        alt={location.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="absolute top-3 left-3 flex gap-2">
                    {location.features?.equipmentIncluded && (
                        <Badge variant="secondary" className="bg-white/90 text-black">
                            Equipment Included
                        </Badge>
                    )}
                    {location.status === 'published' && (
                        <Badge variant="accent" className="bg-green-500/90 text-white">
                            Available
                        </Badge>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700"
                >
                    <Heart className="h-4 w-4" />
                </Button>
            </div>

            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-semibold text-lg leading-tight mb-1">
                            {location.title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {location.address}
                        </p>
                    </div>
                    {location.rating && (
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{location.rating}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>Up to {location.features?.maxCapacity}</span>
                        </div>
                        <span>{location.area}m²</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold">€{location.price}</span>
                        <span className="text-sm text-muted-foreground">/hour</span>
                    </div>
                    <Button asChild>
                        <Link to={`/locations/${location.id}`}>
                            View Details
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
