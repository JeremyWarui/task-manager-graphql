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

export const CREATE_TASK = gql`
  mutation createTask($title: String!, $description: String!) {
    addTask(title: $title, description: $description) {
      title
      id
      description
      done
    }
  }
`;

export const EDIT_TASK = gql`
  mutation editTask($id: ID!) {
    editTask(id: $id) {
      id
      title
      description
      done
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;


// export const CURRENT_USER = gql`
//   query me {

//   }

// `