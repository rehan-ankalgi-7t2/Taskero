import { View, Text, StyleSheet, Button, TouchableHighlight } from 'react-native'
import React from 'react'
import { Pressable, ScrollView } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';

const CustomVerticleTimeline = () => {
    const tasks = [
        { id: "1", title: "Wakeup", time: "7:00 AM", description: "Early wakeup from bed and fresh", color: "#E0E0E0" },
        { id: "2", title: "Morning Exercise", time: "8:00 AM", description: "4 types of exercise", color: "#E0E0E0" },
        { id: "3", title: "Meeting", time: "9:00 AM", description: "Zoom call, discuss team tasks", color: "#7D5FFF", highlighted: true },
        { id: "4", title: "Breakfast", time: "10:00 AM", description: "Morning breakfast with bread & tea", color: "#E0E0E0" },
        { id: "5", title: "Pray Zuhr", time: "1:30 PM", description: "Pray Zuhr", color: "#E0E0E0" },
        { id: "6", title: "Lunch Time", time: "2:00 PM", description: "", color: "#E0E0E0" },
        { id: "7", title: "Pray Asr", time: "5:00 PM", description: "", color: "#E0E0E0" },
        { id: "8", title: "Pray Maghrib", time: "5:00 PM", description: "", color: "#E0E0E0" },
        { id: "9", title: "Pray Isha", time: "5:00 PM", description: "", color: "#E0E0E0" },
    ];
  return (
    <View>
        <ScrollView contentContainerStyle={styles.timeline}>
            {tasks.map((task, index) => (
                <View key={task.id} style={styles.timelineItem}>
                    {/* Task Card */}
                    <View style={[{height: 12, width: 12, marginRight: 16, backgroundColor: '#ccc', borderRadius: 100},
                        task.highlighted && { backgroundColor: Colors.light.tint }
                    ]} >
                    </View>
                    <View style={[styles.taskCard, task.highlighted && {backgroundColor: Colors.light.tint}]}>
                        <Text style={[styles.taskTitle, task.highlighted && {color: 'white'}]}>{task.title}</Text>
                        <Text style={[styles.taskTime, task.highlighted && { color: 'white' }]}>{task.time}</Text>
                        <Text style={[styles.taskDesc, task.highlighted && { color: 'white' }]}>{task.description}</Text>
                        {task.highlighted &&
                            <TouchableHighlight
                                onPress={() => {}}
                                underlayColor="#0004"
                                style={{
                                    paddingHorizontal: 12,
                                    paddingVertical: 8,
                                    borderRadius: 8,
                                    marginLeft: 'auto',
                                    backgroundColor: 'white'
                                }}>
                                <View style={{ display: 'flex', alignItems: 'center', gap: 4, flexDirection: 'row' }}>
                                    <Text style={{fontWeight: 'medium'}}>join meeting</Text>
                                </View>
                            </TouchableHighlight>
                        }
                    </View>
                </View>
            ))}
        </ScrollView>       
    </View>
  )
}

const styles = StyleSheet.create({
    timeline: {
        paddingVertical: 16,
        paddingHorizontal: 0,
        paddingBottom: 180
    },
    timelineItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    timelineLine: {
        alignItems: "center",
        width: 40,
    },
    timelineCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#7D5FFF",
    },
    timelineConnector: {
        width: 2,
        height: 100,
        backgroundColor: "#ccc",
    },
    taskCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#E0E0E0",
    },
    highlightedTask: {
        backgroundColor: "#7D5FFF",
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    taskTime: {
        fontSize: 14,
        color: "#666",
    },
    taskDesc: {
        fontSize: 12,
        color: "#888",
    },
    fab: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        backgroundColor: "#7D5FFF",
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    },
});

export default CustomVerticleTimeline