import { gql } from "@apollo/client";

const TASK_DETAILS = gql`
  fragment TaskDetails on Task {
    title
    description
    done
    id
  }
`;

export const ALL_TASKS = gql`
  query allTasks($status: String) {
    allTasks(status: $status) {
      ...TaskDetails
    }
  }
  ${TASK_DETAILS}
`;

export const CREATE_TASK = gql`
  mutation createTask($title: String!, $description: String!) {
    addTask(title: $title, description: $description) {
      ...TaskDetails
    }
  }
  ${TASK_DETAILS}
`;

export const EDIT_TASK = gql`
  mutation editTask($id: ID!) {
    editTask(id: $id) {
      ...TaskDetails
    }
  }
  ${TASK_DETAILS}
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      username
      id
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

export const CURRENT_USER = gql`
  query me {
    me {
      username
      id
      tasks {
        id
      }
    }
  }
`;
