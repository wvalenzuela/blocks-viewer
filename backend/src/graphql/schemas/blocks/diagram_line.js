import { gql } from 'graphql-tag';

const TYPEDEFS = gql`
    type DiagramLine {
        id: LongLong!
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
        ): DiagramLineResponse! @auth
    }
    input RegisterDiagramLine {
        idBlockOut: LongLong!
        idPortOut: LongLong!
        idBlockIn: LongLong!     
        idPortIn: LongLong!
    }
    input InputDiagramLineDetails {
        idBlockOut: LongLong!
        idPortOut: LongLong!
        idBlockIn: LongLong!     
        idPortIn: LongLong!
    }
    # ------------------------- MUTATION ---------------------------
    type Mutation {
        registerDiagramLines (inputs: RegisterDiagramLine!): RegisterResponseDiagramLine!
    }
    `;
export default TYPEDEFS;