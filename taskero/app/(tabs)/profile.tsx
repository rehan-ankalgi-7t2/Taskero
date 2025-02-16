import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { View, Text, Button } from 'react-native';
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';

export default function ProfileScreen() {
    return (
        <GestureHandlerRootView style={{ flex: 1, marginInline: 16, paddingTop: 48, paddingBottom: 16 }}>
            <View>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                }}>Profile</Text>
            </View>
            <Link href={'/login'} style={{width: 'auto', height: 40, backgroundColor: Colors.light.tint, borderRadius: 8, marginTop: 16, textAlign: 'center', lineHeight: 40}}>
                <Text style={{color: 'white'}}>Log out</Text>
            </Link>
        </GestureHandlerRootView>
    );
}