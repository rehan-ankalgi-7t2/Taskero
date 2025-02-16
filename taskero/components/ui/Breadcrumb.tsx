import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons"; // Chevron icon

interface BreadcrumbItem {
    title: string | JSX.Element;
    onPress?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {items.map((item, index) => (
                <View key={index} style={styles.breadcrumbItem}>
                    {index !== 0 && <Feather name="chevron-right" size={16} color="gray" />}
                    {typeof item.title === "string" ? (
                        <TouchableOpacity onPress={item.onPress} disabled={!item.onPress}>
                            <Text style={[styles.breadcrumbText, !item.onPress && styles.disabled]}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        item.title
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: 16,
    },
    breadcrumbItem: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 4,
        gap: 4,
    },
    breadcrumbText: {
        fontSize: 14,
        color: "#007BFF",
    },
    disabled: {
        color: "gray",
    },
});

export default Breadcrumb;
