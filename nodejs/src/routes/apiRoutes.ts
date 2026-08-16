import express from 'express';
import path from 'path';

let router = express.Router();

router.post('/test', (req, res) => {
    let mypath: Array = path.join(process.cwd(), 'package.json');
    res.json({
        status: 200,
        message: "it is working",
        path: typeof mypath
    })
})

export default router;