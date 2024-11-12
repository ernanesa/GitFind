import { useState } from "react";
import { Header } from "../../components/Header";
import ItemList from "../../components/ItemList";
import "./styles.css";

function App() {
  const [user, setUser] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [repositories, setRepositories] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${user}`);
      if (!response.ok) throw new Error("User not found");

      const { login, name, bio, avatar_url } = await response.json();
      setCurrentUser({ login, name, bio, avatar_url });

      const reposResponse = await fetch(`https://api.github.com/users/${user}/repos`);
      const dataRepositories = await reposResponse.json();
      setRepositories(dataRepositories);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setCurrentUser(null);
      setRepositories([]);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="content">
        <div className="info">
          <div className="input">
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Enter GitHub username"
              className="user-input"
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {currentUser && (
            <div className="profile">
              <img src={currentUser.avatar_url} alt="Avatar" className="profile-img" />
              <div className="profile-info">
                <h3>{currentUser.name}</h3>
                <span>@{currentUser.login}</span>
                <p>{currentUser.bio}</p>
              </div>
            </div>
          )}
          <hr />
          <h4 className="repositories-title">Repositories</h4>
          <div>
            {repositories.map((repo) => (
              <ItemList
                key={repo.id}
                title={<a href={`https://github.com/${user}/${repo.name}`} target="_blank" rel="noopener noreferrer" className="repository-link">{repo.name}</a>}
                description={repo.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
