import React, { useEffect } from 'react';
import { useUnit } from 'effector-react';
import {
    ChatContainer,
    ConversationHeader,
    MessageList,
    Message,
    Avatar,
    TypingIndicator,
    MessageInput
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { AINAme, messagesStores, messagesEvents } from './state';

export interface ChatAssistantProps {
    companyCik: number;
    companyName: string;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
    companyCik,
    companyName
}) => {
    const companyCikStore = useUnit(messagesStores.$companyCik);
    const messages = useUnit(messagesStores.$messages);
    const isTyping = useUnit(messagesStores.$isTyping);

    useEffect(() => {
        if (companyCikStore !== companyCik) {
            messagesEvents.initConversation({ companyCik, companyName });
        }
    }, [companyCik]);

    return (
        <ChatContainer>
            <ConversationHeader>
                <Avatar src={`${process.env.PUBLIC_URL}/charlie_120.png`} />
                <ConversationHeader.Content
                    info="I might be wrong or a bit slow sometimes, please be patient. I can only remember this conversation."
                    userName={AINAme}
                />
            </ConversationHeader>
            <MessageList
                typingIndicator={
                    isTyping ? (
                        <TypingIndicator content={`${AINAme} is typing`} />
                    ) : undefined
                }
            >
                {messages.map((message, index) => (
                    <Message key={index} model={message}></Message>
                ))}
            </MessageList>
            <MessageInput
                sendDisabled={isTyping}
                attachButton={false}
                autoFocus
                placeholder="Type your message here"
                onSend={(innerHtml, textContent) =>
                    messagesEvents.sendMessage({
                        direction: 'outgoing',
                        message: textContent,
                        position: 'last'
                    })
                }
            />
        </ChatContainer>
    );
};
