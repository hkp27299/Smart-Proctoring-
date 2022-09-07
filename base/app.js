let tabChange = 0;

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") {
    tabChange++;
    console.log(`You changed the tab: ${tabChange} times`);
  }
});
// Classifier Variable
let focusedClassifier, suspiciousClassifier, identityClassifier;
// Model URL
let focusedModelUrl =
  "https://teachablemachine.withgoogle.com/models/lPaUnGWj_/";
let suspiciousModelUrl =
  "https://teachablemachine.withgoogle.com/models/6ZSm6dKX9/";
let identityModelUrl =
  "https://teachablemachine.withgoogle.com/models/jlXMvG6DG/";

let video;
let flippedVideo;
let label = "Checking";
let label1 = "Checking";
let label2 = "Checking";

// * Load all the models
function preload() {
  focusedClassifier = ml5.imageClassifier(focusedModelUrl + "model.json");
  suspiciousClassifier = ml5.imageClassifier(suspiciousModelUrl + "model.json");
  identityClassifier = ml5.imageClassifier(identityModelUrl + "model.json");
}

function setup() {
  createCanvas(520, 460);
  // Create the video
  video = createCapture(VIDEO);
  video.size(400, 320);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  // Trigger all Classifier at first
  initAllClassifier();
}

function initAllClassifier() {
  classifyFocused();
  classifySuspicious();
  classifyIdentity();
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 50);
  text(label1, width / 2, height - 30);
  text(label2, width / 2, height - 10);
}

// * For focused
setInterval(() => {
  classifyFocused();
}, 100);

function classifyFocused() {
  flippedVideo = ml5.flipImage(video);
  focusedClassifier.classify(flippedVideo, focusedResult);
  // flippedVideo.remove();
}

function focusedResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
}

// * For suspicious mode
setInterval(() => {
  classifySuspicious();
}, 100);

function classifySuspicious() {
  flippedVideo = ml5.flipImage(video);
  suspiciousClassifier.classify(flippedVideo, suspiciousResult);
  // flippedVideo.remove();
}

function suspiciousResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label1 = results[0].label;
  // Classifiy again!
}

// * For identity mode
setInterval(() => {
  classifyIdentity();
}, 100);

function classifyIdentity() {
  flippedVideo = ml5.flipImage(video);
  identityClassifier.classify(flippedVideo, identityResult);
  // flippedVideo.remove();
}

function identityResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label2 = results[0].label;

  // Classifiy again!
}
