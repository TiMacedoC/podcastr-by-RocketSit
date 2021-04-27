import "../styles/global.scss"

import { Header } from "../components/Hearder"
import { Player } from "../components/Player"
import { PlayerContext } from "../context/PlayerContext";
import { PlayerContextProvider } from "../context/PlayerContext";

import styles from "../styles/app.module.scss";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider >
  )
}

export default MyApp
