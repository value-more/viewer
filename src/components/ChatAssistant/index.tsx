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
import {
    AINAme,
    messagesStores,
    messagesEvents,
    messagesEffects
} from './state';
import { Dropdown } from 'primereact/dropdown';

export interface ChatAssistantProps {
    companyCik: number;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ companyCik }) => {
    const companyCikStore = useUnit(messagesStores.$companyCik);
    const activeAgentId = useUnit(messagesStores.$selectedAgentId);
    const messages = useUnit(messagesStores.$messages);
    const isTyping = useUnit(messagesStores.$isTyping);
    const agents = useUnit(messagesStores.$agents);

    useEffect(() => {
        if (companyCikStore !== companyCik && agents.length) {
            messagesEffects.initConversationFx({
                companyCik
            });
        }
    }, [companyCik, activeAgentId, agents]);

    useEffect(() => {
        messagesEffects.loadAgentsFx();
    }, []);

    return (
        <ChatContainer>
            <ConversationHeader>
                <Avatar src={`${process.env.PUBLIC_URL}/charlie_120.png`} />
                <ConversationHeader.Content>
                    <div className="flex gap-2">
                        <div>{AINAme}</div>
                        <div>
                            <Dropdown
                                options={agents.map((a) => ({
                                    label: a.name,
                                    value: a._id
                                }))}
                                value={activeAgentId}
                                onChange={(event) =>
                                    messagesEvents.setSelectedAgentId(
                                        event.value
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className="text-xs">
                        I might be wrong or a bit slow sometimes, please be
                        patient. I can only remember this conversation.
                    </div>
                </ConversationHeader.Content>
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
