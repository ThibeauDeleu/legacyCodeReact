export const convertCamelCaseToSeparate = (value: string): string => {
	let separated: string = value
		.split(/(?=[A-Z])/)
		.map((s) => s.toLowerCase())
		.join(' ')
		.replace(/^./, (str) => str.toUpperCase());

	return separated;
};

export const setFirstLetterUpper = (value: string): string => {
	return value.replace(/^./, (str) => str.toUpperCase());
};
