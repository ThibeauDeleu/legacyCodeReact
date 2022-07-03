import ComponentLogInterface from "../models/ComponentLogInterface";

export default function DonutChart({componentLog}:{componentLog:ComponentLogInterface}){

    const calcDash = (level:string) => {
        const dash:number = Number(level);
        const result = (dash * (2 * 40 * 3.14159265359)/100);
        // console.log(level);
        return result.toString();
    }

    const setColor = (level:string) => {
        const lvl:number = Number(level);
        let color:string = '#FFFFFF' 
        if(lvl <= 40){
            color = '#6ED3F5';
        }
        else if(lvl <= 60 && lvl > 40){
            color = '#F19000';
        }
        else{
            color ='#FB3838'
        }
        return color;
    }
    return(
        <div>
            <div className="c-logs-heat-data">
                    <svg
                        className='c-logs-heat-data-chart'
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            className="c-logs-heat-data-chart__base-circle"
                            cx="50"
                            cy="50"
                            r="40"
                        />
                        <circle
                            className="c-logs-heat-data-chart__fill-circle"
                            style={{strokeDasharray:calcDash(componentLog.criteria) + ' 999', stroke:setColor(componentLog.criteria)}}
                            cx="50"
                            cy="50"
                            r="40"
                            />
                    </svg>
                    <div className='c-logs-heat-data-text'>
                        <h2 className='c-logs-heat-data-text__temp'
                            style={{color:setColor(componentLog.criteria)}}
                        >
                            {componentLog.criteria}°C
                        </h2>
                        <p className='c-logs-heat-data-text__part'>{componentLog.component.name}</p>
                    </div>

            </div>
        </div>
    )
}