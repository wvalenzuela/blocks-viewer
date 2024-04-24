import { gql } from 'graphql-tag';

const TYPEDEFS = gql`
    type DiagrammRelationBlock {
        id: LongLong!
        name: String!
        xBlock: Float!
        yBlock: Float!
        idDiagramm: LongLong!
        idBlock: LongLong!
        createdAt: String!
        updatedAt: String!
    }
    input InputDiagrammRelationBlock {
        id: LongLong!
        name: String!
        xBlock: Float!
        yBlock: Float!
        idDiagramm: LongLong!
        idBlock: LongLong!
        createdAt: String!
        updatedAt: String!
    }
    type DiagrammRelationBlockResponse {
        ok: Boolean!
        diagrammRealtionBlocks: [DiagrammRelationBlock!]
        errors: [Error!]
        total: LongLong
    }
    type RegisterResponseDiagrammRelationBlock {
        ok: Boolean!
        diagrammRealtionBlock: DiagrammRelationBlock
        errors: [Error!]
    }
    # ---------------------------- QUERY ---------------------------
    type Query {
        allDiagrammRelationBlock (
            name: String!
            page: Int
            limit: Int
        ): DiagrammRelationBlockResponse! @auth
    }
    input RegisterDiagrammRelationBlock {
        name: String
        idDiagramm: LongLong
        idBlock: LongLong
        xBlock: Float
        yBlock: Float
    }
    input InputDiagrammRelationBlockDetails {
        name: String
        idDiagramm: LongLong
        idBlock: LongLong
        xBlock: Float
        yBlock: Float
    }
    type Mutation {
        registerDiagrammRealtionBlocks (inputs: RegisterDiagrammRelationBlock!): RegisterResponseDiagrammRelationBlock!
    }
    
    `;
export default TYPEDEFS;