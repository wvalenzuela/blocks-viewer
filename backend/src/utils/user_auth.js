import { IsInvalid } from './utils_basic';

export const directiveResolvers = {
  auth: (next, src, args, context) => {
    // Check if the user is authenticated
    if (context) {
      const { user } = context;
      if (IsInvalid(user))
        throw new Error('You must be authenticated to access this field');
    }
    // If the user is authenticated, invoke the next resolver
    return next();
  },
};
const users = [];
export const ManageContext = (ctx, models) => {
  const { req, connection } = ctx;
  if (connection) {
    return {
      ...connection.context,
    };
  } else {
    if (req.user && users.indexOf(req.user.id) === -1) {
      users.push(req.user.id);
      console.log(
        `ApolloServer -> context -> idUser: ${req.user ? req.user.id : 'null'}`
      );
    }
    return {
      models,
      req,
    };
  }
};
