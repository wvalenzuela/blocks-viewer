import { FormatReplyErrors, IsInvalid } from 'utils';

const RESOLVER = {
    Query: {
        allBlockPorts: async (
            parent,
            {name, page, limit, idBlock},
            {models, user}
        ) =>{
            try {
                const options = {
                    where: {},
                };
                options.where.idBlock = idBlock;
                const blockPorts = await models.BlockPort.findAll(options)
                console.log(blockPorts);
                return {
                    ok: true,
                    blockPorts,
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
        registerBlockPorts: async (parant, { inputs }, { models, user}) => {
            try {
                if (IsInvalid(inputs)) {
                    throw Error('Invalid Input');
                }
                console.log({inputs});
                const blockPort = await models.BlockPort.create({...inputs}, {raw: true});
                console.log({ blockPort});
                return{
                    ok: true,
                    blockPort,
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