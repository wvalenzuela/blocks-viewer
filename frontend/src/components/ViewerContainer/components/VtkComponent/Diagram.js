import Block from './Block';


class Diagram{
    constructor(renderer, name){
        this.renderer = renderer;
        this.blocks = [];
        this.actors = new Map();
        this.relation = new Map();
        this.name = name;
    }

    createBlock(x, y, inputs, outputs, color){
        console.log(this.blocks)
        const block = new Block(this.renderer, x, y, inputs, outputs, color, this);
        this.blocks.push(block);
        this.actors.set(block.planeActor, 'block');
        block.ports.forEach(p => {
            this.actors.set(p, 'port');
        })
        this.renderer.resetCamera();
        this.renderer.getRenderWindow().render();
    }
}

export default Diagram;