
const patientDb = require('../Models/patientModel');






// const patientDetails = async (req, res) => {
//     try {

//         const { _id } = req.body;

//         if (!_id) {
//             return res.status(400).json({ error: 'Id is  required' })
//         }

//         const patientExist = await patientDb.findOne({ _id })

//         if (!patientExist) {
//             return res.status(400).json({ error: 'Patient not found' })
//         }

//         return res.status(200).json({ message: 'patient details', patientExist })

//     } catch (error) {
//         console.log(error);
//         res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
//     }
// }


// const getAllPatients = async (req, res) => {
//     try {
//         const patients = await patientDb.find().sort({ createdAt: -1 });

//         if (!patients || patients.length === 0) {
//             return res.status(404).json({ message: 'No patients found' });
//         }

//         res.status(200).json({ patients });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: error.message || 'Failed to fetch doctors' });
//     }
// }
const getAllPatients = async (req, res) => {
    try {
      const patients = await patientDb
        .find()
        .populate('doctor')           // Populates doctor info
        .populate('appointment')      // Populates appointment info
        .sort({ createdAt: -1 });
  
      if (!patients || patients.length === 0) {
        return res.status(404).json({ message: 'No patients found' });
      }
  
      res.status(200).json({ patients });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Failed to fetch patients' });
    }
  };
  
  const getPatientById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const patient = await patientDb
        .findById(id)
        .populate('doctor')
        .populate('appointment');
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.status(200).json(patient);
    } catch (error) {
      console.error('Error fetching patient by ID:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch patient' });
    }
  };
  
  const updatePatientVitals = async (req, res) => {
    try {
      const { id } = req.params;
      const vitals = req.body;
  
      const updatedPatient = await patientDb.findByIdAndUpdate(
        id,
        { vitals },
        { new: true }
      );
  
      if (!updatedPatient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.status(200).json({ message: 'Vitals updated successfully', updatedPatient });
    } catch (error) {
      console.error('Error updating patient vitals:', error);
      res.status(500).json({ message: error.message || 'Failed to update vitals' });
    }
  };








const deletePatient = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ error: 'Id is required' });
        }

        const deletedPatient = await patientDb.findOneAndDelete({ _id });

        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        return res.status(200).json({ message: 'Patient deleted successfully', deletedPatient });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}



module.exports = {  getAllPatients, deletePatient, getPatientById,
  updatePatientVitals }