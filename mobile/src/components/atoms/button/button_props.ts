export default interface ButtonProps {
    icon: string,
    onPress?: () => void,
    pressed?: boolean,
    onPressIn?: () => void,
    onPressOut?: () => void,

}