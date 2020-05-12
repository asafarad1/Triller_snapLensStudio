// -----JS CODE-----
// GameManagerRAW.js
// Version: 0.0.1
// Event: Initialized
// Description: Contains Game Logic

//@input Component.Image image
//@input Component.Text textCounter
//@input Component.Text textRoundLost

/* Constants */
const RESTART_STATE = 0;
const SOUND_TEXT = "sound ";
const INTRO_TEXT = "intro ";
const START_TEXT = "start ";
const FAILURE_TEXT = "FAILURE";
const SUCCESS_SOUND = "SUCCESS";
const START_GAME = 1;
const INTRO_DELAY = 2;
const ROUND_DELAY = 4;
const TITLE_DISPLAY_TIME = 2;

/* Time Variables */
var time = 0;
var deltaTime = 0;
var timeSpeed = 0.8;

/* Countdown Variables */
var delay = 4;
var countdownTime = -1;
var countTracker = null;

var countDown = false;
var intro = false;

/* Text Variables */
script.textCounter.enabled = false;
script.textRoundLost.enabled = false;

/* Play Variables */
// TODO change to obj
var gameWon = false;
var curState = 0;
var state = [
    {name: "WAITING_SCREEN", expectedPose: 'FIRST_POSE', playing: false},
    {name: "LEVEL1", expectedPose: 'SECOND_POSE', playing: true},
    {name: "LEVEL2", expectedPose: 'THIRD_POSE', playing: true},
    {name: "WINING_SCREEN", expectedPose: 'FIRST_POSE', playing: false}
];


/* Time Management */
function onUpdate() {
    // Update time variables
    deltaTime = global.getDeltaTime() * timeSpeed;
    time += deltaTime;
}

script.createEvent("UpdateEvent").bind(onUpdate);

function restart() {
    curState = RESTART_STATE;
}

function countDownUpdate() {
    var timeLeft = Math.floor(countdownTime - getTime());
    if (timeLeft > 0) {
        script.textCounter.text = timeLeft.toString();
        return;
    }
    closeCountdown();
    if (intro) {
        levelStart();
    } else if (state[curState].playing) {
        roundLost();
    }
}

function closeCountdown() {
    script.textCounter.enabled = false;
    countDown = false;
    script.removeEvent(countTracker);
    countTracker = null;
}

/* State Management */
function levelIntro() {
    intro = true;
    VisualsDisplay();
    playPoseSound();
    // Start countdown (do not displaying countdown)
    delay = INTRO_DELAY;
    countTracker = script.createEvent("UpdateEvent");
    countTracker.bind(countDownUpdate);
    countdownTime = getTime() + delay;
    countDown = true;
}

function levelStart() {
    intro = false;
    VisualsDisplay();
    global.scBehaviorSystem.sendCustomTrigger(SUCCESS_SOUND);
    // Start countdown (displaying countdown)
    delay = ROUND_DELAY;
    countTracker = script.createEvent("UpdateEvent");
    countTracker.bind(countDownUpdate);
    countdownTime = getTime() + delay;
    countDown = true;
    script.textCounter.enabled = true; // displaying
}

function roundLost() {
    restart();
    script.textRoundLost.enabled = true;
    // Play Sound
    global.scBehaviorSystem.sendCustomTrigger(FAILURE_TEXT);
    var delayedEvent = script.createEvent("DelayedCallbackEvent");
    delayedEvent.bind(function (eventData) {
        script.textRoundLost.enabled = false;
        VisualsDisplay();
    });
    delayedEvent.reset(TITLE_DISPLAY_TIME);
}

/* Visuals and Sound Management */
function playPoseSound() {
    // Play Sound
    global.scBehaviorSystem.sendCustomTrigger(SOUND_TEXT + state[curState].name);
}

function VisualsDisplay() {
    // Display GIF
    var prefix = (intro) ? INTRO_TEXT : START_TEXT;
    global.scBehaviorSystem.sendCustomTrigger(prefix + state[curState].name);
}

/* Public API */
global.gameController = {};

/* Game Speed API */
global.gameController.getGameTime = function () {
    return time;
};

global.gameController.getDeltaGameTime = function () {
    return deltaTime;
};

/* Game API */
global.gameController.PoseDetected = function (poseName) {
    // Pose reaction
    if (poseName === state[curState].expectedPose && !intro) {
        (curState < state.length - 1) ? curState++ : curState = 0;
        gameWon = curState === state.length - 1;
        if (gameWon) {
            closeCountdown();
            VisualsDisplay();
            playPoseSound();
            print("WIN"); // todo delete
        } else if (countDown) {
            closeCountdown();
            levelIntro();
        } else if (curState === START_GAME) {
            levelIntro();
        }
        print("LEVEL UP : " + curState); // todo delete
    }
};




