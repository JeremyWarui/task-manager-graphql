import { useApolloClient, useQuery } from "@apollo/client";
import { ALL_TASKS } from "./components/queries";
import TasksView from "./components/TaskView";
import NewTaskForm from "./components/NewTaskForm";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const results = useQuery(ALL_TASKS, {
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
    client.resetStore();
  };

  if (results.loading) {
    return <div>...loading</div>;
  }

  if (!token) {
    return (
      <div>
        <h2>login</h2>
        <LoginForm setToken={setToken} />
      </div>
    );
  }
  // console.log(results.data?.allTasks);

  return (
    <div>
      <h1 className="text-center">Personal Task Manager</h1>
      <hr />

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
