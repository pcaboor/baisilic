// src/hooks/useUser.ts
import { api } from '~/trpc/react'

const useUserDb = () => {
    const { data: user, isLoading } = api.user.getUser.useQuery();

    return {
        user,
        isLoading,
        credits: user?.credits ?? 0,
        firstName: user?.firstName,
        lastName: user?.lastName,
        imageUrl: user?.imageurl,
        email: user?.emailAdress
    }
}

export default useUserDb;