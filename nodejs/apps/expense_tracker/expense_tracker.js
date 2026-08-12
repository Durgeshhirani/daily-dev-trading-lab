import Http from "node:http";

// console.log(Http)

let server = Http.createServer((req, res) => {
    console.log(req.method);
    if (req.method == 'POST') {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        // res.end(`${req}`)
        res.end(JSON.stringify({
            status: 200,
            data: {
                name: "durgesh"
            },
            message: "this is message"
        }))
    }
})

server.listen(3000, () => {
    console.log("running on 3000 port");

})