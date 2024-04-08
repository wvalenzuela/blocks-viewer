import { gql } from 'graphql-tag';

const TYPEDEFS = gql`
    type Block {
        id: LongLong!
        blockName: String
        createdAt: String!
        updatedAt: String!
    }
    input InputBlock {
        id: LongLong
        blockName: String
        createdAt: String
        updatedAt: String
    }
    type BlocksResponse {
        ok: Boolean!
        blocks: [Block!]
        errors: [Error!]
        total: LongLong
    }
    type RegisterResponseBlock {
        ok: Boolean!
        block: Block
        errors: [Error!]
    }
    # ---------------------------- QUERY ---------------------------
    type Query {
        allBlocks(
            blockName: String
            page: Int
            limit: Int
        ): BlocksResponse! @auth
    }
    input RegisterBlock {
        blockName: String!
    }
    input InputBlockDetails {
        id: LongLong
        blockName: String
        inputs: Int
        outputs: Int
    }
    # ------------------------- MUTATION ---------------------------
    type Mutation {
        registerBlock (inputs: RegisterBlock!): RegisterResponseBlock!
    }
    `;
export default TYPEDEFS;