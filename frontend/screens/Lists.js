import {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import useHttp from '../hooks/useHttp';
import List from '../components/List';
import Loading from '../components/Loading';
import {context} from '../store/context';

export default function Lists(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [lists, setLists] = useState([]);

    const handleDelete = async(id) => {
        try {
            await sendRequest(`user/delete/${id}`, 'PATCH', null, {'Content-Type': 'application/json', Authorization: `Bearer ${ctx.token}`});
            setLists(prev => prev.filter(list => list.id !== id));
        } catch(err) {
            Alert.alert('Error', err.message, [{text: 'Ok'}]);
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            const response = await sendRequest('user', 'GET', null, {'Content-Type': 'application/json', Authorization: `Bearer ${ctx.token}`});
            setLists(response.lists);
        };
        const cleanup = props.navigation.addListener('focus', dataFetcher);

        dataFetcher();
        return cleanup;
    }, []);

    return (
        <View style={styles.lists}>
            {isLoading && <Loading isLoading={isLoading}/>}
            {!isLoading && <FlatList data={lists} renderItem={item => <List location={item.item.location} id={item.item.id} onDelete={handleDelete}/>} keyExtractor={item => item.id}/>}
        </View>
    );
}

const styles = StyleSheet.create({
    lists: {
        padding: 20,
        backgroundColor: '#deefff',
        flex: 1
    }
});