/* eslint-disable eqeqeq */
import { useState, useEffect } from 'react';

import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

const MyCustomModal = ({show, setShow, content, size = "lg", header = "Modal"}) => {
    const BodyContent = content;

    return (
        <>
        <Modal size={size} show={show} fullscreen={`md-down`} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <BodyContent />
            </Modal.Body>
        </Modal>
        </>
    )
};

export default MyCustomModal