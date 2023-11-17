import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LoginScreen = () => {
  return (
    <View Style={{flex:1, backgroundColor:"white", padding:10, alignItems:"center"}}>
      <KeyboardAvoidingView>
        <View style={{marginTop:100}}>
          <Text>Signin</Text>
          <Text>Sign In To Account</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({

})