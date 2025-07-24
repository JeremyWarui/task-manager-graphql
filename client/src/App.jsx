import { useQuery } from "@apollo/client";
import { ALL_TASKS } from "./components/queries";

const App = () => {
  const results = useQuery(ALL_TASKS);

  if (results.loading) {
    return <div>...loading</div>;
  }

  console.log(results.data.allTasks);

  return (
    <div>
      <h1>Personal Task Manager</h1>
      <hr />
    </div>
  );
};

export default App;
