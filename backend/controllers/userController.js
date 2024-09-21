import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

//@desc auth user
//@route get /api/users/login
//@access public

// Adjust the path to your User model if needed

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }
  // Find the user by email
  const user = await User.findOne({ email });
  console.log(user); // Debugging

  if (user && (await user.matchPassword(password))) {
    //
    generateToken(res, user._id);
    // Password matches, return user data
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    // Invalid email or password
    res.status(400);
    throw new Error("invalid email or password");
  }
});

export default authUser;

//@desc register user
//@route post /api/users/signup
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
});

//@desc logout user and clear cookie
//@route post /api/users/logout
//@access private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
});

//@desc get user
//@route get /api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("user not find");
  }
});

//@desc update user
//@route post /api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("user not find");
  }
});

//@desc get user
//@route get /api/users
//@access private
const getUsers = asyncHandler(async (req, res) => {
  res.send("get users");
});

//@desc get user by id
//@route get /api/users
//@access private
const getUserById = asyncHandler(async (req, res) => {
  res.send("get user by id");
});

//@desc delete user
//@route delete  /api/users
//@access private
const deleteUsers = asyncHandler(async (req, res) => {
  res.send("delete users");
});

//@desc delete user
//@route delete  /api/users
//@access private
const updateUser = asyncHandler(async (req, res) => {
  res.send("delete users");
});

export {
  authUser,
  deleteUsers,
  getUserById,
  getUserProfile,
  getUsers,
  logoutUser,
  registerUser,
  updateUser,
  updateUserProfile,
};
