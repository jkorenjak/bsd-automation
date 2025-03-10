import {test, expect} from '@playwright/test';
import {prisma, cleanDatabase} from "../utils/databaseUtils";

test.describe('Balance Endpoint Tests', () => {
    const USER_ID = 1;
    const ASSET_TYPE = "ETH";
    const ADDRESS = "0xc0ffee254729296a45a3885639AC7E10F9d54979";
    const AMOUNT = 100;

    // Setup
    test.beforeAll(async () => {
            // Clean DB
            await cleanDatabase();
            // Create initial user
            await prisma.user.create({
                data: {
                    id: USER_ID
                }
            });
            // Create initial balance
            await prisma.balance.create({
                data: {
                    userId: USER_ID,
                    assetType: ASSET_TYPE,
                    address: ADDRESS,
                    amount: AMOUNT
                }
            })
        }
    )

    // Teardown
    test.afterAll(async () => {
        await cleanDatabase();
        await prisma.$disconnect();
    })

    test('should get balance successfully', async ({request}) => {
        // Check response data
        const response = await request.get('/balance', {
            params: {
                userId: USER_ID,
                assetType: ASSET_TYPE,
            }
        });

        expect(response.status()).toBe(200);

        const responseData = await response.json();

        expect(responseData).toMatchObject({
            userId: USER_ID,
            assetType: ASSET_TYPE,
            address: ADDRESS,
            amount: 100
        });
    });

    test('should fail with invalid user ID', async ({request}) => {
        // Check response data
        const response = await request.get('/balance', {
            params: {
                userId: 2,
                assetType: ASSET_TYPE,
            }
        });

        expect(response.status()).toBe(400);

        const responseData = await response.json();

        expect(responseData).toHaveProperty("error")
        expect(responseData.error).toBe("Balance not found.");
    });

    test('should fail with invalid asset type', async ({request}) => {
        // Check response data
        const response = await request.get('/balance', {
            params: {
                userId: USER_ID,
                assetType: "BTC",
            }
        });

        expect(response.status()).toBe(400);

        const responseData = await response.json();

        expect(responseData).toHaveProperty("error")
        expect(responseData.error).toBe("Balance not found.");
    });

    test('should fail with invalid user ID input', async ({request}) => {
        // Check response data
        const response = await request.get('/balance', {
            params: {
                userId: -1,
                assetType: ASSET_TYPE,
            }
        });

        expect(response.status()).toBe(400);

        const responseData = await response.json();

        expect(responseData).toHaveProperty("error")
        expect(responseData.error).toBe("Balance validation failed.");
    });

    test('should fail with invalid asset type input', async ({request}) => {
        // Check response data
        const response = await request.get('/balance', {
            params: {
                userId: USER_ID,
                assetType: "ASSET TYPE",
            }
        });

        expect(response.status()).toBe(400);

        const responseData = await response.json();

        expect(responseData).toHaveProperty("error")
        expect(responseData.error).toBe("Balance validation failed.");
    });
});
