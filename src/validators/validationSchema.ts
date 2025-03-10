import {z} from 'zod';

const stringValidation = (fieldName: string) => {
    return z.string()
        .trim()
        .min(1, {message: `${fieldName} must be defined`})
        .regex(/^[a-zA-Z0-9]+$/, {message: `${fieldName} must only contain alphanumeric characters`});
};

export const withdrawalSchema = z.object({
    assetType: stringValidation("Asset type"),
    amount: z.number().positive("Amount must be positive"),
    address: stringValidation("Address"),
    userId: z.number().int().positive("User ID must be a positive integer"),
});

export const depositSchema = z.object({
    assetType: stringValidation("Asset type"),
    amount: z.number().positive("Amount must be positive"),
    address: stringValidation("Address"),
});

export const balanceSchema = z.object({
    assetType: stringValidation("Asset type"),
    userId: z.string().transform((value) => {
        const numberValue = Number(value);
        if (isNaN(numberValue)) {
            throw new Error("User ID must be a valid number");
        }
        return numberValue;
    }).refine((value) => value > 0, { message: "UserID must be a non-negative number" }),
});
