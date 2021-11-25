import React, { useEffect, useState, useRef } from 'react';

import { Image, View, Animated } from 'react-native';

import { Text } from '../../atoms';

import LoadindLandscapeProps from './loading_landscape_props';

import { styles } from './loading_landscape_styles';


const LoadingLandscape: React.FC<LoadindLandscapeProps> = ({ loading, closedCamera, message = "carregando..." }) => {

  const opacity = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence(
        [
          Animated.timing(
            opacity, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true
          }
          ),
          Animated.timing(
            opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
          }
          ),
        ]
      )
    ).start()
  }, [opacity, loading])


  return loading ? (
    <Animated.View style={{ ...styles.container, opacity: opacity }}>
      <Text style={styles.text}>{message}</Text>
      <Image style={styles.image} source={require('../../../assets/images/background_loading.png')} />
    </Animated.View>
  ) : null;

}

export default LoadingLandscape;