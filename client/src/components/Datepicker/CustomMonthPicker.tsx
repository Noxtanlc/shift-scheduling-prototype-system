import '@mantine/dates/styles.css';
import { MonthPickerInput } from '@mantine/dates';
import dayjs from 'dayjs';

export default function CustomMonthPicker ({...props}) {
    const date = dayjs().toDate();

    return (
        <MonthPickerInput
        size='sm'
        valueFormat="MMM YYYY"
        label="Select Month/Year"
        defaultDate={date}
        value={props.value}
        onChange={props.onValueChange}
    />
    )
}
