import { useState } from "react";
import "./App.css";

function App() {
  const [players] = useState([
    {id:1,name:"Messi",role:"Forward"},
    {id:2,name:"Ronaldo",role:"Forward"},
    {id:3,name:"Ramos",role:"Defender"},
    {id:4,name:"Ozil",role:"Playmaker"},
  ]);

  const [search, setSearch] = useState("");


  const filteredPlayers = players.filter((player) =>
    player.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Sports Team</h1>

      
      <input
        type="text"
        placeholder="Search by role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      
      <div className="grid">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <div key={player.id} className="card">
              <h2>{player.name}</h2>
              <p>
                <strong>Role:</strong> {player.role}
              </p>
            </div>
          ))
        ) : (
          <p>No players found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
