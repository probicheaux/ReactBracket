/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import React, { useContext } from "react";
import {
  Text as DefaultText,
  View as DefaultView,
  Button as DefaultButton,
  TextInput as DefaultTextInput,
  ScrollView as DefaultScrollView,
  FlatList as DefaultFlatList,
  TouchableOpacity as DefaultTouchableOpacity,
  SafeAreaView as DefaultSAView,
  ActivityIndicator as DefaultActivityIndicator,
  ActivityIndicatorProps
} from "react-native";

import { SocialIcon as DefaultSocialIcon } from "react-native-elements";
import { MaterialCommunityIcons as DefaultMaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import AppContext from "../components/AppContext";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const context = useContext(AppContext);
  const theme = context.scheme;
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];
export type ButtonProps = ThemeProps & DefaultButton["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ScrollViewProps = ThemeProps & DefaultScrollView["props"];
export type FlatListProps = ThemeProps & DefaultFlatList["props"];
export type TouchableOpacityProps = ThemeProps &
  DefaultTouchableOpacity["props"];
export type LinkButtonProps = ThemeProps & { title: string, style?: TextProps, onPress: () => void }
export type MaterialCommunityIconsProps = ThemeProps &
  DefaultMaterialCommunityIcons["props"];
export type SocialIconProps = ThemeProps & DefaultSocialIcon["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}
export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const placeholderTextColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "placeholderTextColor"
  );

  return (
    <DefaultTextInput
      style={[{ color }, style]}
      placeholderTextColor={placeholderTextColor}
      {...otherProps}
    />
  );
}

export function MaterialCommunityIcons(props: MaterialCommunityIconsProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tabIconDefault"
  );

  return (
    <DefaultMaterialCommunityIcons style={[{ color }, style]} {...otherProps} />
  );
}

export function Button(props: ButtonProps) {
  return <DefaultButton {...props} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function SafeAreaView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultSAView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TouchableOpacity(props: TouchableOpacityProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "touchableColor"
  );

  return (
    <DefaultTouchableOpacity
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}

export function LinkButton(props: LinkButtonProps) {
  const { style, lightColor, darkColor, title, onPress } = props;
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "linkbuttonText"
  );

  return (
    <DefaultTouchableOpacity onPress={onPress}>
      <DefaultText style={[{color: textColor, fontSize: 20}, style]}>
        {title}
      </DefaultText>
    </DefaultTouchableOpacity>

  );
}

export function SocialIcon(props: SocialIconProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "socialColor"
  );

  return (
    <DefaultSocialIcon style={[{ backgroundColor }, style]} {...otherProps} />
  );
}

export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  return (
    <DefaultScrollView
      style={[{ backgroundColor }, style]}
      alwaysBounceVertical={true}
      {...otherProps}
    />
  );
}

export function FlatList(props: FlatListProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  return (
    <DefaultFlatList
      style={[{ backgroundColor }, style]}
      alwaysBounceVertical={true}
      {...otherProps}
    />
  );
}

export function ActivityIndicator(props: ActivityIndicatorProps) {
  const { size = "large", ...otherProps } = props
  const color = useThemeColor(
    {},
    "touchableColor"
  );
  return (
    <DefaultActivityIndicator size={size} color={color} {...otherProps} />
  );
}
