import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, getRandomUserCredentials } from '../utils/helpers.js';

export const options = {
    stages: [
        { duration: '1m', target: 50 },  // Ramp up to 50 users
        { duration: '3m', target: 50 },  // Stay at 50 users for 3 minutes
        { duration: '1m', target: 0 },   // Ramp down to 0 users
    ],
    thresholds: {
        'http_req_duration': ['p(95)<2000'], // 95% of requests should be below 2s
        'http_req_failed': ['rate<0.01'],    // Less than 1% of requests should fail
    },
};

export default function() {
    const credentials = getRandomUserCredentials();
    
    // Get the login page first (simulating real user behavior)
    const loginPage = http.get(`${BASE_URL}/login`);
    check(loginPage, {
        'login page loaded': (r) => r.status === 200,
    });

    sleep(1);

    // Perform login request
    const loginPayload = JSON.stringify({
        email: credentials.email,
        password: credentials.password
    });

    const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    };

    const loginResponse = http.post(
        `${BASE_URL}/api/auth/login`,
        loginPayload,
        { headers }
    );

    check(loginResponse, {
        'login successful': (r) => r.status === 200,
        'has auth token': (r) => r.json('token') !== undefined,
    });

    sleep(2);
}