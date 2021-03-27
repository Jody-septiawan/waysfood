const jwt = require('jsonwebtoken');

const secretKey = "243hj2hk35ghfg";

exports.auhtenticated = (req, res, next) => {
    let header, token;

    if (
        !(header = req.header("Authorization")) ||
        !(token = header.replace("Bearer ", ""))
    ) {
        return res.status(400).send({
            status: "Failed",
            message: "Access Denied"
        });
    }

    try {

        const verified = jwt.verify(token, secretKey);
        req.userId = verified;
        next();

    } catch (err) {

        console.log(err);
        res.status(400).send({
            status: "failed",
            message: "Invalid Token",
        });

    }
};