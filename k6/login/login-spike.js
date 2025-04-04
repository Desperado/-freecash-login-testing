import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, getRandomUserCredentials } from '../utils/helpers.js';

export const options = {
    stages: [
        { duration: '10s', target: 100 },   // Spike to 100 users
        { duration: '1m', target: 100 },    // Stay at 100 users
        { duration: '10s', target: 0 },     // Scale down
    ],
    thresholds: {
        http_req_duration: ['p(99)<3000'],  // 99% of requests must complete below 3s
        http_req_failed: ['rate<0.05'],     // Less than 5% can fail
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
        'successful login': (r) => r.status === 200,
    });

    sleep(1);
}