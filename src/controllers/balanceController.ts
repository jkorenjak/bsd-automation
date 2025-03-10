import {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import {balanceSchema} from "../validators/validationSchema";

const prisma = new PrismaClient();

export const getBalance = async (req: Request, res: Response) => {
    try {
        const schemaValidation = balanceSchema.safeParse(req.query);

        if (!schemaValidation.success) {
            return res.status(400).json({
                error: "Balance validation failed.",
                details: schemaValidation.error.message
            });
        }

        const {assetType, userId} = schemaValidation.data;

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
        res.status(200).json(balance);
    } catch (error: Error | any) {
        console.error('Error retrieving balance: ', error);
        res.status(400).json({error: error.message || "Failed to retrieve balance"});
    }
}
