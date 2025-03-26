import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationCard } from '@/components/locations/location-card';
import { useLocations } from '@/hooks/useLocations';

export default function LocationsPage() {
    const { data: locations, isLoading, error } = useLocations();

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Locations</h1>
                <Button asChild>
                    <Link to="/locations/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Location
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations && locations.length > 0 ? (
                    locations.map((location) => (
                        <LocationCard key={location.id} location={location} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-muted-foreground">
                        No locations found
                    </div>
                )}
            </div>
        </div>
    );
}
