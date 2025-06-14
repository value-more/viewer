import { useUnit } from 'effector-react';
import { $user } from '.';

export const useUser = () => {
    return useUnit($user);
};

export const useUserRights = () => {
    const user = useUnit($user);
    return user?.rights;
};
