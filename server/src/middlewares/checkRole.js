const { user } = require("../../models/");

exports.checkRolePartner = async (req, res, next) => {
    try {
        const userData = await user.findOne({
            where: {
                id: req.userId.id,
            },
        });

        if (userData.role === "PARTNER") {
            next();
        } else {
            res.status(401).send({
                status: "Failed",
                message: "Access denied, you are not a partner",
            });
        }
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Access denied",
        });
    }
};


exports.checkRoleUser = async (req, res, next) => {
    try {
        const userData = await user.findOne({
            where: {
                id: req.userId.id,
            },
        });

        if (userData.role === "USER") {
            next();
        } else {
            res.status(401).send({
                status: "Failed",
                message: "Access denied, you are not a user",
            });
        }
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Access denied",
        });
    }
};

exports.checkRoleAdmin = async (req, res, next) => {
    try {
        const userData = await user.findOne({
            where: {
                id: req.userId.id,
            },
        });

        if (userData.role === "ADMIN") {
            next();
        } else {
            res.status(401).send({
                status: "Failed",
                message: "Access denied, you are not a user",
            });
        }
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Access denied",
        });
    }
};