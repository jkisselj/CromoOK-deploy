import { Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProfileEditor } from '@/components/profile/profile-editor';
import { UserLocations } from '@/components/profile/user-locations';
import { useAuthContext } from '@/hooks/useAuthContext';
import { UserCircle, MapPin } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function ProfilePage() {
    const { user } = useAuthContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('profile');
    const location = useLocation();
    const isMobile = useIsMobile();
    const initialLoad = useRef(true);
    const previousPathRef = useRef<string | null>(null);

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        
        if (isMobile) {
            const currentPath = location.pathname + location.search;
            
            if (initialLoad.current || previousPathRef.current !== currentPath) {
                if (tabParam === 'locations') {
                    setActiveTab('locations');
                } else {
                    setActiveTab('profile');
                }
                
                previousPathRef.current = currentPath;
                initialLoad.current = false;
            }
        } else {
            if (tabParam === 'locations') {
                setActiveTab('locations');
            } else {
                setActiveTab('profile');
            }
        }
    }, [searchParams, location, isMobile]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        
        const newSearchParams = new URLSearchParams(searchParams);
        if (value === 'profile') {
            newSearchParams.delete('tab');
        } else {
            newSearchParams.set('tab', value);
        }
        
        if (isMobile) {
            setTimeout(() => {
                setSearchParams(newSearchParams);
            }, 50);
        } else {
            setSearchParams(newSearchParams);
        }
    };

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