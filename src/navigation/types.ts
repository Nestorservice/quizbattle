import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Game: NavigatorScreenParams<GameStackParamList>;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};

export type GameStackParamList = {
  Lobby: undefined;
  JoinLobby: undefined;
  WaitingRoom: undefined;
  QuizConfig: undefined;
  Generating: undefined;
  GameScreen: undefined;
  Results: undefined;
};
