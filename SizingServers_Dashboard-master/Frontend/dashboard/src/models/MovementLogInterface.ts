import ComponentInterface from "./ComponentInterface";
import MovementInterface from './MovementInterface';

export default interface MovementLogInterface {
    uuid: string,
    status: string,
    log_time: string,
    movement: MovementInterface,
}	