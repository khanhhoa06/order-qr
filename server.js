const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MENU_FILE = path.join(__dirname, 'menu.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend static files
app.use('/admin', express.static('admin')); // Serve admin static files

// API endpoints for menu management
app.get('/api/menu', (req, res) => {
  fs.readFile(MENU_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Cannot read menu' });
    res.json(JSON.parse(data));
  });
});

app.post('/api/menu', (req, res) => {
  const updatedMenu = req.body;
  // Validate basic structure (optional but recommended)
  if (!updatedMenu.categories || !Array.isArray(updatedMenu.categories)) {
    return res.status(400).json({ error: 'Invalid menu structure' });
  }
  fs.writeFile(MENU_FILE, JSON.stringify(updatedMenu, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Cannot write menu' });
    res.json({ success: true, message: 'Menu updated successfully' });
  });
});

// Serve frontend (for customers)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});