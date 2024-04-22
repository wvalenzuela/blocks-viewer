import { gql } from 'graphql-tag';


const TYPEDEFS = gql`
    type BlockDiagramm {
        id: LongLong
        name: String!
        idUser: LongLong!
        createdAt: String!
        updatedAt: String!
    }
    input InputBlockDiagramm {
        id: LongLong
        name: String
        idUser: LongLong!
        createdAt: String
        updatedAt: String
    }
    type BlockDiagrammResponse {
        ok: Boolean!
        Diagramms: [BlockDiagramm!]
        errors: [Error!]
        total: LongLong
    }
    type RegisterResponseBlockDiagramm {
        ok: Boolean!
        blockDiagramms: BlockDiagramm
        errors: [Error!]
    }
    # ---------------------------- QUERY ---------------------------
    type Query {
        allBlockDiagramms(
            name: String
            page: Int
            limit: Int
        ): BlockDiagrammResponse! @auth
    } 
    input RegisterBlockDiagramm {
        name: String!
    }
    input InputBlockDiagrammDetails {
        id: LongLong
        name: String
        userID: Int
    }    
    # ------------------------- MUTATION ---------------------------
    type Mutation {
        registerBlockDiagramms (inputs: RegisterBlockDiagramm!): RegisterResponseBlockDiagramm!
    }
    `;




export default TYPEDEFS;