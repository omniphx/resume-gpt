'use client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './theme';

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  return (
    <ChakraProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {children}
    </ChakraProvider>
  );
}
