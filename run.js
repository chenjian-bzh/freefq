#!/usr/bin/env node

const fs = require("fs");
const YAML = require("js-yaml");
const links = require("./links.json");

const { writeFile } = fs.promises;
const writeYaml = (filename, obj) =>
  writeFile(filename, YAML.dump(obj));

async function convert_sub(url, type = "clash") {
  const response = await fetch(`https://api.dler.io/sub?target=${type}&url=${encodeURIComponent(url)}`)
  const data = await response.text();
  return YAML.load(data);
}

async function main() {
  for (const [name, url] of Object.entries(links)) {
    const data = await convert_sub(url);
    writeYaml(`./proxies/${name}.yaml`, data.proxies);
    console.log(name);
  }
}

main();