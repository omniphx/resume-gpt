'use client';
import { ChakraProvider } from '@chakra-ui/react';
import EmotionRegistry from './EmotionRegistry';
import theme from './theme';

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  return (
    <EmotionRegistry>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </EmotionRegistry>
  );
}
