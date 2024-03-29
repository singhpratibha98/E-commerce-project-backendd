const CartModel =require("../Models/Cart");
const productModels = require("../Models/Product");


 
//   TODO: Create cart APi
const createCart = async (req,res)=>{
    console.log(req.body.products);
    const userCart = await CartModel.findOne({userId:req.user._id});
    console.log(userCart);
    if(userCart){
        //cart exist

    }else{
        //cart doesnt exist
        let cartTotal = 0;
        const productsToAdd = [];
        for(let i=0;i<req.body.products.length;i++){
            
            const currentProduct = req.body.products[i];
            const {price}= await productModels.findById(currentProduct.productId,{price:1,_id:0,});
            // console.log("PRODUCT DETAILS" ,i,product);
            const product ={
                ...currentProduct,
                price,
            };


            productsToAdd.push(product);
        const priceForProduct = currentProduct.quantity * price;
            cartTotal +=priceForProduct;

        } 
        // console.log(productsToAdd);
        // console.log(cartTotal);


        
        await CartModel.create({    // here we are inserting the product in cart
            products:productsToAdd,
            cartTotal:cartTotal,
            userId : req.user._id,

        });
    }

    res.json({
        success: true,
        message:"User Cart updated Successfully",
    })
};

// TODO: get cart API

const getCart =async(req,res)=>{
    

    res.json({
        success: true,
        message:"Dummmy get cart API",
    });
};


const controller ={
    createCart,
    getCart,
};

module.exports = controller;