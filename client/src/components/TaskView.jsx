import { useMutation, useQuery } from "@apollo/client";
import { ALL_TASKS, CURRENT_USER, EDIT_TASK } from "./queries";

import Table from "react-bootstrap/Table";
import { useState } from "react";

const TasksView = () => {
  const [status, setStatus] = useState("");
  const results = useQuery(CURRENT_USER);
  const [editTask] = useMutation(EDIT_TASK);

  if (results.loading) {
    return <div>...loading</div>;
  }

  const tasks = results.data?.me?.tasks || [];

  // Optionally filter by status
  const filteredTasks = status
    ? tasks.filter((task) =>
        status === "done" ? task.done : !task.done
      )
    : tasks;

  const handleCheck = (taskId) => {
    editTask({
      variables: { id: taskId },
      update: (cache, { data: { editTask } }) => {
        const existing = cache.readQuery({ query: CURRENT_USER });
        cache.writeQuery({
          query: CURRENT_USER,
          data: {
            me: {
              ...existing.me,
              tasks: existing.me.tasks.map((task) =>
                task.id === editTask.id ? editTask : task
              ),
            },
          },
        });
      },
    });
  };

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
          {filteredTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.done ? "Done" : "Pending"}</td>
              <td>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleCheck(task.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div
        style={{
          marginTop: "10px",
          width: "300px",
        }}
      >
        <button
          style={{
            border: "none",
            marginRight: "5px",
            padding: "5px 15px",
          }}
          onClick={() => setStatus("")}
        >
          All Tasks
        </button>
        <button
          style={{ border: "none", marginRight: "5px", padding: "5px 15px" }}
          onClick={() => setStatus("pending")}
        >
          Pending
        </button>
        <button
          style={{ border: "none", padding: "5px 15px" }}
          onClick={() => setStatus("done")}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default TasksView;
