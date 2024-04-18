const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
let contacts = require('./contacts.json');

// Get contacts endpoint
app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

// Add new contact endpoint
app.post('/api/contacts', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);

    const newContact = {
        id: contacts.length + 1,
        name: receivedData.name,
        email: receivedData.email
    };

    contacts.push(newContact);

    res.json({ message: 'Contact added successfully!', contact: newContact });
});

// Update contact endpoint
app.put('/api/contacts/:id', (req, res) => {
    const contactId = parseInt(req.params.id);
    const updatedData = req.body;
    console.log(`Received update for contact ${contactId}:`, updatedData);

    const updatedContact = contacts.find(contact => contact.id === contactId);
    
    if (updatedContact) {
        updatedContact.name = updatedData.name;
        updatedContact.email = updatedData.email;
        res.json({ message: 'Contact updated successfully!', contact: updatedContact });
    } else {
        res.status(404).json({ message: 'Contact not found!' });
    }
});

// Delete contact endpoint
app.delete('/api/contacts/:id', (req, res) => {
    const contactId = parseInt(req.params.id);
    console.log(`Received request to delete contact ${contactId}`);

    const index = contacts.findIndex(contact => contact.id === contactId);

    if (index !== -1) {
        const deletedContact = contacts.splice(index, 1)[0];
        res.json({ message: 'Contact deleted successfully!', contact: deletedContact });
    } else {
        res.status(404).json({ message: 'Contact not found!' });
    }
});

app.use(express.static(path.join(__dirname, '')));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
