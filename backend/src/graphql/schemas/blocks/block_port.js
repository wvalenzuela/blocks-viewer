import { gql } from 'graphql-tag';

const TYPEDEFS = gql`
    type BlockPort {
        id: LongLong!
        name: String!
        idBlock: LongLong!
        type: String!
        createdAt: String!
        updatedAt: String!
    }
    input InputBlockPort {
        id: LongLong!
        name: String!
        idBlock: LongLong!
        type: String!
        createdAt: String!
        updatedAt: String!
    }
    type BlockPortResponse {
        ok: Boolean!
        blockPorts: [BlockPort!]
        errors: [Error!]
        total: LongLong
    }
    type RegisterResponseBlockPort {
        ok: Boolean!
        blockPort: BlockPort
        errors: [Error!]
    }
    # ---------------------------- QUERY ---------------------------
    type Query {
        allBlockPorts (
            name: String
            page: Int
            limit: Int
        ): BlockPortResponse! @auth
    }
    input RegisterBlockPort {
        name: String
        idBlock: LongLong!
        type: String!
    }
    input InputBlockPortDetails {
        name: String!
        idBlock: LongLong!
        type: String!
    }
    # ------------------------- MUTATION ---------------------------
    type Mutation {
        registerBlockPorts (inputs: RegisterBlockPort!): RegisterResponseBlockPort!
    }
    `;
export default TYPEDEFS;