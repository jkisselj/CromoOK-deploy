import { Link } from 'react-router-dom';
import { Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationCard } from '@/components/locations/location-card';
import { useLocations } from '@/hooks/useLocations';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useState } from 'react';
import {
    LocationFilter,
    FilterOptions
} from '@/components/locations/location-filter';

export default function LocationsPage() {
    const [filters, setFilters] = useState<FilterOptions>({});
    const { data: locations, isLoading, error } = useLocations();
    const { user } = useAuthContext();

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters);

        console.log("Applied filters:", newFilters);
    };

    const filteredLocations = locations?.filter(location => {
        if (filters.search && !location.title.toLowerCase().includes(filters.search.toLowerCase()) &&
            !location.address.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }

        if (filters.priceMin && location.price < filters.priceMin) return false;
        if (filters.priceMax && location.price > filters.priceMax) return false;


        return true;
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Loading locations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-lg max-w-md">
                    <h3 className="font-semibold mb-2">Error Loading Locations</h3>
                    <p>{error.message || "Failed to load locations. Please try again later."}</p>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-7xl mx-auto py-4 md:py-8 px-4 md:px-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Shooting Locations</h1>
                    <p className="text-muted-foreground mt-1">
                        {filteredLocations?.length || 0} locations available
                    </p>
                </div>

                {user && (
                    <Button asChild className="w-full sm:w-auto">
                        <Link to="/locations/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Location
                        </Link>
                    </Button>
                )}
            </div>

            {/* Filter section */}
            <div className="mb-6">
                <LocationFilter onFilterChange={handleFilterChange} />
            </div>

            {/* Location grid */}
            {filteredLocations && filteredLocations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredLocations.map((location) => (
                        <LocationCard
                            key={location.id}
                            id={location.id}
                            title={location.title}
                            description={location.description}
                            imageUrl={location.imageUrl || (location.images && location.images.length > 0 ? location.images[0] : '/placeholder-image.jpg')}
                            address={location.address}
                            rating={location.rating}
                            price={location.price}
                            currency={location.currency}
                            categories={location.categories}
                            availability={location.availability?.status || "Available"}
                        />
                    ))}
                </div>
            ) : (
                <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg">
                    <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="h-8 w-8 text-muted-foreground/60" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Locations Found</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                        {filters.search || Object.keys(filters).length > 0
                            ? "No locations match your current filters. Try adjusting your search criteria."
                            : "There are no locations available at the moment."}
                    </p>
                    {(filters.search || Object.keys(filters).length > 0) && (
                        <Button
                            variant="outline"
                            onClick={() => setFilters({})}
                        >
                            Clear All Filters
                        </Button>
                    )}
                </div>
            )}

            {/* Featured section - when there are results
            {filteredLocations && filteredLocations.length > 0 && (
                <div className="mt-16 mb-8">
                    <div className="bg-muted/50 rounded-lg border p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-semibold">Need help finding a location?</h2>
                        </div>

                        <p className="text-muted-foreground mb-6 max-w-3xl">
                            Our location scouts can help you find the perfect spot for your photo or video shoot,
                            even if it's not listed on our platform. Tell us what you're looking for.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button>Request Location Scout</Button>
                            <Button variant="outline">See How It Works</Button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
}
