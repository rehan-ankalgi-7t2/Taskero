import CustomDateSlider from "@/components/ui/CustomDateSlider";
import CustomVerticleTimeline from "@/components/ui/CustomVerticleTimeline";
import React, { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    return (
        <GestureHandlerRootView style={{flex: 1, paddingTop: 48, marginInline: 16}}>
            <Text style={{fontWeight: 'medium', opacity: 0.4}}>{new Date().toUTCString().split(" ").splice(0, 4, "").join(" ")}</Text>
            <Text style={{fontSize: 32, fontWeight: 'bold'}}>Today</Text>
            <CustomDateSlider onSelect={(date) => setSelectedDate(date)} />
            <CustomVerticleTimeline/>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212", // Dark background
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 20,
    },
    selectedText: {
        fontSize: 16,
        color: "#ccc",
        marginTop: 10,
    },
});