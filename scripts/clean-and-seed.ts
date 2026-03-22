/**
 * Clean existing data and re-seed from scratch.
 * Run: npx tsx scripts/clean-and-seed.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://atbhkvlzdqvukuxyljqm.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0Ymhrdmx6ZHF2dWt1eHlsanFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzIzMzE5NCwiZXhwIjoyMDg4ODA5MTk0fQ.pfix7kTC2NNDRSCQVBL5P0YlArP15mn91KYBCrsVkM0";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function clean() {
  console.log("🧹 Cleaning existing data...\n");

  // spot_tags and spot_photos cascade on spot delete, but let's be explicit
  const { error: e1 } = await supabase.from("spot_photos").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  console.log(e1 ? `  ⚠ spot_photos: ${e1.message}` : "  ✅ spot_photos cleared");

  const { error: e2 } = await supabase.from("spot_tags").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  console.log(e2 ? `  ⚠ spot_tags: ${e2.message}` : "  ✅ spot_tags cleared");

  const { error: e3 } = await supabase.from("spots").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  console.log(e3 ? `  ⚠ spots: ${e3.message}` : "  ✅ spots cleared");

  console.log("");
}

clean().then(() => {
  console.log("✅ Clean done. Now running seed...\n");
  return import("./seed");
}).catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
