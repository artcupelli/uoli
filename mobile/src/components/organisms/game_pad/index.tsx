import React, { useState } from 'react';

import { View } from 'react-native';

import Draggable from 'react-native-draggable';

import { Colors } from '../../../constants/colors';

import { styles } from './game_pad_style';


const GamePad: React.FC = () => {

  return (
    <View style={styles.container}>
      <Draggable
        isCircle
        maxX={130} minX={0}
        maxY={180} minY={0}
        x={15}
        y={25}
        renderColor={Colors.main}
        shouldReverse
        renderSize={80}
        renderText=""
      />
    </View>
  );
}

export default GamePad;