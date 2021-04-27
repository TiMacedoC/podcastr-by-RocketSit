
import { createContext, useState, ReactNode } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function playNext() {
        if (isShuffling) {
            const nexRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nexRandomEpisodeIndex)
        } else {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }


    }

    function playPrevious() {
        if (currentEpisodeIndex > 0) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
            setIsShuffling(false);
        }

    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                play,
                playList,
                isPlaying,
                togglePlay,
                isLooping,
                toggleLoop,
                isShuffling,
                toggleShuffle,
                setPlayingState,
                playPrevious,
                playNext
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}