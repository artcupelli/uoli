import { StyleSheet } from "react-native";

import { Colors } from "../../../constants/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 4,       
        borderWidth: 2,
        borderColor: Colors.main,
    },

    webViewContainer: {
        flex: 4
    },

    darkCover: {
        backgroundColor: Colors.black,
        height: "100%",
        width: "100%",
        position: 'absolute',
    }
});