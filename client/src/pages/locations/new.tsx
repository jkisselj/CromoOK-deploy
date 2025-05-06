import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateLocation } from "@/hooks/useLocations";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X, Upload, Loader2, Star, ArrowLeft as ArrowLeftIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { LocationPicker } from "@/components/map/location-picker";
import { Badge } from "@/components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { initializeStorage } from "@/lib/imageService";
import { useImageUploader } from "@/hooks/useImageUploader";
import { Progress } from "@/components/ui/progress";

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    address: z.string().min(1, "Address is required"),
    price: z.number().min(0, "Price must be positive"),
    area: z.number().min(0, "Area must be positive"),
    coordinates: z.object({
        latitude: z.number(),
        longitude: z.number()
    }).optional(),
    images: z.array(z.string()).default([]),
    amenities: z.array(z.string()).default([]),
    rules: z.array(z.string()).default([]),
    features: z.object({
        maxCapacity: z.number().min(1, "Capacity must be at least 1"),
        parkingSpots: z.number().min(0, "Parking spots cannot be negative"),
        equipmentIncluded: z.boolean().default(false),
        accessibility: z.boolean().default(false),
    }).optional(),
    status: z.enum(['draft', 'published']).default('draft'),
});

export default function NewLocationPage() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { mutateAsync: createLocation, isPending: isCreatingLocation } = useCreateLocation();
    const [activeTab, setActiveTab] = useState("basic");
    const [newAmenity, setNewAmenity] = useState("");
    const [newRule, setNewRule] = useState("");
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [actualImageFiles, setActualImageFiles] = useState<File[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const { isUploading, progress } = useImageUploader();

    useEffect(() => {
        if (!user) {
            navigate("/auth/login", { state: { from: "/locations/new" } });
        } else {
            // Initialize storage on component mount
            initializeStorage().catch(error => {
                console.error("Storage initialization error:", error);
            });
        }
    }, [user, navigate]);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            description: "",
            address: "",
            price: 0,
            area: 0,
            images: [],
            amenities: [],
            rules: [],
            features: {
                maxCapacity: 1,
                parkingSpots: 0,
                equipmentIncluded: false,
                accessibility: false,
            },
            status: 'draft' as const,
        },
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            if (!user?.id) {
                throw new Error("User is not authenticated");
            }

            setIsSubmitting(true);

            // Check for required fields
            if (!values.title || !values.description || !values.address) {
                toast({
                    title: "Error",
                    description: "Please fill in all required fields",
                    variant: "destructive"
                });
                setIsSubmitting(false);
                return;
            }

            // Create temporary folder name for image storage
            // This is just for organizing images, not for the location ID
            const tempImageFolder = `loc-${Date.now().toString()}`;

            // Create data object for submission
            const locationData = {
                ...values,
                // No need to specify ID - Supabase will generate a UUID
                ownerId: user.id,
                // Use local URLs from state for initial upload
                images: uploadedImages,
                tempImageFolder, // Pass this for organizing images in storage
                coordinates: values.coordinates || {
                    latitude: 0,
                    longitude: 0
                },
                status: values.status || 'draft'
            };

            // Call the location creation function
            const result = await createLocation(locationData);

            toast({
                title: "Success!",
                description: "Location created successfully",
            });

            // Navigate to the locations page
            navigate("/locations");

        } catch (error: any) {
            console.error("Error creating location:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to create location",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLocationSelect = (location: { address: string; coordinates: { latitude: number; longitude: number } }) => {
        form.setValue("address", location.address);
        form.setValue("coordinates", location.coordinates);
    };

    const handleAddAmenity = () => {
        if (!newAmenity || newAmenity.trim() === "") return;

        const currentAmenities = form.getValues("amenities") || [];
        if (!currentAmenities.includes(newAmenity)) {
            form.setValue("amenities", [...currentAmenities, newAmenity]);
            setNewAmenity("");
        }
    };

    const handleRemoveAmenity = (amenity: string) => {
        const currentAmenities = form.getValues("amenities") || [];
        form.setValue("amenities", currentAmenities.filter(a => a !== amenity));
    };

    const handleAddRule = () => {
        if (!newRule || newRule.trim() === "") return;

        const currentRules = form.getValues("rules") || [];
        if (!currentRules.includes(newRule)) {
            form.setValue("rules", [...currentRules, newRule]);
            setNewRule("");
        }
    };

    const handleRemoveRule = (rule: string) => {
        const currentRules = form.getValues("rules") || [];
        form.setValue("rules", currentRules.filter(r => r !== rule));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);

        // Generate preview URLs for display
        const newImages = newFiles.map(file => URL.createObjectURL(file));

        setUploadedImages([...uploadedImages, ...newImages]);
        setActualImageFiles([...actualImageFiles, ...newFiles]);
        form.setValue("images", [...uploadedImages, ...newImages]);
    };

    const handleRemoveImage = (imageUrl: string, index: number) => {
        // Remove image and file from state
        const updatedImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(updatedImages);

        // If this is a local URL, revoke it
        if (imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(imageUrl);
        }

        // Also remove corresponding file
        const updatedFiles = [...actualImageFiles];
        updatedFiles.splice(index, 1);
        setActualImageFiles(updatedFiles);

        // Update main image index if needed
        if (index === mainImageIndex) {
            // If we removed the main image, make the first image the main one
            setMainImageIndex(0);
        } else if (index < mainImageIndex) {
            // If we removed an image before the main one, shift the index
            setMainImageIndex(mainImageIndex - 1);
        }

        form.setValue("images", updatedImages);
    };

    const handleSetMainImage = (index: number) => {
        if (index === mainImageIndex) return; // Already the main image

        // Update the main image index
        setMainImageIndex(index);

        // Re-order the images array to put the main image first
        const updatedImages = [...uploadedImages];
        const mainImage = updatedImages.splice(index, 1)[0];
        updatedImages.unshift(mainImage);

        // Re-order the files array to match
        const updatedFiles = [...actualImageFiles];
        if (updatedFiles.length > index) {
            const mainFile = updatedFiles.splice(index, 1)[0];
            updatedFiles.unshift(mainFile);
        }

        setUploadedImages(updatedImages);
        setActualImageFiles(updatedFiles);
        setMainImageIndex(0); // After reordering, the main image is always at index 0

        form.setValue("images", updatedImages);
    };

    const moveImage = (fromIndex: number, toIndex: number) => {
        if (
            fromIndex < 0 ||
            fromIndex >= uploadedImages.length ||
            toIndex < 0 ||
            toIndex >= uploadedImages.length
        ) {
            return; // Invalid indices
        }

        // Move image in the images array
        const updatedImages = [...uploadedImages];
        const [movedImage] = updatedImages.splice(fromIndex, 1);
        updatedImages.splice(toIndex, 0, movedImage);

        // Move file in the files array to match
        const updatedFiles = [...actualImageFiles];
        if (updatedFiles.length > fromIndex && updatedFiles.length > toIndex) {
            const [movedFile] = updatedFiles.splice(fromIndex, 1);
            updatedFiles.splice(toIndex, 0, movedFile);
        }

        // Update main image index if needed
        if (fromIndex === mainImageIndex) {
            setMainImageIndex(toIndex);
        } else if (
            (fromIndex < mainImageIndex && toIndex >= mainImageIndex) ||
            (fromIndex > mainImageIndex && toIndex <= mainImageIndex)
        ) {
            // If we moved an image across the main image, shift the index
            setMainImageIndex(
                fromIndex < mainImageIndex ? mainImageIndex - 1 : mainImageIndex + 1
            );
        }

        setUploadedImages(updatedImages);
        setActualImageFiles(updatedFiles);
        form.setValue("images", updatedImages);
    };

    // Render upload progress
    const renderUploadProgress = () => {
        if (isUploading) {
            return (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">Uploading images</h3>
                        <Progress value={progress} className="h-2 mb-4" />
                        <p className="text-center">{progress}% completed</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (!user) {
        return <div>Redirecting to login...</div>;
    }

    return (
        <div className="container max-w-3xl py-8">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild>
                    <Link to="/locations">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Add New Location</h1>
            </div>

            {renderUploadProgress()}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-5 mb-6">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="images">Images</TabsTrigger>
                            <TabsTrigger value="features">Features</TabsTrigger>
                            <TabsTrigger value="amenities">Amenities</TabsTrigger>
                            <TabsTrigger value="rules">Rules</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Studio Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 Example St." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your location..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <FormLabel>Location on Map</FormLabel>
                                <LocationPicker
                                    onLocationSelect={handleLocationSelect}
                                    defaultAddress={form.getValues("address")}
                                    updateAddressOnClick={true}
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price per hour (₽)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    placeholder="2500"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Area (m²)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    placeholder="80"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="images" className="space-y-6">
                            <div>
                                <FormLabel>Upload Images</FormLabel>
                                <FormDescription className="mb-4">
                                    Upload high-quality images of your location. You can rearrange images, and set any image as the main one.
                                </FormDescription>

                                <div className="flex items-center gap-4 mb-6">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="max-w-80"
                                    />
                                    <Button type="button" variant="outline" className="flex items-center gap-2">
                                        <Upload size={16} />
                                        Browse Files
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {uploadedImages.map((imageUrl, index) => (
                                        <div key={index} className="relative group border rounded-md overflow-hidden">
                                            <img
                                                src={imageUrl}
                                                alt={`Location image ${index + 1}`}
                                                className="w-full h-40 object-cover"
                                            />
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant={index === mainImageIndex ? "default" : "outline"}
                                                    className="h-8 w-8 bg-white bg-opacity-80 hover:bg-opacity-100 text-amber-500"
                                                    onClick={() => handleSetMainImage(index)}
                                                    title="Set as main image"
                                                >
                                                    <Star size={16} className={index === mainImageIndex ? "fill-amber-500" : ""} />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="destructive"
                                                    className="h-8 w-8 bg-white bg-opacity-80 hover:bg-opacity-100"
                                                    onClick={() => handleRemoveImage(imageUrl, index)}
                                                    title="Remove image"
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                            <div className="absolute bottom-2 left-2 flex gap-1">
                                                {index === mainImageIndex && (
                                                    <Badge className="bg-amber-500 text-white">
                                                        Main
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="absolute bottom-2 right-2 flex gap-1">
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8 bg-white bg-opacity-80 hover:bg-opacity-100"
                                                    onClick={() => moveImage(index, Math.max(0, index - 1))}
                                                    disabled={index === 0}
                                                    title="Move left"
                                                >
                                                    <ArrowLeftIcon size={16} />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8 bg-white bg-opacity-80 hover:bg-opacity-100"
                                                    onClick={() => moveImage(index, Math.min(uploadedImages.length - 1, index + 1))}
                                                    disabled={index === uploadedImages.length - 1}
                                                    title="Move right"
                                                >
                                                    <ArrowRight size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    {uploadedImages.length === 0 && (
                                        <div className="col-span-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-md">
                                            <Upload size={48} className="text-gray-300 mb-4" />
                                            <p className="text-gray-400">No images uploaded yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="features" className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="features.maxCapacity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Maximum Capacity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    placeholder="10"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                    value={field.value || 1}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Maximum number of people allowed in the location
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="features.parkingSpots"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parking Spots</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                    value={field.value || 0}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Number of available parking spots
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="features.equipmentIncluded"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Equipment Included</FormLabel>
                                                <FormDescription>
                                                    Check if your location includes photography or filming equipment
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="features.accessibility"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Accessibility</FormLabel>
                                                <FormDescription>
                                                    Check if your location is accessible for people with disabilities
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="amenities" className="space-y-6">
                            <div>
                                <FormLabel>Amenities</FormLabel>
                                <FormDescription className="mb-4">
                                    Add amenities that your location offers
                                </FormDescription>

                                <div className="flex gap-2 mb-6">
                                    <Input
                                        value={newAmenity}
                                        onChange={(e) => setNewAmenity(e.target.value)}
                                        placeholder="Add amenity (e.g. WiFi, Air Conditioning)"
                                        className="flex-1"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddAmenity();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddAmenity}
                                        disabled={!newAmenity.trim()}
                                    >
                                        <Plus size={16} className="mr-1" /> Add
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {form.watch("amenities")?.map((amenity, index) => (
                                        <Badge
                                            key={index}
                                            className="flex items-center gap-1 py-1.5 pl-3 pr-2"
                                        >
                                            {amenity}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 rounded-full"
                                                onClick={() => handleRemoveAmenity(amenity)}
                                            >
                                                <X size={12} />
                                            </Button>
                                        </Badge>
                                    ))}

                                    {(!form.watch("amenities") || form.watch("amenities").length === 0) && (
                                        <p className="text-sm text-gray-400 p-2">No amenities added yet</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="rules" className="space-y-6">
                            <div>
                                <FormLabel>Rules</FormLabel>
                                <FormDescription className="mb-4">
                                    Add rules and policies for your location
                                </FormDescription>

                                <div className="flex gap-2 mb-6">
                                    <Input
                                        value={newRule}
                                        onChange={(e) => setNewRule(e.target.value)}
                                        placeholder="Add rule (e.g. No smoking, Min. 2 hour booking)"
                                        className="flex-1"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddRule();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddRule}
                                        disabled={!newRule.trim()}
                                    >
                                        <Plus size={16} className="mr-1" /> Add
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {form.watch("rules")?.map((rule, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                            <span>{rule}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveRule(rule)}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    ))}

                                    {(!form.watch("rules") || form.watch("rules").length === 0) && (
                                        <p className="text-sm text-gray-400 p-2">No rules added yet</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="flex items-center justify-between pt-6 border-t">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={field.value === 'published'}
                                                onCheckedChange={(checked: boolean | "indeterminate") => {
                                                    field.onChange(checked ? 'published' : 'draft');
                                                }}
                                            />
                                            <FormLabel className="text-sm font-normal">
                                                Publish location immediately
                                            </FormLabel>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            <Button type="button" variant="outline" asChild>
                                <Link to="/locations">Cancel</Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || isCreatingLocation || isUploading}
                            >
                                {(isSubmitting || isCreatingLocation) && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Location
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}