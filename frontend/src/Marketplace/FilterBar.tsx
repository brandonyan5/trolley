import React, {ChangeEvent, useState} from 'react';
import {TwoThumbInputRange} from "react-two-thumb-input-range";
import "./FilterBar.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from "react-date-range";
import {getMonthDate} from "../SharedComponents/UtilFunctions";
import FilterWeight from "./FilterWeight";

interface FilterBarProps {
    priceFilterRange: [number, number]
    areaFilterRange: [number, number]
    distanceFilterRange: [number, number] // filter for distances below the max tolerable distance
    dateFilterRange: any
    setPriceFilterRange: any
    setAreaFilterRange: any
    setDistanceFilterRange: any
    setDateFilterRange: any
    filterWeights: [number, number, number]
    setFilterWeights: any
}

function FilterBar(props: FilterBarProps) {
    const filterNames = ["Price", "Distance from me", "Storage area"]

    const handlePriceFilterChange = (range: [number, number]) => {
        // do not allow for max/min prices under $1 range
        if (range[0]  < range[1]) {
            props.setPriceFilterRange(range)
        }
    }

    const handleAreaFilterChange = (range: [number, number]) => {
        // do not allow for area values closer than 5 sqft
        if (range[0] + 5 < range[1]) {
            props.setAreaFilterRange(range)
        }
    }

    const handleDistanceFilterChange = (range: [number, number]) => {
        // only allow the max distance to change (i.e. upper thumb of slider)
        // Max distance must be >= 1 mile
        if (range[1] > 0) {
            props.setDistanceFilterRange([0, range[1]])
        }
    }

    const handleDateSelect = (date: Date) => {
        console.log(date); // native Date object

        //TODO: hide dateRange on select after updating state
    }

    const [showDateRangePicker, setShowDateRangePicker] = useState<boolean>(false);
    const toggleDateRange = () => {
        console.log("toggling date range")
        // TODO toggle visibility of date range picker
        setShowDateRangePicker(!showDateRangePicker)
    }

    const toggleFilterWeights = () => {
        // TODO
        console.log("toggling filter weights")
    }

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>, weightID: number) => {
        const newFilterVals = [...props.filterWeights]
        // set price weight
        newFilterVals[weightID] = parseInt(e.target.value)
        props.setFilterWeights(newFilterVals)
        console.log(props.filterWeights)
    }


    return (
        <div className="filter-bar">
            <TwoThumbInputRange
                min={0}
                max={10}
                values={props.priceFilterRange}
                onChange={handlePriceFilterChange}
                inputStyle={{width: "200px;"}}
            />
            <TwoThumbInputRange
                min={0}
                max={5}
                values={props.distanceFilterRange}
                onChange={handleDistanceFilterChange}
                inputStyle={{width: "200px;"}}
            />
            <TwoThumbInputRange
                min={5}
                max={200}
                values={props.areaFilterRange}
                onChange={handleAreaFilterChange}
                inputStyle={{width: "200px;"}}
            />


            <div className="date-range-preview" onClick={toggleDateRange}>
                <p>{getMonthDate(props.dateFilterRange[0].startDate)}</p>
                <div className="date-range-preview-midbar"></div>
                <p>{getMonthDate(props.dateFilterRange[0].endDate)}</p>
            </div>

            <h4 onClick={toggleFilterWeights}>I care most about</h4>

            <div className="filter-weights-wrapper">
                {
                    filterNames.map((filterName, i) => (
                        <FilterWeight
                            key={i}
                            filterID={i}
                            handleWeightChange={handleWeightChange}
                            filterWeights={props.filterWeights}
                            filterName={filterNames[i]}
                        />
                    ))
                }
            </div>

            <div className="date-range-wrapper">
                {showDateRangePicker &&
                    <DateRange
                        editableDateInputs={true}
                        onChange={item => props.setDateFilterRange([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={props.dateFilterRange}
                        minDate={new Date()}
                    />
                }
            </div>

        </div>
    );
}

export default FilterBar;