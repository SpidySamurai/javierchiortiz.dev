import useSWR from 'swr';
import type { LanyardResponse, LanyardData } from '@/types/lanyard';

const LANYARD_API = 'https://api.lanyard.rest/v1';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface UseLanyardOptions {
    userId: string;
    refreshInterval?: number;
}

export function useLanyard({ userId, refreshInterval = 5000 }: UseLanyardOptions) {
    const { data, error, isLoading } = useSWR<LanyardResponse>(
        userId ? `${LANYARD_API}/users/${userId}` : null,
        fetcher,
        {
            refreshInterval,
            revalidateOnFocus: true,
        }
    );

    return {
        data: data?.data as LanyardData | undefined,
        isLoading,
        error,
    };
}
