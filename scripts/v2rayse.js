#!/usr/bin/env node

const { readYaml, writeYaml } = require('../lib/util');

async function fetch_rss() {
  const response = await fetch(`https://www.cfmem.com/feeds/posts/default?alt=rss`);
  const rss = await response.text();
  const r1 = /clash订阅链接：(https?.+?)(?:&lt;)/g;
  var tmp, result = [];
  while (tmp = r1.exec(rss)) {
    const [, link] = tmp;
    result.push(link)
  }
  return result;
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
  const [latest] = links;
  const proxies = await fetch_yaml(latest);
  await writeYaml("./proxies/v2rayse.yaml", { proxies });
})();
