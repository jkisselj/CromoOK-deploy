import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOptions {
    search?: string;
    priceMin?: number;
    priceMax?: number;
    area?: string;
    features?: string[];
    sortBy?: string;
}

interface LocationFilterProps {
    onFilterChange: (filters: FilterOptions) => void;
    className?: string;
}

const featuresList = [
    { id: "natural-light", label: "Natural Light" },
    { id: "equipment", label: "Equipment Included" },
    { id: "parking", label: "Free Parking" },
    { id: "wifi", label: "WiFi" },
    { id: "backdrop", label: "Multiple Backdrops" },
    { id: "restroom", label: "Restrooms" },
    { id: "makeup", label: "Makeup Area" },
    { id: "kitchen", label: "Kitchen Access" }
];

const sortOptions = [
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Highest Rated" }
];

const areaOptions = [
    { value: "any", label: "Any Size" },
    { value: "small", label: "Small (<50 m²)" },
    { value: "medium", label: "Medium (50-100 m²)" },
    { value: "large", label: "Large (>100 m²)" }
];

export function LocationFilter({ onFilterChange, className }: LocationFilterProps) {
    const [filters, setFilters] = useState<FilterOptions>({
        search: "",
        priceMin: 0,
        priceMax: 10000,
        area: "any",
        features: [],
        sortBy: "newest"
    });

    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFilters = { ...filters, search: e.target.value };
        setFilters(newFilters);
    };

    const handleFeatureToggle = (feature: string, checked: boolean) => {
        let newFeatures: string[];

        if (checked) {
            newFeatures = [...selectedFeatures, feature];
        } else {
            newFeatures = selectedFeatures.filter(f => f !== feature);
        }

        setSelectedFeatures(newFeatures);
        setFilters({ ...filters, features: newFeatures });
    };

    const handlePriceChange = (value: number[]) => {
        const [min, max] = value as [number, number];
        setPriceRange([min, max]);
        setFilters({ ...filters, priceMin: min, priceMax: max });
    };

    const handleAreaChange = (value: string) => {
        setFilters({ ...filters, area: value });
    };

    const handleSortChange = (value: string) => {
        setFilters({ ...filters, sortBy: value });
    };

    const applyFilters = () => {
        onFilterChange(filters);
    };

    const clearFilters = () => {
        const defaultFilters: FilterOptions = {
            search: "",
            priceMin: 0,
            priceMax: 10000,
            area: "any",
            features: [],
            sortBy: "newest"
        };

        setFilters(defaultFilters);
        setSelectedFeatures([]);
        setPriceRange([0, 10000]);
        onFilterChange(defaultFilters);
    };

    const activeFilterCount = (() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.priceMin !== 0 || filters.priceMax !== 10000) count++;
        if (filters.area !== "any") count++;
        if (selectedFeatures.length) count += selectedFeatures.length;
        return count;
    })();

    return (
        <div className={cn("flex flex-col md:flex-row gap-4 w-full", className)}>
            {/* Search input for desktop and mobile */}
            <div className="flex-1">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search locations..."
                        className="w-full pl-10"
                        value={filters.search}
                        onChange={handleSearchChange}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Sort option (visible on desktop) */}
            <div className="hidden md:block w-[180px]">
                <Select value={filters.sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Filter button and sheet */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="ml-1 rounded-full bg-primary w-5 h-5 text-[11px] flex items-center justify-center text-primary-foreground">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[400px]">
                    <SheetHeader>
                        <SheetTitle>Filter Locations</SheetTitle>
                        <SheetDescription>
                            Refine your search results with these options
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-6 space-y-6">
                        {/* Price Range */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="price-range">Price Range (per hour)</Label>
                                <div className="text-sm text-muted-foreground">
                                    ${priceRange[0]} - ${priceRange[1]}
                                </div>
                            </div>
                            <Slider
                                id="price-range"
                                min={0}
                                max={10000}
                                step={100}
                                value={priceRange}
                                onValueChange={handlePriceChange}
                                className="py-4"
                            />
                        </div>

                        {/* Space Size */}
                        <div className="space-y-2">
                            <Label htmlFor="area-select">Space Size</Label>
                            <Select value={filters.area} onValueChange={handleAreaChange}>
                                <SelectTrigger id="area-select" className="w-full">
                                    <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {areaOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort By (visible on mobile) */}
                        <div className="space-y-2 md:hidden">
                            <Label htmlFor="sort-select">Sort By</Label>
                            <Select value={filters.sortBy} onValueChange={handleSortChange}>
                                <SelectTrigger id="sort-select" className="w-full">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Features */}
                        <div className="space-y-3">
                            <Label>Features</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {featuresList.map(feature => (
                                    <div key={feature.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={feature.id}
                                            checked={selectedFeatures.includes(feature.id)}
                                            onCheckedChange={(checked) =>
                                                handleFeatureToggle(feature.id, checked === true)
                                            }
                                        />
                                        <Label
                                            htmlFor={feature.id}
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {feature.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <SheetFooter>
                        <div className="flex w-full flex-col sm:flex-row gap-2">
                            <Button variant="outline" onClick={clearFilters} className="flex-1">
                                Clear All
                            </Button>
                            <Button onClick={applyFilters} className="flex-1">
                                Apply Filters
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}