import React from 'react';
import { View , StyleSheet} from 'react-native';
import { AntDesign} from '@expo/vector-icons';
import { color } from 'react-native-elements/dist/helpers';
import colors from '../misc/colors';

const RoundIconBtn = ({antIconName,size,color,style,onPress}) => {
    return <AntDesign
                 name={antIconName}
                 size={size || 24}
                 color={color || colors.LIGHT}
                 style={[styles.icon , {...style}]}
                 onPress={onPress}
            />
}

const styles = StyleSheet.create({
    icon:{
        backgroundColor: '#28AC',
        padding: 15,
        borderRadius: 50,
        elevation: 5
    }
})

export default RoundIconBtn;