import React from 'react'

export function Privacy() {
  return (
    <div className="about">
      <h1>Privacy</h1>
      <p>
        PitchFinder is free to use and does not track you. This page says what the site stores,
        where, and why.
      </p>

      <h2>Without an account</h2>
      <p>
        Browsing, ranking and pitch pages store nothing about you on our side. The places you type
        are sent to postcodes.io (postcodes), OpenStreetMap&rsquo;s Nominatim (place names) and OSRM
        (journey routes) to be looked up; each receives only the text or coordinates needed for that
        lookup. Your browser keeps a short list of recent places and a random key that lets you
        change an answer on a game page. Both stay on your device.
      </p>

      <h2>With an account</h2>
      <p>
        Signing in uses Supabase Auth with a magic link or Google. We store your email address, the
        display name you choose, the pitches and groups you save, the games you create and the
        answers given to them. Nobody else can read your saved pitches or groups. A game is visible
        to anyone who has its link, and shows the names people gave when they answered.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        No analytics, no advertising, no third-party cookies. A signed-in session is kept in your
        browser&rsquo;s local storage by Supabase so you stay signed in.
      </p>

      <h2>Map tiles</h2>
      <p>
        The base map is served by OpenFreeMap; your browser requests the tiles for the area you are
        looking at, as any map site does.
      </p>

      <h2>Deleting your data</h2>
      <p>
        Sign out from My games at any time. To have an account and everything attached to it
        removed, open an issue on the project&rsquo;s GitHub repository or email the address on it.
      </p>
    </div>
  )
}
