// event loop deep dive
console.log("hello");

/*
https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif
https://roadmap.sh/nodejs

*/

let app: unknown = process.version;

app = 123;

type User = {
    id: Number,
    readonly name: String,
    age?: Number
}

let myuser: User = {
    id: 1,
    name: "durgesh"
}
// myuser.name = "david"
console.log(myuser);

function add(a: number, b: number): number {
    return a + b;
}
console.log(add(1, 234));
