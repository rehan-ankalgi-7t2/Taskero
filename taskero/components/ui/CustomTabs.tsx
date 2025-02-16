import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

interface Tab {
    key: string;
    label: string;
    icon: React.ReactNode;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultActiveKey?: string;
    onChange?: (key: string) => void;
}

const CustomTabs: React.FC<TabsProps> = ({ tabs, defaultActiveKey, onChange}) => {
    const [activeTab, setActiveTab] = useState(defaultActiveKey || tabs[0]?.key);

    const handleTabPress = (key: string) => {
        setActiveTab(key);
        if (onChange) onChange(key);
    };

    return (
        <View style={styles.container}>
            {/* Tab Headers */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                        onPress={() => handleTabPress(tab.key)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                            {tab.label}
                        </Text>
                        {tab.icon && tab.icon}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Tab Content */}
            <View style={styles.contentContainer}>
                {tabs.map((tab) => activeTab === tab.key && <View key={tab.key}>{tab.content}</View>)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: "row",
        // backgroundColor: "#F5F5F5",
        paddingVertical: 10,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderColor: "transparent",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    activeTab: {
        borderColor: Colors.light.tint,
    },
    tabText: {
        fontSize: 16,
        color: "#333",
    },
    activeTabText: {
        fontWeight: "bold",
        color: Colors.light.tint,
    },
    contentContainer: {
        padding: 16,
    },
});

export default CustomTabs;
