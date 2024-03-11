import axios from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { HTTP_ADDRESS_GRAPHQL } from '../config';

/* -------------- USER LOGS ------------------ */
const QUERY_USERS = gql`
  query ($name: String, $page: Int, $limit: Int) {
    allUsers(name: $name, page: $page, limit: $limit) {
      ok
      errors {
        path
        message
      }
      users {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const QueryUsers = (name, page, limit) => {
  return axios.post(HTTP_ADDRESS_GRAPHQL, {
    query: print(QUERY_USERS),
    variables: {
      name,
      page,
      limit,
    },
  });
};

const MUTATION_REGISTER_USER = gql`
  mutation ($inputs: RegisterUser!) {
    register(inputs: $inputs) {
      ok
      errors {
        path
        message
      }
      user {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
    }
  }
`;
export const MutationRegisterUser = (inputs) => {
  return axios.post(HTTP_ADDRESS_GRAPHQL, {
    query: print(MUTATION_REGISTER_USER),
    variables: {
      inputs,
    },
  });
};
