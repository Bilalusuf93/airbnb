import { useRouter } from "next/navigation";
import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";
import { useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";


interface IUserFavorite {
    listingId: string;
    currentUser?: SafeUser | null
}

const useFavorite = ({
    listingId,
    currentUser
}: IUserFavorite) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    const hasFavorited = useMemo(() => {
        const list = currentUser?.favouritIds ?? [];

        return list.includes(listingId);
    }, [currentUser, listingId]);

    const toggleFavorited = useCallback( async(
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation();
        if (!currentUser) {
            return
        }

        let response;
        try {
            if (hasFavorited) {
                response = axios.delete(`/api/favorites/${listingId}`);
            } else {
                response = axios.post(`/api/favorites/${listingId}`);
            }

            await response;
            router.refresh();
            toast.success('Success!');
        } catch (error) {
            toast.error('Something went wrong!')
        }
    }, [listingId, hasFavorited, currentUser, router]);

    return {
        hasFavorited,
        toggleFavorited
    }
}

export default useFavorite