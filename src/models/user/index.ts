import { createEffect, createEvent, createStore } from 'effector';

export interface User {
    name?: string;
    email?: string;
    rights: { [key: string]: boolean };
}

export const $user = createStore<User | null>(null);
export const setUser = createEvent<User>();

export const logoutFx = createEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
});

$user.on(setUser, (_, state) => state).on(logoutFx.doneData, () => null);

const loadUser = () => {
    const str = localStorage.getItem('user');
    const user = str ? JSON.parse(str) : null;
    if (user) setUser(user);
};
loadUser();
