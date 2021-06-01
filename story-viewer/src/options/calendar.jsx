import DatePicker from "react-datepicker";
import {parseDate, formatDate, mostrecent, firstDate} from "../utils"
import "react-datepicker/dist/react-datepicker.css";

const Calendar = (props) => {
    return (
        <DatePicker
            selected={parseDate(props.date)}
            onChange={date => props.setDate(formatDate(date))}
            maxDate={mostrecent}
            minDate={firstDate}
        />
    );
};

export default Calendar