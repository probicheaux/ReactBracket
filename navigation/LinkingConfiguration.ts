/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "home",
            },
          },
          Brackets: {
            screens: {
              BracketScreen: "one",
            },
          },
          Account: {
            screens: {
              AccountScreen: "account",
            },
          },
        },
      },
      Login: "login",
      Register: "register",
      NotFound: "*",
    },
  },
};

export default linking;
