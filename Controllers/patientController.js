const { image } = require('../Config/cloudinaryConfig');
const patientDb = require('../Models/patientModel');
const createToken = require("../Utilities/generateToken");
const { hashPassword, comparePassword } = require("../Utilities/passwordUtilities");



const registerPatient = async (req, res) => {

    try {

        const { name, email, password, dob, gender, contact, address, age, bloodgroup } = req.body

        if (!name || !email || !password || !dob || !gender || !contact || !address || !age || !bloodgroup) {
            return res.status(400).json({ error: 'All fields are required' })
        }


        const patientExist = await patientDb.findOne({ email })


        if (patientExist) {
            return res.status(400).json({ error: 'Email already exist' })
        }

        const hashedPassword = await hashPassword(password);

        if (!req.file) {
            return res.status(400).json({ error: 'Image not found' })
        }
        const cloudinaryRes = await uploadToCloudinary(req.file.path)

        const newPatient = new patientDb({
            name, email, password: hashedPassword, dob, gender, contact, address, age, bloodgroup, image: cloudinaryRes
        })
        const saved = await newPatient.save();
        if (saved) {

            const token = createToken(saved._id)
            //console.log(token,"token");
            res.cookie("patient_token", token);

            return res.status(200).json({ message: 'Patient Created' })
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

        const patientExist = await patientDb.findOne({ email })

        if (!patientExist) {
            return res.status(400).json({ error: 'Patient not found' })
        }
        const passwordMatch = await comparePassword(password, patientExist.password)
        console.log(passwordMatch);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Passwords does not  match' })
        }
        const token = createToken(patientExist._id)
        //console.log(token,"token");
        res.cookie("patient_token", token);
        return res.status(200).json({ message: 'patient login successful', patientExist })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('patient_token');
        return res.status(200).json({ message: 'patient logout successful' })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }
}


const patientDetails = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is  required' })
        }

        const patientExist = await patientDb.findOne({ email })

        if (!patientExist) {
            return res.status(400).json({ error: 'Patient not found' })
        }

        return res.status(200).json({ message: 'patient details', patientExist })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }
}


const listAllPatients = async (req, res) => {
    try {
        const patients = await patientDb.find().sort({ createdAt: -1 });

        if (!patients || patients.length === 0) {
            return res.status(404).json({ message: 'No patients found' });
        }

        res.status(200).json({ patients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Failed to fetch doctors' });
    }
}


const updatePatientdata = async (req, res) => {
    const { email } = req.body;
    const { password, dob, gender, contact, address, age, bloodgroup } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        if (!req.file) {
            return res.status(400).json({ error: 'Image not found' })
        }
        const cloudinaryRes = await uploadToCloudinary(req.file.path)
        const updatedPatient = await patientDb.findOneAndUpdate({ email }, { password: hashedPassword, dob, gender, contact, address, age, bloodgroup,image:cloudinaryRes }, { new: true, runValidators: true });
        if (!updatedPatient) return res.status(404).json({ message: 'Patient not found' });
        const savedPatient = await updatedPatient.save();

        return res.status(200).json("Patient details updated successfully", savedPatient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}



const deletePatient = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const deletedPatient = await patientDb.findOneAndDelete({ email });

        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        return res.status(200).json({ message: 'Patient deleted successfully', deletedPatient });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}



module.exports = { registerPatient, login, logout, patientDetails, listAllPatients, updatePatientdata, deletePatient }