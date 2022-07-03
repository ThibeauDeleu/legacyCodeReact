import MovementLogInterface from "../models/MovementLogInterface";

export default function ActivityLog({log}:{log:MovementLogInterface}){
    return(

        <article className='c-logs-card'>
            <div className='c-logs-card__icon-container'>
                <svg className='c-logs-card__icon' id="info_black_24dp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path id="Path_61" data-name="Path 61" d="M0,0H24V24H0Z" fill="none"/>
                    <path id="Path_62" data-name="Path 62" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,15H11V11h2Zm0-8H11V7h2Z" fill="white"/>
                </svg>
            </div>

            <p className='c-logs-card__text'>{log.status}</p>
        </article>
    )
}