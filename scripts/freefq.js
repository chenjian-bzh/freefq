#!/usr/bin/env node

const fs = require("fs");
const YAML = require("js-yaml");

const { writeFile } = fs.promises;
const writeYaml = (filename, obj) =>
  writeFile(filename, YAML.dump(obj));

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

function split_link(link) {
  const [proto, data] = link.split("://");
  return [proto, Buffer.from(data, "base64").toString()];
}

function parse_link(link) {
  const [proto, data] = split_link(link);
  if (proto in handlers) {
    return handlers[proto](data);
  } else {
    console.log(`Unknown protocol: ${proto}`);
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
  const vmess = JSON.parse(data);
  return convert2clash(vmess)
});

registerHandler('trojan', (data) => {
  // console.log(data);
});

async function main() {
  const links = await fetch_links();
  const proxies = links.map(parse_link).filter(Boolean);
  await writeYaml('./proxies/freefq.yaml', { proxies });
}

main();