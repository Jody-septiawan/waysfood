const { user } = require("../../models/");
const Joi = require('joi');
const fs = require('fs');

let Users = [
    {
        id: 1,
        name: 'Alex',
        email: 'alex@gmail.com',
        password: '7s98d98as7d8',
        isActive: true
    },
    {
        id: 2,
        name: 'Rika',
        email: 'rika@gmail.com',
        password: '89as7d89as987dss',
        isActive: false
    },
];

// Get All User
exports.getUsers = async (req, res) => {
    try {
        const users = await user.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt", "password", "gender"],
            },
            where: {
                role: ["USER", "PARTNER"]
            }
        });
        userId = req.userId;
        res.send({
            message: "success",
            data: users
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;

        const users = await user.findOne({
            attributes: {
                exclude: ["createdAt", "updatedAt", "password", "gender"],
            },
            where: {
                id
            }
        });
        userId = req.userId;
        res.send({
            message: "success",
            data: users
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
}

// Get Partners
exports.getPartners = async (req, res) => {
    try {
        const usersFromDB = await user.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt", "password", "gender"],
            },
            where: {
                role: "PARTNER"
            }
        });

        const usersString = JSON.stringify(usersFromDB);
        const userObject = JSON.parse(usersString);

        const users = userObject.map((user, index) => {
            const userImage = user.image;
            const url = "http://localhost:5000/uploads/user/";
            return {
                ...user,
                image: url + userImage,
            };
        });

        userId = req.userId;
        res.send({
            message: "success",
            data: users
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { body } = req;

        const userInput = await user.create(body);
        const users = await user.findAll();

        res.send({
            database: {
                users,
            },
        });
    } catch (err) {
        console.log(err);
        res.send({
            "message": "error"
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        const findUser = await user.findOne({
            where: {
                id
            }
        })

        if (findUser.role == "ADMIN") {
            return res.send({
                status: "Failed",
                message: "Cannot delete ADMIN"
            });
        }

        if (findUser.image) {
            fs.unlink('uploads/user/' + findUser.image, function () {
                console.log('write operation complete.');
            });
        }

        await user.destroy({
            where: {
                id,
            },
        });

        res.send({
            status: "success",
            message: `Succesfully Delete user id : ${id}`,
        });

    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: "error",
            message: `Succesfully Delete user id : ${id}`,
        });
    }
}

exports.editUser = async (req, res) => {
    try {
        const path = "http://localhost:5000/uploads/";
        const id = req.userId.id;
        const dataUpdate = req.body;


        const userSelected = await user.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["role", "password", "createdAt", "updatedAt"]
            }
        });

        if (!userSelected) {
            return res.status(404).send({
                status: "Error",
                message: "User doesn't exist",
            });
        }

        if (userSelected && userSelected.id !== req.userId.id) {
            return res.status(402).send({
                status: "Error",
                message: "You haven't authorization for edit this user"
            });
        }

        const shcema = Joi.object({
            fullname: Joi.string().min(3).max(50),
            email: Joi.string().email().max(50),
            phone: Joi.string().min(10).max(13),
            location: Joi.string(),
        });

        const { error } = shcema.validate(dataUpdate);

        if (error) {
            return res.status(400).send({
                status: "There's error in your data input",
                message: error.details[0].message,
            });
        }

        let newImage;

        if (req.files.imageFile === undefined) {
            newImage = userSelected.image;
        } else {
            newImage = req.files.imageFile[0].filename;
            fs.unlink('uploads/user/' + userSelected.image, function () {
                console.log('write operation complete.');
            });
        }

        const userUpdated = {
            ...req.body,
            image: newImage
        }

        await user.update(userUpdated, {
            where: {
                id
            }
        });

        res.send({
            status: "success",
            message: "Update user data Success",
            data: {
                dataUpdated: userUpdated
            }
        });

    } catch (err) {
        console.log(err)
        res.status(400).send({
            status: "error",
            message: `Not Succesfully Edit user`,
        });
    }
}