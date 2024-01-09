const readFile = require('./reader.js')
const http = require('http')
const queryString = require('querystring')
//module dependencies
const queryData = readFile('data.json') 

const queryParams = queryData['queryParameters']
const url = queryData['url'] + '?' + queryString.stringify(queryParams)
const parsedUrl = new URL(url)
const method = queryData['method']
const headers = queryData['header']
const MAX_REDIRECTS = queryData['max_redirects']?queryData[max_redirects]:3
const followRedirects = queryData['followRedirects']?queryData['followRedirects']:false 


const options = {
  hostname :parsedUrl.hostname,
  port: parsedUrl.port,
  path : parsedUrl.pathname + parsedUrl.search,
  method : method,
  headers : headers
}

function handleResponse(res,data){
    try{
      const parsedData = JSON.parse(data)
      console.log(parsedData)
    } catch (e){
      console.log("Data was received in a non-JSON format, printing data as it is ....")
      console.log(data);
    }
}

const request = http.request(options, (res)=> {
  let data = '';

  res.on('data',(chunk)=> data+=chunk)
  res.on('end',()=>handleResponse(res,data));
})

request.setTimeout(queryData.timeout,() => {
  request.abort();
  console.log("Request timed out")
})

request.on("error", (err)=> console.log(`Problem with the request : ${err.message}`))

request.end()


