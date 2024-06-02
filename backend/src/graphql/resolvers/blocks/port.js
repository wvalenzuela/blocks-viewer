import { FormatReplyErrors, IsInvalid } from 'utils';


const RESOLVER = {
    Query: {
        allPorts: async (
            parent,
            {name, page, limit},
            {models, user}
        ) => {
            try {
                const ports = await models.Port.findAll()
                return {
                    ok: true,
                    ports,
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
        registerPorts: async (parant, { inputs }, { models, user}) => {
            try {
                if (IsInvalid(inputs)) {
                    throw Error('Invalid Input');
                }
                console.log({inputs});
                const port = await models.Port.create({...inputs}, {raw: true});
                console.log({ port});
                return{
                    ok: true,
                    port,
                };
            } catch (error) {
                console.log(error)
                return {
                    ok: false,
                    errors: FormatReplyErrors(error, models),
                }
            }
        }
    }
};

export default RESOLVER;