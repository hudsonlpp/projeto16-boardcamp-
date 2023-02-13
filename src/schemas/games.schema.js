import joi from "joi";

export const gameSchema = joi.object({
    name: joi.string().min(2).required(),
    image: joi.string().min(2).required(),
    stockTotal:joi.number().positive().required(),
    pricePerDay:joi.number().positive().required(),
});