import React, { useState } from "react";
import { View, Text, Button, Platform, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface DateInputProps {
    label?: string;
    value: Date;
    onChange: (date: Date) => void;
}

const CustomDateInput: React.FC<DateInputProps> = ({ label = "Select Date", value, onChange }) => {
    const [show, setShow] = useState(false);

    const handleChange = (_event: any, selectedDate?: Date) => {
        setShow(false);
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    return (
        <View style={{ marginVertical: 10 }}>
            {label && <Text style={{ fontSize: 16, marginBottom: 5 }}>{label}</Text>}

            <Pressable
                style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    backgroundColor: "#fff",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }}
                onPress={() => setShow(true)}
            >
                <Text>{value.toDateString()}</Text>
                <MaterialIcons name='alarm' size={16} color={Colors.light.tint} />
            </Pressable>

            {show && (
                <DateTimePicker
                    value={value}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    onChange={handleChange}
                />
            )}
        </View>
    );
};

export default CustomDateInput;
