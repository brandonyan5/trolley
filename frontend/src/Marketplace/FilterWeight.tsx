import React from 'react';
import './FilterWeight.css'

interface FilterWeightProps {
    filterID: number  // 0 = price, 1 = distance, 2 = storage area
    handleWeightChange: any
    filterWeights: [number, number, number]
    filterName: string
}

function FilterWeight(props: FilterWeightProps) {

    return (
        <div className="filter-weight">
            <p>{props.filterName}</p>
            <input
                type="range"
                min="0"
                max="10"
                value={props.filterWeights[props.filterID]}
                className="filter-weight-slider"
                onChange={e => props.handleWeightChange(e, props.filterID)}
            />
        </div>
    );
}

export default FilterWeight;