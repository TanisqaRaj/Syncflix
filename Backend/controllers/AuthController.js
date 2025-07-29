import User from "../models/User.js";
import admin from "../firebase.js";

export const userSignup = async (req, res) => {
  const { username, email } = req.body;
  try {
    // Check if user already exists in MongoDB
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ message: "User already exists" });

    //Store user data in mongoDB
    const user = new User({
      username,
      email,
    });
    await user.save();

    return res.status(201).json({
      message: "User registered in firebase and mongoDb successfully",
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { idToken } = req.body;
  try {
    const verfifyToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid, firebase } = verfifyToken;

    const signInProvider = firebase?.sign_in_provider;

    let user = await User.findOne({ email });

    if (signInProvider === "password") {
      if (!user) {
        return res.status(401).json({ message: "User not registered." });
      }
    } else if (signInProvider === "google.com") {
      if (!user) {
        user = new User({ email, username: name || "" });
        await user.save();
      }
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        username: user.username,
        firebaseUid: uid,
      },
    });
  } catch (error) {
    console.error("Firebase login error:", error.message);
    return res
      .status(401)
      .json({ message: "Login failed", error: error.message });
  }
};
