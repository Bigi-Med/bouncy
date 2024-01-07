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
 module.exports = readFile
