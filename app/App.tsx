'use client';
import type { ReactNode } from 'react';
import { ChakraProvider } from './chakra-compat';
import EmotionRegistry from './EmotionRegistry';
import theme from './theme';

type AppProps = {
  children: ReactNode;
};

export default function App({ children }: AppProps) {
  return (
    <EmotionRegistry>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </EmotionRegistry>
  );
}
