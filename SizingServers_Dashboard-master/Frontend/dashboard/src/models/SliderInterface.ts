export default interface SliderInterface {
	name: string;
	direction: string;
	slug: string;
	limits: {
		min: number;
		max: number;
	};
}
