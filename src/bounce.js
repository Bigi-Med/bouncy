const readFile = require('./reader.js')
const http = require('http')
const queryData = readFile('data.json') 

const url = queryData['url']
http.get(url,(res)=> {
  let data = ''

  res.on('data',(part)=>{
    data += part
  })

  res.on('end',()=> console.log(JSON.parse(data)))

}).on("error",(err)=> console.error("Error: "+ err.message))

