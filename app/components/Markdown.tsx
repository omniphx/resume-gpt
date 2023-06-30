import React, { forwardRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  Box,
  ChakraProps,
  Code,
  Image,
  Link,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from '@chakra-ui/react';
import remarkGfm from 'remark-gfm';

type MarkdownProps = ChakraProps & {
  children?: string;
  placeHolderText?: string;
};

const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  ({ fontSize = '1em', children, placeHolderText, ...rest }, ref) => {
    return (
      <Box ref={ref} {...rest} fontSize={fontSize} lineHeight={'1.5'}>
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
                <Code
                  className={className}
                  {...props}
                  fontSize={fontSize}
                >
                  {children}
                </Code>
              );
            },
            a({ children, ...props }) {
              return (
                <Link {...props} overflowWrap="anywhere">
                  {children}
                </Link>
              );
            },
            table({ children }) {
              return <Table size="xs">{children}</Table>;
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
                <Image alt="image" {...props}>
                  {children}
                </Image>
              );
            },
            ul({ children, ...props }) {
              return (
                <UnorderedList {...props}>
                  {children}
                </UnorderedList>
              );
            },
            ol({ children, ...props }) {
              return (
                <OrderedList {...props}>
                  {children}
                </OrderedList>
              );
            },
            li({ children, ...props }) {
              return (
                <ListItem {...props}>
                  {children}
                </ListItem>
              );
            }
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
