import {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import Lists from '../screens/Lists';
import NewList from '../screens/NewList';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Logout from './Logout';
import Map from '../screens/Map';
import Information from '../screens/Information';
import List from '../screens/List';
import UpdateList from '../screens/UpdateList';
import {context} from '../store/context';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function Tabs() {
  return (
    <BottomTabs.Navigator screenOptions={{headerStyle: {backgroundColor: '#554738'}, headerTitleStyle: {fontFamily: 'Comfortaa'}, headerTintColor: 'white', tabBarStyle: {backgroundColor: '#554738'}, tabBarActiveTintColor: 'white', headerRight: () => <Logout/>}}>
        <BottomTabs.Screen name='My Activity Lists' component={Lists} options={{tabBarIcon: ({size, color}) => <Ionicons name='home' size={size} color={color}/>}}/>
        <BottomTabs.Screen name='Create Activity List' component={NewList} options={{tabBarIcon: ({size, color}) => <Ionicons name='add' size={size} color={color}/>, tabBarLabel: 'New Activity List'}}/>
    </BottomTabs.Navigator>
  );
}

export default function Navigator() {
    const ctx = useContext(context);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: '#554738'}, headerTitleStyle: {fontFamily: 'Comfortaa'}, headerTintColor: 'white', contentStyle: {backgroundColor: '#deefff'}, headerRight: ctx.isLoggedIn ? () => <Logout/> : () => {}}}>
                {!ctx.isLoggedIn && (
                    <>
                        <Stack.Screen name='Login' component={Login}/>
                        <Stack.Screen name='Signup' component={Signup}/>
                    </>
                )}
                {ctx.isLoggedIn && (
                    <>
                        <Stack.Screen name='Tabs' component={Tabs} options={{headerShown: false}}/>
                        <Stack.Screen name='Map' component={Map} options={{presentation: 'modal'}}/>
                        <Stack.Screen name='Activity List' component={List}/>
                        <Stack.Screen name='Activity Information' component={Information} options={{presentation: 'modal'}}/>
                        <Stack.Screen name='Update Activity List' component={UpdateList}/>
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}