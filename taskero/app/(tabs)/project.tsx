import CustomProgressBar from '@/components/ui/customProgressBar';
import { Colors } from '@/constants/Colors';
import { useGetAllProjectsQuery } from '@/services/projectApis';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, Button, TouchableOpacity, Pressable } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

export default function ProjectScreen() {
const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { data, error, isLoading, refetch } = useGetAllProjectsQuery({
    page,
    pageSize,
    search,
    sortBy,
  })

    return (
        <GestureHandlerRootView style={{ flex: 1, marginHorizontal: 16, paddingTop: 48, paddingBottom: 16 }}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 24
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

            <ScrollView contentContainerStyle={{
                // paddingHorizontal: 16,
                paddingBottom: 180
            }}>
                {data?.data?.map((item, index) => (
                    <Pressable key={index} onPress={() => { }}>
                        <View
                            style={{
                                width: 'auto',
                                borderRadius: 16,
                                padding: 16,
                                backgroundColor: Colors.light.tint,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: '#000',
                                borderWidth: 1,
                                marginBottom: 16,
                                marginRight: index === Array.isArray(data?.data) && data?.data?.length - 1 ? 16 : 0,
                            }}>
                            <View style={{ width: '100%', marginLeft: 8, gap: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{
                                    width: "100%",
                                    paddingRight: 16
                                }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: "white" }}>{item.title}</Text>
                                    {item.description ?
                                        <Text style={{ fontWeight: 'normal', fontSize: 12, color: 'white'}}>{item.description}</Text> : ''
                                    }
                                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: 24 }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Progress</Text>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{Math.round(Math.random() * 100)}%</Text>
                                    </View>
                                    <CustomProgressBar progress={parseFloat(Math.random().toFixed(1))} color="white" backgroundColor="#fff4" />
                                </View>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </GestureHandlerRootView>
    );
}