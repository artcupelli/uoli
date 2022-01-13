import { StyleSheet } from "react-native";

import { Colors } from "../../../constants/colors";


export const styles = StyleSheet.create({

    container: {
        borderWidth: 1,
        borderColor: Colors.main,
        flex: 1,
        width: "93%",
        minHeight: 45,
        alignSelf: "center",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: 10
    },
    
    icon: {
        color: Colors.main,
        fontSize: 15,
        margin: 8,
        alignSelf: "center"
    }
});