import { useEffect, useState } from "react";

import "./DPOPage.scss"
import RequestController from '../../controllers/RequestController';
import CheckListVisual from "../../components/CheckListVisual/CheckListVisual"
import BottomRightFloating from "../../components/BottomRightFloating/BottomRightFloating"
import BlackDropSpinner from "../../components/BlackDropSpinner/BlackDropSpinner";

const DPOPage = () => {
    const [checklistDatas, setChecklistDatas] = useState({});
    const [showBlackdropSpinner, setShowBlackdropSpinner] = useState(false);

    useEffect(() => {
        initDPOPage();
        window.addEventListener("dpopage-refresh-signal", onReInitSignal);

        return () => {
            window.removeEventListener("dpopage-refresh-signal", onReInitSignal);
        };
    }, []);

    const onReInitSignal = (event) => {
        initDPOPage();
    };

    const initDPOPage = () => {
        setShowBlackdropSpinner(true);
        RequestController.getChecklistDatas({
            pageName: "dpopage", 
        })
        .then(response => response.json())
        .then((data) => {
            const result = data["result"];
            if(result["status"] === "success"){
                setChecklistDatas(result["body"]);
            }
            setShowBlackdropSpinner(false);
        });
    };

    return (
        <>
            <div class="checklist-list">
                {Object.keys(checklistDatas).map((checklistId) => {
                    return (
                        <CheckListVisual 
                            checklistRef={`${checklistDatas[checklistId]["checklist_name"]}`}
                            checklistData={checklistDatas[checklistId]["data"]}
                            colorList={checklistDatas[checklistId]["color"]}/>
                    );
                })}
            </div>
            <BottomRightFloating pageName={`dpopage`} checklistList={checklistDatas} />
            <BlackDropSpinner show={showBlackdropSpinner}/>
        </>
    );
};

export default DPOPage