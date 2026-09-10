const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let token = '';
let ownerToken = '';
let adminToken = '';
let stationId = '';

async function runTests() {
    console.log('🚀 Starting Comprehensive API Testing...\n');

    try {
        // 1. Auth: Register User
        console.log('--- Auth Endpoints ---');
        try {
            const regRes = await axios.post(`${BASE_URL}/auth/register`, {
                name: 'Test Driver',
                email: `driver_${Date.now()}@test.com`,
                password: 'password123',
                role: 'user'
            });
            token = regRes.data.token;
            console.log('✅ POST /auth/register - Success');
        } catch (e) { console.log('❌ POST /auth/register - Failed', e.response?.data || e.message); }

        // Register Owner
        try {
            const regOwnRes = await axios.post(`${BASE_URL}/auth/register`, {
                name: 'Test Owner',
                email: `owner_${Date.now()}@test.com`,
                password: 'password123',
                role: 'owner'
            });
            ownerToken = regOwnRes.data.token;
            console.log('✅ POST /auth/register (Owner) - Success');
        } catch (e) { console.log('❌ POST /auth/register (Owner) - Failed', e.response?.data || e.message); }

        // Login Admin
        try {
            const adminRes = await axios.post(`${BASE_URL}/auth/admin-login`, {
                email: 'admin@gmail.com',
                password: 'admin123'
            });
            adminToken = adminRes.data.token;
            console.log('✅ POST /auth/admin-login - Success');
        } catch (e) { console.log('❌ POST /auth/admin-login - Failed', e.response?.data || e.message); }

        // 2. Stations
        console.log('\n--- Station Endpoints ---');
        try {
            const createRes = await axios.post(`${BASE_URL}/stations`, {
                name: 'Test Fast Hub',
                address: '123 Tech Park',
                location: { coordinates: [78.37, 17.44] },
                chargerTypes: ['DC', 'CCS'],
                powerRating: 150,
                pricing: 0.5,
                timings: '24/7',
                connectorsCount: 4
            }, { headers: { Authorization: `Bearer ${ownerToken}` } });
            stationId = createRes.data._id;
            console.log('✅ POST /stations - Success');
        } catch (e) { console.log('❌ POST /stations - Failed', e.response?.data || e.message); }

        try {
            const getRes = await axios.get(`${BASE_URL}/stations?lat=17.44&lng=78.37&radius=5000`);
            console.log('✅ GET /stations (Discovery) - Success');
        } catch (e) { console.log('❌ GET /stations - Failed', e.response?.data || e.message); }

        try {
            const ownStations = await axios.get(`${BASE_URL}/stations/owner`, { headers: { Authorization: `Bearer ${ownerToken}` } });
            console.log('✅ GET /stations/owner - Success');
        } catch (e) { console.log('❌ GET /stations/owner - Failed', e.response?.data || e.message); }

        // 3. Admin Moderation
        console.log('\n--- Admin Endpoints ---');
        try {
            await axios.put(`${BASE_URL}/admin/moderate/${stationId}`, { status: 'approved' }, { headers: { Authorization: `Bearer ${adminToken}` } });
            console.log('✅ PUT /admin/moderate/:id - Success');
        } catch (e) { console.log('❌ PUT /admin/moderate/:id - Failed', e.response?.data || e.message); }

        try {
            await axios.get(`${BASE_URL}/admin/stats`, { headers: { Authorization: `Bearer ${adminToken}` } });
            console.log('✅ GET /admin/stats - Success');
        } catch (e) { console.log('❌ GET /admin/stats - Failed', e.response?.data || e.message); }

        // 4. User Favorites & Reviews
        console.log('\n--- User & Review Endpoints ---');
        try {
            await axios.post(`${BASE_URL}/user/favorites`, { stationId }, { headers: { Authorization: `Bearer ${token}` } });
            console.log('✅ POST /user/favorites - Success');
        } catch (e) { console.log('❌ POST /user/favorites - Failed', e.response?.data || e.message); }

        try {
            await axios.post(`${BASE_URL}/reviews/${stationId}`, { rating: 5, comment: 'Excellent station!' }, { headers: { Authorization: `Bearer ${token}` } });
            console.log('✅ POST /reviews/:stationId - Success');
        } catch (e) { console.log('❌ POST /reviews/:stationId - Failed', e.response?.data || e.message); }

        try {
            const revRes = await axios.get(`${BASE_URL}/reviews/${stationId}`);
            console.log('✅ GET /reviews/:stationId - Success');
        } catch (e) { console.log('❌ GET /reviews/:stationId - Failed', e.response?.data || e.message); }

        // 5. AI Features
        console.log('\n--- AI Endpoints ---');
        try {
            await axios.post(`${BASE_URL}/ai/chat`, { message: 'How to optimize EV hub?' }, { headers: { Authorization: `Bearer ${ownerToken}` } });
            console.log('✅ POST /ai/chat - Success');
        } catch (e) { console.log('❌ POST /ai/chat - Failed', e.response?.data || e.message); }

        console.log('\n🏁 All Tests Concluded.');
    } catch (globalError) {
        console.error('Critical test sequence error:', globalError.message);
    }
}

runTests();
