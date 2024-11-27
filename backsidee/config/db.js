const mongoose= require('mongoose');

require('dotenv').config();

const MONGO_URI = process.env.mongo_URI;



const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); 
    }
};

module.exports = connectDB;
