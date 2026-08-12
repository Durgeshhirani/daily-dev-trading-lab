import http from 'node:http';

let server = http.createServer((req, res) => {
    let body = "";
    req.on("data", chunk => {
        body += chunk
    })
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    req.on("end", () => {
        res.end(JSON.stringify({
            status: 200,
            data: JSON.parse(body)
        }))
    })
})

server.listen(3000, () => {
    console.log("running on 3000")
})