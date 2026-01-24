import {useApi} from './useApi';
import {useApiToken} from "./useApiToken.js";

export function useAuthApi() {
    const {post} = useApi();
    const {setToken, resetToken} = useApiToken();

    const login = async (credentials) => {
        try {
            const data = await post('/login', credentials);

            setToken(data.data.token);

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    const logout = async () => {
        try {
            await post('/logout');
        } finally {
            resetToken();
        }
    }

    return {
        login,
        logout
    }
}
