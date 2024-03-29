const OrderModel = require("../Models/order");
const CartModel = require("../Models/Cart");
const CouponModel = require("../Models/coupon");
const dayjs = require("dayjs");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");


//Intiaze payment gateway

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,   
  key_secret: process.env.RAZORPAY_SECRET_KEY,

});



// TODO: create order API

const createOrder = async (req, res) => {
  // 1. Extract user cart by userId
  // 2. Get cart total and apply coupon (if available) => payableAmount
  // 3. check the mode of payment (If COD , skip payment else Redirect user to payment getway)
  //4. check the delivery address (if given in body use if else fetch it from users saved address)
  //5.Delete the user cart on succefull order
  //6. Inventory /stock value to be updated 


  const userCart = await CartModel.findOne({ userId: req.user._id });
  if (!userCart) {
    return res.status(400).json({
      success: false,
      message: "Empty cart, please add item to cart",
    });
  }

  const couponCode = req.body.coupon;
  const coupon = await CouponModel.findOne({ couponCode, isActive: true });
  if (!coupon) {
    return res.status(400).json({
      success: false,
      message: "Invalid coupon code",
    });
  }

  // for coupon code validation we check this points

  //1. Is coupon between start and end date of the coupon
  //startDate < currentDate && endDate >currentDate
  //isse pata chalega ki coupon apply ho sakta hh ya ni

  const couponStartDate = dayjs(coupon.startDate);
  const couponEndDate = dayjs(coupon.endDate);
  const currentDateTime = dayjs();

  console.log(currentDateTime.isAfter(couponStartDate));
  console.log(currentDateTime.isBefore(couponEndDate));

  if (
    currentDateTime.isBefore(couponStartDate) ||
    currentDateTime.isAfter(couponEndDate)
  ) {
    return res.status(400).json({
      success: false,
      message: "coupon expired",
    });
  }

  // const cartTotal = cartTotal;

  let couponDiscountInRs = (
    (userCart.cartTotal / 100) *
    coupon.discountPercentage
  ).toFixed(2);
  console.log(couponDiscountInRs);

  if (couponDiscountInRs > coupon.maxDiscountInRs) {
    couponDiscountInRs = coupon.maxDiscountInRs;
  }

  console.log(couponDiscountInRs);

  const amount = (userCart.cartTotal - couponDiscountInRs).toFixed(2); //total paybale amount

  

  let deliveryAddress = req.body.deliveryAddress;

  if (!deliveryAddress) {
    deliveryAddress = req.user.address;
  }

  const deliveryDate = dayjs().add(7, "day");
  // Order status values => PLACED, PACKED, SHIPPED,IN TRANSIT,OUT FOR DELIVERY, DELIVERED,RETUREND,REFUND,REFUND_iNTIATED,REFUND_RECEIVED

  const orderDetails = {
    cart: userCart,
    userId: req.user._id,
    amount,
    coupon: coupon._id,
    deliveryAddress,
    orderPlacedAt: currentDateTime,
    deliveryDate,
    orderStatus: "PLACED",
    modeOfPayment: req.body.modeOfPayment,
  };


    // TODO:  Razorpay code start here...

  const newOrder = await OrderModel.create(orderDetails);
  let pgResponse;

  // console.log(coupon.startDate,coupon.endDate); //here we want to date ki jo current date hai or end date uske bich mm kitna time left h so we install (dayjs) library for it comparision


 
 
  if (req.body.modeOfPayment === "COD") {
    //Dont generate transaction ID and dont redirect to payment geteway

  } else {
    // redirect to user to payment gateway
    const options = {
      amount: amount * 100, // Amount in paisa E.g 50Rs = 5000
      currency: "INR",
      receipt: newOrder._id, // Unique Ordre ID
      payment_capture: 1, // Ignore
    };

   console.log("OPITONS", options);
    try {
      pgResponse = await razorpay.orders.create(options); //this will create order for us
      console.log("RAZORPAY pgResponse", pgResponse);
    } catch (err) {
      console.log(err);
    }
  }

  res.json({
    success: true,
    message: "Order placed successfully",
    orderId: newOrder._id,
    paymentInformation: {
      amount: pgResponse.amount_due,
      orderId: pgResponse.id,
      currency: pgResponse.currency,
    },
  });
};




// TODO: get order API

const getOrder = async (req, res) => {
  res.json({
    success: true,
    message: "order get succesfully",
  });
};

const controller = {
  createOrder,
  getOrder,
};

module.exports = controller;
