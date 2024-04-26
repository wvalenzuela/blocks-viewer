import { gql } from 'graphql-tag';


const TYPEDEFS = gql`
    type Diagram {
        id: LongLong
        name: String!
        createdAt: String!
        updatedAt: String!
    }
    input InputDiagram {
        id: LongLong
        name: String
        createdAt: String
        updatedAt: String
    }
    type DiagramResponse {
        ok: Boolean!
        diagrams: [Diagram!]
        errors: [Error!]
        total: LongLong
    }
    type RegisterResponseDiagram {
        ok: Boolean!
        diagram: BlockDiagram
        errors: [Error!]
    }
    # ---------------------------- QUERY ---------------------------
    type Query {
        allDiagrams(
            name: String
            page: Int
            limit: Int
        ): DiagramResponse! @auth
    } 
    input RegisterDiagram {
        name: String!
    }
    input InputDiagramDetails {
        id: LongLong
        name: String
    }    
    # ------------------------- MUTATION ---------------------------
    type Mutation {
        registerDiagrams (inputs: RegisterDiagram!): RegisterResponseBlockDiagramm!
    }
    `;




export default TYPEDEFS;