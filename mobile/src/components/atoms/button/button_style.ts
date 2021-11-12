import { StyleSheet } from "react-native";
import { Colors } from "../../../constants/colors";

export const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: Colors.purple,
        height: 75,
        flexDirection: "column",
    },
    icon: {
        color: Colors.purple,
        fontSize: 30,
        margin: 8,
    }
});