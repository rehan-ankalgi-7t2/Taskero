import { View, Text, TouchableOpacity, StyleSheet, Button, Pressable } from 'react-native'
import React, { useState } from 'react'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler'
import { Controller, useForm } from 'react-hook-form'
import { useNavigation } from 'expo-router'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { Colors } from '@/constants/Colors'
import CustomDateInput from '@/components/ui/CustomDateInput'
import { ThemedText } from '@/components/ThemedText'
import { MaterialIcons } from '@expo/vector-icons'

type TCreateTodoForm = {
  title: string,
  description: string,
  deadline?: Date,
  subtasks?: [],
}

const schema = yup.object().shape({
    title: yup.string().required('title is required'),
    description: yup.string().required('description is required'),
    deadline: yup.date()
      .nullable()
      .min(new Date(), "Deadline must be in the future"),

    subtasks: yup.array().of(
      yup.object({
        subtaskTitle: yup.string().required("Subtask title is required"),
      })
    ).optional(),
});

const createTodo = () => {
  const [subtaskText, setSubtaskText] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const navigation = useNavigation();
      const { control, handleSubmit, formState: { errors } } = useForm<TCreateTodoForm>({
          resolver: yupResolver(schema),
      });

      const onSubmit = async (data: TCreateTodoForm) => {
        console.log(data)
      }

  return (
    <GestureHandlerRootView style={{
      padding: 16
    }}>
      <Text style={{fontSize: 24, fontWeight: 'bold'}}>Add New Todo</Text>
      <View style={{ marginTop: 24 }}>
        {/* Email Input */}
        <ThemedText>title</ThemedText>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Title"
              keyboardType="default"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              style={[styles.input, errors.title && styles.inputError]}
            />
          )}
        />
        {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}
      </View>
        {/* Email Input */}
        <ThemedText>description</ThemedText>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
            editable
              multiline={true}
              numberOfLines={6}
              placeholder="Description"
              keyboardType="default"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              style={[{
                height: 100, // You can also set a fixed height
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: 12,
                textAlignVertical: 'top',
                backgroundColor: '#fff',
              }, errors.description && styles.inputError]}
            />
          )}
        />
        {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}

        {/* Date Picker for deadline */}
        <CustomDateInput label="due date" value={date || new Date()} onChange={setDate} />

        {/* assign todo to the user */}

        {/* sub tasks */}
        <ThemedText>Subtasks</ThemedText>
          <Controller
            control={control}
            name="subtasks"
            render={({ field: { onChange, value } }) => (
              <View style={{display: 'flex', alignItems: 'flex-start', gap: 8, flexDirection: 'row', marginBottom: 16}}>
                <TextInput
                  placeholder="Add Subtasks"
                  keyboardType="default"
                  autoCapitalize="none"
                  value={subtaskText}
                  onChangeText={setSubtaskText}
                  style={[styles.input, errors.title && styles.inputError, { flex: 1, marginBottom: 12 }]}
                />
                <Pressable
                  style={{ paddingVertical: 9, paddingHorizontal: 16, backgroundColor: Colors.light.tint, borderRadius: 8 }}
                  onPress={() => {
                    if (subtaskText.trim().length > 0) {
                      const updatedSubtasks = [...subtasks, subtaskText.trim()];
                      setSubtasks(updatedSubtasks);  // Update local state
                      onChange(updatedSubtasks);  // Update react-hook-form field
                      setSubtaskText("");  // Clear input field
                    }
                  }}
                >
                  <MaterialIcons name="check" size={24} color="white" />
                </Pressable>
            </View>
            )}
          />
        {subtasks && subtasks.map((subtask, index) => (
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',  borderBottomWidth: 1, borderBottomColor: '#0002'}}>
            <Text key={index}>✔️ {subtask}</Text>
            <MaterialIcons name="delete-outline" size={24} color="red" style={{ padding: 8 }} onPress={() => {
              const updatedSubtasks = subtasks.filter((_, i) => i !== index);
              setSubtasks(updatedSubtasks);
              // onChange(updatedSubtasks);  // Update react-hook-form
            }} />
          </View>
        ))}

        {/* Login Button */}
        <TouchableOpacity style={[styles.button, {marginTop: 24}]} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Create Task</Text>
        </TouchableOpacity>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 'auto',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        fontSize: 16,
        marginBottom: 24,
    },
    inputError: {
        borderColor: 'red',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        fontSize: 12,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    passwordInput: {
        flex: 1,
        paddingRight: 40,
    },
    eyeButton: {
        position: 'absolute',
        right: 12,
        top: 12,
    },
    button: {
        backgroundColor: Colors.light.tint,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default createTodo