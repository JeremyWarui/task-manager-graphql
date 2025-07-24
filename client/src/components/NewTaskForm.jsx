import { useMutation } from "@apollo/client";
import { useState } from "react";

const NewTaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);

  const submit = (event) => {
    event.preventDefault();
  };
  return (
    <div className="container">
      <div>
        <h2>Add New Task</h2>
      </div>
      <form onSubmit={submit}>
        <div>
          <lable>Title</lable>
          <div>
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
        </div>
        <div>
          <lable>Description</lable>
          <div>
            <input
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
          </div>
        </div>
        <div>
          <lable>Status</lable>
          <div>
            <input
              value={status}
              onChange={({ target }) => setStatus(target.value)}
            />
          </div>
        </div>
        <div>
          <button type="submit">post</button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskForm;
