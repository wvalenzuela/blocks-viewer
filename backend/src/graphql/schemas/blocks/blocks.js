import { gql } from 'graphql-tag';

const TYPEDEFS = gql`
    type Block {
        id: LongLong!
        name: String
        createdAt: String!
        updatedAt: String!
    }
    input InputBlock {
        id: LongLong
        name: String
        createdAt: String
        updatedAt: String
    }
    type BlocksResponse {
        ok: Boolean!
        blocks: [Block!]
        errors: [Error!]
        total: LongLong
    }
    type RegisterResponse {
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
    input RegisterBlock {
        name: String
    }
    input InputBlockDetails {
        id: LongLong
        name: String
        inputs: Int
        outputs: Int
    }
    # ------------------------- MUTATION ---------------------------
    type Mutation {
        register(inputs: RegisterBlock!): RegisterResponse!
    }
    `;
export default TYPEDEFS;