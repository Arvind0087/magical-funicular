
import React from "react";


function Instructions(props) {
    const {testinstruction} = props;
    return (
        <>
            <div
                dangerouslySetInnerHTML={{ __html: testinstruction?.instruction  }}
            />
        </>
    );
}

export default Instructions;
