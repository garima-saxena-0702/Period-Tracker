import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Calendar from "./calendar";
import Footer from "./footer";
import LogCycle from "./logCycle";
import NoCycleFound from "./noCycleFound";
import Title from "./title";
import { FILE_NAME } from "./utils/constants";
import { readFromFile, writeToFile } from "./utils/fileSystem";

type CycleDataType = {
  cycleDays: number;
  lastPeriod: Date;
  periodDuration: number;
  isCycleLogged: boolean;
  lastPeriodStart: Date;
  lastPeriodEnd: Date;
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  ovulationDate: Date;
  fertileWindow: {
    start: Date;
    end: Date;
  };
};

export type CalendarData = {
  lastPeriodStart: Date;
  lastPeriodEnd: Date;
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  ovulationDate: Date;
  fertileWindow: {
    start: Date;
    end: Date;
  };
}

export default function Index() {
  const [cycleDays, setCycleDays] = useState<number>(28);
  const [periodDuration, setPeriodDuration] = useState<number>(5);
  const [lastPeriod, setLastPeriod] = useState<Date>(new Date('2024-06-01'));
  const [isCycleLogged, setIsCycleLogged] = useState<boolean>(false);
  const [showLogCycle, setShowLogCycle] = useState(false);
  const [calendarData, setCalendarData] = useState<CalendarData>({
    lastPeriodStart: new Date(),
    lastPeriodEnd: new Date(),
    nextPeriodStart: new Date(),
    nextPeriodEnd: new Date(),
    ovulationDate: new Date(),
    fertileWindow: {
      start: new Date(),
      end: new Date(),
    },
  });

  useEffect(() => { 
    const loadInitialData = async () => {
      const fileContent = await readFromFile(FILE_NAME);
      if (fileContent) {
        const content = JSON.parse(fileContent);
        setCycleDays(content.cycleDays);
        setLastPeriod(new Date(content.lastPeriod));
        setPeriodDuration(content.periodDuration);
        setIsCycleLogged(content.isCycleLogged);
        setCalendarData({
          lastPeriodStart: new Date(content.lastPeriodStart),
          lastPeriodEnd: new Date(content.lastPeriodEnd),
          nextPeriodStart: new Date(content.nextPeriodStart),
          nextPeriodEnd: new Date(content.nextPeriodEnd),
          ovulationDate: new Date(content.ovulationDate),
          fertileWindow: {
            start: new Date(content.fertileWindow.start),
            end: new Date(content.fertileWindow.end),
          },
        } as CalendarData);

      }
    };
    loadInitialData();
  }, []);

  const handleSaveData = async (dataToSave: CycleDataType) => {
    const success = await writeToFile(FILE_NAME, JSON.stringify(dataToSave));
    if (success) {
      setCycleDays(dataToSave.cycleDays);
      setLastPeriod(dataToSave.lastPeriod);
      setIsCycleLogged(dataToSave.isCycleLogged);
      setPeriodDuration(dataToSave.periodDuration);
      setShowLogCycle(false);
      setCalendarData({
        lastPeriodStart: dataToSave.lastPeriodStart,
        lastPeriodEnd: dataToSave.lastPeriodEnd,
        nextPeriodStart: dataToSave.nextPeriodStart,
        nextPeriodEnd: dataToSave.nextPeriodEnd,
        ovulationDate: dataToSave.ovulationDate,
        fertileWindow: {
          start: dataToSave.fertileWindow.start,
          end: dataToSave.fertileWindow.end,
        },
      } as CalendarData)
    } else {
      alert('Failed to save data.');
    }
  };

  // Handler to update cycle data from LogCycle
  const handleLogCycleSubmit = (data: CycleDataType) => {
    handleSaveData(data);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Title text="Welcome to Period Tracker" /> 

      <View
        style={{
          height: "100%",
          marginTop: "25%",
          width: "100%",
          display: "flex",
          padding: 10
        }}
      >
        <View style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Calendar</Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#ff69b4",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
            }}
            onPress={() => setShowLogCycle(true)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Log</Text>
          </TouchableOpacity>
        </View>

        {isCycleLogged ? (
          <Calendar
            lastPeriod={lastPeriod}
            calendarData={calendarData}
          />
        ) : (
          <NoCycleFound />
        )}
      </View>

      {showLogCycle && (
        <LogCycle
          cycleDays={cycleDays}
          periodDuration={periodDuration}
          onSubmit={handleLogCycleSubmit}
        />
      )}

      <Footer text="Track your periods and ovulation easily!" />
    </View>
  );
}