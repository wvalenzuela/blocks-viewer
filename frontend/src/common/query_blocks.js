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
      block {
        id
        blockName
        createdAt
        updatedAt
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
  mutation ($inputs: RegisterBlock!) {
    registerBlock (inputs: $inputs) {
      ok
      errors {
        path
        message
      }
      block {
        id
        blockName
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

