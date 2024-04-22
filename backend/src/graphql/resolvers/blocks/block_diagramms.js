import { FormatReplyErrors, IsInvalid } from 'utils';

const RESOLVER = {
    Query: {
        allBlockDiagramms: async (
            parent,
            {name, page, limit},
            {models, user}
        ) =>{
            try {
                const diagramm = await models.BlockDiagramm.findAll()
                console.log(diagramm)
                return {
                    ok: true,
                    diagramm,
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
                const diagramm = await models.BlockDiagramm.create({...inputs}, {raw: true});
                console.log({ diagramm});
                return{
                    ok: true,
                    diagramm,
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