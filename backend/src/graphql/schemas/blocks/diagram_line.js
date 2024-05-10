import { gql } from 'graphql-tag';

const TYPEDEFS = gql`
    type DiagramLine {
        id: ID!
        idBlockOut: LongLong!
        idPortOut: LongLong!
        idBlockIn: LongLong!    
        idPortIn: LongLong!
        createdAt: String!
        updatedAt: String!
    }
    input InputDiagramLine {
        id: LongLong!
        idBlockOut: LongLong!
        idPortOut: LongLong!
        idBlockIn: LongLong!     
        idPortIn: LongLong!
        createdAt: String!
        updatedAt: String!
    }
    type DiagramLineResponse {
        ok: Boolean!
        diagramLines: [DiagramLine!]
        errors: [Error!]
        total: LongLong
    }
    type RegisterResponseDiagramLine {
        ok: Boolean!
        diagramLine: DiagramLine
        errors: [Error!]
    }
    # ---------------------------- QUERY ---------------------------
    type Query {
        allDiagramLines (
            name: String
            page: Int
            limit: Int
            idDiagram: Int!
        ): DiagramLineResponse! @auth
    }
    input RegisterDiagramLine {
        idDiagram: LongLong!
        idBlockOut: LongLong!
        idPortOut: LongLong!
        idBlockIn: LongLong!     
        idPortIn: LongLong!
    }
    input InputDiagramLineDetails {
        idDiagram: LongLong!
        idBlockOut: LongLong!
        idPortOut: LongLong!
        idBlockIn: LongLong!     
        idPortIn: LongLong!
    }
    # ------------------------- MUTATION ---------------------------
    type Mutation {
        registerDiagramLines (inputs: RegisterDiagramLine!): RegisterResponseDiagramLine!
    }
    type Mutation {
        createDiagramLines (input: CreateDiagramLineInput!): [DiagramLine]
    }
    input CreateDiagramLineInput {
        diagramId: ID!
        lines: [CreateDiagramLineLinesInput]
    }
    input CreateDiagramLineLinesInput {
        idBlockIn: ID!
        idBlockOut: ID!
        idPortIn: ID!
        idPortOut: ID!
    }
    `;
export default TYPEDEFS;