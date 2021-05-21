import DatePicker from "react-datepicker";
import {parseDate, formatDate} from "../utils"
import "react-datepicker/dist/react-datepicker.css";

const Calendar = (props) => {
    return (
        <DatePicker selected={parseDate(props.date)} onChange={date => props.setDate(formatDate(date))} />
    );
};

export default Calendar