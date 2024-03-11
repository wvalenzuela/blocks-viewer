// Imports: GraphQL
import { gql } from 'graphql-tag'; // GraphQL: TypeDefs

const TYPEDEFS = gql`
  type User {
    id: LongLong!
    title: String
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }
  input InputUser {
    id: LongLong
    title: String
    FullName: String
    firstName: String
    lastName: String
    username: String
    email: String
    avatar: String
    createdAt: String
    updatedAt: String
  }
  type UsersResponse {
    ok: Boolean!
    users: [User!]
    errors: [Error!]
    total: LongLong
  }
  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }
  type LoginResponse {
    ok: Boolean!
    token: String
    refreshToken: String
    errors: [Error!]
  }
  # ---------------------------- QUERY ---------------------------
  type Query {
    allUsers(
      email: String
      name: String
      page: Int
      limit: Int
    ): UsersResponse! @auth
  }
  input RegisterUser {
    title: String
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  input InputUserDetails {
    id: LongLong
    firstName: String
    lastName: String
    email: String
    phone: String
    city: String
    state: String
    country: String
    line_1: String
    request: String
  }
  # ------------------------- MUTATION ---------------------------
  type Mutation {
    register(inputs: RegisterUser!): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
  }
`; // Exports
export default TYPEDEFS;
