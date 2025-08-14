import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.js";

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const payload = {
      id: admin.id,
      username: admin.username,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h", //token expires in 8h
    });

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
    });
  } catch (err) {
    console.log("Error while logging in: ", err);
  }
};
export default login;
