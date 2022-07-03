export default interface ActiveMovementInterface {
	robotId: number;
	movements: [
		{
			movementId: number;
			type: string;
		}
	];
}
