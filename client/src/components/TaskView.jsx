import { useQuery } from "@apollo/client";
import { ALL_TASKS } from "./queries";

import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

const TasksView = () => {
  const results = useQuery(ALL_TASKS);

  if (results.loading) {
    return <div>...loading</div>;
  }

  const tasks = results.data.allTasks;
  return (
    <div className="container">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Check</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.done ? "Done" : "Pending"}</td>
              <td>
                <Button variant="primary">Check</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TasksView;
