import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "./queries";

const LoginForm = ({ setToken, setError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN_USER, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("taskManagerUser", token);
    }
  }, [result.data]);

  const submit = (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
    setUsername("");
    setPassword("");
  };

  return (
    <div style={{ margin: "10px 50px" }}>
      <form onSubmit={submit}>
        <div>
          <label>username</label>
          <div>
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
        </div>
        <div>
          <label>password</label>
          <div>
            <input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
        </div>
        <div>
          <button
            style={{
              marginTop: "10px",
              padding: "5px 15px",
            }}
            type="submit"
          >
            login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
