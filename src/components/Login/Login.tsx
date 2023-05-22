import { useState } from "react";

export default function Login({ onLogin, sendMessage }: any) {
  const [username, setUsername] = useState("");

  function logInUser() {
    if (!username.trim()) {
      return;
    }
    sendMessage(username);
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
      <button type="submit" onClick={() => logInUser()} className="">
        Join
      </button>
    </form>
  );
}
