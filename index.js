const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/login'));
app.use('/api/employee', require('./routes/employee'));
app.use('/api/hr', require("./routes/hr"));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/attendance', require('./routes/updateattendance'));
app.use('/api/attendance/', require('./routes/attendance'));

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB connection error:', err.message));

app.get('/', (req, res) =>{
    res.send('backend server is runing!');
});


app.listen(PORT, () =>{
    console.log(`SERVER IS RUNING ON http://localhost:${PORT}`);
    
});