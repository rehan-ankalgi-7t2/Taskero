import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { View, Text, Button, Image } from 'react-native';
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';

export default function ProfileScreen() {
    const profileImage = true;
    return (
        <GestureHandlerRootView style={{ flex: 1, marginInline: 16, paddingTop: 48, paddingBottom: 16 }}>
            <View>
                <Text style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                }}>Profile</Text>
            </View>
            <View style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 40
            }}>
                {profileImage ? (
                    <Image
                    style={{
                        height: 80,
                        width: 80,
                        borderRadius: 40
                    }}
                     source={{
                        uri: 'https://avatars.githubusercontent.com/u/58500338?v=4'
                    }}/>
                ) : (
                    <View style={{backgroundImage: `linear-gradient(${Colors.light.tint}, ${Colors.light.text})`, width: 100, aspectRatio: 1, borderRadius: "50%"}}></View>
                )}
                <Text style={{fontSize: 24}}>Rehan Ankalgi</Text>
            </View>

            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 24 }}>Account Settings</Text>
            <Link href={'/(tabs)/profile'} style={{ borderBottomColor: "#0002", borderBottomWidth: 1, paddingVertical: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row", width: "auto" }}>
                    <View style={{width: "100%", flex: 1, display: "flex", alignItems: "center", gap: 16, flexDirection: "row"}}>
                        <MaterialIcons name="person-outline" size={24} color="black" />
                        <Text style={{fontSize: 16}}>Edit Profile</Text>
                    </View>
                    <View style={{alignSelf: 'flex-end'}}>
                        <MaterialIcons name="chevron-right" size={24} color="black" />
                    </View>
            </Link>
            <Link href={'/(tabs)/profile'} style={{ borderBottomColor: "#0002", borderBottomWidth: 1, paddingVertical: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row", width: "auto" }}>
                    <View style={{width: "100%", flex: 1, display: "flex", alignItems: "center", gap: 16, flexDirection: "row"}}>
                    <MaterialIcons name="password" size={24} color="black" />
                        <Text style={{fontSize: 16}}>Change Password</Text>
                    </View>
                    <View style={{alignSelf: 'flex-end'}}>
                        <MaterialIcons name="chevron-right" size={24} color="black" />
                    </View>
            </Link>
            <Link href={'/(tabs)/profile'} style={{ borderBottomColor: "#0002", borderBottomWidth: 1, paddingVertical: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row", width: "auto" }}>
                    <View style={{width: "100%", flex: 1, display: "flex", alignItems: "center", gap: 16, flexDirection: "row"}}>
                    <MaterialIcons name="privacy-tip" size={24} color="black" />
                        <Text style={{fontSize: 16}}>Security & Privacy</Text>
                    </View>
                    <View style={{alignSelf: 'flex-end'}}>
                        <MaterialIcons name="chevron-right" size={24} color="black" />
                    </View>
            </Link>
            <Link href={'/(tabs)/profile'} style={{ borderBottomColor: "#0001", paddingVertical: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row", width: "auto" }}>
                    <View style={{width: "100%", flex: 1, display: "flex", alignItems: "center", gap: 16, flexDirection: "row"}}>
                    <MaterialIcons name="language" size={24} color="black" />
                        <Text style={{fontSize: 16}}>Languages</Text>
                    </View>
                    <View style={{alignSelf: 'flex-end'}}>
                        <MaterialIcons name="chevron-right" size={24} color="black" />
                    </View>
            </Link>
            
            <Text style={{fontWeight: "bold", fontSize: 18, marginVertical: 24}}>Support</Text>
            <Link href={'/(tabs)/profile'} style={{ borderBottomColor: "#0002", borderBottomWidth: 1, paddingVertical: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row", width: "auto" }}>
                <View style={{ width: "100%", flex: 1, display: "flex", alignItems: "center", gap: 16, flexDirection: "row" }}>
                    <MaterialIcons name="help-outline" size={24} color="black" />
                    <Text style={{ fontSize: 16 }}>Help Center</Text>
                </View>
                <View style={{ alignSelf: 'flex-end' }}>
                    <MaterialIcons name="chevron-right" size={24} color="black" />
                </View>
            </Link>
            {/* <Link href={'/(tabs)/profile'}>
                <View>
                    <View>
                        <Text>Change Password</Text>
                    </View>
                    <View></View>
                </View>
            </Link>
            <Link href={'/(tabs)/profile'}>
                <View>
                    <View>
                        <Text>Security</Text>
                    </View>
                    <View></View>
                </View>
            </Link>
            <Link href={'/(tabs)/profile'}>
                <View>
                    <View>
                        <Text>Languages</Text>
                    </View>
                    <View></View>
                </View>
            </Link>
            <Link href={'/(tabs)/profile'}>
                <View>
                    <View>
                        <Text>Payment Methods</Text>
                    </View>
                    <View></View>
                </View>
            </Link>
            <Link href={'/(tabs)/profile'}>
                <View>
                    <View>
                        <Text>Subscription</Text>
                    </View>
                    <View></View>
                </View>
            </Link> */}
            <Link href={'/login'} style={{width: 'auto', height: 40, backgroundColor: Colors.light.tint, borderRadius: 8, marginTop: 16, textAlign: 'center', lineHeight: 40}}>
                <Text style={{color: 'white'}}>Log out</Text>
            </Link>
        </GestureHandlerRootView>
    );
}