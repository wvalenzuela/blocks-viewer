import axios from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { HTTP_ADDRESS_GRAPHQL } from '../config';

/* -------------- USER LOGS ------------------ */
const QUERY_DIAGRAMS = gql`
query Query($name: String, $page: Int, $limit: Int) {
    allDiagrams(name: $name, page: $page, limit: $limit) {
      ok
      diagrams {
        id
        name
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

export const QueryDiagrams = (name,page, limit) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(QUERY_DIAGRAMS),
        variables: {
            name,
            page,
            limit,
        },
    });
};

const QUERY_FULLDIAGRAM = gql`
query FullDiagram($name: String, $page: Int, $limit: Int, $id: Int!) {
  fullDiagram(name: $name, page: $page, limit: $limit, id: $id) {
    ok
    diagramBlocks {
      id
      idDiagram
      idBlock
      xPos
      yPos
      createdAt
      updatedAt
      block {
        id
        name
        color
        port {
          id
          name
          color
          block_port {
            type
            id
          }
        }
      }
    }
    errors {
      path
      message
    }
    total
  }
}
`;

export const QueryFullDiagram = (name,page,limit,id) => {
  return axios.post(HTTP_ADDRESS_GRAPHQL, {
      query: print(QUERY_FULLDIAGRAM),
      variables: {
          name,
          page,
          limit,
          id  
      },
  });
};


const MUTATION_REGISTER_DIAGRAM = gql`
  mutation RegisterDiagrams($inputs: RegisterDiagram!) {
    registerDiagrams(inputs: $inputs) {
      ok
      diagram {
        id
        name
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
export const MutationRegisterDiagram = (inputs) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(MUTATION_REGISTER_DIAGRAM),
        variables: {
            inputs,
        },
    });
};

const QUERY_DIAGRAM = gql`
query Query($diagramId: ID!) {
  diagram(id: $diagramId) {
    id
    name
    createdAt
    updatedAt
    blocks {
      id
      xPos
      yPos
      createdAt
      updatedAt
      block {
        id
        name
        color
        createdAt
        updatedAt
        ports {
          id
          type
          multi
          position
          createdAt
          updatedAt
          port {
            id
            name
            color
            createdAt
            updatedAt
          }
        }
      }
    }
    lines {
      id
      idBlockOut
      idPortOut
      idBlockIn
      idPortIn
      createdAt
      updatedAt
    }
  }
}
`;

export const QueryDiagram = (diagramId) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(QUERY_DIAGRAM),
        variables: {
            diagramId
        },
    });
};

const MUTATION_CREATE_DIAGRAM = gql`
mutation Mutation($input: CreateDiagramInput!) {
  createDiagram(input: $input) {
    id
    name
    createdAt
    updatedAt
    blocks {
      id
      xPos
      yPos
      createdAt
      updatedAt
      block {
        id
        name
        color
        createdAt
        updatedAt
        ports {
          id
          type
          multi
          position
          createdAt
          updatedAt
          port {
            id
            name
            color
            createdAt
            updatedAt
          }
        }
      }
    }
    lines {
      id
      idBlockOut
      idPortOut
      idBlockIn
      idPortIn
      createdAt
      updatedAt
    }
  }
}
`;
export const MutationCreateDiagram = (input) => {
    return axios.post(HTTP_ADDRESS_GRAPHQL, {
        query: print(MUTATION_CREATE_DIAGRAM),
        variables: {
            input,
        },
    });
};


