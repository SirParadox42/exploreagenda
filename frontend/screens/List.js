import {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, View, Text, StyleSheet} from 'react-native';
import Loading from '../components/Loading';
import Activity from '../components/Activity';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';

export default function List(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [activities, setActivities] = useState({activities: []});

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
                    <FlatList style={styles.list} data={activities.activities.filter(activity => activity.checked)} renderItem={item => <Activity {...item.item} location={activities.location}/>} keyExtractor={item => item.id}/>
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