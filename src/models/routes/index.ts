import { createEvent, createStore } from 'effector';

const $navigateTo = createStore<string | null>(null);
const setNavigateTo = createEvent<string | null>();
$navigateTo.on(setNavigateTo, (_, state) => state);

export const navs = {
    $navigateTo,
    setNavigateTo
};
