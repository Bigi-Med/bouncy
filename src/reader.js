const fs = require('fs');
const yaml = require('js-yaml');

function readFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (filePath.endsWith('.json')) {
      return JSON.parse(fileContent);
    } else if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
      return yaml.load(fileContent);
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (err) {
    console.error("Error reading or parsing file:", err);
    return null;
  }
}

const jsonData = readFile('data.json');
console.log('JSON Data:', jsonData);

const yamlData = readFile('data.yml');
console.log('YAML Data:', yamlData);
