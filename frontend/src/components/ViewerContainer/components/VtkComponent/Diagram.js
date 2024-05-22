import Block from './Block';
import PolyLine from './PolyLine'
import StyledBlock from './StyledBlock';


class Diagram{
    constructor(renderer, name, grid){
        this.renderer = renderer;
        this.blocks = [];
        this.actors = new Map();
        this.relation = new Map();
        this.name = name;
        this.id = null;
        this.connections = []
        this.lines = [];
        this.grid = grid
        //connections idDiagramBock+idBlockPort connected to idDiagramBock+idBlockPort
    }
    clear(){
        this.renderer.removeAllActors()
        this.renderer.addActor(this.grid)
        this.blocks = [];
        this.actors = new Map();
        this.relation = new Map();
        this.connections = [];
        this.lines = [];
        this.renderer.getRenderWindow().render();
    }

    createBlock(x, y, ports, color, id, dbid,name){
        const block = new StyledBlock(this.renderer, x, y, ports, color, this, id,dbid,name);
        this.blocks.push(block);
        this.actors.set(block.planeActor, 'block');
        block.ports.forEach(p => {
            this.actors.set(p.portActor, 'port');
        })
        this.renderRoutine()
    }
    buildDiagram(diagramData) {
        this.clear()
        this.id = diagramData.id;
        this.name = diagramData.name;
        diagramData.blocks.forEach((block) => {
            const x = block.xPos;
            const y = block.yPos;
            const color = block.block.color;
            const inputs = []
            const outputs = []
            const id = block.block.id;
            const dbid = block.id;
            const name = block.block.name
            /*
            block.block.ports.forEach(p => {
                if (p.type === "in") {
                    inputs.push(p);
                } else {
                    outputs.push(p);
                }
            })*/
            this.createBlock(x,y,block.block.ports,color,id,dbid,name)
        })
        this.buildLines(diagramData.lines);
        //for each DiagramBlock create a new block with the Block and Port info
        //  
    }
    buildLines(lines) {
        lines.forEach(line => {
            const blockOut = this.blocks.find(block => block.dbid === line.idBlockOut.toString());
            const blockIn = this.blocks.find(block => block.dbid === line.idBlockIn.toString());
            const portOut = blockOut.ports.find(port => port.bpid === line.idPortOut.toString());
            const portIn = blockIn.ports.find(port => port.bpid === line.idPortIn.toString());
            const polyLine = new PolyLine(this.renderer,portOut.color2);
            polyLine.inputPort = portIn;
            polyLine.outputPort = portOut;
            portOut.connection.push(polyLine);
            portIn.connection.push(polyLine);
            this.lines.push(polyLine);
            polyLine.drawLine( portOut.portActor.getPosition(), portIn.portActor.getPosition());
            this.renderer.getRenderWindow().render();
        })
    }
    saveDiagram(){
        //if override current:
        //drop all DiagramBlock and DiagramLine and continue with new Diagram
        //if new diagram:
        return this;
        //create new Diagram and set returned ID
        //for each block create DiagramBlock and set idDiagramBlock for each block
        //for each connection create DiagramLine
    }
    renderRoutine(){
        this.renderer.removeActor(this.grid);
        this.renderer.resetCamera();
        this.renderer.addActor(this.grid);
        this.renderer.getRenderWindow().render();
    }
}

export default Diagram;