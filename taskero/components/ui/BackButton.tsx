import { View, Text, TouchableHighlight } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

const BackButton = () => {
  return (
      <TouchableHighlight
          underlayColor={'#ccca'}
          style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 6,
              borderRadius: 40,
              height: 40,
              aspectRatio: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16
          }}
          onPress={() => router.push("..")}
      >
          <MaterialIcons name="arrow-back-ios-new" size={18} color="black" />
      </TouchableHighlight>
  )
}

export default BackButton