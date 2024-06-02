import axios from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { HTTP_ADDRESS_GRAPHQL } from '../config';

const MUTATION_REGISTER_DIAGRAMBLOCK = gql`
mutation RegisterDiagramBlocks($inputs: RegisterDiagramBlock!) {
    registerDiagramBlocks(inputs: $inputs) {
      ok
      errors {
        message
        path
      }
      diagramBlock {
        id
        idDiagram
        idBlock
        xPos
        yPos
        createdAt
        updatedAt
      }
    }
  }
`;
export const MutationRegisterDiagramBlock = (inputs) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(MUTATION_REGISTER_DIAGRAMBLOCK),
        variables: {
            inputs,
        },
    });
};