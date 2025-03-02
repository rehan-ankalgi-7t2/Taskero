import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ProjectScreen() {
    return (
        <GestureHandlerRootView style={{ flex: 1, marginHorizontal: 16, paddingTop: 48, paddingBottom: 16 }}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
            }}>
                <Text style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                }}>Projects</Text>
                <TouchableOpacity style={{
                    backgroundColor: Colors.light.tint,
                    padding: 8,
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: 80,
                }}
                    onPress={() => router.push('/create-project')}>
                        <Text style={{color: "white", fontSize: 14, fontWeight: 600, lineHeight: 16}}>create</Text>
                    <Ionicons name="add" size={18} color="white" />
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}