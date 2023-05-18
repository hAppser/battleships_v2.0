import React, { useEffect, useRef, useState } from "react";

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to the WebSocket server
    socketRef.current = new WebSocket("ws://localhost:8080");

    // Clean up the WebSocket connection on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(`Username: ${message}`);
    }
  };
  function LoginSection({ onLogin }: any) {
    const [username, setUsername] = useState("");

    function logInUser() {
      if (!username.trim()) {
        return;
      }
      sendMessage(username);
      onLogin && onLogin(username);
    }
    return (
      <div className="account">
        <div className="account__wrapper">
          <div className="account__card">
            <div className="account__profile">
              <p className="account__greatings">Ahoy, Captain!</p>
              <p className="account__sub">Enter your nickname </p>
            </div>
            <input
              name="username"
              onInput={(e: React.FormEvent<HTMLInputElement>) =>
                setUsername(e.currentTarget.value)
              }
              className="form-control"
            />
            <button
              type="button"
              onClick={() => logInUser()}
              className="btn btn-primary account__btn"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <nav color="light">
        <div>Battleship</div>
      </nav>
      <main className="main">
        {username ? "<MainMenu />" : <LoginSection onLogin={setUsername} />}
      </main>
    </div>
  );
};

export default App;
