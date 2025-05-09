const { image } = require("../Config/cloudinaryConfig");
const staffDb = require("../Models/staffModel");
const uploadToCloudinary = require("../Utilities/imageUpload");
const { hashPassword, comparePassword } = require("../Utilities/passwordUtilities");
const createToken = require("../Utilities/generateToken");
const moment = require('moment');


const createStaff = async (req, res) => {

    try {

        const { name, email , password, contact, gender, dob, address, staffrole } = req.body;
        console.log(req.body);

        if (!name || !email || !password || !contact || !gender || !dob || !address || !staffrole ) {
            return res.status(400).json({ error: 'All fields are required' })
        }
        const parsedDob = moment(dob, 'YYYY-MM-DD', true);
        
        if (!parsedDob.isValid()) {
            return res.status(400).json({ error: 'Invalid date format. YYYY-MM-DD' });
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
            name, email , password: hashedPassword, contact, gender, dob:parsedDob.toDate(), address, staffrole, image: cloudinaryRes
        })
        const savedStaff = await newStaff.save()
        console.log(savedStaff);
        if (savedStaff) {
            const token = createToken(savedStaff._id, 'staff')
            //console.log(token,"token");
            res.cookie("staff_token", token);
            //console.log(staff_token);


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
            return res.status(400).json({ error: 'Staff not found' })
        }
        const passwordMatch = await comparePassword(password, staffExist.password)
        console.log(passwordMatch);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Passwords does not  match' })
        }
        res.clearCookie('Admin_token');
        res.clearCookie('doctor_token');
        const token = createToken(staffExist._id, 'staff')
        //console.log(token,"token");
        res.cookie("staff_token", token);
        return res.status(200).json({ message: 'staff login successful',  user: {
            staffExist
          }  })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }
}

const loggedin = async (req, res) => {
    try {

        // 
        res.json({ message: 'Welcome' });
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }
}

const staffLogout = async (req, res) => {
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

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ error: 'Id  is  required' })
        }

        const staffExist = await staffDb.findOne({ _id })

        if (!staffExist) {
            return res.status(400).json({ error: 'Staff not found' })
        }
        //    const formattedStaff = {
        //           ...staffExist.toObject(),
        //           dob: format(new Date(staffExist.dob), 'MMMM d, yyyy'), 
        //           createdAt: format(new Date(staffExist.createdAt), 'MMMM d, yyyy'),
        //         };
            

        return res.status(200).json({ message: 'Staff details', staffExist })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }
}


const updateStaffdata = async (req, res) => {
    try {
        const { _id, name, contact, gender, dob, address, staffrole, password, email } = req.body;

        if (!_id ) {
            return res.status(400).json({ error: "Missing _id )" });
        }

        // Parse DOB safely
        let parsedDob = new Date(dob);
        if (isNaN(parsedDob)) {
            return res.status(400).json({ error: "Invalid date format for dob" });
        }

        // Hash password only if it's provided
        let hashedPassword = null;
        if (password?.trim()) {
            hashedPassword = await hashPassword(password.trim());
        }

        // Optional image upload
        let cloudinaryRes = null;
        if (req.file) {
            cloudinaryRes = await uploadToCloudinary(req.file.path);
        }

        // Prepare update object
        const updateFields = {
            name,
            contact,
            gender,
            dob: parsedDob,
            address,
            staffrole,
        };

        if (hashedPassword) updateFields.password = hashedPassword;
        if (cloudinaryRes) updateFields.image = cloudinaryRes;

        const updatedStaff = await staffDb.findOneAndUpdate(
            { _id },
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedStaff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        return res.status(200).json({ message: "Staff details updated successfully", staff: updatedStaff });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};


const deleteStaff = async (req, res) => {
    try {
        const { _id } = req.body;
        // Check if staff exists
        const staffExist = await staffDb.findOne({ _id });
        if (!staffExist) {
            return res.status(404).json({ error: 'Staff not found' });
        }

        await staffDb.deleteOne({ _id });

        res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
    }
}

const listAllStaffs = async (req, res) => {
    try {
      const staffs = await staffDb.find().sort({ createdAt: -1 }); 
  
      if (!staffs || staffs.length === 0) {
        return res.status(404).json({ message: 'No Staffs found' });
      }
  
      res.status(200).json({ staffs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Failed to fetch staffs' });
    }
  }








module.exports = {
    createStaff, staffLogin, staffLogout, staffDetails, updateStaffdata, deleteStaff, loggedin,listAllStaffs
}