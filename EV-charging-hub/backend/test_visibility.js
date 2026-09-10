const axios = require('axios');

async function test() {
    try {
        const res = await axios.get('http://localhost:5000/api/stations?lat=17.44741&lng=78.37623&radius=10000&status=approved');
        console.log('Approved stations found:', res.data.length);
        if (res.data.length > 0) {
            console.log('First station:', res.data[0].name);
        }

        const resAll = await axios.get('http://localhost:5000/api/stations');
        console.log('Total stations (no filters):', resAll.data.length);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

test();
