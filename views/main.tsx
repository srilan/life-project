import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, Button } from 'react-native';
import { World } from './worlds';

const Stack = createNativeStackNavigator();

export default function MainGame() {
    return (
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="World" component={World} />
        </Stack.Navigator>
        </NavigationContainer>
    );
}


function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
            title="Enter World"
            onPress={() => navigation.navigate('World')}
        />
        </View>
    );
}