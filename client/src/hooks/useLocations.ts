import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import type { Location, LocationFilter, CreateLocationDTO } from '@/types/location';
import { useAuthContext } from '@/context/AuthContext';
import { deleteImage } from '@/lib/imageService';

const DEMO_LOCATIONS: Location[] = [
    {
        id: "1",
        title: "Rannapungerja Lighthouse - Unique Photoshoot Location",
        description: `Discover the hidden gem of Estonia's northern coast - the historic Rannapungerja Lighthouse, now available as an exclusive photoshoot location. This functioning lighthouse stands as a sentinel over the peaceful shores of Lake Peipus, offering a truly unique setting for photographers and filmmakers.

Features:
• Working lighthouse with accessible viewing platform offering 360° panoramic views
• Authentic maritime atmosphere with original historical elements preserved
• Beautiful sandy beach adjacent to the lighthouse 
• Perfect location for sunrise/sunset photography with stunning natural light
• Surrounded by pristine nature and pine forests
• Seasonal variations provide diverse photographic opportunities year-round
• Secluded location ensures privacy during your shoot

The lighthouse interior features original spiral staircase, vintage nautical elements, and charming details that create atmospheric backdrops. From the viewing platform, capture breathtaking vistas of Lake Peipus and the surrounding unspoiled coastline.

This location is ideal for wedding photography, fashion shoots, maritime-themed commercial work, landscape photography, portrait sessions, and artistic projects requiring a unique setting. The contrast between the structured architecture of the lighthouse and the natural beauty of the surrounding beach and forest offers endless creative possibilities.

The sandy beach provides additional shooting space with natural dunes and coastal vegetation adding texture and interest to your compositions.

Available for private bookings with flexible hours to catch the perfect light conditions for your project.`,
        address: "Rannapungerja, 42208 Ida-Viru County, Estonia",
        price: 90,
        area: 120,
        minimumBookingHours: 2,
        images: [
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-45.png",
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-46.png",
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-42.png",
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-49.png",
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-49.png"
        ],
        amenities: [
            "Panoramic Lake Views",
            "Access to Viewing Platform",
            "Sandy Beach Access",
            "Heated Interior in Winter",
            "Parking Available",
            "Professional Lighting Setup",
            "Changing Room/Restroom",
            "Evening Photography Options",
            "Historical Location",
            "Natural Landscapes",
            "Original Maritime Features"
        ],
        rules: [
            "Advance Booking Required",
            "Minimum Booking: 2 Hours",
            "100% Prepayment Required",
            "48-Hour Cancellation Policy",
            "Maximum 8 People on Site",
            "No Interference with Lighthouse Operation",
            "Drone Usage Requires Special Permission",
            "Respect Natural Environment",
            "No Open Fires on Beach"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 58.97948457196772,
            longitude: 27.17564623627185
        },
        features: {
            maxCapacity: 8,
            parkingSpots: 3,
            equipmentIncluded: false,
            accessibility: false,
        }
    },
    {
        id: "2",
        title: "Kohtla-Nõmme Mining Museum - Industrial Heritage Filming Location",
        description: `Step into Estonia's industrial past at the historic Kohtla-Nõmme Mining Museum - an extraordinary filming and photography location showcasing authentic mining heritage. This former coal mine complex offers a wealth of unique settings for creative projects requiring industrial atmosphere, historical backdrops, or dramatic underground spaces.

Features:
• Expansive industrial complex with preserved mining structures dating back to 1937
• Underground mining tunnels and caverns accessible at 8 meters below ground
• Authentic industrial machinery, equipment, and tools in their original setting
• Dramatic contrasts between underground darkness and natural daylight
• Striking industrial architecture with distinctive Soviet-era design elements
• Various textures including rough stone walls, metal structures, and wooden supports
• Unique mining railroad with vintage carriages and locomotives
• Both interior and exterior shooting locations with diverse visual appeal

The museum complex features multiple buildings with authentic industrial interiors, a preserved mining control room with vintage equipment, workshop areas, and the impressive underground tunnel network that extends for hundreds of meters beneath the surface. The atmospheric underground spaces provide exceptional acoustic properties and dramatic lighting opportunities.

Above ground, the industrial landscape includes the imposing main building with its distinctive tower, various outbuildings, vintage mining equipment displays, and railway tracks with historic locomotives and coal wagons.

This location is ideal for historical documentaries, period films, science fiction productions, music videos, fashion photography with industrial themes, and any project requiring authentic industrial settings with high visual impact. The stark contrasts, unusual spaces, and historic atmosphere offer endless creative possibilities that cannot be recreated in a studio setting.

Available for exclusive bookings with experienced local staff who can assist with logistical support and provide historical context for your creative project.`,
        address: "Jaama tn 100, Kohtla-Nõmme, 30503 Ida-Viru maakond, Estonia",
        price: 120,
        area: 1500,
        minimumBookingHours: 4,
        images: [
            "/locations/Kaevandusmuuseum_okt2023-EXT-1.jpg",
            "/locations/Kaevandusmuuseum_okt2023-EXT-2.jpg",
            "/locations/Kaevandusmuuseum_okt2023-EXT-3.jpg",
            "/locations/Kaevandusmuuseum_okt2023-EXT-4.jpg",
            "/locations/Kaevandusmuuseum_okt2023-EXT-6.jpg",
            "/locations/Kaevandusmuuseum_okt2023-EXT-9.jpg",
            "/locations/Kaevandusmuuseum_okt2023-EXT-10.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-1.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-2.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-3.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-5.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-6.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-7.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-8.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-9.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-10.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-11.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-12.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-13.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-14.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-15.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-16.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-19.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-20.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-21.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-22.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-23.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-24.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-25.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-26.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-28.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-29.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-30.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-32.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-33.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-34.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-36.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-37.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-38.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-39.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-40.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-41.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-42.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-43.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-44.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-45.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-46.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-48.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-49.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-50.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-51.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-52.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-53.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-54.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-55.jpg",
            "/locations/Kaevandusmuuseum_okt2023-INT-57.jpg"
        ],
        amenities: [
            "Underground Mine Access",
            "Industrial Architecture",
            "Historic Mining Equipment",
            "Railway Tracks & Locomotives",
            "Multiple Building Access",
            "Large Exterior Spaces",
            "Control Room Settings",
            "Industrial Machinery",
            "Professional Lighting Available",
            "Exhibition Halls",
            "Vintage Equipment Displays",
            "Museum Staff Support"
        ],
        rules: [
            "Advance Booking Required",
            "Minimum Booking: 4 Hours",
            "100% Prepayment Required",
            "72-Hour Cancellation Policy",
            "Maximum 15 People for Underground Shoots",
            "Safety Briefing Mandatory",
            "Hard Hats Required Underground",
            "Museum Staff Escort Required",
            "No Modification of Historic Elements",
            "Insurance Certificate Required",
            "No Open Flames or Pyrotechnics"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 59.3534,
            longitude: 27.1799
        },
        features: {
            maxCapacity: 15,
            parkingSpots: 10,
            equipmentIncluded: false,
            accessibility: false,
        }
    },
    {
        id: "3",
        title: "Rannapungerja Lighthouse - Unique Photoshoot Location",
        description: `Discover the hidden gem of Estonia's northern coast - the historic Rannapungerja Lighthouse, now available as an exclusive photoshoot location. This functioning lighthouse stands as a sentinel over the peaceful shores of Lake Peipus, offering a truly unique setting for photographers and filmmakers.

Features:
• Working lighthouse with accessible viewing platform offering 360° panoramic views
• Authentic maritime atmosphere with original historical elements preserved
• Beautiful sandy beach adjacent to the lighthouse 
• Perfect location for sunrise/sunset photography with stunning natural light
• Surrounded by pristine nature and pine forests
• Seasonal variations provide diverse photographic opportunities year-round
• Secluded location ensures privacy during your shoot

The lighthouse interior features original spiral staircase, vintage nautical elements, and charming details that create atmospheric backdrops. From the viewing platform, capture breathtaking vistas of Lake Peipus and the surrounding unspoiled coastline.

This location is ideal for wedding photography, fashion shoots, maritime-themed commercial work, landscape photography, portrait sessions, and artistic projects requiring a unique setting. The contrast between the structured architecture of the lighthouse and the natural beauty of the surrounding beach and forest offers endless creative possibilities.

The sandy beach provides additional shooting space with natural dunes and coastal vegetation adding texture and interest to your compositions.

Available for private bookings with flexible hours to catch the perfect light conditions for your project.`,
        address: "Rannapungerja, 42208 Ida-Viru County, Estonia",
        price: 90,
        area: 120,
        minimumBookingHours: 5,

        images: [
            "/locations/Kreenholm-Narva-nov2023_EXT-54.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-2.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-3.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-4.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-5.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-6.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-7.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-8.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-9.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-10.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-11.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-12.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-13.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-14-2.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-14.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-15.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-16.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-17.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-18.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-20.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-21.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-22.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-23.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-24.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-25.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-26.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-27.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-28.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-29.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-30.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-31.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-32.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-33.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-34.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-37.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-38.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-39.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-45.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-52.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-53.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-54.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-56.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-57.jpg",
            "/locations/Kreenholm-Narva-nov2023_EXT-60.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-1.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-2.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-3.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-4.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-5.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-6.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-7.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-8.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-10.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-11.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-12.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-13.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-14.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-15.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-16.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-17.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-18.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-19.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-20.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-21.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-22.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-23.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-24.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-25.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-26.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-27.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-28.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-29.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-32.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-33.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-35.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-36.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-37.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-38.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-39.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-41.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-48.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-49.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-50.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-51.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-56.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-57.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-58.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-61.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-62.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-63.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-64.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-65.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-66.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-67.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-69.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-70.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-71.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-72.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-73.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-74.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-83.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-84.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-85.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-86.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-87.jpg",
            "/locations/Kreenholm-Narva-nov2023_INT-88.jpg",
        ],
        amenities: [
            "Panoramic Lake Views",
            "Access to Viewing Platform",
            "Sandy Beach Access",
            "Heated Interior in Winter",
            "Parking Available",
            "Professional Lighting Setup",
            "Changing Room/Restroom",
            "Evening Photography Options",
            "Historical Location",
            "Natural Landscapes",
            "Original Maritime Features"
        ],
        rules: [
            "Advance Booking Required",
            "Minimum Booking: 5 Hours",
            "100% Prepayment Required",
            "48-Hour Cancellation Policy",
            "Maximum 8 People on Site",
            "No Interference with Lighthouse Operation",
            "Drone Usage Requires Special Permission",
            "Respect Natural Environment",
            "No Open Fires on Beach"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 58.97948457196772,
            longitude: 27.17564623627185
        },
        features: {
            maxCapacity: 8,
            parkingSpots: 3,
            equipmentIncluded: false,
            accessibility: false,
        }
    },
    {
        id: "4",
        title: "Rannapungerja Lighthouse - Unique Photoshoot Location",
        description: `Discover the hidden gem of Estonia's northern coast - the historic Rannapungerja Lighthouse, now available as an exclusive photoshoot location. This functioning lighthouse stands as a sentinel over the peaceful shores of Lake Peipus, offering a truly unique setting for photographers and filmmakers.

Features:
• Working lighthouse with accessible viewing platform offering 360° panoramic views
• Authentic maritime atmosphere with original historical elements preserved
• Beautiful sandy beach adjacent to the lighthouse 
• Perfect location for sunrise/sunset photography with stunning natural light
• Surrounded by pristine nature and pine forests
• Seasonal variations provide diverse photographic opportunities year-round
• Secluded location ensures privacy during your shoot

The lighthouse interior features original spiral staircase, vintage nautical elements, and charming details that create atmospheric backdrops. From the viewing platform, capture breathtaking vistas of Lake Peipus and the surrounding unspoiled coastline.

This location is ideal for wedding photography, fashion shoots, maritime-themed commercial work, landscape photography, portrait sessions, and artistic projects requiring a unique setting. The contrast between the structured architecture of the lighthouse and the natural beauty of the surrounding beach and forest offers endless creative possibilities.

The sandy beach provides additional shooting space with natural dunes and coastal vegetation adding texture and interest to your compositions.

Available for private bookings with flexible hours to catch the perfect light conditions for your project.`,
        address: "Rannapungerja, 42208 Ida-Viru County, Estonia",
        price: 90,
        area: 120,
        minimumBookingHours: 2,
        images: [
            "/locations/Valaste-juga_okt2023-EXT-16.jpg",
            "/locations/Valaste-juga_okt2023-EXT-3.jpg",
            "/locations/Valaste-juga_okt2023-EXT-2.jpg",
            "/locations/Valaste-juga_okt2023-EXT-1.jpg",
            "/locations/Valaste-juga_okt2023-EXT-4.jpg",
            "/locations/Valaste-juga_okt2023-EXT-5.jpg",
            "/locations/Valaste-juga_okt2023-EXT-6.jpg",
            "/locations/Valaste-juga_okt2023-EXT-7.jpg",
            "/locations/Valaste-juga_okt2023-EXT-8.jpg",
            "/locations/Valaste-juga_okt2023-EXT-9.jpg",
            "/locations/Valaste-juga_okt2023-EXT-10.jpg",
            "/locations/Valaste-juga_okt2023-EXT-11.jpg",
            "/locations/Valaste-juga_okt2023-EXT-12.jpg",
            "/locations/Valaste-juga_okt2023-EXT-14.jpg",
            "/locations/Valaste-juga_okt2023-EXT-16.jpg",
            "/locations/Valaste-juga_okt2023-EXT-17.jpg",
            "/locations/Valaste-juga_okt2023-EXT-18.jpg",
            "/locations/Valaste-juga_okt2023-EXT-19.jpg",
            "/locations/Valaste-juga_okt2023-EXT-20.jpg",
            "/locations/Valaste-juga_okt2023-EXT-22.jpg",
            "/locations/Valaste-juga_okt2023-EXT-24.jpg",
            "/locations/Valaste-juga_okt2023-EXT-25.jpg",
            "/locations/Valaste-juga_okt2023-EXT-26.jpg",
            "/locations/Valaste-juga_okt2023-EXT-32.jpg",
            "/locations/Valaste-juga_okt2023-EXT-33.jpg",
            "/locations/Valaste-juga_okt2023-EXT-34.jpg",
            "/locations/Valaste-juga_okt2023-EXT-37.jpg",
            "/locations/Valaste-juga_okt2023-EXT-38.jpg",
        ],
        amenities: [
            "Panoramic Lake Views",
            "Access to Viewing Platform",
            "Sandy Beach Access",
            "Heated Interior in Winter",
            "Parking Available",
            "Professional Lighting Setup",
            "Changing Room/Restroom",
            "Evening Photography Options",
            "Historical Location",
            "Natural Landscapes",
            "Original Maritime Features"
        ],
        rules: [
            "Advance Booking Required",
            "Minimum Booking: 2 Hours",
            "100% Prepayment Required",
            "48-Hour Cancellation Policy",
            "Maximum 8 People on Site",
            "No Interference with Lighthouse Operation",
            "Drone Usage Requires Special Permission",
            "Respect Natural Environment",
            "No Open Fires on Beach"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 58.97948457196772,
            longitude: 27.17564623627185
        },
        features: {
            maxCapacity: 8,
            parkingSpots: 3,
            equipmentIncluded: false,
            accessibility: false,
        }
    },
    {
        id: "5",
        title: "Rannapungerja Lighthouse - Unique Photoshoot Location",
        description: `Discover the hidden gem of Estonia's northern coast - the historic Rannapungerja Lighthouse, now available as an exclusive photoshoot location. This functioning lighthouse stands as a sentinel over the peaceful shores of Lake Peipus, offering a truly unique setting for photographers and filmmakers.

Features:
• Working lighthouse with accessible viewing platform offering 360° panoramic views
• Authentic maritime atmosphere with original historical elements preserved
• Beautiful sandy beach adjacent to the lighthouse 
• Perfect location for sunrise/sunset photography with stunning natural light
• Surrounded by pristine nature and pine forests
• Seasonal variations provide diverse photographic opportunities year-round
• Secluded location ensures privacy during your shoot

The lighthouse interior features original spiral staircase, vintage nautical elements, and charming details that create atmospheric backdrops. From the viewing platform, capture breathtaking vistas of Lake Peipus and the surrounding unspoiled coastline.

This location is ideal for wedding photography, fashion shoots, maritime-themed commercial work, landscape photography, portrait sessions, and artistic projects requiring a unique setting. The contrast between the structured architecture of the lighthouse and the natural beauty of the surrounding beach and forest offers endless creative possibilities.

The sandy beach provides additional shooting space with natural dunes and coastal vegetation adding texture and interest to your compositions.

Available for private bookings with flexible hours to catch the perfect light conditions for your project.`,
        address: "Rannapungerja, 42208 Ida-Viru County, Estonia",
        price: 90,
        area: 120,
        minimumBookingHours: 2,
        images: [
            "/locations/Narva-Aleksandri-kirik_okt2023-EXT-1.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-EXT-2.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-EXT-3.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-EXT-4.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-EXT-5.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-EXT-6.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-EXT-7.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-EXT-8.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-EXT-9.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-EXT-10.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-EXT-12.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-1.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-3.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-4.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-5.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-6.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-7.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-8.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-9.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-10.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-11.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-12.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-13.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-14.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-16.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-21.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-22.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-24.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-25.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-27.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-28.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-29.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-30.jpg",
            "/locations/Narva-Aleksandri-kirik_okt2023-INT-32.jpg",

            
        ],
        amenities: [
            "Panoramic Lake Views",
            "Access to Viewing Platform",
            "Sandy Beach Access",
            "Heated Interior in Winter",
            "Parking Available",
            "Professional Lighting Setup",
            "Changing Room/Restroom",
            "Evening Photography Options",
            "Historical Location",
            "Natural Landscapes",
            "Original Maritime Features"
        ],
        rules: [
            "Advance Booking Required",
            "Minimum Booking: 2 Hours",
            "100% Prepayment Required",
            "48-Hour Cancellation Policy",
            "Maximum 8 People on Site",
            "No Interference with Lighthouse Operation",
            "Drone Usage Requires Special Permission",
            "Respect Natural Environment",
            "No Open Fires on Beach"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 58.97948457196772,
            longitude: 27.17564623627185
        },
        features: {
            maxCapacity: 8,
            parkingSpots: 3,
            equipmentIncluded: false,
            accessibility: false,
        }
    },
    {
        id: "6",
        title: "Rannapungerja Lighthouse - Unique Photoshoot Location",
        description: `Discover the hidden gem of Estonia's northern coast - the historic Rannapungerja Lighthouse, now available as an exclusive photoshoot location. This functioning lighthouse stands as a sentinel over the peaceful shores of Lake Peipus, offering a truly unique setting for photographers and filmmakers.

Features:
• Working lighthouse with accessible viewing platform offering 360° panoramic views
• Authentic maritime atmosphere with original historical elements preserved
• Beautiful sandy beach adjacent to the lighthouse 
• Perfect location for sunrise/sunset photography with stunning natural light
• Surrounded by pristine nature and pine forests
• Seasonal variations provide diverse photographic opportunities year-round
• Secluded location ensures privacy during your shoot

The lighthouse interior features original spiral staircase, vintage nautical elements, and charming details that create atmospheric backdrops. From the viewing platform, capture breathtaking vistas of Lake Peipus and the surrounding unspoiled coastline.

This location is ideal for wedding photography, fashion shoots, maritime-themed commercial work, landscape photography, portrait sessions, and artistic projects requiring a unique setting. The contrast between the structured architecture of the lighthouse and the natural beauty of the surrounding beach and forest offers endless creative possibilities.

The sandy beach provides additional shooting space with natural dunes and coastal vegetation adding texture and interest to your compositions.

Available for private bookings with flexible hours to catch the perfect light conditions for your project.`,
        address: "Rannapungerja, 42208 Ida-Viru County, Estonia",
        price: 90,
        area: 120,
        minimumBookingHours: 2,
        images: [
            "/locations/Sompa-Klubi_okt2023-EXT-4.jpg",
            "/locations/Sompa-Klubi_okt2023-EXT-1.jpg",
            "/locations/Sompa-Klubi_okt2023-EXT-2.jpg",
            "/locations/Sompa-Klubi_okt2023-EXT-3.jpg",
            "/locations/Sompa-Klubi_okt2023-EXT-5.jpg",
            "/locations/Sompa-Klubi_okt2023-EXT-6.jpg",
            "/locations/Sompa-Klubi_okt2023-EXT-7.jpg",
            "/locations/Sompa-Klubi_okt2023-EXT-8.jpg",
            "/locations/Sompa-Klubi_okt2023-EXT-9.jpg",
            "/locations/Sompa-Klubi_okt2023-EXT-10.jpg",
            "/locations/Sompa-Klubi_okt2023-EXT-11.jpg",
            "/locations/Sompa-Klubi_okt2023-EXT-12.jpg",
            "/locations/Sompa-Klubi_okt2023-EXT-13.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-2.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-1.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-3.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-5.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-6.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-8.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-9.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-10.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-11.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-12.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-14.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-15.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-16.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-18.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-19.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-20.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-21.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-22.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-23.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-24.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-25.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-26.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-27.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-28.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-29.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-30.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-31.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-32.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-34.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-35.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-39.jpg",
            "/locations/Sompa-Klubi_okt2023-INT-42.jpg",
            
        ],
        amenities: [
            "Panoramic Lake Views",
            "Access to Viewing Platform",
            "Sandy Beach Access",
            "Heated Interior in Winter",
            "Parking Available",
            "Professional Lighting Setup",
            "Changing Room/Restroom",
            "Evening Photography Options",
            "Historical Location",
            "Natural Landscapes",
            "Original Maritime Features"
        ],
        rules: [
            "Advance Booking Required",
            "Minimum Booking: 2 Hours",
            "100% Prepayment Required",
            "48-Hour Cancellation Policy",
            "Maximum 8 People on Site",
            "No Interference with Lighthouse Operation",
            "Drone Usage Requires Special Permission",
            "Respect Natural Environment",
            "No Open Fires on Beach"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 58.97948457196772,
            longitude: 27.17564623627185
        },
        features: {
            maxCapacity: 8,
            parkingSpots: 3,
            equipmentIncluded: false,
            accessibility: false,
        }
    },
];

const CREATED_LOCATIONS_KEY = 'user-created-locations';

export function useLocations(filters?: LocationFilter) {
    const { user } = useAuthContext();

    return useQuery({
        queryKey: ['locations', filters],
        queryFn: async () => {
            let userCreatedLocations: Location[] = [];
            try {
                const storedLocations = localStorage.getItem(CREATED_LOCATIONS_KEY);
                if (storedLocations) {
                    userCreatedLocations = JSON.parse(storedLocations);
                    console.log('Loaded user created locations from localStorage:', userCreatedLocations);
                }
            } catch (err) {
                console.error('Error reading from localStorage:', err);
            }

            let allLocations = [...DEMO_LOCATIONS];

            if (userCreatedLocations.length > 0) {
                allLocations = [...allLocations, ...userCreatedLocations];
            }

            if (user) {
                try {
                    const { data, error } = await supabase
                        .from('locations')
                        .select('*');

                    if (error) {
                        console.error('Error fetching locations from Supabase:', error);
                    } else if (data && data.length > 0) {
                        console.log('Got locations from Supabase:', data);
                        return [...allLocations, ...data] as Location[];
                    }
                } catch (err) {
                    console.error('Failed to fetch from Supabase:', err);
                }
            }

            return allLocations;
        },
        staleTime: 10000,
    });
}

export function useCreateLocation() {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();

    return useMutation({
        mutationFn: async (location: CreateLocationDTO) => {
            const timestamp = new Date().toISOString();
            const newLocation: Location = {
                ...location,
                id: `loc-${Date.now().toString()}`,
                createdAt: timestamp,
                updatedAt: timestamp,
                images: location.images || [],
                amenities: location.amenities || [],
                rules: location.rules || [],
                rating: undefined,
                reviews: undefined,
                features: {
                    maxCapacity: location.features?.maxCapacity || 1,
                    parkingSpots: location.features?.parkingSpots || 0,
                    equipmentIncluded: location.features?.equipmentIncluded || false,
                    accessibility: location.features?.accessibility || false
                },
                coordinates: location.coordinates || {
                    latitude: 55.7558,
                    longitude: 37.6173
                },
                bookings: {
                    totalBookings: 0,
                    averageRating: 0
                }
            };

            if (user) {
                try {
                    const { error } = await supabase
                        .from('locations')
                        .insert([newLocation]);

                    if (error) {
                        console.error('Error saving location to Supabase:', error);
                    }
                } catch (err) {
                    console.error('Failed to save to Supabase:', err);
                }
            }

            try {
                const storedLocations = localStorage.getItem(CREATED_LOCATIONS_KEY);
                let userCreatedLocations: Location[] = [];

                if (storedLocations) {
                    userCreatedLocations = JSON.parse(storedLocations);
                }

                userCreatedLocations.push(newLocation);
                localStorage.setItem(CREATED_LOCATIONS_KEY, JSON.stringify(userCreatedLocations));
                console.log('Saved new location to localStorage');

                const existingLocations = queryClient.getQueryData<Location[]>(['locations']) || [];
                queryClient.setQueryData(['locations'], [...existingLocations, newLocation]);
            } catch (err) {
                console.error('Error saving to localStorage:', err);
            }

            return newLocation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
}

export function useLocation(id: string) {
    return useQuery({
        queryKey: ['location', id],
        queryFn: async () => {
            const demoLocation = DEMO_LOCATIONS.find(loc => loc.id === id);
            if (demoLocation) {
                return demoLocation;
            }

            try {
                const storedLocations = localStorage.getItem(CREATED_LOCATIONS_KEY);
                if (storedLocations) {
                    const userCreatedLocations: Location[] = JSON.parse(storedLocations);
                    const userLocation = userCreatedLocations.find(loc => loc.id === id);
                    if (userLocation) {
                        console.log('Found location in localStorage:', userLocation);
                        return userLocation;
                    }
                }
            } catch (err) {
                console.error('Error reading from localStorage:', err);
            }

            try {
                const { data: location, error } = await supabase
                    .from('locations')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('Error fetching location from Supabase:', error);
                    throw new Error('Location not found');
                }

                if (location) {
                    return location as Location;
                }
            } catch (err) {
                console.error('Failed to fetch location from Supabase:', err);
            }

            throw new Error('Location not found');
        },
    });
}

export function useDeleteLocation() {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();

    return useMutation({
        mutationFn: async (id: string) => {
            const isDemoLocation = DEMO_LOCATIONS.some(loc => loc.id === id);
            if (isDemoLocation) {
                throw new Error('Demo locations cannot be deleted');
            }

            try {
                const storedLocations = localStorage.getItem(CREATED_LOCATIONS_KEY);
                if (storedLocations) {
                    let userCreatedLocations: Location[] = JSON.parse(storedLocations);
                    const localLocationIndex = userCreatedLocations.findIndex(loc => loc.id === id);

                    if (localLocationIndex >= 0) {
                        userCreatedLocations.splice(localLocationIndex, 1);
                        localStorage.setItem(CREATED_LOCATIONS_KEY, JSON.stringify(userCreatedLocations));
                        console.log('Location removed from localStorage');
                        return { success: true, id };
                    }
                }
            } catch (err) {
                console.error('Error working with localStorage:', err);
            }

            if (!user) {
                throw new Error('Authentication required to delete a location');
            }

            try {
                const { data: location, error: fetchError } = await supabase
                    .from('locations')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (fetchError) {
                    console.error('Error retrieving location for deletion:', fetchError);
                    throw new Error(`Could not find location: ${fetchError.message}`);
                }

                if (location.ownerId !== user.id) {
                    throw new Error('You can only delete your own locations');
                }

                if (location.images && location.images.length > 0) {
                    await Promise.all(
                        location.images.map(async (imageUrl: string) => {
                            try {
                                await deleteImage(imageUrl);
                            } catch (err) {
                                console.warn(`Could not delete image ${imageUrl}:`, err);
                            }
                        })
                    );
                }

                const { error: deleteError } = await supabase
                    .from('locations')
                    .delete()
                    .eq('id', id);

                if (deleteError) {
                    console.error('Error deleting location from Supabase:', deleteError);
                    throw new Error(`Failed to delete location: ${deleteError.message}`);
                }

                return { success: true, id };
            } catch (err) {
                console.error('Failed to delete location:', err);
                throw err;
            }
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            queryClient.invalidateQueries({ queryKey: ['location', result.id] });
        },
    });
}
