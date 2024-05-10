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
                    include: [{
                        model: models.Block,
                        as: 'block',
                        include: [{
                            model: models.Port,
                            as: 'port',
                            through: { attributes: ['type', 'id'] }
                        }],
                    },
                  /*  {
                        model: models.DiagramLine,
                        as: 'diagram_lines',
                    }*/],
                };
                options.where.idDiagram = id;
                const diagramBlocks = await models.DiagramBlock.findAll(options)
                //console.log(diagramBlocks[0].dataValues.block.port[0].block_port);
            
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
        diagram: async (_, { id }, { models }) => {
            try {
              const diagram = await models.Diagram.findByPk(id);
              return diagram;
            } catch (error) {
              console.error('Error fetching block:', error);
              throw new Error('Failed to fetch block');
            }
          },
    },
    Diagram: {
        blocks: async (diagram, _, { models }) => {
          try {
            const ports = await models.DiagramBlock.findAll({
              where: { diagramId: diagram.id },
              //include: models.Port,
            });
            return ports
          } catch (error) {
            console.error('Error fetching ports for block:', error);
            throw new Error('Failed to fetch ports for block');
          }
        },
        lines: async (diagram, _, { models }) => {
            try {
              const lines = await models.DiagramLine.findAll({
                where: { diagramId: diagram.id },
                //include: models.Port,
              });
              return lines
            } catch (error) {
              console.error('Error fetching ports for block:', error);
              throw new Error('Failed to fetch ports for block');
            }
          },
      },
      DiagramBlock: {
        block: async (diagramBlock, _, { models }) => {
            try {
              const block = await models.Block.findByPk(diagramBlock.blockId);
              return block;
            } catch (error) {
              console.error('Error fetching port for blockPort:', error);
              throw new Error('Failed to fetch port for blockPort');
            }
          },
    },
    Mutation: {
        createDiagram: async (_, { input }, { models }) => {
            try {
              // Create the block
              const { name, blocks } = input;
              const diagram = await models.Diagram.create({ name });
      
              // Add ports to the block
              for (const { blockId, xPos, yPos } of blocks) {
                const block = await models.Block.findByPk(blockId);
                if (!block) {
                  throw new Error(`Port with id ${blockId} not found`);
                }
      
                // Add the port to the block with the specified type
                await models.DiagramBlock.create({
                  diagramId: diagram.id,
                  blockId,
                  xPos,
                  yPos,
                });
              }
      
              // Fetch and return the created block
              const createdDiagram = await models.Diagram.findByPk(diagram.id);
              
              return createdDiagram;
            } catch (error) {
              console.error('Error creating block with ports:', error);
              throw new Error('Failed to create block with ports');
            }
          },
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