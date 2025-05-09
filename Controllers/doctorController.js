const { image } = require('../Config/cloudinaryConfig');
const doctorDb = require('../Models/doctorModel');
const createToken = require("../Utilities/generateToken");
const { hashPassword, comparePassword } = require("../Utilities/passwordUtilities");
const uploadToCloudinary=require('../Utilities/imageUpload')
const { format } = require('date-fns');

const registerDoctor = async (req, res) => {

    try {

        const { name, email, password,dob,gender,qualification,contact,address,department,availableDays,timings } = req.body

        if (!name || !email || !password  ||!dob ||!gender ||!qualification|| !contact || !address || !department || !availableDays|| !timings) {
            return res.status(400).json({ error: 'All fields are required' })
        }
      
        const doctorExist = await doctorDb.findOne({ email })


        if (doctorExist) {
            return res.status(400).json({ error: 'Email already exist' })
        }

        const hashedPassword = await hashPassword(password);
        if (!req.file) {
            return res.status(400).json({ error: 'Image not found' })
        }
        const cloudinaryRes = await uploadToCloudinary(req.file.path)
    
        const newDoctor = new doctorDb({
            name:`Dr. ${name}`, email, password: hashedPassword,dob,gender,qualification,contact,address,department,availableDays,timings,image:cloudinaryRes
        })
        const saved = await newDoctor.save();
        if (saved) {

            const token = createToken(saved._id,'doctor')
            console.log(token,"token");
            res.cookie("doctor_token", token);

            return res.status(200).json({ message: 'Doctor Created' })
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

        const doctorExist = await doctorDb.findOne({ email })

        if (!doctorExist) {
            return res.status(400).json({ error: 'Doctor not found' })
        }
        const passwordMatch = await comparePassword(password, doctorExist.password)
        console.log(passwordMatch);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Passwords does not  match' })
        }
        res.clearCookie('Admin_token');
        res.clearCookie('staff_token');
        const token = createToken(doctorExist._id,'doctor')
        //console.log(token,"token");
        res.cookie("doctor_token", token);
        return res.status(200).json({ message: 'Doctor login successful',  user: {
            doctorExist
          } })
      

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }
}


const loggedin= async (req, res) => {
    try {

    // Only accessible by verified doctor
    res.json({ message: 'Welcome Doctor' });
  }catch (error) {
    console.log(error);
    res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
}
}

const logout= async(req,res)=>{
    try {
        res.clearCookie('doctor_token');
        return res.status(200).json({ message: 'doctor logout successful' })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' }) 
    }
}


const doctorDetails = async (req, res) => {
     
      try {
        const { _id } = req.body;

            if (!_id ) {
                return res.status(400).json({ error: 'Id is  required' })
            }
    
        const doctor = await doctorDb.findOne({ _id })

            if (!doctor) {
                return res.status(400).json({ error: 'Doctor not found' })
            }
    
         const formattedDoctor = {
          ...doctor.toObject(),
          dob: format(new Date(doctor.dob), 'MMMM d, yyyy'), 
          createdAt: format(new Date(doctor.createdAt), 'MMMM d, yyyy'),
        };
    
       return res.status(200).json({ doctorExist: formattedDoctor });
      } catch (error) {
            console.log(error);
            res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
      }
    }






const listAllDoctors = async (req, res) => {
    try {
      const doctors = await doctorDb.find().sort({ createdAt: -1 }); 
  
      if (!doctors || doctors.length === 0) {
        return res.status(404).json({ message: 'No doctors found' });
      }
  
      res.status(200).json({ doctors });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Failed to fetch doctors' });
    }
  }



   
    const updateDoctordata = async (req, res) => {
        const { _id, name, password, dob, gender,qualification, contact, address, department, availableDays, timings } = req.body;
    
        if (!_id) {
            return res.status(400).json({ error: 'Id is required' });
        }
    
        try {
            const updateData = {
                name,
                dob,
                gender,
                contact,
                qualification,
                address,
                department,
                availableDays,
                timings,
            };
    
            if (password && password.trim() !== '') {
                updateData.password = await hashPassword(password);
            }
    
            if (req.file) {
                const cloudinaryRes = await uploadToCloudinary(req.file.path);
                updateData.image = cloudinaryRes;
            }
    
            const updatedDoctor = await doctorDb.findOneAndUpdate(
                { _id },
                updateData,
                { new: true, runValidators: true }
            );
    
            if (!updatedDoctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }
    
            return res.status(200).json({ message: "Doctor details updated successfully", updatedDoctor });
    
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    };
    




const deleteDoctor= async (req, res) => {
    try {
      const { _id } = req.body;
  
      if (!_id) {
        return res.status(400).json({ error: 'Id is required' });
      }
  
      const deletedDoctor = await doctorDb.findOneAndDelete({ _id });
  
      if (!deletedDoctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      return res.status(200).json({ message: 'Doctor deleted successfully', deletedDoctor });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
  


module.exports = { registerDoctor, login ,logout, loggedin,doctorDetails,listAllDoctors,updateDoctordata,deleteDoctor}