import { query, ValidationChain } from 'express-validator';

const validateGetDevices: ValidationChain[] = [
	query('includeSavings')
		.optional()
		.isBoolean()
		.withMessage('includeSavings must be a boolean')
		.default(false)
		.toBoolean(),
];

export default validateGetDevices;
