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
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');
  // Create the UI buttons
  createButtons();
}

function modelReady(){
  select('#status').html('FeatureExtractor(mobileNet model) Loaded')
}

// Add the current frame from the video to the classifier
function addExample(label) {
  // Get the features of the input video
  const features = featureExtractor.infer(video);
  // You can also pass in an optional endpoint, defaut to 'conv_preds'
  // const features = featureExtractor.infer(video, 'conv_preds');
  // You can list all the endpoints by calling the following function
  // console.log('All endpoints: ', featureExtractor.mobilenet.endpoints)

  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  updateExampleCounts();
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

// A util function to create UI buttons
function createButtons() {
  // When the A button is pressed, add the current frame
  // from the video with a label of "rock" to the classifier
  buttonA = select('#addClassSmile');
  buttonA.mousePressed(function() {
    addExample('Smile');
  });

  // When the B button is pressed, add the current frame
  // from the video with a label of "paper" to the classifier
  buttonB = select('#addClassSunglasses');
  buttonB.mousePressed(function() {
    addExample('Sunglasses');
  });

  // When the C button is pressed, add the current frame
  // from the video with a label of "scissor" to the classifier
  buttonC = select('#addClassThinking');
  buttonC.mousePressed(function() {
    addExample('Thinking');
  });

  buttonD = select('#addClassTongue');
  buttonD.mousePressed(function() {
    addExample('Tongue');
  });


  // Reset buttons
  resetBtnA = select('#resetSmile');
  resetBtnA.mousePressed(function() {
    clearClass('Smile');
  });

  resetBtnB = select('#resetSunglasses');
  resetBtnB.mousePressed(function() {
    clearClass('Sunglasses');
  });

  resetBtnC = select('#resetThinking');
  resetBtnC.mousePressed(function() {
    clearClass('Thinking');
  });

  resetBtnD = select('#resetTongue');
  resetBtnD.mousePressed(function() {
    clearClass('Tongue');
  });

  // Load saved classifier dataset
  buttonSetData = select('#load');
  buttonSetData.mousePressed(loadDataset);


  // Predict button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);

  // Clear all classes button
  buttonClearAll = select('#clearAll');
  buttonClearAll.mousePressed(clearAllClasses);

  // Get classifier dataset
  buttonGetData = select('#save');
  buttonGetData.mousePressed(saveDataset);
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
      select('#result').html(result.label);
      select('#confidence').html(`${confideces[result.label] * 100} %`);
    }

    select('#confidenceSmile').html(`${confideces['Smile'] ? confideces['Smile'] * 100 : 0} %`);
    select('#confidenceSunglasses').html(`${confideces['Sunglasses'] ? confideces['Sunglasses'] * 100 : 0} %`);
    select('#confidenceThinking').html(`${confideces['Thinking'] ? confideces['Thinking'] * 100 : 0} %`);
    select('#confidenceTongue').html(`${confideces['Tongue'] ? confideces['Tongue'] * 100 : 0} %`);

  }

  classify();
}

// Update the example count for each class
function updateExampleCounts() {
  const counts = knnClassifier.getCountByLabel();

  select('#exampleSmile').html(counts['Smile'] || 0);
  select('#exampleSunglasses').html(counts['Sunglasses'] || 0);
  select('#exampleThinking').html(counts['Thinking'] || 0);
  select('#exampleTongue').html(counts['Tongue'] || 0);

}

// Clear the examples in one class
function clearClass(classLabel) {
  knnClassifier.clearClass(classLabel);
  updateExampleCounts();
}

// Clear all the examples in all classes
function clearAllClasses() {
  knnClassifier.clearAllClasses();
  updateExampleCounts();
}

// Save dataset as myKNNDataset.json
function saveDataset() {
  knnClassifier.save('myKNNDataset');
}

// Load dataset to the classifier
function loadDataset() {
  knnClassifier.load('./myKNNDataset.json', updateExampleCounts);
}
