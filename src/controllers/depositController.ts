import {Request, Response} from 'express';
import {PrismaClient, TransactionType} from '@prisma/client';
import {depositSchema} from "../validators/validationSchema";

const prisma = new PrismaClient();

export const createDeposit = async (req: Request, res: Response): Promise<void> => {
    try {
        const schemaValidation = depositSchema.safeParse(req.body);

        if (!schemaValidation.success) {
            res.status(400).json({
                error: "Deposit validation failed.",
                details: schemaValidation.error.message
            });
            return;
        }

        const {assetType, amount, address} = schemaValidation.data;

        const result = await prisma.$transaction(async (prisma) => {
            const balance = await prisma.balance.findFirst({
                where: {
                    address: address,
                    assetType: assetType
                }
            });
            if (!balance) {
                throw new Error("Balance not found.")
            }

            // Update balance
            await prisma.balance.update({
                where: {
                    id: balance.id
                },
                data: {
                    amount: {
                        increment: amount
                    }
                }
            });

            // Create transaction
            const transaction = await prisma.transaction.create({
                data: {
                    type: TransactionType.DEPOSIT,
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
        console.error('Error creating deposit: ', error);
        res.status(400).json({error: error.message || "Failed to create deposit"});
    }
}
