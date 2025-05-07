import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link2, Copy, Check } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';

interface ShareLocationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    locationId: string;
    locationTitle: string;
    shareToken: string;
}

export function ShareLocationDialog({
    isOpen,
    onClose,
    locationId,
    locationTitle,
    shareToken
}: ShareLocationDialogProps) {
    const [copied, setCopied] = useState(false);

    // Create a URL with a token for shared access
    const shareUrl = `${window.location.origin}/locations/${locationId}?token=${shareToken}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Could not copy text: ', err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-primary" />
                        Share Location
                    </DialogTitle>
                    <DialogDescription>
                        Create a private link to access the location "{locationTitle}".
                        Anyone with this link will be able to view the location, even if it is not published.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 mt-2">
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
                    This link will work until you create a new one or delete the location.
                </div>
                <DialogFooter className="sm:justify-start mt-4">
                    <Button
                        type="button"
                        onClick={copyToClipboard}
                        variant="default"
                        className="w-full sm:w-auto"
                    >
                        {copied ? 'Copied!' : 'Copy link'}
                    </Button>
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}