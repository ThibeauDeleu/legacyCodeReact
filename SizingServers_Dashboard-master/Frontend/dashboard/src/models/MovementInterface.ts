import RobotInterface from './RobotInterface';

export default interface MovementInterface {
	uuid: string;
	name: string;
	slug: string;
	payload: Object;
	movement_type: string;
	robot: RobotInterface;
	description: string;
	components?: string[];
	in_development: boolean;
}
