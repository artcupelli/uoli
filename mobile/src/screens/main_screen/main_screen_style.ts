import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 15,
    },

    headerContainer: {
        flex: 1,
        flexDirection: "row"
    },

    contentContainer: {
        flex: 9,
        flexDirection: "row"
    },

    leftButtonsContainer: {
        paddingRight: 10,
        flex: 1,
        flexDirection: "column"
    },

    controllersContainer: {
        flex: 1,
        justifyContent: "space-between"
    },

    eyeButtonContainer: {
        flex: 1
    },

    cameraContainer: {
        flex: 4,
    },

    rightButtonsContainer: {
        paddingLeft: 10,
        flex: 1,
        flexDirection: "column"

    }


});