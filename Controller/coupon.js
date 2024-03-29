const CouponModel = require("../Models/coupon");

//   TODO: create coupon API
const createCoupon =async (req,res) =>{
    console.log(req.body);
    await CouponModel.create(req.body);
    res.json({
        success:true,
        message:"coupon created succesfully",
    })

};

// TODO: get coupon API

const getCoupon =async(req,res)=>{
     const couponList = await  CouponModel.find({isActive:true});
    res.json({
        success:true,
        message:"Dummy get coupon API",
        results:couponList,

    })

};

const controller = {
    createCoupon,
    getCoupon,
};

module.exports = controller;
