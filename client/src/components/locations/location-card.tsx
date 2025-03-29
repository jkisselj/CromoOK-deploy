import { Link } from "react-router-dom";
import { Camera, MapPin, Clock, Star, Users, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface LocationCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    address: string;
    rating?: number;
    price?: number;
    currency?: string;
    categories?: string[];
    availability?: string;
    className?: string;
}

export function LocationCard({
    id,
    title,
    description,
    imageUrl,
    address,
    rating = 0,
    price = 0,
    currency = "USD",
    categories = [],
    availability = "Available",
    className,
}: LocationCardProps) {
    const [imageError, setImageError] = useState(false);

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(price);

    const truncatedDescription = description.length > 100
        ? `${description.substring(0, 100)}...`
        : description;

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
            {/* Image container with overlay for categories */}
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {!imageError ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                )}

                {/* Categories */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {categories.slice(0, 2).map((category) => (
                        <Badge key={category} variant="secondary" className="bg-black/70 hover:bg-black/80">
                            {category}
                        </Badge>
                    ))}
                    {categories.length > 2 && (
                        <Badge variant="secondary" className="bg-black/70 hover:bg-black/80">
                            +{categories.length - 2}
                        </Badge>
                    )}
                </div>

                {/* Price badge */}
                <div className="absolute bottom-2 right-2">
                    <Badge variant="default" className="text-xs font-medium px-2 py-1">
                        {formattedPrice} / day
                    </Badge>
                </div>

                {/* Availability indicator */}
                <div className="absolute top-2 right-2">
                    <div className="flex items-center gap-1.5 bg-black/70 rounded-md px-2 py-1">
                        <span className={cn(
                            "h-2 w-2 rounded-full",
                            availability === "Available" ? "bg-green-500" : "bg-amber-500"
                        )}></span>
                        <span className="text-xs text-white">{availability}</span>
                    </div>
                </div>
            </div>

            <CardContent className="p-4">
                {/* Title and rating */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
                    {rating > 0 && (
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Address */}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{address}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
                    {truncatedDescription}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                        <Camera className="h-3.5 w-3.5" />
                        <span>Suitable for photography</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Flexible schedule</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>10+ people</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Button variant="outline" size="sm" asChild>
                    <Link to={`/locations/${id}`}>More details</Link>
                </Button>
                <Button size="sm" asChild>
                    <Link to={`/locations/${id}`}>Book now</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}