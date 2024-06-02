import { gql } from 'graphql-tag';


const TYPEDEFS = gql`
    type Diagram {
        id: ID!
        name: String!
        createdAt: String!
        updatedAt: String!
        blocks: [DiagramBlock]
        lines: [DiagramLine]
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
    type DiagramBlockResponse {
        ok: Boolean!
        diagramBlocks: [DiagramBlock!]
        errors: [Error!]
        total: LongLong
    }
    type RegisterResponseDiagram {
        ok: Boolean!
        diagram: Diagram
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
    type Query {
        fullDiagram(
            name: String
            page: Int
            limit: Int
            id: Int!
        ): DiagramBlockResponse! @auth
    }
    type Query {
        diagram(id: ID!): Diagram
    }
    type Mutation {
        createDiagram(input: CreateDiagramInput!): Diagram
    }
    input CreateDiagramInput {
        name: String!
        blocks: [BlockInput]
    }
    input BlockInput {
        blockId: ID!
        xPos: Float!
        yPos: Float!
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
        registerDiagrams (inputs: RegisterDiagram!): RegisterResponseDiagram!
    }
    `;




export default TYPEDEFS;