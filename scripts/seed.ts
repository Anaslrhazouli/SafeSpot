/**
 * Seed script for SafeSpot database
 *
 * Usage:
 *   1. Set your service role key below (from Supabase Dashboard > Settings > API)
 *   2. Run: npx tsx scripts/seed.ts
 *
 * This will create:
 *   - 5 user accounts with profiles
 *   - 30 spots across French cities with real addresses
 *   - Tags for each spot
 *   - Photos for each spot
 */

import { createClient } from "@supabase/supabase-js";

// ─── Configuration ───────────────────────────────────────────────────────────
const SUPABASE_URL = "https://atbhkvlzdqvukuxyljqm.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0Ymhrdmx6ZHF2dWt1eHlsanFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzIzMzE5NCwiZXhwIjoyMDg4ODA5MTk0fQ.pfix7kTC2NNDRSCQVBL5P0YlArP15mn91KYBCrsVkM0";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Seed Data ───────────────────────────────────────────────────────────────

const USERS = [
  { email: "alice@safespot.test", password: "Test1234!", display_name: "Alice Martin" },
  { email: "bob@safespot.test", password: "Test1234!", display_name: "Bob Dupont" },
  { email: "claire@safespot.test", password: "Test1234!", display_name: "Claire Bernard" },
  { email: "david@safespot.test", password: "Test1234!", display_name: "David Moreau" },
  { email: "emma@safespot.test", password: "Test1234!", display_name: "Emma Leroy" },
];

interface SpotSeed {
  title: string;
  category: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  is_favorite: boolean;
  is_safe_at_night: boolean;
  tags: string[];
  photos: string[];
  user_index: number;
}

const SPOTS: SpotSeed[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ALICE (user_index: 0) — Paris, Nice, + 2 Lyon
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Shakespeare and Company",
    category: "Study",
    description: "Legendary English-language bookstore on the Left Bank. Quiet upstairs reading room with cozy nooks perfect for studying.",
    address: "37 Rue de la Bûcherie, 75005 Paris",
    latitude: 48.8526,
    longitude: 2.3471,
    rating: 5,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["calm", "wifi"],
    photos: [
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
    ],
    user_index: 0,
  },
  {
    title: "Café de Flore",
    category: "Study",
    description: "Historic café in Saint-Germain-des-Prés. Great for morning study sessions with excellent coffee.",
    address: "172 Boulevard Saint-Germain, 75006 Paris",
    latitude: 48.854,
    longitude: 2.3326,
    rating: 4,
    is_favorite: false,
    is_safe_at_night: true,
    tags: ["wifi", "calm"],
    photos: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
    ],
    user_index: 0,
  },
  {
    title: "Jardin du Luxembourg",
    category: "Quiet",
    description: "Beautiful public garden in the 6th arrondissement. Perfect for reading and relaxing between classes.",
    address: "Rue de Médicis, 75006 Paris",
    latitude: 48.8462,
    longitude: 2.3372,
    rating: 5,
    is_favorite: true,
    is_safe_at_night: false,
    tags: ["calm", "accessible"],
    photos: [
      "https://images.unsplash.com/photo-1555990538-1085d1e45e28?w=800",
      "https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=800",
    ],
    user_index: 0,
  },
  {
    title: "Promenade des Anglais",
    category: "Safe",
    description: "The iconic seaside promenade. Well-lit, busy, and safe for evening jogs or walks.",
    address: "Promenade des Anglais, 06000 Nice",
    latitude: 43.6953,
    longitude: 7.2656,
    rating: 5,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["bright", "safe", "accessible"],
    photos: [
      "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=800",
    ],
    user_index: 0,
  },
  // Alice — Lyon spots
  {
    title: "MOF Café Lyon",
    category: "Work",
    description: "Cozy specialty coffee shop in the 1st arrondissement. Perfect for remote work with excellent pastries and fast WiFi.",
    address: "3 Rue du Garet, 69001 Lyon",
    latitude: 45.7676,
    longitude: 4.8344,
    rating: 5,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["wifi", "outlets", "calm", "good coffee"],
    photos: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    ],
    user_index: 0,
  },
  {
    title: "Place Bellecour",
    category: "Safe",
    description: "Largest pedestrian square in Europe, well-lit and always busy. Central meeting point, feels very safe even late at night.",
    address: "Place Bellecour, 69002 Lyon",
    latitude: 45.7578,
    longitude: 4.832,
    rating: 4,
    is_favorite: false,
    is_safe_at_night: true,
    tags: ["bright", "safe", "accessible"],
    photos: [
      "https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=800",
    ],
    user_index: 0,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BOB (user_index: 1) — Paris, Lyon (existing 2), Nice, + add photos
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Pharmacie Citypharma",
    category: "Health",
    description: "Largest pharmacy in Paris with the best prices. Always well-stocked, staff speaks English.",
    address: "26 Rue du Four, 75006 Paris",
    latitude: 48.8527,
    longitude: 2.3338,
    rating: 4,
    is_favorite: false,
    is_safe_at_night: true,
    tags: ["accessible", "cheap"],
    photos: [
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800",
    ],
    user_index: 1,
  },
  {
    title: "Slake Coffee House",
    category: "Work",
    description: "Specialty coffee shop in the Presqu'île area. Fast WiFi, plenty of outlets, and great flat whites.",
    address: "11 Rue Ferrandière, 69002 Lyon",
    latitude: 45.7636,
    longitude: 4.8362,
    rating: 5,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["wifi", "outlets", "calm"],
    photos: [
      "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800",
    ],
    user_index: 1,
  },
  {
    title: "Bibliothèque de la Part-Dieu",
    category: "Study",
    description: "Huge public library in Lyon with free WiFi and silent study rooms. Open late on weekdays.",
    address: "30 Boulevard Marius Vivier Merle, 69003 Lyon",
    latitude: 45.7606,
    longitude: 4.8587,
    rating: 4,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["wifi", "calm", "outlets", "accessible"],
    photos: [
      "https://images.unsplash.com/photo-1568667256549-094345857637?w=800",
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
    ],
    user_index: 1,
  },
  {
    title: "Café du Cycliste",
    category: "Work",
    description: "Trendy café with great coffee and a calm atmosphere. Outlets at most tables, fast WiFi.",
    address: "2 Quai des Deux Emmanuel, 06300 Nice",
    latitude: 43.6955,
    longitude: 7.2852,
    rating: 4,
    is_favorite: false,
    is_safe_at_night: true,
    tags: ["wifi", "outlets", "calm"],
    photos: [
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800",
    ],
    user_index: 1,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CLAIRE (user_index: 2) — Lyon (existing 1), Marseille, Strasbourg, + 1 Lyon
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Parc de la Tête d'Or",
    category: "Quiet",
    description: "Lyon's largest urban park with a lake and botanical garden. Peaceful escape from the city noise.",
    address: "Place du Général Leclerc, 69006 Lyon",
    latitude: 45.7772,
    longitude: 4.8558,
    rating: 5,
    is_favorite: false,
    is_safe_at_night: false,
    tags: ["calm", "accessible"],
    photos: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800",
      "https://images.unsplash.com/photo-1510270331530-9c7cde82e1a5?w=800",
    ],
    user_index: 2,
  },
  {
    title: "Berges du Rhône",
    category: "Safe",
    description: "Aménagements le long du Rhône avec pistes cyclables et éclairage. Idéal pour courir ou marcher le soir.",
    address: "Berges du Rhône, 69003 Lyon",
    latitude: 45.7545,
    longitude: 4.8428,
    rating: 4,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["bright", "safe", "accessible"],
    photos: [
      "https://images.unsplash.com/photo-1581888227599-779811939961?w=800",
    ],
    user_index: 2,
  },
  {
    title: "Café Borély",
    category: "Work",
    description: "Calm café near Parc Borély with sea views. Perfect for remote work in the afternoon sun.",
    address: "Avenue du Parc Borély, 13008 Marseille",
    latitude: 43.2608,
    longitude: 5.3826,
    rating: 4,
    is_favorite: false,
    is_safe_at_night: false,
    tags: ["wifi", "calm"],
    photos: [
      "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800",
    ],
    user_index: 2,
  },
  {
    title: "Le Vieux-Port",
    category: "Safe",
    description: "The main harbor of Marseille, well-lit and patrolled at night. Great for evening walks.",
    address: "Quai du Port, 13002 Marseille",
    latitude: 43.2951,
    longitude: 5.3739,
    rating: 4,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["bright", "safe", "accessible"],
    photos: [
      "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800",
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800",
    ],
    user_index: 2,
  },
  {
    title: "Petite France Quarter",
    category: "Quiet",
    description: "Charming historic quarter with half-timbered houses. Peaceful area to walk and decompress.",
    address: "Petite France, 67000 Strasbourg",
    latitude: 48.5797,
    longitude: 7.7409,
    rating: 5,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["calm", "bright", "safe"],
    photos: [
      "https://images.unsplash.com/photo-1555990538-a452f073b7b0?w=800",
    ],
    user_index: 2,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DAVID (user_index: 3) — Marseille, Bordeaux, Nantes, + 2 Lyon
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Pharmacie du Prado",
    category: "Health",
    description: "Well-stocked pharmacy open late on Avenue du Prado. Helpful staff and quick service.",
    address: "125 Avenue du Prado, 13008 Marseille",
    latitude: 43.2729,
    longitude: 5.3898,
    rating: 3,
    is_favorite: false,
    is_safe_at_night: true,
    tags: ["open late", "accessible"],
    photos: [
      "https://images.unsplash.com/photo-1631549916768-4d8b7094dbfc?w=800",
    ],
    user_index: 3,
  },
  {
    title: "Black List Coffee",
    category: "Work",
    description: "Specialty coffee shop near Place Gambetta. Strong WiFi, good food, and a chill vibe for working.",
    address: "32 Place Gambetta, 33000 Bordeaux",
    latitude: 44.8412,
    longitude: -0.5792,
    rating: 5,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["wifi", "outlets", "cheap"],
    photos: [
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800",
    ],
    user_index: 3,
  },
  {
    title: "Miroir d'Eau",
    category: "Photo",
    description: "The famous water mirror reflecting Place de la Bourse. Stunning at sunset for photos.",
    address: "Place de la Bourse, 33000 Bordeaux",
    latitude: 44.8414,
    longitude: -0.5694,
    rating: 5,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["bright", "accessible", "safe"],
    photos: [
      "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=800",
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800",
    ],
    user_index: 3,
  },
  {
    title: "Parking Gloriette",
    category: "Parking",
    description: "Large underground parking near the CHU. Affordable long-stay rates, well-lit, 24/7 access.",
    address: "Place Ricordeau, 44000 Nantes",
    latitude: 47.2111,
    longitude: -1.5531,
    rating: 4,
    is_favorite: false,
    is_safe_at_night: true,
    tags: ["accessible", "safe", "cheap"],
    photos: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800",
    ],
    user_index: 3,
  },
  // David — Lyon spots
  {
    title: "Vieux Lyon - Rue Saint-Jean",
    category: "Photo",
    description: "Rue médiévale emblématique du Vieux Lyon. Architecture Renaissance, traboules et lumière magnifique pour la photo.",
    address: "Rue Saint-Jean, 69005 Lyon",
    latitude: 45.7627,
    longitude: 4.8267,
    rating: 5,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["bright", "accessible", "safe"],
    photos: [
      "https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=800",
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800",
    ],
    user_index: 3,
  },
  {
    title: "Parking LPA Cordeliers",
    category: "Parking",
    description: "Parking souterrain en plein centre de la Presqu'île. Bien situé pour accéder aux commerces et restaurants.",
    address: "Place des Cordeliers, 69002 Lyon",
    latitude: 45.7637,
    longitude: 4.8367,
    rating: 4,
    is_favorite: false,
    is_safe_at_night: true,
    tags: ["accessible", "safe"],
    photos: [
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800",
    ],
    user_index: 3,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EMMA (user_index: 4) — Bordeaux, Toulouse, Nantes, + 2 Lyon
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Parking Tourny",
    category: "Parking",
    description: "Underground parking near the Grand Théâtre. Reasonable rates and easy to find.",
    address: "Place de Tourny, 33000 Bordeaux",
    latitude: 44.8444,
    longitude: -0.5771,
    rating: 3,
    is_favorite: false,
    is_safe_at_night: true,
    tags: ["accessible", "safe"],
    photos: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800",
    ],
    user_index: 4,
  },
  {
    title: "Café Bibent",
    category: "Food",
    description: "Beautiful Belle Époque brasserie on Place du Capitole. Great for a meal between classes.",
    address: "5 Place du Capitole, 31000 Toulouse",
    latitude: 43.6047,
    longitude: 1.4442,
    rating: 4,
    is_favorite: false,
    is_safe_at_night: true,
    tags: ["accessible"],
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    ],
    user_index: 4,
  },
  {
    title: "Médiathèque José Cabanis",
    category: "Study",
    description: "Modern public library near Marengo station. Quiet floors, fast WiFi, and long opening hours.",
    address: "1 Allée Jacques Chaban-Delmas, 31500 Toulouse",
    latitude: 43.6111,
    longitude: 1.4536,
    rating: 5,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["wifi", "outlets", "calm", "accessible"],
    photos: [
      "https://images.unsplash.com/photo-1568667256549-094345857637?w=800",
    ],
    user_index: 4,
  },
  {
    title: "Lieu Unique",
    category: "Food",
    description: "Arts venue and bar in a former biscuit factory. Great food, creative atmosphere, open late.",
    address: "2 Rue de la Biscuiterie, 44000 Nantes",
    latitude: 47.2153,
    longitude: -1.5451,
    rating: 4,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["open late", "accessible", "cheap"],
    photos: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    ],
    user_index: 4,
  },
  // Emma — Lyon spots
  {
    title: "Presqu'île Food Court",
    category: "Food",
    description: "Halles de Lyon Paul Bocuse. Marché couvert incontournable avec les meilleurs produits lyonnais — fromages, charcuteries, pâtisseries.",
    address: "102 Cours Lafayette, 69003 Lyon",
    latitude: 45.7631,
    longitude: 4.8535,
    rating: 5,
    is_favorite: true,
    is_safe_at_night: true,
    tags: ["accessible", "cheap"],
    photos: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    ],
    user_index: 4,
  },
  {
    title: "Confluence Shopping",
    category: "Work",
    description: "Centre commercial moderne au confluent du Rhône et de la Saône. Espaces de coworking dans les cafés avec vue sur l'eau.",
    address: "112 Cours Charlemagne, 69002 Lyon",
    latitude: 45.7434,
    longitude: 4.8187,
    rating: 4,
    is_favorite: false,
    is_safe_at_night: true,
    tags: ["wifi", "outlets", "accessible"],
    photos: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
    ],
    user_index: 4,
  },
];

// ─── Seed Functions ──────────────────────────────────────────────────────────

async function createUsers(): Promise<string[]> {
  console.log("\n📦 Creating users...\n");
  const userIds: string[] = [];

  for (const user of USERS) {
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === user.email);

    if (existing) {
      console.log(`  ⏭  ${user.email} already exists (${existing.id})`);
      userIds.push(existing.id);
      await supabase.from("profiles").upsert({
        id: existing.id,
        email: user.email,
        display_name: user.display_name,
      });
      continue;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { display_name: user.display_name },
    });

    if (error) {
      console.error(`  ❌ Failed to create ${user.email}:`, error.message);
      process.exit(1);
    }

    console.log(`  ✅ ${user.email} → ${data.user.id}`);
    userIds.push(data.user.id);

    await supabase.from("profiles").upsert({
      id: data.user.id,
      email: user.email,
      display_name: user.display_name,
    });
  }

  return userIds;
}

async function createSpots(userIds: string[]): Promise<void> {
  console.log("\n📍 Creating spots...\n");

  for (const spot of SPOTS) {
    const userId = userIds[spot.user_index];
    const { tags, photos, user_index, ...spotData } = spot;

    const { data, error } = await supabase
      .from("spots")
      .insert({ ...spotData, user_id: userId })
      .select("id")
      .single();

    if (error) {
      console.error(`  ❌ Failed to create "${spot.title}":`, error.message);
      continue;
    }

    console.log(
      `  ✅ "${spot.title}" (${spot.category}) → ${USERS[spot.user_index].display_name}`
    );

    // Insert tags
    if (tags.length > 0) {
      const tagRows = tags.map((label) => ({ spot_id: data.id, label }));
      const { error: tagError } = await supabase.from("spot_tags").insert(tagRows);
      if (tagError) {
        console.error(`    ⚠  Tags failed for "${spot.title}":`, tagError.message);
      }
    }

    // Insert photo records
    if (photos.length > 0) {
      const photoRows = photos.map((url) => ({
        spot_id: data.id,
        image_url: url,
      }));
      const { error: photoError } = await supabase.from("spot_photos").insert(photoRows);
      if (photoError) {
        console.error(`    ⚠  Photos failed for "${spot.title}":`, photoError.message);
      } else {
        console.log(`    📸 ${photos.length} photo(s) added`);
      }
    }
  }
}

async function printSummary(userIds: string[]): Promise<void> {
  const { count: spotCount } = await supabase
    .from("spots")
    .select("*", { count: "exact", head: true });
  const { count: tagCount } = await supabase
    .from("spot_tags")
    .select("*", { count: "exact", head: true });
  const { count: photoCount } = await supabase
    .from("spot_photos")
    .select("*", { count: "exact", head: true });

  console.log("\n────────────────────────────────────────");
  console.log("  Seed complete!");
  console.log(`  Users:    ${userIds.length}`);
  console.log(`  Spots:    ${spotCount}`);
  console.log(`  Tags:     ${tagCount}`);
  console.log(`  Photos:   ${photoCount}`);
  console.log("────────────────────────────────────────");
  console.log("\n  Login credentials (all users):");
  console.log("  Password: Test1234!\n");
  USERS.forEach((u) => console.log(`    ${u.email}`));
  console.log("");
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 SafeSpot Database Seeder");
  console.log("════════════════════════════════════════");

  const userIds = await createUsers();
  await createSpots(userIds);
  await printSummary(userIds);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
