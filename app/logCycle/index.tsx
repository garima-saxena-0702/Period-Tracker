import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Button, Modal, StyleProp, Text, TextInput, TextStyle, TouchableOpacity, View } from "react-native";

interface LogCycleProps {
    cycleDays?: number;
    periodDuration?: number;
    style?: StyleProp<TextStyle>;
    onSubmit?: (data: {
        cycleDays: number,
        periodDuration: number,
        lastPeriod: Date,
        ovulationDate: Date,
        isCycleLogged: boolean,
        lastPeriodStart: Date,
        lastPeriodEnd: Date,
        nextPeriodStart: Date,
        nextPeriodEnd: Date,
        fertileWindow: {
            start: Date,
            end: Date
        }
    }) => void;
}

// utils/periodCalculator.js

/**
 * Calculate next period dates and ovulation window
 * @param {string} lastPeriod - ISO date string "YYYY-MM-DD"
 * @param {number} cycleDays - Average cycle length (e.g. 28)
 * @param {number} periodDuration - Period duration in days (e.g. 5)
 * @returns {object} { nextPeriodStart, nextPeriodEnd, ovulationDay, fertileWindow }
 */
const calculateCycle = ({ lastPeriod, cycleDays, periodDuration }: { lastPeriod: string, cycleDays: number, periodDuration: number }) => {
    const lastDate = new Date(lastPeriod);

    // Next period start = last period start + cycle length
    const nextPeriodStart = new Date(lastDate);
    nextPeriodStart.setDate(lastDate.getDate() + cycleDays);

    // Next period end = start + duration - 1
    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodStart.getDate() + periodDuration - 1);

    // Ovulation ~ 14 days before next period
    const ovulationDate = new Date(nextPeriodStart);
    ovulationDate.setDate(nextPeriodStart.getDate() - 14);

    // Fertile window = ovulation -5 to ovulation +1
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 3);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 2);

    return {
        nextPeriodStart,
        nextPeriodEnd,
        ovulationDate,
        fertileWindow: {
            start: fertileStart,
            end: fertileEnd,
        },
    };
}

const LogCycle: React.FC<LogCycleProps> = ({ style, onSubmit, ...props }) => {
    const [modalVisible, setModalVisible] = useState(true);
    const [lastPeriod, setLastPeriod] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [cycleDays, setCycleDays] = useState<number>( props.cycleDays || 28);
    const [periodDuration, setPeriodDuration] = useState<number>(props.periodDuration || 5);

    const handleSubmit = () => {
        const cycleData = calculateCycle({ lastPeriod: lastPeriod.toISOString().split("T")[0], cycleDays, periodDuration });
        // Calculate lastPeriodEnd as lastPeriod + periodDuration - 1
        const lastPeriodEnd = new Date(lastPeriod);
        lastPeriodEnd.setDate(lastPeriod.getDate() + periodDuration - 1);

        if (onSubmit) {
            onSubmit({
                cycleDays,
                lastPeriod,
                periodDuration,
                isCycleLogged: true,
                lastPeriodStart: lastPeriod,
                lastPeriodEnd,
                ...cycleData
            });
        }
        setModalVisible(false);
    };

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.3)"
            }}>
                <View style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 20,
                    minWidth: "80%",
                    elevation: 5
                }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>Log Cycle</Text>
                    
                    <Text style={{ marginBottom: 8 }}>Last Period Date</Text>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            padding: 10,
                            borderRadius: 8,
                            marginBottom: 16
                        }}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text>{lastPeriod.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={lastPeriod}
                            mode="date"
                            display="default"
                            onChange={(_, date) => {
                                setShowDatePicker(false);
                                if (date) setLastPeriod(date);
                            }}
                        />
                    )}

                    <Text style={{ marginBottom: 8 }}>Period Duration</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            padding: 10,
                            borderRadius: 8,
                            marginBottom: 16
                        }}
                        keyboardType="number-pad"
                        value={periodDuration.toString()}
                        onChangeText={text => setPeriodDuration(Number(text))}
                    />
                    
                    <Text style={{ marginBottom: 8 }}>Cycle Days</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            padding: 10,
                            borderRadius: 8,
                            marginBottom: 16
                        }}
                        keyboardType="number-pad"
                        value={cycleDays.toString()}
                        onChangeText={text => setCycleDays(Number(text))}
                    />

                    <Button title="Submit" onPress={handleSubmit} />

                    <TouchableOpacity
                        style={{
                            marginTop: 16,
                            alignSelf: "flex-end",
                            padding: 8,
                            backgroundColor: "#eee",
                            borderRadius: 8
                        }}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default LogCycle;