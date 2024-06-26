import { gql } from 'graphql-tag';

const TYPEDEFS = gql`
    type BlockPort {
        id: ID!
        type: String!
        multi: Boolean!
        position: LongLong!
        createdAt: String!
        updatedAt: String!
        port: Port!
    }
    input InputBlockPort {
        id: LongLong!
        idBlock: LongLong!
        idPort: LongLong!
        type: String!
        position: LongLong!
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
            idBlock: Int!
        ): BlockPortResponse! @auth
    }
    input RegisterBlockPort {
        idBlock: LongLong!
        idPort: LongLong!
        type: String!
        position: LongLong!
    }
    input InputBlockPortDetails {
        idBlock: LongLong!
        idPort: LongLong!
        type: String!
        position: LongLong!
    }
    type Mutation {
        registerBlockPorts (inputs: RegisterBlockPort!): RegisterResponseBlockPort!
    }
    
    `;
export default TYPEDEFS;