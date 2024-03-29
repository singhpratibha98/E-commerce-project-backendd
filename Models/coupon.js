const mongooose = require("mongoose");

const couponSchema = new mongooose.Schema({
    couponCode:{
        type:String,
        required:true,
        unique:true,
    },
    discountPercentage:{
        type:Number,
        required:true,
    },
    maxDiscountInRs:{
        type:Number,
    required:true,
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    isActive:{ 
        type:Boolean,
        required:true,
        default:false,
    }

});

const CouponModel = mongooose.model("coupon",couponSchema);
module.exports = CouponModel;


