import React from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'

const User = ({item}) => {
  return (
    <Pressable style={{ flexDirection: "row", alignItens: "center", marginVertical: 10}}>
        <View>
            <Image
            Style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                resizeModel: "cover",
            }}
            source={{ uri: item.image }} />

            
        </View>
        <View style={{marginLeft: 12, flex:1}}>
            <Text>{item?.name}</Text>
            <Text>{item?.email}</Text>
        </View>
        <Pressable style={{ backgroundColor: "#567189", padding:10, borderRadius: 6, width: 105 }}>
            <Text>Add Friend</Text>
        </Pressable>
    </Pressable>
    
  )
}

export default User