import { Image, StyleSheet, Platform, View, Text, Pressable, Button, ActivityIndicator, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FlatList, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { useGetAllTodoQuery } from '@/services/todosApi';
import { Colors } from '@/constants/Colors';
import { Link, router, useNavigation } from 'expo-router';
import { navigate } from 'expo-router/build/global-state/routing';
import { todoStatusColors } from '@/constants/utilConstants';

export default function HomeScreen() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { data, error, isLoading, refetch } = useGetAllTodoQuery({
    page,
    pageSize,
    search,
    sortBy,
  })

  const statusData = [
    {
      id: '1',
      title: 'Ongoing',
      count: 24,
      color: todoStatusColors.inprogress,
      icon: 'repeat'
    },
    {
      id: '2',
      title: 'Completed',
      count: 24,
      color: todoStatusColors.completed,
      icon: 'check-circle-outline'
    },
    {
      id: '3',
      title: 'Overdue',
      count: 24,
      color: todoStatusColors.drop,
      icon: 'access-time'
    },
    {
      id: '4',
      title: 'Upcoming',
      count: Array.isArray(data?.data) ? data?.data?.filter(task => task.status === "todo").length : 0,
      color: todoStatusColors.todo,
      icon: 'navigate-next'
    }
  ]

  const setStatusColor = (status: keyof typeof todoStatusColors) => {
    if(Object.keys(todoStatusColors).includes(status)){
      return todoStatusColors[status as keyof typeof todoStatusColors]
    } else {
      return Colors.light.tint;
    }
  }

  return (
    <GestureHandlerRootView style={{flex: 1, paddingTop: 48, marginInline: 16}}>
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse'}}>
          <Image source={require('@/assets/images/pfp.png')} style={{height: 40, width: 40, borderRadius: 40}} />
          <View>
            <Text style={{
              fontSize: 32,
              fontWeight: 'bold',
            }}>Hi Rehan</Text>
            <Text style={{opacity: 0.5}}>
              Your daily adventure starts now
            </Text>
        </View>
        </View>
        <FlatList
        style={{marginVertical: 16}}
          data={statusData}
          keyExtractor={(item) => item.id}
          numColumns={2} // Set 2 columns
          renderItem={({ item }) => (
            <View style={{
              flex: 1, // Ensures it takes equal width
              borderRadius: 16,
              padding: 16,
              backgroundColor: item.color,
              flexDirection: 'row',
              alignItems: 'center',
              margin: 6, // Adds spacing between items
              // boxShadow: `0px 8px 24px ${item.color}cc`
            }}>
              <MaterialIcons name={item.icon as keyof typeof MaterialIcons.glyphMap} size={24} color="white" style={{ padding: 8, backgroundColor: '#0002', borderRadius: 40 }} />
              <View style={{ marginLeft: 8 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' }}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: 'white' }}>{item.count} tasks</Text>
              </View>
            </View>
          )}
        />

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>Recent Tasks</Text>
        <TouchableHighlight 
          onPress={refetch}
          underlayColor="#0004"
          style={{
            padding: 8,
            borderRadius: 8,
          }}>
            <View style={{display: 'flex', alignItems: 'center', gap: 4, flexDirection: 'row'}}>
              <Text>Refresh</Text>
              <MaterialIcons name="loop" size={16} color="black" />
            </View>
          </TouchableHighlight>
        </View>

    {data && (
      <ScrollView style={{ height: 'auto', paddingBottom: 24}}>
        {Array.isArray(data?.data) && data?.data?.map(item => (
          <Pressable key={item._id} onPress={() => router.push({ pathname: "/todo/[id]", params: { id: item._id } })}>
            <View 
            style={{
              flex: 1, // Ensures it takes equal width
              borderRadius: 16,
              padding: 16,
              paddingRight: 24,
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: '#0001',
              borderWidth: 1,
              marginTop: 12
            }}>
              <View style={{ width: '100%', marginLeft: 8, gap: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'black' }}>{item.title}</Text>
                  {item.description ? 
                  <Text style={{ fontWeight: 'normal', fontSize: 12, color: 'black' }}>{item.title}</Text>: ''
                  }

                </View>
                <View style={{
                  height: 8,
                  width: 8,
                  borderRadius: '100%',
                  backgroundColor: setStatusColor(item.status),
                  boxShadow: `0 0 16px 2px ${setStatusColor(item.status)}`
                  }}></View>
                {/* <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <MaterialIcons name="check-circle-outline" size={18} color="black" />
                  <Text style={{ fontSize: 12, color: 'black', fontWeight: 'bold' }}>{item.subTasks.length} Tasks</Text>
                </View> */}
              </View>
            </View>
          </Pressable>
        ))}
        </ScrollView>
    )}
    {( error && <View style={{ height: 440, display: 'flex', alignItems: 'center' }}>
      <Image source={require('@/assets/images/404.png')} style={{width: 240, height: 240}}/>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>Todos not found!</Text>
      </View>
    )}
    {
      isLoading && <View style={{ height: 440 }}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    }

      <TouchableOpacity style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: Colors.light.tint,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: Colors.light.tint,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 0,
          elevation: 10,
      }} 
      onPress={() => router.push('/create-todo')}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}
