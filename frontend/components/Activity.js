import {Pressable, StyleSheet, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {CheckBox} from 'react-native-elements';

export default function Activity(props) {
    const navigation = useNavigation();
    const handleRedirect = () => navigation.navigate('Activity Information', {title: props.title, description: props.description, location: props.location});

    return (
        <View>
            {props.form ? <CheckBox title={props.title} checked={props.checked} onPress={props.onPress}/> : <Text style={[styles.title, styles.font]}>{props.title}</Text>}
            <Pressable onPress={handleRedirect} style={({pressed}) => [styles.buttonContainer, pressed && styles.pressed]}>
                <Text style={[styles.buttonText, styles.font]}>Learn more</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        margin: 10,
        marginTop: -5,
        padding: 5,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#efeeee',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },

    buttonText: {
        color: '#4271fe',
        textDecorationLine: 'underline'
    },

    pressed: {
        opacity: 0.75
    },

    font: {
        fontFamily: 'Comfortaa'
    },

    title: {
        margin: 10,
        marginBottom: 0,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#efeeee',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        fontSize: 17.5,
    }
});