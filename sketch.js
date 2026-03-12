let video;
let can;
let faceMesh;
let faces = [];
let triangles;
let uvCoords;
let img0;
let img1;
let img2;
let img3;
let myRadio;
let dotsCheckbox;
let maskCheckbox;
let videoCheckbox;

function preload() {
  faceMesh = ml5.faceMesh({ maxFaces: 4 });
  img0 = loadImage("mask0.png");
  img1 = loadImage("mask1.png");
  img2 = loadImage("mask2.png");
  img3 = loadImage("mask3.png");
}

function windowResized() {
  centerCanvas();
}

function savePortraits() {
  saveCanvas('Portraits.png');
}

function keyPressed() {
  if (key === 's') {
    savePortraits();
  }
}

function gotFaces(results) {
  faces = results;
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  can.position(x, y);
}

function setup() {
  can = createCanvas(640, 480, WEBGL);
  centerCanvas();
  video = createCapture(VIDEO);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
  triangles = faceMesh.getTriangles();
  uvCoords = faceMesh.getUVCoords();
  myRadio = createRadio();
  myRadio.position(0, 65);
  myRadio.size(90);
  myRadio.option("0", "Mask 0");
  myRadio.option("1", "Mask 1");
  myRadio.option("2", "Mask 2");
  myRadio.option("3", "Mask 3");
  myRadio.option("4", "All");
  myRadio.selected("0");
  maskCheckbox = createCheckbox(" Mask");
  maskCheckbox.position(0, 45);
  dotsCheckbox = createCheckbox(" Dots");
  dotsCheckbox.position(0, 180);
  videoCheckbox = createCheckbox(" Video", true);
  videoCheckbox.position(0, 200);
}

function draw() {
  translate(-width / 2, -height / 2);
  if (videoCheckbox.checked()) {
    image(video, 0, 0);
  } else {
    background(0);
  }
  if (dotsCheckbox.checked()) {
    dots();
  }
  if (maskCheckbox.checked()) {
    mask();
  }
}

function dots() {
  if (faces.length > 0) {
    for (let loop1 = 0; loop1 < faces.length; loop1++) {
      let face = faces[loop1];
      for (let loop2 = 0; loop2 < face.keypoints.length; loop2++) {
        fill(0, 255, 0);
        circle(face.keypoints[loop2].x, face.keypoints[loop2].y, 3);
      }
    }
  }
}

function mask() {
  if (faces.length > 0) {
    for (let loop = 0; loop < faces.length; loop++) {
      let face = faces[loop];
      let val;
      if (myRadio.value() == 4) {
        val = loop.toString();
      } else {
        val = myRadio.value();
      }
      switch (val) {
        case "0":
          texture(img0);
          break;
        case "1":
          texture(img1);
          break;
        case "2":
          texture(img2);
          break;
        default:
          texture(img3);
      }
      textureMode(NORMAL);
      noStroke();
      beginShape(TRIANGLES);
      for (let i = 0; i < triangles.length; i++) {
        let tri = triangles[i];
        let [a, b, c] = tri;
        let pointA = face.keypoints[a];
        let pointB = face.keypoints[b];
        let pointC = face.keypoints[c];
        let uvA = uvCoords[a];
        let uvB = uvCoords[b];
        let uvC = uvCoords[c];

        vertex(pointA.x, pointA.y, uvA[0], uvA[1]);
        vertex(pointB.x, pointB.y, uvB[0], uvB[1]);
        vertex(pointC.x, pointC.y, uvC[0], uvC[1]);
      }
      endShape();
    }
  }
}