const canvas = document.querySelector('canvas');
toolBtns = document.querySelectorAll('.tool');
fillColor = document.querySelector('#fill-color');
sizeSlider = document.querySelector('#size-slider');
colorBtns = document.querySelectorAll('.colors .option');
colorPicker = document.querySelector('#color-picker');
clearCanvas = document.querySelector('.clear-canvas');
saveImg = document.querySelector('.save-img');


ctx = canvas.getContext('2d');

//gloabal variables with default value
let prevMoveX, prevMoveY, snapshot;
isDrawing = false;
selectedTool = 'brush';
brushWidth = 5;
selectedColor = '#000'

const setCanvasBackground = () => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; //setting fillstyle back to the secledColor, it will be the brush color
}

window.addEventListener('load', () =>{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMoveX - e.offsetX, prevMoveY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMoveX - e.offsetX, prevMoveY - e.offsetY);
}
const drawCircle = (e) => {
    ctx.beginPath();
    //getting radius  for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMoveX - e.offsetX), 2) + Math.pow((prevMoveY - e.offsetY), 2));
    ctx.arc(prevMoveX, prevMoveY, radius, 0, 2 * Math.PI);//creating circle according to the mouse pointer 
    fillColor.checked ? ctx.fill() : ctx.stroke();// if fillcolor fill circle else draw border circle 
}
const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMoveX, prevMoveY);  
    ctx.lineTo(e.offsetX, e.offsetY); 
    ctx.lineTo(prevMoveX*2 - e.offsetX, e.offsetY);
    ctx.closePath();    
    fillColor.checked ? ctx.fill() : ctx.stroke();  // Fill or stroke based on checkbox
}

const startDraw = (e) => {
    isDrawing = true;
    prevMoveX = e.offsetX; //
    prevMoveY = e.offsetY; //
    ctx.beginPath(); //creating new path to draw
    ctx.lineWidth = brushWidth; //passing brushSize as line width
    ctx.strokeStyle = selectedColor; //passing selected color as stroke color
    ctx.fillStyle = selectedColor; //passing selected color as fill color

    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return;//if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0);//adding copied canvas data on to this canvas
    if(selectedTool === 'brush' || selectedTool === 'eraser'){
        //if we select eraser stroke style will be white 
        //to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); //creating lines using pointer.
        ctx.stroke(); //drawing/filling lines with color.
    } else if (selectedTool === 'rectangle'){
        drawRect(e);
    } else if (selectedTool === 'circle'){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
    
}
toolBtns.forEach(btn => {
    btn.addEventListener('click', () => { //adding click event to all tool options
        //removing active class from the previous options and adding on current clicked option
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});
 
sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value);//changing value of brush with slider

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {//adding click event to color btn
        //removing active class from the previous options and adding on current clicked option
        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add('selected');
        //passing selected btn background color as selected value 
        selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color');
    });
});
colorPicker.addEventListener('change', () =>{
    //passing picked color value from color picker to last color btn backgwound 

    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);//clear whole canvas
    setCanvasBackground();
});
saveImg.addEventListener('click', () => {
    const link = document.createElement('a'); //creating <a> element
    link.download = `${Date.now()}.jpg`; //passing current date as link download value.
    link.href = canvas.toDataURL();//passing canvas data as link href value.
    link.click();//clicking link to download and enjoy the code.
});
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', () => isDrawing = false);



