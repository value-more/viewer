import { attach, createEffect, createEvent, createStore } from 'effector';
import { TestConfig } from '../types';
import { api } from '../../../../../api/invData';

const defaultConfig = { name: 'New Test', data: {} };

export const $activeConfig = createStore<TestConfig>(defaultConfig);
export const setActiveConfig = createEvent<TestConfig | null>();
$activeConfig.on(setActiveConfig, (_, state) => state || defaultConfig);

export const removeActiveConfigFx = attach({
    source: $activeConfig,
    mapParams: (_, config) => ({ id: config?._id || '' }),
    effect: createEffect(
        async ({ id }: { id: string }) =>
            await api(`invData/companies/metrics/formulas/tests`, {
                method: 'DELETE',
                body: JSON.stringify({ id })
            })
    )
});

export const saveActiveConfigFx = attach({
    source: $activeConfig,
    effect: createEffect(
        async (config: TestConfig) =>
            await api(`invData/companies/metrics/formulas/tests`, {
                method: 'POST',
                body: JSON.stringify(config)
            })
    )
});
