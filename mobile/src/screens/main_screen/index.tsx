import React, { useState } from 'react';

import { View, Image, Modal, TextInput } from 'react-native';

import { CarControlService } from '../../service/car_control_service';

import { styles } from './main_screen_style';

import { Button, Text } from '../../components/atoms';

import { CameraDisplay } from '../../components/organisms';

import { captureScreen } from "react-native-view-shot";

import Icon from 'react-native-vector-icons/SimpleLineIcons';

import { Colors } from '../../constants/colors';


const MainScreen: React.FC = () => {

    const carController = new CarControlService();

    const [isCameraClosed, setIsCameraClosed] = useState<boolean>(false);
    const [screenshotSource, setScreenshotSource] = useState<string | null>();
    const [isLightOn, setIsLightOn] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');


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

    function toogleLight() {
        carController.toogleLight();
        setIsLightOn(!isLightOn);
    }

    function toogleCameraClosed() {
        setIsCameraClosed(!isCameraClosed);
    }

    function sendMessage() {
        carController.message(message);
        setMessage('');
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
                                onPress={() => { setScreenshotSource(null) }}
                            />
                        </View>
                        <Image source={{ uri: screenshotSource! }} style={{ flex: 1 }} />

                        <Button
                            icon='download'
                        />
                    </View>
                </View>
            </Modal>

            <View style={styles.contentContainer}>

                <View style={styles.messageContainer}>
                    <TextInput style={styles.input}
                        placeholder='Digite sua mensagem...'
                        placeholderTextColor={Colors.main}
                        onChangeText={(text)=> setMessage(text)}
                        value={message}
                    />
                    <Button
                        icon='paper-plane'
                        onPress={sendMessage}
                    />
                </View>

                <View style={styles.leftButtonsContainer}>
                    <View style={styles.eyeButtonContainer}>
                        <Button
                            icon={isCameraClosed ? "camera" : "eye"}
                            onPress={toogleCameraClosed}
                            pressed={isCameraClosed}
                        />
                    </View>

                    <View style={styles.eyeButtonContainer}>
                        <Button
                            icon="bulb"
                            pressed={isLightOn}
                            onPress={toogleLight}
                        />
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

                    <Button
                        icon='arrow-up'
                        onPressIn={goFoward}
                        onPressOut={stop}
                    />

                    <View style={styles.sideButtonsContainer}>
                        <Button
                            icon='arrow-left'
                            onPressIn={goLeft}
                            onPressOut={stop}
                        />
                        <Button
                            icon='arrow-right'
                            onPressIn={goRight}
                            onPressOut={stop}
                        />
                    </View>

                    <Button
                        icon='arrow-down'
                        onPressIn={goBack}
                        onPressOut={stop}
                    />
                </View>

            </View>

        </View>
    )
};



export default MainScreen;