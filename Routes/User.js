const express = require("express");
const userController = require("../Controller/User");
const authMiddlware = require("../Middlewares/auth");

const router = express.Router();

router.post("/register", userController.userRegistration);
router.post("/login", userController.userLogin);
router.post("/logout", userController.userLogOut);

router.post("/wishlist" , authMiddlware(["admin","seller","buyer"]),userController.addProductTowishlist);

router.get("/wishlist",authMiddlware(["seller","buyer","admin"]),userController.getUserWishlist);


router.post("/address",authMiddlware(["seller","buyer","admin"]),userController.saveUserAddress);









module.exports = router;
