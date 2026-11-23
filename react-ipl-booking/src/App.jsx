
import { useState, useEffect } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";
import { supabase } from "./supabase";

function App() {
  const [matches, setMatches] = useState([]);
  const [team, setTeam] = useState("All");
  const [loading, setLoading] = useState(true);

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [userName, setUserName] = useState("");
  const [tickets, setTickets] = useState(1);
  const [message, setMessage] = useState("");

  // Fetch matches from Supabase
  async function fetchMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching matches:", error.message);
      setMessage("Could not load matches: " + error.message);
    } else {
      setMatches(data || []);
    }

    setLoading(false);
  }

  // Initial fetch and realtime subscription
  useEffect(() => {
    fetchMatches();

    const channel = supabase
      .channel("matches-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
        },
        () => {
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Select a match for booking
  function handleBook(match) {
    setSelectedMatch(match);
    setTickets(1);
    setMessage("");

    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }

  // Insert booking and update available seats
  async function handleBooking(e) {
    e.preventDefault();
    setMessage("");

    if (!selectedMatch) {
      setMessage("Please select a match first.");
      return;
    }

    const quantity = Number(tickets);

    if (!userName.trim() || quantity < 1 || !Number.isInteger(quantity)) {
      setMessage("Enter a valid name and ticket quantity.");
      return;
    }

    if (quantity > selectedMatch.available_seats) {
      setMessage("Not enough seats available.");
      return;
    }

    const totalPrice = selectedMatch.price * quantity;

    // Update available seats only if enough seats remain
    const { data: updatedMatch, error: updateError } = await supabase
      .from("matches")
      .update({
        available_seats: selectedMatch.available_seats - quantity,
      })
      .eq("id", selectedMatch.id)
      .gte("available_seats", quantity)
      .select()
      .maybeSingle();

    if (updateError) {
      setMessage("Seat update failed: " + updateError.message);
      return;
    }

    if (!updatedMatch) {
      setMessage("Seats are no longer available. Please refresh and try again.");
      await fetchMatches();
      return;
    }

    // Insert booking record
    const { error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          match_id: selectedMatch.id,
          user_name: userName.trim(),
          match_title: selectedMatch.team1 + " vs " + selectedMatch.team2,
          tickets: quantity,
          total_price: totalPrice,
        },
      ]);

    if (bookingError) {
      setMessage("Booking failed: " + bookingError.message);

      // Restore seats if booking insertion fails
      await supabase
        .from("matches")
        .update({
          available_seats: selectedMatch.available_seats,
        })
        .eq("id", selectedMatch.id);

      await fetchMatches();
      return;
    }

    setMessage("Booking successful! Total: ₹" + totalPrice);
    setUserName("");
    setTickets(1);
    setSelectedMatch(null);

    await fetchMatches();
  }

  // Filter matches by first team
  const filteredMatches =
    team === "All"
      ? matches
      : matches.filter(
          (match) => match.team1 === team || match.team2 === team
        );

  const teams = [
    ...new Set(matches.flatMap((match) => [match.team1, match.team2])),
  ];

  return (
    <>
      <Navbar />
      <Hero />

      <section id="matches">
        <h1>Upcoming Matches</h1>

        <select
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        >
          <option value="All">All Teams</option>
          {teams.map((teamName) => (
            <option key={teamName} value={teamName}>
              {teamName}
            </option>
          ))}
        </select>

        {loading ? (
          <p>Loading matches...</p>
        ) : filteredMatches.length === 0 ? (
          <p>No matches found.</p>
        ) : (
          <div className="match-container">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onBook={handleBook}
              />
            ))}
          </div>
        )}
      </section>

      <section id="booking" className="booking-section">
        <h1>Book Your Tickets</h1>

        {selectedMatch ? (
          <>
            <h3>
              {selectedMatch.team1} vs {selectedMatch.team2}
            </h3>

            <p>Venue: {selectedMatch.venue}</p>
            <p>Price per ticket: ₹{selectedMatch.price}</p>
            <p>Available seats: {selectedMatch.available_seats}</p>

            <form onSubmit={handleBooking}>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />

              <input
                type="number"
                min="1"
                max={selectedMatch.available_seats}
                value={tickets}
                onChange={(e) => setTickets(e.target.value)}
                required
              />

              <p>
                Total Price: ₹
                {selectedMatch.price * Number(tickets || 0)}
              </p>

              <button type="submit">
                Confirm Booking
              </button>
            </form>
          </>
        ) : (
          <p>Select a match and click Book Ticket to continue.</p>
        )}

        {message && <p className="booking-message">{message}</p>}
      </section>
    </>
  );
}

export default App;
