import React, { useState } from 'react';

import { View } from 'react-native';

import Draggable from 'react-native-draggable';

import { Colors } from '../../../constants/colors';

import { CarControlService } from '../../../service/car_control_service';

import { styles } from './game_pad_style';



const GamePad: React.FC = () => {

  const carController = new CarControlService();

  async function handlePress(event: any): Promise<void> {
    const X = event.nativeEvent.locationX;
    const Y = event.nativeEvent.locationY;


    console.log(Y + "     " + X)

    if (Y >= 200) {
      console.log("FRENTE")
      await carController.goFoward();

    } else if (Y <= 30) {
      console.log("TRAS")
      await carController.goBack();
    }

    if (X >= 780) {
      console.log("DIREITA")
      await carController.goRight();

    } else if (X <= 6) {
      console.log("ESQUERDA")
      await carController.goLeft();
    }

  }

  async function stop(): Promise<void> {
    console.log("STOP")
    await carController.stop();
  }


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
        onDrag={handlePress}
        onDragRelease={stop}
      />
    </View>
  );
}

export default GamePad;