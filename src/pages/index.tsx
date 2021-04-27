import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link'
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api';
import { fileURLToPath } from 'node:url';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

type Episodes = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  latestEpisodes: Episodes[];
  allEpisodes: Episodes[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = useContext(PlayerContext);

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>
          Home | Podcastr
        </title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <img
                  // arrumar o tamanho da imagem 192x192
                  width={210}
                  height={180}
                  src={episode.thumbnail}
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os Episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }} >
                    <img src={episode.thumbnail} />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)} >
                      <img src="/play-green.svg" alt="Tocar" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  //formata os dados
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}