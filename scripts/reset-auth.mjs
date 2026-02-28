#!/usr/bin/env node

/**
 * Reset the auth database.
 * Run: node scripts/reset-auth.mjs
 *
 * This deletes the SQLite database so you can start fresh.
 * Your skin data in localStorage is NOT affected.
 */

import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "auth.db");
const walPath = dbPath + "-wal";
const shmPath = dbPath + "-shm";

[dbPath, walPath, shmPath].forEach((f) => {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log(`Deleted: ${f}`);
  }
});

console.log("\n✅ Auth database reset. Restart pnpm dev and sign up again.\n");
