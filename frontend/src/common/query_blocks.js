import axios from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { HTTP_ADDRESS_GRAPHQL } from '../config';

/* -------------- USER LOGS ------------------ */
const QUERY_BLOCKS = gql`
  query ($name: String, $page: Int, $limit: Int) {
    allBlocks(name: $name, page: $page, limit: $limit) {
      ok
      errors {
        path
        message
      }
      users {
        id
        name
      }
      total
    }
  }
`;

export const QueryBlocks = (name, page, limit) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(QUERY_BLOCKS),
        variables: {
            name,
            page,
            limit,
        },
    });
};

const MUTATION_REGISTER_BLOCK = gql`
  mutation ($inputs: RegisterUser!) {
    register(inputs: $inputs) {
      ok
      errors {
        path
        message
      }
      block {
        id
        name
      }
    }
  }
`;
export const MutationRegisterBlock = (inputs) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(MUTATION_REGISTER_BLOCK),
        variables: {
            inputs,
        },
    });
};


