const express = require("express");
const router= express.Router();
const couponController = require("../Controller/coupon");
const authMiddlware = require("../Middlewares/auth");




router.post("/",authMiddlware(["admin"]),couponController.createCoupon);


router.get("/",couponController.getCoupon);

module.exports = router;