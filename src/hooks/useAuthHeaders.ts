import { useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const useAuthHeaders = () => {
    const { getAccessTokenSilently } = useAuth0();

    return useCallback(async () => {
        const token = await getAccessTokenSilently();
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }, [getAccessTokenSilently]);
};
