const mongooose = require("mongoose");



const cartProduct =new mongooose.Schema({
    productId:{
        type:mongooose.Schema.Types.ObjectId,
        required:true,

    },
    quantity:{
        type:Number,
    },
    color:{
        type:String,
    },
    price:{
        type:Number,
    },
});


const cartSchema = new mongooose.Schema({
    products:{
        type:[cartProduct],
     },
     
});


const deliveryAddressSchema =new mongooose.Schema({
    address: {
      type:String,
      required:false,
      default:"",
    },
    city:{
      type:String,
      required:false,
      default:"",
    },
    state:{
      type:String,
      required:false,
      default:"",
  
    },
    pincode:{
      type:String,
      required:false,
      default:"",
  
    },
  
  });

const orderSchema = new mongooose.Schema({
    cart:{
        type:cartSchema,
        required:true,
     },
     userId:{
        type:mongooose.Schema.Types.ObjectId,
        required:true,
     },
     amount:{
        type:Number,
        required:true,
     },
     coupon:{
        type:mongooose.Schema.Types.ObjectId,
        required:false,
        default:null,
     },
     deliveryAddress:{
        type:deliveryAddressSchema,
        required:true,
     },
     orderPlacedAt:{
        type:Date,
        required:true,
     },
     deliveryDate:{
        type:Date,
        required:true,
     },
     orderStatus:{
        type:String,
        required:true,
     },
     modeOfPayment:{
        type:String,
        required:true,
     },
     transactionId:{
        type:String,
        required:false,
        default:"",
     },


});

const OrderModel= mongooose.model("orders",orderSchema);

module.exports =OrderModel;