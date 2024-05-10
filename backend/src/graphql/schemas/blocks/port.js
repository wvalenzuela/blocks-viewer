import { gql } from 'graphql-tag';

const TYPEDEFS = gql`
    type Port {
        id: ID!
        name: String!
        color: String!
        createdAt: String!
        updatedAt: String!
    }
    input InputPort {
        id: LongLong!
        name: String!
        color: String
        createdAt: String!
        updatedAt: String!
    }
    type PortResponse {
        ok: Boolean!
        ports: [Port!]
        errors: [Error!]
        total: LongLong
    }
    type RegisterResponsePort {
        ok: Boolean!
        port: Port
        errors: [Error!]
    }
    # ---------------------------- QUERY ---------------------------
    type Query {
        allPorts (
            name: String
            page: Int
            limit: Int
        ): PortResponse! @auth
    }
    type Query {
        port(id: ID!): Port
    }
    input RegisterPort {
        name: String
        color: String
    }
    input InputPortDetails {
        name: String!
        color: String
    }
    # ------------------------- MUTATION ---------------------------
    type Mutation {
        registerPorts (inputs: RegisterPort!): RegisterResponsePort!
    }
    `;
export default TYPEDEFS;