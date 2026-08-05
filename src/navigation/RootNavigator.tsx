import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuthStore } from '../stores/authStore';
import { MainTabNavigator } from './MainTabNavigator';
import { AuthScreen } from '../screens/Auth/AuthScreen';
import { SpotDetailScreen } from '../screens/SpotDetail/SpotDetailScreen';
import { WriteReviewScreen } from '../screens/Reviews/WriteReviewScreen';
import { AllReviewsScreen } from '../screens/Reviews/AllReviewsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="SpotDetail"
            component={SpotDetailScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="WriteReview"
            component={WriteReviewScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="AllReviews"
            component={AllReviewsScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
