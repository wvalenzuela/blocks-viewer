import { FormatReplyErrors, IsInvalid } from 'utils';


const RESOLVER = {
    Query: {
        allDiagramBlocks: async (
            parent,
            {name, page, limit},
            {models, user},
        ) =>{
            try {
                const diagramBlocks = await models.DiagramBlock.findAll()
                return {
                    ok: true,
                    diagramBlocks,
                }
            } catch (error) {
                return {
                    ok: false,
                    errors: FormatReplyErrors(error, models),
                }
            }
        }
    },
    Mutation: {
        registerDiagramBlocks: async (
            parent,
            { inputs },
            { models, user }
        ) => {
            try {
                if (IsInvalid(inputs)) {
                    throw Error('Invalid Input');
                }
                console.log({inputs})
                const diagramBlock = await models.DiagramBlock.create({...inputs}, {raw: true})
                console.log(diagramBlock)
                return {
                    ok: true,
                    diagramBlock,
                }
            } catch (error) {
                console.log(error)
                return {
                    ok: false,
                    errors: FormatReplyErrors(error, models),
                }
            }
        }
    },
}

export default RESOLVER