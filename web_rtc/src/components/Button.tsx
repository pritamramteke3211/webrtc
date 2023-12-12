import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'

interface Props {
  onPress?: any;
  iconName: string;
  backgroundColor: string;
  style?: any;
}

const Button = (props: Props) => {
  return (
    <View>
      <TouchableOpacity
      onPress={props.onPress}
      style={[
        { 
          backgroundColor: props.backgroundColor
         },
         props.style,
         styles.button,
      ]}
      >
        <Icon name={props.iconName} color="white" size={20} />
      </TouchableOpacity>
    </View>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    padding: 10,
    elevation: 10,
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: 100,
  },
})