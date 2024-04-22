import { FormatReplyErrors, IsInvalid } from 'utils';


const RESOLVER = {
    Query: {
        allBlockLines: async (
            parent,
            {name, page, limit},
            {models, user}
        ) => {
            try {
                const blockLines = await models.BlockLine.findAll()
                return {
                    ok: true,
                    blockLines,
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
        registerBlockLines: async (parant, { inputs }, { models, user}) => {
            try {
                if (IsInvalid(inputs)) {
                    throw Error('Invalid Input');
                }
                console.log({inputs});
                const blockLine = await models.BlockLine.create({...inputs}, {raw: true});
                console.log({ blockLine});
                return{
                    ok: true,
                    blockLine,
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