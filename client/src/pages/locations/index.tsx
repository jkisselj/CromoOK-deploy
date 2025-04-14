import { Link } from 'react-router-dom';
import { Plus, Search, Filter, SlidersHorizontal, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationCard } from '@/components/locations/location-card';
import { useLocations } from '@/hooks/useLocations';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

export default function LocationsPage() {
    const { data: locations, isLoading } = useLocations();
    const { user } = useAuthContext();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLocations = searchQuery
        ? locations?.filter(loc =>
            loc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.address.toLowerCase().includes(searchQuery.toLowerCase()))
        : locations;

    return (
        <div className="container py-8">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-bold">Locations</h1>
                    {user && (
                        <Button asChild>
                            <Link to="/locations/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Location
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Search and Filter Bar */}
                <Card className="border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search locations..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="gap-2">
                                    <Filter className="h-4 w-4" />
                                    <span className="hidden sm:inline">Filters</span>
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span className="hidden sm:inline">Sort</span>
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span className="hidden sm:inline">Map View</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Filters (example) */}
                <div className="flex flex-wrap gap-2">
                </div>

                <Separator />

                {/* Locations Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                        <p className="text-muted-foreground">Loading locations...</p>
                    </div>
                ) : filteredLocations && filteredLocations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLocations.map((location) => (
                            <LocationCard key={location.id} location={location} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="bg-muted/50 rounded-full p-4 mb-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-1">No locations found</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            {searchQuery
                                ? `We couldn't find any locations matching "${searchQuery}". Try adjusting your search terms.`
                                : 'There are no locations available at the moment. Check back later or create a new location.'}
                        </p>
                        {user && !searchQuery && (
                            <Button asChild className="mt-6">
                                <Link to="/locations/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your Location
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
