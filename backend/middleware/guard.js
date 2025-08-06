const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

// the req, res and next function to execute, as args
const guard = async (req, res, next) => {
  let token;

  // request header must have a token type of 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // initialize the token as the immediate next string after 'Bearer', separated by ' '
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // assign the admin id (pk) to the req as designed in the tokne (it has both id and password)
      req.admin = await Admin.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!req.admin) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found!" });
      }

      //if user is found, move on
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    console.error("Not authorized or no token found.");
  }
};

module.exports = { guard };
