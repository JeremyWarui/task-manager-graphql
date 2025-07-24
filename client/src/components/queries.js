import { gql } from "@apollo/client";

export const ALL_TASKS = gql`
  query allTasks($status: String) {
    allTasks(status: $status) {
      title
      description
      done
      id
    }
  }
`;
