import React, { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import dayjs from "dayjs";
import { Colors } from "@/constants/Colors";

const generateDates = (days: number | undefined = 7) => {
    return Array.from({ length: days }, (_, i) => {
        const date = dayjs().add(i, "day");
        return {
            fullDate: date.format("YYYY-MM-DD"),
            displayDate: date.format("DD"),
            day: date.format("ddd"),
        };
    });
};

interface ICustomDateSliderProps {
    onSelect: (date: string) => void;
    dateLimit?: number;
}

const CustomDateSlider: React.FC<ICustomDateSliderProps> = ({ onSelect, dateLimit }) => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const dates = generateDates(dateLimit); // Next 7 days

    const handleDatePress = (date: string) => {
        setSelectedDate(date);
        onSelect(date);
    };

    return (
        <View style={styles.container}>
            <FlatList
                horizontal
                data={dates}
                keyExtractor={(item) => item.fullDate}
                contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Pressable
                        style={[styles.dateBox, selectedDate === item.fullDate && styles.selectedDate]}
                        onPress={() => handleDatePress(item.fullDate)}
                    >
                        <Text style={[styles.day, selectedDate === item.fullDate && {color: Colors.light.tint}]}>
                            {item.day}
                        </Text>
                        <Text style={[styles.date, selectedDate === item.fullDate && { color: Colors.light.tint }]}>
                            {item.displayDate}
                        </Text>
                        {selectedDate === item.fullDate && 
                            <View style={[
                                { height: 6, width: 6, borderRadius: '100%', backgroundColor: Colors.light.tint, marginTop: 6 }
                            ]}></View>
                        }
                    </Pressable>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        alignItems: "center",
    },
    list: {
        paddingHorizontal: 0,
    },
    dateBox: {
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 8,
        width: 52,
        borderRadius: 8,
        // borderWidth: 1,
        // borderColor: "#aaa",
        marginHorizontal: 4,
        // backgroundColor: "#1E1E2E", // Dark background
    },
    selectedDate: {
        // backgroundColor: "#7D5FFF",
        // borderColor: "#7D5FFF",
    },
    day: {
        fontSize: 16,
        color: "#aaa",
    },
    date: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#aaa",
    },
});


export default CustomDateSlider;
