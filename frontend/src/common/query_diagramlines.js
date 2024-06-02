import axios from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { HTTP_ADDRESS_GRAPHQL } from '../config';

const MUTATION_REGISTER_DIAGRAMLINE = gql`
mutation Mutation($inputs: RegisterDiagramLine!) {
    registerDiagramLines(inputs: $inputs) {
      ok
      diagramLine {
        idDiagram
        id
        idBlockOut
        idPortOut
        idBlockIn
        idPortIn
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
export const MutationRegisterDiagramLine = (inputs) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(MUTATION_REGISTER_DIAGRAMLINE),
        variables: {
            inputs,
        },
    });
};

const QUERY_DIAGRAMLINES = gql`
query Query($idDiagram: Int!) {
  allDiagramLines(idDiagram: $idDiagram) {
    ok
    diagramLines {
      idDiagram
      id
      idBlockOut
      idPortOut
      idBlockIn
      idPortIn
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

export const QueryDiagramLines = (name, page, limit, idDiagram) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(QUERY_DIAGRAMLINES),  
        variables: {
            name,
            page,
            limit,
            idDiagram,
        },
    });
};

const MUTATION_CREATE_DIAGRAMLINES = gql`
mutation CreateDiagramLines($input: CreateDiagramLineInput!) {
  createDiagramLines(input: $input) {
    id
    idBlockOut
    idPortOut
    idBlockIn
    idPortIn
    createdAt
    updatedAt
  }
}
`;
export const MutationCreateDiagramLines = (input) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(MUTATION_CREATE_DIAGRAMLINES),
        variables: {
            input,
        },
    });
};