import { FormatReplyErrors, IsInvalid } from 'utils';

const RESOLVER = {
    Query: {
        allBlockDiagramms: async (
            parent,
            {name, page, limit},
            {models, user}
        ) =>{
            try {
                const blockDiagramms = await models.BlockDiagramm.findAll()
                return {
                    ok: true,
                    blockDiagramms,
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
        registerBlockDiagramms: async (parant, { inputs }, { models, user}) => {
            try {
                if (IsInvalid(inputs)) {
                    throw Error('Invalid Input');
                }
                console.log({inputs});
                const blockDiagramms = await models.BlockDiagramm.create({...inputs}, {raw: true});
                console.log({ blockDiagramms});
                return{
                    ok: true,
                    blockDiagramms,
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
}

export default RESOLVER;