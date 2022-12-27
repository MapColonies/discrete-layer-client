import React from 'react';
import './CesiumInfoBoxContainer.css'

export const CesiumInfoBoxContainer: React.FC = (props) => {
    return <div className='MCCesiumInfoBox'>
        { props.children }
    </div>
}