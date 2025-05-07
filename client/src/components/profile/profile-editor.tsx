import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useAvatarUploader } from '@/hooks/useAvatarUploader';
import { Edit, Upload, User, Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ProfileEditor() {
    const { user, updateProfile } = useAuthContext();
    const { uploadAvatar, isUploading, progress } = useAvatarUploader();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        username: user?.user_metadata?.username || '',
        fullName: user?.user_metadata?.full_name || '',
        bio: user?.user_metadata?.bio || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            await updateProfile({
                username: formData.username,
                fullName: formData.fullName,
                bio: formData.bio
            });

            toast({
                title: 'Profile Updated',
                description: 'Your profile information has been successfully updated',
            });

            setIsEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while updating your profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await uploadAvatar(file);

        // Reset input to allow uploading the same file again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (!user) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>You need to be logged in to view your profile</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>User Profile</CardTitle>
                        <CardDescription>View and update your profile information</CardDescription>
                    </div>
                    {!isEditing && (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-background">
                                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.username || user.email} />
                                <AvatarFallback className="text-3xl">
                                    {user.user_metadata?.username?.[0]?.toUpperCase() ||
                                        user.user_metadata?.full_name?.[0]?.toUpperCase() ||
                                        user.email?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                            />

                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-0 right-0 rounded-full"
                                onClick={triggerFileInput}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Camera className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        {isUploading && (
                            <div className="w-full space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span>Uploading...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-1" />
                            </div>
                        )}

                        <div className="text-center">
                            <h3 className="font-medium text-lg">
                                {user.user_metadata?.full_name || user.user_metadata?.username || user.email}
                            </h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    <Separator orientation="vertical" className="hidden md:block" />
                    <Separator className="md:hidden" />

                    {/* Profile form */}
                    <div className="flex-1">
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Your username"
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">About</Label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                    disabled={!isEditing}
                                    className="resize-none"
                                />
                            </div>

                            {isEditing && (
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                username: user.user_metadata?.username || '',
                                                fullName: user.user_metadata?.full_name || '',
                                                bio: user.user_metadata?.bio || '',
                                            });
                                        }}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save'
                                        )}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}