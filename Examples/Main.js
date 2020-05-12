// CountdownPrintData.js
// Version: 1.0.0
// Event: Lens Initialized
// Description: Prints a snippet of current pose on the screen after a few seconds delay.


//@input Component.Script poseDetector
//@input Component.Script GameManager
//@input SceneObject bodyLostHint

var bodyIn = false;
var active = false;

var time = global.gameController.getGameTime; // todo delete
var poseDetected = global.gameController.PoseDetected; // todo delete

function init() {
    script.poseDetector.api.addCallback("onBodyFound", onBodyFound);
    script.poseDetector.api.addCallback("onBodyLost", onBodyLost);
    script.poseDetector.api.addCallback("onPoseDetected", onPoseDetected);
    script.poseDetector.api.activate();
    script.bodyLostHint.enabled = true;
    // script.textHint.enabled = false; // TODO change
}

function onBodyFound() {
    script.bodyLostHint.enabled = false;
    // script.textHint.enabled = false; // TODO change
    bodyIn = true;
    if (!active) {
        return;
    }
    restart();
    print("Body found!");
}


function onBodyLost() {
    script.bodyLostHint.enabled = true;
    // script.textHint.enabled = false; // TODO change
    bodyIn = false;
    if (!active) {
        return;
    }
    print("Body lost!");
}

function onPoseDetected(poseName) {
    print("Pose detected: " + poseName);
    poseDetected(poseName);
}


function update() {
    if (!bodyIn) {
        return;
    }
    // var timeLeft = Math.floor(countdownTime - getTime());
    // if (timeLeft > 0) {
    //     return;
    // }
    active = true;
}

init();