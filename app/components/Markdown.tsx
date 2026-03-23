import React, { forwardRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import BaseSyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  Box,
  ChakraProps,
  Code,
  Heading,
  Image,
  Link,
  ListItem,
  OrderedList,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from '../chakra-compat';
import remarkGfm from 'remark-gfm';

const SyntaxHighlighter = BaseSyntaxHighlighter as unknown as React.ComponentType<any>;

type MarkdownProps = ChakraProps & {
  children?: string;
  placeHolderText?: string;
};

type MarkdownListProps = {
  depth?: number;
  ordered?: boolean;
  index?: number;
  checked?: boolean | null;
  node?: unknown;
  sourcePosition?: unknown;
} & Record<string, unknown>;

function omitMarkdownListProps({
  ...props
}: MarkdownListProps) {
  delete props.depth;
  delete props.ordered;
  delete props.index;
  delete props.checked;
  delete props.node;
  delete props.sourcePosition;
  return props;
}

type MarkdownNodeProps = {
  node?: unknown;
  sourcePosition?: unknown;
} & Record<string, unknown>;

function omitMarkdownNodeProps({
  ...props
}: MarkdownNodeProps) {
  delete props.node;
  delete props.sourcePosition;
  return props;
}

const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  ({ fontSize = '1em', children, placeHolderText, ...rest }, ref) => {
    return (
      <Box
        ref={ref}
        {...rest}
        fontSize={fontSize}
        lineHeight="1.7"
        sx={{
          '& > *:first-of-type': {
            marginTop: 0,
          },
          '& > *:last-child': {
            marginBottom: 0,
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          linkTarget="_blank"
          className="markdown"
          rawSourcePos={true}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  style={{
                    ...nightOwl,
                    hljs: {
                      ...nightOwl.hljs,
                      borderRadius: '10px',
                      padding: 15,
                      marginTop: 15,
                      marginBottom: 15,
                      width: '100%',
                    },
                  }}
                  PreTag={Code}
                  language={match[1]}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <Code className={className} {...props} fontSize={fontSize}>
                  {children}
                </Code>
              );
            },
            a({ children, ...props }) {
              return (
                <Link
                  {...omitMarkdownNodeProps(props)}
                  overflowWrap="anywhere"
                  color="blue.200"
                  textDecoration="underline"
                >
                  {children}
                </Link>
              );
            },
            p({ children }) {
              return (
                <Text mb={4} lineHeight="1.8">
                  {children}
                </Text>
              );
            },
            h1({ children }) {
              return (
                <Heading as="h1" size="lg" mt={6} mb={3} lineHeight="1.3">
                  {children}
                </Heading>
              );
            },
            h2({ children }) {
              return (
                <Heading as="h2" size="md" mt={6} mb={3} lineHeight="1.35">
                  {children}
                </Heading>
              );
            },
            h3({ children }) {
              return (
                <Heading as="h3" size="sm" mt={5} mb={2} lineHeight="1.4">
                  {children}
                </Heading>
              );
            },
            h4({ children }) {
              return (
                <Heading as="h4" size="xs" mt={4} mb={2} lineHeight="1.4">
                  {children}
                </Heading>
              );
            },
            h5({ children }) {
              return (
                <Heading as="h5" size="xs" mt={4} mb={2} lineHeight="1.4">
                  {children}
                </Heading>
              );
            },
            h6({ children }) {
              return (
                <Heading as="h6" size="xs" mt={4} mb={2} lineHeight="1.4" textTransform="uppercase">
                  {children}
                </Heading>
              );
            },
            table({ children }) {
              return <Table size="xs" my={4}>{children}</Table>;
            },
            thead({ children }) {
              return <Thead>{children}</Thead>;
            },
            tbody({ children }) {
              return <Tbody>{children}</Tbody>;
            },
            tr({ children }) {
              return <Tr>{children}</Tr>;
            },
            th({ children }) {
              return <Th>{children}</Th>;
            },
            td({ children }) {
              return <Td>{children}</Td>;
            },
            img({ children, ...props }) {
              return (
                <Image alt="image" my={4} borderRadius="md" {...props}>
                  {children}
                </Image>
              );
            },
            ul({ children, ...props }) {
              return (
                <UnorderedList {...omitMarkdownListProps(props)} pl={5} spacing={2} my={4}>
                  {children}
                </UnorderedList>
              );
            },
            ol({ children, ...props }) {
              return (
                <OrderedList {...omitMarkdownListProps(props)} pl={5} spacing={2} my={4}>
                  {children}
                </OrderedList>
              );
            },
            li({ children, ...props }) {
              return (
                <ListItem {...omitMarkdownListProps(props)} pl={1}>
                  {children}
                </ListItem>
              );
            },
          }}
        >
          {children || placeHolderText || ''}
        </ReactMarkdown>
      </Box>
    );
  }
);

Markdown.displayName = 'Markdown';

export default memo(Markdown);
