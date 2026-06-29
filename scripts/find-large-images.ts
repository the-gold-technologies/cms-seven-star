import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Parse .env manually to load credentials
const dotenvPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(dotenvPath)) {
  const envConfig = fs.readFileSync(dotenvPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const BUCKET = "myBucket";

async function main() {
  console.log("Connecting to Supabase Storage...");
  console.log("Bucket Name:", BUCKET);

  let offset = 0;
  const limit = 100;
  let allFiles: any[] = [];
  let fetchMore = true;

  while (fetchMore) {
    const { data, error } = await supabase.storage.from(BUCKET).list("", {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" }
    });

    if (error) {
      console.error("Error listing files from Supabase:", error.message);
      break;
    }

    if (!data || data.length === 0) {
      fetchMore = false;
    } else {
      allFiles = allFiles.concat(data);
      offset += limit;
      if (data.length < limit) {
        fetchMore = false;
      }
    }
  }

  console.log(`Total files found in bucket: ${allFiles.length}`);

  const TEN_MB = 10 * 1024 * 1024;
  const largeFiles = allFiles.filter(file => file.metadata && file.metadata.size > TEN_MB);

  if (largeFiles.length === 0) {
    console.log("No files larger than 10MB found.");
  } else {
    console.log("\nFiles larger than 10MB:");
    largeFiles.forEach(file => {
      const sizeInMB = (file.metadata.size / (1024 * 1024)).toFixed(2);
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${file.name}`;
      console.log(`- Name: ${file.name}`);
      console.log(`  Size: ${sizeInMB} MB`);
      console.log(`  URL:  ${publicUrl}\n`);
    });
  }
}

main().catch(console.error);
