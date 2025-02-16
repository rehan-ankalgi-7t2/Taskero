import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface ChipProps {
    label: string;
    onPress?: () => void;
    onClose?: () => void;
    icon?: keyof typeof Feather.glyphMap;
    variant?: "default" | "outlined" | "filled";
    color?: string;
}

const Chip: React.FC<ChipProps> = ({ label, onPress, onClose, icon, variant = "default", color }) => {
    return (
        <TouchableOpacity
            style={[
                {
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 20,
                    backgroundColor: "#F0F0F0",
                    marginRight: 8,
                    marginBottom: 8,
                    alignSelf: "flex-start",
                },
                variant === "outlined" && {
                    borderWidth: 1,
                    borderColor: color || Colors.light.tint,
                    backgroundColor: "transparent",
                },
                variant === "filled" && {
                    backgroundColor: color || Colors.light.tint,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {icon && <Feather name={icon} size={16} style={styles.icon} />}
            <Text
                style={[
                    styles.label,
                    variant === "outlined" && styles.outlinedText,
                    variant === "filled" && styles.filledText,
                ]}
            >
                {label}
            </Text>
            {onClose && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Feather name="x" size={16} color="gray" />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "#F0F0F0",
        marginRight: 8,
        marginBottom: 8,
        alignSelf: "flex-start",
    },
    outlined: {
        borderWidth: 1,
        borderColor: Colors.light.tint,
        backgroundColor: "transparent",
    },
    filled: {
        backgroundColor: Colors.light.tint,
    },
    label: {
        fontSize: 14,
        color: "#333",
    },
    outlinedText: {
        color: Colors.light.tint,
    },
    filledText: {
        color: "#FFF",
    },
    icon: {
        marginRight: 6,
        color: "gray",
    },
    closeButton: {
        marginLeft: 8,
    },
});

export default Chip;
