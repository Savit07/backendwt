const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://pass:pass@cluster0.l2bnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Stop the app if the connection fails
  }
};

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  phobiaInfo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  promptResponse: { type: String, required: true },
  assessmentType: { type: String, required: true },
  data: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Controller Functions
const registerUser = async (req, res) => {
  const { name, age, phobiaInfo, email, promptResponse, assessmentType, data } = req.body;

  try {
    const user = new User({ name, age, phobiaInfo, email, promptResponse, assessmentType, data });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Middleware
app.use(express.json());

// Routes
app.post('/add', registerUser);
app.get('/', getUsers);

// Connect to MongoDB and start server
const PORT = 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
