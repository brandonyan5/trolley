import React from 'react';
import {TwoThumbInputRange} from "react-two-thumb-input-range";
import "./FilterBar.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from "react-date-range";

interface FilterBarProps {
    priceFilterRange: [number, number]
    areaFilterRange: [number, number]
    distanceFilterRange: [number, number] // filter for distances below the max tolerable distance
    dateFilterRange: any
    setPriceFilterRange: any
    setAreaFilterRange: any
    setDistanceFilterRange: any
    setDateFilterRange: any
}

function FilterBar(props: FilterBarProps) {

    const handlePriceFilterChange = (range: [number, number]) => {
        // do not allow for max/min prices within $5 range
        if (range[0] + 5 < range[1]) {
            props.setPriceFilterRange(range)
        }
    }

    const handleAreaFilterChange = (range: [number, number]) => {
        // do not allow for area values closer than 25 sqft
        if (range[0] + 25 < range[1]) {
            props.setAreaFilterRange(range)
        }
    }

    const handleDistanceFilterChange = (range: [number, number]) => {
        // only allow the max distance to change (i.e. upper thumb of slider)
        // max distance must be >= 1 mile
        if (range[1] > 0) {
            props.setDistanceFilterRange([0, range[1]])
        }
    }

    const handleDateSelect = (date: Date) => {
        console.log(date); // native Date object
    }

    return (
        <div className="filter-bar">
            <TwoThumbInputRange
                min={0}
                max={75}
                values={props.priceFilterRange}
                onChange={handlePriceFilterChange}
                inputStyle={{width: "200px;"}}
            />
            {
                //TODO distance can only set upper thumb (hide lower thumb if poss)
            }
            <TwoThumbInputRange
                min={0}
                max={15}
                values={props.distanceFilterRange}
                onChange={handleDistanceFilterChange}
                inputStyle={{width: "200px;"}}
            />
            <TwoThumbInputRange
                min={10}
                max={500}
                values={props.areaFilterRange}
                onChange={handleAreaFilterChange}
                inputStyle={{width: "200px;"}}
            />


            <div className="date-range-wrapper">
                <DateRange
                    editableDateInputs={true}
                    onChange={item => props.setDateFilterRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={props.dateFilterRange}
                    minDate={new Date()}
                />
            </div>

        </div>
    );
}

export default FilterBar;