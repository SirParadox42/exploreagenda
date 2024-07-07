import {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import Activity from '../components/Activity';
import Button from '../components/Button';
import Loading from '../components/Loading';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';

export default function NewList(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [location, setLocation] = useState('');
    const [activities, setActivities] = useState([]);

    const handlePickCity = () => props.navigation.navigate('Map');
    const handleCheck = index => setActivities(prev => prev.map((activity, i) => index === i ? ({...activity, checked: !activity.checked}) : activity));
    const handleCreateList = async() => {
        try {
            if (!activities.map(activity => activity.checked).includes(true)) {
                throw new Error('Select activities before creating list.');
            }

            await sendRequest('user', 'PATCH', JSON.stringify({location, activities}), {'Content-Type': 'application/json', Authorization: `Bearer ${ctx.token}`});
            setLocation('');
            setActivities('');
            props.navigation.navigate('My Activity Lists');
        } catch(err) {
            Alert.alert('Error', err.message, [{text: 'Ok'}]);
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${props.route.params.latitude}&longitude=${props.route.params.longitude}&localityLanguage=en`, 'GET', null, {}, false);
                setLocation(response.city.length > 0 ? `${response.city}, ${response.countryName.slice(0, response.countryName.indexOf('(') > 0 ? response.countryName.indexOf('(')-1 : response.countryName.length)}` : '');
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }

        };

        if (props.route.params) {
            dataFetcher();
        }
    }, [props.route.params]);
    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const userResponse = await sendRequest('user', 'GET', null, {Authorization: `Bearer ${ctx.token}`});

                if (userResponse.lists.map(list => list.location).includes(location)) {
                    const locationTitle = location;
                    setLocation('');
                    setActivities([]);
                    throw new Error(`You have already created an activity list for ${locationTitle}.`);
                }

                const geminiResponse = await sendRequest(`gemini/${location}`);
                const data = geminiResponse.response.replaceAll('```', '').replaceAll('javascript', '').replaceAll('\n', '').replace(';', '');
                setActivities(JSON.parse(data.slice(data.indexOf('=')+2)).map(activity => ({...activity, checked: false})));
            } catch(err) {
                if (!err.message.includes('JSON Parse error')) {
                    Alert.alert('Error', err.message, [{text: 'Ok'}]);
                }
            }
        };

        location.length > 0 ? dataFetcher() : setActivities([]);
    }, [location]);

    return (
        <View style={styles.form}>
            {isLoading && <Loading isLoading={isLoading}/>}
            {!isLoading && (
                <>
                    <Button onPress={handlePickCity}>Pick City on Map</Button>
                    {location.length === 0 && <Text style={styles.text}>No city chosen.</Text>}
                    {location.length > 0 && (
                        <>
                            <Text style={styles.text}>{location}</Text>
                            <FlatList style={styles.activities} data={activities} renderItem={item => <Activity form {...item.item} location={location} onPress={() => handleCheck(item.index)}/>} keyExtractor={(item, index) => index}/>
                            <Button onPress={handleCreateList}>Create Activity List</Button>
                        </>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        padding: 20,
        backgroundColor: '#deefff',
        flex: 1
    },

    activities: {
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