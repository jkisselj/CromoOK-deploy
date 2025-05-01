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
        area: 450,
        minimumBookingHours: 2,
        images: [
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-45.png",
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-46.png",
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-42.png",
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-49.png",
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-49.png"
        ],
        amenities: [
            "360° Panoramic Viewing Platform",
            "Authentic Lighthouse Interior",
            "Spiral Staircase Access",
            "Sandy Beach Access",
            "Natural Forest Surroundings",
            "Lake Peipus Waterfront",
            "Sunset/Sunrise Optimal Angles",
            "Original Maritime Elements",
            "Basic Restroom Facilities",
            "Parking Available (3 spots)",
            "Outdoor Shooting Space"
        ],
        rules: [
            "Advance Booking Required (48h)",
            "Minimum Booking: 2 Hours",
            "100% Prepayment Required",
            "48-Hour Cancellation Policy (50% refund)",
            "Maximum 8 People on Site",
            "No Modification of Lighthouse Equipment",
            "Drone Usage Requires Special Permission",
            "Respect Natural Environment",
            "No Open Fires on Beach",
            "No Smoking Inside the Lighthouse",
            "Liability Insurance Recommended"
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
        area: 5200,
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
            "Underground Mining Tunnels Access",
            "Historical Mining Equipment",
            "Vintage Control Room Setting",
            "Railway Tracks & Locomotives",
            "Multiple Industrial Buildings",
            "Original Mining Machinery",
            "Exhibition Spaces",
            "Outdoor Industrial Landscape",
            "Parking Area (10+ spaces)",
            "Basic Restroom Facilities",
            "Museum Guide Available",
            "First Aid Station"
        ],
        rules: [
            "Advance Booking Required (72h)",
            "Minimum Booking: 4 Hours",
            "Payment Required Before Filming",
            "72-Hour Cancellation Policy",
            "Maximum 15 People Underground",
            "Mandatory Safety Briefing",
            "Hard Hats Required Underground",
            "Museum Guide Must Accompany All Crews",
            "No Modifications to Historic Equipment",
            "Liability Insurance Required",
            "No Open Flames or Pyrotechnics",
            "Respect Historical Artifacts"
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
        title: "Kreenholm Textile Factory - Historic Industrial Complex",
        description: `Experience the grandeur of Estonia's industrial heritage at the iconic Kreenholm Textile Factory in Narva. This sprawling 19th-century manufacturing complex once housed the largest textile mill in Europe and now offers an extraordinary backdrop for film and photography projects seeking authentic historic industrial settings.

Features:
• Vast industrial complex with imposing red-brick architecture dating back to 1857
• Monumental factory halls with towering windows and original architectural details
• Distinctive industrial interiors featuring cast iron columns, vaulted ceilings, and exposed brick
• Riverside location with dramatic views of the bordering Narva River and Russia beyond
• Time-worn textures and surfaces shaped by over 150 years of industrial history
• Multiple buildings offering diverse settings from production halls to administrative spaces
• Natural light flooding through massive windows creating dramatic lighting opportunities
• Authentic industrial elements including original machinery, staircases, and fixtures

The Kreenholm complex is a photographer's dream, offering endless creative possibilities within its historic walls. Exterior shoots benefit from the imposing factory façades, the rhythmic patterns of hundreds of windows, and the scenic riverside location that adds depth and context to visual storytelling.

Inside, the factory presents a treasure trove of industrial aesthetics with its enormous production halls, where natural light streams through tall windows illuminating original architectural features. The interior spaces range from cavernous, open areas to intimate corners with compelling details that speak to the building's rich history.

This location is ideal for historical films, period dramas, fashion editorials with industrial themes, music videos seeking authentic backdrops, documentary productions, and commercial photography requiring distinctive character and atmosphere that cannot be replicated in studio settings.

The complex offers unparalleled visual storytelling opportunities with its combination of architectural grandeur, historical significance, and the raw beauty of industrial heritage. Every corner tells a story of Estonia's industrial past, providing rich context and authenticity to creative projects.`,
        address: "Joala tn 21, 20103 Narva",
        price: 100,
        area: 8500,
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
            "Vast Industrial Complex Access",
            "Multiple Building Access",
            "Original Factory Machinery",
            "Monumental Factory Halls",
            "Riverside Location Views",
            "Natural Light Through Tall Windows",
            "Cast Iron Architectural Elements",
            "Original Staircases & Fixtures",
            "Diverse Industrial Backdrops",
            "Historic Textile Equipment",
            "Production Hall Acoustics",
            "Site Guide Available",
            "Parking for Production Vehicles (15+ spots)"
        ],
        rules: [
            "Advance Booking Required (72h)",
            "Minimum Booking: 5 Hours",
            "Payment Required Before Access",
            "72-Hour Cancellation Policy",
            "Maximum 25 People on Site",
            "Guide Must Accompany All Crews",
            "Hard Hats Required in Some Areas",
            "Structural Safety Guidelines Must Be Followed",
            "No Modifications to Historic Structures",
            "Liability Insurance Required",
            "Risk Assessment Documentation Required",
            "No Open Flames or Pyrotechnics"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 59.35796243185084,
            longitude: 28.196813677682453
        },
        features: {
            maxCapacity: 25,
            parkingSpots: 15,
            equipmentIncluded: false,
            accessibility: false,
        }
    },
    {
        id: "4",
        title: "Valaste Waterfall - Dramatic Natural Landscape",
        description: `Capture the breathtaking beauty of Estonia's highest waterfall at Valaste - a spectacular natural filming location offering unique photographic opportunities throughout the seasons. This impressive cascade drops 30 meters down the Baltic Klint limestone cliff, providing a dramatic backdrop for creative projects requiring powerful natural elements and scenic landscapes.

Features:
• Estonia's highest waterfall (30m) with dramatic cascading water effects
• Purpose-built viewing platform offering unique perspectives of the falls
• Metal staircase leading down the cliff face for varied shooting angles
• Striking seasonal variations: flowing water in spring/summer, ice formations in winter
• Rich natural textures including limestone cliff faces, lush vegetation, and forest surroundings
• Natural amphitheater-like setting with excellent acoustics
• Coastal location with Baltic Sea views in the distance
• Both sun-drenched and shaded areas depending on time of day

The Valaste waterfall location offers exceptional visual drama with its combination of vertical elements, natural movement, and changing light conditions throughout the day. The metal observation platform and stairway provide infrastructure for diverse shooting angles, while the surrounding natural environment remains unspoiled and photogenic.

During winter months, the waterfall transforms into a spectacular ice formation, creating a surreal frozen landscape that offers unique photographic opportunities impossible to replicate elsewhere. Spring brings powerful water flow, while summer provides lush green surroundings contrasting with the white water.

This location is ideal for music videos, fashion photography, adventure-themed commercials, nature documentaries, romantic film scenes, product photography requiring dramatic natural backdrops, and artistic projects seeking to incorporate powerful natural elements.

The viewing platform can accommodate small crews while providing stable infrastructure for equipment. The surrounding area offers additional shooting locations in the forest and along the cliff edge, expanding creative possibilities.`,
        address: "Valaste, 41557 Ida-Viru County",
        price: 0,
        area: 1200,
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
            "30-meter Waterfall Access",
            "Metal Viewing Platform",
            "Staircase Down Cliff Face",
            "Natural Forest Surroundings",
            "Multiple Photography Angles",
            "Varied Natural Lighting Conditions",
            "Limestone Cliff Textures",
            "Baltic Sea Coastal Views",
            "Seasonal Natural Variations",
            "Parking Area (5+ spots)",
            "Basic Restroom Facilities Nearby",
            "Informational Signage"
        ],
        rules: [
            "Public Access Location",
            "No Exclusive Closing Possible",
            "Respect Other Visitors",
            "Minimum Impact on Environment",
            "No Equipment on Waterfall Structure",
            "Stay on Designated Paths",
            "Safety First Near Cliff Edges",
            "No Drones Without Permission",
            "Weight Limit on Viewing Platform",
            "No Commercial Use Without Permit",
            "No Littering or Environmental Damage",
            "Weather-Dependent Access"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 59.443810982546665,
            longitude: 27.33550930739698
        },
        features: {
            maxCapacity: 15,
            parkingSpots: 5,
            equipmentIncluded: false,
            accessibility: false,
        }
    },
    {
        id: "5",
        title: "Narva Alexander's Church - Historic Architectural Marvel",
        description: `Step into the grandeur of Estonian ecclesiastical heritage at Narva Alexander's Church - a stunning historical location offering exceptional filming and photography opportunities. This magnificent Neo-Byzantine landmark stands as a testament to Narva's rich multicultural history and provides a striking backdrop for creative projects.

Features:
• Impressive Neo-Byzantine architecture with distinctive dome and bell tower
• Grand interior space with soaring ceilings and exceptional acoustics
• Authentic historical elements preserved throughout the structure
• Magnificent stained glass windows creating dramatic lighting effects
• Original iconography and religious artwork providing cultural context
• Unique architectural details including arches, columns, and ornate fixtures
• Excellent natural light qualities filtering through large windows
• Contrasting textures of stone, wood, and metal throughout the building

The church's exterior presents imposing architectural lines with its distinctive dome and bell tower creating a commanding presence against the sky. The building's façade offers numerous compositional opportunities with its symmetrical elements, decorative details, and grand entrance.

Inside, the spacious sanctuary features soaring ceilings, creating an atmosphere of reverence and grandeur. The church's interior is characterized by excellent acoustics, making it ideal for productions requiring high-quality sound recording. Natural light streams through the large windows, creating dramatic lighting effects that change throughout the day and seasons.

This location is ideal for historical films, religious themed productions, cultural documentaries, classical music performances, wedding photography, fashion editorials requiring architectural backdrops, and artistic projects seeking to incorporate elements of Estonian and Russian cultural heritage.

The church provides a unique combination of historical significance, architectural beauty, and spiritual atmosphere that cannot be replicated in studio settings. Its location in the historic border city of Narva offers additional context and storytelling opportunities about Estonia's complex cultural history.`,
        address: "Hariduse tn 18, 20306 Narva",
        price: 160,
        area: 850,
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
            "Neo-Byzantine Architecture",
            "Grand Interior Sanctuary",
            "Stained Glass Windows",
            "Ornate Iconography",
            "Exceptional Acoustics",
            "Decorative Architectural Elements",
            "Historic Bell Tower Access",
            "Dramatic Natural Lighting",
            "Multiple Photography Angles",
            "Close to Narva Castle",
            "Parking Available (5+ spaces)",
            "Basic Restroom Facilities"
        ],
        rules: [
            "Advance Booking Required (1 week)",
            "Minimum Booking: 2 Hours",
            "Full Payment Required in Advance",
            "72-Hour Cancellation Policy",
            "Maximum 20 People During Shooting",
            "Respectful Conduct Required",
            "No Altering Religious Elements",
            "No Flash Photography at Iconostasis",
            "No Moving Religious Artifacts",
            "Quiet During Active Services",
            "No Commercial Use Without Clear Permission",
            "Shoes May Need to be Removed in Sacred Areas"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 59.38059032383917,
            longitude: 28.19146163335794,
        },
        features: {
            maxCapacity: 20,
            parkingSpots: 5,
            equipmentIncluded: false,
            accessibility: true,
        }
    },
    {
        id: "6",
        title: "Sompa Cultural Club - Soviet-Era Architectural Gem",
        description: `Discover a perfectly preserved piece of Soviet cultural history at Sompa Cultural Club - an impressive architectural landmark available as a unique filming and photography location. This imposing Socialist Classicist building from the 1950s offers exceptional period settings with original features maintained throughout.

Features:
• Grand Socialist Classicist architecture with impressive columned façade
• Spectacular main hall with original stage, ornate ceiling and period details
• Preserved Soviet-era interior design elements throughout the building
• Impressive staircase with decorative balustrades and period lighting fixtures
• Multiple halls and rooms in different sizes for varied shooting setups
• Authentic Soviet-era furniture and decorative elements
• Natural light through large windows complemented by original chandeliers
• Various texture elements including parquet flooring, decorative plasterwork, and wood paneling

The Sompa Cultural Club's exterior presents an imposing façade with classical columns and symmetrical design characteristic of Stalin-era architecture. The building's grand entrance with its decorative doorways and steps provides an impressive establishing shot for period productions.

Inside, the central feature is the magnificent main hall with its stage, ornate ceiling details, and original seating - perfect for performances, concert scenes, or large gathering sequences. The building retains numerous smaller rooms including meeting spaces, backstage areas, and administrative offices that provide additional setting options.

This location is ideal for historical films set in the Soviet era, period dramas, documentaries about Eastern European history, music videos requiring grand retro settings, fashion photography utilizing Soviet aesthetics, and any production seeking to capture the unique architectural style and atmosphere of mid-20th century Eastern Europe.

The authentic preservation of this cultural club offers filmmakers and photographers a ready-made period set that would be prohibitively expensive to recreate in a studio. Every detail from light fixtures to door handles contributes to the immersive historical atmosphere of the location.`,
        address: "Humala tn 1, Sompa, 30721 Ida-Viru maakond",
        price: 140,
        area: 1800,
        minimumBookingHours: 3,
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
            "Grand Socialist Classicist Architecture",
            "Spectacular Main Hall with Stage",
            "Original Soviet-Era Decorative Elements",
            "Ornate Decorative Ceilings",
            "Period Lighting Fixtures & Chandeliers",
            "Impressive Entrance Staircase",
            "Multiple Hall Spaces in Various Sizes",
            "Authentic Soviet-Era Furniture",
            "Original Parquet Flooring",
            "Preserved Woodwork & Moldings",
            "Parking Area (8+ spots)",
            "Basic Restroom Facilities"
        ],
        rules: [
            "Advance Booking Required (72h)",
            "Minimum Booking: 3 Hours",
            "Full Payment Required in Advance",
            "72-Hour Cancellation Policy",
            "Maximum 30 People on Site",
            "Building Guide Must Accompany All Crews",
            "No Removing Historical Elements",
            "No Permanent Modifications to Structure",
            "Respect Period Features and Finishes",
            "No Smoke Effects Without Permission",
            "Liability Insurance Required",
            "Additional Cleaning Fee May Apply"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 59.33961445351482,
            longitude: 27.28781998935332
        },
        features: {
            maxCapacity: 30,
            parkingSpots: 8,
            equipmentIncluded: false,
            accessibility: true,
        }
    },
    {
        id: "7",
        title: "Sinimäe Observation Tower - Historic Viewing Point",
        description: `Experience panoramic vistas and rich historical context at the Sinimäe Observation Tower - a unique filming and photography location with extraordinary scenic views and powerful historical significance. This modern viewing tower stands on the historic Blue Hills battlefield site, offering 360-degree perspectives of the surrounding landscape and Estonian-Russian border region.

Features:
• Modern observation tower with multiple viewing platforms at different heights
• Sweeping panoramic views of forests, fields, and the Baltic coast in the distance
• Located on historically significant WWII battlefield site with authentic context
• Architectural design blending contemporary elements with natural surroundings
• All-weather access for seasonal shooting variations
• Distinctive spiral staircase creating interesting compositional opportunities
• Natural lighting conditions that change dramatically throughout the day
• Surrounding forest and field landscapes providing additional shooting locations

The Sinimäe Observation Tower rises above the historic Blue Hills (Sinimäed), site of fierce battles during World War II. This modern structure provides exceptional vantage points of the surrounding countryside with its mix of dense forests, open fields, and distant glimpses of the Baltic Sea coastline. The tower's design features a distinctive spiral staircase and multiple viewing platforms that create interesting foreground elements for landscape photography.

From the top platform, capture dramatic landscapes in all directions with views extending to the Russian border and nearby towns. The elevation provides unique opportunities for aerial-style perspectives without drone equipment, while the tower itself serves as an architectural subject with its clean lines and contemporary design.

This location is ideal for landscape photography, historical documentaries, music videos requiring dramatic backdrops, fashion photography utilizing height and perspective, and creative projects exploring themes of history, borders, and perspective. The site's historical significance adds depth and context to visual storytelling.

The surrounding area offers additional shooting locations with memorial stones, forest paths, and battlefield remnants that can be incorporated into historical productions or used as contrasting natural elements in contemporary creative work.`,
        address: "Sinimäe, 40101 Ida-Viru County",
        price: 70,
        area: 320,
        minimumBookingHours: 2,
        images: [
            "/locations/Sinimae-vaatetorn_okt2023-EXT-2.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-1.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-4.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-5.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-6.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-7.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-8.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-9.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-10.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-11.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-12.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-13.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-14.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-15.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-16.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-20.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-21.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-23.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-24.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-25.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-27.jpg",
            "/locations/Sinimae-vaatetorn_okt2023-EXT-29.jpg",
        ],
        amenities: [
            "360° Panoramic Viewing Platform",
            "Multiple Viewing Levels",
            "Historical WWII Battlefield Site",
            "Modern Architectural Design",
            "Spiral Staircase Access",
            "All-Weather Photography Location",
            "Dramatic Landscape Views",
            "Russian Border Visibility",
            "Forested Surroundings",
            "Memorial Stones & Historical Markers",
            "Educational Historical Displays",
            "Parking Area (6+ spots)"
        ],
        rules: [
            "Public Access Location",
            "No Exclusive Booking Available",
            "Respect Other Visitors",
            "Educational/Historical Site Respect Required",
            "No Heavy Equipment on Tower",
            "Maximum 10 People on Tower at Once",
            "No Drone Flying Without Permission",
            "Commercial Photography May Need Permits",
            "No Modifying Historical Markers",
            "Public Hours Must Be Respected",
            "No Tripods During Peak Visitor Hours",
            "Weather-Dependent Access to Tower"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 59.373714997576485,
            longitude: 27.88109084960839
        },
        features: {
            maxCapacity: 10,
            parkingSpots: 6,
            equipmentIncluded: false,
            accessibility: false,
        }
    },
    {
        id: "8",
        title: "Kiviõli Adventure Center - Unique Industrial Landscape",
        description: `Discover Estonia's most extraordinary transformation story at Kiviõli Adventure Center - a former ash hill converted into a thrilling recreation complex and exceptional filming location. This man-made mountain created from oil shale mining waste has been reborn as a dynamic adventure center, offering filmmakers and photographers unique industrial landscapes combined with modern recreational facilities.

Features:
• Distinctive industrial landscape with 90-meter artificial mountain created from mining waste
• Panoramic views from the summit offering 360-degree vistas of the surrounding region
• Year-round filming possibilities with winter ski slopes and summer downhill tracks
• Dramatic contrast between industrial heritage and modern recreational facilities
• Various textural elements including rocky slopes, mechanical infrastructure, and surrounding nature
• Multiple shooting locations from summit, mid-mountain, and base areas
• Technical facilities including cable lift systems, adventure park elements, and service buildings
• Striking visual history of environmental reclamation and industrial transformation

The Kiviõli Adventure Center presents a compelling visual narrative of industrial transformation. The artificial mountain rises dramatically from the surrounding flat landscape, creating an imposing silhouette visible for miles around. The site's unique origin as an oil shale waste heap gives it distinctive coloration and texture unlike any natural mountain in Europe.

From the summit, capture sweeping views across the Estonian countryside, with industrial facilities visibly integrated into the natural landscape. The mountain itself offers varied terrain from steep slopes to gentle inclines, with infrastructure elements including ski lifts, ziplines, and service buildings providing industrial-recreational contrast.

This location is ideal for adventure sport videos, environmental documentaries, corporate transformation stories, science fiction productions seeking otherworldly landscapes, fashion photography utilizing industrial elements, and automotive commercials requiring dramatic elevation changes and sweeping vistas.

The adventure center's unique combination of industrial heritage, modern recreational design, and environmental reclamation presents a powerful visual metaphor for transformation and rebirth. The dramatic slopes and technical infrastructure provide both foreground interest and background context for visual storytelling in any season.`,
        address: "Kiviõli, 43125 Ida-Viru County",
        price: 130,
        area: 7000,
        minimumBookingHours: 2,
        images: [
            "/locations/Kivioli-Tuhamagi_okt2023-EXT-1.jpg",
            "/locations/Kivioli-Tuhamagi_okt2023-EXT-2.jpg",
            "/locations/Kivioli-Tuhamagi_okt2023-EXT-3.jpg",
            "/locations/Kivioli-Tuhamagi_okt2023-EXT-4.jpg",
            "/locations/Kivioli-Tuhamagi_okt2023-EXT-5.jpg",
            "/locations/Kivioli-Tuhamagi_okt2023-EXT-6.jpg",
            "/locations/Kivioli-Tuhamagi_okt2023-EXT-9.jpg",
            "/locations/Kivioli-Tuhamagi_okt2023-EXT-10.jpg",
            "/locations/Kivioli-Tuhamagi_okt2023-EXT-11.jpg",
            "/locations/Kivioli-Tuhamagi_okt2023-EXT-13.jpg",
            "/locations/Kivioli-Tuhamagi_okt2023-EXT-14.jpg",
        ],
        amenities: [
            "90-meter Artificial Mountain Access",
            "Cable Lift System Usage",
            "Adventure Park Elements",
            "360° Panoramic Views",
            "Summer Downhill Tracks",
            "Winter Ski Slopes (seasonal)",
            "Multiple Shooting Levels",
            "Technical Service Buildings",
            "Environmental Reclamation Showcase",
            "Industrial-Recreational Contrast",
            "Large Parking Area (15+ spots)",
            "Basic Facilities at Base"
        ],
        rules: [
            "Advance Booking Required (72h)",
            "Minimum Booking: 2 Hours",
            "Payment Required Before Access",
            "48-Hour Cancellation Policy",
            "Maximum 30 People on Site",
            "Heavy Equipment Requires Special Permission",
            "Do Not Interfere with Recreational Activities",
            "Safety Regulations Must Be Followed",
            "No Modifications to Infrastructure",
            "Seasonal Access Limitations Apply",
            "Liability Insurance Required",
            "Center Guide May Be Required for Some Areas"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 59.36280929819766,
            longitude: 26.95148937890987
        },
        features: {
            maxCapacity: 30,
            parkingSpots: 15,
            equipmentIncluded: false,
            accessibility: true,
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
