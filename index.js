console.log("e-commerce website");

const express = require("express");
const dotenv =require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const MongoStore = require('rate-limit-mongo');
const authMiddlware = require("./Middlewares/auth");


const userRoutes =  require("./Routes/User");
const productRoutes =require("./Routes/Product");
const cartRoutes = require("./Routes/Cart");
const couponRoutes = require("./Routes/coupon");
const orderRoutes = require("./Routes/order");





dotenv.config();

const app = express();

//    TODO: CORS 
// const coreOptions={   //this is for allow cors for specific some browser only
//     origin:"http://localhost:3000",
//     optionSuccessStatus:200, 
// };

// TODO: express rate limit

// const limiter = rateLimiter({
//     store:new MongoStore({
//         uri: process.env.DATABASE_URL,
//         expireTimeMs : 5* 60 *1000,
//     }),
//     windowMs : 5 * 60 * 1000, // 5 min 
//     max : 2, // only 2 request send 
//     message:{
//         success:false,
//         message:"Please try again after 5 mins",
//     }

// });



// app.use(cors(coreOptions));

app.use(cors());
// app.use(limiter);
app.use(express.json());




mongoose.connect(process.env.DATABASE_URL)
.then(()=>console.log("database connected successfully"))
.catch((err)=>console.log("Error connecting with databse",err))



app.use("/api/v1/user",userRoutes);
app.use("/api/v1/product",productRoutes);
app.use("/api/v1/cart" , cartRoutes);
app.use("/api/v1/coupon",couponRoutes);
app.use("/api/v1/order", authMiddlware(["admin"]),orderRoutes);



app.listen(process.env.PORT ,()=>{
    console.log(`server is up and running on port ${process.env.PORT}`);
})

