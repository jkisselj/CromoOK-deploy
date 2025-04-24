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
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { LocationPicker } from "@/components/map/location-picker";
import { Badge } from "@/components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

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
    const { mutateAsync: createLocation } = useCreateLocation();
    const [activeTab, setActiveTab] = useState("basic");
    const [newAmenity, setNewAmenity] = useState("");
    const [newRule, setNewRule] = useState("");
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    React.useEffect(() => {
        if (!user) {
            navigate("/auth/login", { state: { from: "/locations/new" } });
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
                throw new Error("User not authenticated");
            }

            // Include images that have been uploaded
            const locationData = {
                ...values,
                ownerId: user.id,
                images: uploadedImages,
            };

            await createLocation(locationData);
            navigate("/locations");
        } catch (error) {
            console.error("Failed to create location:", error);
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

        // Здесь в реальном приложении файлы загружаются на сервер/в хранилище
        // В демо-версии будем использовать локальные URL
        const newImages = Array.from(files).map(file => URL.createObjectURL(file));
        setUploadedImages([...uploadedImages, ...newImages]);
        form.setValue("images", [...uploadedImages, ...newImages]);
    };

    const handleRemoveImage = (imageUrl: string) => {
        const updatedImages = uploadedImages.filter(img => img !== imageUrl);
        setUploadedImages(updatedImages);
        form.setValue("images", updatedImages);
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
                                                <Input placeholder="123 Street Name" {...field} />
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
                                            <FormLabel>Area (м²)</FormLabel>
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
                                    Upload high-quality images of your location. The first image will be used as the main image.
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
                                        <div key={index} className="relative group">
                                            <img
                                                src={imageUrl}
                                                alt={`Location image ${index + 1}`}
                                                className="w-full h-40 object-cover rounded-md"
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveImage(imageUrl)}
                                            >
                                                <X size={16} />
                                            </Button>
                                            {index === 0 && (
                                                <Badge className="absolute bottom-2 left-2">
                                                    Main Image
                                                </Badge>
                                            )}
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
                            <Button type="submit">Create Location</Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
