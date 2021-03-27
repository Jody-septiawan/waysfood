const { product, user } = require("../../models/");
const fs = require('fs');

exports.getProducts = async (req, res) => {
    try {
        const path = "http://localhost:5000/uploads/product/";

        const products = await product.findAll({
            include: [
                {
                    model: user,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "image", "role", "gender"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId"],
            },
        });

        res.send({
            message: "success",
            data: {
                products: { products },
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
};

exports.getProductsPartner = async (req, res) => {
    try {
        const { id } = req.params;
        const productsFromDB = await product.findAll({
            where: {
                userId: id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            }
        });

        const productsString = JSON.stringify(productsFromDB);
        const productsObject = JSON.parse(productsString);

        const products = productsObject.map((product, index) => {
            const productImage = product.image;
            const url = "http://localhost:5000/uploads/product/";
            return {
                ...product,
                image: url + productImage,
            };
        });

        res.send({
            message: "success",
            data: { products }
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
};

exports.getDetailProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const productDetail = await product.findAll({
            include: [
                {
                    model: user,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "image", "role", "gender"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId"],
            },
            where: {
                id
            }
        });
        res.send({
            message: "success",
            data: { productDetail }
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const path = "http://localhost:5000/uploads/product/";
        var data = req.body;
        const userId = req.userId.id;

        const image = req.files.imageFile[0].filename;

        const dataProduct = await product.create({
            ...data,
            userId,
            image
        })

        res.send({
            message: "success add product",
            data: {
                id: dataProduct.id,
                title: dataProduct.title,
                price: dataProduct.price,
                image: path + dataProduct.image
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId.id;

        const checkProduct = await product.findOne({
            where: {
                id
            }
        })

        if (!checkProduct) {
            return res.status(404).send({
                status: "Failed",
                message: "Product not found"
            })
        }

        if (!(userId == checkProduct.userId)) {
            return res.send({
                status: "Failed",
                message: "The product does not belong to you"
            })
        }

        fs.unlink('uploads/product/' + checkProduct.image, function () {

            console.log('write operation complete.');
        });

        await product.destroy({
            where: {
                id
            }
        })

        res.send({
            status: "Success delete product",
            data: {
                id,
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

exports.editProduct = async (req, res) => {
    try {
        // const path = "http://localhost:5000/uploads/";
        const id = req.params.id;
        const dataUpdate = req.body;

        const productSelected = await product.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });

        if (!productSelected) {
            return res.status(404).send({
                status: "Error",
                message: "Product doesn't exist",
            });
        }

        if (productSelected.userId !== req.userId.id) {
            return res.status(402).send({
                status: "Error",
                message: "You haven't authorization for edit this Product"
            });
        }


        let newImage;

        if (req.files.imageFile === undefined) {
            newImage = productSelected.image;
        } else {
            fs.unlink('uploads/product/' + productSelected.image, function () {
                console.log('write operation complete.');
            });
            newImage = req.files.imageFile[0].filename;
        }

        const userUpdated = {
            ...dataUpdate,
            image: newImage
        }

        await product.update(userUpdated, {
            where: {
                id
            }
        });

        res.send({
            status: "success",
            message: "Update user data Success",
            data: userUpdated
        });

    } catch (err) {
        console.log(err)
        res.status(400).send({
            status: "error",
            message: `Not Succesfully Edit user`,
        });
    }
}