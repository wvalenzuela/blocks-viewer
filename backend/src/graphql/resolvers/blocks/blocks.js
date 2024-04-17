import { FormatReplyErrors, IsInvalid } from 'utils';


const RESOLVER = {
    Query: {
        allBlocks: async (
            parent,
            {name, page, limit},
            {models, block}
        ) => {
            try {
                const blocks = await models.Block.findAll()
                return {
                    ok: true,
                    blocks,
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
        registerBlocks: async (parant, { inputs }, { models, user}) => {
            try {
                if (IsInvalid(inputs)) {
                    throw Error('Invalid Input');
                }
                console.log({inputs});
                const block = await models.Block.create({...inputs}, {raw: true});
                console.log({ block});
                return{
                    ok: true,
                    block,
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