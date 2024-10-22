const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // Import your dashboard routes
const emailRoutes=require('./routes/emailRoutes');
const linkRoutes=require('./routes/linkRoutes');
const pdfRoutes=require('./routes/pdfRoutes');
const path = require('path'); // Add this line  

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/email',emailRoutes );
app.use('/api/link',linkRoutes );
app.use('/api/pdf',pdfRoutes);
app.use('/api/dashboard', dashboardRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
