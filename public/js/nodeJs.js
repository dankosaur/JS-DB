var http = require("http");

http.createServer(function (request, response) {
	//sned the HTTP header
	//HTTP Status: 200: OK
	//Content Type: text/plain
	response.writeHead(200, {'Content-Type': 'text/plain'})
	response.end('Hello World\n')

}).listen(8081);

console.log('Server running at httpL//127.0.0.1:8081')