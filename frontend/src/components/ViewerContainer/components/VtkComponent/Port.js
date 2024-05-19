import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkCircleSource from '@kitware/vtk.js/Filters/Sources/CircleSource';

class Port {
    constructor(x, y, type, block, id, bpid){
        this.id = id;
        this.bpid = bpid;
        this.block = block;
        this.type = type;
        this.connection = [];
        this.circle = vtkCircleSource.newInstance({
            resolution: 100, // Number of points to define the circle
            radius: 0.15
          });
        this.circle.setDirection(0,0,1)
        
        this.circleMapper = vtkMapper.newInstance();
        this.circleMapper.setInputConnection(this.circle.getOutputPort());
        //console.log(this.y+spacing);
        this.circleActor = vtkActor.newInstance({ position: [x,y, 0] });
        this.circleActor.getProperty().setEdgeVisibility(true);
        this.circleActor.getProperty().setColor(1.0,0,0);
        this.circleActor.setMapper(this.circleMapper);
        
        this.block.renderer.addActor(this.circleActor);
        this.block.ports.push(this);
        this.block.diagram.relation.set(this.circleActor, this);
    }
}
export default Port;