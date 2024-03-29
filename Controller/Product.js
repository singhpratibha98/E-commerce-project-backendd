const productModel = require("../Models/Product");
const jwt = require("jsonwebtoken");

//   TODO: Create product API

const createProduct = async (req, res) => {
  console.log(req.body);

  console.log(req.headers.authorization);

  // apply verification here
  //     const payload =  jwt.decode(req.headers.authorization);
  //     try{

  //  const data= jwt.verify(req.headers.authorization ,process.env.JWT_SECRET_KEY);

  //  console.log(data);

  //     }catch(err){
  //         console.log(err);
  //         return;

  //     }

  // console.log(payload);

  const newProduct = await productModel.create(req.body); //to store data in db...(another methods)..

  res.json({
    success: true,
    message: "Dummy product create api",
  });
  //  if(payload.role === "admin"){

  // }else{
  //     res.status(403).json({
  //         success:false,
  //         messaqge: "Forbidden"
  //     })
};

// TODO: Get product API

const getProduct = async (req, res) => {
  res.json({
    success: true,
    message: "Dummy get product api",
  });
};

// TODO: Edit product API

const editProduct = async (req, res) => {
  //     const payload =  jwt.decode(req.headers.authorization);
  //     try{

  //  const data= jwt.verify(req.headers.authorization ,process.env.JWT_SECRET_KEY);

  //  console.log(data);

  //     }catch(err){
  //         console.log(err);
  //         return;

  //     }
  res.json({
    success: true,
    message: "Dummy get product api",
  });
};

// TODO: Search product API

// const searchProductTitle=async(req,res)=>{
//   const searchQuery = req.body.searhQuery;
//   console.log(searchQuery);
//   return res.json({});

// } 

// TODO: Like Dislike API

const likeDislikeController = async (req, res) => {
  console.log(req.user);

  // let fieldName = "likes";

  let updatObject = {
    $push: { likes: req.user._id },
    $pull: { dislikes: req.user._id },
    $inc: { likesCount: 1 },
  };

  if (req.params.action === "dislikes") {
    updatObject = {
      $push: { dislikes: req.user._id },
      $pull: { likes: req.user._id },
      $inc: { likesCount: -1 },
    };
  }

  // productModel.update({_id},{$set:()}); //or
  const updatedProduct = await productModel.findByIdAndUpdate(
    req.params.productId,
    updatObject
  );

  // console.log(updatedProduct);

  res.json({
    success: true,
    message: "Products Liked",
  });
};

// TODO: UserDetails API (liked/dislike both)

const productDetailscontroller = async (req, res) => {
  console.log(req.query.productId);
  const productDetails = await productModel
    .findById(req.query.productId)
    .populate("likes")
    .populate("dislikes");

  res.json({
    success: true,
    message: "Dummy products details",
    results: productDetails,
  });
};

// TODO: Rating and Comment of products

const reviewProductController = async (req, res) => {

  try{
    const product = await productModel.findById(req.params.productId);

  const review = product.reviews.find(
    (review) => review.userId.toString() === req.user._id.toString()
  );
  console.log(review);
  return;  //review ko edit krne se phle yha hm log and return  kreke ckeck kremge ki review exist krta hh ya ni so we see that uss product me ka review show krrha hh ...

  if (review) {
    // update review

    console.log("REVIEW EXIST");
    // 1.find the sub document
    //2. update the sub document

    const findObject={
      reviews:{
        $elemMatch:{
          userId : req.user._id,
          rating:review.rating,

        },
      },

    };

     const updateObject = {
      
      $set:{
          "reviews.$.rating":req.body.rating,
          "reviews.$.comment": req.body.comment,

        },
      };
    
    const updateResult  = await productModel.updateOne(findObject, updateObject);
    console.log(updateResult);

  } else {
    // add the review

    console.log("REVIEW not EXIST");

    const updateObject = {
      $push: {
        reviews: {  //this show in mongodb under reviews
          rating: req.body.rating,
          comment: req.body.comment,
          userId: req.user._id,
        },
      },
    };
    const updatedRecord = await productModel.findByIdAndUpdate(
      req.params.productId,
      updateObject,
      {
        new: true,
      }
    );
  }
  // console.log(product);
  // return;

  // console.log(updatedRecord);

  res.json({
    success: true,
    message: "Product review saved",
  });

  }catch(err){

    console.log(err);
  }
  // console.log("PRODUCT ID",req.params.productId);
  // console.log("BODY" ,req.body);
  // console.log("USERID", req.user._id);

  
};

const Controller = {
  createProduct,
  getProduct,
  editProduct,
  likeDislikeController,
  productDetailscontroller,
  reviewProductController,
  // searchProductTitle,
};

module.exports = Controller;
