import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/redux";
import { setUsername } from "../../store/reducers/gameSlice";
export default function Login() {
  const [newUsername, setNewUsername] = useState("");

  const dispath = useAppDispatch();
  const navigate = useNavigate();
  function logInUser() {
    if (!newUsername.trim()) {
      return;
    }
    setUsername && dispath(setUsername(newUsername));
    localStorage.username = newUsername;
  }
  return (
    <form className="login">
      <div className="login__profile">
        <p className="login__greatings">Ahoy, Captain!</p>
        <p className="login__userNickname">Enter your nickname </p>
      </div>
      <input
        name="username"
        onInput={(e: React.FormEvent<HTMLInputElement>) =>
          setNewUsername(e.currentTarget.value)
        }
        className="login-control"
      />
      <button
        type="submit"
        onClick={() => {
          logInUser();
          navigate("/menu");
        }}
        className=""
      >
        Join
      </button>
    </form>
  );
}
