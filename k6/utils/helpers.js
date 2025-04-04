export function generateRandomEmail() {
    return `test.user+${Date.now()}@example.com`;
}

export function getRandomUserCredentials() {
    return {
        email: 'test-user@example.com',
        password: 'Test@1234'
    };
}

export const BASE_URL = 'https://freecash.com';