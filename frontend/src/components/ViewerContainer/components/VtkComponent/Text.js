import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkPixelSpaceCallbackMapper from '@kitware/vtk.js/Rendering/Core/PixelSpaceCallbackMapper';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray'
import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
import vtkQuad from '@kitware/vtk.js/Common/DataModel/Quad';
import vtkCell from '@kitware/vtk.js/Common/DataModel/Cell';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkVolumeProperty from '@kitware/vtk.js/Rendering/Core/VolumeProperty';

const { createCanvas } = require('canvas');


export function createTextPolydata(text, x,y) {

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set font properties
    const fontSize = 128;
    const fontFamily = 'Segoe UI';
    const fontStyle = 'normal';
    const fontWeight = 'normal';
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

    // Measure text dimensions
    const textMetrics = ctx.measureText(text);
    const width = Math.ceil(textMetrics.width);
    const height = fontSize; // approximate height

    // Resize canvas to fit text
    canvas.width = width;
    canvas.height = height;
   // canvas.style.width = `${width}px`; // Set CSS width to original width
   // canvas.style.height = `${height}px`;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set text properties
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'top';
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

    // Draw text
    ctx.fillText(text, 0, 0);

   

    // Convert canvas to ImageData
    const imageData = ctx.getImageData(0, 0, width, height);

    // Convert ImageData to polydata (for simplicity, we'll use points)
    const cellArray = vtkCellArray.newInstance();

    const points = vtkPoints.newInstance();
    const haha = []
    haha.push(-1000,-1000,0,8000,-1000,0,8000,2000, 0,-1000,2000,0)
    cellArray.insertNextCell([0,1,2,3])
    const xd = [];
    const opacity = [];
    const col = []
    col.push(1,1,1,1)
    //let ind = 4;
    let ind = 4;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4; // RGBA
            const alpha = imageData.data[idx + 3];
            if (alpha > 0) {
                cellArray.insertNextCell([ind, ind+1,ind+2,ind+3])
                opacity.push(alpha/255);
                col.push(0,0,0,alpha/255)
                //wichtig
                const xx = x*10
                const yy = (height-y)*10
                //cellArray.setData(Float32Array.from([ind,ind+1,ind+2,ind+3]))
                //wichtig
                haha.push(xx, yy, 0, xx+10, yy,0,xx+10,yy+10,0,xx,yy+10,0)
                //wichtig
                xd.push(4, ind, ind+1, ind+2, ind+3);
                //wichtig
                ind = ind + 4;
            }
        }
    }

    points.setData(Float32Array.from(haha))
    


    const colorDataArray = vtkDataArray.newInstance({
         numberOfComponents: 4,
         values: Float32Array.from(col),
      });
     // colorDataArray.setData(Float32Array.from(col));


    const multiPrimitiveData = vtkPolyData.newInstance();

    //multiPrimitiveData.setPoints(points)

    multiPrimitiveData.getPoints().setData(Float32Array.from(haha),3)

    
    //connects the points
    //multiPrimitiveData.getPolys().setData(Uint16Array.from(
    //    xd
    //));
    multiPrimitiveData.setPolys(cellArray)
    //multiPrimitiveData.getPolys().insertNextCell()


    //console.log(multiPrimitiveData.getCellData().getScalars().getData())

    

    // Array to store cell information



    multiPrimitiveData.getCellData().setScalars(colorDataArray);
    multiPrimitiveData.getCellData().getScalars()


    const multiPrimitiveMapper = vtkMapper.newInstance();

    multiPrimitiveMapper.setInputData(multiPrimitiveData)


    const multiPrimitiveActor = vtkActor.newInstance();


    multiPrimitiveActor.setMapper(multiPrimitiveMapper);
    multiPrimitiveMapper.setScalarModeToUseCellData();
    multiPrimitiveMapper.setColorModeToDirectScalars()
   // const lut = vtkColorTransferFunction.newInstance();
    //for (let i = 0; i < 256; i++) {
    //    const c = 1-i/255
     //   lut.addRGBPoint(i, c,c,c, 1)
    //}

      //lut.addRGBPoint(0, 1,1,1,1)
      //lut.addRGBPoint(1,1,0,0,0.1);
      
   //multiPrimitiveMapper.setLookupTable(lut)
   //multiPrimitiveMapper.setInterpolateScalarsBeforeMapping(false)
   const ps = []
   ps.push(-1000,-1000,0,8000,-1000,0,8000,2000, 0,-1000,2000,0)
   const cA = vtkCellArray.newInstance();
   const cc = []
   cc.push(1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1)
   const ccc = vtkDataArray.newInstance({
    numberOfComponents: 4,
    values: Float32Array.from(cc),
 });

    cA.insertNextCell([0,1,2,3])

   const poly = vtkPolyData.newInstance()
   console.log(poly.getPoints().getData())
   poly.getPoints().setData(Float32Array.from(ps),3)
   poly.setPolys(cA)
   poly.getCellData().setScalars(ccc);
   const map = vtkMapper.newInstance()

    map.setInputData(poly)
   map.setColorModeToDirectScalars()
 //  map.setScalarModeToUseCellData()
   const act = vtkActor.newInstance()
   act.setMapper(map)

    





    // Create vtkPolyData
  //  return multiPrimitiveActor
  return act



}



export default Text;
