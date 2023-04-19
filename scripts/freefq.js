#!/usr/bin/env node

// https://github.com/freefq/free
// https://raw.fastgit.org/freefq/free/master/v2

async function fetch_links() {
  const response = await fetch(`https://raw.fastgit.org/freefq/free/master/v2`);
  const data = await response.text();
  return Buffer
    .from(data, "base64")
    .toString()
    .split(/\n/g)
    .filter(Boolean);
}

function parse_link(link) {
  const [proto, data] = link.split("://");
  return [proto, Buffer.from(data, "base64").toString()];
}

const map = {
  vmess(data) {
    // console.log(data)
  }
}

async function main() {
  const links = await fetch_links();
  for (const link of links) {
    const [proto, data] = parse_link(link)
    if (proto in map) {
      map[proto](data);
    } else {
      console.log("error:", proto)
    }
  }
}

main();