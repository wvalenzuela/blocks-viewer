import Block from './Block';


class Diagram{
    constructor(name, renderer){
        this.renderer = renderer;
        this.blocks = [];
        this.actors = new Map();
        this.name = name;
    }
    createBlock(x, y, inputs, outputs, color){
        const block = new Block(this.renderer, x, y, inputs, outputs, color);
        this.blocks.push(block);
        this.actors.set(block.planeActor, 'block');
        block.ports.forEach(p => {
            this.actors.set(p, 'port');
        })
    }
}

export default Diagram;