import { gql } from 'graphql-tag';

const TYPEDEFS = gql`
    type BlockLine {
        id: LongLong!
        name: String!
        idPortIn: LongLong!
        idPortOut: LongLong!
        createdAt: String!
        updatedAt: String!
    }
    input InputBlockLine {
        id: LongLong!
        name: String!
        idPortIn: LongLong!
        idPortOut: LongLong!
        createdAt: String!
        updatedAt: String!
    }
    type BlockLineResponse {
        ok: Boolean!
        blockLines: [BlockLine!]
        errors: [Error!]
        total: LongLong
    }
    type RegisterResponseBlockLine {
        ok: Boolean!
        blockLine: BlockLine
        errors: [Error!]
    }
    # ---------------------------- QUERY ---------------------------
    type Query {
        allBlockLines (
            name: String
            page: Int
            limit: Int
        ): BlockLineResponse! @auth
    }
    input RegisterBlockLine {
        name: String
        idPortIn: LongLong!
        idPortOut: LongLong!
    }
    input InputBlockLineDetails {
        name: String!
        idPortIn: LongLong!
        idPortOut: LongLong!
    }
    # ------------------------- MUTATION ---------------------------
    type Mutation {
        registerBlockLines (inputs: RegisterBlockLine!): RegisterResponseBlockLine!
    }
    `;
export default TYPEDEFS;