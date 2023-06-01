#!/usr/bin/env node

const fs = require("fs");
const YAML = require("js-yaml");

const { writeFile } = fs.promises;
const writeYaml = (filename, obj) =>
  writeFile(filename, YAML.dump(obj));

const readYaml = data => YAML.load(data);

async function fetch_rss() {
  const response = await fetch(`https://www.cfmem.com/feeds/posts/default?alt=rss`);
  const rss = await response.text();
  const r1 = /(https:\/\/[^<>\s]+\.yaml)/g;
  return rss.match(r1);
}

async function fetch_yaml(link) {
  const response = await fetch(link);
  const data = await response.text();
  const yaml = readYaml(data);
  const { proxies } = yaml;
  return proxies;
}


; (async () => {
  const links = await fetch_rss();
  console.log(links);
  const [latest] = links;
  const proxies = await fetch_yaml(latest);
  await writeYaml("./proxies/v2rayse.yaml", { proxies });
})();
