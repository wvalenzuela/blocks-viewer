import axios from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { HTTP_ADDRESS_GRAPHQL } from '../config';

const QUERY_PORTS = gql`
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

export const QueryPorts = (name, color,page, limit) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(QUERY_PORTS),
        variables: {
            name,
            color,
            page,
            limit,
        },
    });
};