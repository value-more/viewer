import {
    attach,
    createEffect,
    createEvent,
    createStore,
    sample
} from 'effector';
import { v4 as uuidv4 } from 'uuid';
import { api, WS_HOST } from '../../../api/invData';

export const AINAme = 'Charlie';

export interface Message {
    direction: 'incoming' | 'outgoing';
    message: string;
    position: 'first' | 'single' | 'last';
    sender?: string;
}

export interface InitConversationData {
    companyCik: number;
}

export interface Agent {
    _id: string;
    name: string;
    welcomeText: string;
}

const $id = createStore<string | null>(null);
const $companyCik = createStore<number | null>(null);
const $messages = createStore<Message[]>([]);
const $isTyping = createStore<boolean>(false);
const $webSocket = createStore<any>(null);
const $agents = createStore<Agent[]>([]);
const $selectedAgentId = createStore<string>('default');

const appendDataToLastMessage = createEvent<string>();
const appendMessage = createEvent<Message>();
const connectWebSocket = createEvent();
const disconnectWebSocket = createEvent();
const receiveMessage = createEvent<string>();
const sendMessage = createEvent<Message>();
const setIsTyping = createEvent<boolean>();
const setSelectedAgentId = createEvent<string>();

const loadAgentsFx = createEffect(async () =>
    api('invData/assistants/profiles')
);
$agents.on(loadAgentsFx.doneData, (_, state) => state);
$selectedAgentId.on(setSelectedAgentId, (_, state) => state);

const initConversationFx = attach({
    source: { $agents, $selectedAgentId },
    mapParams: (
        params: InitConversationData,
        { $agents, $selectedAgentId }
    ) => ({
        ...params,
        agent: $agents.find((a) => a._id === $selectedAgentId)!
    }),
    effect: createEffect((obj: { agent: Agent; companyCik: number }) => obj)
});

$companyCik.on(
    initConversationFx.done,
    (_, { params: { companyCik } }) => companyCik
);
$id.on(initConversationFx.done, () => uuidv4());
$isTyping.on(setIsTyping, (_, isTyping) => isTyping);

$messages
    .on(initConversationFx.doneData, (_, { agent: { welcomeText } }) => [
        {
            direction: 'incoming',
            position: 'first',
            sender: AINAme,
            message: welcomeText
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
        agentId,
        message
    }: {
        socket: any;
        companyCik: number;
        uuid: string;
        agentId: string;
        message: string;
    }) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    key: 'companyAssistant',
                    data: { prompt: message, companyCik, uuid, agentId },
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
    source: $companyCik,
    clock: $selectedAgentId.updates,
    fn: (companyCik) => ({ companyCik: companyCik! }),
    target: initConversationFx
});

sample({
    source: [$webSocket, $id],
    clock: initConversationFx.done,
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
    source: [$companyCik, $webSocket, $id, $selectedAgentId],
    clock: sendMessage,
    fn: ([companyCik, socket, id, selectedAgentId], data) => ({
        socket,
        companyCik,
        agentId: selectedAgentId,
        message: data.message,
        uuid: id
    }),
    target: sendMessageFx
});

export const messagesEffects = {
    loadAgentsFx,
    initConversationFx
};

export const messagesStores = {
    $messages,
    $isTyping,
    $companyCik,
    $agents,
    $selectedAgentId
};

export const messagesEvents = {
    sendMessage,
    setSelectedAgentId
};
