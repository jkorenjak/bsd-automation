import {Request, Response} from 'express';
import {PrismaClient, TransactionType} from '@prisma/client';
import {withdrawalSchema} from "../validators/validationSchema";

const prisma = new PrismaClient();

export const createWithdrawal = async (req: Request, res: Response) => {
    try {
        const schemaValidation = withdrawalSchema.safeParse(req.body);

        if (!schemaValidation.success) {
            return res.status(400).json({
                error: "Withdrawal validation failed.",
                details: schemaValidation.error.message
            });
        }

        const {assetType, amount, address, userId} = schemaValidation.data;

        const result = await prisma.$transaction(async (prisma) => {
            const balance = await prisma.balance.findUnique({
                where: {
                    userId_assetType: {
                        userId,
                        assetType
                    }
                }
            });
            if (!balance) {
                throw new Error("Balance not found.")
            }
            if (balance.address != address) {
                throw new Error("Input address does not match balance address.")
            }
            if (balance.amount < amount) {
                throw new Error("Insufficient balance.")
            }

            // Update balance
            await prisma.balance.update({
                where: {
                    id: balance.id
                },
                data: {
                    amount: {
                        decrement: amount
                    }
                }
            });


            const transaction = await prisma.transaction.create({
                data: {
                    type: TransactionType.WITHDRAWAL,
                    amount: amount,
                    address: address,
                    balanceId: balance.id
                },
                include: {
                    balance: true
                }
            });
            return transaction;
        })
        res.status(201).json(result);
    } catch (error: Error | any) {
        console.error('Error creating withdrawal: ', error);
        res.status(400).json({error: error.message || "Failed to create withdrawal"});
    }
}
