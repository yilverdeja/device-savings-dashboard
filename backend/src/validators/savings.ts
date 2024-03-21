import { query, param, ValidationChain } from 'express-validator';

const validateGetDeviceSavings: ValidationChain[] = [
	param('deviceId')
		.isInt({ min: 0 })
		.withMessage('deviceId must be a positive integer')
		.toInt(),
	query('from')
		.optional()
		.isISO8601()
		.withMessage('from must be a valid date'),
	query('from').optional().isISO8601().withMessage('to must be a valid date'),
	query('resolution')
		.optional()
		.isIn(['month', 'week', 'day'])
		.withMessage(
			'resolution must be one of the following values: month, week or day'
		)
		.default('month'),
];

export default validateGetDeviceSavings;
