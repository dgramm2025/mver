#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { cwd } from "node:process";

// Get the version from the version.php file
const regex = /\$plugin->version\s*=\s*(\d+);/g;

if (!existsSync(cwd() + "/version.php")) {
  console.log("version.php not found");
  exit(1);
}

const file = readFileSync(cwd() + "/version.php", "utf8");
const vm = RegExp(regex).exec(file)

if (vm) {
  const version = vm[1];
  const currentDate = new Date();
  let versionId = Number.parseInt(version.substring(8), 10);

  if (versionId >= 99) {
    console.log("Version ID has reached its maximum value.");
    exit(1);
  }

  let originalDate = Number.parseInt(version.substring(0, 8), 10);

  if (isNaN(originalDate)) {
    console.log("Invalid version format in version.php");
    exit(1);
  }

  originalDate = new Date(
    originalDate.toString().substring(0, 4),
    Number.parseInt(originalDate.toString().substring(4, 6) - 1, 10).toString().padStart(2, "0"),
    originalDate.toString().substring(6, 8).padStart(2, "0")
  );


  if (originalDate.getFullYear() !== currentDate.getFullYear() ||
      originalDate.getMonth() !== currentDate.getMonth() ||
      originalDate.getDate() !== currentDate.getDate()) {
    // Reset version ID if the date has changed
    versionId = 0;
  } else {
    versionId = versionId + 1;
  }

  // Format the new version string
  const newVersion = `${
    currentDate.getFullYear()
  }${
    (currentDate.getMonth() + 1).toString().padStart(2, "0")
  }${
    currentDate.getDate().toString().padStart(2, "0")
  }${
    versionId.toString().padStart(2, "0")
  }`;

  writeFileSync(cwd() + "/version.php", file.replace(version, newVersion));
}
