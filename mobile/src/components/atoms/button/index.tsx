import React from 'react';

import { TouchableOpacity, Text } from 'react-native';

import ButtonProps from "./button_props";

import Icon from 'react-native-vector-icons/SimpleLineIcons';

import { styles } from './button_style';

import { Colors } from '../../../constants/colors';


const Button: React.FC<ButtonProps> = ({ icon, onPress = () => { }, pressed = false }) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{ ...styles.container, backgroundColor: pressed ? Colors.main : "transparent" }}
        >
            <Icon
                style={{ ...styles.icon, color: pressed ? Colors.black : Colors.main }}
                name={icon}
                
            />
        </TouchableOpacity>
    );
}

export default Button;