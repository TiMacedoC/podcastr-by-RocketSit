import { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import styles from "./styles.module.scss";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0)

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
    } = useContext(PlayerContext);

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        {
            isPlaying ? (
                audioRef.current.play()
            ) : (
                audioRef.current.pause()
            )
        }
    }, [isPlaying])

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount)
    }

    function handleEpisodeEnded() {
        if (!episode || (currentEpisodeIndex == (episodeList.length - 1)) && !isShuffling) {
            return
        } else {
            playNext()
        }
    }

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" />
                <strong>Tocando Agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <img src={episode.thumbnail} />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um Podcast para ouvir</strong>
                </div>
            )}



            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)} </span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {/* AQUI ENTRAM OS ARQUIVOS DE AUDIO */}

                {episode && (
                    <div>
                        <audio
                            src={episode.url}
                            ref={audioRef}
                            loop={isLooping}
                            autoPlay
                            onEnded={handleEpisodeEnded}
                            onPlay={() => setPlayingState(true)}
                            onPause={() => setPlayingState(false)}
                            onLoadedMetadata={setupProgressListener}
                        />
                    </div>
                )}

                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length == 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src='/shuffle.svg' />
                    </button>
                    <button
                        type="button"
                        onClick={playPrevious}
                        disabled={
                            !episode ||
                            (currentEpisodeIndex == 0)
                        }>

                        <img src='/play-previous.svg' />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        {isPlaying ? (
                            <img src='/pause.svg' />
                        ) : (
                            <img src='/play.svg' />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={playNext}
                        disabled={(!episode || (currentEpisodeIndex == (episodeList.length - 1)) && !isShuffling)
                        }>

                        <img src='/play-next.svg' />
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src='/repeat.svg' />
                    </button>
                </div>
            </footer>
        </div>
    )
}