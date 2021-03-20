//get reference to canvas
let canvas = document.getElementById("canvas");

//get the reference to the canvas context
let context = canvas.getContext("2d");

//get reference to loading screen
let loading_screen = document.getElementById("loading");

//Initialize loading variables
let loaded = false;
let load_counter = 0;

// Initialize images for layers
let background = new Image();
let spaceDust = new Image();
let stars = new Image();
let shadow = new Image();
let mask = new Image();
let floatingItems = new Image();
let yellowGirl = new Image();
let binary = new Image();
let starsPlanets = new Image();

// create a list of layer objects
let layer_list = [
  {
    image: background,
    src: "./images/layer_1_1.png",
    z_index: -2.25,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
  },
  {
    image: spaceDust,
    src: "./images/layer_2_1.png",
    z_index: -2,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
  },
  {
    image: stars,
    src: "./images/layer_3_1.png",
    z_index: -1.25,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
  },
  {
    image: shadow,
    src: "./images/layer_4_1.png",
    z_index: -0.5,
    position: { x: 0, y: 0 },
    blend: "multiply",
    opacity: 1,
  },
  {
    image: mask,
    src: "./images/layer_5_1.png",
    z_index: 0,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
  },
  {
    image: floatingItems,
    src: "./images/layer_6_1.png",
    z_index: 0.4,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
  },
  {
    image: yellowGirl,
    src: "./images/layer_7_1.png",
    z_index: 2,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
  },
  {
    image: binary,
    src: "./images/layer_8_1.png",
    z_index: 1.2,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
  },
  {
    image: starsPlanets,
    src: "./images/layer_9_1.png",
    z_index: 1.2,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
  },
];

layer_list.forEach(function (layer, index) {
  //hide the loading screen
  hideLoading();
  layer.image.onload = function () {
    load_counter += 1;
    if (load_counter >= layer_list.length) {
      requestAnimationFrame(drawCanvas);
    }
  };
  layer.image.src = layer.src;
});

function hideLoading() {
  loading_screen.classList.add("hidden");
}

function drawCanvas() {
  //clear whatever is in the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  //Update the Tween
  TWEEN.update();

  //calculate how much the canvas should rotate
  let rotate_x = (pointer.y * -0.06) + (motion.y * -1);
  let rotate_y = (pointer.x * 0.015) + (motion.x * 1);

  let transform_string = "rotateX(" + rotate_x +"deg) rotateY(" + rotate_y + "deg)";

  //actually rotate the canvas
  canvas.style.transform = transform_string;

  //loop through each layer and draw it to the canvas
  layer_list.forEach(function (layer, index) {
    layer.position = getOffset(layer);

    if (layer.blend) {
      context.globalCompositeOperation = layer.blend;
    } else {
      context.globalCompositeOperation = "normal";
    }

    // context.globalAlpha = layer.opacity;

    context.drawImage(layer.image, layer.position.x, layer.position.y);
  });

  requestAnimationFrame(drawCanvas);
}

function getOffset(layer) {
  let touch_multiplier = 0.03;
  let touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
  let touch_offset_y = pointer.y * layer.z_index * touch_multiplier;

  let motion_multiplier = 2.5;
  let motion_offset_x = motion.x * layer.z_index * motion_multiplier;
  let motion_offset_y = motion.y * layer.z_index * motion_multiplier;

  let offset = {
    x: touch_offset_x + motion_offset_x,
    y: touch_offset_y + motion_offset_y,
  };

  return offset;
}

// TOUCH && MOUSE CONTROLS

let moving = false;

//Initialize touch and mouse position

let pointer_initial = {
  x: 0,
  y: 0,
};

let pointer = {
  x: 0,
  y: 0,
};

canvas.addEventListener("touchstart", pointerStart);
canvas.addEventListener("mousedown", pointerStart);

function pointerStart(event) {
  moving = true;
  if (event.type === "touchstart") {
    pointer_initial.x = event.touches[0].clientX;
    pointer_initial.y = event.touches[0].clientY;
  } else if (event.type === "mousedown") {
    pointer_initial.x = event.clientX;
    pointer_initial.y = event.clientY;
  }
}

window.addEventListener("touchmove", pointerMove);
window.addEventListener("mousemove", pointerMove);

function pointerMove(event) {
  event.preventDefault();
  if (moving === true) {
    let current_x = 0;
    let current_y = 0;
    if (event.type === "touchmove") {
      current_x = event.touches[0].clientX;
      current_y = event.touches[0].clientY;
    } else if (event.type === "mousemove") {
      current_x = event.clientX;
      current_y = event.clientY;
    }
    pointer.x = current_x - pointer_initial.x;
    pointer.y = current_y - pointer_initial.y;
  }
}

canvas.addEventListener("touchmove", function (event) {
  event.preventDefault();
});

canvas.addEventListener("mousemove", function (event) {
  event.preventDefault();
});

window.addEventListener("touchend", function (event) {
  endGesture();
});

window.addEventListener("mouseup", function (event) {
  endGesture();
});

function endGesture() {
  moving = false;

  TWEEN.removeAll();
  let pointer_tween = new TWEEN.Tween(pointer).to({x: 0, y: 0}, 600).easing(TWEEN.Easing.Back.Out).start();
}

//MOTION CONTROLS

// Initialize variables motion-based parallax

var motion_initial = {
  x: null,
  y: null,
};

var motion = {
  x: 0,
  y: 0,
};

//Listen to gyroscope events
window.addEventListener("deviceorientation", function (event) {
  // if this is the first time through
  if (!motion_initial.x && !motion_initial.y) {
    motion_initial.x = event.beta;
    motion_initial.y = event.gamma;
  }

  if (window.orientation === 0) {
    //the device is in portrait orientation
    motion.x = event.gamma - motion_initial.y;
    motion.y = event.beta - motion_initial.x;
  } else if (window.orientation === 90) {
    //the device is in landscape on its left side
    motion.x = event.beta - motion_initial.x;
    motion.y = -event.gamma + motion_initial.y;
  } else if (window.orient === -90) {
    //the device is in landscape on its right side
    motion.x = event.beta + motion_initial.x;
    motion.y = event.gamma - motion_initial.y;
  } else {
    //the device is upside down
    motion.x = -event.gamma + motion_initial.y;
    motion.y = -event.beta + motion_initial.x;
  }
});

window.addEventListener("orientationchange", function (event) {
  motion_initial.x = 0;
  motion_initial.y = 0;
});