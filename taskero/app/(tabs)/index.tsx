import { Image, StyleSheet, Platform, View, Text, Pressable, Button, ActivityIndicator, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FlatList, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { useGetAllTodoQuery } from '@/services/todosApi';
import { Colors } from '@/constants/Colors';
import { Link, router, useNavigation } from 'expo-router';
import { navigate } from 'expo-router/build/global-state/routing';
import { todoStatusColors } from '@/constants/utilConstants';
import CustomProgressBar from '@/components/ui/customProgressBar';

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
      color: todoStatusColors.drop,
      icon: 'repeat'
    },
    {
      id: '2',
      title: 'Completed',
      count: 24,
      color: todoStatusColors.drop,
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
      color: todoStatusColors.drop,
      icon: 'navigate-next'
    }
  ]

  const fakeProjects = [
    {
      tintColor: Colors.dark.tint,
      title: "Website Redesign",
      description: "Revamping the company website with a new UI/UX design.",
      assignedUsers: ["65c9f1a2b4a1c3d5e6789abc", "65c9f1a2b4a1c3d5e6789abd"],
      tasks: ["65c9f1a2b4a1c3d5e6789abe", "65c9f1a2b4a1c3d5e6789abf"],
      status: "In Progress",
      priority: "High",
      dueDate: new Date("2025-03-10T00:00:00.000Z"),
      createdBy: "65c9f1a2b4a1c3d5e6789ab0",
      activities: [
        {
          action: "Project Created",
          performedBy: "65c9f1a2b4a1c3d5e6789ab0",
          timestamp: new Date("2025-02-15T10:00:00.000Z"),
          details: "Initial project setup completed.",
        },
        {
          action: "User Assigned",
          performedBy: "65c9f1a2b4a1c3d5e6789ab0",
          timestamp: new Date("2025-02-16T12:30:00.000Z"),
          details: "Added John Doe and Jane Smith to the project.",
        },
      ],
    },
    {
      tintColor: Colors.dark.tint,
      title: "Mobile App Development",
      description: "Developing a cross-platform mobile app for task management.",
      assignedUsers: ["65c9f1a2b4a1c3d5e6789abe", "65c9f1a2b4a1c3d5e6789abf"],
      tasks: ["65c9f1a2b4a1c3d5e6789ac0", "65c9f1a2b4a1c3d5e6789ac1"],
      status: "Pending",
      priority: "Medium",
      dueDate: new Date("2025-04-20T00:00:00.000Z"),
      createdBy: "65c9f1a2b4a1c3d5e6789ab1",
      activities: [
        {
          action: "Project Created",
          performedBy: "65c9f1a2b4a1c3d5e6789ab1",
          timestamp: new Date("2025-02-10T14:00:00.000Z"),
          details: "Project initiated with initial discussions.",
        },
      ],
    },
    {
      tintColor: Colors.dark.tint,
      title: "Marketing Campaign",
      description: "Launching a digital marketing campaign for product promotion.",
      assignedUsers: ["65c9f1a2b4a1c3d5e6789ac2"],
      tasks: ["65c9f1a2b4a1c3d5e6789ac3"],
      status: "In Progress",
      priority: "High",
      dueDate: new Date("2025-03-15T00:00:00.000Z"),
      createdBy: "65c9f1a2b4a1c3d5e6789ab2",
      activities: [
        {
          action: "Project Created",
          performedBy: "65c9f1a2b4a1c3d5e6789ab2",
          timestamp: new Date("2025-02-12T09:30:00.000Z"),
          details: "Digital marketing strategy finalized.",
        },
        {
          action: "Task Added",
          performedBy: "65c9f1a2b4a1c3d5e6789ab2",
          timestamp: new Date("2025-02-13T11:15:00.000Z"),
          details: "Added task: Create social media ads.",
        },
      ],
    },
    {
      tintColor: Colors.dark.tint,
      title: "HR Onboarding System",
      description: "Developing an internal system for employee onboarding.",
      assignedUsers: ["65c9f1a2b4a1c3d5e6789ac4", "65c9f1a2b4a1c3d5e6789ac5"],
      tasks: ["65c9f1a2b4a1c3d5e6789ac6"],
      status: "Completed",
      priority: "Low",
      dueDate: new Date("2025-02-28T00:00:00.000Z"),
      createdBy: "65c9f1a2b4a1c3d5e6789ab3",
      activities: [
        {
          action: "Project Created",
          performedBy: "65c9f1a2b4a1c3d5e6789ab3",
          timestamp: new Date("2025-01-20T08:45:00.000Z"),
          details: "Initial planning for HR onboarding system.",
        },
        {
          action: "Task Completed",
          performedBy: "65c9f1a2b4a1c3d5e6789ac4",
          timestamp: new Date("2025-02-25T16:00:00.000Z"),
          details: "Final testing completed successfully.",
        },
      ],
    },
  ];


  const setStatusColor = (status: keyof typeof todoStatusColors) => {
    if(Object.keys(todoStatusColors).includes(status)){
      return todoStatusColors[status as keyof typeof todoStatusColors]
    } else {
      return Colors.light.tint;
    }
  }

  return (
    <GestureHandlerRootView style={{ paddingTop: 48, backgroundColor: 'white'}}>
      <ScrollView>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse', paddingHorizontal: 16 }}>
          {/* <Image source={require('@/assets/images/pfp.png')} style={{height: 40, width: 40, borderRadius: 40}} /> */}
          <TouchableHighlight 
          underlayColor={'#ccca'}
          style={{
            borderWidth: 1,
            borderColor: 'black',
            padding: 6, 
            borderRadius: 8,
            backgroundColor: 'white'
}}
          onPress={() => router.push("/notification")}
          >
            <MaterialIcons name="notifications" size={24} color="black" />
          </TouchableHighlight>
          <View>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
            }}>Hi Rehan</Text>
            <Text style={{opacity: 0.5}}>
              Your daily adventure starts now
            </Text>
        </View>
        </View>
        <FlatList
          style={{ marginVertical: 16, paddingHorizontal: 8 }}
          data={statusData}
          keyExtractor={(item) => item.id}
          numColumns={2} // Set 2 columns
          renderItem={({ item }) => (
            <View style={{
              flex: 1, // Ensures it takes equal width
              borderRadius: 16,
              padding: 16,
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              margin: 6, // Adds spacing between items
              // boxShadow: `0px 8px 24px ${item.color}cc`
              borderWidth: 1
            }}>
              <MaterialIcons name={item.icon as keyof typeof MaterialIcons.glyphMap} size={24} color={'white'} style={{ padding: 8, backgroundColor: item.color, borderRadius: 40 }} />
              <View style={{ marginLeft: 8 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
                <Text style={{ fontSize: 12 }}>{item.count} tasks</Text>
              </View>
            </View>
          )}
        />

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingHorizontal: 16
        }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Projects</Text>
            <Text style={{opacity: 0.5}}>you have 4 active projects</Text>
          </View>
          <TouchableHighlight
            onPress={refetch}
            underlayColor="white"
            style={{
              padding: 8,
              borderRadius: 8,
            }}>
            <View style={{ display: 'flex', alignItems: 'center', gap: 4, flexDirection: 'row' }}>
              {/* <Text style={{color: Colors.light.tint, fontWeight: 'bold', fontSize: 14}}>See All</Text> */}
              <MaterialIcons name="arrow-outward" size={32} color="black" />
            </View>
          </TouchableHighlight>
        </View>

        <ScrollView horizontal style={{}}>
          {fakeProjects.map((item, index) => (
            <Pressable key={index} onPress={() => {}}>
              <View
                style={{
                  width: 240,
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: item.tintColor,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: '#0001',
                  borderWidth: 1,
                  marginBottom: 12,
                  marginLeft: 16,
                  marginRight: index === fakeProjects.length - 1 ? 16 : 0,
                }}>
                <View style={{ width: '100%', marginLeft: 8, gap: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>{item.title}</Text>
                    {item.description ?
                      <Text style={{ fontWeight: 'normal', fontSize: 12, color: 'white' }}>{item.description}</Text> : ''
                    }
                    <View style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: 24}}>
                      <Text style={{color: 'white', fontWeight: 'bold'}}>Progress</Text>
                      <Text style={{color: 'white', fontWeight: 'bold'}}>72%</Text>
                    </View>
                      <CustomProgressBar progress={0.7} color="white" backgroundColor="#fff8" />
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingHorizontal: 16
        }}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>Recent Tasks</Text>
        <TouchableHighlight 
          onPress={refetch}
          underlayColor="white"
          style={{
            padding: 8,
            borderRadius: 8,
          }}>
            <View style={{display: 'flex', alignItems: 'center', gap: 4, flexDirection: 'row'}}>
              {/* <Text style={{color: Colors.light.tint, fontWeight: 'bold', fontSize: 14}}>See All</Text> */}
            <MaterialIcons name="arrow-outward" size={32} color="black" />
            </View>
          </TouchableHighlight>
        </View>

    {data && (
      <ScrollView style={{ height: 196, paddingBottom: 24, paddingHorizontal: 16}}>
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
              borderColor: 'black',
              borderWidth: 1,
              marginBottom: 12
            }}>
              <View style={{ width: '100%', marginLeft: 8, gap: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>{item.title}</Text>
                  {item.description ? 
                  <Text style={{ fontWeight: 'normal', fontSize: 12, color: 'black' }}>{item.title}</Text>: ''
                  }

                </View>
                <View style={{
                  height: 8,
                  width: 8,
                  borderRadius: '100%',
                  backgroundColor: setStatusColor(item.status as keyof typeof todoStatusColors),
                  boxShadow: `0 0 16px 2px ${setStatusColor(item.status as keyof typeof todoStatusColors)}`
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

</ScrollView>
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
