import React, { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import LocationForm from './LocationForm';
import { useLocation, useLocationShareAccess } from '@/hooks/useLocations';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Loader2 } from 'lucide-react';
import type { ShareAccessLevel } from '@/types/location';

export default function EditLocationPage() {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const shareToken = searchParams.get('token') || '';
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const { data: locationData, isLoading: isLoadingLocation } = id
        ? useLocation(id, shareToken)
        : { data: null, isLoading: false };

    const { data: accessLevel, isLoading: isLoadingAccess } = useLocationShareAccess(id || '', shareToken);

    console.log('Debug access info:', {
        id,
        shareToken,
        user: user ? { id: user.id, email: user.email } : null,
        locationOwnerId: locationData?.ownerId,
        accessLevel,
        isLoadingLocation,
        isLoadingAccess
    });

    const canEdit =
        (user && locationData && locationData.ownerId === user.id) ||
        accessLevel === 'admin' ||
        accessLevel === 'full_info';

    useEffect(() => {
        if (id && locationData && !canEdit && !isLoadingLocation && !isLoadingAccess) {
            console.log('Redirecting due to insufficient permissions');
            navigate(`/locations/${id}${shareToken ? `?token=${shareToken}` : ''}`);
        }
    }, [id, locationData, canEdit, isLoadingLocation, isLoadingAccess, navigate, shareToken]);

    if (isLoadingLocation || isLoadingAccess) {
        return (
            <div className="container max-w-3xl py-8 flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-3">Loading location information...</span>
            </div>
        );
    }

    if (!id) {
        return <div>Error: Location ID not specified</div>;
    }

    if (!canEdit && !isLoadingLocation && !isLoadingAccess) {
        return (
            <div className="container max-w-3xl py-8 flex items-center justify-center flex-col">
                <h2 className="text-xl font-semibold mb-2">You don't have permission to edit this location</h2>
                <p className="text-gray-500 mb-4">
                    You may not have the necessary access rights or the share link may have expired.
                    <br />
                    <small>
                        Token: {shareToken || 'none'},
                        Access level: {accessLevel || 'none'}
                    </small>
                </p>
                <button
                    className="text-blue-500 hover:underline"
                    onClick={() => navigate(`/locations/${id}`)}
                >
                    Return to location view
                </button>
            </div>
        );
    }

    return <LocationForm mode="edit" locationId={id} shareToken={shareToken} />;
}
