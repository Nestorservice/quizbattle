import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { GameStackParamList } from './types';
import { LobbyScreen } from '../screens/lobby/LobbyScreen';
import { JoinLobbyScreen } from '../screens/lobby/JoinLobbyScreen';
import { WaitingRoomScreen } from '../screens/lobby/WaitingRoomScreen';
import { QuizConfigScreen } from '../screens/config/QuizConfigScreen';
import { GeneratingScreen } from '../screens/game/GeneratingScreen';
import { GameScreen } from '../screens/game/GameScreen';
import { ResultsScreen } from '../screens/game/ResultsScreen';

const Stack = createStackNavigator<GameStackParamList>();

export const GameNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Lobby" component={LobbyScreen} />
      <Stack.Screen name="JoinLobby" component={JoinLobbyScreen} />
      <Stack.Screen name="WaitingRoom" component={WaitingRoomScreen} />
      <Stack.Screen name="QuizConfig" component={QuizConfigScreen} />
      <Stack.Screen name="Generating" component={GeneratingScreen} />
      <Stack.Screen name="GameScreen" component={GameScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
};
