import { FormatReplyErrors, IsInvalid } from 'utils';

const RESOLVER = {
    Query: {
        allDiagrams: async (
            parent,
            {name, page, limit},
            {models, user}
        ) =>{
            try {
                const diagrams = await models.Diagram.findAll()
                return {
                    ok: true,
                    diagrams,
                };
            } catch (error) {
                return {
                    ok: false,
                    errors: FormatReplyErrors(error, models),
                };
            }
        },
        fullDiagram: async (
            parent,
            {name, page, limit, id},
            {models, user}
        ) =>{
            try {
                const options = {
                    where: {},
                    include: {
                        model: models.Block,
                        as: 'block',
                        include: {
                            model: models.Port,
                            as: 'port'
                        }
                    } 
                };
                options.where.idDiagram = id;
                const diagramBlocks = await models.DiagramBlock.findAll(options)
                console.log(diagramBlocks[0].dataValues.block);

                
            
                return {
                    ok: true,
                    diagramBlocks,
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
        registerDiagrams: async (parant, { inputs }, { models, user}) => {
            try {
                if (IsInvalid(inputs)) {
                    throw Error('Invalid Input');
                }
                console.log({inputs});
                const diagram = await models.Diagram.create({...inputs}, {raw: true});
                console.log({ diagram});
                return{
                    ok: true,
                    diagram,
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