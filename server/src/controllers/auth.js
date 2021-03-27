const { user } = require("../../models/");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const joi = require('joi');

const secretKey = "243hj2hk35ghfg";

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const data = req.body;

        const schema = joi.object({
            email: joi.string().email().min(6).max(50).required(),
            password: joi.string().min(4).required(),
            fullname: joi.string().required(),
            gender: joi.string().required(),
            phone: joi.string().min(10).max(13).required(),
            role: joi.string().required()
        })

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).send({
                status: "Validation Failed",
                message: error.details[0].message,
            })
        }
        const checkAdmin = await user.findOne({
            where: {
                role: "ADMIN"
            }
        });

        if (role == "ADMIN") {
            if (checkAdmin) {
                return res.send({
                    status: "Register Failed",
                    message: "Admin already exists"
                })
            }
        }

        const checkEmail = await user.findOne({
            where: {
                email
            }
        })

        if (checkEmail) {
            return res.status(400).send({
                status: "Register Failed",
                message: "Email Already Registered"
            })
        }
        const hashStrength = 10;
        const hashedPassword = await bcrypt.hash(password, hashStrength)

        const userInput = await user.create({
            ...data,
            password: hashedPassword
        });

        const secretKey = "243hj2hk35ghfg";

        const token = jwt.sign({
            id: userInput.id
        }, secretKey);

        res.send({
            message: "success",
            data: {
                user: {
                    name: data.fullname,
                    email: data.email,
                    token,
                }
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const url = "http://localhost:5000/uploads/user/";

        const schema = joi.object({
            email: joi.string().email().min(6).max(50).required(),
            password: joi.string().min(4).required(),
        })

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).send({
                status: "Validation Failed",
                message: error.details[0].message,
            })
        }

        const checkEmail = await user.findOne({
            where: {
                email
            }
        })

        if (!checkEmail) {
            return res.status(400).send({
                status: "Login Failed",
                message: "Email and password don't match"
            })
        }

        const isValidPass = await bcrypt.compare(password, checkEmail.password);

        if (!isValidPass) {
            return res.status(400).send({
                status: "Login Failed",
                message: "Email and password don't match"
            })
        }

        const token = jwt.sign({
            id: checkEmail.id
        }, secretKey);

        let image = checkEmail.image;

        if (image) {
            image = url + checkEmail.image;
        }

        res.send({
            message: "Login Success",
            data: {
                user: {
                    id: checkEmail.id,
                    name: checkEmail.fullname,
                    email: checkEmail.email,
                    role: checkEmail.role,
                    phone: checkEmail.phone,
                    image,
                    token,
                }
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "error",
            message: "Server Error",
            token
        });
    }
}

exports.checkAuth = async (req, res) => {
    try {
        const url = "http://localhost:5000/uploads/user/";
        const id = req.userId.id;

        const userAuth = await user.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"]
            }
        });
        let image = userAuth.image;

        if (userAuth.image) {
            image = url + userAuth.image;
        }

        res.send({
            status: "success",
            message: "User Valid",
            data: {
                id: userAuth.id,
                email: userAuth.email,
                name: userAuth.fullname,
                role: userAuth.role,
                phone: userAuth.phone,
                image
            },
        });
    } catch (err) {
        console.log(err);
        res.status(401).send({
            status: "error",
            message: "Server Error",
        });
    }
};