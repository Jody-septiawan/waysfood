const express = require("express");

const router = express.Router();

const { auhtenticated } = require('../middlewares/auth');
const {
    checkRolePartner,
    checkRoleUser,
    checkRoleAdmin
} = require('../middlewares/checkRole');
const { uploadFileUser } = require('../middlewares/uploadUser');
const { uploadFileProduct } = require('../middlewares/uploadProduct');

const {
    getUsers,
    getPartners,
    getUser,
    deleteUser,
    editUser
} = require("../controllers/user");

const {
    register,
    login,
    checkAuth
} = require("../controllers/auth");

const {
    getProducts,
    addProduct,
    getProductsPartner,
    getDetailProduct,
    deleteProduct,
    editProduct
} = require("../controllers/partner");

const {
    addTransaction,
    getTransactions,
    getDetailTransaction,
    editTransaction,
    deleteTransaction,
    getUserTransaction
} = require("../controllers/transaction");

// Auth
router.post("/login", login);
router.post("/register", uploadFileUser("imageFile"), register);
router.get("/check-auth", auhtenticated, checkAuth);

//  Admin
router.get("/users", auhtenticated, getUsers);
router.get("/partners", getPartners);
router.delete("/user/:id", auhtenticated, checkRoleAdmin, deleteUser);

//  User & Partner
router.patch("/user", auhtenticated, uploadFileUser("imageFile"), editUser);
router.get("/user/:id", getUser);

// Product
router.post("/product", auhtenticated, checkRolePartner, uploadFileProduct("imageFile"), addProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductsPartner);
router.get("/product/:id", getDetailProduct);
router.delete("/product/:id", auhtenticated, deleteProduct);
router.patch("/product/:id", auhtenticated, uploadFileProduct("imageFile"), editProduct);

// transaction
router.post("/transaction", auhtenticated, checkRoleUser, addTransaction);
router.get("/transactions/:id", auhtenticated, getTransactions);
router.get("/transaction/:id", auhtenticated, getDetailTransaction);
router.patch("/transaction/:id", auhtenticated, editTransaction);
router.delete("/transaction/:id", auhtenticated, deleteTransaction);
router.get("/my-transactions", auhtenticated, getUserTransaction);


module.exports = router;