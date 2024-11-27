const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();


const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true,               
  };
  
  app.use(cors(corsOptions));  




connectDB();


app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Server is running...');
});


const PORT =  4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

