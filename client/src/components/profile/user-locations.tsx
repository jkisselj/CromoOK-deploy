import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Trash2, Loader2, MapPin, Eye, MoreHorizontal, Star } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useLocations } from '@/hooks/useLocations';
import { DeleteLocationDialog } from '@/components/locations/delete-location-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function UserLocations() {
    const { user } = useAuthContext();
    const { data: allLocations, isLoading } = useLocations();
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Filter locations by current user
    const userLocations = allLocations?.filter(loc => loc.ownerId === user?.id) || [];

    const handleDeleteClick = (locationId: string) => {
        setSelectedLocationId(locationId);
        setIsDeleteDialogOpen(true);
    };

    const onDeleteDialogClose = () => {
        setIsDeleteDialogOpen(false);
        setSelectedLocationId(null);
    };

    const selectedLocation = userLocations.find(loc => loc.id === selectedLocationId);

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>My Locations</CardTitle>
                        <CardDescription>Manage your created locations</CardDescription>
                    </div>

                    <Button asChild>
                        <Link to="/locations/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Link>
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : userLocations.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="rounded-full bg-muted/50 p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">You don't have any locations yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                            Create your first location that will be available for booking
                        </p>
                        <Button asChild>
                            <Link to="/locations/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Location
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {userLocations.map((location) => (
                            <div key={location.id} className="flex flex-col sm:flex-row border rounded-lg overflow-hidden bg-card">
                                <div className="relative w-full sm:w-40 h-32">
                                    <img
                                        src={location.images[0] || 'https://via.placeholder.com/150'}
                                        alt={location.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden flex items-end">
                                        <div className="p-3">
                                            <h3 className="text-white font-medium truncate">{location.title}</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-4 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="hidden sm:block">
                                            <h3 className="font-medium text-lg mb-1">{location.title}</h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-2">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <span className="truncate">{location.address}</span>
                                            </p>
                                        </div>

                                        <Badge className={
                                            location.status === 'published'
                                                ? 'bg-green-500 hover:bg-green-600'
                                                : location.status === 'draft'
                                                    ? 'bg-amber-500 hover:bg-amber-600'
                                                    : 'bg-red-500 hover:bg-red-600'
                                        }>
                                            {location.status === 'published' ? 'Published' :
                                                location.status === 'draft' ? 'Draft' : 'Archived'}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mt-auto pt-3 sm:pt-0">
                                        <Button size="sm" variant="outline" asChild>
                                            <Link to={`/locations/${location.id}`}>
                                                <Eye className="mr-1 h-3.5 w-3.5" />
                                                View
                                            </Link>
                                        </Button>

                                        <Button size="sm" variant="outline" asChild>
                                            <Link to={`/locations/edit/${location.id}`}>
                                                <Edit className="mr-1 h-3.5 w-3.5" />
                                                Edit
                                            </Link>
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDeleteClick(location.id)}
                                        >
                                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                                            Delete
                                        </Button>

                                        <div className="ml-auto sm:ml-0">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {location.status !== 'published' && (
                                                        <DropdownMenuItem>
                                                            Publish
                                                        </DropdownMenuItem>
                                                    )}
                                                    {location.status === 'published' && (
                                                        <DropdownMenuItem>
                                                            Unpublish
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem>
                                                        Duplicate
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            {selectedLocation && (
                <DeleteLocationDialog
                    locationId={selectedLocation.id}
                    locationTitle={selectedLocation.title}
                    isOpen={isDeleteDialogOpen}
                    onClose={onDeleteDialogClose}
                    isOwner={true}
                />
            )}
        </Card>
    );
}