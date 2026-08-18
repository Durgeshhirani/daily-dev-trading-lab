import express from 'express';
import path from 'path';

let router = express.Router();

export type myType = {
    id: number,
    name?: string
}

router.post('/type', (req, res) => {
    let var1: myType = {
        id: 1
    };

    res.json({
        type: var1
    })
})

router.post('/test', (req, res) => {
    let mypath: string = path.join(process.cwd(), 'package.json');
    res.json({
        status: 200,
        message: "it is working",
        path: typeof mypath
    })
})

export default router;