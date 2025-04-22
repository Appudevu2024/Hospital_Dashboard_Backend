const { image } = require("../Config/cloudinaryConfig");
const adminDb = require("../Models/adminModel");
const createToken = require("../Utilities/generateToken");
const { hashPassword,comparePassword} = require("../Utilities/passwordUtilities");
const {uploadToCloudinary}=require('../Utilities/imageUpload')

const register=async (req,res)=>{
    try {

        const {email,password}=req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const alreadyExist=  await adminDb.findOne({ email });
        if (alreadyExist) {
            return res.status(400).json({ error: 'Email already exist' })
        }

         const hashedPassword = await hashPassword(password);
         if (!req.file) {
            return res.status(400).json({ error: 'Image not found' })
        }
        console.log(req.file);
        const cloudinaryRes = await uploadToCloudinary(req.file.path)
    
        
         const newAdmin= new adminDb({
            email,password: hashedPassword,image:cloudinaryRes
        })
        const saved = await newAdmin.save();
        if (saved) {
            const token = createToken(saved._id)
            //console.log(token,"token");
            res.cookie("Admin_token", token);
            
            return res.status(200).json({ message: 'Admin Created' },saved)
        }

        
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' }) 
    }
}


const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const adminExist = await adminDb.findOne({ email })

        if (!adminExist) {
            return res.status(400).json({ error: 'Admin not found' })
        }
        const passwordMatch = await comparePassword(password, adminExist.password)
        console.log(passwordMatch);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Passwords does not  match' })
        }
        const token = createToken(adminExist._id,"admin")
        //console.log(token,"token");   
        res.cookie("Admin_token", token);
        console.log(token)
        return res.status(200).json({ message: 'Admin login successful', adminExist })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }
}


const logout= async(req,res)=>{
    try {
        res.clearCookie('Admin_token');
        return res.status(200).json({ message: 'Admin logout successful' })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' }) 
    }
}


const adminDetails = async (req, res) => {
    try {

        const { email} = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is  required' })
        }

        const adminExist = await adminDb.findOne({ email })

        if (!adminExist) {
            return res.status(400).json({ error: 'Admin not found' })
        }
        
        return res.status(200).json({ message: 'Admin details', adminExist })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }
}



const updateAdmindata = async (req, res) => {
    const { email } = req.body;
    const { password } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        if (!req.file) {
            return res.status(400).json({ error: 'Image not found' })
        }
        const cloudinaryRes = await uploadToCloudinary(req.file.path)
        const updatedAdmin = await adminDb.findOneAndUpdate({email}, {password:hashedPassword ,image:cloudinaryRes},{ new: true, runValidators: true });
        if (!updatedAdmin) return res.status(404).json({ message: 'Admin not found' });
        const savedadmin = await updatedAdmin.save();
        
        return res.status(200).json("Admin data updated successfully",savedadmin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const deleteAdmin= async (req, res) => {
    try {
      const { email } = req.params;
  
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      const deletedAdmin = await adminDb.findOneAndDelete({ email });
  
      if (!deletedAdmin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      return res.status(200).json({ message: 'Admin deleted successfully', deletedAdmin });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }




module.exports={
    register,
     login,
     logout,
     adminDetails,
     updateAdmindata,
     deleteAdmin
}