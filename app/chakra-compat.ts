import {
  Avatar as ChakraAvatar,
  Box as ChakraBox,
  Button as ChakraButton,
  ChakraProvider as BaseChakraProvider,
  Code as ChakraCode,
  Divider as ChakraDivider,
  Flex as ChakraFlex,
  Heading as ChakraHeading,
  IconButton as ChakraIconButton,
  Image as ChakraImage,
  InputGroup as ChakraInputGroup,
  InputRightElement as ChakraInputRightElement,
  Link as ChakraLink,
  ListItem as ChakraListItem,
  OrderedList as ChakraOrderedList,
  Stack as ChakraStack,
  Table as ChakraTable,
  Tbody as ChakraTbody,
  Td as ChakraTd,
  Text as ChakraText,
  Textarea as ChakraTextarea,
  Th as ChakraTh,
  Thead as ChakraThead,
  Tr as ChakraTr,
  UnorderedList as ChakraUnorderedList,
  type ChakraProps,
} from '@chakra-ui/react';
import type { ComponentType, ReactNode } from 'react';

type ChakraComponentCompat<P = Record<string, unknown>> = ComponentType<P>;

export type { ChakraProps };

export type ChakraProviderCompatProps = {
  children?: ReactNode;
  theme: unknown;
};

export const ChakraProvider =
  BaseChakraProvider as unknown as ChakraComponentCompat<ChakraProviderCompatProps>;
export const Avatar = ChakraAvatar as unknown as ChakraComponentCompat;
export const Box = ChakraBox as unknown as ChakraComponentCompat;
export const Button = ChakraButton as unknown as ChakraComponentCompat;
export const Code = ChakraCode as unknown as ChakraComponentCompat;
export const Divider = ChakraDivider as unknown as ChakraComponentCompat;
export const Flex = ChakraFlex as unknown as ChakraComponentCompat;
export const Heading = ChakraHeading as unknown as ChakraComponentCompat;
export const IconButton = ChakraIconButton as unknown as ChakraComponentCompat;
export const Image = ChakraImage as unknown as ChakraComponentCompat;
export const InputGroup = ChakraInputGroup as unknown as ChakraComponentCompat;
export const InputRightElement =
  ChakraInputRightElement as unknown as ChakraComponentCompat;
export const Link = ChakraLink as unknown as ChakraComponentCompat;
export const ListItem = ChakraListItem as unknown as ChakraComponentCompat;
export const OrderedList =
  ChakraOrderedList as unknown as ChakraComponentCompat;
export const Stack = ChakraStack as unknown as ChakraComponentCompat;
export const Table = ChakraTable as unknown as ChakraComponentCompat;
export const Tbody = ChakraTbody as unknown as ChakraComponentCompat;
export const Td = ChakraTd as unknown as ChakraComponentCompat;
export const Text = ChakraText as unknown as ChakraComponentCompat;
export const Textarea = ChakraTextarea as unknown as ChakraComponentCompat;
export const Th = ChakraTh as unknown as ChakraComponentCompat;
export const Thead = ChakraThead as unknown as ChakraComponentCompat;
export const Tr = ChakraTr as unknown as ChakraComponentCompat;
export const UnorderedList =
  ChakraUnorderedList as unknown as ChakraComponentCompat;
