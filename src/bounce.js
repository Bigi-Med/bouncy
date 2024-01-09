const readFile = require('./reader.js')
const http = require('http')
const queryString = require('querystring')
//module dependencies
const filePath = process.argv[2]
const queryData = readFile(filePath) 

const queryParams = queryData['queryParameters']
const url = queryData['url'] + '?' + queryString.stringify(queryParams)
const parsedUrl = new URL(url)
const method = queryData['method']
const headers = queryData['headers']
const MAX_REDIRECTS = queryData['max_redirects']?queryData['max_redirects']:3
const followRedirects = queryData['followRedirects']?queryData['followRedirects']:false 
const payload = queryData['payload'];


const options = {
  hostname :parsedUrl.hostname,
  port: parsedUrl.port,
  path : parsedUrl.pathname + parsedUrl.search,
  method : method,
  headers : headers
}

const handleResponse = (res,data,maxRedirects) => {
  //check if the status code is a redirection, and if a redirection destination is present
  if([301,302,303,307,308].includes(res.statusCode) && res.headers.location){
    if(!followRedirects){
      console.error('Cannot follow redirects, you can change this by setting the followRedirects field to true in the json/yml file')
      return;
    }
    if(maxRedirects === 0){
      console.error('Too many redirects, you can change max redirects by setting the field max_redirects in the json/yml file')
      return;
    }
    let redirectUrl = parsedUrl
    if(res.headers.location.startsWith('http://') || res.headers.location.startsWith('https://') ){
       redirectUrl = new URL(res.headers.location)
    } else{
      redirectUrl.pathname = res.headers.location;
    }
    const newOption = {
      ...options,
      hostname: redirectUrl.hostname,
      port: redirectUrl.port,
      path: redirectUrl.pathname + redirectUrl.search,
      headers: {...options.headers}
  }
    console.log(`Redirecting to ${redirectUrl.href}`)
    apiCall(newOption,maxRedirects-1,payload);
  }else{

  try{
      const parsedData = JSON.parse(data)
      console.log(parsedData)
    } catch (e){
      console.log("Data was received in a non-JSON format, printing data as it is ....")
      console.log(data);
    }
  }
}

function apiCall(options,maxRedirects,payload){

  const request = http.request(options, (res)=> {
    let data = '';

    res.on('data',(chunk)=> data+=chunk)
    res.on('end',()=>handleResponse(res,data,maxRedirects,payload));
  })
  request.setTimeout(queryData.timeout,() => {
    request.abort();
    console.log("Request timed out")
  })

  request.on("error", (err)=> console.log(`Problem with the request : ${err.message}`))

  if (payload && options.method === 'POST') {
    const payloadString = JSON.stringify(payload);
    // Set Content-Length header
    request.setHeader('Content-Length', Buffer.byteLength(payloadString));
    request.write(payloadString);
  }
  request.end()
}
apiCall(options,MAX_REDIRECTS,payload)


