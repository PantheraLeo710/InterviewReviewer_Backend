const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const custom_err = require('./middleware/errorHandler');



const config = require('./config');

const PORT = config.PORT;
const MONGO_URI = config.MONGO_URI;
//const JWT_SECRET = config.JWT_SECRET;



const app = express();


// Middlewares
app.use(express.json()); // Accept JSON data
app.use(cors({
 origin :"https://interviewreviewer-backend.onrender.com",
credentials : true
    
}
));         // Enable Cross-Origin
app.use(helmet());       // Add security headers

const authenticateToken = require('./middleware/authMiddleware');

const authRoutes = require('./routes/auth');
app.use('/api/v1/auth', authRoutes);

const feedbackRoutes = require('./routes/feedback');
app.use('/api/v1/feedback',authenticateToken, feedbackRoutes);

const questionRoutes = require('./routes/question');
app.use('/api/v1/questions', questionRoutes);

const answerRoutes = require('./routes/answer');
app.use('/api/v1/answers',authenticateToken, answerRoutes);

const submissionRoutes = require('./routes/submission');
app.use('/api/v1', submissionRoutes);
app.use(custom_err)


mongoose.connect(MONGO_URI)
.then(() => console.log(" MongoDB connected"))
.catch((err) => console.error(" MongoDB connection error:", err));

// Simple test route
app.get('/', (req, res) => {
    res.send('Hello from Interview Reviewer Backend!');
});

// Start the server
app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
    console.log(" Loaded MONGO URI:", process.env.MONGO_URI);
});
