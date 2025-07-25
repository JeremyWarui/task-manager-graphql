import { useApolloClient, useQuery } from "@apollo/client";
import { ALL_TASKS, CURRENT_USER } from "./components/queries";
import TasksView from "./components/TaskView";
import NewTaskForm from "./components/NewTaskForm";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

const App = () => {
  const [token, setToken] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [error, setError] = useState("");
  const client = useApolloClient();
  const results = useQuery(ALL_TASKS, {
    skip: !token,
  });
  const { data: userData } = useQuery(CURRENT_USER, {
    skip: !token,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("taskManagerUser");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.clearStore();
  };

  if (results.loading) {
    return <div>...loading</div>;
  }

  if (!token) {
    return (
      <div
        style={{
          margin: "10px 20px",
          padding: "5px 15px",
        }}
      >
        <h2>{showSignUp ? "Sign Up" : "Login"} </h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {showSignUp ? (
          <SignUpForm
            setError={setError}
            goToLogin={() => setShowSignUp(false)}
          />
        ) : (
          <LoginForm
            setToken={setToken}
            setError={(message) => {
              setError(message);
              if (message === "wrong credentials") setShowSignUp(true);
            }}
          />
        )}
        <button
          style={{
            margin: "10px 20px",
            padding: "5px 15px",
          }}
          onClick={() => setShowSignUp(!showSignUp)}
        >
          {showSignUp ? "Back to login" : "Don't have an account, Sign Up!"}
        </button>
      </div>
    );
  }
  // console.log(results.data?.allTasks);

  return (
    <div>
      <h1 className="text-center">Personal Task Manager</h1>
      <hr />
      <h5 style={{ marginLeft: "150px", marginBottom: "20px" }}>
        Welcome <b>{userData?.me?.username || ""}</b>
      </h5>

      <Container>
        <Row className="justify-content-md-center">
          <Col sm={7}>
            <TasksView />
          </Col>
          <Col sm={1}></Col>
          <Col className="mr-6" sm={4}>
            <NewTaskForm />
            <div style={{ margin: "100px 200px" }}>
              <button onClick={logout}>logout</button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
