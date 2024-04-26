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