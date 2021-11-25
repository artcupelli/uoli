import React from 'react';

import { View, Text } from 'react-native';

import TextProps from './text_props';

import { styles } from './text_style';


const _Text: React.FC<TextProps> = ({ children, style }) => {
    return (
        <Text style={{...styles.text, ...style}}>{children}</Text>
    );
}

export default _Text;