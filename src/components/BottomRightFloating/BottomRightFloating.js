import { useState, useRef, useEffect } from "react";

import "./BottomRightFloating.scss"
import RequestController from "../../controllers/RequestController"
import MyCustomModal from "../MyCustomModal/MyCustomModal"
import BlackDropSpinner from "../BlackDropSpinner/BlackDropSpinner";

import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";

const BottomRightFloating = ({pageName, checklistList = {}}) => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [showModal, setShowModal]  = useState(false);
    const [showBlackdropSpinner, setShowBlackdropSpinner] = useState(false);
    const [offCanvasState, setOffCanvasState] = useState("menu");
    const checklistNameRef = useRef(null);
    const confirmAlertModal = useRef(null);

    const onClickFloating = () => {
        setShow(true);
    };

    const handleCreate = () => {
        setOffCanvasState("create");
    };

    const handleDelete = () => {
        setOffCanvasState("delete");
    };

    const handleClose = () => {
        setShow(false);
        setOffCanvasState("menu");
    };

    const handleBack = () => {
        setOffCanvasState("menu");
    };

    const onCreateChecklist = async () => {
        RequestController.createChecklist({
            name: checklistNameRef.current.value, 
            page: pageName, 
        })
        .then(response => response.json())
        .then(async (data) => {
            const result = data["result"];
            if(result["status"] === "success"){
                const addChecklistRoute = new CustomEvent("add-checklist-route-signal", {
                    detail: {
                        ref: result["body"]["checklist_name"], 
                    }
                });
                await window.dispatchEvent(addChecklistRoute);
                navigate(`/my/home/checklist-page/${result["body"]["checklist_name"]}`);
            }
        });
    };

    const confirmAlert = () => {
        const handleClickYes = async () => {
            setShowBlackdropSpinner(true)
            RequestController.deleteChecklist({
                id: parseInt(confirmAlertModal.current.value), 
            })
            .then(response => response.json())
            .then(async (data) => {
                const refreshSignal = new CustomEvent(`${pageName}-refresh-signal`);
                await window.dispatchEvent(refreshSignal);
                setShowModal(false);
                setShowBlackdropSpinner(false);
            });
        };

        const handleClickNo = () => {
            setShowModal(false);
        }

        return (
            <>
            <Nav className="flex-column">
                <Nav.Link className="manage-checklist-menu" onClick={handleClickYes}>Yes</Nav.Link>
                <Nav.Link className="manage-checklist-menu" onClick={handleClickNo}>No</Nav.Link>
            </Nav>
            </>
        )
    };

    return (
        <>
            <div class="bottom-right-floating" onClick={onClickFloating}>
                <FontAwesomeIcon className="fa-layer-group-style" icon={faLayerGroup} />
            </div>
            <Offcanvas show={show} onHide={handleClose} placement={`end`}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Manage Checklist</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {offCanvasState === "menu" && (
                        <Nav className="flex-column">
                            <Nav.Link className="manage-checklist-menu" eventKey="link-0" onClick={handleCreate}>Create new</Nav.Link>
                            <Nav.Link className="manage-checklist-menu" eventKey="link-1" onClick={handleDelete}>Delete</Nav.Link>
                            <Nav.Link className="manage-checklist-menu" eventKey="link-2" onClick={handleClose}>Close</Nav.Link>
                        </Nav>
                    )}
                    {offCanvasState === "create" && (
                        <Nav className="flex-column">
                            <Nav.Link className="manage-checklist-menu" eventKey="link-4" onClick={handleBack}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Nav.Link>
                            <input ref={checklistNameRef} name="checklist-name" placeholder="put checklist name . . ."/>
                            <Button size="sm" variant="success" style={{marginTop: "3px"}} onClick={onCreateChecklist}>Create</Button>
                        </Nav>
                    )}
                    {offCanvasState === "delete" && (
                        <Nav className="flex-column">
                            <Nav.Link className="manage-checklist-menu" eventKey="link-4" onClick={handleBack}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Nav.Link>
                            {Object.keys(checklistList).map((checklistId) => {
                                const onClickChecklistToDelete = async () => {
                                    confirmAlertModal.current.value = checklistId;
                                    setShowModal(true);
                                }

                                return (
                                    <Nav.Link className="manage-checklist-menu" onClick={onClickChecklistToDelete}>{checklistList[checklistId]["checklist_name"]}</Nav.Link>
                                )
                            })}
                        </Nav>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
            <div ref={confirmAlertModal} style={{display: "none"}}></div>
            <MyCustomModal  show={showModal} setShow={setShowModal} content={confirmAlert} size={`sm`} header={`Delete ?`}/>
            <BlackDropSpinner show={showBlackdropSpinner}/>
        </>
    )
};

export default BottomRightFloating;