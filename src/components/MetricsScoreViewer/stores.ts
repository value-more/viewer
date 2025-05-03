import { createEvent, createStore } from 'effector';

export const $chartData = createStore<any>(null);
export const setChartData = createEvent<any>();

$chartData.on(setChartData, (_, state) => state);

export const $globalScore = createStore<number>(0);
export const setGlobalScore = createEvent<number>();

$globalScore.on(setGlobalScore, (_, state) => state);
