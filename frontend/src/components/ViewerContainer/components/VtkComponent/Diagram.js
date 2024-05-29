import PolyLine from './PolyLine'
import StyledBlock from './StyledBlock';

/**
 * <The Diagram class handles all the created blocks and connections and builds blocks of full diagrams from the database>
 * @method clear - clears all actor from viewer
 * @method createBlock - creates a new block object
 * @method buildDiagram - creates a diagram with the data from the database
 * @method buildLines - creates the lines with the data from the database
 * @method saveDiagram - sends the diagram object to the database
 * @method renderRoutine - renders the viewer and excludes the grid actor to reset the camery properly
 * @param renderer current renderer
 * @param name name of the diagram
 * @param grid grid actor of the viewer
*/
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
    }

    /**
     * <removes all actors from renderer but the grid>
     */
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

    /**
     * @param x position bottom left corner
     * @param y position bottom left corner
     * @param ports list of ports
     * @param color color of the port??? or could we remove that because block is white
     * @param id id of the block-database
     * @param dbid id of the diagramblock-database
     * @param name name of the block
     * 
     * <creates a Block>
     */
    createBlock(x, y, ports, color, id, dbid,name){
        const block = new StyledBlock(this.renderer, x, y, ports, color, this, id,dbid,name);
        this.blocks.push(block);
        this.actors.set(block.planeActor, 'block');
        block.ports.forEach(p => {
            this.actors.set(p.portActor, 'port');
        })
        this.renderRoutine()
    }

    /**
     * <builds the diagram from the database>
     * @param diagramData - data from the database
     */
    buildDiagram(diagramData) {
        this.clear()
        this.id = diagramData.id;
        this.name = diagramData.name;
        diagramData.blocks.forEach((block) => {
            const x = block.xPos;
            const y = block.yPos;
            const color = block.block.color;
            const ports = block.block.ports;
            const inputs = []
            const outputs = []
            const id = block.block.id;
            const dbid = block.id;
            const name = block.block.name
            this.createBlock(x,y,ports,color,id,dbid,name)
        })
        this.buildLines(diagramData.lines); 
    }

    /**
     * <Creates the connections between ports with the data from the database>
     * @param lines data of the diagramlines-database
     */
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

    /**
     * <returns this Diagram object to be saved in the database>
     */
    saveDiagram(){
        return this;
    }


    /**
     * <renders the scene. removes the grid actor, resets the camera and then adds the grid actor back>
     */
    renderRoutine(){
        this.renderer.removeActor(this.grid);
        this.renderer.resetCamera();
        this.renderer.addActor(this.grid);
        this.renderer.getRenderWindow().render();
    }
}

export default Diagram;