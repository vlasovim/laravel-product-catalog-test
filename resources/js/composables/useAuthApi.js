import {useApiClient} from './useApiClient.js';
import {useAuthState} from "./useAuthState.js";

export function useAuthApi() {
    const {post} = useApiClient();
    const {setToken, resetToken} = useAuthState();

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
        } catch (error) {
            throw error;
        } finally {
            resetToken();
        }
    }

    return {
        login,
        logout
    }
}
