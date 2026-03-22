'use client';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
