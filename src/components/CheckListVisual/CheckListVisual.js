import { VictoryPie } from "victory";
import { useNavigate } from 'react-router-dom';

import "./CheckListVisual.css"

const CheckListVisual = ({checklistRef, checklistData, colorList}) => {
    const navigate = useNavigate();

    var data = [];
    var color = [];
    Object.keys(checklistData).forEach((risk_level, index) => {
        if(checklistData[risk_level] > 0){
            data.push({
                x: risk_level, 
                y: checklistData[risk_level], 
            });
            color.push(colorList[index]);
        }
    });
    if(data.length === 0){
        data.push({
            x: "None", 
            y: 1, 
        });
        color.push("grey");
    }

    const onClickVisual = (event) => {
        navigate(`/my/home/checklist-page/${checklistRef}`);
    };

    return (
        <>
            <div class="checklist-visual-wrap" onClick={onClickVisual}>
                <h5>{checklistRef}</h5>
                <VictoryPie 
                    data={data} 
                    colorScale={color}
                    style={{
                        labels: {
                            fontSize: 22, 
                        }, 
                    }}
                    />
            </div>
        </>
    )
};

export default CheckListVisual;