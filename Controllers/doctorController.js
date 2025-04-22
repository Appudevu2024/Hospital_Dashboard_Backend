const { image } = require('../Config/cloudinaryConfig');
const doctorDb = require('../Models/doctorModel');
const createToken = require("../Utilities/generateToken");
const { hashPassword, comparePassword } = require("../Utilities/passwordUtilities");
const {uploadToCloudinary}=require('../Utilities/imageUpload')

const registerDoctor = async (req, res) => {

    try {

        const { name, email, password,dob,gender,contact,address,department,availableDays,timings } = req.body

        if (!name || !email || !password  ||!dob ||!gender || !contact || !address || !department || !availableDays|| !timings) {
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
            name, email, password: hashedPassword,dob,gender,contact,address,department,availableDays,timings,image:cloudinaryRes
        })
        const saved = await newDoctor.save();
        if (saved) {

            const token = createToken(saved._id)
            //console.log(token,"token");
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
        const token = createToken(doctorExist._id)
        //console.log(token,"token");
        res.cookie("doctor_token", token);
        return res.status(200).json({ message: 'doctor login successful', doctorExist })

    } catch (error) {
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

        const { email } = req.body;

        if (!email ) {
            return res.status(400).json({ error: 'Email is  required' })
        }

        const doctorExist = await doctorDb.findOne({ email })

        if (!doctorExist) {
            return res.status(400).json({ error: 'Doctor not found' })
        }
        
        return res.status(200).json({ message: 'doctor details', doctorExist })

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
    const { email } = req.body;
    const { name,password,dob,gender, contact,address,department,availableDays,timings } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        if (!req.file) {
            return res.status(400).json({ error: 'Image not found' })
        }
        const cloudinaryRes = await uploadToCloudinary(req.file.path)
        const updatedDoctor = await doctorDb.findOneAndUpdate({email}, {name,password:hashedPassword,dob,gender,contact,address,department,availableDays,timings,image:cloudinaryRes  },{ new: true, runValidators: true });
        if (!updatedDoctor) return res.status(404).json({ message: 'Doctor not found' });
        //
        
        return res.status(200).json({message:"Doctor details updated successfully",updatedDoctor});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}



const deleteDoctor= async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      const deletedDoctor = await doctorDb.findOneAndDelete({ email });
  
      if (!deletedDoctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      return res.status(200).json({ message: 'Doctor deleted successfully', deletedDoctor });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
  


module.exports = { registerDoctor, login ,logout, doctorDetails,listAllDoctors,updateDoctordata,deleteDoctor}