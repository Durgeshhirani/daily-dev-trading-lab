import http from 'node:http'
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
// import process from 'node:process';

process.loadEnvFile();
const port = process.env.PORT;

const currentDir = process.cwd();
const documentPath = path.join(currentDir, 'mod_lib_doc', 'prompt.md');
const writePath = path.join(currentDir, 'mod_lib_doc', 'write.md');

let server = http.createServer(async (req, res) => {
    try {

        if (req.url == '/download') {

            const file = await fsp.readFile(documentPath)
            res.writeHead(201, {
                'Content-Type': 'application/json', 'Content-Disposition':
                    'attachment; filename="prompts_for_yo.md"'
            })
            return res.end(file);
        }

        res.writeHead(201, {
            'Content-Type': 'application/json'
        })

        if (req.url == '/write' && req.method == 'POST') {
            let body = "";
            req.on('data', chunk => {
                body += chunk
            })
            req.on('end', async () => {
                // let oldData = await fsp.readFile(writePath, 'utf8');
                // let newData = oldData + body;
                // fsp.writeFile(writePath, newData ?? 'hello', 'utf8');
                fsp.appendFile(writePath, body ?? 'hello', 'utf8');
            })
        }
        if (req.url == '/delete' && req.method == 'DELETE') {
            await fsp.access(writePath);
            await fsp.unlink(writePath);
            return res.end(JSON.stringify({
                status: 200,
                message: "file write.md is deleted"
            }))
        }
        if (req.url == '/stats') {
            let mydir = path.join(currentDir, 'mod_lib_doc', 'practice.js');
            let mystats = await fsp.stat(mydir)
            return res.end(JSON.stringify({
                status: 200,
                message: "file/folder stats",
                path: mydir,
                data: mystats
            }))
        }
        // from list directory pending

        // const stream = fs.createReadStream(documentPath);
        // stream.pipe(res);


        res.end(JSON.stringify({
            status: 200,
            current_path: process.cwd()
        }))
    } catch (err) {
        res.end(JSON.stringify({
            status: 500,
            message: "Something went wrong",
            error: err
        }))
    }
});


server.listen(port, () => {
    console.log(`running in ${port}`);

})