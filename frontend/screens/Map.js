import {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {Ionicons} from '@expo/vector-icons';

export default function Map(props) {
    const [selectedCity, setSelectedCity] = useState();

    const handlePickCity = e => setSelectedCity({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude});
    const handleSavePickedCity = useCallback(() => props.navigation.navigate('Create Activity List', {latitude: selectedCity.latitude, longitude: selectedCity.longitude}), [selectedCity]);
    
    useEffect(() => selectedCity ? props.navigation.setOptions({headerRight: () => <Ionicons name='checkmark' size={30} color='#ffffff' onPress={handleSavePickedCity}/>}) : props.navigation.setOptions({headerRight: () => {}}), [selectedCity]);

    return (
        <MapView style={styles.map} onPress={handlePickCity}>
            {selectedCity && <Marker title='Picked City' coordinate={{latitude: selectedCity.latitude, longitude: selectedCity.longitude}}/>}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    }
});