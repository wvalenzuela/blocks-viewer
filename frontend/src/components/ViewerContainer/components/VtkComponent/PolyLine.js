import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkPolydata from '@kitware/vtk.js/Common/DataModel/PolyData';



class PolyLine{
    constructor(renderer) {
        this.renderer = renderer;
        this.inputPort = null;
        this.outputPort = null;
        this.start = null;
        this.end = null;
        this.multiPrimitiveData = vtkPolydata.newInstance();
        this.multiPrimitiveMapper = vtkMapper.newInstance();
        this.multiPrimitiveActor = vtkActor.newInstance();
        this.multiPrimitiveActor.getProperty().setColor(0.0,0.0,0.0);//to implementen with differen line Types different type differnt color
        this.multiPrimitiveMapper.setInputData(this.multiPrimitiveData);
        this.multiPrimitiveActor.setMapper(this.multiPrimitiveMapper);
        this.multiPrimitiveActor.setPickable(false);
        this.renderer.addActor(this.multiPrimitiveActor);
    }

    //to implement with alg that line has same thickness now onely y is thickened 
    drawLine(start, end){
        this.start = start;
        this.end = end;
        const blockLineThickness = 0.05;
        const p1 = start;
        const temp = (start[0]+end[0])/2
        const p2 = [temp,start[1]];
        const p3 = [temp, end[1]];
        const p4 = end;

        const array = [
            p1[0], p1[1] + blockLineThickness/2, 0,
            p1[0], p1[1] - blockLineThickness/2, 0,
            p2[0], p2[1] - blockLineThickness/2, 0,
            p2[0], p2[1] + blockLineThickness/2, 0,
            p2[0]+ blockLineThickness/2, p2[1] , 0,
            p2[0]- blockLineThickness/2, p2[1] , 0,
            p3[0]- blockLineThickness/2, p3[1] , 0,
            p3[0]+ blockLineThickness/2, p3[1] , 0,
            p3[0], p3[1] + blockLineThickness/2, 0,
            p3[0], p3[1] - blockLineThickness/2, 0,
            p4[0], p4[1] - blockLineThickness/2, 0,
            p4[0], p4[1] + blockLineThickness/2, 0,
        ]

        //Points for the square of the line
        const multiPrimitvePoints = [
            start[0] , start[1] + blockLineThickness/2, 0, //first point
            start[0] , start[1] - blockLineThickness/2, 0, 
            end[0], end[1] - blockLineThickness/2, 0, 
            end[0], end[1] + blockLineThickness/2, 0,  // last point
          ];
        

        //gets points makes 3 points to one coordinate
        const multiPrimitiveData = vtkPolydata.newInstance();

        multiPrimitiveData.getPoints().setData(Float32Array.from(array),3)

        //connects the points
        multiPrimitiveData.getPolys().setData(Uint16Array.from(
            [
                4, 0, 1, 2, 3,// first number how many points have to be connectet other number the points to be connected in order left to right
                4, 4, 5, 6, 7,
                4, 8, 9, 10, 11,
            ]
        ));


        this.multiPrimitiveMapper.setInputData(multiPrimitiveData);



    }
}

export default PolyLine;