 const bloodbankDb= require('../Models/bloodbankModel')
 
 
 
const addNewBloodGroup = async (req, res) => {

    try {

        const { bloodgroup, noofbagsavailable } = req.body

        if (!bloodgroup || !noofbagsavailable ) {
            return res.status(400).json({ error: 'All fields are required' })
        }
       

        const bloodgroupExist = await bloodbankDb.findOne({ bloodgroup })


        if (bloodgroupExist) {
            return res.status(400).json({ error: 'Bloodgroup already exist' })
        }

       
        const newBloodGroup = new bloodbankDb({
          bloodgroup, noofbagsavailable
        })
        const savedBloodGroup = await newBloodGroup.save();
        if (savedBloodGroup) {

         return res.status(200).json({ message: 'Bloodgroup added', savedBloodGroup})
        }


    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' })
    }

}

 const listBloodBankData = async (req, res) => {
   try {
     const bloodgroups = await bloodbankDb.find().sort({ createdAt: -1 }); 
 
     if (!bloodgroups || bloodgroups.length === 0) {
       return res.status(404).json({ message: 'No bloodgroups found' });
     }
 
     res.status(200).json({ bloodgroups });
   } catch (error) {
     console.error(error);
     res.status(500).json({ message: error.message || 'Failed to fetch bloodgroups' });
   }
 }
 
 const updateBloodgroup = async (req, res) => {
     const { _id, bloodgroup,noofbagsavailable } = req.body;
     if (!_id) {
      return res.status(400).json({ error: 'Id is required' });
  }

    
     try {
            const newBloodGroup = await bloodbankDb.findOneAndUpdate({_id},{bloodgroup ,noofbagsavailable},{ new: true, runValidators: true });
         if (!newBloodGroup) return res.status(404).json({ message: 'Bloodgroup not found' });
         const savedBloodgroup = await newBloodGroup.save();
         
         return res.status(200).json("Bloodgroup details updated successfully",savedBloodgroup);
     } catch (error) {
         res.status(400).json({ message: error.message });
     }
 }
 
 const deleteBloodGroup = async (req, res) => {
     const { _id } = req.body;
   
     if (!_id) {
      return res.status(400).json({ error: 'Id is required' });
  }

     try {
       const deletetedBloodGp = await bloodbankDb.findOneAndDelete({ _id });
   
       if (!deletetedBloodGp) {
         return res.status(404).json({ message: "Bloodgroup not found" });
       }
   
       return res.status(200).json({ message: "Bloodgroup deleted successfully", deletetedBloodGp });
     } catch (error) {
       return res.status(500).json({ message: error.message });
     }
   }
   
 
   module.exports={addNewBloodGroup,listBloodBankData,updateBloodgroup,deleteBloodGroup}