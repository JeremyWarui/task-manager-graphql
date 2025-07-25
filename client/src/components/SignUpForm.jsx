import { useMutation } from "@apollo/client";
import { useState } from "react";
import { CREATE_USER } from "./queries";

const SignUpForm = ({ setError, goToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [createUser] = useMutation(CREATE_USER, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
    onCompleted: () => goToLogin(),
  });

  const submit = (event) => {
    event.preventDefault();

    createUser({ variables: { username, password } });

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
              placeholder="set your username..."
            />
          </div>
        </div>
        <div>
          <label>password</label>
          <div>
            <input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="create password..."
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
            sign up!
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
