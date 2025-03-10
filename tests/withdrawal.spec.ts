import {test, expect} from '@playwright/test';
import {prisma, cleanDatabase} from "../utils/databaseUtils";

test.describe('Withdrawal Endpoint Tests', () => {
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

    test('should create a withdrawal transaction successfully', async ({request}) => {
        // Check response data
        const response = await request.post('/create/withdrawal', {
            data: {
                userId: USER_ID,
                assetType: ASSET_TYPE,
                address: ADDRESS,
                amount: 10
            }
        });

        expect(response.status()).toBe(201);

        const responseData = await response.json();

        expect(responseData.id).toBeDefined();
        expect(responseData).toMatchObject({
            type: "WITHDRAWAL",
            amount: 10,
            address: ADDRESS,
            balanceId: responseData.balance.id
        });

        // Check if balance was updated
        const balance = await prisma.balance.findUnique({
            where: {
                userId_assetType: {
                    userId: USER_ID,
                    assetType: ASSET_TYPE
                }
            }
        });

        expect(balance).toMatchObject({
            amount: 90
        });
    });

    test('should fail with insufficient balance', async ({request}) => {
        const response = await request.post('/create/withdrawal', {
            data: {
                userId: USER_ID,
                assetType: ASSET_TYPE,
                address: ADDRESS,
                amount: 200
            }
        });

        expect(response.status()).toBe(400);

        const responseData = await response.json();

        expect(responseData).toHaveProperty("error")
        expect(responseData.error).toBe("Insufficient balance.");
    });

    test('should fail with incorrect input address', async ({request}) => {
        const response = await request.post('/create/withdrawal', {
            data: {
                userId: USER_ID,
                assetType: ASSET_TYPE,
                address: "incorrectAddress",
                amount: 10
            }
        });

        expect(response.status()).toBe(400);

        const responseData = await response.json();

        expect(responseData).toHaveProperty("error")
        expect(responseData.error).toBe("Input address does not match balance address.");
    });

    test('should fail with invalid user ID', async ({request}) => {
        const response = await request.post('/create/withdrawal', {
            data: {
                userId: 2,
                assetType: ASSET_TYPE,
                address: ADDRESS,
                amount: 10
            }
        });

        expect(response.status()).toBe(400);

        const responseData = await response.json();

        expect(responseData).toHaveProperty("error")
        expect(responseData.error).toBe("Balance not found.");
    });

    test('should fail with incorrect asset type', async ({request}) => {
        const response = await request.post('/create/withdrawal', {
            data: {
                userId: USER_ID,
                assetType: "incorrectAssetType",
                address: ADDRESS,
                amount: 10
            }
        });

        expect(response.status()).toBe(400);

        const responseData = await response.json();

        expect(responseData).toHaveProperty("error")
        expect(responseData.error).toBe("Balance not found.");
    });

    test('should fail with invalid amount input', async ({request}) => {
        const response = await request.post('/create/withdrawal', {
            data: {
                userId: USER_ID,
                assetType: ASSET_TYPE,
                address: ADDRESS,
                amount: -10
            }
        });

        expect(response.status()).toBe(400);

        const responseData = await response.json();

        expect(responseData).toHaveProperty("error");
        expect(responseData.error).toBe("Withdrawal validation failed.");
        expect(responseData.details).toContain("Amount must be positive");
    });

    test('should fail with invalid asset type input', async ({request}) => {
        const response = await request.post('/create/withdrawal', {
            data: {
                userId: USER_ID,
                assetType: "ASSET TYPE",
                address: ADDRESS,
                amount: 10
            }
        });

        expect(response.status()).toBe(400);

        const responseData = await response.json();

        expect(responseData).toHaveProperty("error");
        expect(responseData.error).toBe("Withdrawal validation failed.");
        expect(responseData.details).toContain("must only contain alphanumeric characters");
    });

    test('should fail with invalid address input', async ({request}) => {
        const response = await request.post('/create/withdrawal', {
            data: {
                userId: USER_ID,
                assetType: ASSET_TYPE,
                address: "WITHDRAWAL ADDRESS",
                amount: 10
            }
        });

        expect(response.status()).toBe(400);

        const responseData = await response.json();

        expect(responseData).toHaveProperty("error");
        expect(responseData.error).toBe("Withdrawal validation failed.");
        expect(responseData.details).toContain("must only contain alphanumeric characters");
    });

    test('should fail with invalid user ID input', async ({request}) => {
        const response = await request.post('/create/withdrawal', {
            data: {
                userId: "1",
                assetType: ASSET_TYPE,
                address: ADDRESS,
                amount: 10
            }
        });

        expect(response.status()).toBe(400);

        const responseData = await response.json();

        expect(responseData).toHaveProperty("error");
        expect(responseData.error).toBe("Withdrawal validation failed.");
        expect(responseData.details).toContain("Expected number, received string");
    });
});
