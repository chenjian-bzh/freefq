#!/usr/bin/env node

const fs = require("fs");
const YAML = require("js-yaml");

const { writeFile } = fs.promises;
const writeYaml = (filename, obj) =>
  writeFile(filename, YAML.dump(obj));

const readYaml = data => YAML.load(data);

async function fetch_yaml(link) {
  const response = await fetch(link);
  const data = await response.text();
  const yaml = readYaml(data);
  const { proxies } = yaml;
  return proxies;
}


; (async () => {
  const proxies = await fetch_yaml(`https://s.trojanflare.com/clashx/f1cd25c2-b02c-47d8-b42a-86d2adf22eeb`);
  await writeYaml("./proxies/trojanflare.yaml", { proxies });
})();
