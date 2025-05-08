import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link2, Copy, Check, Eye, Lock, ShieldCheck } from 'lucide-react';
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCreateLocationShare } from '@/hooks/useLocations';
import { ShareAccessLevel } from '@/types/location';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ShareLocationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    locationId: string;
    locationTitle: string;
}

export function ShareLocationDialog({
    isOpen,
    onClose,
    locationId,
    locationTitle
}: ShareLocationDialogProps) {
    const [copied, setCopied] = useState(false);
    const [accessLevel, setAccessLevel] = useState<ShareAccessLevel>('full_info');
    const [shareName, setShareName] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    
    const createLocationShare = useCreateLocationShare();

    // Handle share link creation depending on the selected access level
    const handleCreateShare = async () => {
        try {
            const share = await createLocationShare.mutateAsync({
                locationId,
                accessLevel,
                name: shareName
            });
            
            // Create the URL with the token for sharing access
            const url = `${window.location.origin}/locations/${locationId}?token=${share.shareToken}&access=${accessLevel}`;
            setShareUrl(url);
        } catch (error) {
            console.error('Error creating share link:', error);
            alert('Failed to create share link');
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Could not copy text: ', err);
        }
    };

    // Reset state when closing dialog
    const handleClose = () => {
        setShareUrl('');
        setCopied(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-primary" />
                        Share Location
                    </DialogTitle>
                    <DialogDescription>
                        Create a link for access to the location "{locationTitle}" with a selected access level.
                    </DialogDescription>
                </DialogHeader>
                
                {!shareUrl ? (
                    // Form for creating a link with access level selection
                    <>
                        <div className="space-y-4 my-2">
                            <div>
                                <Label htmlFor="share-name">Link name (optional)</Label>
                                <Input 
                                    id="share-name"
                                    value={shareName} 
                                    onChange={(e) => setShareName(e.target.value)}
                                    placeholder="Example: for client A"
                                    className="mt-1"
                                />
                            </div>
                            
                            <div>
                                <Label>Access level</Label>
                                <RadioGroup 
                                    value={accessLevel} 
                                    onValueChange={(value) => setAccessLevel(value as ShareAccessLevel)}
                                    className="mt-2 space-y-3"
                                >
                                    <div className="space-y-3">
                                        <Card className={`border-2 transition-colors cursor-pointer ${accessLevel === 'photos_only' ? 'border-primary' : 'border-muted'}`}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <RadioGroupItem value="photos_only" id="photos_only" className="mt-1" />
                                                    <div>
                                                        <Label htmlFor="photos_only" className="flex items-center gap-1.5 text-base font-medium cursor-pointer">
                                                            <Eye className="h-4 w-4 text-gray-500" />
                                                            Photos only
                                                        </Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            The user will only be able to view the location's photos, without access to the title, description, price, and other data.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        
                                        <Card className={`border-2 transition-colors cursor-pointer ${accessLevel === 'full_info' ? 'border-primary' : 'border-muted'}`}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <RadioGroupItem value="full_info" id="full_info" className="mt-1" />
                                                    <div>
                                                        <Label htmlFor="full_info" className="flex items-center gap-1.5 text-base font-medium cursor-pointer">
                                                            <Lock className="h-4 w-4 text-gray-500" />
                                                            Full access
                                                        </Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            The user will be able to see all information about the location, including title, description, price, and other data.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        
                                        <Card className={`border-2 transition-colors cursor-pointer ${accessLevel === 'admin' ? 'border-primary' : 'border-muted'}`}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <RadioGroupItem value="admin" id="admin" className="mt-1" />
                                                    <div>
                                                        <Label htmlFor="admin" className="flex items-center gap-1.5 text-base font-medium cursor-pointer">
                                                            <ShieldCheck className="h-4 w-4 text-gray-500" />
                                                            Admin access
                                                        </Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            The user will have full management rights for the location, including editing and booking.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        
                        <DialogFooter className="mt-4">
                            <Button 
                                onClick={handleCreateShare}
                                disabled={createLocationShare.isPending}
                                className="w-full sm:w-auto"
                            >
                                {createLocationShare.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating link...
                                    </>
                                ) : (
                                    'Create link'
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    // Display created link
                    <>
                        <div className="my-2">
                            <div className="flex items-center gap-1.5 mb-2 text-sm text-muted-foreground">
                                {accessLevel === 'photos_only' && (
                                    <><Eye className="h-4 w-4" /> Access level: photos only</>
                                )}
                                {accessLevel === 'full_info' && (
                                    <><Lock className="h-4 w-4" /> Access level: full access</>
                                )}
                                {accessLevel === 'admin' && (
                                    <><ShieldCheck className="h-4 w-4" /> Access level: admin</>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <Input
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1"
                                />
                                <Button 
                                    type="button" 
                                    size="icon" 
                                    onClick={copyToClipboard}
                                    variant="outline"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            
                            <div className="text-sm text-muted-foreground mt-2">
                                This link will work until you delete it or the location.
                            </div>
                        </div>
                        
                        <DialogFooter className="sm:justify-start mt-4">
                            <Button 
                                type="button" 
                                onClick={copyToClipboard}
                                className="w-full sm:w-auto"
                            >
                                {copied ? 'Copied!' : 'Copy link'}
                            </Button>
                            <Button 
                                type="button" 
                                onClick={() => setShareUrl('')}
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                Create new link
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}