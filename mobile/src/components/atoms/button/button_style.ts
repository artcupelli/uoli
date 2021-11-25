import { StyleSheet } from "react-native";
import { Colors } from "../../../constants/colors";

export const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: Colors.main,
        height: 90,
        width: "90%",
        alignSelf: "center",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    
    icon: {
        color: Colors.main,
        fontSize: 30,
        margin: 8,
        alignSelf: "center"
    }
});