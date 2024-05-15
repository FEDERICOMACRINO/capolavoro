//npm install express ejs
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const userDataDir = 'userData/';

if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir);
}

app.post('/addPurchase', (req, res) => {
    const { username, purchase } = req.body;

    const userFilePath = userDataDir + username + '.json';

    console.log('User File Path:', userFilePath); // Controlla il percorso del file JSON dell'utente

    if (!fs.existsSync(userFilePath)) {
        console.log('User not found');
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    try {
        const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
        console.log('User Data:', userData); // Controlla i dati dell'utente letti dal file

        userData.purchases.push(purchase);

        fs.writeFileSync(userFilePath, JSON.stringify(userData), 'utf-8');

        console.log('Purchase added successfully');
        res.json({ success: true, message: 'Purchase added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});




app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const userFilePath = userDataDir + username + '.json';

    if (fs.existsSync(userFilePath)) {
        res.status(400).json({ success: false, message: 'Username already exists' });
    } else {
        // Crea un file JSON con il nome utente e la password
        const userData = { username, password, purchases: [] };
        fs.writeFileSync(userFilePath, JSON.stringify(userData), 'utf-8');
        res.json({ success: true, message: 'Registration successful' });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const userFilePath = userDataDir + username + '.json';

    if (fs.existsSync(userFilePath)) {
        const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
        if (userData.password === password) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Incorrect password' });
        }
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
