const departmentDB= require('../Models/departmentModel')




const addNewDept = async (req, res) => {

    try {

        const { name, description } = req.body

        if (!name || !description ) {
            return res.status(400).json({ error: 'All fields are required' })
        }
       

        const departmentExist = await departmentDB.findOne({ name })


        if (departmentExist) {
            return res.status(400).json({ error: 'Department already exist' })
        }

       
        const newDepartment = new departmentDB({
            name, description
        })
        const savedDepartment = await newDepartment.save();
        if (savedDepartment) {

         return res.status(200).json({ message: 'Department added' })
        }


    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }

}



const listAllDepartments = async (req, res) => {
  try {
    const departments = await departmentDB.find().sort({ createdAt: -1 }); 

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: 'No departments found' });
    }

    res.status(200).json({ departments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Failed to fetch departments' });
  }
};




const updateDepartment = async (req, res) => {
  const { _id, name,description } = req.body;
    try {
           const updatedDepartment = await departmentDB.findOneAndUpdate({_id},{name, description},{ new: true, runValidators: true });
        if (!updatedDepartment) return res.status(404).json({ message: 'Department not found' });
        const savedDept = await updatedDepartment.save();
        
        return res.status(200).json("Doctor details updated successfully",savedDept);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const deleteDepartment = async (req, res) => {
  const { _id } = req.body;
  
    try {
      const deletedDept = await departmentDB.findOneAndDelete({ _id });
  
      if (!deletedDept) {
        return res.status(404).json({ message: "Department not found" });
      }
  
      return res.status(200).json({ message: "Department deleted successfully", deletedDept });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  



module.exports={addNewDept,listAllDepartments,updateDepartment,deleteDepartment}
