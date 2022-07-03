import { randomInt } from 'crypto';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef } from 'react';

// Accepts the array and key
export const groupBy = (array: any[], key: string) => {
	// Return the end result
	return array.reduce((result, currentValue) => {
		// If an array already present for key, push it to the array. Else create an array and push the object
		(result[currentValue[key]] = result[currentValue[key]] || []).push(
			currentValue
		);
		// Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
		return result;
	}, {}); // empty object is the initial value for result object
};

export const groupByNested = (array: any[], property: string) => {
	var hash: any = {},
		props = property.split('.');
	for (var i = 0; i < array.length; i++) {
		var key = props.reduce(function (acc, prop) {
			return acc && acc[prop];
		}, array[i]);
		if (!hash[key]) hash[key] = [];
		hash[key].push(array[i]);
	}
	return hash;
};

export function useTraceUpdate(props: any) {
	const prev = useRef(props);
	useEffect(() => {
		const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
			if (prev.current[k] !== v) {
				// @ts-ignore
				ps[k] = [prev.current[k], v];
			}
			return ps;
		}, {});
		if (Object.keys(changedProps).length > 0) {
			console.log('Changed props:', changedProps);
		}
		prev.current = props;
	});
}

export const oneToTwoNumberNotation = (value: number) => {
	if (value < 10) {
		return `0${value}`;
	}
	return value;
};

export function getUnique(arr: any[], comp: any) {
	// store the comparison  values in array
	const unique = arr
		.map((e) => e[comp])

		// store the indexes of the unique objects
		.map((e, i, final) => final.indexOf(e) === i && i)

		// eliminate the false indexes & return unique objects
		// @ts-ignore
		.filter((e) => arr[e])
		// @ts-ignore
		.map((e) => arr[e]);

	return unique;
}

export function checkIfDateIsToday(date: Dayjs): boolean {
	const today = dayjs();
	return (
		(date.day() === today.day() &&
			date.month() === today.month() &&
			date.year()) === today.year()
	);
}
