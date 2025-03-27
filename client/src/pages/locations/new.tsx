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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateLocation } from "@/hooks/useLocations";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";
import { LocationPicker } from "@/components/map/location-picker";

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    address: z.string().min(1, "Address is required"),
    price: z.number().min(0, "Price must be positive"),
    area: z.number().min(0, "Area must be positive"),
    coordinates: z.object({
        latitude: z.number(),
        longitude: z.number()
    }).optional()
});

export default function NewLocationPage() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { mutateAsync: createLocation } = useCreateLocation();

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
        },
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            if (!user?.id) {
                throw new Error("User not authenticated");
            }

            await createLocation({
                ...values,
                ownerId: user.id,
                images: [],
                amenities: [],
                rules: [],
                status: 'draft',
            });
            navigate("/locations");
        } catch (error) {
            console.error("Failed to create location:", error);
        }
    };

    const handleLocationSelect = (location: { address: string; coordinates: { latitude: number; longitude: number } }) => {
        form.setValue("address", location.address);
        form.setValue("coordinates", location.coordinates);
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
                        <FormLabel>Location</FormLabel>
                        <LocationPicker
                            onLocationSelect={handleLocationSelect}
                            defaultAddress={form.getValues("address")}
                            updateAddressOnClick={false}
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

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link to="/locations">Cancel</Link>
                        </Button>
                        <Button type="submit">Create Location</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
