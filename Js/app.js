let tabChange = 0;
let differentUserCount = 0;
let unFocussedCount = 0;
let activityCount = 0;

// * All Constants
const FOCUSED = "Focused";
const NO_ACTIVITY = "No Activity";
const MAX_COUNT = 20;
const MAX_SUSPICIOUS_COUNT = 5;

// * Listen for activity change
function createAlert(alertMsg) {
  swal(alertMsg);
}

const urlParams = new URLSearchParams(window.location.search);
const sid = urlParams.get("sid");

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") {
    tabChange++;
    console.log(`You changed the tab: ${tabChange} times`);
    if (tabChange >= 3) {
      alert("You have reached max limit of tab change");
      goToHome();
    }
  }
});

// Classifier Variable
let focusedClassifier, suspiciousClassifier, identityClassifier;
// Model URL
let focusedModelUrl =
  "https://teachablemachine.withgoogle.com/models/lPaUnGWj_/";
let suspiciousModelUrl =
  "https://teachablemachine.withgoogle.com/models/c83i40FOO/";
// let identityModelUrl =
//   "https://teachablemachine.withgoogle.com/models/jlXMvG6DG/";

let video;
let flippedVideo;
let label = "Checking";
let label1 = "Checking";
let label2 = "Checking";

// * Load all the models
function preload() {
  focusedClassifier = ml5.imageClassifier(focusedModelUrl + "model.json");
  suspiciousClassifier = ml5.imageClassifier(suspiciousModelUrl + "model.json");
  //identityClassifier = ml5.imageClassifier(identityModelUrl + "model.json");
}

function setup() {
  createCanvas(260, 210);
  // Create the video
  video = createCapture(VIDEO);
  video.size(260, 210);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  // Trigger all Classifier at first
  initAllClassifier();
}

function initAllClassifier() {
  classifyFocused();
  classifySuspicious();
  //classifyIdentity();
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  // textSize(16);
  // textAlign(CENTER);
  // text(label, width / 2, height - 50);
  // text(label1, width / 2, height - 30);
  // text(label2, width / 2, height - 10);
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
    console.log(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  // console.log(results[0].label);
  label = results[0].label;
  console.log(results[0].label);
  if (results[0].label === FOCUSED) {
    unFocussedCount = 0;
  } else {
    unFocussedCount++;
    if (unFocussedCount > MAX_COUNT) {
      createAlert("You are not focussed");
      unFocussedCount = 0;
    }
  }
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
    console.log(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0].label);
  label1 = results[0].label;
  //console.log(results[0].label);
  if (results[0].label === NO_ACTIVITY) {
    activityCount = 0;
  } else {
    activityCount++;
    if (activityCount >= MAX_SUSPICIOUS_COUNT) {
      createAlert("An Inappropriate activity has been detected");
      activityCount = 0;
    }
  }
}

// * For identity mode
// setInterval(() => {
//   classifyIdentity();
// }, 100);

// function classifyIdentity() {
//   flippedVideo = ml5.flipImage(video);
//   identityClassifier.classify(flippedVideo, identityResult);
//   // flippedVideo.remove();
// }
//
// function identityResult(error, results) {
//   // If there is an error
//   if (error) {
//     console.log(error);
//     return;
//   }
//   // The results are in an array ordered by confidence.
//   // console.log(results[0]);
//   // console.log(results[0].label);
//   label2 = results[0].label;
//   if (sid === results[0].label) {
//     // console.log("Same user found");
//     differentUserCount = 0;
//   } else {
//     // console.log("Unknown user");
//     differentUserCount++;
//     if (differentUserCount > MAX_COUNT) {
//       createAlert("Unrecognised user");
//       differentUserCount = 0;
//     }
//   }
//
//   // Classifiy again!
// }

// ************************* QUIZ UI ********************************

const quesNumb = document.querySelector(".que_num");
const quesText = document.querySelector(".que_txt");
const optionsContainer = document.querySelector(".options");
const ansIndicatorContain = document.querySelector(".ans-indicators");
const startBox = document.querySelector(".start_box");
const quizBox = document.querySelector(".quiz_box");
const resultBox = document.querySelector(".result_box");

let queCntr = 0;
let currentQues;
let availableQues = [];
let availableOption = [];
let correctAns = 0;
let attempt = 0;

function setavailableQues() {
  const totalQues = quiz.length;
  for (let i = 0; i < totalQues; i++) {
    availableQues.push(quiz[i]);
  }
}

function getNewQues() {
  quesNumb.innerHTML = "Question " + (queCntr + 1) + " of " + quiz.length;
  const quesIndex =
    availableQues[Math.floor(Math.random() * availableQues.length)];
  currentQues = quesIndex;
  quesText.innerHTML = currentQues.q;
  const ind1 = availableQues.indexOf(quesIndex);
  availableQues.splice(ind1, 1);

  const optionLength = currentQues.options.length;
  for (let i = 0; i < optionLength; i++) {
    availableOption.push(i);
  }
  optionsContainer.innerHTML = "";
  let animationDelay = 0.1;
  for (let i = 0; i < optionLength; i++) {
    const optionIndex =
      availableOption[Math.floor(Math.random() * availableOption.length)];
    const ind2 = availableOption.indexOf(optionIndex);
    availableOption.splice(ind2, 1);
    const option = document.createElement("div");
    option.innerHTML = currentQues.options[optionIndex];
    option.id = optionIndex;
    option.style.animationDelay = animationDelay + "s";
    animationDelay = animationDelay + 0.1;
    option.className = "option";
    optionsContainer.appendChild(option);
    option.setAttribute("onclick", "getResult(this)");
  }
  queCntr++;
}
function getResult(element) {
  const id = parseInt(element.id);
  if (id === currentQues.answer) {
    element.classList.add("correct");
    updateAnsIndicator("correct");
    correctAns++;
  } else {
    element.classList.add("wrong");
    updateAnsIndicator("wrong");
    const optionLength = optionsContainer.children.length;
    for (let i = 0; i < optionLength; i++) {
      if (parseInt(optionsContainer.children[i].id) === currentQues.answer) {
        optionsContainer.children[i].classList.add("correct");
      }
    }
  }
  attempt++;
  restrictClick();
}
function updateAnsIndicator(m) {
  ansIndicatorContain.children[queCntr - 1].classList.add(m);
}
function restrictClick() {
  const optionLength = optionsContainer.children.length;
  for (let i = 0; i < optionLength; i++) {
    optionsContainer.children[i].classList.add("already-answered");
  }
}
function ansIndicators() {
  ansIndicatorContain.innerHTML = "";
  const totalQues = quiz.length;
  for (i = 0; i < totalQues; i++) {
    const indicator = document.createElement("div");
    ansIndicatorContain.appendChild(indicator);
  }
}
function next() {
  if (queCntr === quiz.length) {
    console.log("Quiz Over");
    quizOver();
  } else {
    getNewQues();
  }
}
function quizOver() {
  quizBox.classList.add("hide");
  resultBox.classList.remove("hide");
  quizResult();
}
function quizResult() {
  resultBox.querySelector(".total_que").innerHTML = quiz.length;
  resultBox.querySelector(".total_attempt").innerHTML = attempt;
  resultBox.querySelector(".total_right").innerHTML = correctAns;
  resultBox.querySelector(".total-wrong").innerHTML = attempt - correctAns;
  const per = (correctAns / quiz.length) * 100;
  resultBox.querySelector(".percent").innerHTML = per.toFixed(2) + "%";
  resultBox.querySelector(".total-score").innerHTML =
    correctAns + " / " + quiz.length;
}
function resetQuiz() {
  queCntr = 0;
  correctAns = 0;
  attempt = 0;
}
function tryAgainQuiz() {
  resultBox.classList.add("hide");
  quizBox.classList.remove("hide");
  resetQuiz();
  startQuiz();
}
function goToHome() {
  tabChange = 0;
  resultBox.classList.add("hide");
  quizBox.classList.add("hide");
  startBox.classList.remove("hide");
  resetQuiz();
}
function startQuiz() {
  startBox.classList.add("hide");
  quizBox.classList.remove("hide");
  setavailableQues();
  getNewQues();
  ansIndicators();
}
