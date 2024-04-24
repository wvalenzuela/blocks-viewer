import { FormatReplyErrors, IsInvalid } from 'utils';


const RESOLVER = {
    Query: {
        allDiagrammRelationBlock: async (
            parant,
            {name, page, limit},
            {models, user},
        ) =>{
            try {
                const diagrammRealtionBlocks = await models.DiagrammRelationBlock.findAll()
                return {
                    ok: true,
                    diagrammRealtionBlocks,
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
        registerDiagrammRealtionBlocks: async (
            parent,
            { inputs },
            { models, user }
        ) => {
            try {
                if (IsInvalid(inputs)) {
                    throw Error('Invalid Input');
                }
                console.log({inputs})
                const diagrammRealtionBlock = await models.DiagrammRelationBlock.create({...inputs}, {raw: true})
                console.log(diagrammRealtionBlock)
                return {
                    ok: true,
                    diagrammRealtionBlock,
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