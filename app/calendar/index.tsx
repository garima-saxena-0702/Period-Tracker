import React from 'react';
import { Text, View } from "react-native";
import { Calendar as RNCalendar } from 'react-native-calendars';
import { CalendarData } from '../index';

interface CalendarProps {
    lastPeriod: Date;
    calendarData: CalendarData;
    style?: object;
}

const getDateRange = (start: string, end: string, style: object) => {
    const dates: { [key: string]: object } = {};
    let current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
        const key = current.toISOString().split('T')[0];
        dates[key] = style;
        current.setDate(current.getDate() + 1);
    }
    return dates;
};

const Calendar: React.FC<CalendarProps> = ({ lastPeriod, calendarData, style }) => {
    // Format dates to YYYY-MM-DD
    const lastPeriodStr = lastPeriod.toISOString().split('T')[0];

    // Extract dates from calendarData
    const {
        lastPeriodStart,
        lastPeriodEnd,
        nextPeriodStart,
        nextPeriodEnd,
        fertileWindow,
        ovulationDate
    } = calendarData;

    // Mark ranges
    const lastPeriodMarks = getDateRange(
        lastPeriodStart instanceof Date ? lastPeriodStart.toISOString().split('T')[0] : lastPeriodStart,
        lastPeriodEnd instanceof Date ? lastPeriodEnd.toISOString().split('T')[0] : lastPeriodEnd,
        { marked: true, selected: true, selectedColor: '#ffcccc', dotColor: 'red' }
    );
    const nextPeriodMarks = getDateRange(
        nextPeriodStart instanceof Date ? nextPeriodStart.toISOString().split('T')[0] : nextPeriodStart,
        nextPeriodEnd instanceof Date ? nextPeriodEnd.toISOString().split('T')[0] : nextPeriodEnd,
        { marked: true, selected: true, selectedColor: '#ffcccc', dotColor: 'red' }
    );
    const fertileWindowMarks = getDateRange(
        fertileWindow.start instanceof Date ? fertileWindow.start.toISOString().split('T')[0] : fertileWindow.start,
        fertileWindow.end instanceof Date ? fertileWindow.end.toISOString().split('T')[0] : fertileWindow.end,
        { marked: true, selected: true, selectedColor: '#a8d4a8ff', dotColor: 'green' }
    );
    const ovulationDateStr = ovulationDate instanceof Date ? ovulationDate.toISOString().split('T')[0] : ovulationDate;
    const ovulationMark = {
        [ovulationDateStr]: { marked: true, selected: true, selectedColor: '#04be55ff', dotColor: 'green' }
    };

    // Merge all marks
    const markedDates = {
        ...lastPeriodMarks,
        ...nextPeriodMarks,
        ...fertileWindowMarks,
        ...ovulationMark
    };

    return (
        <View style={style}>
            <RNCalendar
                markedDates={markedDates}
            />
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ color: '#ffb6b6', marginRight: 10 }}>● Period</Text>
                <Text style={{ color: '#a8d4a8ff', marginRight: 10 }}>● Fertile Window</Text>
                <Text style={{ color: '#04be55ff' }}>● Ovulation</Text>
            </View>
            <Text style={{ marginTop: 16, fontWeight: 'bold', color: '#211f1fff' }}>
                Next period starts on: {nextPeriodStart instanceof Date ? nextPeriodStart.toISOString().split('T')[0] : nextPeriodStart}
            </Text>
        </View>
    );
};

export default Calendar;