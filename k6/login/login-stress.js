import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, getRandomUserCredentials } from '../utils/helpers.js';

export const options = {
    stages: [
        { duration: '2m', target: 100 },    // Ramp up to 100 users
        { duration: '5m', target: 100 },    // Stay at 100 users
        { duration: '2m', target: 200 },    // Ramp up to 200 users
        { duration: '5m', target: 200 },    // Stay at 200 users
        { duration: '2m', target: 300 },    // Ramp up to 300 users
        { duration: '5m', target: 300 },    // Stay at 300 users
        { duration: '2m', target: 0 },      // Scale down to 0
    ],
    thresholds: {
        'http_req_duration': ['p(95)<4000'], // 95% of requests must complete below 4s
        'http_req_failed': ['rate<0.05'],    // Less than 5% can fail
    },
};

export default function() {
    const credentials = getRandomUserCredentials();
    
    const loginResponse = http.post(
        `${BASE_URL}/api/auth/login`,
        JSON.stringify(credentials),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    check(loginResponse, {
        'status is 200': (r) => r.status === 200,
        'response time OK': (r) => r.timings.duration < 4000,
    });

    sleep(1);
}