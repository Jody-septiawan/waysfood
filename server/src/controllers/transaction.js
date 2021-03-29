const { product, user, order, transaction } = require("../../models/");


exports.addTransaction = async (req, res) => {
    try {
        const orderData = req.body.body;
        const userId = req.userId.id;
        const partnerId = req.body.parentId;
        const price = req.body.price;

        var d = new Date();
        // var date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        var date = d.toString();

        const dataTransaction = {
            userId,
            partnerId,
            date,
            price,
            status: "waiting"
        }

        var transId = await transaction.create(dataTransaction);
        transId = transId.id;

        var data = orderData.map(
            (item) => {
                return {
                    ...item,
                    transactionId: transId
                }
            },
        )

        var orderInput = await order.bulkCreate(data)

        const transactionData = await transaction.findAll({
            include: [
                {
                    model: user,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "image", "role", "gender", "phone"],
                    },
                },
                {
                    model: order,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "id", "transactionId", "productId"],
                    },
                    include: [
                        {
                            model: product,
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "userId"],
                            }
                        }
                    ]
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId", "date"],
            },
            where: {
                id: transId
            }
        });

        res.status(200).send({
            // transactionData,
            transId,
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "error",
            message: "Server Error",
            error: err
        });
    }
}

exports.getTransactions = async (req, res) => {
    try {
        const PartnerId = req.params.id;

        const dataTransactionPartner = await transaction.findAll({
            order: [
                ['id', 'DESC'],
            ],
            include: [
                {
                    model: user,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "image", "role", "gender", "phone"],
                    },
                },
                {
                    model: order,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "id", "transactionId", "productId"],
                    },
                    include: [
                        {
                            model: product,
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "userId"],
                            }
                        }
                    ]
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "date"],
            },
            where: {
                PartnerId
            },
        });

        res.send({
            dataTransactionPartner
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
}

exports.getDetailTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;

        const dataDetailTransaction = await transaction.findOne({
            include: [{
                model: user,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "password", "image", "role", "gender", "phone"],
                },
            },
            {
                model: order,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "id", "transactionId", "productId"],
                },
                include: [
                    {
                        model: product,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "userId"],
                        }
                    }
                ]
            },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "date", "userId"],
            },
            where: {
                id: transactionId
            }
        });

        res.send({
            dataDetailTransaction
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
}

exports.editTransaction = async (req, res) => {
    try {
        const id = req.params.id;
        const dataBody = req.body;

        const checkTransaction = await transaction.findOne({
            where: {
                id
            }
        })

        if (!checkTransaction) {
            return res.send({
                status: "Failed",
                message: "Transaction doesn't exist"
            })
        }

        const transactionEdit = await transaction.update(dataBody, {
            where: {
                id
            }
        })

        const data = await transaction.findOne({
            include: [{
                model: user,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "password", "image", "role", "gender", "phone"],
                },
            },
            {
                model: order,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "transactionId", "productId", "id"],
                },
                include: {
                    model: product,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "userId"],
                    },
                }
            }
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "date", "partnerId", "userId"],
            },
            where: {
                id
            }
        })

        res.send({
            status: "Success",
            data: {
                transaction: data
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
}

exports.deleteTransaction = async (req, res) => {
    try {
        const id = req.params.id;

        const checkTransaction = await transaction.findOne({
            where: { id }
        })

        if (!checkTransaction) {
            return res.send({
                status: "Failed",
                message: "Transaction doesn't exist"
            })
        }

        const dataDeleteTransaction = await transaction.destroy({
            where: { id }
        })

        res.send({
            status: "success",
            data:
                { id }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
}

exports.getUserTransaction = async (req, res) => {
    try {
        const id = req.userId.id;

        const MyTransaction = await transaction.findAll({
            order: [
                ['id', 'DESC'],
            ],
            include: [
                {
                    model: user,
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                            "phone",
                            "password",
                            "location",
                            "popular",
                            "gender",
                            "image"
                        ],
                    },
                },
                {
                    model: order,
                    include: {
                        model: product,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "transactionId", "id", "productId"],
                    },
                }
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId"],
            },
            where: {
                userId: id
            }
        });

        res.send({
            status: "success",
            data: { transaction: MyTransaction }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
}