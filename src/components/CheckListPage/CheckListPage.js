/* eslint-disable eqeqeq */
import { useState, useEffect } from 'react';

import "./CheckListPage.css"
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import CheckListLine from "../CheckListLine/CheckListLine";
import MyCustomModal from "../MyCustomModal/MyCustomModal";
import RequestController from "../../controllers/RequestController"

import { Button } from 'react-bootstrap';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

const CheckListPage = ({checklistRef}) => {
    const [checkListLinesData, setCheckListLinesData] = useState({
        linesData: {}, 
        statusMapping: {}, 
        riskLevelMapping: {}, 
        userMapping: {}, 
    });
    const [modalState, setModalState] = useState({
        show: false, 
    })
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const [isAuditor, setIsAuditor] = useState(false);

    useEffect(() => {
        initChecklistPage();
    }, []);

    const initChecklistPage = async () => {
        Promise.all([
            RequestController.getChecklistLine({ref: `${checklistRef}`}), 
            RequestController.getStatusMapping({ref: `${checklistRef}`}), 
            RequestController.getRiskLevelMapping({ref: `${checklistRef}`}), 
            RequestController.getUsersMapping({}), 
        ])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            const data1 = data[0]["result"];
            const data2 = data[1]["result"];
            const data3 = data[2]["result"];
            const data4 = data[3]["result"];
            setCheckListLinesData({
                linesData: data1["body"], 
                statusMapping: data2["body"], 
                riskLevelMapping: data3["body"], 
                userMapping: data4["body"], 
            });
            if(sessionStorage.getItem("userRole") === "Auditor"){
                setIsAuditor(true);
            }else{
                setIsAuditor(false);
            }
        })
    };

    const onClickAddChecklist = (event) => {
        setModalState({...modalState, show: true});
    }

    const createNewChecklistLine = () => {
        const onClickConfirm = async (event) => {
            RequestController.createChecklistLine({
                ref: `${checklistRef}`, 
                desc: `${editorState.getCurrentContent().getPlainText()}`, 
            })
            .then(response => response.json())
            .then((data) => {
                setModalState({...modalState, show: false});
                setEditorState(() => EditorState.createEmpty());
                const result = data["result"];
                setCheckListLinesData({...checkListLinesData, linesData: result["body"]});
            });
        };

        return (
            <>
            <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
            />
            <hr/>
            <Button variant="success" onClick={onClickConfirm}>Confirm</Button>{' '}
            </>
        )
    }

    const setLineData = (lineData) => {
        setCheckListLinesData({...checkListLinesData, linesData: {...lineData}});
    }

    return (
        <div class="checklist-page-content">
        <div class="checklist-page-header">
            <div class="checklist-line-wrap">
                <span class="checklist-line-header-text">{checklistRef}</span>
                {isAuditor && (
                    <Button variant="outline-success" onClick={onClickAddChecklist}>Add Checklist</Button>
                )}
            </div>
        </div>
        <MyCustomModal 
            show={modalState.show}
            setShow={(state) => {setModalState({...modalState, show: state}); setEditorState(() => EditorState.createEmpty())}}
            content={createNewChecklistLine}
        />
        {Object.keys(checkListLinesData["linesData"]).map((checklistId) => {
            return (
                <CheckListLine 
                    key={checklistId}
                    checklistLineData={checkListLinesData["linesData"][checklistId]}
                    statusMapping={checkListLinesData["statusMapping"]}
                    riskLevelMapping={checkListLinesData["riskLevelMapping"]}
                    setCheckLineData={setLineData}
                    isAuditor={isAuditor}
                    userMapping={checkListLinesData["userMapping"]}/>
            )
        })}
        </div>
    )
};

export default CheckListPage;