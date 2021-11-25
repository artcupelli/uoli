import { StyleSheet } from "react-native";

import { Colors } from "../../constants/colors";


export const styles = StyleSheet.create({
    
    container: {
        backgroundColor: Colors.black,
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
        flexDirection: "column",
        justifyContent: "center",
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
        width: '60%',
        height: "90%",
        borderWidth: 1,
        borderColor: Colors.main,
        padding: 20
    },


    rightButtonsContainer: {
        paddingLeft: 10,
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center"

    }


});