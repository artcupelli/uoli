import { StyleSheet } from "react-native";

import { Colors } from "../../constants/colors";


export const styles = StyleSheet.create({

    container: {
        backgroundColor: Colors.black,
        flex: 1,
        flexDirection: "column",
        padding: 15,
    },

    contentContainer: {
        flex: 9,
        flexDirection: "column"
    },

    leftButtonsContainer: {
        paddingRight: 10,
        flexDirection: "row",
        justifyContent: "center",
        height: 60
    },

    controllersContainer: {
        flex: 1,
        justifyContent: "space-between"
    },

    eyeButtonContainer: {
        flex: 1
    },

    modalScreenshot: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    modalContainer: {
        backgroundColor: Colors.black,
        width: '90%',
        height: "90%",
        borderWidth: 1,
        borderColor: Colors.main,
        padding: 20
    },


    rightButtonsContainer: {
        
    },

    sideButtonsContainer: {
        flexDirection: "row",
    },

    messageContainer: {
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        marginHorizontal: 5
    },

    input: {
        flexGrow: 1,
        backgroundColor: Colors.black,
        borderColor: Colors.main,
        color: Colors.main,
        fontSize: 12,
        height: 45,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 10,
    }

});