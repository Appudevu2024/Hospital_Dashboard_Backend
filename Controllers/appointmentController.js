const appointmentDB= require('../Models/appointmentModel')



const createAppointment = async (req, res) => {
    const { patientname, doctor, date, time, status } = req.body;
  
    try {
      // 🔍 Check if the same doctor already has an appointment at the same date & time
      const existingAppointment = await appointmentDB.findOne({
        doctor,
        date: new Date(date),
        time: time
      });
  
      if (existingAppointment) {
        return res.status(400).json({
          message: 'Doctor already has an appointment at this date and time.'
        });
      }
  
      const newAppointment = await appointmentDB.create({
        patientname,
        doctor,
        date,
        time,
        status
      });
  
      res.status(201).json({ message: 'Appointment created successfully', data: newAppointment });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  


const listAppointment=async(req,res)=>{


try {
    
const appointmentList= await appointmentDB.find();

res.status(200).json(appointmentList);

} catch (error) {
    console.log(error);
    res.status(error.status || 500).json({ error: error.message || 'Internal server error' })  
}

}


const updateAppointment = async (req, res) => {
    const { patientname } = req.body;
    const { doctor,date,time,status } = req.body;
    try {
        const updatedAppointment = await appointmentDB.findOneAndUpdate({patientname}, {doctor,date,time,status },{ new: true, runValidators: true });
        if (!updatedAppointment) return res.status(404).json({ message: 'Appointment not found' });
        const savedAppointment= await updatedAppointment.save();
        
        return res.status(200).json("Appointment updated successfully",savedAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const deleteAppointment = async (req, res) => {
    const { patientname } = req.params;
  
    try {
      const deletedAppointment = await appointmentDB.findOneAndDelete({ patientname });
  
      if (!deletedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
  
      return res.status(200).json({ message: "Appointment deleted successfully", deletedAppointment});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  















module.exports={createAppointment,listAppointment,updateAppointment}