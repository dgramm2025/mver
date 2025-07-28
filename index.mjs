#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "fs";
import { cwd } from "process";

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

  const versionYear = currentDate.getFullYear();
  let versionMonth = currentDate.getMonth() + 1;
  versionMonth = versionMonth.toString().padStart(2, "0");
  let versionDay = currentDate.getDate();
  versionDay = versionDay.toString().padStart(2, "0");
  versionId = versionId + 1;
  versionId = versionId.toString().padStart(3, "0");

  const newVersion = `${versionYear}${versionMonth}${versionDay}${versionId}`;

  writeFileSync(cwd() + "/version.php", file.replace(version, newVersion));
}
