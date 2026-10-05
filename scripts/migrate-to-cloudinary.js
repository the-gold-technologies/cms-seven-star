require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

/**
 * Migration Script: Supabase Storage (myBucket) -> Cloudinary
 * 
 * Features:
 * 1. Verifies Cloudinary configuration.
 * 2. Fetches all files from database / seed.
 * 3. Uploads each image to Cloudinary preserving original quality (no compression).
 * 4. Backs up prisma/seed.js before editing.
 * 5. Replaces all Supabase URLs in prisma/seed.js with exact Cloudinary URLs.
 * 6. (Optional) Updates live Supabase PostgreSQL Section content.
 * 7. Writes migration-map.json log.
 */

// 1. Cloudinary Setup
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "seven_star";
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const folderName = process.env.CLOUDINARY_FOLDER || "seven_star";

let cloudinary;
try {
  cloudinary = require("cloudinary").v2;
  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }
} catch {
  // Cloudinary package might need installation
}

async function main() {
  console.log("==================================================");
  console.log("🚀 Supabase Storage -> Cloudinary Migration Script");
  console.log("==================================================\n");

  // Step 1: Pre-flight checks
  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("⚠️  Missing Cloudinary credentials in .env!");
    console.log("Please add the following to your .env file:\n");
    console.log("  CLOUDINARY_CLOUD_NAME=your_cloud_name");
    console.log("  CLOUDINARY_API_KEY=your_api_key");
    console.log("  CLOUDINARY_API_SECRET=your_api_secret\n");
    console.log("ℹ️  Running in DRY-RUN / PREPARATION mode...\n");
  }

  // Step 2: Read current prisma/seed.js
  const seedPath = path.join(__dirname, "../prisma/seed.js");
  if (!fs.existsSync(seedPath)) {
    console.error(`❌ seed.js not found at ${seedPath}`);
    process.exit(1);
  }

  const seedContent = fs.readFileSync(seedPath, "utf-8");

  // Step 3: Extract all Supabase URLs from seed.js
  const regex = /(https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/myBucket\/([^"'\s\\)]+))/g;
  const matches = [...seedContent.matchAll(regex)];

  const urlMap = new Map(); // oldUrl -> fileName
  for (const m of matches) {
    const fullUrl = m[1];
    const fileName = m[2];
    if (!urlMap.has(fullUrl)) {
      urlMap.set(fullUrl, fileName);
    }
  }

  console.log(`📋 Found ${matches.length} total URL occurrences in seed.js.`);
  console.log(`🖼️  Unique files to migrate: ${urlMap.size}\n`);

  // Step 4: Check if Supabase Storage Egress is reachable
  const testUrl = matches[0]?.[1];
  let isEgressActive = false;
  if (testUrl) {
    try {
      const res = await fetch(testUrl);
      if (res.ok) {
        isEgressActive = true;
        console.log("✅ Supabase storage HTTP download is ACTIVE.");
      } else if (res.status === 402) {
        console.warn("⚠️  Supabase storage returned HTTP 402 (Payment Required / exceed_cached_egress_quota).");
        console.log("👉 Action needed: In your Supabase Dashboard (Settings > Billing), temporarily disable the Spend Cap so files can be fetched for transfer.\n");
      } else {
        console.warn(`⚠️ Supabase storage returned HTTP status ${res.status}`);
      }
    } catch (err) {
      console.warn("⚠️ Could not reach Supabase storage:", err.message);
    }
  }

  if (!cloudName || !apiKey || !apiSecret || !isEgressActive) {
    console.log("\n--------------------------------------------------");
    console.log("📌 Checklist before running full migration:");
    console.log("  1. npm install cloudinary");
    console.log("  2. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env");
    console.log("  3. Restore Supabase storage egress (disable spend cap in Supabase settings)");
    console.log("  4. Re-run: node scripts/migrate-to-cloudinary.js");
    console.log("--------------------------------------------------\n");
    return;
  }

  // Step 5: Perform Uploads to Cloudinary
  console.log("Uploading images to Cloudinary without altering quality...");
  const replacements = {}; // oldUrl -> newCloudinaryUrl
  let processed = 0;
  const total = urlMap.size;

  for (const [oldUrl, fileName] of urlMap.entries()) {
    processed++;
    const publicId = path.parse(fileName).name; // clean name without extension

    try {
      process.stdout.write(`[${processed}/${total}] Uploading ${fileName}... `);

      let uploadUrl = oldUrl;
      let uploadResult;
      try {
        uploadResult = await cloudinary.uploader.upload(uploadUrl, {
          folder: folderName,
          public_id: publicId,
          resource_type: "auto",
          overwrite: true,
          use_filename: true,
          unique_filename: false,
        });
      } catch (firstErr) {
        // Fallback for known renamed files
        if (fileName.includes("WhatsAppImage2026-06-11at21.23.03")) {
          const fallbackUrl = "https://hnbxxyyfesdapmxpsppo.supabase.co/storage/v1/object/public/myBucket/1787659089858-1781195615052-WhatsAppImage2026-06-11at21.23.03.webp";
          uploadResult = await cloudinary.uploader.upload(fallbackUrl, {
            folder: folderName,
            public_id: publicId,
            resource_type: "auto",
            overwrite: true,
            use_filename: true,
            unique_filename: false,
          });
        } else {
          throw firstErr;
        }
      }

      replacements[oldUrl] = uploadResult.secure_url;
      console.log(`✅ -> ${uploadResult.secure_url}`);
    } catch (err) {
      console.error(`\n⚠️  Could not upload ${fileName} (${err.message}). Skipping.`);
    }
  }

  // Step 6: Backup seed.js
  const timestamp = Date.now();
  const backupPath = path.join(__dirname, `../prisma/seed.backup.${timestamp}.js`);
  fs.writeFileSync(backupPath, seedContent, "utf-8");
  console.log(`\n💾 Backup of seed.js saved to: ${backupPath}`);

  // Step 7: Replace URLs in seed.js
  let updatedSeedContent = seedContent;
  let replaceCount = 0;

  for (const [oldUrl, newUrl] of Object.entries(replacements)) {
    // Escape regex special chars in oldUrl
    const escapedOld = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const count = (updatedSeedContent.match(new RegExp(escapedOld, "g")) || []).length;
    replaceCount += count;
    updatedSeedContent = updatedSeedContent.replaceAll(oldUrl, newUrl);
  }

  fs.writeFileSync(seedPath, updatedSeedContent, "utf-8");
  console.log(`🎉 Successfully replaced ${replaceCount} occurrences in prisma/seed.js!`);

  // Step 8: Save mapping log file
  const mapPath = path.join(__dirname, `../prisma/cloudinary-url-map.json`);
  fs.writeFileSync(mapPath, JSON.stringify(replacements, null, 2), "utf-8");
  console.log(`📝 Migration map saved to: ${mapPath}`);

  // Step 9: Ask / update live database directly
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("\n🔄 Updating live Supabase PostgreSQL sections...");
    let dbUpdated = 0;

    for (const [oldUrl, newUrl] of Object.entries(replacements)) {
      const res = await client.query(
        `UPDATE "Section" 
         SET content = replace(content::text, $1, $2)::jsonb 
         WHERE content::text LIKE '%' || $1 || '%'`,
        [oldUrl, newUrl]
      );
      dbUpdated += res.rowCount;
    }

    console.log(`✅ Updated ${dbUpdated} database section records with new Cloudinary URLs.`);
    await client.end();
  } catch (dbErr) {
    console.warn("⚠️ Could not update live DB automatically:", dbErr.message);
    console.log("You can run `npm run seed` to push the updated seed.js into the database anytime.");
  }

  console.log("\n✨ Migration finished successfully!");
}

main().catch(console.error);
