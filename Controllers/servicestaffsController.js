const { image } = require("../Config/cloudinaryConfig");
const staffDb = require("../Models/servicestaffModel");
const uploadToCloudinary = require("../Utilities/imageUpload");
const { hashPassword } = require("../Utilities/passwordUtilities");

const registerStaff = async (req, res) => {

    try {

        const { name, email, contact, gender, dob, address, role, password } = req.body;

        if (!name || !email || !contact || !gender || !dob || !address || !role || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const staffExist = await staffDb.findOne({ email })
        if (staffExist) {
            return res.status(400).json({ error: 'Email already exist' })
        }
        const hashedPassword = await hashPassword(password);

        if (!req.file) {
            return res.status(400).json({ error: 'Image not found' })
        }
        const cloudinaryRes = await uploadToCloudinary(req.file.path)
        console.log(cloudinaryRes, "Image uploaded by cloudinary");

        const newStaff = new staffDb({
            name, email, contact, gender, dob, address, role, password: hashedPassword, image: cloudinaryRes
        })
        const savedStaff = await newStaff.save()
        console.log(savedStaff);
        if (savedStaff) {
             const token = createToken(saved._id)
                         //console.log(token,"token");
                         res.cookie("staff_token", token);
             
            return res.status(201).json({ message: 'New staff added', staff: savedStaff });

        }

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }

}


const staffLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const staffExist = await staffDb.findOne({ email })

        if (!staffExist) {
            return res.status(400).json({ error: 'Doctor not found' })
        }
        const passwordMatch = await comparePassword(password, staffExist.password)
        console.log(passwordMatch);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Passwords does not  match' })
        }
        const token = createToken(staffExist._id)
        //console.log(token,"token");
        res.cookie("staff_token", token);
        return res.status(200).json({ message: 'staff login successful', staffExist })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }
}

const staffLogout= async(req,res)=>{
    try {
        res.clearCookie('staff_token');
        return res.status(200).json({ message: 'Staff logout successful' })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' }) 
    }
}


const staffDetails = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email ) {
            return res.status(400).json({ error: 'Email is  required' })
        }

        const staffExist = await staffDb.findOne({ email })

        if (!staffExist) {
            return res.status(400).json({ error: 'Staff not found' })
        }
        
        return res.status(200).json({ message: 'Staff details', staffExist })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }
}


const updateStaffdata = async (req, res) => {
    const { email } = req.body;
    const {  name, contact, gender, dob, address, role, password} = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        
        if (!req.file) {
            return res.status(400).json({ error: 'Image not found' })
        }
        const cloudinaryRes = await uploadToCloudinary(req.file.path)

        const updatedStaff = await staffDb.findOneAndUpdate({email}, {password:hashedPassword,name, contact, gender, dob, address, role ,image:cloudinaryRes },{ new: true, runValidators: true });
        if (!updatedStaff) return res.status(404).json({ message: 'Staff not found' });
        const savedStaff = await updatedStaff.save();
        
        return res.status(200).json("Staff details updated successfully",savedStaff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const deleteStaff = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if staff exists
    const staffExist = await staffDb.findOne({email});
    if (!staffExist) {
      return res.status(404).json({ error: 'Staff not found' });
    }

     await staffDb.deleteOne({email});

    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
  }
}








module.exports = {
    registerStaff,staffLogin,staffLogout,staffDetails,updateStaffdata,deleteStaff
}