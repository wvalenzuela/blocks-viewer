import { FormatReplyErrors, IsInvalid } from 'utils';
import {blockModel} from '../../../models/blocks/index'

const RESOLVER = {
    Query: {
        allBlocks: async (
            parent,
            {name, page, limit},
            {models, user}
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
        fullBlock: async (
            parent,
            {name, page, limit, id},
            {models, user}
        ) => {
            try {
                const options = {
                    where: {},
                    include: {
                        model: models.BlockPort,
                        as: 'port',
                       // through: { attributes: ['type', 'id'] }
                    } 
                };
                options.where.id = id;
                
                const blocks = await models.Block.findAll(options)
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
        block: async (_, { id }, { models }) => {
            try {
              const block = await models.Block.findByPk(id);
              return block;
            } catch (error) {
              console.error('Error fetching block:', error);
              throw new Error('Failed to fetch block');
            }
          },
        },
        Block: {
          ports: async (block, _, { models }) => {
            try {
              const ports = await models.BlockPort.findAll({
                where: { blockId: block.id },
                //include: models.Port,
              });
              return ports
            } catch (error) {
              console.error('Error fetching ports for block:', error);
              throw new Error('Failed to fetch ports for block');
            }
          },
        },
        BlockPort: {
            port: async (blockPort, _, { models }) => {
                try {
                  const port = await models.Port.findByPk(blockPort.portId);
                  return port;
                } catch (error) {
                  console.error('Error fetching port for blockPort:', error);
                  throw new Error('Failed to fetch port for blockPort');
                }
              },
        },
    Mutation: {
        createBlock: async (_, { input }, { models }) => {
            try {
              // Create the block
              const { name, color, ports } = input;
              const block = await models.Block.create({ name, color });
      
              // Add ports to the block
              for (const { portId, type, multi, position } of ports) {
                const port = await models.Port.findByPk(portId);
                if (!port) {
                  throw new Error(`Port with id ${portId} not found`);
                }
      
                // Add the port to the block with the specified type
                await models.BlockPort.create({
                  blockId: block.id,
                  portId,
                  type,
                  multi,
                  position,
                });
              }
      
              // Fetch and return the created block
              const createdBlock = await models.Block.findByPk(block.id);
              
              return createdBlock;
            } catch (error) {
              console.error('Error creating block with ports:', error);
              throw new Error('Failed to create block with ports');
            }
          },
        registerBlocks: async (parent, { inputs }, { models, user}) => {
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