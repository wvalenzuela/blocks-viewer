import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkLineSource from '@kitware/vtk.js/Filters/Sources/LineSource';

class Line {
    constructor(renderer, output) {
        this.renderer = renderer;
        this.output = output;
        //this.input = input;
        this.lineSource = vtkLineSource.newInstance();
        this.lineMapper = vtkMapper.newInstance();
        this.lineMapper.setInputConnection(this.lineSource.getOutputPort());
        this.lineActor = vtkActor.newInstance();
        this.lineActor.getProperty().setColor(0.0,0.0,0.0);
        this.lineActor.setMapper(this.lineMapper);
    }
    drawLine(start, end) {
        this.lineSource.setPoint1(start[0],start[1],0);
        this.lineSource.setPoint2(end[0], end[1], 0);
        this.renderer.addActor(this.lineActor);
    }
}

export default Line;