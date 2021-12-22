import { StyleSheet } from "react-native";

const ButtonStyles = StyleSheet.create({
  container: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 191,
    height: 46,
    margin: 8,
  },
  invisibleContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 191,
    height: 46,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  buttonText: {
    fontSize: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ButtonStyles;
