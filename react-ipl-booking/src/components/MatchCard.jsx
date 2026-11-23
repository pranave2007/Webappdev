
function MatchCard(props) {
  return (
    <div className="match-card">
      <h2>{props.teams}</h2>
      <p>Date: {props.date}</p>
      <p>Venue: {props.venue}</p>
      <p>Price: ₹{props.price}</p>

      <button onClick={() => alert("Selected " + props.teams)}>
        Book Ticket
      </button>
    </div>
  );
}

export default MatchCard;
