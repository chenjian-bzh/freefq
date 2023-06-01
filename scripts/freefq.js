#!/usr/bin/env node

const fs = require("fs");
const url = require('url');
const YAML = require("js-yaml");

const { writeFile } = fs.promises;
const writeYaml = (filename, obj) =>
  writeFile(filename, YAML.dump(obj));

function parseURL(url) {
  const pattern = /^((\w+):\/\/)?((.+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(.*)/;
  const match = pattern.exec(decodeURIComponent(url));
  return Object.entries({
    url: 0,
    protocol: 2,
    auth: 4,
    host: 5,
    port: 6,
    path: 7,
    querystring: 8,
    hash: 9,
  }).reduce((out, [k, v]) => (out[k] = match[v] || '', out), {});
}

// https://github.com/freefq/free
// https://raw.fastgit.org/freefq/free/master/v2

async function fetch_links() {
  const response = await fetch(`https://raw.fastgit.org/freefq/free/master/v2`);
  const data = await response.text();
  return Buffer
    .from(data, "base64")
    .toString()
    .split(/\r?\n/)
    .filter(Boolean);
}


function parse_link(link) {
  const u = parseURL(link);
  if (u.protocol in handlers) {
    return handlers[u.protocol](u);
  } else {
    console.log(`Unknown protocol: ${u.protocol}`);
  }
}

// type: vmess
// server: server
// port: 443
// uuid: uuid
// alterId: 32
// cipher: auto
// network: h2
// tls: true
// h2-opts:
//   host:
//     - http.example.com
//     - http-alt.example.com
//   path: /

// https://github.com/2dust/v2rayN/wiki/%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AF%B4%E6%98%8E(ver-2)
const convert2clash = vmess => {
  const output = {
    type: "vmess",
    name: vmess.ps,
    server: vmess.add,
    port: vmess.port,
    uuid: vmess.id,
    alterId: vmess.aid,
    cipher: "auto",
    network: vmess.net,
    tls: vmess.tls == 'tls',
    'skip-cert-verify': true,
  };
  if (vmess.sni) {
    output.sni = vmess.sni;
  }
  if (vmess.alpn) {
    output.alpn = vmess.alpn;
  }
  const opts = `${vmess.net}-opts`;
  output[opts] = output[opts] || {};
  if (vmess.host) {
    output[opts]["host"] = vmess.host;
    output[opts]["headers"] = {
      "host": vmess.host,
    }
  }
  if (vmess.path) {
    output[opts]["path"] = vmess.path;
  }
  return output;
};

const handlers = {}

const registerHandler = (proto, handler) => {
  handlers[proto] = handler
};

registerHandler('vmess', data => {
  const vmess = JSON.parse(Buffer.from(data.host, 'base64'));
  return convert2clash(vmess);
});

registerHandler('trojan', data => {
  return {
    name: data.hash,
    type: data.protocol,
    server: data.host,
    port: data.port,
    password: data.auth,
    'skip-cert-verify': true,
    alpn: [ "h2", "http/1.1" ]
  };
});

async function main() {
  const links = await fetch_links();
  const proxies = links.map(parse_link).filter(Boolean);
  await writeYaml('./proxies/freefq.yaml', { proxies });
}

main();