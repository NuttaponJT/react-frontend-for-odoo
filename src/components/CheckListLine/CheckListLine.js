import { useState } from 'react';

import "./CheckListLine.scss"
import RequestController from '../../controllers/RequestController';
import MyCustomModal from "../MyCustomModal/MyCustomModal";

import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';
import { useInsertionEffect } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

const CheckListLine = ({checklistLineData, statusMapping, riskLevelMapping, setCheckLineData, isAuditor, userMapping}) => {
    const [lineData, setLineData] = useState(checklistLineData);
    const [editorState, setEditorState] = useState(
        () => EditorState.createWithText(lineData["questionaire"]),
    );
    const [modalState, setModalState] = useState({
        show: false, 
    })
    const hostEndpoint = `${process.env.REACT_APP_HOST_ENDPOINT}`;
    const odooApiKey = `${process.env.REACT_APP_ODOO_API_KEY}`;
    const isEditable = (lineData["responsible_uid"] === parseInt(sessionStorage.getItem("userId"))) ? true : false;

    const putUpdateStatus = (status) => {
        fetch(
            `${hostEndpoint}/api/pdpa/checklist_line/update/status`, 
            {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${odooApiKey}`, 
                }, 
                body: JSON.stringify({
                    checklist_line_id: lineData["id"], 
                    status: status, 
                }),  
            }, 
        )
        .then(response => response.json())
        .then((data) => {
            data = data["result"];
            if(data["status"] === "success"){
                setLineData({...lineData, status: data["body"]["new_status"]});
            }
        });
    }

    const putUpdateRiskLevel = (riskLevel) => {
        fetch(
            `${hostEndpoint}/api/pdpa/checklist_line/update/risk_level`, 
            {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${odooApiKey}`, 
                }, 
                body: JSON.stringify({
                    checklist_line_id: lineData["id"], 
                    risk_level: riskLevel, 
                }),  
            }, 
        )
        .then(response => response.json())
        .then((data) => {
            data = data["result"];
            if(data["status"] === "success"){
                setLineData({...lineData, risk_level: data["body"]["new_risk_level"]});
            }
        });
    }

    const onClickDelete = (event) => {
        RequestController.deleteChecklistLine({
            checklist_line_id: lineData["id"], 
        })
        .then(response => response.json())
        .then((data) => {
            const result = data["result"];
            setCheckLineData(result["body"]);
        });
    }

    const onClickEdit = (event) => {
        setModalState({modalState, show: true});
    };

    const updateQuestionaire = () => {
        const onClickConfirm = async (event) => {
            RequestController.updateChecklistLine({
                checklist_line_id: lineData["id"], 
                update_list: {
                    questionaire: `${editorState.getCurrentContent().getPlainText()}`, 
                }, 
            })
            .then(response => response.json())
            .then((data) => {
                setModalState({...modalState, show: false});
                // setEditorState(() => EditorState.createEmpty());
                const result = data["result"];
                setLineData(result["body"]);
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

    return (
        <>
            <MyCustomModal 
                show={modalState.show}
                setShow={(state) => {setModalState({...modalState, show: state}); setEditorState(() => EditorState.createEmpty())}}
                content={updateQuestionaire}
            />
            <div class="checklist-line-wrap">
                <div class="checklist-line-card">
                    <div class="checklist-line-card-header">
                        <span>{lineData.questionaire}</span>
                        <div class="checklist-line-card-body-right">
                            {isAuditor && (
                                <>
                                    <Button size="sm" variant="outline-danger" onClick={onClickEdit}>Edit</Button>
                                    <Button style={{marginLeft: "5px"}} size="sm" variant="outline-danger" onClick={onClickDelete}>Delete</Button>
                                </>
                            )}
                        </div>
                        
                    </div>
                    <div class="checklist-line-card-body">
                        <div class="checklist-line-card-body-left">
                            <Dropdown>
                                <Dropdown.Toggle size="sm" variant="outline-secondary" id="dropdown-risk-level" disabled={!isEditable}>
                                    <span style={{color: "black"}}><div class="dot" style={{"background-color": `${riskLevelMapping[lineData.risk_level]["color"]}`}} /> {riskLevelMapping[lineData.risk_level]["display_name"]}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {Object.keys(riskLevelMapping).map((key) => {
                                        const onClickRiskLevelDropdown = () => {
                                            if(lineData.risk_level !== key){
                                                putUpdateRiskLevel(key);
                                            }
                                        }

                                        return (
                                            <Dropdown.Item onClick={onClickRiskLevelDropdown}><div class="dot" style={{"background-color": `${riskLevelMapping[key]["color"]}`}} /> {riskLevelMapping[key]["display_name"]}</Dropdown.Item>     
                                        );
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown>
                                <Dropdown.Toggle 
                                    style={{width: "170px", marginLeft: "5px"}} 
                                    size="sm" variant="outline-secondary"
                                    disabled={!isAuditor}>
                                    <span style={{color: "black"}}>{(lineData["responsible_uid"] === false) ? `---` : userMapping[lineData["responsible_uid"]]["name"]}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {Object.keys(userMapping).map((key) => {
                                        const onClickUserDropdown = () => {
                                            if(lineData["responsible_uid"] !== key){
                                                console.log(parseInt(key));
                                                RequestController.updateChecklistLine({
                                                    checklist_line_id: lineData["id"], 
                                                    update_list: {
                                                        responsible_person: parseInt(key) === -1 ? false : parseInt(key), 
                                                    }, 
                                                })
                                                .then(response => response.json())
                                                .then((data) => {
                                                    let result = data["result"];
                                                    if(result["status"] === "success"){
                                                        console.log(result["body"]);
                                                        setLineData(result["body"]);
                                                    }
                                                });
                                            }
                                        }

                                        return (
                                            <Dropdown.Item onClick={onClickUserDropdown}>{userMapping[key]["name"]}</Dropdown.Item>     
                                        )
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <Dropdown>
                            <Dropdown.Toggle size="sm" variant={statusMapping[lineData.status]["color"]} id="dropdown-status">
                                {statusMapping[lineData.status]["display_name"]}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {Object.keys(statusMapping).map((key) => {

                                    const onClickStatusDropdown = () => {
                                        if(!isAuditor){
                                            alert("You don't have permission to change status");
                                            return;
                                        }
                                        if(lineData.status !== key){
                                            putUpdateStatus(key);
                                        }
                                    }

                                    return (
                                        <Dropdown.Item onClick={onClickStatusDropdown}>{statusMapping[key]["display_name"]}</Dropdown.Item>
                                    );
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckListLine