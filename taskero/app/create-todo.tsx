import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler'
import { Controller, useForm } from 'react-hook-form'
import { useNavigation } from 'expo-router'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { Colors } from '@/constants/Colors'

type TCreateTodoForm = {
  title: string,
  description: string
}

const schema = yup.object().shape({
    title: yup.string().required('title is required'),
    description: yup.string().required('description is required'),
});

const createTodo = () => {
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
      <Text style={{fontSize: 24, fontWeight: 'bold'}}>New Task</Text>
      <View style={{ marginTop: 32 }}>
        {/* Email Input */}
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
      <View style={{ marginTop: 16 }}>
        {/* Email Input */}
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
      </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
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
        marginBottom: 10,
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