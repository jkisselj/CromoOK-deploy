import { Separator } from '@/components/ui/separator';
import { DataMigrationManager } from '@/components/admin/data-migration-manager';
import { ImageUploadManager } from '@/components/admin/image-upload-manager';
import { useAuthContext } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuthContext();

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col space-y-6 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your preferences and admin settings.
                    </p>
                </div>
                <Separator />

                <Tabs defaultValue="database" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="database">Database</TabsTrigger>
                        <TabsTrigger value="storage">Storage</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="database" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Database Management</CardTitle>
                                <CardDescription>
                                    Manage your Supabase data and migrate demo content.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Your application is using Supabase as its database. Use the tools below to manage your data.
                                </p>

                                <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 flex gap-3 mb-6">
                                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-blue-700 dark:text-blue-300">Migration Tips</h4>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                            Migration will copy demo location data to your Supabase database.
                                            After migration, you need to upload the actual images using the Storage tab.
                                        </p>
                                    </div>
                                </div>

                                <DataMigrationManager />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="storage" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Image Storage Management</CardTitle>
                                <CardDescription>
                                    Upload and manage images in Supabase Storage.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-6">
                                    After migrating location data, you can upload the actual images to Supabase Storage here.
                                </p>

                                <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 flex gap-3 mb-6">
                                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-blue-700 dark:text-blue-300">Upload Tips</h4>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                            This tool will attempt to upload images from your existing locations to Supabase Storage,
                                            and then update the location records with the new image URLs.
                                        </p>
                                    </div>
                                </div>

                                <ImageUploadManager />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Settings</CardTitle>
                                <CardDescription>
                                    Manage your account details and preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Account settings functionality will be available soon.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="appearance">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance Settings</CardTitle>
                                <CardDescription>
                                    Customize how the application looks for you.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Appearance settings functionality will be available soon.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}