const fs = require('fs')

try {
  const queryString = fs.readFileSync('data.json','utf-8');
  const queryData = JSON.parse(queryString);
  console.log(queryData);
} catch(err){
  console.log("Error parsing JSON file", err);
}
