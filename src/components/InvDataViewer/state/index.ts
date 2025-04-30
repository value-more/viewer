import { createEvent, createStore } from "effector";

const $indexes = createStore<number[]|null>(null);
const setIndexes = createEvent<number[]>();
$indexes.on(setIndexes, (_, state) => state);

export const viewerStores = {
    $indexes
}

export const viewerEvents = {
    setIndexes
}