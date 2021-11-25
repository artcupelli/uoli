import React, { useState } from 'react';

import { View, Image, TouchableOpacity, Modal } from 'react-native';

import { CarControlService } from '../../service/car_control_service';

import { styles } from './main_screen_style';

import { Button, Text } from '../../components/atoms';

import { CameraDisplay, GamePad } from '../../components/organisms';

import { captureRef, captureScreen } from "react-native-view-shot";

import Icon from 'react-native-vector-icons/SimpleLineIcons';

import { Colors } from '../../constants/colors';


const MainScreen: React.FC = () => {

    const carController = new CarControlService();

    const [isCameraClosed, setIsCameraClosed] = useState<boolean>(false);
    const [screenshotSource, setScreenshotSource] = useState<string | null>();


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


    function toogleCameraClosed() {
        setIsCameraClosed(!isCameraClosed);
    }

    async function handleCaptureScreenShot(): Promise<void> {
        const response = await captureScreen({ result: 'data-uri' });
        setScreenshotSource(response);
    }


    return (
        <View style={styles.container}>

            <Modal visible={screenshotSource != null} transparent>
                <View style={styles.modalScreenshot}>

                    <View style={styles.modalContainer}>

                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text>Gostaria de salvar sua imagem?</Text>
                            <Icon
                                name="close"
                                color={Colors.main}
                                size={20}
                                onPress={()=>{setScreenshotSource(null)}}
                            />
                        </View>
                        <Image source={{ uri: screenshotSource! }} style={{ flex: 1 }} />

                    </View>
                </View>
            </Modal>

            <View style={styles.headerContainer}>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.leftButtonsContainer}>
                    <View style={styles.eyeButtonContainer}>
                        <Button
                            icon={isCameraClosed ? "camera" : "eye"}
                            onPress={toogleCameraClosed}
                            pressed={isCameraClosed}
                        />
                    </View>

                    <View style={styles.eyeButtonContainer}>
                        <Button icon="settings" />
                    </View>

                    <View style={styles.eyeButtonContainer}>
                        <Button
                            icon="picture"
                            onPress={() => { handleCaptureScreenShot() }}
                        />
                    </View>


                </View>

                <CameraDisplay cameraClosed={isCameraClosed} />

                <View style={styles.rightButtonsContainer}>

                    <GamePad />

                </View>
            </View>

        </View>
    )
};



export default MainScreen;