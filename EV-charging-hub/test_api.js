const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function test() {
    try {
        console.log('--- Testing API Endpoints ---');

        // 1. Health Check
        try {
            const res = await axios.get(`${BASE_URL}/stations`);
            console.log('✅ Stations fetch working');
        } catch (e) {
            console.log('❌ Stations fetch failed', e.message);
        }

        // 2. Auth Test (Login as Owner)
        // Note: This requires existing user or registering one.
        // For testing purposes, we assume some data exists or we just check connectivity.

        console.log('--- Test Finished ---');
    } catch (error) {
        console.error('Test script error:', error.message);
    }
}

test();
