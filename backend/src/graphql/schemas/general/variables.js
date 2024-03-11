// Imports: GraphQL
import { gql } from 'graphql-tag'; // GraphQL: TypeDefs

const TYPEDEFS = gql`
  # directive @auth on FIELD_DEFINITION
  # directive @auth on QUERY | FIELD_DEFINITION | FIELD
  directive @auth on QUERY | FIELD_DEFINITION | FIELD
  scalar Upload
  scalar LongLong
`;
// Exports
export default TYPEDEFS;
