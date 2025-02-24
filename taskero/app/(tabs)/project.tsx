import { View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ProjectScreen() {
    return (
        <GestureHandlerRootView style={{ flex: 1, marginHorizontal: 16, paddingTop: 48, paddingBottom: 16 }}>
            <View>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                }}>Projects</Text>
            </View>
        </GestureHandlerRootView>
    );
}