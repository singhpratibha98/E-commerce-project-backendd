const express = require("express");
const productController = require("../Controller/Product");
const authMiddlware = require("../Middlewares/auth");

const router = express.Router();

router.post("/", authMiddlware(["admin"]), productController.createProduct);

router.patch("/", authMiddlware(["seller"]), productController.editProduct);

router.get(
  "/",
  authMiddlware(["buyer", "seller"]),
  productController.getProduct
);


router.post("/:productId/review", authMiddlware(["admin", "buyer", "seller"]),
  productController.reviewProductController
);

router.post("/:productId/:action", authMiddlware(["buyer","seller","admin"]),productController.likeDislikeController);

router.get("/product-by-id", productController.productDetailscontroller);

// router.post("/search-product-title",authMiddlware(["admin","seller","buyer"]), productController.searchProductTitle);







module.exports = router;
