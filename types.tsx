/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: undefined;
  Tournament: { name: string } | undefined;
  BracketList: { name: string } | undefined;
  Login: undefined;
  Register: { fromGoogleFlow: boolean };

  Home: undefined;
  SearchAndJoinStack: undefined;
  TournamentDetails: undefined;

  // Modal views:
  CreateTournament: undefined;
  SearchTournament: undefined;
  TournamentDetailsSearch: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  HomeTab: undefined;
  Brackets: undefined;
  Account: undefined;
};

// For those many cases where you have a screen that only needs a navigation prop
export type ScreenWithNavigation = {
  navigation: NavigationProp<any>;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
