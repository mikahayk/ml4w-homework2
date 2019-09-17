// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
KNN Classification on Webcam Images with mobileNet. Built with p5.js
=== */
let video;
// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
// Create a featureExtractor that can extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelReady);

function setup() {
  noCanvas();
  // Create a video element
  video = createCapture(VIDEO, function() {
    video.elt.addEventListener('loadedmetadata', videoMetadataLoaded);


  });
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');

  createButtons();


}

function videoMetadataLoaded() {
  console.log("Metadata loaded!");
  console.log("Capture: " + video.width + ", " + video.height);
  console.log("Video element: " + video.elt.videoWidth + ", " + video.elt.videoHeight);
  console.log("videoMetadataLoaded");

}

function modelReady(){
  console.log("FeatureExtractor(mobileNet model) Loaded");

  loadDataset();
}


// Predict the current frame.
function classify() {
  // Get the total number of classes from knnClassifier
  const numClasses = knnClassifier.getNumLabels();
  if (numClasses <= 0) {
    console.error('There is no examples in any class');
    return;
  }
  // Get the features of the input video
  const features = featureExtractor.infer(video);

  // Use knnClassifier to classify which class do these features belong to
  // You can pass in a callback function `gotResults` to knnClassifier.classify function
  knnClassifier.classify(features, gotResults);
  // You can also pass in an optional K value, K default to 3
  // knnClassifier.classify(features, 3, gotResults);

  // You can also use the following async/await function to call knnClassifier.classify
  // Remember to add `async` before `function predictClass()`
  // const res = await knnClassifier.classify(features);
  // gotResults(null, res);
}


// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confideces = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {

      typeEmoji(result.label);

    }
  }

  //classify();
}

function datasetLoaded() {
  console.log("Dataset is loaded");

}

// Load dataset to the classifier
function loadDataset() {
  knnClassifier.load('./myKNNDataset.json', datasetLoaded);
}
function createButtons() {

  type = select('#typeEmoji');
  type.mousePressed(function() {
    classify();
  });
}
function typeEmoji(label) {
  let emojis = {
    "Smile": "😀",
    "Sunglasses": "😎",
    "Thinking": "🤔",
    "Tongue": "😛"
  }


  textarea = select('#message');
  textarea.value(textarea.value() + emojis[label]);
  //console.log(textarea);
}
