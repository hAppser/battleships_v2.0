import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }: any) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  function logInUser() {
    if (!username.trim()) {
      return;
    }
    onLogin && onLogin(username);
  }
  return (
    <form className="login" onSubmit={logInUser}>
      <div className="login__profile">
        <p className="login__greatings">Ahoy, Captain!</p>
        <p className="login__userNickname">Enter your nickname </p>
      </div>
      <input
        name="username"
        onInput={(e: React.FormEvent<HTMLInputElement>) =>
          setUsername(e.currentTarget.value)
        }
        className="login-control"
      />
      <button
        type="submit"
        onClick={() => {
          logInUser();
          navigate("/menu");
          localStorage.username = username;
        }}
        className=""
      >
        Join
      </button>
    </form>
  );
}
