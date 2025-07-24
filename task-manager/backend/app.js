// ✅ First import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

// ✅ Then create the app
const app = express();

// ✅ Now you can use middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
// ✅ Routes

app.use("/api", taskRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});
module.exports = app;
// ✅ Connect to MongoDB and start the server
mongoose.connect('mongodb+srv://vasudevsharma:code4life%402007@cluster0.mo8nveo.mongodb.net/task-manager?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    app.listen(5000, () => {
      console.log('Server running on http://localhost:5000');
    });
  })
  .catch(err => console.log(err));
