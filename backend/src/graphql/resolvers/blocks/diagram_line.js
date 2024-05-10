import { FormatReplyErrors, IsInvalid } from 'utils';


const RESOLVER = {
    Query: {
        allDiagramLines: async (
            parent,
            {name, page, limit, idDiagram},
            {models, user}
        ) => {
            try {
                const options = {
                    where: {},
                };
                options.where.idDiagram = idDiagram;
                const diagramLines = await models.DiagramLine.findAll(options)
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
        createDiagramLines: async (_, { input }, { models }) => {
            try {
              // Create the block
              const { diagramId, lines } = input;   
              // Add ports to the block
              for (const { idBlockIn, idBlockOut, idPortIn, idPortOut } of lines) {
                // Add the port to the block with the specified type
                await models.DiagramLine.create({
                  diagramId,
                  idBlockIn,
                  idBlockOut,
                  idPortIn,
                  idPortOut,
                });
              }
      
              // Fetch and return the created block
              const createdDiagramLines = await models.DiagramLine.findAll({
                where: { diagramId: diagramId },
                //include: models.Port,
              });
              
              return createdDiagramLines;
            } catch (error) {
              console.error('Error creating block with ports:', error);
              throw new Error('Failed to create block with ports');
            }
          },
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