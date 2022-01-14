import React, { useEffect, useRef, useState } from 'react';

import { ActivityIndicator, Animated, Image, Modal, View } from 'react-native';

import { WebView } from 'react-native-webview';

import { styles } from './camera_display_styles';

import { LoadingLandscape } from '../../molecules';

import { Text } from '../../atoms';

import CameraDisplayProps from './camera_display_props';


const CameraDisplay: React.FC<CameraDisplayProps> = ({ cameraClosed }) => {

    const url = 'http://192.168.4.1';
    // const url = 'https://blog.lucasgilbert.com.br/wp-content/uploads/2018/05/street-e-road-lucas-gilbert.jpg';

    const [initalLoading, setInicialLoading] = useState<boolean>(true);
    const [isWebViewLoading, setIsWebViewLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [loadingScreenMessage, setLoadingScreenMessage] = useState<string>("carregando...");
    const opacity = useRef<Animated.Value>(new Animated.Value(1)).current;


    const fadeInAnimation = Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
    });

    const fadeOutAnimation = Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
    });


    function onStartLoading(): void {
        setIsWebViewLoading(true);
    }

    function onFinishLoading(): void {
        setTimeout(() => {
            setIsWebViewLoading(false);
            setInicialLoading(false);

            fadeOutAnimation.start();

        }, 5000);
    }

    function onError(): void {
        setIsWebViewLoading(false);
        setError(true);
    }

    function handleCameraClosed(): void {

        if (cameraClosed) {
            fadeInAnimation.start();
            setTimeout(() => {
                setIsWebViewLoading(true)
            }, 1000)
            setLoadingScreenMessage("camera fechada")
        }

        else if (!initalLoading) {
            setIsWebViewLoading(false);
            fadeOutAnimation.start();
        }
    }

    useEffect(() => {
        handleCameraClosed()
    }, [cameraClosed])


    return (
        <View style={styles.container}>


            <LoadingLandscape loading={isWebViewLoading} message={loadingScreenMessage} />

            <View style={isWebViewLoading ? { display: 'none' } : styles.webViewContainer}>

                <WebView
                    source={{ uri: url }}
                    onLoadStart={onStartLoading}
                    onLoadEnd={onFinishLoading}
                    onError={onError}
                    userAgent="Chrome/67.0.3396.99Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko)  Safari/537.36"
                    onHttpError={onError}

                />

                <Animated.View style={{ ...styles.darkCover, opacity: opacity }} />
            </View>

        </View>
    );
}

export default CameraDisplay;