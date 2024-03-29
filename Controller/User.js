const UserModels = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// TODO: user Registration API

const userRegistration = async (req, res) => {
  // console.log(req.body);

  //this bcrypt contain 2 steps process i.e generate salt and generate hash using salt

  //   const salt = bcrypt.genSaltSync(10);
  //    const hash = bcrypt.hashSync(req.body.password,salt);

  //    console.log(hash);
  //    console.log(salt);

  //to connect with Db...
  const newUser = new UserModels({
    ...req.body,
    // password: hash,
  });

  await newUser.save();
  res.json({
    success: true,
    message: "User successfully registred,pleaselogin to continue",
  });
};

// TODO: User login API

const userLogin = async (req, res) => {
  console.log(req.body);
  const user = await UserModels.findOne({ email: req.body.email });
  if (!user) {
    return res.json({
      success: false,
      message: "Invalid username or password",
    });
  }
  console.log(user.password);

  const isPasswordCorrect = bcrypt.compareSync(
    req.body.password,
    user.password
  );

  console.log(isPasswordCorrect);

  //   token
  const expiryDateTime = Math.floor(new Date().getTime() / 1000) + 7600; // after 1hr it get expire

  if (isPasswordCorrect) {
    //jaisehi user yha login krge vaise hi we cretae TOken for her..
    //here we generate token as loggin get succefully...
    const payload = {
      //here user login
      id: user._id,
    name: user.firstname,
      role: user.role,
      exp: expiryDateTime,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    return res.json({
      success: true,
      mesaage: "Logged in Successfully",
      token,
    });
  }
  res.json({
    success: true,
    message: "Invalid username or password",
  });
};

// TODO: user LogOut API

const userLogOut = async (req, res) => {
  res.json({
    success: true,
    message: "Dummy user Logout API",
  });
};


// TODO: wishlist API

const addProductTowishlist=async(req,res)=>{
  console.log(req.body.productId);

  const updateObject={
    $push:{
      wishlist:req.body.productId,

    },
  }

   await UserModels.findByIdAndUpdate(req.user._id,updateObject);
  res.json({
    success: true,
    message:"product added to wishlist"
  });
};

// TODO: get user wishlist API

const getUserWishlist = async (req, res) => {
  const user = await UserModels.findById(req.user._id, "wishlist").populate(
    "wishlist","title price");
  res.json({
    success: true,
    result: user,
  });
};


// TODO: save userAddress API

const saveUserAddress= async(req,res)=>{
  const address = req.body;
  const setObject ={};

  if(address.address){
   setObject["address.address"] = address.address;

  }
  if(address.city){
    setObject["address.city"] = address.city;
  }
  if(address.state){
    setObject["address.state"] = address.state;
  }
  if(address.pincode){
    setObject["address.pincode"]= address.pincode;
  }

  const updateObject={
    $set:setObject,
  };

  const updateResult =  await UserModels.findByIdAndUpdate(req.user._id,updateObject);
  console.log(updateResult);
  res.json({
    success: true,
    message:"Succeefully saved address",
  });
  

};




const Controller = {
  userRegistration,
  userLogin,
  userLogOut,
  addProductTowishlist,
  getUserWishlist,
  saveUserAddress,

};

module.exports = Controller;
