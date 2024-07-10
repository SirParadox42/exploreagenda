import {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, View, Text, StyleSheet} from 'react-native';
import Loading from '../components/Loading';
import Activity from '../components/Activity';
import Button from '../components/Button';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';

export default function UpdateList(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [activities, setActivities] = useState({location: '', activities: []});

    const handleCheck = index => setActivities(prev => ({...activities, activities: prev.activities.map((activity, i) => index === i ? ({...activity, checked: !activity.checked}) : activity)}));
    const handleUpdateList = async() => {
        try {
            if (!activities.activities.map(activity => activity.checked).includes(true)) {
                throw new Error('Select activities before updating list.');
            }

            await sendRequest(`user/update/${props.route.params.listId}`, 'PATCH', JSON.stringify({activities: activities.activities}), {'Content-Type': 'application/json', Authorization: `Bearer ${ctx.token}`});
            setActivities({location: '', activities: []});
            props.navigation.navigate('My Activity Lists');
        } catch(err) {
            Alert.alert('Error', err.message, [{text: 'Ok'}]);
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest(`user/${props.route.params.listId}`, 'GET', null, {Authorization: `Bearer ${ctx.token}`});
                setActivities(response.list);
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        };

        dataFetcher();
        props.navigation.setOptions({headerBackTitle: 'My Lists'});
    }, []);

    return (
        <View style={styles.activities}>
            {isLoading && <Loading isLoading={isLoading}/>}
            {activities.activities.length > 0 && (
                <>
                    <Text style={styles.text}>{activities.location}</Text>
                    <FlatList style={styles.list} data={activities.activities} renderItem={item => <Activity form {...item.item} location={activities.location} onPress={() => handleCheck(item.index)}/>} keyExtractor={(item, index) => index}/>
                    <Button onPress={handleUpdateList}>Update Activity List</Button>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    activities: {
        padding: 20,
        flex: 1
    },

    list: {
        marginVertical: 20
    },

    text: {
        fontFamily: 'Comfortaa',
        margin: 10,
        marginBottom: 0,
        textDecorationLine: 'underline',
        textAlign: 'center',
        fontSize: 17.5
    }
});
