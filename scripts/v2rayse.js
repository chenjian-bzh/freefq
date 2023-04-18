const fs = require("fs");
const YAML = require("js-yaml");

const { writeFile } = fs.promises;

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
  const yaml = YAML.load(data);
  const { proxies } = yaml;
  return writeFile("./proxies/v2rayse.yaml", YAML.dump({ proxies }))
}

fetch_yaml(`https://oss.v2rayse.com/proxies/data/2023-03-25/VAAlRUn.yaml`);

;(async () => {
  const links = await fetch_rss();
  console.log(links);
})();
