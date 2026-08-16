import express from 'express'
import path from 'node:path';
let router = express.Router();

router.all('/path', (req, res) => {
    let mypath = path.resolve(process.cwd(), 'mod_lib_doc', 'prompt.md');
    let absolutePath = path.join('mod_lib_doc', 'prompt.md');

    res.json({
        status: 200,
        // path: path.parse(mypath)
        path: path.parse(mypath),
        sep: path.sep,
        delimiter: path.delimiter
    })
})


export default router;