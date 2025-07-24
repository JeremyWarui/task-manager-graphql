import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_TASKS, CREATE_TASK } from "./queries";

const NewTaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [createTask] = useMutation(CREATE_TASK, {
    update: (cache) => {
      cache.evict({ fieldName: "allTasks" }), cache.gc();
    },
  });

  const submit = (event) => {
    event.preventDefault();

    createTask({ variables: { title, description } });

    setTitle("");
    setDescription("");
  };
  return (
    <div className="container">
      <div>
        <h3>Add New Task</h3>
      </div>
      <form onSubmit={submit}>
        <div>
          <label>Title</label>
          <div>
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
        </div>
        <div>
          <label>Description</label>
          <div>
            <input
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
          </div>
        </div>
        <div>
          <button
            style={{
              marginTop: "5px",
              padding: "5px 15px",
            }}
            type="submit"
          >
            post
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskForm;
