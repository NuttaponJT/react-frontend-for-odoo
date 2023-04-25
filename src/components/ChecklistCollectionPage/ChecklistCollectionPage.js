import { useEffect, useState } from "react";

import "./ChecklistCollectionPage.scss"
import RequestController from '../../controllers/RequestController';
import CheckListVisual from "../../components/CheckListVisual/CheckListVisual"
import BottomRightFloating from "../../components/BottomRightFloating/BottomRightFloating"
import BlackDropSpinner from "../../components/BlackDropSpinner/BlackDropSpinner";

const ChecklistCollectionPage = ({pageName}) => {
    const [checklistDatas, setChecklistDatas] = useState({});
    const [isAuditor, setIsAuditor] = useState(false);
    const [showBlackdropSpinner, setShowBlackdropSpinner] = useState(false);

    useEffect(() => {
        initPage();
        window.addEventListener(`${pageName}-refresh-signal`, onReInitSignal);

        return () => {
            window.removeEventListener(`${pageName}-refresh-signal`, onReInitSignal);
        };
    }, [pageName]);

    const onReInitSignal = (event) => {
        initPage();
    };

    const initPage = () => {
        setShowBlackdropSpinner(true);
        RequestController.getChecklistDatas({
            pageName: pageName, 
        })
        .then(response => response.json())
        .then((data) => {
            const result = data["result"];
            if(result["status"] === "success"){
                setChecklistDatas(result["body"]);
            }
            if(sessionStorage.getItem("userRole") === "Auditor"){
                setIsAuditor(true);
            }else{
                setIsAuditor(false);
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
            {isAuditor && (
                <BottomRightFloating pageName={pageName} checklistList={checklistDatas} />
            )}
            <BlackDropSpinner show={showBlackdropSpinner}/>
        </>
    );
};

export default ChecklistCollectionPage;