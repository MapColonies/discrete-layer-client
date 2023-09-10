import React from "react";
import { Box, DateRangePicker } from "@map-colonies/react-components";

import './catalog-filter-panel.css';

interface CatalogFilterPanelProps {
    isOpen: boolean;
}
/**
 * Use react-hook-forms with Yup schemas for validation.
 * - Use a declarative approach to configure the type, form control and validation for each "filterable" field. (Yup schemas)
 * - Create dynamic filter forms by the current catalog search entity(ies) type.
 * - Apply the selected filters to the store and re-fetch the search query (And its dependencies)
 * - Mark the filter icon as the current active filter
 * - Reset everything to the normal filters on clean, and un-mark the icon
 */
export const CatalogFilterPanel: React.FC<CatalogFilterPanelProps> = ({ isOpen }) => {
    return <Box className={`catalogFilterPanelContainer ${isOpen ? 'open' : 'close'}`}>
        <Box className='catalogFilterFormContainer'>
            <form className="catalogFiltersForm" id={'catalogFiltersForm'}>
               {/* <CatalogFilterFormFields /> */}
               <DateRangePicker
                    wrapperClassName="wrapper"
                    calendarClassName="calendar"
                    popperClassName="popper"
                    dayClassName={() => 'day'}
                    monthClassName={() => 'month'}
                    shouldCloseOnSelect={false}
                    selectsRange
                    locale="en"
                    autoFocus={false}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Pick date and time range"
                    maxDate={new Date()}
                    withShortcuts={[
                        {id: "1", label: 'היום', startDate: new Date(), endDate: new Date()},
                    ]}
                    onChange={(x)=>{
                        console.log(x)
                    }}
                    isClearable
                    showMonthYearDropdown
                    dateFormatCalendar="MMMM"
                />
            </form>
        </Box>
    </Box>
}