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
      blocks {
        id
        name
        createdAt
        updatedAt
        color
      }
      total
    }
  }
`;

export const QueryBlocks = (name, color,page, limit) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(QUERY_BLOCKS),
        variables: {
            name,
            color,
            page,
            limit,
        },
    });
};

const QUERY_FULLBLOCK = gql`
query Query($name: String, $page: Int, $limit: Int) {
  allPorts(name: $name, page: $page, limit: $limit) {
    ok
    ports {
      id
      name
      color
      createdAt
      updatedAt
    }
    errors {
      path
      message
    }
    total
  }
}
`;

export const QueryFullBlock = (name, page, limit, id) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(QUERY_FULLBLOCK),  
        variables: {
            name,
            page,
            limit,
            id,
        },
    });
};


const MUTATION_REGISTER_BLOCK = gql`
  mutation ($inputs: RegisterBlock!) {
    registerBlocks (inputs: $inputs) {
      ok
      errors {
        path
        message
      }
      block {
        id
        color
        name
        createdAt
        updatedAt
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


