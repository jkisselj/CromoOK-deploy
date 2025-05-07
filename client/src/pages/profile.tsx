import { Navigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProfileEditor } from '@/components/profile/profile-editor';
import { UserLocations } from '@/components/profile/user-locations';
import { useAuthContext } from '@/hooks/useAuthContext';
import { UserCircle, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const { user } = useAuthContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('profile');

    // Handle URL parameters for selecting the active tab
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'locations') {
            setActiveTab('locations');
        } else {
            setActiveTab('profile');
        }
    }, [searchParams]);

    // Update URL when changing tabs
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === 'profile') {
            // Remove tab parameter from URL for profile, as it's the default tab
            searchParams.delete('tab');
        } else {
            searchParams.set('tab', value);
        }
        setSearchParams(searchParams);
    };

    // Redirect to login page if user is not authenticated
    if (!user) {
        return <Navigate to="/auth/login" />;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col space-y-6 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground mt-1">
                        View and edit your personal information and manage your locations
                    </p>
                </div>

                <Separator />

                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <UserCircle className="h-4 w-4" />
                            <span>Profile</span>
                        </TabsTrigger>
                        <TabsTrigger value="locations" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>My Locations</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6">
                        <ProfileEditor />
                    </TabsContent>

                    <TabsContent value="locations" className="space-y-6">
                        <UserLocations />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}