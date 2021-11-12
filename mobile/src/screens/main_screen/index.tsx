import React from 'react';

import { View, Image, Text, TouchableOpacity } from 'react-native';

import { CarControlService } from '../../service/car_control_service';

import { WebView } from 'react-native-webview';

import { styles } from './main_screen_style';

import { Button } from '../../components/atoms';


const MainScreen: React.FC = () => {

    const carController = new CarControlService();


    function goFoward() {
        carController.goFoward();
    }

    function goLeft() {
        carController.goLeft();
    }

    function goRight() {
        carController.goRight();
    }

    function goBack() {
        carController.goBack();
    }

    function stop() {
        carController.stop();
    }



    return (
        <View style={styles.container}>

            <View style={styles.headerContainer}>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.leftButtonsContainer}>
                    <View style={styles.eyeButtonContainer}>
                        <Button
                            icon="eye"
                        />
                    </View>

                    <View style={styles.controllersContainer}>
                        <Button
                            icon="arrow-up"
                            onPressIn={goFoward}
                            onPressOut={stop}
                        />
                        <Button
                            icon="arrow-left"
                            alignDown
                            onPressIn={goLeft}
                            onPressOut={stop}
                        />
                    </View>
                </View>

                <View style={styles.cameraContainer}>
                    <WebView
                        source={{ uri: 'http://192.168.4.1:81/stream' }}
                    />
                </View>

                <View style={styles.rightButtonsContainer}>
                    <View style={styles.eyeButtonContainer}>
                        <Button icon="cog" alignRight />
                    </View>

                    <View style={styles.controllersContainer}>
                        <Button
                            icon="arrow-right"
                            alignRight
                            onPressIn={goRight}
                            onPressOut={stop}
                        />
                        <Button
                            icon="arrow-down"
                            alignRight
                            alignDown
                            onPressIn={goBack}
                            onPressOut={stop}
                        />
                    </View>
                </View>
            </View>

        </View>
    )
};



export default MainScreen;