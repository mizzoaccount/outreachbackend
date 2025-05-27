/*const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');


dotenv.config();

const app = express();

// Middleware
app.use(cors()); 

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));
app.use(express.static(path.join(__dirname, 'temp/uploads')));

// Routes 
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/devotions', require('./routes/devotionRoutes'));


// Sample route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/

/*const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');


dotenv.config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'temp/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

// Routes 
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/devotions', require('./routes/devotionRoutes'));
app.use('/api/sermons', require('./routes/sermonRoutes'));
app.use('/api/events', require('./routes/eventRoutes')); 

// Sample route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); */

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For handling form data

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Ensure upload directory exists (used if storing locally at any point)
const uploadDir = path.join(__dirname, 'temp/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static uploads (if needed)
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/devotions', require('./routes/devotionRoutes'));
app.use('/api/sermons', require('./routes/sermonRoutes'));
app.use('/api/events', require('./routes/eventRoutes')); 
app.use('/api/gallery', require('./routes/galleryRoutes'));

// Sample test route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
