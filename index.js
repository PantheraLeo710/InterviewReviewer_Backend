const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const custom_err = require('./middleware/errorHandler');
const config = require('./config');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/question');
const answerRoutes = require('./routes/answer');
const userRoutes = require('./routes/user');
const submissionRoutes = require('./routes/submission');
const router = require('./routes/submission');
const feedrouter = require('./routes/feedback');

const PORT = config.PORT;
const MONGO_URI = config.MONGO_URI;
//const JWT_SECRET = config.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true})) 
app.use(cors({
    origin: true,
    credentials: true
}));         
app.use(helmet());      
app.use( '/auth', authRoutes);
app.use('/questions', questionRoutes);
app.use('/answers' , answerRoutes);
app.use('/users', userRoutes);
app.use('/api/v1', submissionRoutes);
app.use('/submit' ,router )
app.use('/feedback',feedrouter)
app.use(custom_err)

mongoose.connect(MONGO_URI)
.then(() => console.log(" MongoDB connected"))
.catch((err) => console.error(" MongoDB connection error:", err));

app.get('/', (req, res) => {
    res.send('Hello from Interview Reviewer Backend!');
});

app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
    console.log(" Loaded MONGO URI:", process.env.MONGO_URI);
});
