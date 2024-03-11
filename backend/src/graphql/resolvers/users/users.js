import { FormatReplyErrors, IsInvalid } from 'utils';

const RESOLVER = {
  Query: {
    allUsers: async (
      parent,
      { email, name, page, limit },
      { models, user }
    ) => {
      try {
        const users = await models.User.findAll();
        return {
          ok: true,
          users,
        };
      } catch (error) {
        return {
          ok: false,
          errors: FormatReplyErrors(error, models),
        };
      }
    },
  },
  Mutation: {
    login: async (parent, { email, password }, { models, user }) => {
      try {
      } catch (error) {
        return {
          ok: false,
          errors: FormatReplyErrors(error, models),
        };
      }
    },
    register: async (parent, { inputs }, { models, user }) => {
      try {
        if (IsInvalid(inputs)) {
          throw Error('Invalid Input');
        }
        console.log({ inputs });
        const user = await models.User.create({ ...inputs }, { raw: true });
        console.log({ user });
        return {
          ok: true,
          user,
        };
      } catch (error) {
        return {
          ok: false,
          errors: FormatReplyErrors(error, models),
        };
      }
    },
  },
};
export default RESOLVER;
