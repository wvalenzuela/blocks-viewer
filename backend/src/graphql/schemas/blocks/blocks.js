import { gql } from 'graphql-tag';

const TYPEDEFS = gql`
    type Block {
        id: LongLong!
        name: String!
        color: String!
        createdAt: String!
        updatedAt: String!
        port: [Port]
    }
    input InputBlock {
        id: LongLong
        name: String
        color: String
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
            name: String
            page: Int
            limit: Int
        ): BlocksResponse! @auth
    }
    type Query {
        fullBlock(
            name: String
            page: Int
            limit: Int
            id: Int!
        ): BlocksResponse! @auth
    }
    input RegisterBlock {
        name: String!
        color: String!
    }
    input InputBlockDetails {
        id: LongLong
        name: String
        color: String
    }
    # ------------------------- MUTATION ---------------------------
    type Mutation {
        registerBlocks (inputs: RegisterBlock!): RegisterResponseBlock!
    }
    `;
export default TYPEDEFS;