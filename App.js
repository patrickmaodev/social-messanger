import React from 'react';
import { UserProvider } from './contexts/UserContext';
import NavigationStack from './NavigationStack';

export default function App() {
  return (
    <UserProvider>
      <NavigationStack />
    </UserProvider>
  );
}
