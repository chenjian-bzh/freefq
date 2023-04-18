const fs = require("fs");
const YAML = require("js-yaml");

const { writeFile } = fs.promises;
const writeYaml = (filename, obj) =>
  writeFile(filename, YAML.dump(obj));

const readYaml = data => YAML.load(data);

module.exports = {
  readYaml,
  writeFile,
  writeYaml,
};