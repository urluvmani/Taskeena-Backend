import userModel from "../models/authModel.js";
import { comparepassword, hashPassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken"

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address,answer } = await req.body;
    if (!name) {
      res.send("name is missing");
      return;
    }
    if (!email) {
      res.send("email is missing");
      return;
    }
    if (!password) {
      res.send("password is missing");
      return;
    }
    if (!phone) {
      res.send("phone is missing");
      return;
    }
    if (!address) {
      res.send("address is missing");
      return;
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(200).send("user already Exist");
      return;
    }
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer
    }).save();
    res.send({
      success: true,
      message: "User created Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } =await req.body;
    if (!email) {
      return res.send({
        success: false,
        message: "Invalid email",
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Invalid pass",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.send("User not Found");
    }
    const checkPass = await comparepassword(password, user.password);
    if (!checkPass) {
      return res.send({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
    return res.send({
        success:true,
        message:"User loggedin Successfully",
        user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role
        },
        token
        

    })
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Invalid credantials",
    });
  }
};

export const forgotPasswordController=async(req,res)=>{
  try {
    const {email,answer,newpassword} = await req.body
     if (!email) {
      res.send("email is missing");
      return;
    }
     if (!answer) {
      res.send("answer is missing");
      return;
    }
     if (!newpassword) {
      res.send("newPassword is missing");
      return;
    }
    const user = await userModel.findOne({email,answer})
    if (!user) {
      res.status(400).send({
        success:false,
        message:"User does not exist"
      })
    }
    const hashed = await hashPassword(newpassword)
     await userModel.findByIdAndUpdate(user._id,{password:hashed})
     res.send({
       success:true,
        message:"Password reset successfully",
     })

  } catch (error) {
    res.status(500).send({
      success:false,
      error:true,
      message:"Something went wrong"
    })
  }
}

export const test=(req,res)=>{
  res.send("Protexted Route")
}

export const UpdateUserController = async(req,res)=>{
  try {
    const {name,email,password,phone,address} = req.body
    const user = await userModel.findById(req.user._id)
    if (password && password.length >6 ) {
      return res.send({
        message:"Pass is too short"
      })
    }
    const hashedPassword = password? await hashPassword(password):undefined
    const UpdatedUser = await userModel.findByIdAndUpdate(req.user._id,{
      name:name|| user.name,
      password:hashedPassword||user.password,
      phone:phone||user.phone,
      address:address||user.address
    },{new:true})
    res.status(200).send({
      success:true,
      message:"User Updated Successfully",
      UpdatedUser
    })
  } catch (error) {
    res.status(500).send({
      success:false,
      error
    })
  }
}

export const GetUserController=async(req,res)=>{
  try {
    const users = await userModel.find({})  
    res.status(200).send({
      success:true,
      message:"All Users Data",
      users
    })
  } catch (error) {
    res.status(500).send({
      success:false,  
      message:"Error while getting users",
      error
    })
  } 
}