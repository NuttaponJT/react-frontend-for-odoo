import "./BlackDropSpinner.scss"

import Spinner from 'react-bootstrap/Spinner';

const BlackDropSpinner = ({show}) => {
    
    return (
        <>
            {show && (
                <div className="black-drop">
                    <Spinner animation="border" role="status" variant="light">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}
        </>
    )
};

export default BlackDropSpinner;