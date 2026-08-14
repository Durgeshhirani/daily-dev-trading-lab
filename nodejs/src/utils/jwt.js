import jwt from 'jsonwebtoken';

process.loadEnvFile();
// assign
export const jwtsign = (data) => {
    console.log(data);
    const payload = { mobile: data.mobile };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}



// verify
export const jwtverify = (token) => {
    // console.log("TOKEN:");
    // console.log(token);

    // console.log("TYPE:");
    // console.log(typeof token);

    const decoded = jwt.decode(token, {
        complete: true
    });

    // console.log("DECODE:");
    // console.log(decoded);
    return jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {

        if (error) {

            console.error(error);

            return error;
        }

        // console.log(payload);
    })
}