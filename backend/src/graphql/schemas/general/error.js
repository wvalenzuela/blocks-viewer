// Imports: GraphQL
import { gql } from 'graphql-tag'; // GraphQL: TypeDefs

const TYPEDEFS = gql`
  type Error {
    path: String!
    message: String
  }
`;
// Exports
export default TYPEDEFS;
