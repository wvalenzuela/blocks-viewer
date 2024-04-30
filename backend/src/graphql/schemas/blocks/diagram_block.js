import { gql } from 'graphql-tag';

const TYPEDEFS = gql`
    type DiagramBlock {
        id: LongLong!
        idDiagram: LongLong!
        idBlock: LongLong!
        xPos: Float
        yPos: Float
        createdAt: String!
        updatedAt: String!
        block: Block
    }
    input InputDiagramBlock {
        id: LongLong!
        idDiagram: LongLong!
        idBlock: LongLong!
        xPos: Float
        yPos: Float
        createdAt: String!
        updatedAt: String!
    }
    type DiagramBlockResponse {
        ok: Boolean!
        diagramBlocks: [DiagramBlock!]
        errors: [Error!]
        total: LongLong
    }
    type RegisterResponseDiagramBlock {
        ok: Boolean!
        diagramBlock: DiagramBlock
        errors: [Error!]
    }
    # ---------------------------- QUERY ---------------------------
    type Query {
        allDiagramBlocks (
            name: String!
            page: Int
            limit: Int
        ): DiagramBlockResponse! @auth
    }
    input RegisterDiagramBlock {
        idDiagram: LongLong!
        idBlock: LongLong!
        xPos: Float
        yPos: Float
    }
    input InputDiagramBlockDetails {
        idDiagram: LongLong
        idBlock: LongLong
        xPos: Float
        yPos: Float
    }
    type Mutation {
        registerDiagramBlocks (inputs: RegisterDiagramBlock!): RegisterResponseDiagramBlock!
    }
    
    `;
export default TYPEDEFS;