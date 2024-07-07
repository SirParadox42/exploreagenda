import {Text, Pressable, StyleSheet, View, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Button from './Button';

export default function List(props) {
    const navigation = useNavigation();

    const handleView = () => navigation.navigate('Activity List', {listId: props.id});
    const handleEdit = () => navigation.navigate('Update Activity List', {listId: props.id});
    const handleDelete = () => Alert.alert('Deleting Activity List', `Are you sure you want to delete your activity list for ${props.location}?`, [{text: 'No', style: 'cancel'}, {text: 'Yes', style: 'destructive', onPress: () => props.onDelete(props.id)}]);

    return (
        <Pressable style={({pressed}) => [styles.location, pressed && styles.pressed]} onPress={handleView}>
            <Text style={styles.text}>{props.location}</Text>
            <View style={styles.buttons}>
                <Button onPress={handleEdit}>Edit</Button>
                <Button onPress={handleDelete}>Delete</Button>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    location: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#efeeee',
        padding: 20,
        marginVertical: 20,
        borderRadius: 3,
        position: 'relative'
    },

    text: {
        fontFamily: 'Comfortaa',
        fontSize: 17.5
    },

    pressed: {
        opacity: 0.75
    },

    buttons: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -30,
        left: 20
    }
});