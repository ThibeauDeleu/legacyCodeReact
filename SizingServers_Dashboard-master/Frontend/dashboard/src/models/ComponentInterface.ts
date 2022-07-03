import RobotInterface from "./RobotInterface";

export default interface ComponentInterface {
	uuid: string;
	name: string;
	slug: string;
	robot: RobotInterface;
	group: string;
	controls: any;
}
