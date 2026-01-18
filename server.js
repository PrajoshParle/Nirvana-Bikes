const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/nirvanaBikes')
    .then(() => console.log("✅ Connected to MongoDB!"))
    .catch(err => console.error("❌ Connection failed:", err));


const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    Mobile_Number: String,
    message: String,
    date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

const bookingSchema = new mongoose.Schema({
    bike_model: String,
    name: String,
    email: String,
    Mobile_Number: String,
    city: String,
    pincode: String,
    date: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit-contact', async (req, res) => {
    try {
        const newContact = new Contact({
            name: req.body.name,
            email: req.body.email,
            Mobile_Number: req.body.Mobile_Number,
            message: req.body.feedback
        });
        await newContact.save();
        res.send(`
            <div style="background:#121212; color:#FFD700; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:sans-serif;">
                <h1>Submission Successful!</h1>
                <p style="color:white;">We received your details, ${req.body.name}.</p>
                <a href="/" style="color:#4CAF50; text-decoration:none; border:1px solid #4CAF50; padding:10px 20px; border-radius:5px; margin-top:20px;">Return to Home</a>
            </div>
        `);
    } catch (err) {
        res.status(500).send("Error saving to database.");
    }
});

app.post('/submit-booking', async (req, res) => {
    try {
        const newBooking = new Booking({
            bike_model: req.body.bike_model,
            name: req.body.name,
            email: req.body.email,
            Mobile_Number: req.body.Mobile_Number,
            city: req.body.city,
            pincode: req.body.pincode
        });
        await newBooking.save();
        res.send(`
            <div style="background:#121212; color:#FFD700; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:sans-serif; text-align:center; padding: 20px;">
                <h1 style="font-size: 2.5rem;">Booking Confirmed!</h1>
                <p style="color:white; font-size: 1.2rem;">Your test ride for the <strong>${req.body.bike_model}</strong> has been requested.</p>
                <p style="color:#bbb; margin-top: 10px;">We will reach you soon at <strong>${req.body.email}</strong> or <strong>${req.body.Mobile_Number}</strong>.</p>
                <p style="color:#bbb;">Our representative in <strong>${req.body.city} (${req.body.pincode})</strong> will contact you to schedule the ride.</p>
                <a href="/" style="color:#4CAF50; text-decoration:none; border:1px solid #4CAF50; padding:10px 20px; border-radius:5px; margin-top:30px;">Return to Home</a>
            </div>
        `);
    } catch (err) {
        res.status(500).send("Error saving booking.");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
