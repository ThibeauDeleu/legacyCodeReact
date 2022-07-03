import ComponentInterface from "./ComponentInterface";

export default interface ComponentLogInterface {
	uuid: string,
  type: string,
  level: string,
  description: string,
  criteria:string,
  start_time: string,
  end_time: string,
  component: ComponentInterface
}	
