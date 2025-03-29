export interface Location {
    id: string;
    title: string;
    description: string;
    address: string;
    price: number;
    currency?: string;
    area: number;
    images: string[];
    imageUrl?: string;
    amenities: string[];
    rules: string[];
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    status: 'draft' | 'published' | 'archived';
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    features?: {
        maxCapacity: number;
        parkingSpots: number;
        equipmentIncluded: boolean;
        accessibility: boolean;
        isPhotoFriendly?: boolean;
        hasFlexibleHours?: boolean;
    };
    categories?: string[];
    tags?: string[];
    rating?: number;
    reviews?: number;
    availability?: {
        status?: 'Available' | 'Booked' | 'Maintenance' | 'Unavailable';
        openTime: string;
        closeTime: string;
        daysAvailable: string[];
    };
    bookings?: {
        totalBookings: number;
        averageRating: number;
        upcomingBookings?: number;
    };
    pricing?: {
        hourlyRate?: number;
        dailyRate: number;
        weeklyDiscount?: number;
        monthlyDiscount?: number;
        cleaningFee?: number;
        depositAmount?: number;
    };
}

export interface LocationFilter {
    query?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    amenities?: string[];
    rating?: number;
    availabilityStatus?: string;
    features?: string[];
    sortBy?: 'price' | 'rating' | 'newest' | 'popular';
    sortDirection?: 'asc' | 'desc';
}

export type CreateLocationDTO = Omit<Location, 'id' | 'createdAt' | 'updatedAt'>;

export interface LocationSummary {
    id: string;
    title: string;
    description: string;
    address: string;
    imageUrl: string;
    price: number;
    currency: string;
    categories: string[];
    rating: number;
    availability: string;
}
