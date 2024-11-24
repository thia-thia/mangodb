const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/patients', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Define the Patient schema and model
const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    date: { type: Date, required: true },
});

const Patient = mongoose.model('Patient', PatientSchema);

// API Endpoints

// Add a patient
app.post('/patients', async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).send(patient);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get all patients with optional sorting and filtering
app.get('/patients', async (req, res) => {
    try {
        const { sort, search } = req.query;
        const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
        const sortOption = sort ? { [sort]: 1 } : {};

        const patients = await Patient.find(filter).sort(sortOption);
        res.status(200).send(patients);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get a patient by ID
app.get('/patients/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).send({ error: 'Patient not found' });
        res.status(200).send(patient);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
