import { createEffect, createEvent, createStore, sample } from 'effector';
import { v4 as uuidv4 } from 'uuid';
import { WS_HOST } from '../../../api/invData';

export const AINAme = 'Charlie';

export interface Message {
    direction: 'incoming' | 'outgoing';
    message: string;
    position: 'first' | 'single' | 'last';
    sender?: string;
}

export interface InitConversationData {
    companyCik: number;
    companyName: string;
}

const $id = createStore<string | null>(null);
const $companyCik = createStore<number | null>(null);
const $messages = createStore<Message[]>([]);
const $isTyping = createStore<boolean>(false);
const $webSocket = createStore<any>(null);

const initConversation = createEvent<InitConversationData>();
const appendDataToLastMessage = createEvent<string>();
const appendMessage = createEvent<Message>();
const connectWebSocket = createEvent();
const disconnectWebSocket = createEvent();
const receiveMessage = createEvent<string>();
const sendMessage = createEvent<Message>();
const setIsTyping = createEvent<boolean>();

$companyCik.on(initConversation, (_, { companyCik }) => companyCik);
$id.on(initConversation, () => uuidv4());
$isTyping.on(setIsTyping, (_, isTyping) => isTyping);

$messages
    .on(initConversation, (_, { companyName }) => [
        {
            direction: 'incoming',
            position: 'first',
            sender: AINAme,
            message: `Hello my friend, please <u>ask me</u> anything you want to know about the <b>${companyName}</b>. I will do my best to help you.
I have access to fundamentals, metrics, price, ... You could ask me if I find any <b>anomalies</b> in the <u>fundamentals</u> <i>, in the <u>calculated metrics</u> or for an analysis of the company for instance.`
        }
    ])
    .on(appendMessage, (state, message) => [...state, message])
    .on(appendDataToLastMessage, (state, data) => {
        const lastMessage = state[state.length - 1];
        if (lastMessage) {
            lastMessage.message += data;
        }
        return [...state];
    })
    .on(sendMessage, (state, message) => [...state, message]);

$webSocket
    .on(connectWebSocket, () => new WebSocket(WS_HOST))
    .reset(disconnectWebSocket)
    .watch((socket) => {
        if (!socket) return;
        socket.onmessage = (event: any) => {
            const data = JSON.parse(event.data);
            if (data.error) {
                alert(data.error);
                return;
            }
            if (data.status === 'start') {
                setIsTyping(true);
                return;
            }
            if (data.status === 'end') {
                setIsTyping(false);
                return;
            }
            receiveMessage(data.text);
        };
        socket.onclose = () => disconnectWebSocket();
    });

const sendMessageFx = createEffect(
    ({
        socket,
        companyCik,
        uuid,
        message
    }: {
        socket: any;
        companyCik: number;
        uuid: string;
        message: string;
    }) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    key: 'companyAssistant',
                    data: { prompt: message, companyCik, uuid },
                    token: localStorage.getItem('token')
                })
            );
        }
    }
);

const resetAndNewConnexion = createEffect(
    (socket: any, uuid: string | null) => {
        try {
            socket?.send(
                JSON.stringify({
                    key: 'companyAssistantRemoveCache',
                    data: { uuid },
                    token: localStorage.getItem('token')
                })
            );
            socket?.close();
        } catch (e) {
            // do nothing
        }
        connectWebSocket();
    }
);

sample({
    source: [$webSocket, $id],
    clock: initConversation,
    target: resetAndNewConnexion
});

sample({
    clock: receiveMessage,
    fn: (message: string): Message => ({
        direction: 'incoming',
        position: 'last',
        sender: AINAme,
        message
    }),
    target: appendMessage
});

sample({
    source: [$companyCik, $webSocket, $id],
    clock: sendMessage,
    fn: ([companyCik, socket, id], data) => ({
        socket,
        companyCik,
        message: data.message,
        uuid: id
    }),
    target: sendMessageFx
});

export const messagesStores = {
    $messages,
    $isTyping,
    $companyCik
};

export const messagesEvents = {
    initConversation,
    sendMessage
};
