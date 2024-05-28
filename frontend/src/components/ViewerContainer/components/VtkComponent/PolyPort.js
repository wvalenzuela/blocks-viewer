import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';


/**
 * <The ports are used with the blocks such that blocks can be connected >
 * claculatePoints - Calculate the points of a inner, middle and outer circle
 * createCellArray - Creats 3 different cells for the 3 shapes: 2 annuli and a circle
 * createPort puts all the spahes into one Port
 * increase - increase the size of the port
 * decrease - decrease the size of the port
 * @param x center of the port 
 * @param y center of the port 
 * @param type sting, int, boolean etc
 * @param block the block the port belongs to
 * @param id ?
 * @param bpid BlockPortID
 * @param color color of the port
 * @param name name of the port
 * @param multi ?
 * @returns {Port}
 */
class Port {
    constructor(x, y, type, block, id, bpid, color, name, multi) {
        this.name = name;
        this.multi = multi;
        this.id = id;
        this.bpid = bpid;
        this.block = block;
        this.type = type;
        this.connection = [];
        this.x = x;
        this.y = y;
        this.innerRadius = 0.08*0.9;
        this.middleRadius = 0.12*0.9;
        this.outerRadius = 0.135*0.9;
        this.color1 = [255, 255, 255];
        this.color2 = [color[0]*255,color[1]*255,color[2]*255]
        this.color3 = [255, 255, 255];        
        this.points = vtkPoints.newInstance();
        this.numPoints = 100;
        this.angleStep = 2 * Math.PI / this.numPoints;
        this.colors = [];
        this.cells = vtkCellArray.newInstance();
        this.portPolyData = vtkPolyData.newInstance();
        this.portColorData = vtkDataArray.newInstance({
            numberOfComponents: 3,
            values: new Uint8Array(this.colors),
            name: 'Colors'
        });
        this.portMapper = vtkMapper.newInstance();
        this.portActor = vtkActor.newInstance({ position: [this.x, this.y, 0.01] });
        this.portActor.setDragable(false)
        this.block.renderer.addActor(this.portActor);
        this.block.ports.push(this);
        this.block.diagram.relation.set(this.portActor, this);
        this.createPort();
    }

    /**
     * <Calculate the points of a inner, middle and outer circl based on the x,y coordinate as middlepoint>
     */
    calculatePoints() {
        // Inner circle points
        for (let i = 0; i < this.numPoints; i++) {
            const angle = i * this.angleStep;
            this.points.insertNextPoint(
                (this.innerRadius * Math.cos(angle)),
                (this.innerRadius * Math.sin(angle)),
                0.01 // Z value so that port is infornt of the block
            );
        }
        
        // Middle circle points
        for (let i = 0; i < this.numPoints; i++) {
            const angle = i * this.angleStep;
            this.points.insertNextPoint(
                (this.middleRadius * Math.cos(angle)),
                (this.middleRadius * Math.sin(angle)),
                0.01 // Z value so that port is infornt of the block
            );
        }
        
        // Outer circle points
        for (let i = 0; i < this.numPoints; i++) {
            const angle = i * this.angleStep;
            this.points.insertNextPoint(
                (this.outerRadius * Math.cos(angle)),
                (this.outerRadius * Math.sin(angle)),
                0.01 // Z value so that port is infornt of the block
            );
        }
    }

    /**
     * <Based on the origin(x,y),inner-,middle- ant outer-Circle 
     * creats 3 shapes 2 annuli and one circle
     * aditionally it assigns colors to each shape>
     */
    createCellArray() {
        for (let i = 0; i < this.numPoints; i++) {
            const nextIndex = (i + 1) % this.numPoints;
            const innerPoint1 = i;
            const innerPoint2 = nextIndex;
            const middlePoint1 = i + this.numPoints;
            const middlePoint2 = nextIndex + this.numPoints;
            const outerPoint1 = i + 2 * this.numPoints;
            const outerPoint2 = nextIndex + 2 * this.numPoints;
            const origin = (0, 0, 0.01);

            // Connect origin to inner circle
            this.cells.insertNextCell([innerPoint1, origin, innerPoint2]); //creating shape
            this.colors.push(...this.color1);//assigning color

            // Connect inner circle to middle circle
            this.cells.insertNextCell([innerPoint1, middlePoint1, middlePoint2]);
            this.colors.push(...this.color2);

            this.cells.insertNextCell([innerPoint1, middlePoint2, innerPoint2]);
            this.colors.push(...this.color2);

            // Connect middle circle to outer circle
            this.cells.insertNextCell([middlePoint1, outerPoint1, outerPoint2]);
            this.colors.push(...this.color3);

            this.cells.insertNextCell([middlePoint1, outerPoint2, middlePoint2]);
            this.colors.push(...this.color3);
        }
    }

    /**
     * <creates a portActor with PolyData
     * and it sets the assigned colors of the shapes>
     */
    createPort() {
        this.calculatePoints();
        this.createCellArray();

        // Set points and polys
        this.portPolyData.setPoints(this.points);
        this.portPolyData.setPolys(this.cells);

        // Set colors
        this.portColorData = vtkDataArray.newInstance({
            numberOfComponents: 3,
            values: new Uint8Array(this.colors),
            name: 'Colors'
        });
        this.portPolyData.getCellData().setScalars(this.portColorData);

        // Mapper
        this.portMapper.setInputData(this.portPolyData);
        this.portMapper.setScalarModeToUseCellData();
        this.portMapper.setColorModeToDirectScalars();

        // Actor
        this.portActor.setMapper(this.portMapper);
    }

    /**
     * <Makes the port bigger>
     */
    increase() {
        const increase = 0.04;  // Adjust the increase value to be consistent with decrease
        this.innerRadius += increase;
        this.middleRadius += increase;
        this.outerRadius += increase;
    
        // Clear the old points and cells
        this.points = vtkPoints.newInstance();
        this.colors = [];
        this.cells = vtkCellArray.newInstance();
    
        // Recalculate points and cells
        this.calculatePoints();
        this.createCellArray();
    
        // Update portPolyData with new points and cells
        this.portPolyData.setPoints(this.points);
        this.portPolyData.setPolys(this.cells);
        this.portColorData.setData(new Uint8Array(this.colors));
        this.portPolyData.getCellData().setScalars(this.portColorData);
    }

    /**
     * <Makes the port smaller>
     */
    decrease() {
        const decrease = 0.04; // Adjust the increase value to be consistent with decrease
        this.innerRadius -= decrease;
        this.middleRadius -= decrease;
        this.outerRadius -= decrease;
    
        // Clear the old points and cells
        this.points = vtkPoints.newInstance();
        this.colors = [];
        this.cells = vtkCellArray.newInstance();
    
        // Recalculate points and cells
        this.calculatePoints();
        this.createCellArray();
    
        // Update portPolyData with new points and cells
        this.portPolyData.setPoints(this.points);
        this.portPolyData.setPolys(this.cells);
        this.portColorData.setData(new Uint8Array(this.colors));
        this.portPolyData.getCellData().setScalars(this.portColorData);
    }
}

export default Port;
