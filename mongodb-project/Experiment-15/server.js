const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json({ type: '*/*' }));


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Import product routes
const productRoutes = require('./routes/product'); // relative path
app.use('/products', productRoutes);

// Start the server
const PORT = 3010;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
