const readFile = require('./reader.js')
const http = require('http')
const queryString = require('querystring')
//module dependencies
const queryData = readFile('data.json') 

const queryParams = queryData['queryParameters']
const url = queryData['url'] + '?' + queryString.stringify(queryParams)
const method = queryData['method']

http.get(url,(res)=> {
  let data = ''

  res.on('data',(part)=>{
    data += part
  })

  res.on('end',()=> console.log(JSON.parse(data)))

}).on("error",(err)=> console.error("Error: "+ err.message))

