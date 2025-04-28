import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteLocation } from '@/hooks/useLocations';

interface DeleteLocationDialogProps {
    locationId: string;
    locationTitle: string;
    isOwner: boolean;
}

export function DeleteLocationDialog({ locationId, locationTitle, isOwner }: DeleteLocationDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteLocation = useDeleteLocation();
    const navigate = useNavigate();

    if (!isOwner) {
        return null;
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteLocation.mutateAsync(locationId);
            alert(`Location "${locationTitle}" has been successfully deleted`);
            navigate('/locations');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to delete location');
        } finally {
            setIsDeleting(false);
            setIsOpen(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                    <Trash className="h-4 w-4" />
                    Delete Location
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Delete Location
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the location "{locationTitle}"? This action cannot be undone,
                        and all location data, including images, will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}