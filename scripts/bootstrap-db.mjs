#!/usr/bin/env node

/**
 * SafeSpot Student — Database Bootstrap Script
 *
 * One-time setup script that:
 *   1. Reads the SQL migration file
 *   2. Applies it to your Supabase project using the service role key
 *   3. Creates the "spot-photos" storage bucket
 *
 * Usage:
 *   1. Copy .env.example to .env and fill in:
 *      - EXPO_PUBLIC_SUPABASE_URL
 *      - SUPABASE_SERVICE_ROLE_KEY
 *   2. Run: node scripts/bootstrap-db.mjs
 *
 * IMPORTANT: This script uses the SERVICE ROLE KEY which has admin access.
 *            NEVER commit this key or include it in the mobile app.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load environment variables from .env file ──
function loadEnv() {
  try {
    const envPath = resolve(__dirname, "..", ".env");
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env file may not exist, rely on system env
  }
}

loadEnv();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log("🚀 SafeSpot Student — Database Bootstrap\n");

  // 1. Run SQL migration
  console.log("📄 Applying migration...");
  const sqlPath = resolve(__dirname, "..", "supabase", "migrations", "0001_init.sql");
  const sql = readFileSync(sqlPath, "utf-8");

  const { error: sqlError } = await supabase.rpc("exec_sql", { sql_text: sql }).maybeSingle();

  // If the RPC doesn't exist, instruct user to use SQL editor
  if (sqlError) {
    console.warn(
      "⚠️  Could not run SQL via RPC. This is normal — Supabase doesn't expose exec_sql by default.\n" +
      "   Please paste the contents of supabase/migrations/0001_init.sql\n" +
      "   into your Supabase Dashboard → SQL Editor and run it manually.\n"
    );
  } else {
    console.log("✅ Migration applied successfully.\n");
  }

  // 2. Create storage bucket
  console.log("📦 Creating storage bucket 'spot-photos'...");
  const { error: bucketError } = await supabase.storage.createBucket(
    "spot-photos",
    {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }
  );

  if (bucketError) {
    if (bucketError.message?.includes("already exists")) {
      console.log("✅ Bucket 'spot-photos' already exists.\n");
    } else {
      console.error("❌ Failed to create bucket:", bucketError.message);
    }
  } else {
    console.log("✅ Bucket 'spot-photos' created.\n");
  }

  console.log("🎉 Bootstrap complete!");
  console.log("\nNext steps:");
  console.log("  1. Verify tables in Supabase Dashboard → Table Editor");
  console.log("  2. Verify RLS policies in Authentication → Policies");
  console.log("  3. Add storage policies for 'spot-photos' bucket (see migration SQL comments)");
  console.log("  4. Run: npx expo start");
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
