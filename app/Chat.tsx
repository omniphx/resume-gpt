'use client';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Fragment, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { BsGithub } from 'react-icons/bs';
import { VscRefresh } from 'react-icons/vsc';
import Markdown from './components/Markdown';

const UserAvatar = () => {
  return (
    <Flex flexShrink={0}>
      <Avatar size="sm" color="white" bg="blue.500" borderRadius="8px" mt={1} />
    </Flex>
  );
};

const AssistantAvatar = () => {
  return (
    <Flex flexShrink={0}>
      <Avatar
        src="https://avatars.githubusercontent.com/u/3722405?v=4"
        size="sm"
        color="white"
        bg="blue.500"
        borderRadius="8px"
        name="GPT"
        mt={1}
      />
    </Flex>
  );
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
      setMessage('');
      let newMessages: Message[] = [...messages, { role: 'user', content: message }];
      setMessages(newMessages);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Error sending data');
      }

      if (response.body) {
        const reader = response.body.getReader();
        reader.read().then(function processResult(result) {
          const decoder = new TextDecoder();
          let chunk = '';
          chunk += decoder.decode(result.value, { stream: true });

          // Split chunk into individual data objects
          const dataObjects = chunk.split('\n').filter(Boolean);
          // Process latest data object
          const latestData = dataObjects[dataObjects.length - 1].replace(/^data: /, '');
          if (latestData === '[DONE]') {
            reader.cancel();
            setIsLoading(false);
          } else {
            dataObjects.forEach((data) => {
              const prepData = data.replace(/^data: /, '');
              console.log(prepData);
              const jsonData = JSON.parse(prepData);
              if (jsonData.choices) {
                const { content, role } = jsonData.choices[0].delta;

                if (role === 'assistant') {
                  newMessages = [...newMessages, { role, content }];
                  setMessages(newMessages);
                } else if (!!content) {
                  const lastMessage = newMessages[newMessages.length - 1];
                  lastMessage.content += content;
                  setMessages([...newMessages.slice(0, newMessages.length - 1), lastMessage]);
                }
              }
            });
            reader.read().then(processResult);
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (message.trim().length <= 0) return;
    if (isLoading) return;
    if (event.shiftKey) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([]);
  };

  const Example = ({ question }: { question: string }) => (
    <Flex>
      <Button
        colorScheme="blue"
        variant="link"
        onClick={() => {
          setMessage(question);
          textAreaRef.current?.focus();
        }}
      >
        {question}
      </Button>
    </Flex>
  );

  return (
    <>
      <Flex
        flexDir="column"
        gap={40}
        justify="space-between"
        flex={1}
        height="100%"
        overflowY="auto"
        w="full"
        padding="24px"
      >
        <Flex
          flexDir="column"
          align="center"
          gap={2}
          paddingBottom="150px"
          maxW={1100}
          margin="0 auto"
        >
          <Heading as="h1" size="lg">
            ResumeGPT - Matthew &quot;Marty&quot; Mitchener
          </Heading>
          <Text as="p" textAlign="center">
            ResumeGPT is an AI chatbot powered by OpenAI&apos;s chat completion API. Developed using
            NextJS and hosted on Vercel, this site enables you to inquire about my resume or ask
            questions specifically about the chatbot itself.
          </Text>
          <Link href="https://github.com/omniphx/resume-gpt" isExternal>
            <Flex align="center" gap={2} fontWeight="600" mb={2}>
              <BsGithub /> View this project on github
            </Flex>
          </Link>
          {messages.map((message, index) => (
            <Fragment key={index}>
              <Divider />
              <Flex key={index} my={4} w="full">
                {message.role === 'assistant' ? <AssistantAvatar /> : <UserAvatar />}
                <Box px={4} py={2} ml={4}>
                  <Markdown>{message.content}</Markdown>
                </Box>
              </Flex>
            </Fragment>
          ))}
        </Flex>
      </Flex>
      {messages.length === 0 && (
        <Flex position="absolute" w="full" justify="center" align="center" top={0} height="100vh">
          <Flex flexDir="column" gap={2}>
            <Heading as="h3" size="sm">
              Try some of the following questions:
            </Heading>
            <Flex flexDir="column" justify="flex-start" gap={2} ml={4}>
              <Example question="What is your job experience?" />
              <Example question="What are your preferred programming languages?" />
              <Example question="What are some of your notable software projects?" />
              <Example question="What is your education?" />
            </Flex>
          </Flex>
        </Flex>
      )}
      <Box
        w="full"
        position="absolute"
        pointerEvents="none"
        bottom="0"
        left="0"
        bg="linear-gradient(transparent, 50%, rgb(26, 32, 44))"
        paddingX={{ base: 0, md: 4 }}
      >
        <Stack
          spacing={4}
          mt={16}
          position="relative"
          marginX={{ base: 0, md: 'auto' }}
          maxW={{ base: '100%', md: '43em', xl: '75em' }}
          marginBottom={{ base: 0, md: 50 }}
          pointerEvents="all"
        >
          <InputGroup size="md">
            <Textarea
              ref={textAreaRef}
              bg="rgb(26, 32, 44)"
              resize="none"
              placeholder="Type here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              borderRadius={{ base: 0, md: '6px' }}
              borderWidth={{ base: 0, md: '1px' }}
              borderTopWidth="1px"
              paddingRight="50px"
            />
            <InputRightElement width="6em" mt={1}>
              <IconButton
                aria-label="Reset"
                disabled={isLoading}
                variant="ghost"
                icon={<VscRefresh />}
                colorScheme="blue"
                onClick={handleReset}
              />
              <IconButton
                aria-label="Send"
                disabled={isLoading}
                variant="ghost"
                icon={<FaPaperPlane />}
                colorScheme="blue"
                onClick={handleSendMessage}
              />
            </InputRightElement>
          </InputGroup>
        </Stack>
      </Box>
    </>
  );
}
