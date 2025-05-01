import { Link, useLocation as useRouterLocation } from 'react-router-dom';
import { Plus, Search, Filter, SlidersHorizontal, Loader2, MapPin, Grid, List, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationCard } from '@/components/locations/location-card';
import { useLocations } from '@/hooks/useLocations';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
    SheetFooter
} from "@/components/ui/sheet";
import { type Location, type LocationFilter } from '@/types/location';

type SortOption = {
    label: string;
    value: keyof Location | 'rating' | 'price';
    direction: 'asc' | 'desc';
};

type ViewMode = 'grid' | 'list' | 'map';

export default function LocationsPage() {
    const { data: locations, isLoading } = useLocations();
    const { user } = useAuthContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<LocationFilter>({});
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortOption, setSortOption] = useState<SortOption>({
        label: 'Newest first',
        value: 'createdAt',
        direction: 'desc'
    });
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const routerLocation = useRouterLocation();

    // Восстановление позиции прокрутки при возврате на страницу
    useEffect(() => {
        const savedScrollPosition = sessionStorage.getItem('locationsScrollPosition');
        if (savedScrollPosition && routerLocation.state?.from === 'details') {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedScrollPosition, 10));
            }, 100);
            sessionStorage.removeItem('locationsScrollPosition');
        }
    }, [routerLocation]);

    const filteredLocations = locations?.filter(loc => {
        if (searchQuery &&
            !loc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !loc.address.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        if (activeFilters.minPrice && loc.price < activeFilters.minPrice) return false;
        if (activeFilters.maxPrice && loc.price > activeFilters.maxPrice) return false;

        if (activeFilters.minArea && loc.area < activeFilters.minArea) return false;
        if (activeFilters.maxArea && loc.area > activeFilters.maxArea) return false;

        if (activeFilters.amenities && activeFilters.amenities.length > 0) {
            const hasAllSelectedAmenities = activeFilters.amenities.every(
                amenity => loc.amenities.includes(amenity)
            );
            if (!hasAllSelectedAmenities) return false;
        }

        return true;
    });

    const sortedLocations = [...(filteredLocations || [])].sort((a, b) => {
        if (sortOption.value === 'price') {
            return sortOption.direction === 'asc'
                ? a.price - b.price
                : b.price - a.price;
        } else if (sortOption.value === 'rating') {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            return sortOption.direction === 'asc'
                ? ratingA - ratingB
                : ratingB - ratingA;
        } else if (sortOption.value === 'createdAt') {
            return sortOption.direction === 'asc'
                ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
    });

    const clearFilters = () => {
        setActiveFilters({});
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const sortOptions: SortOption[] = [
        { label: 'Newest first', value: 'createdAt', direction: 'desc' },
        { label: 'Oldest first', value: 'createdAt', direction: 'asc' },
        { label: 'Price: high to low', value: 'price', direction: 'desc' },
        { label: 'Price: low to high', value: 'price', direction: 'asc' },
        { label: 'Rating: high to low', value: 'rating', direction: 'desc' },
        { label: 'Rating: low to high', value: 'rating', direction: 'asc' },
    ];

    const priceRanges = [
        { min: null, max: 50, label: 'Up to 50€' },
        { min: 50, max: 100, label: '50€ - 100€' },
        { min: 100, max: 200, label: '100€ - 200€' },
        { min: 200, max: null, label: 'From 200€' },
    ];

    const availableAmenities = locations?.reduce((acc, location) => {
        location.amenities.forEach(amenity => {
            if (!acc.includes(amenity)) {
                acc.push(amenity);
            }
        });
        return acc;
    }, [] as string[]) || [];

    return (
        <div className="container py-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between text-primary-foreground items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
                    {user && (
                        <Button asChild>
                            <Link to="/locations/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Location
                            </Link>
                        </Button>
                    )}
                </div>

                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by title or address..."
                                    className="pl-9 pr-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                                        onClick={clearSearch}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="gap-2">
                                            <Filter className="h-4 w-4" />
                                            <span className="hidden sm:inline">Filters</span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[300px] sm:w-[400px] ">
                                        <SheetHeader>
                                            <SheetTitle className="text-primary-foreground">Location Filters</SheetTitle>
                                            <SheetDescription>
                                                Configure parameters to find your ideal location
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="mt-6 space-y-6">
                                            <div>
                                                <h3 className="text-sm font-medium mb-3 text-primary-foreground">Hourly Rate</h3>
                                                <div className="grid grid-cols-2 gap-2 mb-6">
                                                    {priceRanges.map((range, index) => (
                                                        <Button
                                                            key={index}
                                                            variant={
                                                                activeFilters.minPrice === range.min &&
                                                                    activeFilters.maxPrice === range.max
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            className="justify-start text-primary-foreground"
                                                            onClick={() => setActiveFilters({
                                                                ...activeFilters,
                                                                minPrice: range.min === null ? undefined : range.min,
                                                                maxPrice: range.max === null ? undefined : range.max
                                                            })}
                                                        >
                                                            {range.label}
                                                        </Button>
                                                    ))}
                                                    <Slider
                                                        value={priceRange}
                                                        onValueChange={(value) => {
                                                            setPriceRange(value as number[]);
                                                            setActiveFilters({
                                                                ...activeFilters,
                                                                minPrice: value[0],
                                                                maxPrice: value[1]
                                                            });
                                                        }}
                                                        min={0}
                                                        max={10000}
                                                        step={100}
                                                        showValues
                                                        valuePosition="bottom"
                                                        formatValue={(value) => `${value}€`}
                                                        className="my-4"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium mb-3 text-primary-foreground">Amenities</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {availableAmenities.slice(0, 8).map((amenity, index) => (
                                                        <Button
                                                            key={index}
                                                            variant={
                                                                activeFilters.amenities?.includes(amenity)
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            size="sm"
                                                            className="justify-start text-primary-foreground"
                                                            onClick={() => {
                                                                const currentAmenities = activeFilters.amenities || [];
                                                                const newAmenities = currentAmenities.includes(amenity)
                                                                    ? currentAmenities.filter(a => a !== amenity)
                                                                    : [...currentAmenities, amenity];

                                                                setActiveFilters({
                                                                    ...activeFilters,
                                                                    amenities: newAmenities.length ? newAmenities : undefined
                                                                });
                                                            }}
                                                        >
                                                            {amenity}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <SheetFooter className="absolute bottom-0 left-0 right-0 p-6">
                                            <div className="flex w-full justify-between text-primary-foreground">
                                                <Button variant="outline" onClick={clearFilters}>
                                                    Reset All
                                                </Button>
                                                <SheetClose asChild>
                                                    <Button>Apply</Button>
                                                </SheetClose>
                                            </div>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="gap-2">
                                            <SlidersHorizontal className="h-4 w-4" />
                                            <span className="hidden sm:inline">Sort</span>
                                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel className="text-primary-foreground">Sort by</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            {sortOptions.map((option) => (
                                                <DropdownMenuItem
                                                    key={`${option.value}-${option.direction}`}
                                                    className={
                                                        sortOption.value === option.value &&
                                                            sortOption.direction === option.direction
                                                            ? "bg-accent text-primary-foreground"
                                                            : "text-primary-foreground"
                                                    }
                                                    onClick={() => setSortOption(option)}
                                                >
                                                    {option.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div className="flex border rounded-md">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="icon"
                                        className="rounded-r-none h-9 w-9"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid className="h-4 w-4" />
                                        <span className="sr-only">Grid view</span>
                                    </Button>
                                    <Separator orientation="vertical" />
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="icon"
                                        className="rounded-l-none h-9 w-9"
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List className="h-4 w-4" />
                                        <span className="sr-only">List view</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {(searchQuery || Object.keys(activeFilters).length > 0) && (
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-primary-foreground mr-2">Active filters:</span>

                        {searchQuery && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <span className="text-primary-foreground">Search: {searchQuery}</span>
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={clearSearch}
                                />
                            </Badge>
                        )}

                        {activeFilters.minPrice !== undefined && activeFilters.maxPrice !== undefined && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <span className="text-primary-foreground">
                                    {activeFilters.minPrice === null
                                        ? `Up to ${activeFilters.maxPrice}€`
                                        : activeFilters.maxPrice === null
                                            ? `From ${activeFilters.minPrice}€`
                                            : `${activeFilters.minPrice}€ - ${activeFilters.maxPrice}€`
                                    }
                                </span>
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => setActiveFilters({
                                        ...activeFilters,
                                        minPrice: undefined,
                                        maxPrice: undefined
                                    })}
                                />
                            </Badge>
                        )}

                        {activeFilters.amenities?.map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                <span className="text-primary-foreground">{amenity}</span>
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => {
                                        const newAmenities = activeFilters.amenities?.filter(a => a !== amenity);
                                        setActiveFilters({
                                            ...activeFilters,
                                            amenities: newAmenities?.length ? newAmenities : undefined
                                        });
                                    }}
                                />
                            </Badge>
                        ))}

                        {(Object.keys(activeFilters).length > 0 || searchQuery) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    clearFilters();
                                    clearSearch();
                                }}
                            >
                                Clear all
                            </Button>
                        )}
                    </div>
                )}

                <Separator />

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                        <p className="text-muted-foreground">Loading locations...</p>
                    </div>
                ) : sortedLocations && sortedLocations.length > 0 ? (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                {sortedLocations.map((location) => (
                                    <LocationCard key={location.id} location={location} />
                                ))}
                            </div>
                        ) : viewMode === 'list' ? (
                            <div className="flex flex-col gap-4 animate-fade-in">
                                {sortedLocations.map((location) => (
                                    <Card key={location.id} className="overflow-hidden">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="sm:w-48 h-36 sm:h-auto relative">
                                                <img
                                                    src={location.images[0] || 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=2940&auto=format&fit=crop'}
                                                    alt={location.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <CardContent className="flex-1 p-4 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-semibold text-lg text-primary-foreground">{location.title}</h3>
                                                        <div className="flex items-center gap-1">
                                                            {location.rating && (
                                                                <Badge variant="secondary">⭐ {location.rating}</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-2">
                                                        <MapPin className="h-3.5 w-3.5" /> {location.address}
                                                    </p>
                                                    <div className="hidden sm:flex flex-wrap gap-2 mt-2">
                                                        {location.amenities.slice(0, 3).map((amenity, index) => (
                                                            <Badge key={index} variant="outline">
                                                                {amenity}
                                                            </Badge>
                                                        ))}
                                                        {location.amenities.length > 3 && (
                                                            <Badge variant="outline">
                                                                +{location.amenities.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div>
                                                        <span className="font-bold text-lg text-primary-foreground">{location.price}€</span>
                                                        <span className="text-sm text-muted-foreground">/hour</span>
                                                    </div>
                                                    <Button asChild size="sm">
                                                        <Link to={`/locations/${location.id}`}>
                                                            View Details
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center p-12 rounded-md border">
                                <div className="text-center">
                                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Map View Coming Soon</h3>
                                    <p className="text-muted-foreground mb-4">
                                        This feature will be available soon
                                    </p>
                                    <Button onClick={() => setViewMode('grid')}>
                                        Return to Grid View
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Showing {sortedLocations.length} of {locations?.length || 0} locations
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="bg-muted/50 rounded-full p-4 mb-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-1 text-primary-foreground">No Locations Found</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            {searchQuery || Object.keys(activeFilters).length > 0
                                ? `No locations match your search criteria. Try adjusting your filters.`
                                : 'There are no locations available at the moment. Check back later or create a new location.'}
                        </p>
                        {user && !(searchQuery || Object.keys(activeFilters).length > 0) && (
                            <Button asChild className="mt-6">
                                <Link to="/locations/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Location
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
