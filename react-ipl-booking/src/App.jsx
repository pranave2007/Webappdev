import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";

function App() {
  const [team, setTeam] = useState("All");

  const matches = [
    {
      teams: "CSK vs RCB",
      date: "25 November 2026",
      venue: "Chennai",
      price: 1500,
      team: "CSK",
    },
    {
      teams: "MI vs DC",
      date: "27 November 2026",
      venue: "Mumbai",
      price: 1200,
      team: "MI",
    },
    {
      teams: "RCB vs MI",
      date: "29 November 2026",
      venue: "Bengaluru",
      price: 1800,
      team: "RCB",
    },
  ];

  const filteredMatches =
    team === "All"
      ? matches
      : matches.filter((match) => match.team === team);

  return (
    <>
      <Navbar />
      <Hero />

      <section id="matches">
        <h1>Upcoming Matches</h1>

        <select value={team} onChange={(e) => setTeam(e.target.value)}>
          <option value="All">All Teams</option>
          <option value="CSK">CSK</option>
          <option value="MI">MI</option>
          <option value="RCB">RCB</option>
        </select>

        <div className="match-container">
          {filteredMatches.map((match, index) => (
            <MatchCard
              key={index}
              teams={match.teams}
              date={match.date}
              venue={match.venue}
              price={match.price}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default App;
