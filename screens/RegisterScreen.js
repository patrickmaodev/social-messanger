import { StyleSheet, KeyboardAvoidingView, Text, View, Pressable} from 'react-native'
import React from 'react'

const RegisterSceen = () => {
  return (
    <View
    style={{
      flex: 1, backgroundColor: "white", padding: 10, alignItems: "center"
    }}>
      <Text>Register Page</Text>
        <KeyboardAvoidingView>
          <View style={{ marginTop: 100 }}>
            <Text style={{
              color: "#4A55A2",
              fontSize: 17,
              fontWeight: 600,
              textAlign:"center"
            }}
            >Sign In</Text>
            <Text style={{
              marginTop: 15,
              fontSize: 17,
              fontWeight: 600,
              textAlign:"center"
            }}
            >Sign In To Account</Text>
          </View>
        </KeyboardAvoidingView>
    </View>
  );
}

export default RegisterSceen

const styles = StyleSheet.create({

})