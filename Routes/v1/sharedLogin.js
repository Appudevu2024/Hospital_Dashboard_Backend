

// const sharedLogin = require('express').Router()
// const jwt = require('jsonwebtoken');
// const Admin = require('../../Models/adminModel');
// const Doctor = require('../../Models/doctorModel');
// const Staff = require('../../Models/servicestaffModel');

// sharedLogin.post('', async (req, res) => {
//     console.log('Received body:', req.body);
//   const { email, password } = req.body;


//   let user, role;

//   // Try admin
//   user = await Admin.findOne({ email });
//   if (user && user.password === password) {
//     role = 'admin';
//   }

//   // Try doctor
//   if (!user) {
//     user = await Doctor.findOne({ email });
//     if (user && user.password === password) {
//       role = 'doctor';
//     }
//   }

//   // Try staff
//   if (!user) {
//     user = await Staff.findOne({ email });
//     if (user && user.password === password) {
//       role = 'staff';
//     }
//   }

//   if (!user) {
//     return res.status(401).json({ error: 'Invalid email or password' });
//   }

//   const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

//   res
//     .cookie(`${role}_token`, token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'Lax',
//     })
//     .json({ message: 'Login successful', role });
// });

// module.exports = sharedLogin;
