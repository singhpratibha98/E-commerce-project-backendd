const jwt = require("jsonwebtoken");
const UserModels = require("../Models/User");

// TODO: this middleware is implemented to validate the intrigity of token...

const authMiddlware = (role) => async (req, res, next) => {
  //if my token is get expire then my jwt token is not verify ..
  try {
    const tokenFromHeader = req.headers.authorization.split(" ")[1]; // to remove Bearer token we use like this ..
    const data = jwt.verify(tokenFromHeader, "237dnkjhekfqu341824");
    // console.log("TOKEN",tokenFromHeader);
    const payload = jwt.decode(tokenFromHeader);

    if (role.includes(payload.role)) {

      //her it check role me vo admin hai ya ni..
      //validate the sametoken to be present in db..(task for us to do)...

      const user =  await UserModels.findById(payload.id);
    //   console.log("USER",user);
      req.user = user;

      next();
    } else {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    console.log(data);
  } catch (err) {
    console.log(err);
    res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }
};

module.exports = authMiddlware;
