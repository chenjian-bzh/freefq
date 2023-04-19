const fs = require("fs");
const YAML = require("js-yaml");

const { writeFile } = fs.promises;
const writeYaml = (filename, obj) =>
  writeFile(filename, YAML.dump(obj));

module.exports = {
    writeFile,
    writeYaml,
};