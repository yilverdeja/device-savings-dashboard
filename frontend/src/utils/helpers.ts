// Helper functions

// rounds to 1 decimal point
export const roundToOneDecimal = (value: number): number => {
	return Math.round(value * 10) / 10;
};

// calculates the carbon value between tonnes and kgs
export const calculateCarbonValue = (
	value: number
): { value: number; units: string } => {
	if (value > 1000) {
		return { value: roundToOneDecimal(value / 1000), units: 'Tonnes' };
	} else {
		return { value: roundToOneDecimal(value), units: 'Kgs' };
	}
};
