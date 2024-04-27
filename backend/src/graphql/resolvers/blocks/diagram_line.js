import { FormatReplyErrors, IsInvalid } from 'utils';


const RESOLVER = {
    Query: {
        allDiagramLines: async (
            parent,
            {name, page, limit},
            {models, user}
        ) => {
            try {
                const diagramLines = await models.DiagramLine.findAll()
                return {
                    ok: true,
                    diagramLines,
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
        registerDiagramLines: async (parant, { inputs }, { models, user}) => {
            try {
                if (IsInvalid(inputs)) {
                    throw Error('Invalid Input');
                }
                console.log({inputs});
                const diagramLine = await models.DiagramLine.create({...inputs}, {raw: true});
                console.log({ diagramLine});
                return{
                    ok: true,
                    diagramLine,
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