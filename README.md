# Transaction API with Automation

A simple REST API for handling cryptocurrency transactions (deposits, withdrawals, and balance inquiries).
Includes automated testing using Playwright and TypeScript.

## Test Report Status
Playwright report of the latest executed workflow can be found here:  
[![GitHub Pages](https://img.shields.io/badge/Test_Report-GitHub_Pages-blue?logo=github)](https://jkorenjak.github.io/bsd-automation/)

You can find the uploaded test result artifacts in the [Actions tab](https://github.com/jkorenjak/bsd-automation/actions).

## API Endpoints

- `POST /create/withdrawal` - Create a withdrawal
- `POST /create/deposit` - Create a deposit
- `GET /balance` - Retrieve account balance

## Tech Stack

- TypeScript, Express.js
- Prisma (Database ORM)
- Playwright (Testing)
- Docker for containerization
- GitHub Actions for CI/CD
- Zod for input validation

## API Documentation

### 1. **POST /create/withdrawal**

**Description**: Creates a withdrawal transaction for a specified asset.

#### Request Payload
```json
{
  "assetType": "ETH",
  "amount": 10,
  "address": "0xc0ffee254729296a45a3885639AC7E10F9d54979",
  "userId": 1
}
```

#### Response (201 - Created)
```json
{
  "id": "transaction-id",
  "type": "WITHDRAWAL",
  "amount": 10,
  "address": "0xc0ffee254729296a45a3885639AC7E10F9d54979",
  "balanceId": "3bd77a94-ee0f-4aff-8917-63d9177dcfe4"
}
```

#### Errors (400 - Bad Request)
- **Withdrawal validation failed.**: Input validation failed.
- **Balance not found.**: No balance found for the `userId` and `assetType`.
- **Input address does not match balance address.**: Supplied address doesn't match the stored address for the balance.
- **Insufficient balance.**: Asset balance is lower than the requested withdrawal amount.

---

### 2. **POST /create/deposit**

**Description**: Creates a deposit transaction for a specified asset.

#### Request Payload
```json
{
  "assetType": "BTC",
  "amount": 2,
  "address": "0xc0ffee254729296a45a3885639AC7E10F9d54979"
}
```

#### Response (201 - Created)
```json
{
  "id": "transaction-id",
  "type": "DEPOSIT",
  "amount": 2,
  "address": "0xc0ffee254729296a45a3885639AC7E10F9d54979",
  "balanceId": "3bd77a94-ee0f-4aff-8917-63d9177dcfe4"
}
```

#### Errors (400 - Bad Request)
- **Deposit validation failed.**: Input validation failed.
- **Balance not found.**: No balance found for the given `address` and `assetType`.

---

### 3. **GET /balance**

**Description**: Retrieves the current balance for a specified asset and user.

#### Request Payload
```json
{
  "userId": "1",
  "assetType": "ETH"
}
```

#### Response (200 - OK)
```json
{
  "userId": "1",
  "assetType": "ETH",
  "amount": 100,
  "address": "0xc0ffee254729296a45a3885639AC7E10F9d54979"
}
```

#### Errors (400 - Bad Request)
- **Balance validation failed.**: Input validation failed.
- **Balance not found.**: No balance found for the `userId` and `assetType`.

---
