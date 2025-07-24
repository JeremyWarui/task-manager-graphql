import { useQuery } from "@apollo/client";
import { ALL_TASKS } from "./components/queries";
import TasksView from "./components/TaskView";
import NewTaskForm from "./components/NewTaskForm";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const App = () => {
  const results = useQuery(ALL_TASKS);

  if (results.loading) {
    return <div>...loading</div>;
  }

  console.log(results.data.allTasks);

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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
