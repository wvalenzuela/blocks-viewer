import axios from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { HTTP_ADDRESS_GRAPHQL } from '../config';

const MUTATION_REGISTER_BLOCKPORTS = gql`
mutation RegisterBlockPorts($inputs: RegisterBlockPort!) {
    registerBlockPorts(inputs: $inputs) {
      ok
      blockPort {
        id
        idBlock
        idPort
        type
        position
        createdAt
        updatedAt
      }
      errors {
        path
        message
      }
    }
  }
`;

export const MutationRegisterBlockPorts = (inputs) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(MUTATION_REGISTER_BLOCKPORTS),
        variables: {
            inputs,
        },
    });
};

const QUERY_BLOCKPORTS = gql`
query Query($name: String, $page: Int, $limit: Int, $idBlock: Int!) {
    allBlockPorts(name: $name, page: $page, limit: $limit, idBlock: $idBlock) {
      ok
      blockPorts {
        id
        idBlock
        idPort
        type
        position
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

export const QueryBlockPorts = (name, page, limit, idBlock) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(QUERY_BLOCKPORTS),  
        variables: {
            name,
            page,
            limit,
            idBlock,
        },
    });
};