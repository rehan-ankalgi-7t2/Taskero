import { View, Text, ScrollView, ActivityIndicator, Image } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useGetTodoDetailsQuery } from "@/services/todosApi";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Chip from "@/components/ui/Chip";
import { todoStatusColors } from "@/constants/utilConstants";
import { MaterialIcons } from "@expo/vector-icons";
import CustomTabs from "@/components/ui/CustomTabs";

export default function TodoDetailsScreen() {
    const navigation = useNavigation();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('');
    const { id } = useLocalSearchParams();
    const {data, isLoading, error } = useGetTodoDetailsQuery({
        todoId: id.toString(),
        queryParams: { page, pageSize, search, sortBy }
    });
    let date = new Date();

    const setStatusColor = (status: keyof typeof todoStatusColors) => {
        if (Object.keys(todoStatusColors).includes(status)) {
            return todoStatusColors[status as keyof typeof todoStatusColors]
        } else {
            return Colors.light.tint;
        }
    }

    const tabItems = [
        { key: "1", label: "Checklist", content: <Text>Content of Tab 1</Text>, icon: <MaterialIcons name="checklist" size={24} color={Colors.light.tint} /> },
        { key: "2", label: "Comments", content: <Text>Content of Tab 2</Text>, icon: <MaterialIcons name="comment" size={24} color={Colors.light.tint} /> },
        { key: "3", label: "Attachments", content: <Text>Content of Tab 3</Text>, icon: <MaterialIcons name="attachment" size={24} color={Colors.light.tint} /> },
    ];

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <ScrollView style={{padding: 16}}>
                {data && 
                <View>
                    <Breadcrumb 
                            items={[
                                { title: "Home", onPress: () => router.push("/") },
                                { title: 'Todo' },
                                { title: id.toString() }
                            ]} />
                        <Chip label={data?.data?.status.toString()} variant="filled" color={setStatusColor(data?.data?.status.toString())}/>
                    <Text style={{fontSize: 24}}>{data?.data?.title}</Text>
                    <Text style={{marginTop: 16, height: 120, opacity: 0.4}}>{data?.data?.description}</Text>
                    <View style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexDirection: 'row', marginTop: 16}}>
                        <View >
                            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Assigned To:</Text>
                            <Image source={require('@/assets/images/pfp.png')} style={{ height: 32, width: 32, borderRadius: 40}} />
                        </View>
                        <View style={{display: 'flex', alignItems: 'center', gap: 4, flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#ddd', borderRadius: 4}}>
                            <MaterialIcons name='alarm' size={16} color="black" />
                            <Text>Deadline:</Text>
                            <Text style={{fontWeight: 'bold'}}>{date.toUTCString().split(" ").splice(0, 4, "").join(" ")}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, marginTop: 16 }}>
                        <CustomTabs tabs={tabItems} defaultActiveKey="1" />
                    </View>
                    </View>}
                {isLoading && 
                    <View style={{ height: 440 }}>
                        <ActivityIndicator size="large" color={Colors.light.tint} />
                    </View>
                }
                {error && <View style={{ height: 440, display: 'flex', alignItems: 'center' }}>
                      <Image source={require('@/assets/images/404.png')} style={{width: 240, height: 240}}/>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Error Fetching Todo Data!</Text>
                      </View>}
            </ScrollView>
        </GestureHandlerRootView>
    );
}