const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Station = require('./models/Station');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        const stations = await Station.find();
        console.log('Total stations:', stations.length);
        stations.forEach(s => {
            console.log(`- ID: ${s._id}, Name: ${s.name}, Status: ${s.status}, Location: ${JSON.stringify(s.location.coordinates)}`);
        });
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
