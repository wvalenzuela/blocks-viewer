import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkPolydata from "@kitware/vtk.js/Common/DataModel/PolyData";
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkPixelSpaceCallbackMapper from '@kitware/vtk.js/Rendering/Core/PixelSpaceCallbackMapper';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray'
import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
import vtkQuad from '@kitware/vtk.js/Common/DataModel/Quad';
import vtkCell from '@kitware/vtk.js/Common/DataModel/Cell';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkVolumeProperty from '@kitware/vtk.js/Rendering/Core/VolumeProperty';


/**
 * <Creates a text as polydata. Renders the text on a canvas and gets the imagedata of the pixels.
 * Pixels with alpha greater than zero get turned into polygons and added to a polydata object.>
 * @method createText - creates the text as polydata
 * @param x position of the block
 * @param y position of the block
 * @param xOffset offset for the position of the text
 * @param yOffset offset for the position of the text
 * @param text name of the block
 * @param textSize height of the text in the block
 */
class Text {
    constructor(x,y,xOffset, yOffset,text,textSize) {
        this.polytext = vtkPolydata.newInstance();
        this.mapper = vtkMapper.newInstance();
        this.actor = vtkActor.newInstance({ position: [x, y, 0] });
        this.actor.setPickable(false)
        this.mapper.setInputData(this.polytext);
        this.mapper.setColorModeToDirectScalars();
        this.mapper.setScalarModeToUseCellData()
        this.actor.setMapper(this.mapper)
        this.createText(xOffset,yOffset,text,textSize)
    }

    createText(xText,yText,text,textSize) {
        
    //create text
    // Create a canvas element
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');

    // Set font properties
    const fontSize = 64;
    const fontFamily = 'Segoe UI';
    const fontStyle = 'normal';
    const fontWeight = 'normal';
    textCtx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

    // Measure text dimensions
    const textMetrics = textCtx.measureText(text);
    const textWidth = Math.ceil(textMetrics.width);
    const textHeight = fontSize; // approximate height

    // Resize canvas to fit text
    textCanvas.width = textWidth;
    textCanvas.height = textHeight;

    // Clear canvas
    textCtx.clearRect(0, 0, textWidth, textHeight);

    // Set text properties
    textCtx.fillStyle = 'white';
    textCtx.textBaseline = 'top';
    textCtx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

    // Draw text
    textCtx.fillText(text, 0, 0);

    // Convert canvas to ImageData
    const imageData = textCtx.getImageData(0, 0, textWidth, textHeight);
    const points = []
    const pointIds = vtkCellArray.newInstance();
    const scalars = []
    let cellIndex = 0;

    for (let y = 0; y < textHeight; y++) {
        for (let x = 0; x < textWidth; x++) {
            const idx = (y * textWidth + x) * 4; // RGBA
            const alpha = imageData.data[idx + 3];
            if (alpha > 0) {
                pointIds.insertNextCell([cellIndex, cellIndex+1,cellIndex+2,cellIndex+3])
                scalars.push(0,0,0,alpha/255)
                const scale = (textSize/textHeight)
                const xx = xText + (x*scale)
                const yy = yText + ((textHeight-y)*scale)
                points.push(xx, yy, 0, xx+scale, yy,0,xx+scale,yy+scale,0,xx,yy+scale,0)
                cellIndex += 4;
            }
        }
    }
    this.polytext.getPoints().setData(Float32Array.from(points), 3);
    this.polytext.setPolys(pointIds)
    const colorDataArray = vtkDataArray.newInstance({
        values: Float32Array.from(scalars), 
        numberOfComponents: 4,
    });
    this.polytext.getCellData().setScalars(colorDataArray);
    }
}

export default Text;
