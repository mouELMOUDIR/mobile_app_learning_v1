import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ containerStyle, onSearch }) => {
    const [searchText, setSearchText] = useState('');

    const handleChangeText = (text) => {
        setSearchText(text);
        onSearch(text);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                style={styles.searchBar}
                placeholder='Search note...'
                value={searchText}
                onChangeText={handleChangeText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchBar: {
        borderWidth: 2,
        borderColor: 'black',
        height: 40,
        borderRadius: 40,
        paddingLeft: 14,
        fontSize: 20,
    },
    container: {},
});

export default SearchBar;
