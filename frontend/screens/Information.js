import {useEffect, useState} from 'react';
import {Alert, Linking, StyleSheet, Text, View} from 'react-native';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';
import {GOOGLE_SEARCH_KEY} from '@env';
import {CX} from '@env';

export default function Information(props) {
    const [isLoading, sendRequest] = useHttp();
    const [link, setLink] = useState('');
    const handleRedirect = () => Linking.openURL(link);

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest(`https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_KEY}&cx=${CX}&q=${props.route.params.title} in ${props.route.params.location} Tripadvisor`, 'GET', null, {}, false);
                setLink(response.items[0].link)
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        };

        dataFetcher();
        props.navigation.setOptions({headerRight: () => {}});
    }, []);

    return (
        <View style={styles.activity}>
            {isLoading && <Loading isLoading={isLoading}/>}
            {!isLoading && (
                <>
                    <Text style={[styles.font, styles.title]}>{props.route.params.title}</Text>
                    <View style={styles.line}></View>
                    <Text style={[styles.font, styles.description]}>{props.route.params.description}</Text>
                    <View style={styles.line}></View>
                    <Text style={[styles.font, styles.plan]}>Plan the activity <Text style={styles.link} onPress={handleRedirect}>here</Text>.</Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    activity: {
        padding: 20
    },

    link: {
        color: '#4271fe',
        textDecorationLine: 'underline'
    },

    font: {
        fontFamily: 'Comfortaa'
    },

    title: {
        fontSize: 40
    },

    description: {
        fontSize: 20
    },

    plan: {
        fontSize: 25
    },

    line: {
        width: '100%',
        height: 3,
        backgroundColor: 'black',
        marginVertical: 10
    }
});