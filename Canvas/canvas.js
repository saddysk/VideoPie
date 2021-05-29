// Initializin variables
let painting = false;
let mode = "pen";
let line_width = 4;
let line_color = "black";
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

let undo_image = [];
let undo_index = -1;
let redo_image = [];
let redo_index = -1;

let canvas = null, context = null;

window.addEventListener("load", () => {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  //   Resizing
  resizeCanvas();

  //   Variables
  Variables();

  //   Functions
  function startPosition(e) {    
    painting = true;
    draw(e);

    e.preventDefault()
  }
  function finishedPosition(e) {
    painting = false;
    context.beginPath();

    e.preventDefault()

    if(e.type != "mouseout") {
      undo_image.push(context.getImageData(0, 0, canvas.width, canvas.height));
      undo_index += 1;
    }
  }

  // Start drawing
  function draw(e) {
    if (!painting) return;

    context.lineWidth = line_width;
    if (mode == "pen") {
      context.lineCap = "round";
      context.strokeStyle = line_color;

      context.lineTo(e.clientX, e.clientY);
      context.stroke();
      context.beginPath();
      context.moveTo(e.clientX, e.clientY);
    }
    else if (mode == "eraser") {
      context.strokeStyle = "white";
      context.lineTo(e.clientX, e.clientY);
      context.stroke();
    }
  }

  //   Eventlisteners
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mouseout", finishedPosition);
  canvas.addEventListener("mousemove", draw);
});

// Resizing canvas on window size change
window.addEventListener("resize", () =>	resizeCanvas());
// Resizing Canvas
function resizeCanvas() {
  let canvas_before_resize = context.getImageData(0, 0, canvas.width, canvas.height);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  context.putImageData(canvas_before_resize, 0, 0);
}

// Undo
function Undo() {
  if (undo_index <= 0) {
    last_undo();
  } else {
    redo_image.push(undo_image[undo_index]);
    redo_index += 1;

    undo_index -= 1;
    undo_image.pop();

    context.putImageData(undo_image[undo_index], 0, 0);
  }
}

// Redo
function Redo() {
  if (redo_index < 0) return

  context.putImageData(redo_image[redo_index], 0, 0);

  undo_image.push(redo_image[redo_index]);
  redo_image.pop();
  
  redo_index -= 1;
  undo_index += 1;
}

function last_undo() {
  if(undo_index == 0) {
    redo_image.push(undo_image[undo_index]);
    redo_index += 1;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);

  undo_image = [];
  undo_index = -1;
}

// Erase All
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// Assign Variables
function Variables() {
  // Eraser
  document
    .getElementById("eraser")
    .addEventListener("click", () => (mode = "eraser"));

  // Pen
  document
    .getElementById("pen")
    .addEventListener("click", () => (mode = "pen"));

  // Line width
  let slider = document.getElementById("myRange");
  slider.oninput = function () {
    line_width = this.value;
  };

  //   Color Picker
  let colopPicker = document.getElementById("colorpicker");
  colopPicker.oninput = function () {
    line_color = this.value;
  };
}
