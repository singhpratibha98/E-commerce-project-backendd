const express = require("express");

const cartController = require("../Controller/Cart");
const authMiddlware= require("../Middlewares/auth");


const router = express.Router();



router.post("/", authMiddlware(["seller","admin","buyer"]),cartController.createCart);

router.get("/", authMiddlware(["seller","admin","buyer"]),cartController.getCart);

module.exports = router;