import React from 'react';

import { TouchableOpacity, Text } from 'react-native';

import ButtonProps from "./button_props";

import Icon from 'react-native-vector-icons/FontAwesome5';

import { styles } from './button_style';



const Button: React.FC<ButtonProps> = ({ icon, alignRight = false, alignDown = false, onPressIn, onPressOut }) => {

    return (
        <TouchableOpacity
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={{ ...styles.container, ...{ justifyContent: alignDown ? "flex-end" : "flex-start" } }}
        >

            <Icon
                style={{ ...styles.icon, ...{ textAlign: alignRight ? "right" : "left" } }}
                name={icon}
            />

        </TouchableOpacity>
    );
}

export default Button;