
let body = document.querySelector("body");

//entry point
function main() {
    JEEFACETRANSFERAPI.init({
      canvasId: "canvas2",
      NNCpath: "src/model/",
      callbackReady: function(errCode) {
        if (errCode) {
          console.log(
            "ERROR - cannot init JEEFACETRANSFERAPI. errCode =",
            errCode
          );
          errorCallback(errCode);
          return;
        }
        console.log("INFO : JEEFACETRANSFERAPI is ready !!!");
        successCallback();
      } //end callbackReady()
    });
} //end main()



function errorCallback(errorCode) {
    // Add code to handle the error
    alert("Cannot work without camera. Check if the camera is attached.");
}

function successCallback(){
  nextFrame();
}


var expression =[0,0,0,0,0,0,0,0];
var expressions;
var eyesClosedThreshold = 0.65;


function nextFrame(){
  expressions = JEEFACETRANSFERAPI.get_morphTargetInfluences();
  eyesClosedThreshold = 0.65  // For 65% open eyes

  
  expression[8] = expressions[8];
  expression[1] = expressions[1];
 
  if (expressions[8] >= eyesClosedThreshold)
  {
      console.log('right');
  }
  
  // Replay frame
  requestAnimationFrame(nextFrame);
}


 
// ----------------------------------------------------------------------------------------

requestAnimationFrame(animate);
const ctx = canvas1.getContext('2d');
canvas1.width = innerWidth;
canvas1.height = innerHeight;
const bgCan = copyCanvas(canvas1);
const redSize = 10, blueSize = 5; // circle sizes on pixels
const drawSpeed = 1.5; // when button down draw speed in pixels per frame

const drawButton = document.getElementById('drawbutton');
var draw = true;

var X = 50, Y = 50;
var angle = 0;

function copyCanvas(canvas) {
    const can = Object.assign(document.createElement("canvas"), {
        width: canvas.width, height: canvas.height
    });
    can.ctx = can.getContext("2d");
    return can;
}
function circle(ctx){
  if (expression[8] >= eyesClosedThreshold && !draw)
    return;

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(X, Y, redSize, 0, Math.PI*2);
    ctx.fill();
  
}

function circle11(ctx){
  if (expression[1] >= eyesClosedThreshold)
    return;

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(X, Y, redSize, 0, Math.PI*2);
    ctx.fill();
  
}
function direction(ctx){
    const d = blueSize + redSize + 5;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(d * Math.sin(angle) + X, d * Math.cos(angle) + Y, blueSize, 0, Math.PI*2);
    ctx.fill(); 
}
function animate(){
    ctx.clearRect(0, 0, ctx.canvas.width,  ctx.canvas.height);
    ctx.drawImage(bgCan, 0, 0);
    if (expression[8] >= eyesClosedThreshold) {
        circle(bgCan.ctx);
        const x = X + Math.sin(angle) * drawSpeed, y = Y + Math.cos(angle) * drawSpeed;
    
    if(x > (blueSize + redSize) * 2 && x < canvas1.width - (blueSize + redSize) * 2 &&
    y > (blueSize + redSize) * 2 && y < canvas1.height - (blueSize + redSize) * 2)
    {
      X = x;
      Y = y;
    }

    } else if(expression[1] >= eyesClosedThreshold){
        circle11(bgCan.ctx);
          const x = X + Math.sin(angle) * drawSpeed, y = Y + Math.cos(angle) * drawSpeed;
      
      if(x > (blueSize + redSize) * 2 && x < canvas1.width - (blueSize + redSize) * 2 &&
      y > (blueSize + redSize) * 2 && y < canvas1.height - (blueSize + redSize) * 2)
      {
        X = x;
        Y = y;
      }
    }
    else {
        angle += 0.06;
        circle(ctx);
    }
    direction(ctx);
    requestAnimationFrame(animate);   
}

