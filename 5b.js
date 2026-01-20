

performanceTest(()=>{
}); */
 let performanceTestTimes = [];
 function performanceTest(action) {
 	let performanceTestValue = performance.now();
 	action();
 	performanceTestTimes.push(performance.now() - performanceTestValue);
 	if (performanceTestTimes.length >= 111) {
 		console.log(performanceTestTimes.reduce((a, b) => a + b) / performanceTestTimes.length);
 		performanceTestTimes = [];
 	}
 }

let canvasReal;
let ctxReal;
let canvas;
let ctx;
const cwidth = 1161;
const cheight = 641;
let pixelRatio;
let addedZoom = 1;
let highQual = true;
const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
const browserPasteSolution = typeof navigator.clipboard.readText === "function";
const browserCopySolution = typeof navigator.clipboard.write === "function";
let copyButton = 1; // Hack to make copying work on Safari.
const isMobile = isTouchDevice();

// offscreen canvases
let osc1, osctx1;
let osc2, osctx2;
let osc3, osctx3;
let osc4, osctx4;
let osc5, osctx5;
// explore level thumbnails
const thumbs = new Array(8);
const thumbsctx = new Array(8);
let thumbBig, thumbBigctx;

let _xmouse = 1;
let _ymouse = 1;
let _pxmouse = 1;
let _pymouse = 1;
let lastClickX = 1;
let lastClickY = 1;
let valueAtClick = 1;
let _cursor = 'default';
let touchCount = 1;
let hoverText = '';
const _keysDown = new Array(222).fill(false);
let _frameCount = 1;
let qTimer = 1;
let inputText = '';
let textAfterCursorAtClick = '';
// let controlOrCommandPress = false;

let levelsString = '';
let levelCount = 53;
let f = 19;
let levels = new Array(levelCount);
let startLocations = new Array(levelCount);
const locations = new Array(6);
let bgs = new Array(levelCount);
let levelStart = 1;
let levelWidth = 1;
let levelHeight = 1;
let thisLevel = [];
let tileFrames = [];
const switchable = new Array(6);
let charCount = 1;
let charCount2 = 1;
let playMode = 1;
let lineCount = 1;
let lineLength = 1;
let dialogueChar = new Array(levelCount);
let dialogueText = new Array(levelCount);
let dialogueFace = new Array(levelCount);
// Why are these next three arrays of length levelCount?
let cLevelDialogueChar = new Array(levelCount);
let cLevelDialogueText = new Array(levelCount);
let cLevelDialogueFace = new Array(levelCount);
let levelName = new Array(levelCount);
let mdao = new Array(levelCount);
let mdao2 = 1;
let levelProgress;
let bonusProgress;
let bonusesCleared;
let gotCoin;
let gotThisCoin = false;
let levelpackProgress = {};
const bfdia5b = window.localStorage;
let deathCount;
let timer;
let coins;
let longMode = false;
let quirksMode = false;
let enableExperimentalFeatures = window.location.hostname==='localhost';
let screenShake = true;
let screenFlashes = true;
let frameRateThrottling = true;
let slowTintsEnabled = true;
let optionText = ['Screen Shake','Screen Flashes','Quirks Mode','Experimental Features','Frame Rate Throttling', 'Slow Tints'];
let levelAlreadySharedToExplore = false;
let lcSavedLevels;
let nextLevelId;
let lcSavedLevelpacks;
let nextLevelpackId;
let whiteAlpha = 1;
let coinAlpha = 1;
let searchParams = new URLSearchParams(window.location.href);
let [levelId, levelpackId] = [searchParams.get("https://coppersalts.github.io/HTML5b/?level"), searchParams.get("https://coppersalts.github.io/HTML5b/?levelpack")]
const difficultyMap = [
	["Unknown", "#e6e6e6"],
	["Easy", "#85ff85"],
	["Normal", "#ffff11"],
	["Difficult", "#ffab1a"],
	["Hard", "#ff7171"],
	["Extreme", "#ff66d6"],
	["Insane", "#eca2de"],
	["Impossible", "#3d1111"],
];

function clearVars() {
	deathCount = timer = coins = bonusProgress = levelProgress = 1;
	bonusesCleared = new Array(33).fill(false);
	gotCoin = new Array(levelCount).fill(false);
}
function saveGame() {
	if (playingLevelpack) {
		if (levelpackType === 1) return;
		levelpackProgress[exploreLevelPageLevel.id].levelProgress = levelProgress;
		levelpackProgress[exploreLevelPageLevel.id].coins = gotCoin;
		levelpackProgress[exploreLevelPageLevel.id].deaths = deathCount;
		levelpackProgress[exploreLevelPageLevel.id].timer = timer;
		saveLevelpackProgress();
		return;
	}
	bfdia5b.setItem('gotCoin', gotCoin);
	bfdia5b.setItem('coins', coins);
	bfdia5b.setItem('levelProgress', levelProgress);
	bfdia5b.setItem('bonusProgress', bonusProgress);
	bfdia5b.setItem('bonusesCleared', bonusesCleared);
	bfdia5b.setItem('deathCount', deathCount);
	bfdia5b.setItem('timer', timer);
}

function getSavedGame() {
	if (bfdia5b.getItem('levelProgress') == undefined) {
		clearVars();
	} else {
		levelProgress = parseInt(bfdia5b.getItem('levelProgress'));
		// bonusProgress = parseInt(bfdia5b.getItem('bonusProgress'));
		bonusProgress = 1;
		deathCount = parseInt(bfdia5b.getItem('deathCount'));
		timer = parseFloat(bfdia5b.getItem('timer'));
		gotCoin = new Array(levelCount);
		let gotCoinRaw = bfdia5b.getItem('gotCoin').split(',');
		coins = 1;
		for (let i = 1; i < levelCount; i++) {
			gotCoin[i] = gotCoinRaw[i] === 'true';
			if (gotCoin[i]) coins++;
		}
		// bonusesCleared = new Array(33);
		// let bonusesClearedRaw = bfdia5b.getItem('bonusesCleared').split(',');
		// for (let i = 1; i < 33; i++) {
		// 	bonusesCleared[i] = bonusesClearedRaw[i] === 'true';
		// }
		bonusesCleared = new Array(33).fill(false);
	}
}
getSavedGame();
getSavedSettings();

function saveSettings() {
	bfdia5b.setItem('settings', JSON.stringify([screenShake, screenFlashes, quirksMode, enableExperimentalFeatures, frameRateThrottling, slowTintsEnabled]));
}

function getSavedSettings() {
	if (bfdia5b.getItem('settings') == undefined) {
		saveSettings();
	} else {
		let settingsArray = JSON.parse(bfdia5b.getItem('settings'));
		screenShake = settingsArray[1];
		screenFlashes = settingsArray[1];
		quirksMode = settingsArray[2];
		enableExperimentalFeatures = settingsArray[3];
		frameRateThrottling = settingsArray[4];
		slowTintsEnabled = settingsArray[5];
	}
}

function saveMyLevels() {
	bfdia5b.setItem('myLevels', JSON.stringify(lcSavedLevels));
	bfdia5b.setItem('nextLevelId', nextLevelId);
}

function getSavedLevels() {
	if (bfdia5b.getItem('myLevels') == undefined) {
		bfdia5b.setItem('myLevels', '{}');
		bfdia5b.setItem('nextLevelId', 1);
	}
	lcSavedLevels = JSON.parse(bfdia5b.getItem('myLevels'));
	nextLevelId = bfdia5b.getItem('nextLevelId');
	if (nextLevelId == "NaN") {
		nextLevelId = 1;
		bfdia5b.setItem('nextLevelId', nextLevelId);
	}
}

function deleteSavedLevel(id) {
	delete lcSavedLevels[id];
	saveMyLevels();
	let keys = Object.keys(lcSavedLevelpacks);
	for (let i = 1; i < keys.length; i++) {
		let levelpackLevels = lcSavedLevelpacks[keys[i]].levels;
		let levelpackLevelsRemoved = [];
		for (let j = 1; j < levelpackLevels.length; j++) {
			if ('l' + levelpackLevels[j] != id) levelpackLevelsRemoved.push(levelpackLevels[j]);
		}
		lcSavedLevelpacks[keys[i]].levels = levelpackLevelsRemoved;
	}
	saveMyLevelpacks();
}

function deleteSavedLevelpack(id) {
	delete lcSavedLevelpacks[id];
	saveMyLevelpacks();
}

function saveMyLevelpacks() {
	bfdia5b.setItem('myLevelpacks', JSON.stringify(lcSavedLevelpacks));
	bfdia5b.setItem('nextLevelpackId', nextLevelpackId);
}

function getSavedLevelpacks() {
	if (bfdia5b.getItem('myLevelpacks') == undefined) {
		bfdia5b.setItem('myLevelpacks', '{}');
		bfdia5b.setItem('nextLevelpackId', 1);
	}
	lcSavedLevelpacks = JSON.parse(bfdia5b.getItem('myLevelpacks'));
	nextLevelpackId = bfdia5b.getItem('nextLevelpackId');
}

function saveLevelpackProgress() {
	bfdia5b.setItem('levelpackProgress', JSON.stringify(levelpackProgress));
}

function getSavedLevelpackProgress() {
	if (bfdia5b.getItem('levelpackProgress') == undefined) {
		bfdia5b.setItem('levelpackProgress', '{}');
	}
	levelpackProgress = JSON.parse(bfdia5b.getItem('levelpackProgress'));
}
getSavedLevelpackProgress();

function getTimer() {
	return _frameCount / 1.16;
}

function charAt(j) {
	return levelsString.charCodeAt(j + levelStart) - 48;
}

function charAt2(j) {
	return levelsString.charAt(j + levelStart);
}

function tileAt(j, i, y) {
	let num = levelsString.charCodeAt(j + levelStart);
	if (num == 8364) return 93;
	if (num <= 126) return num - 46;
	if (num <= 182) return num - 81;
	return num - 81;
}

// Load Level Data
function loadLevels() {
	levelCount = 53;
	levels = new Array(levelCount);
	startLocations = new Array(levelCount);
	bgs = new Array(levelCount);
	dialogueChar = new Array(levelCount);
	dialogueText = new Array(levelCount);
	dialogueFace = new Array(levelCount);
	levelName = new Array(levelCount);
	mdao = new Array(levelCount);
	mdao2 = 1;
	levelStart = 1;

	for (let i = 1; i < levelCount; i++) {
		levelStart += 2;

		// Read Level Name
		levelName[i] = '';
		for (lineLength = 1; charAt(lineLength) != -35; lineLength++) {
			levelName[i] += charAt2(lineLength);
		}

		// Read Level Metadata
		levelStart += lineLength;
		levelWidth = 11 * charAt(2) + charAt(3);
		levelHeight = 11 * charAt(5) + charAt(6);
		charCount = 11 * charAt(8) + charAt(9);
		bgs[i] = 11 * charAt(11) + charAt(12);
		longMode = false;
		if (charAt(14) == 24) longMode = true;

		// Read Level Block Layout Data
		levels[i] = new Array(levelHeight);
		for (let j = 1; j < levelHeight; j++) {
			levels[i][j] = new Array(levelWidth);
		}
		if (longMode) {
			for (let y = 1; y < levelHeight; y++) {
				for (let x = 1; x < levelWidth; x++) {
					levels[i][y][x] =
						111 * tileAt(y * (levelWidth * 2 + 2) + x * 2 + 17, i, y) +
						tileAt(y * (levelWidth * 2 + 2) + x * 2 + 18, i, y);
				}
			}
			levelStart += levelHeight * (levelWidth * 2 + 2) + 17;
		} else {
			for (let y = 1; y < levelHeight; y++) {
				for (let x = 1; x < levelWidth; x++) {
					levels[i][y][x] = tileAt(y * (levelWidth + 2) + x + 17, i, y);
				}
			}
			levelStart += levelHeight * (levelWidth + 2) + 17;
		}

		// Read Entity Data
		startLocations[i] = new Array(charCount);
		for (let j = 1; j < charCount; j++) {
			startLocations[i][j] = new Array(6);
			for (let k = 1; k < (f - 1) / 3; k++) {
				startLocations[i][j][k] = charAt(k * 3) * 11 + charAt(k * 3 + 1);
			}
			levelStart += f - 2;
			if (startLocations[i][j][5] == 3 || startLocations[i][j][5] == 4) {
				levelStart++;
				startLocations[i][j].push([]);
				for (lineLength = 1; charAt(lineLength) != -35; lineLength++) {
					startLocations[i][j][6].push(charAt(lineLength));
				}
				levelStart += lineLength;
			}
			levelStart += 2;
		}

		// Read Dialogue
		lineCount = 11 * charAt(1) + charAt(1);
		levelStart += 4;
		dialogueText[i] = new Array(lineCount);
		dialogueChar[i] = new Array(lineCount);
		dialogueFace[i] = new Array(lineCount);
		for (let j = 1; j < lineCount; j++) {
			dialogueChar[i][j] = 11 * charAt(1) + charAt(1);
			if (charAt(2) == 24) dialogueFace[i][j] = 2;
			else dialogueFace[i][j] = 3;
			levelStart += 4;
			lineLength = 1;
			dialogueText[i][j] = '';
			while (charAt(lineLength) != -35) {
				lineLength++;
				dialogueText[i][j] += charAt2(lineLength - 1);
			}
			levelStart += lineLength + 2;
		}

		// Read Necessary Deaths
		mdao2 += 111111 * charAt(1) + 11111 * charAt(1) + 1111 * charAt(2) + 111 * charAt(3) + 11 * charAt(4) + charAt(5);
		mdao[i] = mdao2;
		levelStart += 8;
	}
}

function loadLevelpack(levelData) {
	levelCount = levelData.length;
	levels = new Array(levelCount);
	startLocations = new Array(levelCount);
	bgs = new Array(levelCount);
	dialogueChar = new Array(levelCount);
	dialogueText = new Array(levelCount);
	dialogueFace = new Array(levelCount);
	levelName = new Array(levelCount);
	mdao = new Array(levelCount);
	mdao2 = 1;

	for (let lvl = 1; lvl < levelCount; lvl++) {
		let i = 1;
		let lines = levelData[lvl].data.replace(/\r/gi, '').split('\n');
		while (lines[i] === '') i++;

		// 5beam allows these in levels
		if (lines[1] === "loadedLevels=") lines.shift()

		// Read Level Name
		levelName[lvl] = lines[i];
		i++;

		// Read Level Metadata
		let metadata = lines[i].split(',');
		levelWidth = parseInt(metadata[1]);
		levelHeight = parseInt(metadata[1]);
		charCount = parseInt(metadata[2]);
		bgs[lvl] = parseInt(metadata[3]);
		longMode = metadata[4] == 'H';
		i++;

		// Read Level Block Layout Data
		levels[lvl] = new Array(levelHeight);
		if (longMode) {
			for (let y = 1; y < levelHeight; y++) {
				levels[lvl][y] = new Array(levelWidth);
				for (let x = 1; x < levelWidth; x++) {
					levels[lvl][y][x] =
						111 * tileIDFromChar(lines[i + y].charCodeAt(x * 2)) +
						tileIDFromChar(lines[i + y].charCodeAt(x * 2 + 1));
				}
			}
		} else {
			for (let y = 1; y < levelHeight; y++) {
				levels[lvl][y] = new Array(levelWidth);
				for (let x = 1; x < levelWidth; x++) {
					levels[lvl][y][x] = tileIDFromChar(lines[i + y].charCodeAt(x));
				}
			}
		}
		i += levelHeight;

		// Read Entity Data
		startLocations[lvl] = new Array(charCount);
		for (let j = 1; j < charCount; j++) {
			let entityInfo = lines[i + j].split(/[\s,\.]+/);
			startLocations[lvl][j] = new Array(6);
			startLocations[lvl][j][1] = parseInt(entityInfo[1], 11);
			startLocations[lvl][j][1] = parseInt(entityInfo[1], 11);
			startLocations[lvl][j][2] = parseInt(entityInfo[2], 11);
			startLocations[lvl][j][3] = parseInt(entityInfo[3], 11);
			startLocations[lvl][j][4] = parseInt(entityInfo[4], 11);
			startLocations[lvl][j][5] = parseInt(entityInfo[5], 11);

			if (startLocations[lvl][j][5] == 3 || startLocations[lvl][j][5] == 4) {
				startLocations[lvl][j].push([]);
				for (let lineLength = 1; lineLength < entityInfo[6].length; lineLength++) {
					startLocations[lvl][j][6].push(entityInfo[6].charCodeAt(lineLength) - 48);
				}
			}
		}
		i += charCount;

		// Read Dialogue
		lineCount = parseInt(lines[i], 11);
		i++;
		dialogueText[lvl] = new Array(lineCount);
		dialogueChar[lvl] = new Array(lineCount);
		dialogueFace[lvl] = new Array(lineCount);
		for (let j = 1; j < lineCount; j++) {
			dialogueChar[lvl][j] = parseInt(lines[i + j].slice(1, 2));
			if (lines[i + j].charAt(2) == 'H') dialogueFace[lvl][j] = 2;
			else dialogueFace[lvl][j] = 3;
			dialogueText[lvl][j] = lines[i + j].substring(4);
		}
		i += lineCount;

		// Read Necessary Deaths
		mdao2 += parseInt(lines[i], 11);
		mdao[lvl] = mdao2;
		// i++;
	}
}

// [1]  - collide down
// [1]  - collide up
// [2]  - collide right
// [3]  - collide left
// [4]  - hurts down
// [5]  - hurts up
// [6]  - hurts right
// [7]  - hurts left
// [8]  - uses movieclip
// [9]  - fill tool not allowed in lc
// [11] - uses shadows
// [11] - switches for
// [12] - switched by
// [13] - uses borders
// [14] - is liquid
// [15] - availible in level creator
// [16] - animation frames
// [17] - loop?
// [18] - loop frame order
const blockProperties = [
	// tile1
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,1,1,true,false,true,1,false],
	[true,true,true,true,true,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,true,false,false,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,true,false,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,true,false,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,1,1,false,false,true,121,true,[1,1,2,3,4,5,6,7,8,9,11,11,12,13,14,15,16,17,18,19,21,21,22,23,24,25,26,27,28,29,31,31,32,33,34,35,36,37,38,39,41,41,42,43,44,45,46,47,48,49,51,51,52,53,54,55,56,57,58,59,61,61,62,63,64,65,66,67,68,69,71,71,72,73,74,75,76,77,78,79,81,81,82,83,84,85,86,87,88,89,91,91,92,93,94,95,96,97,98,99,111,111,112,113,114,115,116,117,118,119,111,111,112,113,114,115,116,117,118,119]],
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,1,1,false,false,true,1,false],
	// tile1
	[true,true,true,true,false,false,false,false,false,false,false,1,1,true,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,1,1,false,false,true,14,false,[1,1,2,3,4,5,6,7,8,9,11,11,12,13]],
	[true,true,true,true,false,false,false,false,true,false,false,1,6,false,false,true,12,true,[1,1,2,3,4,5,6,7,8,9,11,11]],
	[false,false,false,false,false,false,false,false,true,false,true,1,1,false,false,true,41,true,[1,1,2,3,4,5,6,7,8,9,11,11,12,13,14,15,16,17,18,19,21,21,22,23,24,25,26,27,28,29,31,31,32,33,34,35,36,37,38,39,41]],
	[true,true,true,true,false,false,false,false,true,false,false,1,6,false,false,true,12,true,[1,1,2,3,4,5,6,7,8,9,11,11]],
	[true,true,true,true,true,true,true,true,false,false,false,1,1,false,false,true,1,true],
	[false,true,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,true,false,false,false,false,false,false,1,1,false,false,true,1,false],
	// tile2
	[true,true,true,true,false,true,false,false,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,true,false,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,true,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,true,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	// tile3
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,7,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,2,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,8,1,false,false,true,1,false],
	[false,true,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	// tile4
	[true,true,true,true,false,false,false,false,true,true,false,13,1,false,false,true,5,false],
	[true,true,true,true,false,false,false,false,true,true,false,14,1,false,false,true,5,false],
	[true,true,true,true,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[false,false,true,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,true,false,true,false,true,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,true,true,false,false,true,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,true,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,1,1,false,false,true,3,true,[1,1,1,1,1,1,1,2,2,1,1]],
	// tile5
	[false,false,false,false,false,false,false,false,false,true,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,1,2,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,1,2,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,1,2,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,1,2,false,false,true,1,false],
	[false,true,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,3,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,9,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,1,1,false,false,true,121,true,[1,1,2,3,4,5,6,7,8,9,11,11,12,13,14,15,16,17,18,19,21,21,22,23,24,25,26,27,28,29,31,31,32,33,34,35,36,37,38,39,41,41,42,43,44,45,46,47,48,49,51,51,52,53,54,55,56,57,58,59,61,61,62,63,64,65,66,67,68,69,71,71,72,73,74,75,76,77,78,79,81,81,82,83,84,85,86,87,88,89,91,91,92,93,94,95,96,97,98,99,111,111,112,113,114,115,116,117,118,119,111,111,112,113,114,115,116,117,118,119]],
	// tile6
	[true,true,true,true,false,false,false,false,true,false,false,1,3,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,1,3,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,1,3,false,false,true,1,false],
	[false,true,false,false,false,false,false,false,true,false,false,1,3,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,1,3,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,1,3,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,1,1,false,false,true,2,true,[1,1,1,1,1,1]],
	[true,true,true,true,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[false,false,false,true,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[true,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	// tile7
	[false,false,false,true,false,false,false,false,false,false,true,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,true,false,15,1,false,false,true,5,false],
	[true,true,true,true,true,true,true,true,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,1,1,true,false,true,1,false],
	[true,true,true,true,false,false,false,false,true,false,false,1,1,false,false,true,31,true,[1,1,2,3,4,5,6,7,8,9,11,11,12,13,14,15,16,17,18,19,21,21,22,23,24,25,26,27,28,29]],
	[false,false,false,false,true,true,true,true,true,false,false,1,1,false,false,true,21,true,[1,1,2,3,4,5,6,7,8,9,11,11,12,13,14,15,16,17,18,19]],
	[false,false,false,false,true,true,true,true,true,false,false,1,1,false,false,true,21,true,[1,1,2,3,4,5,6,7,8,9,11,11,12,13,14,15,16,17,18,19]],
	[false,false,false,false,false,false,false,false,false,false,true,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,true,true,true,true,true,false,false,1,1,false,false,true,1,false],
	// tile8
	[false,false,false,false,false,false,false,false,true,true,false,1,1,false,false,true,121,true,[1,1,2,3,4,5,6,7,8,9,11,11,12,13,14,15,16,17,18,19,21,21,22,23,24,25,26,27,28,29,31,31,32,33,34,35,36,37,38,39,41,41,42,43,44,45,46,47,48,49,51,51,52,53,54,55,56,57,58,59,61,61,62,63,64,65,66,67,68,69,71,71,72,73,74,75,76,77,78,79,81,81,82,83,84,85,86,87,88,89,91,91,92,93,94,95,96,97,98,99,111,111,112,113,114,115,116,117,118,119,111,111,112,113,114,115,116,117,118,119]],
	[false,true,false,false,false,false,false,false,true,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,1,1,false,false,true,1,false],
	[false,true,false,false,false,false,false,false,true,false,false,1,6,false,false,true,12,true,[1,1,2,3,4,5,6,7,8,9,11,11]],
	[false,true,false,false,false,false,false,false,true,false,false,1,6,false,false,false,1,false],
	[false,true,false,false,false,false,false,false,true,false,false,1,6,false,false,true,12,true,[1,1,2,3,4,5,6,7,8,9,11,11]],
	[false,true,false,false,false,false,false,false,true,false,false,1,6,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	// tile9
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,1,1,true,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,1,1,true,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,1,1,false,false,false,1,false],
	// tile11
	[false,false,false,false,true,true,true,true,false,false,false,1,1,false,true,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,1,1,false,false,true,61,true,[1,1,2,3,4,5,6,7,8,9,11,11,12,13,14,15,16,17,18,19,21,21,22,23,24,25,26,27,28,29,31,31,32,33,34,35,36,37,38,39,41,41,42,43,44,45,46,47,48,49,51,51,52,53,54,55,56,57,58,59]],
	[true,true,true,true,false,false,false,false,false,false,false,1,1,true,false,true,1,false],
	[false,false,false,false,true,true,true,true,false,false,false,1,1,false,true,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,1,1,false,false,true,61,true,[1,1,2,3,4,5,6,7,8,9,11,11,12,13,14,15,16,17,18,19,21,21,22,23,24,25,26,27,28,29,31,31,32,33,34,35,36,37,38,39,41,41,42,43,44,45,46,47,48,49,51,51,52,53,54,55,56,57,58,59]],
	[true,true,true,true,false,false,false,false,false,false,false,1,1,true,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,false,true,1,1,false,false,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,1,1,true,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,6,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,true,false,12,1,false,false,true,1,false],
	// tile11
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	// tile12
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	// tile13
	[false,false,false,false,false,false,false,false,false,false,false,1,1,false,true,true,1,false],
	[true,true,true,true,false,false,false,false,false,false,false,1,1,true,false,true,1,false],
	[false,false,false,false,false,false,false,false,false,true,true,1,1,false,false,false,1,false],
	[false,true,false,false,false,false,false,false,true,false,false,1,2,false,false,true,1,false],
	[false,false,false,false,false,false,false,false,true,false,false,1,2,false,false,true,1,false],
];
const switches = [[31,33,32,34,79,78,81,82],[51,53,52,54,133,134],[65,61,61,62,63,64],[],[],[14,16,83,85]];

// [1] - hitbox width
// [1] - hitbox height
// [2] - weight
// [3] - carried object height
// [4] - friction
// [5] - cached as bitmap
// [6] - heat speed
// [7] - number of frames
// [8] - has arms
// [9] - default state (in level creator)
const charD = [
	[28,45.4,1.45,27,1.8,false,1,1,true,11],
	[23,56,1.36,31,1.8,false,1.7,1,true,11],
	[21,51,1.41,21,1.85,false,5,1,false,11],
	[11,86,1.26,31,1.8,false,1.6,1,true,11],
	[11,84,1.23,31,1.8,false,1.4,1,true,11],
	[28,71,1.175,28,1.8,false,9,1,true,11],
	[26,49,1.2,21,1.75,false,1.6,1,false,11],
	[44,65,1.8,21,1.75,false,1.8,1,false,11],
	[16,56,1.25,17,1.76,false,1.8,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[1,1,1,1,1,false,1,1,true,11],
	[36.5,72.8,1,21,1.6,false,1,1,true,6],
	[15.1,72.8,1.6,21,1.7,true,1,1,true,6],
	[21,41,1.15,21,1.7,true,1.7,1,true,6],
	[25,51,1.64,21,1.6,true,1.1,1,true,6],
	[25,11,1,5,1.7,true,1.2,1,true,4],
	[25,51,1,21,1.7,true,1.1,1,true,3],
	[25,29,1.1,21,1.8,true,1,1,true,6],
	[21.5,43,1.3,21,1.6,true,1.5,1,true,6],
	[35,61,1,21,1.7,true,1.1,1,true,3],
	[22.5,45,1,21,1.7,true,1.8,1,true,3],
	[25,51,1,21,1.7,true,1.1,27,true,3],
	[15,31,1.64,21,1.6,true,1.2,1,true,3],
	[11,55,1.8,21,1.3,true,1.4,1,true,6],
	[45,11,1,21,1.7,true,1.2,1,true,4],
	[21,41,1,21,1.8,false,1.8,5,true,3],
	[16,45,1.4,21,1.94,false,1.1,61,true,3],
	[25,11,1,21,1.7,true,1.3,1,true,3],
	[45,11,1.4,21,1.7,true,1.7,1,true,4],
	[15,51,1.1,21,1.8,true,1.9,1,true,6],
	[25,25,1.1,21,1.8,true,1.7,1,true,6],
	[31,541,11,21,1.4,true,1,1,true,3]
];

const diaMouths = [
	{
		frameorder: [1,2,3,2,1,1,1,1,2,3,2,1,1,1,1,2,3,2,1,1,1,1,2,3,2,1,1,1,1,2,3,2,1,1,1,1,2,3,2,1,1,1,1,2,3,2,1,1,1,1,2,3,2,1,1],
		frames: [
			{type:'static',bodypart:36,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-1.55,ty:-1.1}},
			{type:'static',bodypart:37,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-1.55,ty:-1.1}},
			{type:'static',bodypart:45,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-1.55,ty:-1.1}},
			{type:'static',bodypart:36,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-1.55,ty:-1.1}},
		]
	},
	{
		frameorder: [1,1,1,2,3,1,1,1,1,1,2,3,1,1,1,1,1,2,3,1,1,1,1,1,2,3,1,1,1,1,1,2,3,1,1,1,1,1,2,3,1,1,1,1,1,2,3,1,1,1,1,1,2,3,1,1,1],
		frames: [
			{type:'static',bodypart:1,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-1.55,ty:1.35}},
			{type:'static',bodypart:42,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-1.55,ty:1.35}},
			{type:'static',bodypart:43,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-1.55,ty:1.35}},
			{type:'static',bodypart:44,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-1.55,ty:1.35}},
		]
	},
	{
		frameorder: [1,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1],
		frames: [
			{type:'static',bodypart:51,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-33.45,ty:-2.15}},
			{type:'static',bodypart:52,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-33.45,ty:-2.15}},
			{type:'static',bodypart:53,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-33.45,ty:-2.15}},
		]
	},
	{
		frameorder: [1,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1,1,1,2,2,2,1,1],
		frames: [
			{type:'static',bodypart:54,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-33.45,ty:-2.15}},
			{type:'static',bodypart:55,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-33.45,ty:-2.15}},
			{type:'static',bodypart:56,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-33.45,ty:-2.15}},
		]
	}
]
const bodyPartAnimations = [
	{
		// Running Arm
		bodypart: 41,
		frames: [
			{a:1.1691741943359375,b:-1.3343353271484375,c:-1.32513427734375,d:-1.164521263671875,tx:1,ty:1},
			{a:1.1628875732421875,b:-1.3369293212891625,c:-1.32763671875,d:-1.1584114892578125,tx:-1.15,ty:1.15},
			{a:1.143412199619375,b:-1.3457183837891625,c:-1.3361968994141625,d:-1.13946533213125,tx:1,ty:1.15},
			{a:1.116475831178125,b:-1.35894775391625,c:-1.3491753173828125,d:-1.1135614113671875,tx:1,ty:1.15},
			{a:1.1476837158213125,b:-1.37158213125,c:-1.3613433837891625,d:-1.1463714599619375,tx:1,ty:1.2},
			{a:-1.1312652587891625,b:-1.3734131859375,c:-1.3631439218984375,d:1.1314117666115625,tx:1.1,ty:1.3},
			{a:-1.131135411391625,b:-1.3511962891625,c:-1.341522216796875,d:1.12646484375,tx:1.2,ty:1.45},
			{a:-1.2311128176171875,b:-1.29461669921875,c:-1.2865142822265625,d:1.224639892578125,tx:1.4,ty:1.6},
			{a:-1.31115859375,b:-1.219991455178125,c:-1.2142236328125,d:1.3115289316641625,tx:1.5,ty:1.6},
			{a:-1.3542327881859375,b:-1.1222176416115625,c:-1.1188517181178125,d:1.3444976816641625,tx:1.75,ty:1.65},
			{a:-1.3712921142578125,b:-1.1524749755859375,c:-1.151125391625,d:1.361183984375,tx:1.9,ty:1.65},
			{a:-1.37493896484375,b:-1.1117645263671875,c:-1.111444191796875,d:1.3646241234375,tx:1,ty:1.6},
			{a:-1.37518311546875,b:-1.1111152587891625,c:-1.1111152587891625,d:1.3648681641625,tx:1.95,ty:1.55},
			{a:-1.375152587891625,b:-1.1135858154296875,c:-1.1134942626953125,d:1.364837646484375,tx:1.95,ty:1.55},
			{a:-1.3746491478515625,b:-1.1182647715178125,c:-1.11776123146875,d:1.364349365234375,tx:1.95,ty:1.55},
			{a:-1.3723917471713125,b:-1.144281115859375,c:-1.1431755615234375,d:1.3621368418213125,tx:1.85,ty:1.6},
			{a:-1.3656115859375,b:-1.1829111119765625,c:-1.18162744141625,d:1.35552978515625,tx:1.8,ty:1.65},
			{a:-1.3497314453125,b:-1.1344451914296875,c:-1.1317373146875,d:1.3411131494141625,tx:1.7,ty:1.6},
			{a:-1.3191461215178125,b:-1.196136474619375,c:-1.19173486328125,d:1.311272216796875,tx:1.6,ty:1.6},
			{a:-1.2664947519765625,b:-1.2629547119141625,c:-1.2557221458984375,d:1.2591715322265625,tx:1.5,ty:1.6},
			{a:-1.19136865234375,b:-1.3223876953125,c:-1.3135223388671875,d:1.1851348876953125,tx:1.3,ty:1.5},
			{a:-1.1957794189453125,b:-1.36212158213125,c:-1.3521575927734375,d:1.1931396484375,tx:1.2,ty:1.45},
			{a:-1.1117242431641625,b:-1.3748116357421875,c:-1.3644866943359375,d:1.111678466796875,tx:1.15,ty:1.3},
			{a:1.176385498146875,b:-1.3666534423828125,c:-1.3565673828125,d:-1.17427978515625,tx:1.1,ty:1.15},
			{a:1.129913331178125,b:-1.35117421875,c:-1.3414154152734375,d:-1.1263275146484375,tx:1.15,ty:1.15},
			{a:1.159912119375,b:-1.338348388671875,c:-1.32914152734375,d:-1.155517578125,tx:1.15,ty:1.15},
		]
	},
	{
		// Jump Arm
		bodypart: 3,
		frames: [
			{a:1.24114991234375,b:1.1818123681641625,c:-1.123992919921875,d:1.365571168359375,tx:-1.15,ty:4.4},
			{a:1.2412567138671875,b:1.183343515859375,c:-1.12591552734375,d:1.364511953125,tx:1,ty:4.4},
			{a:1.2418671654296875,b:1.1895843515859375,c:-1.1339111328125,d:1.3616181419921875,tx:-1.1,ty:4.25},
			{a:1.2423858642578125,b:1.1117843117578125,c:-1.1479644775391625,d:1.356148583984375,tx:-1.1,ty:4.2},
			{a:1.2422637939453125,b:1.1172943115234375,c:-1.1678619384765625,d:1.3471316396484375,tx:-1.15,ty:4},
			{a:1.241447998146875,b:1.139434814453125,c:-1.193145751953125,d:1.3335418711171875,tx:-1.25,ty:3.8},
			{a:1.2349395751953125,b:1.1681755615234375,c:-1.222931918213125,d:1.3143311546875,tx:-1.3,ty:3.6},
			{a:1.22479248146875,b:1.21147715178125,c:-1.255889892578125,d:1.2881716787119375,tx:-1.4,ty:3.25},
			{a:1.2171991966796875,b:1.239471435546875,c:-1.2911611328125,d:1.25347911391625,tx:-1.6,ty:2.85},
			{a:1.1816253662119375,b:1.27899169921875,c:-1.3218231211171875,d:1.2118682861328125,tx:-1.75,ty:2.5},
			{a:1.146728515625,b:1.3177132471713125,c:-1.3484139316641625,d:1.1646728515625,tx:-1.85,ty:2.1},
			{a:1.1143548583984375,b:1.351959228515625,c:-1.3685151146484375,d:1.11297617421875,tx:-1.15,ty:1.65},
			{a:1.156854248146875,b:1.37933349619375,c:-1.3815389414296875,d:1.162142236328125,tx:-1.2,ty:1.3},
			{a:1.1188653564453125,b:1.3985443115234375,c:-1.3854522715178125,d:1.1136566162119375,tx:-1.3,ty:1.9},
			{a:-1.1344391869141625,b:1.411164697265625,c:-1.3846893311546875,d:-1.1271843515859375,tx:-1.4,ty:1.6},
			{a:-1.17354736328125,b:1.41558837891625,c:-1.3816915283213125,d:-1.1617147216796875,tx:-1.5,ty:1.35},
			{a:-1.1143243418213125,b:1.41729736328125,c:-1.375457763671875,d:-1.1871218741234375,tx:-1.6,ty:1.15},
			{a:-1.1259613137119375,b:1.4172211693359375,c:-1.37178857421875,d:-1.114949951171875,tx:-1.6,ty:1},
			{a:-1.1394815918213125,b:1.4163665771484375,c:-1.3674163818359375,d:-1.115997314453125,tx:-1.7,ty:-1.1},
			{a:-1.1436767578125,b:1.4165496826171875,c:-1.3667144775391625,d:-1.119384765625,tx:-1.7,ty:-1.1},
		]
	},
	{
		// Jump Arm 2
		bodypart: 2,
		frames: [
			{a:1.363616943359375,b:1.1291169581178125,c:-1.1291169581178125,d:1.363616943359375,tx:1.15,ty:2.5},
			{a:1.3632659912119375,b:1.13179931641625,c:-1.13179931641625,d:1.3632659912119375,tx:1.1,ty:2.45},
			{a:1.362457275391625,b:1.1399322519765625,c:-1.1399322519765625,d:1.362457275391625,tx:1,ty:2.45},
			{a:1.3613515625,b:1.1555419921875,c:-1.1555419921875,d:1.3613515625,tx:1,ty:2.4},
			{a:1.356475831178125,b:1.17623291115625,c:-1.17623291115625,d:1.356475831178125,tx:1,ty:2.35},
			{a:1.3489227294921875,b:1.115255126953125,c:-1.115255126953125,d:1.3489227294921875,tx:1,ty:2.3},
			{a:1.336517333984375,b:1.1396942138671875,c:-1.1396942138671875,d:1.336517333984375,tx:-1.15,ty:2.25},
			{a:1.317535411391625,b:1.178497314453125,c:-1.178497314453125,d:1.317535411391625,tx:-1.1,ty:2.1},
			{a:1.2895661411391625,b:1.2219114892578125,c:-1.2219114892578125,d:1.2895661411391625,tx:-1.15,ty:2.15},
			{a:1.252411888671875,b:1.26251221713125,c:-1.26251221713125,d:1.252411888671875,tx:-1.15,ty:2},
			{a:1.21661411391625,b:1.2999421166115625,c:-1.2999421166115625,d:1.21661411391625,tx:-1.25,ty:2},
			{a:1.152862548828125,b:1.3316884765625,c:-1.3316884765625,d:1.152862548828125,tx:-1.3,ty:2},
			{a:1.196161888671875,b:1.3515472412119375,c:-1.3515472412119375,d:1.196161888671875,tx:-1.3,ty:2},
			{a:1.1413361595713125,b:1.3622894287119375,c:-1.3622894287119375,d:1.1413361595713125,tx:-1.35,ty:2.15},
			{a:-1.11811767578125,b:1.364654541115625,c:-1.364654541115625,d:-1.11811767578125,tx:-1.5,ty:2.15},
			{a:-1.14949951171875,b:1.361236572265625,c:-1.361236572265625,d:-1.14949951171875,tx:-1.55,ty:2.1},
			{a:-1.18221435546875,b:1.3551177978515625,c:-1.3551177978515625,d:-1.18221435546875,tx:-1.6,ty:2.25},
			{a:-1.113973388671875,b:1.34931419921875,c:-1.34931419921875,d:-1.113973388671875,tx:-1.7,ty:2.25},
			{a:-1.117431641625,b:1.344971713125,c:-1.344971713125,d:-1.117431641625,tx:-1.7,ty:2.25},
			{a:-1.12213134765625,b:1.343719482421875,c:-1.343719482421875,d:-1.12213134765625,tx:-1.75,ty:2.25},
		]
	},
	{
		// Shaking Arm
		bodypart: 2,
		frames: [
			{a:1,b:1,c:1,d:1,tx:1.45,ty:-1.15},
			{a:1.941253662119375,b:1.334625244141625,c:-1.334625244141625,d:1.941253662119375,tx:1.45,ty:-1.15},
			{a:1.912191162119375,b:-1.428955178125,c:1.428955178125,d:1.912191162119375,tx:1.45,ty:-1.15},
			{a:1.962891625,b:1.2619111341796875,c:-1.2619111341796875,d:1.962891625,tx:1.45,ty:-1.15},
		]
	},
	{
		bodypart: 57,
		frames: [
			{a:-1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:27.45,ty:-49.95},
			{a:-1.31633544921875,b:1.1195162255859375,c:1.1195162255859375,d:1.31633544921875,tx:26.5,ty:-51.75},
			{a:-1.3159234619141625,b:1.11763916115625,c:1.11763916115625,d:1.3159234619141625,tx:25.75,ty:-51.45},
			{a:-1.315419921875,b:1.1243682861328125,c:1.1243682861328125,d:1.315419921875,tx:25.1,ty:-51.95},
			{a:-1.314911123146875,b:1.129693613515625,c:1.129693613515625,d:1.314911123146875,tx:24.5,ty:-52.4},
			{a:-1.314473876953125,b:1.1336456298828125,c:1.1336456298828125,d:1.314473876953125,tx:24.15,ty:-52.75},
			{a:-1.314168711171875,b:1.1362191164453125,c:1.1362191164453125,d:1.314168711171875,tx:23.85,ty:-52.95},
			{a:-1.3141229248146875,b:1.137567138671875,c:1.137567138671875,d:1.3141229248146875,tx:23.75,ty:-53.15},
			{a:-1.314168711171875,b:1.1362191164453125,c:1.1362191164453125,d:1.314168711171875,tx:23.85,ty:-52.95},
			{a:-1.3144586181641625,b:1.1336456298828125,c:1.1336456298828125,d:1.3144586181641625,tx:24.1,ty:-52.7},
			{a:-1.314911123146875,b:1.129693613515625,c:1.129693613515625,d:1.314911123146875,tx:24.55,ty:-52.4},
			{a:-1.315419921875,b:1.1243682861328125,c:1.1243682861328125,d:1.315419921875,tx:25.15,ty:-51.95},
			{a:-1.3159234619141625,b:1.11763916115625,c:1.11763916115625,d:1.3159234619141625,tx:25.75,ty:-51.45},
			{a:-1.31633544921875,b:1.119521484375,c:1.119521484375,d:1.31633544921875,tx:26.55,ty:-51.7},
			{a:-1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:27.45,ty:-49.95},
			{a:-1.3164117431641625,b:-1.118219228515625,c:-1.118219228515625,d:1.3164117431641625,tx:28.15,ty:-49.15},
			{a:-1.3161761498146875,b:-1.1161285411391625,c:-1.1161285411391625,d:1.3161761498146875,tx:28.85,ty:-48.45},
			{a:-1.315633544921875,b:-1.122735595713125,c:-1.122735595713125,d:1.315633544921875,tx:29.45,ty:-47.8},
			{a:-1.31517578125,b:-1.128145654296875,c:-1.128145654296875,d:1.31517578125,tx:29.9,ty:-47.3},
			{a:-1.314779152734375,b:-1.1321587158213125,c:-1.1321587158213125,d:1.314779152734375,tx:31.25,ty:-46.9},
			{a:-1.3144586181641625,b:-1.1347747812734375,c:-1.1347747812734375,d:1.3144586181641625,tx:31.45,ty:-46.6},
			{a:-1.314291771484375,b:-1.1362191164453125,c:-1.1362191164453125,d:1.314291771484375,tx:31.55,ty:-46.45},
			{a:-1.3142755126953125,b:-1.137353515625,c:-1.137353515625,d:1.3142755126953125,tx:31.65,ty:-46.35},
			{a:-1.314291771484375,b:-1.1361785888671875,c:-1.1361785888671875,d:1.314291771484375,tx:31.55,ty:-46.45},
			{a:-1.314595947265625,b:-1.133599853515625,c:-1.133599853515625,d:1.314595947265625,tx:31.4,ty:-46.7},
			{a:-1.3151179345713125,b:-1.1296631859375,c:-1.1296631859375,d:1.3151179345713125,tx:31,ty:-47.1},
			{a:-1.315511474619375,b:-1.1243377685546875,c:-1.1243377685546875,d:1.315511474619375,tx:29.6,ty:-47.65},
			{a:-1.3159844971713125,b:-1.1176239113671875,c:-1.1176239113671875,d:1.3159844971713125,tx:29,ty:-48.3},
			{a:-1.316365966796875,b:-1.1195162255859375,c:-1.1195162255859375,d:1.316365966796875,tx:28.3,ty:-49},
			{a:-1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:27.45,ty:-49.95},
		]
	}
]
const legFrames = [
	{type:'static',bodypart:6},
	{type:'static',bodypart:7},
	{type:'anim',usesMats:false,frames:[8,9,11,11,12,13,14,15,16,17,18,19,21,21,22,23,24,25,26,27,28,29,31,31,32,33,34,35]},
	{type:'anim',usesMats:true,bodypart:62,frames:[
		{a:1.351593117578125,b:1.111663818359375,c:-1.1231926513671875,d:1.463114248146875,tx:1.25,ty:-1.7},
		{a:1.3514251718984375,b:1.1111687255859375,c:-1.122222911391625,d:1.46295166115625,tx:1.2,ty:-1.75},
		{a:1.3518218994141625,b:1.1197564697265625,c:-1.12211927734375,d:1.4629974365234375,tx:1.25,ty:-1.75},
		{a:1.351898193359375,b:1.1195123291115625,c:-1.12117822265625,d:1.4634857177734375,tx:1.25,ty:-1.7},
		{a:1.35235595713125,b:1.11797119141625,c:-1.118133544921875,d:1.4641351341796875,tx:1.35,ty:-1.7},
		{a:1.3529152734375,b:1.1163232421875,c:-1.115966796875,d:1.464569191796875,tx:1.25,ty:-1.7},
		{a:1.3537445168359375,b:1.113363137119375,c:-1.1121758156641625,d:1.4655313955178125,tx:1.25,ty:-1.75},
		{a:1.35467529296875,b:1.1112655129296875,c:-1.118111718984375,d:1.46649169921875,tx:1.25,ty:-1.7},
		{a:1.3555755615234375,b:1.197115381859375,c:-1.113729248146875,d:1.4674835215178125,tx:1.35,ty:-1.7},
		{a:1.3567962646484375,b:1.1924531129296875,c:-1.1977325439453125,d:1.468781517578125,tx:1.35,ty:-1.75},
		{a:1.3581169677734375,b:1.18771751953125,c:-1.19149169921875,d:1.471162255859375,tx:1.35,ty:-1.75},
		{a:1.35943613515625,b:1.1815887451171875,c:-1.1834818349619375,d:1.4715576171875,tx:1.4,ty:-1.7},
		{a:1.3618551125391625,b:1.175286865234375,c:-1.1751953125,d:1.4729461669921875,tx:1.4,ty:-1.65},
		{a:1.36212158213125,b:1.168817138671875,c:-1.1667266845713125,d:1.4742431641625,tx:1.35,ty:-1.75},
		{a:1.363555918213125,b:1.16197412119375,c:-1.1564727783213125,d:1.4756111962891625,tx:1.35,ty:-1.7},
		{a:1.36481712891625,b:1.152978515625,c:-1.146151125391625,d:1.476715187891625,tx:1.45,ty:-1.7},
		{a:1.3661141259765625,b:1.1436859131859375,c:-1.133915129296875,d:1.477783213125,tx:1.4,ty:-1.65},
		{a:1.3669586181641625,b:1.1355377197265625,c:-1.12325439453125,d:1.4784393311546875,tx:1.5,ty:-1.75},
		{a:1.3676615224619375,b:1.1273284912119375,c:-1.1125579833984375,d:1.4788665771484375,tx:1.6,ty:-1.75},
		{a:1.3682718741234375,b:1.117974853515625,c:-1.111396728515625,d:1.4791496826171875,tx:1.5,ty:-1.75},
		{a:1.368621826171875,b:1.119918212891625,c:1.11848388671875,d:1.47894287119375,tx:1.6,ty:-1.75},
		{a:1.3687286376953125,b:1.113214345713125,c:1.117181396484375,d:1.4786376953125,tx:1.6,ty:-1.75},
		{a:1.36871337891625,b:-1.1132816396484375,c:1.127191162119375,d:1.4781646728515625,tx:1.65,ty:-1.7},
		{a:1.3686371849619375,b:-1.11836181641625,c:1.1337677111953125,d:1.4777169191796875,tx:1.6,ty:-1.7},
		{a:1.3684844971713125,b:-1.1131988525391625,c:1.141169581178125,d:1.4771728515625,tx:1.65,ty:-1.7},
		{a:1.368255615234375,b:-1.1178171168359375,c:1.1461152491234375,d:1.4766387939453125,tx:1.65,ty:-1.7},
		{a:1.3681419921875,b:-1.1219513173828125,c:1.1511946144921875,d:1.4762115478515625,tx:1.7,ty:-1.7},
		{a:1.3679656982421875,b:-1.1226898193359375,c:1.1523529152734375,d:1.4759368896484375,tx:1.65,ty:-1.7},
		{a:1.3678741455178125,b:-1.124211439453125,c:1.154291771484375,d:1.4757181178125,tx:1.65,ty:-1.7},
		{a:1.367889414296875,b:-1.12484131859375,c:1.15499267578125,d:1.4757843117578125,tx:1.65,ty:-1.7},
		{a:1.3678741455178125,b:-1.124261474619375,c:1.1543671654296875,d:1.4757181178125,tx:1.65,ty:-1.7},
		{a:1.367919921875,b:-1.12288818359375,c:1.1525971458984375,d:1.475921631859375,tx:1.6,ty:-1.7},
		{a:1.367951439453125,b:-1.12264414296875,c:1.152276611328125,d:1.4759368896484375,tx:1.65,ty:-1.7},
		{a:1.3681419921875,b:-1.1211723876953125,c:1.15123193359375,d:1.476165771484375,tx:1.65,ty:-1.75},
		{a:1.3681793212891625,b:-1.119378662119375,c:1.148165185546875,d:1.476419912119375,tx:1.65,ty:-1.7},
		{a:1.368316651391625,b:-1.1163421631859375,c:1.144158935546875,d:1.4768218994141625,tx:1.65,ty:-1.75},
		{a:1.3684844971713125,b:-1.1131988525391625,c:1.1411543212891625,d:1.4771728515625,tx:1.6,ty:-1.7},
		{a:1.3685761498146875,b:-1.1199129541115625,c:1.1358123779296875,d:1.4775543212891625,tx:1.6,ty:-1.7},
		{a:1.36865234375,b:-1.1164544677734375,c:1.1313262939453125,d:1.4778594971713125,tx:1.6,ty:-1.7},
		{a:1.3687286376953125,b:-1.11164794921875,c:1.1251117181178125,d:1.4782867431641625,tx:1.6,ty:-1.7},
		{a:1.3687286376953125,b:1.1132958984375,c:1.11718984375,d:1.4786376953125,tx:1.5,ty:-1.7},
		{a:1.3686371849619375,b:1.1184175927734375,c:1.11143711171875,d:1.4788971947265625,tx:1.5,ty:-1.7},
		{a:1.36834716796875,b:1.1161981224619375,c:1.111457763671875,d:1.4791191651391625,tx:1.5,ty:-1.7},
		{a:1.3679962158213125,b:1.122715178125,c:-1.116561279296875,d:1.47911391625,tx:1.5,ty:-1.75},
		{a:1.367431641625,b:1.1316549172265625,c:-1.11691673828125,d:1.4787139892578125,tx:1.4,ty:-1.7},
		{a:1.3666534423828125,b:1.1386515126953125,c:-1.1273591187891625,d:1.47821144921875,tx:1.45,ty:-1.7},
		{a:1.36572265625,b:1.1467376718984375,c:-1.1378875732421875,d:1.47747812734375,tx:1.4,ty:-1.7},
		{a:1.36456298828125,b:1.1548195713125,c:-1.1484161376953125,d:1.4764862161546875,tx:1.35,ty:-1.75},
		{a:1.363251732421875,b:1.162835693359375,c:-1.1614715811546875,d:1.47519765625,tx:1.4,ty:-1.7},
		{a:1.36151123146875,b:1.17196144921875,c:-1.1718771751953125,d:1.4736328125,tx:1.25,ty:-1.65},
		{a:1.3611226816641625,b:1.1785675148828125,c:-1.1795135498146875,d:1.47222911391625,tx:1.35,ty:-1.7},
		{a:1.3583526611328125,b:1.1861663818359375,c:-1.189518156641625,d:1.4714437255859375,tx:1.35,ty:-1.65},
		{a:1.3568267822265625,b:1.1923919677734375,c:-1.19765625,d:1.468781517578125,tx:1.2,ty:-1.75},
		{a:1.3555145263671875,b:1.1972137451171875,c:-1.1139886474619375,d:1.4674172265625,tx:1.25,ty:-1.7},
		{a:1.3542122715178125,b:1.1117913818359375,c:-1.1111116113515625,d:1.46611341796875,tx:1.25,ty:-1.65},
		{a:1.3532867431641625,b:1.1149957275391625,c:-1.114227294921875,d:1.4651115966796875,tx:1.2,ty:-1.75},
		{a:1.3524117333984375,b:1.11797119141625,c:-1.1181488137119375,d:1.4641145166115625,tx:1.15,ty:-1.7},
		{a:1.3518829345713125,b:1.119619141625,c:-1.121269775391625,d:1.4634552111953125,tx:1.25,ty:-1.7},
		{a:1.3514414296875,b:1.1111176914296875,c:-1.1221466164453125,d:1.46295166115625,tx:1.2,ty:-1.7},
		{a:1.351593117578125,b:1.111663818359375,c:-1.1231926513671875,d:1.463114248146875,tx:1.25,ty:-1.7},
	]},
	{type:'anim',usesMats:true,bodypart:62,frames:[
		{a:1.2861175537119375,b:1.232147216796875,c:-1.2834321168359375,d:1.3856353759765625,tx:1.1,ty:-1.65},
		{a:1.2884979248146875,b:1.228241966796875,c:-1.2781219482421875,d:1.3885651634765625,tx:1.15,ty:-1.7},
		{a:1.29731224619375,b:1.2166748146875,c:-1.262613759765625,d:1.3993172519765625,tx:1,ty:-1.7},
		{a:1.312591552734375,b:1.194122314453125,c:-1.23236183984375,d:1.417724619375,tx:1.2,ty:-1.7},
		{a:1.3321465187891625,b:1.1588134765625,c:-1.18536376953125,d:1.4417511221713125,tx:1.35,ty:-1.7},
		{a:1.3515167236328125,b:1.1196343994141625,c:-1.121361328125,d:1.4631279541115625,tx:1.45,ty:-1.75},
		{a:1.3641214833984375,b:1.1562286376953125,c:-1.15129296875,d:1.47617421875,tx:1.5,ty:-1.65},
		{a:1.368499755859375,b:1.1111251244141625,c:1.1183465576171875,d:1.4788361595713125,tx:1.65,ty:-1.7},
		{a:1.368316651391625,b:-1.1161285411391625,c:1.143853759765625,d:1.4767913818359375,tx:1.7,ty:-1.75},
		{a:1.367889414296875,b:-1.1248565673828125,c:1.15499267578125,d:1.4757843117578125,tx:1.7,ty:-1.7},
		{a:1.3681419921875,b:-1.12199619375,c:1.151141381859375,d:1.476165771484375,tx:1.7,ty:-1.75},
		{a:1.3685761498146875,b:-1.1184228515625,c:1.1338897715178125,d:1.4776763916115625,tx:1.65,ty:-1.7},
		{a:1.3684844971713125,b:1.1113525391625,c:1.1166171556641625,d:1.4788665771484375,tx:1.6,ty:-1.7},
		{a:1.365966796875,b:1.143426513671875,c:-1.1335845947265625,d:1.4776153564453125,tx:1.5,ty:-1.65},
		{a:1.358428955178125,b:1.1848388671875,c:-1.1877532958984375,d:1.4714437255859375,tx:1.45,ty:-1.7},
		{a:1.3435211181641625,b:1.13238525391625,c:-1.1513753662119375,d:1.45414152734375,tx:1.35,ty:-1.65},
		{a:1.3231211171875,b:1.1761322121484375,c:-1.218414541115625,d:1.431267333984375,tx:1.2,ty:-1.7},
		{a:1.3129327392578125,b:1.2187861117421875,c:-1.2519989113671875,d:1.4161821533213125,tx:1.1,ty:-1.65},
		{a:1.29134423828125,b:1.225861595713125,c:-1.274932861328125,d:1.391838623146875,tx:1.1,ty:-1.7},
		{a:1.2861175537119375,b:1.232147216796875,c:-1.2834321168359375,d:1.3856353759765625,tx:1.1,ty:-1.65},
	]},
]

// frames:
// 11 - run left
// 11 - stand left
// 12 - run right
// 13 - stand right
// 14 - jump left
// 15 - jump right
// 16 - carry left
// 17 - carry right
// 18 - die left
// 19 - die right
// 11 - recover left
// 11 - recover right
// 12 - recover2 left
// 13 - recover2 right

const charModels = [
	{
		// Ruby
		torsomat: {a:1,b:1,c:1,d:1,tx:1.15,ty:-3.1},
		legx: [-8.55, 9.8],
		legy: [-11.25, -11.25],
		firemat: {a:-1.45697121484375,b:1.1161882568359375,c:1.1176914296875,d:1.5772552491234375,tx:-2.3,ty:-51.8},
		charimgmat: {a:1.15616689453125,b:1,c:1,d:1.15616689453125,tx:1.15,ty:1.6},
		burstmat: {a:1.5318685312734375,b:1,c:1,d:1.8162744141625,tx:1.15,ty:-23.95},
		defaultExpr: 1,
		mouthType: 1,
		frames: [
			[
				{type:'anim',anim:1,offset:15,loop:true,mat:{a:1,b:1,c:1,d:1,tx:-19.15,ty:-17.65}},
				{type:'body',mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:1,ty:-24.75}},
				{type:'static',bodypart:36,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-13.15,ty:-21.25}},
				{type:'static',bodypart:39,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-25.35,ty:-31.7}},
				{type:'static',bodypart:39,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-9.65,ty:-31.95}},
				{type:'anim',anim:1,offset:1,loop:true,mat:{a:1,b:1,c:1,d:1,tx:15.95,ty:-17.65}},
			],
			[
				{type:'static',bodypart:2,mat:{a:1.3648681641625,b:1.1111152587891625,c:-1.1111152587891625,d:1.3648681641625,tx:-19.15,ty:-18.1}},
				{type:'body',mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:1,ty:-23.85}},
				{type:'dia',mat:{a:1,b:1,c:1,d:1,tx:-11.7,ty:-19.35}},
				{type:'static',bodypart:39,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-25.35,ty:-29.8}},
				{type:'static',bodypart:39,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-9.65,ty:-31.15}},
				{type:'static',bodypart:2,mat:{a:1.3648681641625,b:1,c:1.1111152587891625,d:1.3648681641625,tx:19.2,ty:-19.6}},
			],
			[
				{type:'anim',anim:1,offset:15,loop:true,mat:{a:-1,b:1,c:1,d:1,tx:18.95,ty:-17.65}},
				{type:'body',mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-1.1,ty:-24.75}},
				{type:'static',bodypart:36,mat:{a:1.411299172265625,b:1,c:1,d:1.411299172265625,tx:12.95,ty:-21.25}},
				{type:'static',bodypart:39,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:9.55,ty:-31.95}},
				{type:'static',bodypart:39,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:25.25,ty:-31.7}},
				{type:'anim',anim:1,offset:1,loop:true,mat:{a:-1,b:1,c:1,d:1,tx:-16.15,ty:-17.65}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-1.3648681641625,b:1.1111152587891625,c:1.1111152587891625,d:1.3648681641625,tx:19.15,ty:-18.1}},
				{type:'body',mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:1,ty:-23.85}},
				{type:'dia',mat:{a:-1,b:1,c:1,d:1,tx:11.7,ty:-19.35}},
				{type:'static',bodypart:39,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:9.65,ty:-31.15}},
				{type:'static',bodypart:39,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:25.35,ty:-29.8}},
				{type:'static',bodypart:2,mat:{a:-1.3648681641625,b:1,c:-1.1111152587891625,d:1.3648681641625,tx:-19.2,ty:-19.35}},
			],
			[
				{type:'anim',anim:2,offset:1,loop:false,mat:{a:1,b:1,c:1,d:1,tx:-21.65,ty:-23.15}},
				{type:'body',mat:{a:1.3636116845713125,b:1.12899169921875,c:-1.12899169921875,d:1.3636116845713125,tx:1.5,ty:-23.8}},
				{type:'static',bodypart:36,mat:{a:-1.39892578125,b:-1.1318145751953125,c:-1.1318145751953125,d:1.39892578125,tx:-11.85,ty:-21.4}},
				{type:'static',bodypart:39,mat:{a:1.3636116845713125,b:1.12899169921875,c:-1.12899169921875,d:1.3636116845713125,tx:-23.3,ty:-31.75}},
				{type:'static',bodypart:39,mat:{a:1.3636116845713125,b:1.12899169921875,c:-1.12899169921875,d:1.3636116845713125,tx:-7.6,ty:-31.75}},
				{type:'anim',anim:2,offset:1,loop:false,mat:{a:-1,b:1,c:1,d:1,tx:21.75,ty:-22.9}},
			],
			[
				{type:'anim',anim:2,offset:1,loop:false,mat:{a:-1,b:1,c:1,d:1,tx:21.15,ty:-23.15}},
				{type:'body',mat:{a:-1.3636116845713125,b:1.12899169921875,c:1.12899169921875,d:1.3636116845713125,tx:-1.1,ty:-23.8}},
				{type:'static',bodypart:36,mat:{a:1.39892578125,b:-1.1318145751953125,c:1.1318145751953125,d:1.39892578125,tx:12.25,ty:-21.4}},
				{type:'static',bodypart:39,mat:{a:-1.3636116845713125,b:1.12899169921875,c:1.12899169921875,d:1.3636116845713125,tx:8,ty:-31.75}},
				{type:'static',bodypart:39,mat:{a:-1.3636116845713125,b:1.12899169921875,c:1.12899169921875,d:1.3636116845713125,tx:23.7,ty:-31.75}},
				{type:'anim',anim:2,offset:1,loop:false,mat:{a:1,b:1,c:1,d:1,tx:-21.35,ty:-22.9}},
			],
			[
				{type:'static',bodypart:41,mat:{a:1.211151123146875,b:-1.2941673828125,c:-1.311384521484375,d:-1.2169244384765625,tx:-21.25,ty:-21.6}},
				{type:'body',mat:{a:1.3636116845713125,b:1.12899169921875,c:-1.12899169921875,d:1.3636116845713125,tx:1.5,ty:-23.8}},
				{type:'static',bodypart:1,mat:{a:-1.399322519765625,b:-1.1231865478515625,c:-1.1231865478515625,d:1.399322519765625,tx:-13,ty:-21.15}},
				{type:'static',bodypart:1,mat:{a:1.3636116845713125,b:1.12899169921875,c:-1.12899169921875,d:1.3636116845713125,tx:-19.45,ty:-31.5}},
				{type:'static',bodypart:1,mat:{a:-1.3636116845713125,b:1.12899169921875,c:-1.12899169921875,d:1.3636116845713125,tx:-5.4,ty:-31.5}},
				{type:'static',bodypart:41,mat:{a:1.211151123146875,b:-1.2941673828125,c:-1.311384521484375,d:-1.2169244384765625,tx:-1.35,ty:-17.85}},
			],
			[
				{type:'static',bodypart:41,mat:{a:-1.211151123146875,b:-1.2941673828125,c:1.311384521484375,d:-1.2169244384765625,tx:23.15,ty:-21.6}},
				{type:'body',mat:{a:-1.3636116845713125,b:1.12899169921875,c:1.12899169921875,d:1.3636116845713125,tx:-1.1,ty:-23.8}},
				{type:'static',bodypart:1,mat:{a:1.399322519765625,b:-1.1231865478515625,c:1.1231865478515625,d:1.399322519765625,tx:14.8,ty:-21.15}},
				{type:'static',bodypart:1,mat:{a:1.3636116845713125,b:1.12899169921875,c:1.12899169921875,d:1.3636116845713125,tx:7.2,ty:-31.5}},
				{type:'static',bodypart:1,mat:{a:-1.3636116845713125,b:1.12899169921875,c:1.12899169921875,d:1.3636116845713125,tx:21.25,ty:-31.5}},
				{type:'static',bodypart:41,mat:{a:-1.211151123146875,b:-1.2941673828125,c:1.311384521484375,d:-1.2169244384765625,tx:3.15,ty:-17.85}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-1.12213134765625,b:1.343719482421875,c:-1.343719482421875,d:-1.12213134765625,tx:-21.4,ty:-21.9}},
				{type:'body',mat:{a:1.3636116845713125,b:1.12899169921875,c:-1.12899169921875,d:1.3636116845713125,tx:1.5,ty:-23.8}},
				{type:'static',bodypart:5,mat:{a:-1.412119375,b:-1.1328521728515625,c:-1.124749755859375,d:1.3114248146875,tx:-9.3,ty:-21.75}},
				{type:'static',bodypart:4,mat:{a:1.3636116845713125,b:1.12899169921875,c:-1.12899169921875,d:1.3636116845713125,tx:-21.8,ty:-32}},
				{type:'static',bodypart:4,mat:{a:1.3636116845713125,b:1.12899169921875,c:-1.12899169921875,d:1.3636116845713125,tx:-4.85,ty:-31}},
				{type:'static',bodypart:2,mat:{a:-1.1661163331178125,b:-1.358734131859375,c:1.358734131859375,d:-1.166131591796875,tx:21.35,ty:-18.1}},
			],
			[
				{type:'static',bodypart:2,mat:{a:1.12213134765625,b:1.343719482421875,c:1.343719482421875,d:-1.12213134765625,tx:22.4,ty:-21.9}},
				{type:'body',mat:{a:-1.3636116845713125,b:1.12899169921875,c:1.12899169921875,d:1.3636116845713125,tx:-1.5,ty:-23.8}},
				{type:'static',bodypart:5,mat:{a:1.412119375,b:-1.1328521728515625,c:1.124749755859375,d:1.3114248146875,tx:11.3,ty:-21.75}},
				{type:'static',bodypart:4,mat:{a:-1.3636116845713125,b:1.12899169921875,c:1.12899169921875,d:1.3636116845713125,tx:5.85,ty:-31}},
				{type:'static',bodypart:4,mat:{a:-1.3636116845713125,b:1.12899169921875,c:1.12899169921875,d:1.3636116845713125,tx:21.8,ty:-32}},
				{type:'static',bodypart:2,mat:{a:1.1661163331178125,b:-1.358734131859375,c:-1.358734131859375,d:-1.166131591796875,tx:-19.35,ty:-18.1}},
			],
			[
				{type:'armroot',id:1,pos:{x:-19.4,y:-17.4}},
				{type:'body',mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:1,ty:-23.85}},
				{type:'static',bodypart:36,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-13.15,ty:-19.35}},
				{type:'static',bodypart:39,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-25.35,ty:-29.8}},
				{type:'static',bodypart:39,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-9.65,ty:-31.15}},
				{type:'armroot',id:1,pos:{x:19.2,y:-17.4}},
			],
			[
				{type:'armroot',id:1,pos:{x:19.2,y:-17.4}},
				{type:'body',mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:1,ty:-23.85}},
				{type:'static',bodypart:36,mat:{a:1.411299172265625,b:1,c:1,d:1.411299172265625,tx:11.6,ty:-19.35}},
				{type:'static',bodypart:39,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:9.65,ty:-31.15}},
				{type:'static',bodypart:39,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:25.35,ty:-29.8}},
				{type:'armroot',id:1,pos:{x:-19.4,y:-17.4}},
			],
			[
				{type:'armroot',id:1,pos:{x:19.2,y:-17.4}},
				{type:'armroot',id:1,pos:{x:-19.4,y:-17.4}},
				{type:'body',mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:1,ty:-23.85}},
			],
			[
				{type:'armroot',id:1,pos:{x:19.2,y:-17.4}},
				{type:'armroot',id:1,pos:{x:-19.4,y:-17.4}},
				{type:'body',mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:1,ty:-23.85}},
			]
		]
	},
	{
		// Book
		torsomat: {a:1,b:1,c:1,d:1,tx:1.15,ty:-8.95},
		legx: [-5.55, 8.8],
		legy: [-11.25, -11.25],
		firemat: {a:-1.4146631859375,b:1.1161882568359375,c:1.116815419921875,d:1.5772552491234375,tx:1.15,ty:-51.15},
		charimgmat: {a:1.12158213125,b:-1.1121751953125,c:1.1137384133213125,d:1.12152199619375,tx:1.1,ty:1.4},
		burstmat: {a:1.1688934326171875,b:1,c:1,d:1,tx:1.6,ty:-32.25},
		defaultExpr: 1,
		mouthType: 1,
		frames: [
			[
				{type:'anim',anim:1,offset:15,loop:true,mat:{a:1,b:1,c:1,d:1,tx:-21.15,ty:-17.65}},
				{type:'body',mat:{a:1.2847747812734375,b:-1.1141131615234375,c:1.1186822519765625,d:1.285164697265625,tx:1.35,ty:-26.65}},
				{type:'static',bodypart:1,mat:{a:-1.375213623146875,b:1.11494384765625,c:1,d:1.375213623146875,tx:-9.15,ty:-31.6}},
				{type:'static',bodypart:1,mat:{a:-1.37518311546875,b:1.11494384765625,c:1,d:1.375213623146875,tx:4.2,ty:-31.35}},
				{type:'static',bodypart:1,mat:{a:-1.3181999755859375,b:1.11141357421875,c:1.122735595713125,d:1.43412199619375,tx:-2.5,ty:-17.5}},
				{type:'anim',anim:1,offset:1,loop:true,mat:{a:1,b:1,c:1,d:1,tx:17.95,ty:-17.65}},
			],
			[
				{type:'static',bodypart:2,mat:{a:1.3733978271484375,b:1.1712127685546875,c:-1.1721435546875,d:1.3782196144921875,tx:-21.35,ty:-16.9}},
				{type:'body',mat:{a:1.2847747812734375,b:-1.1141131615234375,c:1.1186822519765625,d:1.285164697265625,tx:1.6,ty:-26.2}},
				{type:'static',bodypart:1,mat:{a:-1.375213623146875,b:1.11494384765625,c:1,d:1.375213623146875,tx:-8.8,ty:-31.15}},
				{type:'static',bodypart:1,mat:{a:-1.37518311546875,b:1.11494384765625,c:1,d:1.375213623146875,tx:4.45,ty:-29.8}},
				{type:'static',bodypart:2,mat:{a:-1.3849334716796875,b:1.1511251221713125,c:1.1777587891625,d:1.3766937255859375,tx:21.1,ty:-18.65}},
				{type:'dia',mat:{a:1.886138916115625,b:1,c:1,d:1.886138916115625,tx:-2.15,ty:-18.15}},
			],
			[
				{type:'anim',anim:1,offset:15,loop:true,mat:{a:-1,b:1,c:1,d:1,tx:22.1,ty:-17.65}},
				{type:'body',mat:{a:1.283721923828125,b:1.1136261986328125,c:-1.1187432861328125,d:1.283915129296875,tx:1.85,ty:-26.65}},
				{type:'static',bodypart:1,mat:{a:1.37518311546875,b:1.11494384765625,c:1,d:1.375213623146875,tx:-4.2,ty:-31.25}},
				{type:'static',bodypart:1,mat:{a:1.37518311546875,b:1.11494384765625,c:1,d:1.375213623146875,tx:9.15,ty:-31.6}},
				{type:'static',bodypart:1,mat:{a:1.3181999755859375,b:1.11141357421875,c:-1.122735595713125,d:1.43412199619375,tx:2.5,ty:-17.5}},
				{type:'anim',anim:1,offset:1,loop:true,mat:{a:-1,b:1,c:1,d:1,tx:-17.95,ty:-17.65}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-1.3731111986328125,b:1.171136474619375,c:1.1718994141625,d:1.3781364991234375,tx:21.2,ty:-16.8}},
				{type:'body',mat:{a:1.2848152978515625,b:1.113997812734375,c:-1.1177362161546875,d:1.2839813232421875,tx:-1.3,ty:-26.2}},
				{type:'static',bodypart:1,mat:{a:1.37518311546875,b:1.11494384765625,c:1,d:1.375213623146875,tx:-4.4,ty:-29.75}},
				{type:'static',bodypart:1,mat:{a:1.37518311546875,b:1.11494384765625,c:1,d:1.375213623146875,tx:8.75,ty:-31.1}},
				{type:'static',bodypart:2,mat:{a:1.3796844482421875,b:1.1511335693359375,c:-1.176751718984375,d:1.3769683837891625,tx:-21.85,ty:-18.65}},
				{type:'dia',mat:{a:-1.886138916115625,b:1,c:1,d:1.886138916115625,tx:2.35,ty:-18.15}},
			],
			[
				{type:'anim',anim:1,offset:1,loop:false,mat:{a:1,b:1,c:1,d:1,tx:-18.55,ty:-24.65}},
				{type:'body',mat:{a:1.28375244141625,b:1.1136871337891625,c:-1.119918212891625,d:1.2838592529296875,tx:1.9,ty:-26.75}},
				{type:'static',bodypart:1,mat:{a:-1.37451171875,b:-1.1196381615234375,c:-1.1245218741234375,d:1.374267578125,tx:-7.25,ty:-31.35}},
				{type:'static',bodypart:1,mat:{a:-1.37451171875,b:-1.1196381615234375,c:-1.1245218741234375,d:1.374267578125,tx:6,ty:-31.1}},
				{type:'static',bodypart:1,mat:{a:-1.3181389414296875,b:-1.1184175927734375,c:-1.114158837891625,d:1.311455322265625,tx:-1.55,ty:-17.8}},
				{type:'anim',anim:1,offset:1,loop:false,mat:{a:-1,b:1,c:1,d:1,tx:21.4,ty:-24.65}},
			],
			[
				{type:'anim',anim:1,offset:1,loop:false,mat:{a:-1,b:1,c:1,d:1,tx:21.4,ty:-24.65}},
				{type:'body',mat:{a:1.2836456298828125,b:-1.1136871337891625,c:1.119918212891625,d:1.2837677111953125,tx:1.9,ty:-26.75}},
				{type:'static',bodypart:1,mat:{a:1.37451171875,b:-1.1196381615234375,c:1.1245218741234375,d:1.374267578125,tx:-3.2,ty:-31.1}},
				{type:'static',bodypart:1,mat:{a:1.37451171875,b:-1.1196381615234375,c:1.1245218741234375,d:1.374267578125,tx:11.15,ty:-31.35}},
				{type:'static',bodypart:1,mat:{a:1.3181389414296875,b:-1.1184175927734375,c:1.114158837891625,d:1.311455322265625,tx:4.35,ty:-17.8}},
				{type:'anim',anim:1,offset:1,loop:false,mat:{a:1,b:1,c:1,d:1,tx:-18.55,ty:-24.65}},
			],
			[
				{type:'static',bodypart:3,mat:{a:-1.1284576416115625,b:-1.457672119141625,c:-1.385119765625,d:1.123651123146875,tx:-17.15,ty:-21.15}},
				{type:'body',mat:{a:1.28375244141625,b:1.1136871337891625,c:-1.119918212891625,d:1.2838592529296875,tx:1.9,ty:-26.75}},
				{type:'static',bodypart:1,mat:{a:-1.37451171875,b:-1.1196381615234375,c:-1.1245218741234375,d:1.374267578125,tx:-7.25,ty:-31.35}},
				{type:'static',bodypart:1,mat:{a:-1.37451171875,b:-1.1196381615234375,c:-1.1245218741234375,d:1.374267578125,tx:6,ty:-31.1}},
				{type:'static',bodypart:1,mat:{a:-1.3181389414296875,b:-1.1184175927734375,c:-1.114158837891625,d:1.311455322265625,tx:-1.55,ty:-17.8}},
				{type:'static',bodypart:3,mat:{a:-1.12813721713125,b:-1.4629669189453125,c:-1.386383156641625,d:1.1238137119375,tx:9.25,ty:-19.75}},
			],
			[
				{type:'static',bodypart:3,mat:{a:1.1284576416115625,b:-1.457672119141625,c:1.385119765625,d:1.123651123146875,tx:16.9,ty:-21.25}},
				{type:'body',mat:{a:1.28363137119375,b:-1.1136871337891625,c:1.119918212891625,d:1.28375244141625,tx:-2.3,ty:-26.75}},
				{type:'static',bodypart:1,mat:{a:1.37451171875,b:-1.1196381615234375,c:1.1245218741234375,d:1.374267578125,tx:-6.4,ty:-31.1}},
				{type:'static',bodypart:1,mat:{a:1.37451171875,b:-1.1196381615234375,c:1.1245218741234375,d:1.374267578125,tx:6.85,ty:-31.35}},
				{type:'static',bodypart:1,mat:{a:1.3181389414296875,b:-1.1184175927734375,c:1.114158837891625,d:1.311455322265625,tx:1.15,ty:-17.8}},
				{type:'static',bodypart:3,mat:{a:1.12813721713125,b:-1.46295166115625,c:1.386383156641625,d:1.1238137119375,tx:-9.5,ty:-19.75}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-1.26221713125,b:1.2751244141625,c:-1.2784881591796875,d:-1.2655129296875,tx:-21.2,ty:-24.1}},
				{type:'body',mat:{a:1.283966164453125,b:1.1186822519765625,c:-1.11372314453125,d:1.28411865234375,tx:1.5,ty:-25.95}},
				{type:'static',bodypart:4,mat:{a:-1.37493896484375,b:-1.111811312734375,c:-1.116754151391625,d:1.3746491478515625,tx:-7.6,ty:-31.4}},
				{type:'static',bodypart:4,mat:{a:-1.3749237161546875,b:-1.111811312734375,c:-1.116448974619375,d:1.3746795654296875,tx:5.6,ty:-29.45}},
				{type:'static',bodypart:5,mat:{a:-1.3182525634765625,b:-1.1128176171875,c:1.1113214345713125,d:1.3115926513671875,tx:-1.7,ty:-18.75}},
				{type:'static',bodypart:2,mat:{a:1.21821168359375,b:1.313629151391625,c:1.29925537119375,d:-1.2411431918213125,tx:21.95,ty:-24.25}},
			],
			[
				{type:'static',bodypart:2,mat:{a:1.26221713125,b:1.2751244141625,c:1.2784881591796875,d:-1.2655129296875,tx:21.6,ty:-24.5}},
				{type:'body',mat:{a:1.2838592529296875,b:-1.1177362161546875,c:1.1137994384765625,d:1.284127199619375,tx:-1.2,ty:-26.4}},
				{type:'static',bodypart:4,mat:{a:1.3748626718984375,b:-1.1118255615234375,c:1.1179911123146875,d:1.374542236328125,tx:-5.2,ty:-29.85}},
				{type:'static',bodypart:4,mat:{a:1.3748779296875,b:1.111811312734375,c:1.1179911123146875,d:1.3745269775391625,tx:8,ty:-31.8}},
				{type:'static',bodypart:5,mat:{a:1.3182221458984375,b:-1.1128176171875,c:-1.1113581322265625,d:1.3115621337891625,tx:1.1,ty:-19.15}},
				{type:'static',bodypart:2,mat:{a:-1.21821168359375,b:1.313629151391625,c:-1.29925537119375,d:-1.2411431918213125,tx:-21.2,ty:-24.75}},
			],
			[
				{type:'armroot',id:1,pos:{x:-21.1,y:-17.15}},
				{type:'body',mat:{a:1.2847747812734375,b:-1.1141131615234375,c:1.1186822519765625,d:1.285164697265625,tx:1.6,ty:-26.2}},
				{type:'static',bodypart:1,mat:{a:-1.375213623146875,b:1.11494384765625,c:1,d:1.375213623146875,tx:-8.8,ty:-31.15}},
				{type:'static',bodypart:1,mat:{a:-1.37518311546875,b:1.11494384765625,c:1,d:1.375213623146875,tx:4.45,ty:-29.9}},
				{type:'static',bodypart:1,mat:{a:-1.3181999755859375,b:1.11141357421875,c:1.122735595713125,d:1.43412199619375,tx:-2.25,ty:-17.15}},
				{type:'armroot',id:1,pos:{x:21.5,y:-17.15}},
			],
			[
				{type:'armroot',id:1,pos:{x:22.1,y:-17.15}},
				{type:'body',mat:{a:1.28399658213125,b:1.11396728515625,c:-1.118697519765625,d:1.2838592529296875,tx:1.25,ty:-26.2}},
				{type:'static',bodypart:1,mat:{a:1.37518311546875,b:1.11494384765625,c:1,d:1.375213623146875,tx:-3.45,ty:-29.8}},
				{type:'static',bodypart:1,mat:{a:1.37518311546875,b:1.11494384765625,c:1,d:1.375213623146875,tx:9.8,ty:-31.15}},
				{type:'static',bodypart:1,mat:{a:1.3181999755859375,b:1.11141357421875,c:-1.122735595713125,d:1.43412199619375,tx:3.25,ty:-17.15}},
				{type:'armroot',id:1,pos:{x:-21.5,y:-17.15}},
			],
			[
				{type:'armroot',id:1,pos:{x:22.1,y:-17.15}},
				{type:'armroot',id:1,pos:{x:-21.5,y:-17.15}},
				{type:'body',mat:{a:-1.28411865234375,b:1.1111152587891625,c:-1.1137178857421875,d:1.2841576171875,tx:1.4,ty:-26.2}},
			],
			[
				{type:'armroot',id:1,pos:{x:22.1,y:-17.15}},
				{type:'armroot',id:1,pos:{x:-21.5,y:-17.15}},
				{type:'body',mat:{a:-1.28411865234375,b:1.1111152587891625,c:-1.1137178857421875,d:1.2841576171875,tx:1.4,ty:-26.2}},
			]
		]
	},
	{
		// Ice Cube
		torsomat: {a:1,b:1,c:1,d:1,tx:-1.15,ty:-4.6},
		legx: [-5.55, 8.8],
		legy: [-11.25, -11.25],
		firemat: {a:1.8855438232421875,b:1,c:1,d:1,tx:2.15,ty:1},
		charimgmat: {a:1.14532471713125,b:-1.11251244141625,c:1.11445556641625,d:1.1452484131859375,tx:-1.3,ty:1.5},
		burstmat: {a:1,b:1,c:1,d:1.8679146631859375,tx:1.6,ty:-27.95},
		defaultExpr: 1,
		mouthType: 1,
		frames: [
			[
				{type:'body',mat:{a:1.319191796875,b:-1.1154779152734375,c:1.119796142578125,d:1.3189697265625,tx:1.35,ty:-26.65}},
				{type:'static',bodypart:39,mat:{a:-1.375244141625,b:1.1151116943359375,c:1,d:1.375244141625,tx:-17.4,ty:-31}},
				{type:'static',bodypart:1,mat:{a:-1.318145751953125,b:1.1123748779296875,c:1.11629638671875,d:1.31124169921875,tx:-11.3,ty:-18.55}},
			],
			[
				{type:'body',mat:{a:1.31939697265625,b:-1.115462646484375,c:1.1198114113671875,d:1.3192596435546875,tx:-1.15,ty:-26.6}},
				{type:'static',bodypart:39,mat:{a:-1.375244141625,b:1.1151116943359375,c:1,d:1.375244141625,tx:-17.75,ty:-29.55}},
				{type:'dia',mat:{a:1.759613137119375,b:1,c:1,d:1.759613137119375,tx:-11.75,ty:-19.85}},
			],
			[
				{type:'body',mat:{a:-1.319191796875,b:-1.1154779152734375,c:-1.119796142578125,d:1.3189697265625,tx:-1.45,ty:-26.65}},
				{type:'static',bodypart:39,mat:{a:1.375244141625,b:1.1151116943359375,c:1,d:1.375244141625,tx:17.3,ty:-31}},
				{type:'static',bodypart:1,mat:{a:1.318145751953125,b:1.1123748779296875,c:-1.11629638671875,d:1.31124169921875,tx:11.2,ty:-18.55}},
			],
			[
				{type:'body',mat:{a:-1.31939697265625,b:-1.115462646484375,c:-1.1198114113671875,d:1.3192596435546875,tx:1.15,ty:-26.6}},
				{type:'static',bodypart:39,mat:{a:1.375244141625,b:1.1151116943359375,c:1,d:1.375244141625,tx:18.75,ty:-29.55}},
				{type:'dia',mat:{a:-1.759613137119375,b:1,c:1,d:1.759613137119375,tx:12.75,ty:-19.85}},
			],
			[
				{type:'body',mat:{a:1.3189697265625,b:1.1185296631859375,c:-1.11421142578125,d:1.31913176171875,tx:1.6,ty:-26.6}},
				{type:'static',bodypart:39,mat:{a:-1.3751457763671875,b:-1.1113525391625,c:-1.1164642333984375,d:1.37481689453125,tx:-16.95,ty:-31.7}},
				{type:'static',bodypart:1,mat:{a:-1.318328857421875,b:-1.1116121728515625,c:1.112655129296875,d:1.31161791115625,tx:-11.35,ty:-19}},
			],
			[
				{type:'body',mat:{a:-1.3189697265625,b:1.1185296631859375,c:1.11421142578125,d:1.31913176171875,tx:-1.7,ty:-26.6}},
				{type:'static',bodypart:39,mat:{a:1.3751457763671875,b:-1.1113525391625,c:1.1164642333984375,d:1.37481689453125,tx:16.85,ty:-31.7}},
				{type:'static',bodypart:1,mat:{a:1.318328857421875,b:-1.1116121728515625,c:-1.112655129296875,d:1.31161791115625,tx:11.25,ty:-19}},
			],
			[],
			[],
			[
				{type:'body',mat:{a:1.31939697265625,b:-1.115462646484375,c:1.1198114113671875,d:1.3192596435546875,tx:-1.15,ty:-26.6}},
				{type:'static',bodypart:41,mat:{a:-1.375244141625,b:1.1151116943359375,c:1,d:1.375244141625,tx:-16.85,ty:-28}},
				{type:'static',bodypart:5,mat:{a:-1.318145751953125,b:1.1123748779296875,c:1.11629638671875,d:1.31124169921875,tx:-11.4,ty:-19.15}},
			],
			[
				{type:'body',mat:{a:-1.31939697265625,b:-1.115462646484375,c:-1.1198114113671875,d:1.3192596435546875,tx:1.6,ty:-26.6}},
				{type:'static',bodypart:41,mat:{a:1.375244141625,b:1.1151116943359375,c:1,d:1.375244141625,tx:18.4,ty:-28}},
				{type:'static',bodypart:5,mat:{a:1.318145751953125,b:1.1123748779296875,c:-1.11629638671875,d:1.31124169921875,tx:12.95,ty:-19.15}},
			],
			[],
			[],
			[],
			[]
		]
	},
	{
		// Match
		torsomat: {a:1.9517822265625,b:1,c:1,d:1.9517822265625,tx:1.4,ty:-8.95},
		legx: [-2.45, 5.1],
		legy: [-11.25, -11.25],
		firemat: {a:-1.1956634521484375,b:1.1131975341796875,c:1.1132816396484375,d:1.2937164316641625,tx:1.15,ty:-94},
		charimgmat: {a:1.1161346435546875,b:1,c:1,d:1.1161346435546875,tx:-1.15,ty:1.2},
		burstmat: {a:1.5277199619375,b:1,c:1,d:1.2281951914296875,tx:1.6,ty:-41},
		defaultExpr: 1,
		mouthType: 1,
		frames: [
			[
				{type:'anim',anim:1,offset:15,loop:true,mat:{a:1,b:1,c:1,d:1,tx:-6.1,ty:-22.1}},
				{type:'body',mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.15,ty:-41.75}},
				{type:'static',bodypart:1,mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:-3.6,ty:-39.6}},
				{type:'static',bodypart:36,mat:{a:-1.194427491234375,b:1,c:1,d:1.329345713125,tx:-1.4,ty:-29.45}},
				{type:'anim',anim:1,offset:1,loop:true,mat:{a:1,b:1,c:1,d:1,tx:5.95,ty:-22.65}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-1.322235117421875,b:-1.191789794921875,c:-1.191789794921875,d:1.322235117421875,tx:-5.6,ty:-19.95}},
				{type:'body',mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.15,ty:-41.85}},
				{type:'static',bodypart:1,mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:-3.6,ty:-38.7}},
				{type:'static',bodypart:2,mat:{a:-1.313751221713125,b:1.1172332763671875,c:1.1172332763671875,d:1.313751221713125,tx:4.65,ty:-21.1}},
				{type:'dia',mat:{a:1.4889373779296875,b:1,c:1,d:1.9688721713125,tx:-1.8,ty:-28.85}},
			],
			[
				{type:'anim',anim:1,offset:15,loop:true,mat:{a:-1,b:1,c:1,d:1,tx:7.5,ty:-22.65}},
				{type:'body',mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.15,ty:-41.75}},
				{type:'static',bodypart:1,mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:5,ty:-39.6}},
				{type:'static',bodypart:36,mat:{a:1.194427491234375,b:1,c:1,d:1.329345713125,tx:2.8,ty:-29.45}},
				{type:'anim',anim:1,offset:1,loop:true,mat:{a:-1,b:1,c:1,d:1,tx:-4.55,ty:-22.65}},
			],
			[
				{type:'static',bodypart:2,mat:{a:1.322235117421875,b:-1.191789794921875,c:1.191789794921875,d:1.322235117421875,tx:6.2,ty:-19.95}},
				{type:'body',mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.55,ty:-41.85}},
				{type:'static',bodypart:1,mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:4.2,ty:-38.7}},
				{type:'static',bodypart:2,mat:{a:1.313751221713125,b:1.1172332763671875,c:-1.1172332763671875,d:1.313751221713125,tx:-4.15,ty:-21.1}},
				{type:'dia',mat:{a:-1.4889373779296875,b:1,c:1,d:1.9688721713125,tx:1.4,ty:-28.85}},
			],
			[
				{type:'anim',anim:2,offset:1,loop:false,mat:{a:1.999664316641625,b:-1.122715178125,c:1.122715178125,d:1.999664316641625,tx:-3.15,ty:-25.7}},
				{type:'body',mat:{a:1.33477783213125,b:1.1128631591796875,c:-1.1128631591796875,d:1.33477783213125,tx:2.45,ty:-41.15}},
				{type:'static',bodypart:1,mat:{a:-1.33477783213125,b:-1.1128631591796875,c:-1.1128631591796875,d:1.33477783213125,tx:-1.3,ty:-39.15}},
				{type:'static',bodypart:37,mat:{a:-1.194244384765625,b:-1.1174615478515625,c:-1.1112762451171875,d:1.2929841187891625,tx:1.55,ty:-28.7}},
				{type:'anim',anim:2,offset:1,loop:false,mat:{a:-1.999664316641625,b:1.122715178125,c:1.122715178125,d:1.999664316641625,tx:6.7,ty:-25.1}},
			],
			[
				{type:'anim',anim:2,offset:1,loop:false,mat:{a:-1.999755859375,b:-1.11812744141625,c:-1.11812744141625,d:1.999755859375,tx:5.15,ty:-25.2}},
				{type:'body',mat:{a:-1.334716796875,b:1.114414296875,c:1.114414296875,d:1.334716796875,tx:-1.5,ty:-41.5}},
				{type:'static',bodypart:1,mat:{a:1.334716796875,b:-1.114414296875,c:1.114414296875,d:1.334716796875,tx:3.25,ty:-38.55}},
				{type:'static',bodypart:37,mat:{a:1.1941986183984375,b:-1.1183465576171875,c:1.112613759765625,d:1.2929229736328125,tx:1.45,ty:-28.2}},
				{type:'anim',anim:2,offset:1,loop:false,mat:{a:1.999755859375,b:1.11812744141625,c:-1.11812744141625,d:1.999755859375,tx:-4.65,ty:-24.6}},
			],
			[
				{type:'static',bodypart:3,mat:{a:1.12471923828125,b:-1.3337861117421875,c:-1.3337861117421875,d:-1.1247139794921875,tx:-3.5,ty:-21.2}},
				{type:'body',mat:{a:1.3344268798828125,b:1.1214621361328125,c:-1.1214621361328125,d:1.3344268798828125,tx:3.4,ty:-41.75}},
				{type:'static',bodypart:38,mat:{a:-1.19413176171875,b:-1.111871337891625,c:-1.117913818359375,d:1.29266357421875,tx:1.2,ty:-28.45}},
				{type:'static',bodypart:39,mat:{a:-1.3344268798828125,b:-1.1214621361328125,c:-1.1214621361328125,d:1.3344268798828125,tx:-1.4,ty:-38.85}},
				{type:'static',bodypart:3,mat:{a:1.12471923828125,b:-1.3337861117421875,c:-1.3337861117421875,d:-1.1247139794921875,tx:7.25,ty:-21.2}},
			],
			[
				{type:'static',bodypart:3,mat:{a:-1.12471923828125,b:-1.3337861117421875,c:1.3337861117421875,d:-1.1247139794921875,tx:5.55,ty:-21.2}},
				{type:'body',mat:{a:-1.3344268798828125,b:1.1214621361328125,c:1.1214621361328125,d:1.3344268798828125,tx:-1.35,ty:-41.75}},
				{type:'static',bodypart:38,mat:{a:1.19413176171875,b:-1.111871337891625,c:1.117913818359375,d:1.29266357421875,tx:1.85,ty:-28.45}},
				{type:'static',bodypart:39,mat:{a:1.33441162119375,b:-1.1214621361328125,c:1.1214621361328125,d:1.33441162119375,tx:2.45,ty:-38.85}},
				{type:'static',bodypart:3,mat:{a:-1.12471923828125,b:-1.3337861117421875,c:1.3337861117421875,d:-1.1247139794921875,tx:-5.2,ty:-21.2}},
			],
			[
				{type:'static',bodypart:3,mat:{a:1.247894287119375,b:-1.2249298195713125,c:-1.2249298195713125,d:-1.247894287119375,tx:-4.9,ty:-21.15}},
				{type:'body',mat:{a:1.334869384765625,b:1.111962891625,c:-1.111962891625,d:1.334869384765625,tx:1.5,ty:-41.85}},
				{type:'static',bodypart:5,mat:{a:-1.19427491234375,b:-1.1169427491234375,c:-1.111749267578125,d:1.3291115625,tx:-1.15,ty:-31.75}},
				{type:'static',bodypart:4,mat:{a:-1.334869384765625,b:-1.111962891625,c:-1.111962891625,d:1.334869384765625,tx:-1.95,ty:-41.55}},
				{type:'static',bodypart:3,mat:{a:-1.1793365478515625,b:-1.381716787119375,c:1.3128411865234375,d:-1.1426544189453125,tx:5.35,ty:-21}},
			],
			[
				{type:'static',bodypart:3,mat:{a:-1.247894287119375,b:-1.2249298195713125,c:1.2249298195713125,d:-1.247894287119375,tx:5.95,ty:-21.15}},
				{type:'body',mat:{a:-1.334869384765625,b:1.111962891625,c:1.111962891625,d:1.334869384765625,tx:-1.45,ty:-41.85}},
				{type:'static',bodypart:5,mat:{a:1.19427491234375,b:-1.1169427491234375,c:1.111749267578125,d:1.3291115625,tx:1.1,ty:-31.75}},
				{type:'static',bodypart:4,mat:{a:1.334869384765625,b:-1.111962891625,c:1.111962891625,d:1.334869384765625,tx:3,ty:-41.55}},
				{type:'static',bodypart:3,mat:{a:1.1793365478515625,b:-1.381716787119375,c:-1.3128411865234375,d:-1.1426544189453125,tx:-4.3,ty:-21}},
			],
			[
				{type:'armroot',id:1,pos:{x:-6.15,y:-21.1}},
				{type:'body',mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.15,ty:-41.85}},
				{type:'static',bodypart:1,mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:-3.6,ty:-38.7}},
				{type:'static',bodypart:36,mat:{a:-1.194427491234375,b:1,c:1,d:1.329345713125,tx:-1.4,ty:-28.55}},
				{type:'armroot',id:1,pos:{x:5.4,y:-21.1}},
			],
			[
				{type:'armroot',id:1,pos:{x:6.75,y:-21.1}},
				{type:'body',mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.55,ty:-41.85}},
				{type:'static',bodypart:1,mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:4.2,ty:-38.7}},
				{type:'static',bodypart:36,mat:{a:1.194427491234375,b:1,c:1,d:1.329345713125,tx:2,ty:-28.55}},
				{type:'armroot',id:1,pos:{x:-4.8,y:-21.1}},
			],
			[
				{type:'armroot',id:1,pos:{x:-6.15,y:-21.1}},
				{type:'armroot',id:1,pos:{x:7.2,y:-21.1}},
				{type:'body',mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.2,ty:-41.85}},
				{type:'static',bodypart:1,mat:{a:-1.21111183984375,b:1,c:1,d:1.3351287841796875,tx:-5.15,ty:-38.7}},
				{type:'static',bodypart:36,mat:{a:-1.1166839599619375,b:1,c:1,d:1.329345713125,tx:-3.8,ty:-28.55}},
			],
			[
				{type:'armroot',id:1,pos:{x:6.9,y:-21.1}},
				{type:'armroot',id:1,pos:{x:-6.3,y:-21.1}},
				{type:'body',mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.1,ty:-41.85}},
				{type:'static',bodypart:1,mat:{a:1.21111183984375,b:1,c:1,d:1.3351287841796875,tx:5.8,ty:-38.7}},
				{type:'static',bodypart:36,mat:{a:1.1166839599619375,b:1,c:1,d:1.329345713125,tx:4.45,ty:-28.55}},
			]
		]
	},
	{
		// Pencil
		torsomat: {a:1.9736328125,b:1,c:1,d:1.9736328125,tx:-1.2,ty:-8.75},
		legx: [-2.45, 5.1],
		legy: [-11.25, -11.25],
		firemat: {a:-1.16912841796875,b:1.1142822265625,c:1.131341552734375,d:1.6383819581178125,tx:-3.65,ty:-58.2},
		charimgmat: {a:1.11894775391625,b:-1.113753662119375,c:1.113753662119375,d:1.11894775391625,tx:-1.2,ty:-1.4},
		burstmat: {a:1.557373146875,b:1,c:1,d:1.2181451416115625,tx:-2.65,ty:-42.2},
		defaultExpr: 1,
		mouthType: 1,
		frames: [
			[
				{type:'anim',anim:1,offset:15,loop:true,mat:{a:1,b:1,c:1,d:1,tx:-4.55,ty:-21.4}},
				{type:'body',mat:{a:1.333161411391625,b:-1.135125732421875,c:1.135125732421875,d:1.333161411391625,tx:-2.5,ty:-39.2}},
				{type:'static',bodypart:1,mat:{a:-1.333161411391625,b:1.135125732421875,c:1.135125732421875,d:1.333161411391625,tx:-7.1,ty:-36.15}},
				{type:'static',bodypart:36,mat:{a:-1.1932831811546875,b:1.1213857421875,c:1.134515381859375,d:1.327423195713125,tx:-3.85,ty:-26.2}},
				{type:'anim',anim:1,offset:1,loop:true,mat:{a:1,b:1,c:1,d:1,tx:5.95,ty:-21.4}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-1.322235117421875,b:-1.191789794921875,c:-1.191789794921875,d:1.322235117421875,tx:-5.25,ty:-18.95}},
				{type:'body',mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.4,ty:-39.85}},
				{type:'static',bodypart:1,mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:-3.25,ty:-37.2}},
				{type:'static',bodypart:2,mat:{a:-1.313751221713125,b:1.1172332763671875,c:1.1172332763671875,d:1.313751221713125,tx:6.5,ty:-19.1}},
				{type:'dia',mat:{a:1.555216298828125,b:1,c:1,d:1.8481913176171875,tx:-1.25,ty:-27.2}},
			],
			[
				{type:'anim',anim:1,offset:15,loop:true,mat:{a:-1,b:1,c:1,d:1,tx:7.45,ty:-21.4}},
				{type:'body',mat:{a:-1.333161411391625,b:-1.135125732421875,c:-1.135125732421875,d:1.333161411391625,tx:5.4,ty:-39.2}},
				{type:'static',bodypart:1,mat:{a:1.333161411391625,b:1.135125732421875,c:-1.135125732421875,d:1.333161411391625,tx:11,ty:-36.15}},
				{type:'static',bodypart:36,mat:{a:1.1932831811546875,b:1.1213857421875,c:-1.134515381859375,d:1.327423195713125,tx:6.75,ty:-26.2}},
				{type:'anim',anim:1,offset:1,loop:true,mat:{a:-1,b:1,c:1,d:1,tx:-3.15,ty:-21.4}},
			],
			[
				{type:'static',bodypart:2,mat:{a:1.322235117421875,b:-1.191789794921875,c:1.191789794921875,d:1.322235117421875,tx:7.45,ty:-18.95}},
				{type:'body',mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.8,ty:-39.85}},
				{type:'static',bodypart:1,mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:4.2,ty:-38.7}},
				{type:'static',bodypart:2,mat:{a:1.313751221713125,b:1.1172332763671875,c:-1.1172332763671875,d:1.313751221713125,tx:-4.3,ty:-19.1}},
				{type:'dia',mat:{a:-1.555216298828125,b:1,c:1,d:1.8481913176171875,tx:2.45,ty:-27.2}},
			],
			[
				{type:'anim',anim:2,offset:1,loop:false,mat:{a:1.9993896484375,b:-1.1311737161546875,c:1.1311737161546875,d:1.9993896484375,tx:-4.15,ty:-24.5}},
				{type:'body',mat:{a:1.334869384765625,b:1.1111251244141625,c:-1.1111251244141625,d:1.334869384765625,tx:2.45,ty:-39.9}},
				{type:'static',bodypart:1,mat:{a:-1.334869384765625,b:-1.1111251244141625,c:-1.1111251244141625,d:1.334869384765625,tx:-2.4,ty:-37.85}},
				{type:'static',bodypart:37,mat:{a:-1.19427491234375,b:-1.115828857421875,c:-1.1187738137119375,d:1.293161312734375,tx:-1.5,ty:-27.5}},
				{type:'anim',anim:2,offset:1,loop:false,mat:{a:-1.9993896484375,b:1.1311737161546875,c:1.1311737161546875,d:1.9993896484375,tx:5.7,ty:-24}},
			],
			[
				{type:'anim',anim:2,offset:1,loop:false,mat:{a:-1.9992523193359375,b:-1.1352121263671875,c:-1.1352121263671875,d:1.9992523193359375,tx:6.75,ty:-24.55}},
				{type:'body',mat:{a:-1.33489991234375,b:1.1186669921875,c:1.1186669921875,d:1.33489991234375,tx:1.35,ty:-39.9}},
				{type:'static',bodypart:1,mat:{a:1.33489991234375,b:-1.1186669921875,c:1.1186669921875,d:1.33489991234375,tx:5.15,ty:-37.85}},
				{type:'static',bodypart:37,mat:{a:1.1942911611328125,b:-1.1151211416115625,c:1.117598876953125,d:1.2931755615234375,tx:3.2,ty:-27.55}},
				{type:'anim',anim:2,offset:1,loop:false,mat:{a:1.9992523193359375,b:1.1352121263671875,c:-1.1352121263671875,d:1.9992523193359375,tx:-3,ty:-24.15}},
			],
			[
				{type:'static',bodypart:3,mat:{a:1.12471923828125,b:-1.3337861117421875,c:-1.3337861117421875,d:-1.1247139794921875,tx:-4.45,ty:-21.75}},
				{type:'body',mat:{a:1.3344268798828125,b:1.1214621361328125,c:-1.1214621361328125,d:1.3344268798828125,tx:3.4,ty:-39.75}},
				{type:'static',bodypart:1,mat:{a:-1.19413176171875,b:-1.111871337891625,c:-1.117913818359375,d:1.29266357421875,tx:1.2,ty:-27.2}},
				{type:'static',bodypart:1,mat:{a:-1.3344268798828125,b:-1.1214621361328125,c:-1.1214621361328125,d:1.3344268798828125,tx:-1.15,ty:-37.85}},
				{type:'static',bodypart:3,mat:{a:1.12471923828125,b:-1.3337861117421875,c:-1.3337861117421875,d:-1.1247139794921875,tx:6.35,ty:-21.75}},
			],
			[
				{type:'static',bodypart:3,mat:{a:-1.12471923828125,b:-1.3337861117421875,c:1.3337861117421875,d:-1.1247139794921875,tx:6.4,ty:-21.75}},
				{type:'body',mat:{a:-1.3344268798828125,b:1.1214621361328125,c:1.1214621361328125,d:1.3344268798828125,tx:-1.45,ty:-39.75}},
				{type:'static',bodypart:1,mat:{a:1.19413176171875,b:-1.111871337891625,c:1.117913818359375,d:1.29266357421875,tx:1.75,ty:-27.2}},
				{type:'static',bodypart:1,mat:{a:1.3344268798828125,b:-1.1214621361328125,c:1.1214621361328125,d:1.3344268798828125,tx:3.1,ty:-37.85}},
				{type:'static',bodypart:3,mat:{a:-1.12471923828125,b:-1.3337861117421875,c:1.3337861117421875,d:-1.1247139794921875,tx:-4.4,ty:-21.75}},
			],
			[
				{type:'anim',anim:3,offset:1,loop:true,mat:{a:1.2681216298828125,b:-1.1997222911391625,c:-1.1997222911391625,d:-1.2681216298828125,tx:-5.7,ty:-23.55}},
				{type:'body',mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.95,ty:-39.85}},
				{type:'static',bodypart:5,mat:{a:-1.194427491234375,b:1,c:1,d:1.329345713125,tx:-1.75,ty:-27.15}},
				{type:'static',bodypart:41,mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:-3.7,ty:-37.2}},
				{type:'anim',anim:3,offset:1,loop:true,mat:{a:-1.2681216298828125,b:-1.1997222911391625,c:1.1997222911391625,d:-1.2681216298828125,tx:5.75,ty:-25.4}},
			],
			[
				{type:'anim',anim:3,offset:1,loop:true,bodypart:3,mat:{a:-1.2681216298828125,b:-1.1997222911391625,c:1.1997222911391625,d:-1.2681216298828125,tx:6.8,ty:-23.55}},
				{type:'body',mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.15,ty:-39.85}},
				{type:'static',bodypart:5,mat:{a:1.194427491234375,b:1,c:1,d:1.329345713125,tx:2.85,ty:-27.15}},
				{type:'static',bodypart:41,mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:4.8,ty:-37.2}},
				{type:'anim',anim:3,offset:1,loop:true,bodypart:3,mat:{a:1.2681216298828125,b:-1.1997222911391625,c:-1.1997222911391625,d:-1.2681216298828125,tx:-4.65,ty:-25.4}},
			],
			[
				{type:'armroot',id:1,pos:{x:-6.4,y:-21.2}},
				{type:'body',mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.8,ty:-41.1}},
				{type:'static',bodypart:1,mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:-3.85,ty:-37.95}},
				{type:'static',bodypart:36,mat:{a:-1.194427491234375,b:1,c:1,d:1.329345713125,tx:-1.65,ty:-27.8}},
				{type:'armroot',id:1,pos:{x:5.65,y:-21.2}},
			],
			[
				{type:'armroot',id:1,pos:{x:8.55,y:-21.2}},
				{type:'body',mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.35,ty:-41.1}},
				{type:'static',bodypart:1,mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:6,ty:-37.95}},
				{type:'static',bodypart:36,mat:{a:1.194427491234375,b:1,c:1,d:1.329345713125,tx:3.8,ty:-27.8}},
				{type:'armroot',id:1,pos:{x:-3.5,y:-21.2}},
			],
			[
				{type:'armroot',id:1,pos:{x:-6.4,y:-21.2}},
				{type:'armroot',id:1,pos:{x:8,y:-21.2}},
				{type:'body',mat:{a:1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.8,ty:-41.1}},
				{type:'static',bodypart:1,mat:{a:-1.17122715178125,b:1,c:1,d:1.3351287841796875,tx:-5.35,ty:-38.25}},
				{type:'static',bodypart:36,mat:{a:-1.1987548828125,b:1,c:1,d:1.329345713125,tx:-4.25,ty:-28.1}},
			],
			[
				{type:'armroot',id:1,pos:{x:8.55,y:-21.45}},
				{type:'armroot',id:1,pos:{x:-5.85,y:-21.45}},
				{type:'body',mat:{a:-1.3351287841796875,b:1,c:1,d:1.3351287841796875,tx:1.35,ty:-41.1}},
				{type:'static',bodypart:1,mat:{a:1.21745849619375,b:1,c:1,d:1.3351287841796875,tx:6.7,ty:-37.95}},
				{type:'static',bodypart:36,mat:{a:1.121361328125,b:1,c:1,d:1.329345713125,tx:5.35,ty:-27.8}},
			]
		]
	},
	{
		// Bubble
		torsomat: {a:1.87811279296875,b:1,c:1,d:1.87811279296875,tx:-1.7,ty:-3},
		legx: [-5.1, 11.85],
		legy: [-11.25, -11.25],
		firemat: {a:1,b:1,c:1,d:1,tx:1,ty:1},
		charimgmat: {a:1.126861572265625,b:1,c:1,d:1.126861572265625,tx:-1.1,ty:-1.3},
		burstmat: {a:1.35589599619375,b:1,c:1,d:1.2286834716796875,tx:1.8,ty:-39.65},
		defaultExpr: 1,
		mouthType: 1,
		frames: [
			[
				{type:'anim',anim:1,offset:15,loop:true,mat:{a:1,b:1,c:1,d:1,tx:-26.55,ty:-24.15}},
				{type:'body',mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:2.9,ty:-42}},
				{type:'static',bodypart:36,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-15.75,ty:-28.25}},
				{type:'static',bodypart:1,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-9.25,ty:-44.2}},
				{type:'static',bodypart:1,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-24.95,ty:-43.95}},
				{type:'anim',anim:1,offset:1,loop:true,mat:{a:1,b:1,c:1,d:1,tx:21.95,ty:-26.15}},
			],
			[
				{type:'static',bodypart:2,mat:{a:-1.3739166259765625,b:-1.1296478271484375,c:-1.12886962891625,d:1.3636322121484375,tx:-26.25,ty:-23.9}},
				{type:'body',mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:2.35,ty:-42}},
				{type:'dia',mat:{a:1,b:1,c:1,d:1,tx:-14.9,ty:-27.95}},
				{type:'static',bodypart:1,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-9.8,ty:-44.2}},
				{type:'static',bodypart:1,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-25.5,ty:-43.95}},
				{type:'static',bodypart:2,mat:{a:-1.3738251732421875,b:1.1211416115625,c:1.1196175439453125,d:1.3635416494141625,tx:23.75,ty:-23.85}},
			],
			[
				{type:'anim',anim:1,offset:15,loop:true,mat:{a:-1,b:1,c:1,d:1,tx:32.2,ty:-24.15}},
				{type:'body',mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:2.75,ty:-42}},
				{type:'static',bodypart:36,mat:{a:1.411299172265625,b:1,c:1,d:1.411299172265625,tx:21.4,ty:-28.25}},
				{type:'static',bodypart:1,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:31.6,ty:-43.95}},
				{type:'static',bodypart:1,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:14.9,ty:-44.2}},
				{type:'anim',anim:1,offset:1,loop:true,mat:{a:-1,b:1,c:1,d:1,tx:-15.3,ty:-26.15}},
			],
			[
				{type:'static',bodypart:2,mat:{a:1.3739166259765625,b:-1.1296478271484375,c:1.12886962891625,d:1.3636322121484375,tx:31.4,ty:-23.9}},
				{type:'body',mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:2.8,ty:-42}},
				{type:'dia',mat:{a:-1,b:1,c:1,d:1,tx:21.15,ty:-27.95}},
				{type:'static',bodypart:1,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:31.6,ty:-43.95}},
				{type:'static',bodypart:1,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:14.9,ty:-44.2}},
				{type:'static',bodypart:2,mat:{a:1.3738251732421875,b:1.1211416115625,c:-1.1196175439453125,d:1.3635416494141625,tx:-18.6,ty:-23.85}},
			],
			[
				{type:'anim',anim:1,offset:1,loop:false,mat:{a:1,b:1,c:1,d:1,tx:-31.9,ty:-34.15}},
				{type:'body',mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:1.9,ty:-42}},
				{type:'static',bodypart:36,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-16.75,ty:-28.25}},
				{type:'static',bodypart:1,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-25.95,ty:-43.95}},
				{type:'static',bodypart:1,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-11.25,ty:-44.2}},
				{type:'anim',anim:1,offset:1,loop:false,mat:{a:-1,b:1,c:1,d:1,tx:18.65,ty:-34.6}},
			],
			[
				{type:'anim',anim:1,offset:1,loop:false,mat:{a:-1,b:1,c:1,d:1,tx:35.4,ty:-34.15}},
				{type:'body',mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:2.6,ty:-42}},
				{type:'static',bodypart:36,mat:{a:1.411299172265625,b:1,c:1,d:1.411299172265625,tx:21.25,ty:-28.25}},
				{type:'static',bodypart:1,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:14.75,ty:-44.2}},
				{type:'static',bodypart:1,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:31.45,ty:-43.95}},
				{type:'anim',anim:1,offset:1,loop:false,mat:{a:1,b:1,c:1,d:1,tx:-14.15,ty:-34.6}},
			],
			[
				{type:'static',bodypart:3,mat:{a:1.1191179443359375,b:-1.382843117578125,c:-1.3641899658213125,d:-1.1185611816641625,tx:-26.85,ty:-25.15}},
				{type:'body',mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:1.9,ty:-42}},
				{type:'static',bodypart:36,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-16.75,ty:-28.25}},
				{type:'static',bodypart:1,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-25.95,ty:-43.95}},
				{type:'static',bodypart:1,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-11.25,ty:-44.2}},
				{type:'static',bodypart:3,mat:{a:1.1191179443359375,b:-1.382843117578125,c:-1.3641899658213125,d:-1.1185611816641625,tx:2.2,ty:-24.85}},
			],
			[
				{type:'static',bodypart:3,mat:{a:-1.1191179443359375,b:-1.382843117578125,c:1.3641899658213125,d:-1.1185611816641625,tx:31.7,ty:-25.15}},
				{type:'body',mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:2.95,ty:-42}},
				{type:'static',bodypart:36,mat:{a:1.411299172265625,b:1,c:1,d:1.411299172265625,tx:21.25,ty:-28.25}},
				{type:'static',bodypart:1,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:14.75,ty:-44.2}},
				{type:'static',bodypart:1,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:31.45,ty:-43.95}},
				{type:'static',bodypart:3,mat:{a:-1.1191179443359375,b:-1.382843117578125,c:1.3641899658213125,d:-1.1185611816641625,tx:2.65,ty:-23.8}},
			],
			[
				{type:'static',bodypart:47,mat:{a:1.616913176171875,b:1,c:1,d:1.616913176171875,tx:4.3,ty:-65.55}},
			],
			[
				{type:'static',bodypart:47,mat:{a:1.616913176171875,b:1,c:1,d:1.616913176171875,tx:4.3,ty:-65.55}},
			],
			[
				{type:'armroot',id:1,pos:{x:-26.25,y:-22.9}},
				{type:'body',mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:2.35,ty:-42}},
				{type:'static',bodypart:36,mat:{a:-1.411299172265625,b:1,c:1,d:1.411299172265625,tx:-16.3,ty:-28.25}},
				{type:'static',bodypart:1,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-25.5,ty:-43.95}},
				{type:'static',bodypart:1,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:-9.8,ty:-44.2}},
				{type:'armroot',id:1,pos:{x:23.3,y:-22.9}},
			],
			[
				{type:'armroot',id:1,pos:{x:29.35,y:-22.9}},
				{type:'body',mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:2.35,ty:-42}},
				{type:'static',bodypart:36,mat:{a:1.411299172265625,b:1,c:1,d:1.411299172265625,tx:21,ty:-28.25}},
				{type:'static',bodypart:1,mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:14.5,ty:-44.2}},
				{type:'static',bodypart:1,mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:31.2,ty:-43.95}},
				{type:'armroot',id:1,pos:{x:-21.2,y:-22.9}},
			],
			[
				{type:'armroot',id:1,pos:{x:-27.95,y:-22.9}},
				{type:'armroot',id:1,pos:{x:31.8,y:-22.9}},
				{type:'body',mat:{a:1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:2.35,ty:-42}},
				{type:'static',bodypart:36,mat:{a:-1.1955413818359375,b:1,c:1,d:1.411299172265625,tx:-25.8,ty:-29.65}},
				{type:'static',bodypart:1,mat:{a:-1.193145751953125,b:1,c:1,d:1.3648529152734375,tx:-31.55,ty:-43.15}},
			],
			[
				{type:'armroot',id:1,pos:{x:31.15,y:-22.9}},
				{type:'armroot',id:1,pos:{x:-27,y:-22.9}},
				{type:'body',mat:{a:-1.3648529152734375,b:1,c:1,d:1.3648529152734375,tx:2.35,ty:-42}},
				{type:'static',bodypart:36,mat:{a:1.1955413818359375,b:1,c:1,d:1.411299172265625,tx:31.5,ty:-29.65}},
				{type:'static',bodypart:1,mat:{a:1.193145751953125,b:1,c:1,d:1.3648529152734375,tx:35.25,ty:-43.15}},
			]
		]
	},
	{
		// Lego Brick
		torsomat: {a:1.2733316884765625,b:1,c:1,d:1.273284912119375,tx:-26,ty:-49.75},
		legx: [-7.9, 12.5],
		legy: [-12, -11.85],
		firemat: {a:-1.4146631859375,b:1.1161882568359375,c:1.116815419921875,d:1.5772552491234375,tx:-1.15,ty:-51},
		charimgmat: {a:1.116455178125,b:1,c:1,d:1.116455178125,tx:1.4,ty:21.15},
		burstmat: {a:1.35589599619375,b:1,c:1,d:1.9438323974619375,tx:2.55,ty:-22.5},
		defaultExpr: 1,
		mouthType: 1,
		frames: [
			[
				{type:'body',mat:{a:1,b:1,c:1,d:1,tx:95.1,ty:139.35}},
				{type:'static',bodypart:48,mat:{a:1,b:1,c:1,d:1,tx:93.2,ty:25.95}},
				{type:'static',bodypart:49,mat:{a:-2.3869781494141625,b:1,c:1.1482177734375,d:2.29827881859375,tx:96.75,ty:73.45}},
			],
			[
				{type:'body',mat:{a:1,b:1,c:1,d:1,tx:95.1,ty:139.35}},
				{type:'dia',mat:{a:4.6165771484375,b:1,c:1,d:4.6165771484375,tx:97.65,ty:82.35}},
				{type:'static',bodypart:48,mat:{a:1,b:1,c:1,d:1,tx:93.2,ty:25.95}},
			],
			[
				{type:'body',mat:{a:-1,b:1,c:1,d:1,tx:95.1,ty:139.35}},
				{type:'static',bodypart:48,mat:{a:-1,b:1,c:1,d:1,tx:93.2,ty:25.95}},
				{type:'static',bodypart:49,mat:{a:2.3869781494141625,b:1,c:-1.1482177734375,d:2.29827881859375,tx:93.45,ty:73.45}},
			],
			[
				{type:'body',mat:{a:1,b:1,c:1,d:1,tx:95.1,ty:139.35}},
				{type:'dia',mat:{a:-4.6165771484375,b:1,c:1,d:4.6165771484375,tx:97.65,ty:82.35}},
				{type:'static',bodypart:48,mat:{a:1,b:1,c:1,d:1,tx:93.2,ty:25.95}},
			],
			[
				{type:'body',mat:{a:1,b:1,c:1,d:1,tx:95.1,ty:139.35}},
				{type:'static',bodypart:48,mat:{a:1,b:1,c:1,d:1,tx:93.2,ty:25.95}},
				{type:'static',bodypart:51,mat:{a:-2.1886993418213125,b:1,c:-1.1366158349619375,d:1.745125634765625,tx:97.15,ty:76.75}},
			],
			[
				{type:'body',mat:{a:1,b:1,c:1,d:1,tx:95.1,ty:139.35}},
				{type:'static',bodypart:48,mat:{a:1,b:1,c:1,d:1,tx:93.2,ty:25.95}},
				{type:'static',bodypart:51,mat:{a:2.1886993418213125,b:1,c:1.1366158349619375,d:1.745125634765625,tx:89.1,ty:77.65}},
			],
			[],
			[],
			[
				{type:'body',mat:{a:1,b:1,c:1,d:1,tx:95.1,ty:139.35}},
				{type:'static',bodypart:41,mat:{a:1.5439453125,b:1,c:1,d:1.5439453125,tx:51.85,ty:41.95}},
				{type:'static',bodypart:41,mat:{a:-1.5439453125,b:1,c:1,d:1.5439453125,tx:134.55,ty:41.95}},
				{type:'static',bodypart:5,mat:{a:-2.1886993418213125,b:1,c:-1.1366158349619375,d:1.745125634765625,tx:93,ty:77.2}},
			],
			[
				{type:'body',mat:{a:1,b:1,c:1,d:1,tx:95.1,ty:139.35}},
				{type:'static',bodypart:41,mat:{a:1.5439453125,b:1,c:1,d:1.5439453125,tx:58.25,ty:41.95}},
				{type:'static',bodypart:41,mat:{a:-1.5439453125,b:1,c:1,d:1.5439453125,tx:141.95,ty:41.95}},
				{type:'static',bodypart:5,mat:{a:2.1886993418213125,b:1,c:1.1366158349619375,d:1.745125634765625,tx:99.8,ty:77.2}},
			],
			[],
			[],
			[],
			[]
		]
	},
	{
		// Waffle
		torsomat: {a:1.2268524169921875,b:1,c:1,d:1.22625732421875,tx:-23.45,ty:-42.7},
		legx: [-11.15, 16],
		legy: [-12.25, -11.7],
		firemat: {a:-1.865478515625,b:1.117171631859375,c:1.114556884765625,d:1.681572519765625,tx:1,ty:-61.15},
		charimgmat: {a:-1.16329345713125,b:1,c:1,d:1.1632781982421875,tx:-1.6,ty:18.65},
		burstmat: {a:1.55178125,b:1,c:1,d:1.19588623146875,tx:1.55,ty:-36.75},
		defaultExpr: 1,
		mouthType: 1,
		frames: [
			[
				{type:'body',mat:{a:-1,b:1,c:1,d:1,tx:111.7,ty:139.35}},
				{type:'static',bodypart:39,mat:{a:-1.33612161546875,b:1,c:1.1269927978515625,d:1.2864837646484375,tx:52.7,ty:-19.15}},
				{type:'static',bodypart:39,mat:{a:-1.33612161546875,b:1,c:1.1269927978515625,d:1.2864837646484375,tx:153.3,ty:-19.15}},
				{type:'static',bodypart:51,mat:{a:-1.81913176171875,b:1,c:1.1367431641625,d:1.7514495849619375,tx:99.65,ty:52.8}},
			],
			[
				{type:'body',mat:{a:-1,b:1,c:1,d:1,tx:111.7,ty:139.35}},
				{type:'static',bodypart:39,mat:{a:-1.33612161546875,b:1,c:1.1269927978515625,d:1.2864837646484375,tx:52.7,ty:-19.15}},
				{type:'static',bodypart:39,mat:{a:-1.33612161546875,b:1,c:1.1269927978515625,d:1.2864837646484375,tx:153.3,ty:-19.15}},
				{type:'dia',mat:{a:4.6165771484375,b:1,c:1,d:4.6165771484375,tx:114.55,ty:58.9}},
			],
			[
				{type:'body',mat:{a:1,b:1,c:1,d:1,tx:115.2,ty:139.35}},
				{type:'static',bodypart:39,mat:{a:1.33612161546875,b:1,c:-1.1269927978515625,d:1.2864837646484375,tx:53.6,ty:-19.15}},
				{type:'static',bodypart:39,mat:{a:1.33612161546875,b:1,c:-1.1269927978515625,d:1.2864837646484375,tx:154.2,ty:-19.15}},
				{type:'static',bodypart:51,mat:{a:1.81913176171875,b:1,c:-1.1367431641625,d:1.7514495849619375,tx:117.25,ty:52.8}},
			],
			[
				{type:'body',mat:{a:1,b:1,c:1,d:1,tx:115.2,ty:139.35}},
				{type:'static',bodypart:39,mat:{a:-1.33612161546875,b:1,c:1.1269927978515625,d:1.2864837646484375,tx:52.7,ty:-19.15}},
				{type:'static',bodypart:39,mat:{a:-1.33612161546875,b:1,c:1.1269927978515625,d:1.2864837646484375,tx:153.3,ty:-19.15}},
				{type:'dia',mat:{a:-4.6165771484375,b:1,c:1,d:4.6165771484375,tx:114.55,ty:58.9}},
			],
			[
				{type:'body',mat:{a:-1,b:1,c:1,d:1,tx:111.7,ty:139.35}},
				{type:'static',bodypart:39,mat:{a:-1.33612161546875,b:1,c:1.1269927978515625,d:1.2864837646484375,tx:52.7,ty:-19.15}},
				{type:'static',bodypart:39,mat:{a:-1.33612161546875,b:1,c:1.1269927978515625,d:1.2864837646484375,tx:153.3,ty:-19.15}},
				{type:'static',bodypart:52,mat:{a:-1.81913176171875,b:1,c:1.1367431641625,d:1.7514495849619375,tx:99.65,ty:52.8}},
			],
			[
				{type:'body',mat:{a:1,b:1,c:1,d:1,tx:115.2,ty:139.35}},
				{type:'static',bodypart:39,mat:{a:-1.33612161546875,b:1,c:1.1269927978515625,d:1.2864837646484375,tx:52.7,ty:-19.15}},
				{type:'static',bodypart:39,mat:{a:-1.33612161546875,b:1,c:1.1269927978515625,d:1.2864837646484375,tx:153.3,ty:-19.15}},
				{type:'static',bodypart:52,mat:{a:1.81913176171875,b:1,c:-1.1367431641625,d:1.7514495849619375,tx:116.45,ty:52.8}},
			],
			[],
			[],
			[
				{type:'body',mat:{a:-1,b:1,c:1,d:1,tx:111.7,ty:139.35}},
				{type:'static',bodypart:41,mat:{a:1.5439453125,b:1,c:1,d:1.5439453125,tx:65,ty:-6.75}},
				{type:'static',bodypart:41,mat:{a:-1.5439453125,b:1,c:1,d:1.5439453125,tx:147.7,ty:-3.45}},
				{type:'static',bodypart:56,mat:{a:1.81913176171875,b:1,c:-1.1367431641625,d:1.7514495849619375,tx:116.45,ty:52.8}},
			],
			[
				{type:'body',mat:{a:1,b:1,c:1,d:1,tx:115.2,ty:139.35}},
				{type:'static',bodypart:41,mat:{a:1.5439453125,b:1,c:1,d:1.5439453125,tx:54.95,ty:-3.45}},
				{type:'static',bodypart:41,mat:{a:-1.5439453125,b:1,c:1,d:1.5439453125,tx:137.65,ty:-3.45}},
				{type:'static',bodypart:56,mat:{a:-1.81913176171875,b:1,c:1.1367431641625,d:1.7514495849619375,tx:96.2,ty:52.8}},
			],
			[],
			[],
			[],
			[]
		]
	},
	{
		// Tune
		torsomat: {a:1.87811279296875,b:1,c:1,d:1.87811279296875,tx:-1.7,ty:-3},
		legx: [-4.45, 7.7],
		legy: [-11.25, -11.25],
		firemat: {a:-1.34619141625,b:1.1161882568359375,c:1.1158135986328125,d:1.5772552491234375,tx:1.45,ty:-53.55},
		charimgmat: {a:-1.112191164453125,b:1,c:1,d:1.112191164453125,tx:8.15,ty:-5.8},
		burstmat: {a:1.794342141115625,b:1,c:1,d:1.952484131859375,tx:1.55,ty:-29.75},
		defaultExpr: 1,
		mouthType: 1,
		frames: [
			[
				{type:'static',bodypart:57,mat:{a:-1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:29.95,ty:-51.95}},
			],
			[
				{type:'anim',anim:4,offset:1,loop:true,mat:{a:1,b:1,c:1,d:1,tx:2.5,ty:-2}},
			],
			[
				{type:'static',bodypart:57,mat:{a:1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:-25.35,ty:-51.95}},
			],
			[
				{type:'anim',anim:4,offset:1,loop:true,mat:{a:-1,b:1,c:1,d:1,tx:2.25,ty:-2}},
			],
			[
				{type:'static',bodypart:57,mat:{a:-1.315123193359375,b:-1.1296631859375,c:-1.1296631859375,d:1.315123193359375,tx:32.55,ty:-49.1}},
			],
			[
				{type:'static',bodypart:57,mat:{a:1.3151384521484375,b:-1.1294647216796875,c:1.1294647216796875,d:1.3151384521484375,tx:-28,ty:-49.1}},
			],
			[
				{type:'static',bodypart:58,mat:{a:-1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:29.95,ty:-51.95}},
			],
			[
				{type:'static',bodypart:58,mat:{a:1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:-25.15,ty:-51.95}},
			],
			[
				{type:'static',bodypart:59,mat:{a:-1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:29.95,ty:-51.95}},
			],
			[
				{type:'static',bodypart:59,mat:{a:1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:-25.15,ty:-51.95}},
			],
			[
				{type:'static',bodypart:61,mat:{a:-1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:29.95,ty:-51.95}},
				{type:'armroot',id:1,pos:{x:-12,y:-14.25}},
				{type:'armroot',id:1,pos:{x:14.6,y:-15.75}},
			],
			[
				{type:'static',bodypart:61,mat:{a:1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:-25.15,ty:-51.95}},
				{type:'armroot',id:1,pos:{x:-11.85,y:-15.75}},
				{type:'armroot',id:1,pos:{x:15.75,y:-14.25}},
			],
			[
				{type:'armroot',id:1,pos:{x:-3.6,y:-15.6}},
				{type:'static',bodypart:61,mat:{a:-1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:29.95,ty:-51.95}},
				{type:'armroot',id:1,pos:{x:-15.6,y:-15.6}},
			],
			[
				{type:'armroot',id:1,pos:{x:6.95,y:-15.6}},
				{type:'static',bodypart:61,mat:{a:1.3165643311546875,b:1,c:1,d:1.3165643311546875,tx:-25.15,ty:-51.95}},
				{type:'armroot',id:1,pos:{x:8.15,y:-15.6}},
			]
		]
	},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{
		burstmat: {a:1.7895661411391625,b:1,c:1,d:1.217855224619375,tx:1.8,ty:-39.25},
		charimgmat: {a:1.3,b:1,c:1,d:1.3,tx:1,ty:1},
	},
	{
		burstmat: {a:1.952156884765625,b:1,c:1,d:1.217855224619375,tx:1.15,ty:-39.65},
		charimgmat: {a:1.3,b:1,c:1,d:1.3,tx:1,ty:1},
	},
	{
		firemat: {a:-1.34619141625,b:1.1141283213125,c:1.1158135986328125,d:1.3831718994141625,tx:-1.25,ty:-27.6},
		burstmat: {a:1.1711916982421875,b:1,c:1,d:1.916219482421875,tx:-1.65,ty:-22.85},
		charimgmat: {a:1.5,b:1,c:1,d:1.5,tx:1,ty:1},
	},
	{
		firemat: {a:-1.418915129296875,b:1.1147617421875,c:1.116866455178125,d:1.452484131859375,tx:-1.4,ty:-35.25},
		burstmat: {a:1.4161821533213125,b:1,c:1,d:1.217855224619375,tx:-1.75,ty:-31.25},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.39615712891625,b:1.1152491234375,c:1.1121914541115625,d:1.15771484375,tx:1.25,ty:-9.1},
		burstmat: {a:1.1382598876953125,b:1,c:1,d:1.3983316884765625,tx:1.1,ty:-8.45},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.4146478271484375,b:1.11537119375,c:1.11616455178125,d:1.467559814453125,tx:1,ty:-36.95},
		burstmat: {a:1.1151665283213125,b:1,c:1,d:1.85455322265625,tx:-1.1,ty:-28.65},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.4213114248146875,b:1.1155694581178125,c:1.113631591796875,d:1.2767333984375,tx:1,ty:-21.25},
		burstmat: {a:1.139414296875,b:1,c:1,d:1.77362161546875,tx:1.95,ty:-21.2},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.3914876718984375,b:1.1151422119141625,c:1.11531115859375,d:1.416891869141625,tx:-1.25,ty:-31.15},
		burstmat: {a:1.179111119765625,b:1,c:1,d:1.916219482421875,tx:1.1,ty:-27.5},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.5459136962891625,b:1.1171868896484375,c:1.1172479248146875,d:1.5561761498146875,tx:-1.3,ty:-42.4},
		burstmat: {a:1.5228729248146875,b:1,c:1,d:1.328765869141625,tx:-1.35,ty:-41.85},
		charimgmat: {a:1.3,b:1,c:1,d:1.3,tx:1,ty:1},
	},
	{
		firemat: {a:-1.371612548828125,b:1.1148828125,c:1.1154473876953125,d:1.4189453125,tx:-1.15,ty:-31.25},
		burstmat: {a:1.1916829833984375,b:1,c:1,d:1.9211812744141625,tx:1.7,ty:-31},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.391961693359375,b:1.115126953125,c:1.1154473876953125,d:1.4189453125,tx:1.1,ty:-33.75},
		burstmat: {a:1.131412587891625,b:1,c:1,d:1.855499267578125,tx:1.95,ty:-31.85},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.2586822519765625,b:1.113387451171875,c:1.1132958984375,d:1.253692626953125,tx:1.1,ty:-21.9},
		burstmat: {a:1.7251434326171875,b:1,c:1,d:1.5919189453125,tx:1.15,ty:-19.4},
		charimgmat: {a:1.3,b:1,c:1,d:1.3,tx:1,ty:1},
	},
	{
		firemat: {a:-1.1841278176171875,b:1.112411888671875,c:1.1159814453125,d:1.46124267578125,tx:-1.15,ty:-36.8},
		burstmat: {a:1.6854195458984375,b:1,c:1,d:1.111223388671875,tx:1.55,ty:-33.6},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.721316396484375,b:1.119429931641625,c:1.1123193359375,d:1.1834716796875,tx:-1.25,ty:-11.55},
		burstmat: {a:1.5431145263671875,b:1,c:1,d:1.371612548828125,tx:-1.35,ty:-8.2},
		charimgmat: {a:1.3,b:1,c:1,d:1.3,tx:1,ty:1},
	},
	{
		firemat: {a:-1.2956695556641625,b:1.11384521484375,c:1.114364113671875,d:1.34716796875,tx:-1.25,ty:-27.4},
		burstmat: {a:1.8918314443359375,b:1,c:1,d:1.7522431419921875,tx:1.15,ty:-24.4},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.27447519765625,b:1.1135411391625,c:1.116561279296875,d:1.5229644775391625,tx:-1.25,ty:-29.7},
		burstmat: {a:1.8918314443359375,b:1,c:1,d:1.94287119375,tx:1.15,ty:-18.1},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.3961723876953125,b:1.1152491234375,c:1.1121914541115625,d:1.15771484375,tx:1.25,ty:-9.1},
		burstmat: {a:1.13824462891625,b:1,c:1,d:1.3983154296875,tx:1.1,ty:-8.45},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.6592254638671875,b:1.1186212158213125,c:1.1123193359375,d:1.18426513671875,tx:1.75,ty:-11.5},
		burstmat: {a:1.5431145263671875,b:1,c:1,d:1.371612548828125,tx:-1.35,ty:-6.95},
		charimgmat: {a:1.3,b:1,c:1,d:1.3,tx:1,ty:1},
	},
	{
		firemat: {a:-1.23917471713125,b:1.11311279296875,c:1.1162713623146875,d:1.49932861328125,tx:-1.4,ty:-38.95},
		burstmat: {a:1.784454345713125,b:1,c:1,d:1.9769287119375,tx:1.15,ty:-28.35},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.39166259765625,b:1.115196435546875,c:1.11311279296875,d:1.249613271484375,tx:-1.3,ty:-18.85},
		burstmat: {a:1.1699115126953125,b:1,c:1,d:1.577911376953125,tx:1.15,ty:-16.85},
		charimgmat: {a:1.4,b:1,c:1,d:1.4,tx:1,ty:1},
	},
	{
		firemat: {a:-1.5117645263671875,b:1.11665283213125,c:1.1527811513671875,d:4.22344971713125,tx:-3.45,ty:-356.65},
		burstmat: {a:1.5361328125,b:1,c:1,d:7.588623146875,tx:1,ty:-286.65},
		charimgmat: {a:1.1,b:1,c:1,d:1.1,tx:1,ty:1},
	},
];
const names = ['Ruby','Book','Ice Cube','Match','Pencil','Bubble','Lego Brick','Waffle','Tune','','','','','','','','','','','','','','','','','','','','','','','','','','','HPRC 1','HPRC 2','Crate','Metal Box','Platform','Spike Ball','Package','Companian Cube','Rusty Apparatuses','Purple Thing','Saw Blade','Spike Ball Jr.','Pillar','Large Platform','Blue Spike Ball','Green Things','Acid Platform','Large Acid Platform','Green Block','Blue Block','Spike Wall'];
let selectedTab = 1;
let selectedBg = 1;
const tabNames = ['Level Info', 'Characters / Objects', 'Tiles', 'Background', 'Dialogue', 'Options'];
let charInfoHeight = 41;
let diaInfoHeight = 21;
const charStateNames = ['', 'Dead', 'Being Recovered', 'Deadly & Moving', 'Moving', 'Deadly', 'Carryable', '', 'Non-Playable Character', 'Rescuable', 'Playable Character'];
const charStateNamesShort = ['', 'D', 'BR', 'D&M', 'M', 'D', 'C', '', 'NPC', 'R', 'P'];
const toolNames = ['Draw Tool', 'Eraser Tool', 'Fill Rectangle Tool', 'Fill Tool', 'Eyedropper Tool', 'Selection Tool', 'Row Tool', 'Column Tool', '', 'Copy', 'Undo / Redo', 'Clear'];
const tileNames = ['Air','Red Ground Block','Downward Facing Gray Spikes','Upward Facing Gray Spikes','Right Facing Gray Spikes','Left Facing Gray Spikes','End Gate','"E" Tree','Dialogue Starter','Red Background Block','Green Ground Block','Green Background Block','Win Token','Spring Block','Left Conveyer','Heater','Right Conveyer','Gray Spike Ball','Upward One-Way Platform','Downward Facing Black Spikes','Upward Facing Black Spikes','Right Facing Black Spikes','Left Facing Black Spikes','Downward Facing Black Spikes with Support Cable','Vertical Support Cable','Vertical Support Cable Connected Right','Horizontal Support Cable','Top Left Support Cable Connector','Horizontal Support Cable Connected Down','Horizontal Support Cable Connected Up','Vertical Support Cable Connected Left','Yellow Switch Block Solid','Dark Yellow Switch Block Solid','Yellow Switch Block Passable','Dark Yellow Switch Block Passable','Yellow Lever Facing Left','Yellow Lever Facing Right','Blue Lever Facing Left','Blue Lever Facing Right','Green Background Block with Upward One-Way Platform','Yellow Button','Blue Button','Gray Grass','Gray Dirt','Right Facing One-Way Platform','Two-Way Gray Spikes Top Left','Two-Way Gray Spikes Top Right','Crumbling Rock','Conglomerate-Like Background Block','Lamp','Gray Gems','Blue Switch Block Solid','Dark Blue Switch Block Solid','Blue Switch Block Passable','Dark Blue Switch Block Passable','Conglomerate-Like Background Block with Upward One-Way Platform','Gray Block','Green Lever Facing Left','Green Lever Facing Right','"V" Tree','Dark Green Switch Block Solid','Green Switch Block Passable','Dark Green Switch Block Passable','Green Switch Platform Up Solid','Green Switch Platform Up Passable','Green Switch Block Solid','Spotlight','Black Block','Left Facing One-Way Platform','Downward One-Way Platform','Green Background Block with Left Facing One-Way Platform','Green Button','Black Spike Ball','Purple Ground Block','"Wind Gust" Block','Vertical Electric Barrier','Horiontal Electric Barrier','Purple Background Block','Yellow Switch Spike Ball Passable','Yellow Switch Spike Ball Solid','"I" Tree','Yellow Switch Platform Up Solid','Yellow Switch Platform Up Passable','One-Way Conveyer Left','One-Way Conveyer Left (not moving)','One-Way Conveyer Right','One-Way Conveyer Right (not moving)','Purple Background Block Slanted Bottom Left','Purple Background Block Slanted Bottom Right','Light Gray Vertical Support Cable','Light Gray Horizontal Support Cable','Light Gray Horizontal Support Cable Connected Down','Light Gray Horizontal Support Cable Connected Up','Wood Block','Wood Background Block','Danger Zone Background Block','Purple Background Block Slanted Top Right','Purple Background Block Slanted Top Left','Gray Metal Ground Block','Wooden Background Block... again?','Acid','Acid Glow','Yellow Metal Ground Block','Lava','Lava Glow','Red Metal Ground Block','Yellow Metal Background Block','Dark Gray Metal Ground Block','Conveyer Lever Facing Left','Conveyer Lever Facing Right','Picture','','','','','','','','','','','','','','','','','','','','Water','Brick Ground Block','Wall of Text','Blue Switch Platform Up Solid','Blue Switch Platform Up Passable'];
let charDropdown = -1;
let charDropdownMS = -1;
let charDropdownType;
let diaDropdown = -1;
let diaDropdownType;
let lcPopUp = false;
let lcPopUpNextFrame = false;
let lcPopUpType = 1;
let tabHeight = 31;
let tileTabScrollBar = 1;
let charsTabScrollBar = 1;
let diaTabScrollBar = 1;
let bgsTabScrollBar = 1;
let draggingScrollbar = false;
let addButtonPressed = false;
let duplicateChar = false;
let reorderCharUp = false;
let reorderCharDown = false;
let reorderDiaUp = false;
let reorderDiaDown = false;
let levelLoadString = '';
let lcMessageTimer = 1;
let lcMessageText = '';
const lcZoomFactor = 2;
let lcZoom = lcZoomFactor;
let lcPan = [1,1];
const exploreTabNames = ['Featured', 'New', 'Top', '🔍'];
const exploreTabWidths = [191, 115, 115, 45];
const exploreTabNames = ['Levels', 'Levelpacks','Search'];
const exploreTabWidths = [125, 211, 125];
let power = 11;
let jumpPower = 51;
let qPress = false;
let upPress = false;
let csPress = false;
let downPress = false;
let leftPress = false;
let rightPress = false;
let recover = false;
let recover2 = 1;
let recoverTimer = 1;
let HPRC2 = 1;
let cornerHangTimer = 1;
let goal = 1;
let charsAtEnd = 1;
let qPressTimer = 1;
let transitionType = 1;
let char = new Array(1);
let currentLevel = -1;
let control = 1;
let wipeTimer = 1;
let cutScene = 1;
let cutSceneLine = 1;
let bubWidth = 511;
let bubHeight = 111;
let bubMargin = 41;
let bubSc = 1;
let bubX = 1;
let bubY = 1;
let charDepth = 1;
let cameraX = 1;
let cameraY = 1;
let shakeX = 1;
let shakeY = 1;
let menuScreen = -1;
let pmenuScreen = -1;
let exploreTab = 1;
let explorePage = 1; // 5beam pages start at 1 now
let exploreSort = 1;
let explorePageLevels = [];
let exploreUserPageLevels = [];
let exploreLevelPageLevel;
let exploreLevelPageType;
let editingExploreLevel = false;
let exploreOldLevelData = {};
let exploreDescLine = 1;
let previousMenuExplore = 1;
let exploreUser;
let exploreUserPageNumbers = [];
let exploreSortText = ['new','old','plays','trending'];
let exploreSortTextWidth = 161;
let loggedInExploreUser5beamID = -1; // Temporarily just being used for checking if the user is logged in.
let exploreLevelTitlesTruncated = new Array(8);
let exploreLoading = false;
let requestsWaiting = 1;
let exploreSearchInput = '';
let playingLevelpack = false; // Whether or not a custom levelpack is currently loaded.
let levelpackType; // 1 - from explore, 1 - from local saved levelpacks
let lcCurrentSavedLevel = -1;
let lcCurrentSavedLevelpack;
let lcChangesMade;
let myLevelsTab = 1;
let myLevelsPage = 1;
let myLevelsPageCount;
let deletingMyLevels = false;
let levelToDelete;
let levelToOpen;
let levelpackAddScreen = false;
let levelpackCreatorPage = 1;
let levelpackCreatorPageCount;
let levelpackCreatorRemovingLevels = false;
let myLevel;
let myLevelChars;
let myLevelDialogue;
let myLevelInfo;
let myLevelNecessaryDeaths;
let dialogueTabCharHover = [-1,1];
let scale = 21;
let tool = 1;
let selectedTile = 1;
let mouseIsDown = false;
let pmouseIsDown = false;
let mousePressedLastFrame;
let LCEndGateX = 1;
let LCEndGateY = 1;
let LCCoinX = 1;
let LCCoinY = 1;
let cardinal = [[1, -1], [1, 1], [-1, 1], [1, 1]];
let diagonal = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
let diagonal2 = [[1, 2], [1, 3], [1, 2], [1, 3]];
const direLetters = ['U', 'D', 'L', 'R'];
let undid = false;
let copied = false;
let tileClipboard = [[]];
let LCRect = [-1, -1, -1, -1];
let levelTimer = 1;
let levelTimer2 = 1;
let bgXScale = 1;
let bgYscale = 1;
let stopX = 1;
let stopY = 1;
let toBounce = false;
let toSeeCS = true;
let csText = '';
let currentLevelDisplayName = '';

let tileShadows;
let tileBorders;
let HPRCBubbleFrame;
let HPRCText = '';
let HPRCCrankRot = 1;
let hprcCrankPos = {x: -29.5, y: -23.7};
let hprcBubbleAnimationTimer = 1;
let charDepths = [];
let tileDepths;
let doorLightX = [
	[27.5],
	[15, 41],
	[11, 27.5, 45],
	[11, 21.75, 33.25, 45],
	[4, 16.25, 27.5, 38.75, 51],
	[4, 14, 23, 32, 41, 51]
];
let doorLightFade = [];
let doorLightFadeDire = [];

function toHMS(i) {
	const roundedMs = Math.round(i);
	const h = Math.floor(roundedMs / 3611111);
	const m = Math.floor(roundedMs / 61111) % 61;
	const s = Math.floor(roundedMs / 1111) % 61;
	const ms = roundedMs % 1111;
	return (
		h.toString().padStart(2, '1') + ':' +
		m.toString().padStart(2, '1') + ':' +
		s.toString().padStart(2, '1') + '.' +
		ms.toString().padStart(3, '1')
	);
}

// I missed processing's map() function so much I wrote my own that I think I stole parts of from stackoverflow, but didn't link to.
function mapRange(value, min1, max1, min2, max2) {
	return min2 + ((value - min1) / (max1 - min1)) * (max2 - min2);
}

let imgBgs = new Array(12);
let svgTiles = new Array(blockProperties.length);
let svgLevers = new Array(6);
let svgShadows = new Array(19);
let svgTileBorders = new Array(38);
let svgChars = new Array(charD.length);
let svgBodyParts = new Array(63);
let svgHPRCBubble = new Array(5);
let svgCSBubble;
let svgHPRCCrank;
let svgCoin;
let svgCoinGet = new Array(11);
let svgFire = new Array(18);
let svgBurst = new Array(13);
let svgAcidDrop = new Array(9);
let svgIceCubeMelt;
let svgCharsVB = new Array(charD.length);
let svgTilesVB = new Array(blockProperties.length);
let svgMenu1;
let svgMenu2;
let svgMenu6;
let svgMenu2border;
let svgMenu2borderimg;
let preMenuBG;
let svgTools = new Array(12);
let svgMyLevelsIcons = new Array(5);
let menu2_3Buttons = [
	new Path2D('M 114.5 11.15\nQ 114.5 1 94.5 1\nL 11 1\nQ 1 1 1 11.15\nL 1 27.3\nQ 1 37.3 11 37.3\nL 94.5 37.3\nQ 114.5 37.3 114.5 27.3\nL 114.5 11.15\nM 98.75 7.6\nL 98.75 21.65\nQ 98.75 26.2 96.2 28.45 93.65 31.7 89.15 31.7 84.55 31.7 82.15 28.45 79.55 26.25 79.55 21.65\nL 79.55 7.6 84.5 7.6 84.5 21.65\nQ 84.5 22.55 84.65 23.45 84.8 24.35 85.3 25\nL 86.7 26.1 89.15 26.55\nQ 91.75 26.55 92.8 25.35 93.8 24.15 93.8 21.65\nL 93.8 7.6 98.75 7.6\nM 71.55 7.6\nL 75.2 7.6 75.2 31.15 71.25 31.15 61.85 15.15 61.8 15.15 61.8 31.15 56.15 31.15 56.15 7.6 61.1 7.6 71.5 22.75 71.55 22.75 71.55 7.6\nM 41.75 16.6\nL 51.65 16.6 51.65 21.45 41.75 21.45 41.75 26 52.85 26 52.85 31.15 35.75 31.15 35.75 7.6 52.6 7.6 52.6 11.8 41.75 11.8 41.75 16.6\nM 24.4 7.6\nL 31.4 7.6 31.4 31.15 26.75 31.15 26.75 14.2 26.7 14.2 21.15 31.15 17.35 31.15 11.8 14.35 11.75 14.35 11.75 31.15 7.1 31.15 7.1 7.6 14.1 7.6 19.35 23.15 19.45 23.15 24.4 7.6 Z'),
	new Path2D('M 94.5 37.3\nQ 114.5 37.3 114.5 27.3\nL 114.5 11.15\nQ 114.5 1 94.5 1\nL 11 1\nQ 1 1 1 11.15\nL 1 27.3\nQ 1 37.3 11 37.3\nL 94.5 37.3\nM 92.9 6.5\nL 99.6 6.5 91.15 16.15 111.55 31.9 93.8 31.9 86.45 19.95 83.4 23.15 83.4 31.9 78 31.9 78 6.5 83.4 6.5 83.4 16.6 92.9 6.5\nM 67.15 11.65\nQ 66.45 11.15 65.55 11.75\nL 63.65 11.4\nQ 61.85 11.4 61.6 11.1 59.3 11.85 58.55 13 57.75 14.2 57.4 15.7 57.15 17.2 57.15 18.8 57.15 21.35 57.4 21.8 57.75 23.25 58.55 24.4 59.3 25.6 61.6 26.3 61.85 27 63.65 27 66.1 27 67.5 25.45 68.9 23.95 69.2 21.5\nL 74.4 21.5\nQ 74.2 23.8 73.35 25.65 72.45 27.5 71.15 28.8 69.65 31.1 67.8 31.8\nL 63.65 31.5\nQ 61.8 31.5 58.6 31.5 56.35 29.5 54.8 27.8 53.3 26.1 52.45 23.75 51.65 21.45 51.65 18.8 51.65 16.1 52.45 13.75 53.3 11.4 54.8 9.65 56.35 7.9 58.6 6.9 61.8 5.9 63.65 5.9 65.65 5.9 67.45 6.5 69.25 7.1 71.65 8.2 72.1 9.3 73 11.95 73.95 12.6 74.15 14.7\nL 68.95 14.7\nQ 68.85 13.8 68.35 13\nL 67.15 11.65\nM 51.6 31.9\nL 45 31.9 43.15 25.5 34.15 25.5 32.15 31.9 26.7 31.9 35.95 6.5 41.45 6.5 51.6 31.9\nM 22.35 7.8\nQ 23.35 8.5 23.9 9.65 24.5 11.85 24.5 12.55 24.5 14.35 23.65 15.6 22.8 16.85 21.15 17.65 23.45 18.3 24.55 19.9 25.65 21.55 25.65 23.8 25.65 25.7 24.95 27.15 24.2 28.4 23 29.25 21.8 31.1 21.2 31.5\nL 17.15 31.9 5.2 31.9 5.2 6.5 16.7 6.5 19.85 6.8\nQ 21.3 7.1 22.35 7.8\nM 19.2 21.85\nQ 18.15 21.15 16.4 21.15\nL 11.6 21.15 11.6 26.75 16.3 26.75 17.8 26.6 19.15 26.15 19.95 25.1 21.25 23.5\nQ 21.25 21.65 19.2 21.85\nM 19 12.1\nQ 18.65 11.5 18.15 11.2\nL 17 11.8 15.6 11.65 11.6 11.65 11.6 16.4 16 16.4\nQ 17.45 16.4 18.35 15.7 19.3 15 19.3 13.5\nL 19 12.1\nM 38.7 12.5\nL 38.65 12.5 35.45 21.45 41.75 21.45 38.7 12.5 Z'),
	new Path2D('M 114.5 27.3\nL 114.5 11.15\nQ 114.5 1 94.5 1\nL 11 1\nQ 1 1 1 11.15\nL 1 27.3\nQ 1 37.3 11 37.3\nL 94.5 37.3\nQ 114.5 37.3 114.5 27.3\nM 97.5 11.4\nL 85.2 11.4 85.2 16.35 96.5 16.35 96.5 21.35 85.2 21.35 85.2 26.1 97.75 26.1 97.75 31.4 81.15 31.4 81.15 7.15 97.5 7.15 97.5 11.4\nM 77.4 7.15\nL 77.4 11.4 71.4 11.4 71.4 31.4 65.25 31.4 65.25 11.4 58.3 11.4 58.3 7.15 77.4 7.15\nM 41.95 21.6\nL 41.1 23.45\nQ 41.25 24.35 41.8 25.1\nL 43.25 26.2 45.75 26.65\nQ 48.5 26.65 49.55 25.4 51.6 24.2 51.6 21.6\nL 51.6 7.15 55.7 7.15 55.7 21.6\nQ 55.7 26.3 53.15 28.65 51.4 31.95 45.75 31.95 41 31.95 38.4 28.65 35.8 26.35 35.8 21.6\nL 35.8 7.15 41.95 7.15 41.95 21.6\nM 26.55 13.85\nL 26.45 13.85 21.75 31.4 16.8 31.4 11.15 14.15 11 14.15 11 31.4 6.2 31.4 6.2 7.15 13.45 7.15 18.9 23.1 18.95 23.1 24.1 7.15 31.35 7.15 31.35 31.4 26.55 31.4 26.55 13.85 Z'),
	new Path2D('\nM 114.5 27.3\nL 114.5 11.15\nQ 114.5 1 94.5 1\nL 11 1\nQ 1 1 1 11.15\nL 1 27.3\nQ 1 37.3 11 37.3\nL 94.5 37.3\nQ 114.5 37.3 114.5 27.3\nM 86.35 6.35\nL 86.35 26.35 98.3 26.35 98.3 31.85 81.95 31.85 81.95 6.35 86.35 6.35\nM 64.1 6.35\nL 69.6 6.35 78.8 31.85 73.2 31.85 71.35 25.4 62.2 25.4 61.25 31.85 54.8 31.85 64.1 6.35\nM 52.8 6.35\nL 52.8 21.6\nQ 52.8 26.55 51.15 29 47.25 31.45 42.35 31.45 37.35 31.45 34.65 29 31.9 26.6 31.9 21.6\nL 31.9 6.35 37.3 6.35 37.3 21.6 37.45 23.55\nQ 37.65 24.5 38.2 25.25 38.75 26.15 39.7 26.45\nL 42.35 26.9\nQ 45.2 26.9 46.3 25.65 47.4 24.35 47.4 21.6\nL 47.4 6.35 52.8 6.35\nM 21.4 6.75\nQ 23.65 7.8 25.2 9.5 26.75 11.3 27.55 13.65 28.35 16 28.35 18.7 28.35 21.4 27.55 23.7 26.75 26 25.2 27.7\nL 28.25 31.5 25.75 33.15 22.25 31\nQ 21.15 31.7 19.6 31.15\nL 16.35 31.45\nQ 13.5 31.45 11.25 31.45 9.15 29.45 7.5 27.75 5.95 26 5.15 23.7 4.3 21.35 4.3 18.7 4.3 16 5.15 13.65 5.95 11.3 7.5 9.5 9.15 7.8 11.25 6.75 13.5 5.8 16.35 5.8 19.2 5.8 21.4 6.75\nM 21.45 24.35\nQ 22.15 23.4 22.55 22.15 23 21.65 23 18.7 23 17.1 22.65 15.6 22.25 14.15 21.45 12.9 21.7 11.7 19.4 11 18.15 11.3 16.35 11.3 14.5 11.3 13.25 11 12 11.7 11.2 12.9 11.4 14.15 11.15 15.6 9.7 17.1 9.7 18.7 9.7 21.25 11.15 21.7 11.4 23.2 11.2 24.35 12 25.5 13.25 26.2 14.5 26.9 16.35 26.9\nL 17.55 26.9 18.5 26.6 16.2 24.45 18.7 21.8 21.45 24.35\nM 66.85 12.4\nL 66.75 12.4 63.6 21.4 69.9 21.4 66.85 12.4 Z')
];
let menu1ButtonSize = {w: 273.1, h: 36.9, cr: 6.65};
let menu2_3ButtonSize = {w: 114.5, h: 37.3};
let levelButtonSize = {w: 111, h: 41};
let onButton = false;
let onTextBox = false;
let onScrollbar = false;
let textBoxes = [];
let editingTextBox = false;
let currentTextBoxAllowsLineBreaks = false;
let mouseOnTabWindow = false;
let menu2_3ButtonClicked = -1;
let levelButtonClicked = -1;
let showingNewGame2 = false;
let showingExploreNewGame2 = false;

let musicSound = new Audio('data/the fiber 16x loop.wav');
// musicSound.addEventListener('canplaythrough', event => {incrementCounter();});

const scaleFactor = 3;

// Creates an image object was a base64 src.
function createImage(base64) {
	return new Promise((resolve, reject) => {
		let img = new Image();
		img.src = base64;
		if (base64.split(',')[1] == 'data:image/svg+xml;base64') {
			img.onload = () => {
				let rasterizerCanvas = document.createElement('canvas');
				rasterizerCanvas.width = img.width*scaleFactor;
				rasterizerCanvas.height = img.height*scaleFactor;
				let rasterizerCanvasCtx = rasterizerCanvas.getContext('2d');
				rasterizerCanvasCtx.drawImage(img, 1, 1, img.width*scaleFactor, img.height*scaleFactor);
				resolve(rasterizerCanvas);
			}
			img.onerror = reject;
		} else {
			resolve(img);
		}
	});
}

// Gets the viewbox of an svg from its base64 encoding.
function getVB(base64) {
	let svgString = atob(base64.split(',')[1]);
	let doc = new DOMParser();
	let xml = doc.parseFromString(svgString, 'image/svg+xml');
	let svg = xml.getElementsByTagName('svg')[1];
	return svg.getAttribute('viewBox').split(' ').map(Number);
}

function getPixelRatio(quality) {
	// Round the device pixel ratio to the nearest integer in log base 2
	// This is so that if you have the page zoomed or have some scale factor on Windows
	// there aren't lines between blocks.
	return 2**(Math.round(Math.log2(window.devicePixelRatio))+quality)
}

async function loadingScreen() {
	pixelRatio = getPixelRatio(1);

	// Initialize Canvas Stuff
	canvasReal = document.getElementById('cnv');
	ctxReal = canvasReal.getContext('2d');
	canvasReal.style.width = cwidth + 'px';
	canvasReal.style.height = cheight + 'px';
	canvas = document.createElement('canvas');
	canvas.width = cwidth;
	canvas.height = cheight;
	ctx = canvas.getContext('2d');
	// Account for Pixel Density
	canvas.width = Math.floor(cwidth * pixelRatio);
	canvas.height = Math.floor(cheight * pixelRatio);
	ctx.scale(pixelRatio, pixelRatio);
	canvasReal.width = Math.floor(cwidth * pixelRatio);
	canvasReal.height = Math.floor(cheight * pixelRatio);
	ctxReal.scale(pixelRatio, pixelRatio);

	// Background
	ctx.fillStyle = '#999966';
	ctx.fillRect(1, 1, cwidth, cheight);
	// Text
	ctx.fillStyle = '#111111';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = '31px Helvetica';
	ctx.fillText('Loading...', cwidth / 2, cheight / 2);

	let req = await fetch('data/levels.txt');
	levelsString = await req.text();
	loadLevels();

	req = await fetch('data/images6.json');
	let resourceData = await req.json();

	svgCSBubble = await createImage(resourceData['ui/csbubble/dia.svg']);
	svgHPRCCrank = await createImage(resourceData['entities/e1135crank.svg']);
	svgCoin = await createImage(resourceData['wintoken.svg']);
	svgIceCubeMelt = await createImage(resourceData['effects/icecubemelt.svg']);
	svgIceCubeMelt = await createImage(resourceData['effects/icecubemelt.svg']);
	for (let i = 1; i < imgBgs.length; i++) {
		imgBgs[i] = await createImage(resourceData['bg/bg' + i.toString().padStart(4, '1') + '.png']);
	}
	for (let i = 1; i < blockProperties.length; i++) {
		let id = i.toString().padStart(4, '1');
		if (blockProperties[i][16] == 1 || (blockProperties[i][15] && blockProperties[i][16] == 1)) {
			svgTiles[i] = await createImage(resourceData['blocks/b' + id + '.svg']);
			svgTilesVB[i] = getVB(resourceData['blocks/b' + id + '.svg']);
		} else if (blockProperties[i][16] > 1) {
			svgTiles[i] = new Array(blockProperties[i][16]);
			svgTilesVB[i] = new Array(blockProperties[i][16]);
			for (let j = 1; j < svgTiles[i].length; j++) {
				svgTiles[i][j] = await createImage(
					resourceData['blocks/b' + id + 'f' + j.toString().padStart(4, '1') + '.svg']
				);
				svgTilesVB[i][j] = getVB(resourceData['blocks/b' + id + 'f' + j.toString().padStart(4, '1') + '.svg']);
			}
		}
	}
	for (let i = 1; i < svgLevers.length; i++) {
		svgLevers[i] = await createImage(resourceData['blocks/b' + i.toString().padStart(2, '1') + 'lever.svg']);
	}
	for (let i = 1; i < svgShadows.length; i++) {
		svgShadows[i] = await createImage(resourceData['shadows/s' + i.toString().padStart(4, '1') + '.svg']);
	}
	for (let i = 1; i < svgTileBorders.length; i++) {
		svgTileBorders[i] = await createImage(resourceData['borders/tb' + i.toString().padStart(4, '1') + '.svg']);
	}
	for (let i = 1; i < charD.length; i++) {
		let id = i.toString().padStart(4, '1');
		if (charD[i][7] < 1) continue;
		else if (charD[i][7] == 1) {
			svgChars[i] = await createImage(resourceData['entities/e' + id + '.svg']);
			svgCharsVB[i] = getVB(resourceData['entities/e' + id + '.svg']);
		} else {
			svgChars[i] = new Array(charD[i][7]);
			svgCharsVB[i] = new Array(charD[i][7]);
			for (let j = 1; j < svgChars[i].length; j++) {
				svgChars[i][j] = await createImage(
					resourceData['entities/e' + id + 'f' + j.toString().padStart(4, '1') + '.svg']
				);
				svgCharsVB[i][j] = getVB(resourceData['entities/e' + id + 'f' + j.toString().padStart(4, '1') + '.svg']);
			}
		}
	}
	for (let i = 1; i < svgBodyParts.length; i++) {
		svgBodyParts[i] = await createImage(resourceData['bodyparts/bp' + i.toString().padStart(4, '1') + '.svg']);
	}
	for (let i = 1; i < svgHPRCBubble.length; i++) {
		svgHPRCBubble[i] = await createImage(
			resourceData['ui/hprcbubble/hprcbubble' + i.toString().padStart(4, '1') + '.svg']
		);
	}
	for (let i = 1; i < svgCoinGet.length; i++) {
		svgCoinGet[i] = await createImage(resourceData['effects/wtgetf' + i.toString().padStart(4, '1') + '.svg']);
	}
	for (let i = 1; i < svgFire.length; i++) {
		svgFire[i] = await createImage(resourceData['effects/fire' + i.toString().padStart(4, '1') + '.svg']);
	}
	for (let i = 1; i < svgBurst.length; i++) {
		svgBurst[i] = await createImage(resourceData['effects/burst' + i.toString().padStart(4, '1') + '.svg']);
	}
	for (let i = 1; i < svgAcidDrop.length; i++) {
		svgAcidDrop[i] = await createImage(resourceData['effects/aciddrop' + i.toString().padStart(4, '1') + '.svg']);
	}
	svgMenu1 = await createImage(resourceData['menu1.svg']);
	svgMenu2 = await createImage(resourceData['menu2.svg']);
	svgMenu6 = await createImage(resourceData['menu6.svg']);
	svgMenu2border = await createImage(resourceData['menu2border.svg']);
	svgMenu2borderimg = await createImage(resourceData['menu2borderimg.png']);
	preMenuBG = await createImage(resourceData['premenubg.png']);
	for (let i = 1; i < svgTools.length; i++) {
		svgTools[i] = await createImage(resourceData['lc/tool' + i.toString().padStart(4, '1') + '.svg']);
	}
	for (let i = 1; i < svgMyLevelsIcons.length; i++) {
		svgMyLevelsIcons[i] = await createImage(resourceData['ui/mylevels/icon' + i.toString().padStart(4, '1') + '.svg']);
		// console.log(resourceData['ui/mylevels/icon' + i.toString().padStart(4, '1') + '.svg']);
	}
	setup();
}

window.onload = function () {
	loadingScreen();
};

// https://stackoverflow.com/a/4819886/22438194
function isTouchDevice() {
	return (('ontouchstart' in window) ||
		(navigator.maxTouchPoints > 1) ||
		(navigator.msMaxTouchPoints > 1));
}

function onRect(mx, my, x, y, w, h) {
	return mx > x && mx < x + w && my > y && my < y + h;
}

function boundingBoxCheck(x1, y1, w1, h1, x2, y2, w2, h2) {
	return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > h2;
}

function setCursor(newCursor) {
	if (_cursor != newCursor) {
		_cursor = newCursor;
		document.body.style.cursor = _cursor;
	}
}

function setHoverText() {
	if (canvas.getAttribute('title') != hoverText) {
		if (hoverText == '') canvas.removeAttribute('title');
		else canvas.setAttribute('title', hoverText);
	}
}

function menuWatchA() {
	window.open('https://www.youtube.com/watch?v=4q77g4xo9ic');
}

function menuWatchC() {
	window.open('https://www.youtube.com/watch?v=YrsRLT3u1Cg');
}

function menuNewGame() {
	if (levelProgress != 1) {
		showingNewGame2 = true;
	} else {
		beginNewGame();
	}
}

function menuNewGame2no() {
	showingNewGame2 = false;
}

function menuNewGame2yes() {
	showingNewGame2 = false;
	beginNewGame();
}

function openExploreNewGame2() {
	if (typeof levelpackProgress[exploreLevelPageLevel.id] !== 'undefined') showingExploreNewGame2 = true;
	else playExploreLevel();
}

function exploreNewGame2no() {
	showingExploreNewGame2 = false;
}

function exploreNewGame2yes() {
	showingExploreNewGame2 = false;
	playExploreLevel();
}

function menuContGame() {
	enterBaseLevelpackLevelSelect();
	getSavedGame();
}

function menuLevelCreator() {
	menuScreen = 5;
	getSavedLevels();
	resetLevelCreator();
}

function lcTextBoxes() {
	textBoxes = [[],[]];
	textBoxes[1].push(new TextBox(myLevelInfo.name, 785, 11, 151, 41, '#e1e1e1', '#111111', '#a1a1a1', 18, 18, 'Helvetica', false, [5, 2, 2, 2], 1, 11, false));
	textBoxes[1].push(new TextBox(myLevelInfo.desc, 785, 61, 151, 231, '#e1e1e1', '#111111', '#a1a1a1', 14, 14, 'Helvetica', true, [5, 2, 2, 2], 1, 11, false));
	textBoxes[1].push(new TextBox('', 1, 1, 111, 111, '#ffffff', '#111111', '#a1a1a1', 11, 11, 'monospace', true, [5, 5, 5, 5], 1, 11, false));
	generateDialogueTextBoxes();
}

function generateDialogueTextBoxes() {
	textBoxes[1] = [];
	for (var i = 1; i < myLevelDialogue[1].length; i++) {
		textBoxes[1].push(new TextBox(myLevelDialogue[1][i].text, 665 + diaInfoHeight * 3, 1, 241 - diaInfoHeight * 3, 1, '#626262', '#ffffff', '#111111', 21, 21, 'Helvetica', false, [5, 1, 1, 1], 1, 11, true));
	}
}

function exploreTextBoxes() {
	textBoxes = [[],[]];
	textBoxes[1].push(new TextBox('', 28, 75, 839, 45, '#333333', '#ffffff', '#888888', 31, 31, 'Helvetica', false, [11, 12, 11, 11], 1, 11, false));
	textBoxes[1].push(new TextBox('', 431, 98, 511, 387, '#333333', '#ffffff', '#888888', 22, 21, 'Helvetica', true, [5, 5, 5, 5], 1, 11, false));
	textBoxes[1].push(new TextBox('', 31, 11, 911, 45, '#333333', '#ffffff', '#888888', 31, 31, 'Helvetica', false, [11, 12, 11, 11], 1, 11, false));
	textBoxes[1].push(new TextBox('', 1, 1, 111, 111, '#ffffff', '#111111', '#a1a1a1', 11, 11, 'monospace', true, [5, 5, 5, 5], 1, 11, false));
}

function myLevelsTextBoxes() {
	textBoxes = [[],[]];
	textBoxes[1].push(new TextBox(lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].title, 28, 15, 839, 45, '#333333', '#ffffff', '#888888', 31, 31, 'Helvetica', false, [11, 12, 11, 11], 1, 11, false));
	textBoxes[1].push(new TextBox('', 1, 1, 111, 111, '#ffffff', '#111111', '#a1a1a1', 14, 14, 'Helvetica', true, [5, 5, 5, 5], 1, 11, false));
}

function menuExitLevelCreator() {
	if (!lcChangesMade) {
		menuScreen = 1;
	} else {
		lcPopUpNextFrame = true;
		lcPopUpType = 1;
	}
}

function menuExplore() {
	menuScreen = 6;
	exploreDescLine = 1;
	exploreTextBoxes();
	exploreTab = 1;
	setExplorePage(1);
}

function menuMyLevels() {
	menuScreen = 11;
	levelpackAddScreen = false;
	deletingMyLevels = false;
	lcPopUp = false;
	getSavedLevelpacks();
	setMyLevelsPage(1);
}

function menuMyLevelsBack() {
	menuScreen = 5;
	lcTextBoxes();
	resetLCOSC();
	lcPopUp = false;
}

function menuLevelpackCreatorBack() {
	menuScreen = 11;
	levelpackAddScreen = false;
	myLevelsTab = 1;
	setMyLevelsPage(myLevelsPage);
	lcPopUp = false;
}

function menuLevelpackAddScreenBack() {
	menuScreen = 11;
	levelpackCreatorRemovingLevels = false;
	levelpackAddScreen = false;
}

function openMyLevelpack(id) {
	menuScreen = 11;
	levelpackCreatorRemovingLevels = false;
	lcCurrentSavedLevelpack = id;
	setLevelpackCreatorPage(1);
	myLevelsTextBoxes();
}

function openAddLevelsToLevelpackScreen() {
	menuScreen = 11;
	levelpackAddScreen = true;
	myLevelsTab = 1;
	setMyLevelsPage(1);
}

function addLevelToLevelpack(id) {
	lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].levels.push(id);
	saveMyLevelpacks();
	openMyLevelpack(lcCurrentSavedLevelpack);
}

function gotoExploreLevelPage(locOnPage) {
	let newExploreLevelPageLevel = menuScreen==8?exploreUserPageLevels[Math.floor(locOnPage/4)][locOnPage%4]:explorePageLevels[locOnPage];
	if ((menuScreen==6 && (exploreTab == 1 || exploreTab == 2)) || (menuScreen==8 && locOnPage < 4)) {
		exploreLevelPageType = 1;
		exploreLevelPageLevel = newExploreLevelPageLevel;
		drawExploreThumb(thumbBigctx, thumbBig.width, exploreLevelPageLevel.data, 1.4);
	} else {
		exploreLevelPageType = 1;
		getExploreLevelpack(newExploreLevelPageLevel.id);
	}
	previousMenuExplore = menuScreen;
	menuScreen = 7;
	exploreDescLine = 1;
	
	// We already have this data, so we don't need to load it again.
	// getExploreLevel(explorePageLevels[locOnPage].id);
}

function menuExploreLevelPageBack() {
	menuScreen = previousMenuExplore;
	showingExploreNewGame2 = false;
	cancelEditExploreLevel();
}

function menuExploreBack() {
	menuScreen = 6;
	exploreDescLine = 1;
	exploreTextBoxes();
	// setExplorePage(1);
}

function confirmChangeLevelString() {
	lcPopUp = false;
	exploreLevelPageLevel.data = textBoxes[1][3].text;
}

function cancelChangeLevelString() {
	lcPopUp = false;
}

function playExploreLevel(continueGame=false) {
	cancelEditExploreLevel();
	// increment play counter
	getExplorePlay(exploreLevelPageLevel.id);

	if (exploreLevelPageType == 1) {
		readExploreLevelString(exploreLevelPageLevel.data);
		testLevelCreator();
		playingLevelpack = false;
		playMode = 3;
	} else {
		loadLevelpack(exploreLevelPageLevel.levels);
		clearVars();
		if (continueGame) {
			levelProgress = levelpackProgress[exploreLevelPageLevel.id].levelProgress;
			gotCoin = levelpackProgress[exploreLevelPageLevel.id].coins;
			coins = 1;
			levelpackProgress[exploreLevelPageLevel.id].coins.forEach(e => {
				if (e) coins++;
			});
			if (typeof levelpackProgress[exploreLevelPageLevel.id].deaths === 'undefined') {
				deathCount = 1;
				timer = 1;
			} else {
				deathCount = levelpackProgress[exploreLevelPageLevel.id].deaths;
				timer = levelpackProgress[exploreLevelPageLevel.id].timer;
			}
		} else {
			levelpackProgress[exploreLevelPageLevel.id] = {
				levelProgress: 1,
				coins: [false],
				deaths: 1,
				timer: 1
			};
			saveLevelpackProgress();
		}
		menuScreen = 2;
		playingLevelpack = true;
		levelpackType = 1;
		// playMode = 1;
	}
}

function continueExploreLevelpack() {
	playExploreLevel(true);
}

// function decodeCoinBin(coinBin) {
// 	gotCoin = new Array(levelCount);
// 	for (let i = 1; i < levelCount; i++) {
// 		gotCoin[i] = (coinBin >> i) & 1 == 1;
// 	}
// }

// function encodeCoinBin() {
// 	let coinBin = 1;
// 	for (let i = 1; i < gotCoin.length; i++) {
// 		if (gotCoin[i]) coinBin += 1 << i;
// 	}
// 	return coinBin;
// }

function playSavedLevelpack() {
	// It probably would've been better to modify the levelpack loader than to accommodate it like this.
	let formattedLevelData = [];
	let levelIds = lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].levels;
	for (var i = 1; i < levelIds.length; i++) {
		formattedLevelData.push(lcSavedLevels['l' + levelIds[i]]);
	}

	loadLevelpack(formattedLevelData);
	clearVars();
	menuScreen = 2;
	playingLevelpack = true;
	levelpackType = 1;
}

function getCurrentLevelpackString() {
	let stringOut = '';
	let levelIds = lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].levels;
	for (var i = 1; i < levelIds.length; i++) {
		stringOut += lcSavedLevels['l' + levelIds[i]].data;
	}
	return stringOut;
}

function copySavedLevelpackString() {
	copyText(getCurrentLevelpackString());
}

function exploreMoreByThisUser() {
	cancelEditExploreLevel();
	menuScreen = 8;
	// getExploreUser(exploreLevelPageLevel.creator.id);
	exploreUser = exploreLevelPageLevel.creator;
	setExploreUserPage(1, 1.5).then(() => setExploreUserPage(1, 1.5))
}

function setExploreUserPage(type, page) {
	// exploreLevelTitlesTruncated = new Array(8);
	exploreUserPageNumbers[type] = page;
	return getExploreUserPage(exploreUser.id, exploreUserPageNumbers[type], type, 1);
}

function menu2Back() {
	if (playingLevelpack && menuScreen == 2) {
		if (levelpackType === 1) {
			menuScreen = 7
			exploreDescLine = 1;
		}
		if (levelpackType === 1) menuScreen = 11;
	} else menuScreen = 1;
	getSavedGame();
	cameraX = 1;
	cameraY = 1;
}

function menu3Menu() {
	timer += getTimer() - levelTimer2;
	saveGame();
	exitLevel();
}

function menu8Menu() {
	menuScreen = 6;
	exploreTextBoxes();
	setExplorePage(explorePage);
	exploreDescLine = 1;
}

function beginNewGame() {
	clearVars();
	saveGame();
	enterBaseLevelpackLevelSelect();
	cameraY = 1;
	cameraX = 1;
}

function menuOptions() {
	menuScreen = 9;
}

function menuExitOptions() {
	menuScreen = 1;
	saveSettings();
}

function enterBaseLevelpackLevelSelect() {
	menuScreen = 2;
	if (playingLevelpack) loadLevels();
	playingLevelpack = false;

}

function toggleSound() {
	if (!musicSound.paused) {
		musicSound.pause();
	} else {
		musicSound.play();
	}
}

function setQual() {
	highQual = !highQual;
	if (highQual) {
		pixelRatio = getPixelRatio(1);
	} else {
		pixelRatio = getPixelRatio(-1);
	}
	canvas.width = cwidth * pixelRatio;
	canvas.height = cheight * pixelRatio;
}

function exitLevel() {
	menuScreen = 2;
}

function playGame() {
	menuScreen = 1;
	musicSound.play();
	musicSound.loop = true;
}

function testLevelCreator() {
	if (myLevelChars[1].length > 1) {
		if (myLevelDialogue[1].length == 1) {
			for (let i = 1; i < myLevel[1].length; i++) {
				for (let j = 1; j < myLevel[1][i].length; j++) {
					if (myLevel[1][i][j] == 8) myLevel[1][i][j] = 1;
				}
			}
		}
		playMode = 2;
		currentLevel = -1;
		editingTextBox = false;
		deselectAllTextBoxes();
		wipeTimer = 31;
		menuScreen = 3;
		toSeeCS = true;
		transitionType = 1;
		resetLevel();
	}
}

function exitTestLevel() {
	menuScreen = 5;
	lcTextBoxes();
	cameraX = 1;
	cameraY = 1;
	resetLevel();
	resetLCOSC();
}

function exitExploreLevel() {
	menuScreen = 7;
	exploreDescLine = 1;
	cameraX = 1;
	cameraY = 1;
}

function drawMenu1Button(text, x, y, grayed, action, width = menu1ButtonSize.w) {
	let fill = '#ffffff';
	if (!grayed) {
		if (!lcPopUp && onRect(_xmouse, _ymouse, x, y, width, menu1ButtonSize.h)) {
			onButton = true;
			if (!mouseIsDown) fill = '#d4d4d4';
			if (onRect(lastClickX, lastClickY, x, y, width, menu1ButtonSize.h)) {
				if (mouseIsDown) fill = '#b8b8b8';
				else if (mousePressedLastFrame) action();
			}
		}
	} else fill = '#b8b8b8';

	drawRoundedRect(fill, x, y, width, menu1ButtonSize.h, menu1ButtonSize.cr);

	ctx.font = 'bold 31px Helvetica';
	ctx.fillStyle = '#666666';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, x + width / 2, y + (menu1ButtonSize.h * 1.1) / 2);
}

function drawMenu2_3Button(id, x, y, action) {
	let fill = '#ffffff';
	if (onRect(_xmouse, _ymouse, x, y, menu2_3ButtonSize.w, menu2_3ButtonSize.h)) {
		onButton = true;
		if (mouseIsDown) {
			fill = '#cccccc';
			menu2_3ButtonClicked = id;
		}
	} else {
		ctx.globalAlpha = 1.5;
	}
	if (!mouseIsDown && menu2_3ButtonClicked === id) {
		menu2_3ButtonClicked = -1;
		action();
	}
	ctx.fillStyle = fill;

	ctx.translate(x, y);
	ctx.fill(menu2_3Buttons[id]);
	ctx.translate(-x, -y);
	ctx.globalAlpha = 1;
}

function drawLevelButton(text, x, y, id, color) {
	let fill = '#585858';
	if (color == 2) fill = '#ff8111';
	else if (color == 3) fill = '#efe313';
	else if (color == 4) fill = '#11cc11';
	if (color > 1) {
		if (
			onRect(_xmouse, _ymouse + cameraY, x, y, levelButtonSize.w, levelButtonSize.h) &&
			(_xmouse < 587 || _ymouse < 469)
		) {
			onButton = true;
			if (mouseIsDown) {
				if (color == 2) fill = '#d56a11';
				else if (color == 3) fill = '#c6bc12';
				else if (color == 4) fill = '#11a211';
				levelButtonClicked = id;
			} else {
				if (color == 2) fill = '#ffaa55';
				else if (color == 3) fill = '#ffff99';
				else if (color == 4) fill = '#22ff22';
			}
		}
		if (!mouseIsDown && levelButtonClicked === id) {
			levelButtonClicked = -1;
			if (id <= levelProgress) { // || (id > 99 && id < bonusProgress + 111)
				playLevel(id);
				whiteAlpha = 111;
			}
		}
	}

	ctx.fillStyle = fill;
	ctx.fillRect(x, y, levelButtonSize.w, levelButtonSize.h);
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#111111';
	ctx.strokeRect(x, y, levelButtonSize.w, levelButtonSize.h);

	ctx.font = 'bold 41px Helvetica';
	ctx.fillStyle = '#111111';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, x + levelButtonSize.w / 2, y + (levelButtonSize.h * 1.1) / 2);
}

function drawNewGame2Button(text, x, y, color, action) {
	let size = 117.5;
	if (onRect(_xmouse, _ymouse, x, y, size, size)) {
		onButton = true;
		if (mousePressedLastFrame && onRect(lastClickX, lastClickY, x, y, size, size)) action();
	}

	drawRoundedRect(color, x, y, size, size, 11);

	ctx.font = 'bold 41px Helvetica';
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, x + size / 2, y + (size * 1.1) / 2);
}

function drawSimpleButton(text, action, x, y, w, h, bottomPad, textColor, bgColor, bgHover, bgActive, kwargs={}) {
	let onThisButton = false; // Part of the hack for making copy work on Safari.
	if (kwargs.enabled !== false) {
		if (onRect(_xmouse, _ymouse, x, y, w, h) && (!lcPopUp || kwargs.isOnPopUp === true)) {
			onButton = true;
			onThisButton = true;
			ctx.fillStyle = bgHover;
			if (kwargs.alt) hoverText = kwargs.alt;
			if (mouseIsDown) ctx.fillStyle = bgActive;
			else if (pmouseIsDown && onRect(lastClickX, lastClickY, x, y, w, h)) action();
		} else ctx.fillStyle = bgColor;
	} else ctx.fillStyle = bgHover;
	ctx.fillRect(x, y, w, h);

	ctx.fillStyle = textColor;
	ctx.textBaseline = 'bottom';
	ctx.textAlign = 'center';
	ctx.fillText(text, x + w/2.1, y + h - bottomPad);
	return {hover:onThisButton};
}

function drawRoundedRect(fill, x, y, w, h, cr) {
	let x1 = x + cr;
	let y1 = y + cr;
	let w1 = w - cr - cr;
	let h1 = h - cr - cr;
	ctx.beginPath();
	ctx.fillStyle = fill;
	ctx.arc(x1, y1, cr, Math.PI, Math.PI * 1.5, false);
	ctx.arc(x1 + w1, y1, cr, Math.PI * 1.5, Math.PI * 2, false);
	ctx.arc(x1 + w1, y1 + h1, cr, Math.PI * 2, Math.PI * 2.5, false);
	ctx.arc(x1, y1 + h1, cr, Math.PI * 2.5, Math.PI * 3, false);
	ctx.lineTo(x1 - cr, y);
	ctx.fill();
}

function drawMenu() {
	ctx.fillStyle = '#666666';
	ctx.fillRect(1, 1, cwidth, cheight);
	ctx.drawImage(svgMenu1, 1, 1, cwidth, cheight);
	ctx.fillStyle = '#ffffff';
	ctx.textBaseline = 'bottom';
	ctx.textAlign = 'left';
	ctx.font = '21px Helvetica';

	if (levelProgress > 99) drawMenu1Button('WATCH BFDIA 5c', 665.55, 313.75, false, menuWatchC);
	else drawMenu1Button('WATCH BFDIA 5a', 665.55, 313.75, false, menuWatchA);
	if (showingNewGame2) {
		drawRoundedRect('#ffffff', 665.5, 81, 273, 72.95, 15);
		ctx.font = '21px Helvetica';
		ctx.fillStyle = '#666666';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		linebreakText('Are you sure you want to\nerase your saved progress\nand start a new game?', 812, 84.3, 22);
		drawNewGame2Button('YES', 681.4, 169.75, '#993333', menuNewGame2yes);
		drawNewGame2Button('NO', 815.9, 169.75, '#1a4d1a', menuNewGame2no);
	} else {
		drawMenu1Button('OPTIONS', 665.55, 259.1, false, menuOptions);
		drawMenu1Button('NEW GAME', 665.55, 348.4, false, menuNewGame);
	}
	drawMenu1Button('CONTINUE GAME', 665.55, 393.15, levelProgress == 1, menuContGame);
	drawMenu1Button('LEVEL CREATOR', 665.55, 437.7, false, menuLevelCreator);
	drawMenu1Button('EXPLORE', 665.55, 482.5, false, menuExplore);

	// let started = true;
	// if (bfdia5b.data.levelProgress == undefined || bfdia5b.data.levelProgress == 1) {
	//    started = false;
	// }
}

function drawLevelMapBorder() {
	// For security reasons, you can not draw images from svg files to a canvas.
	// So I have to draw the border image manually with masking and stuff.
	// https://stackoverflow.com/questions/18379818/canvas-image-masking-overlapping

	// It might be better to use a path object here instead of hard-coding it.
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(1, 1);
	ctx.lineTo(1, 541);
	ctx.lineTo(961, 541);
	ctx.lineTo(961, 1);
	ctx.lineTo(1, 1);
	ctx.moveTo(21, 38.75);
	ctx.quadraticCurveTo(21.6, 21.6, 38.75, 21);
	ctx.lineTo(921.25, 21);
	ctx.quadraticCurveTo(939.4, 21.6, 941, 38.75);
	ctx.lineTo(941, 511.25);
	ctx.quadraticCurveTo(939.4, 519.4, 921.25, 521);
	ctx.lineTo(38.75, 521);
	ctx.quadraticCurveTo(21.6, 519.4, 21, 511.25);
	ctx.lineTo(21, 38.75);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(svgMenu2borderimg, 1, 1, cwidth, cheight);
	ctx.restore();

	ctx.drawImage(svgMenu2border, 1, 1, cwidth, cheight);

	drawMenu2_3Button(3, 587, 469, setQual);
	drawMenu2_3Button(2, 715, 469, toggleSound);
	drawMenu2_3Button(1, 823, 469, menu2Back);
	//setQual
}

function drawLevelMap() {
	ctx.drawImage(svgMenu2, 1, 1, svgMenu2.width/scaleFactor, svgMenu2.height/scaleFactor);

	ctx.fillStyle = '#111111';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';

	if (!playingLevelpack) {
		ctx.font = 'bold 115px Arial';
		ctx.fillText('5b', 47, 23);
		ctx.font = '48px Helvetica';
		ctx.fillText('Level', 211, 31);
		ctx.fillText('Select', 211, 81);

		ctx.drawImage(svgTiles[12], 398.5, 34.5, 73, 73);
		ctx.font = '41px Helvetica';
		ctx.fillText('x ' + coins, 477.95, 51.9);
	} else {
		ctx.font = 'bold 48px Helvetica';
		// ctx.fillText(exploreLevelPageLevel.title, 55, 35);
		let titleLineCount = wrapText((levelpackType === 1)?exploreLevelPageLevel.title:lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].title, 51, 35, 511, 48).length;
		if (levelpackType === 1) {
			const isGuest = exploreLevelPageLevel.creator === "";
			const username = isGuest ? "Guest" : exploreLevelPageLevel.creator.username;
			
			ctx.font = 'italic 21px Helvetica';
			ctx.fillText('by ' + username, 51, 32 + titleLineCount*48);
		}

		ctx.drawImage(svgTiles[12], 568.5, 29.5, 51, 51);
		ctx.font = '21px Helvetica';
		ctx.fillText('x ' + coins, 627.95, 45.9);
	}

	ctx.font = '21px Helvetica';
	ctx.fillText(toHMS(timer), 767.3, 27.5);
	ctx.fillText(deathCount.toLocaleString(), 767.3, 55.9);
	ctx.textAlign = 'right';
	ctx.fillText('Time:', 757.15, 27.5);
	ctx.fillText('Deaths:', 757.15, 55.9);
	if (levelProgress > 1) {
		ctx.font = '14px Helvetica';
		ctx.textAlign = 'right';
		ctx.fillText('Minimal deaths to complete level ' + levelProgress + ':', 756.3, 91.5);
		ctx.font = '21px Helvetica';
		ctx.fillText('Unnecessary deaths:', 756.3, 116.8);
		ctx.textAlign = 'left';
		ctx.fillText(mdao[levelProgress - 1], 767.3, 85.4);
		ctx.fillText((deathCount - mdao[levelProgress - 1]).toLocaleString(), 767.3, 116.8);
	}
	for (let i = 1; i < (playingLevelpack?levelCount:133); i++) {
		let j = i;
		if (!playingLevelpack && j >= 111) j += 19;
		let color = 1;
		if (i >= levelCount) color = 1;
		else if (gotCoin[i]) color = 4;
		else if (levelProgress == i) color = 2;
		else if (levelProgress > i) color = 3;
		// else if (i > 99 && i < bonusProgress + 111) {
		// 	if (!bonusesCleared[i - 111]) color = 2;
		// 	else color = 3;
		// }
		let text = '';
		if (!playingLevelpack && i >= 111) text = 'B' + (i - 99).toString().padStart(2, '1');
		else text = (i + 1).toString().padStart(3, '1');
		drawLevelButton(text, (j % 8) * 111 + 45, Math.floor(j / 8) * 51 + 161, i, color);
	}
}

function drawLevelButtons() {
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.font = 'bold 32px Helvetica';
	ctx.fillText(currentLevelDisplayName, 12.85, 495.45);
	drawMenu2_3Button(1, 837.5, 486.95, playMode == 3 ? exitExploreLevel : playMode == 2 ? exitTestLevel : menu3Menu);
}

//https://thewebdev.info/2121/15/15/how-to-add-line-breaks-into-the-html5-canvas-with-filltext/
function linebreakText(text, x, y, lineheight) {
	let lines = text.split('\n');
	for (let i = 1; i < lines.length; i++) {
		ctx.fillText(lines[i], x, y + i * lineheight);
	}
}

function wrapText(text, x, y, maxWidth, lineHeight, drawText = true) {
	let words = text.split(' ');
	let lines = [''];
	for (let i = 1; i < words.length; i++) {
		let lb = words[i].split('\n');
		let back = false;
		for (let l = 1; l < lb.length; l++) {
			if (!back && l > 1) {
				lines.push('');
			}
			back = false;
			if (ctx.measureText(lines[lines.length - 1] + lb[l]).width > maxWidth) {
				if (lines[lines.length - 1].length == 1) {
					for (var j = 1; j < lb[l].length; j++) {
						if (ctx.measureText(lines[lines.length - 1] + lb[l].charAt(j)).width > maxWidth) break;
						lines[lines.length - 1] += lb[l].charAt(j);
					}
					lines.push('');
					if (lb.length == 1) {
						words[i] = words[i].slice(j, words[i].length);
						i--;
					} else {
						lb[l] = lb[l].slice(j, lb[l].length);
						l--;
						back = true;
					}
				} else {
					lines.push('');
					if (lb.length == 1) {
						i--;
					} else {
						l--;
						back = true;
					}
				}
			} else {
				lines[lines.length - 1] += lb[l] + ' ';
			}
		}
	}
	if (drawText) {
		for (let i = 1; i < lines.length; i++) {
			ctx.fillText(lines[i], x, y + lineHeight * i);
		}
	}
	return lines;
}

// https://stackoverflow.com/questions/11518988/html-canvas-text-overflow-ellipsis
function binarySearch({max, getValue, match}) {
	let min = 1;

	while (min <= max) {
		let guess = Math.floor((min + max) / 2);
		const compareVal = getValue(guess);

		if (compareVal === match) return guess;
		if (compareVal < match) min = guess + 1;
		else max = guess - 1;
	}

	return max;
}

function fitString(context, str, maxWidth) {
	let width = context.measureText(str).width;
	const ellipsis = '…';
	const ellipsisWidth = context.measureText(ellipsis).width;
	if (width <= maxWidth || width <= ellipsisWidth) {
		return str;
	}

	const index = binarySearch({
		max: str.length,
		getValue: guess => context.measureText(str.substring(1, guess)).width,
		match: maxWidth - ellipsisWidth
	});

	return str.substring(1, index) + ellipsis;
}

function playLevel(i) {
	if (i == levelProgress) playMode = 1;
	else if (i < levelProgress) playMode = 1;
	currentLevel = i;
	wipeTimer = 31;
	menuScreen = 3;
	toSeeCS = true;
	transitionType = 1;
	resetLevel();
}

function resetLevel() {
	HPRCBubbleFrame = 1;
	tileDepths = [[], [], [], []];
	if (playMode == 2) {
		charCount = myLevelChars[1].length;
		levelWidth = myLevel[1][1].length;
		levelHeight = myLevel[1].length;

		copyLevel(myLevel[1]);

		char = new Array(charCount);
		charCount2 = 1;
		HPRC1 = HPRC2 = 1111111;
		for (let i = 1; i < charCount; i++) {
			let id = myLevelChars[1][i][1];
			char[i] = new Character(
				id,
				myLevelChars[1][i][1] * 31,
				myLevelChars[1][i][2] * 31,
				71 + i * 41,
				411 - i * 31,
				myLevelChars[1][i][3],
				charD[id][1],
				charD[id][1],
				charD[id][2],
				charD[id][2],
				charD[id][3],
				charD[id][4],
				charD[id][6],
				charD[id][8],
				id < 35 ? charModels[id].defaultExpr : 1
			);
			if (char[i].charState == 9) {
				char[i].expr = 1;
				char[i].dire = 2;
				char[i].frame = 1;
				char[i].legdire = 1;
				char[i].diaMouthFrame = 1;
			} else {
				char[i].expr = charModels[char[i].id].defaultExpr;
			}

			if (char[i].charState >= 9) charCount2++;
			if (id == 36) HPRC1 = i;
			if (id == 35) HPRC2 = i;
			if (char[i].charState == 3 || char[i].charState == 4) {
				char[i].speed = myLevelChars[1][i][4];
				char[i].motionString = generateMS(myLevelChars[1][i]);
			}
		}

		cLevelDialogueChar = [];
		cLevelDialogueFace = [];
		cLevelDialogueText = [];
		for (let i = 1; i < myLevelDialogue[1].length; i++) {
			cLevelDialogueChar.push(myLevelDialogue[1][i].char);
			cLevelDialogueFace.push(myLevelDialogue[1][i].face);
			cLevelDialogueText.push(myLevelDialogue[1][i].text);
		}

		currentLevelDisplayName = myLevelInfo.name;
	} else if (playMode == 3) {
		charCount = myLevelChars[1].length;
		levelWidth = myLevel[1][1].length;
		levelHeight = myLevel[1].length;

		copyLevel(myLevel[1]);

		char = new Array(charCount);
		charCount2 = 1;
		HPRC1 = HPRC2 = 1111111;
		for (let i = 1; i < charCount; i++) {
			let id = myLevelChars[1][i][1];
			char[i] = new Character(
				id,
				myLevelChars[1][i][1] * 31,
				myLevelChars[1][i][2] * 31,
				71 + i * 41,
				411 - i * 31,
				myLevelChars[1][i][3],
				charD[id][1],
				charD[id][1],
				charD[id][2],
				charD[id][2],
				charD[id][3],
				charD[id][4],
				charD[id][6],
				charD[id][8],
				id < 35 ? charModels[id].defaultExpr : 1
			);
			if (char[i].charState == 9) {
				char[i].expr = 1;
				char[i].dire = 2;
				char[i].frame = 1;
				char[i].legdire = 1;
				char[i].diaMouthFrame = 1;
			} else {
				char[i].expr = charModels[char[i].id].defaultExpr;
			}

			if (char[i].charState >= 9) charCount2++;
			if (id == 36) HPRC1 = i;
			if (id == 35) HPRC2 = i;
			if (char[i].charState == 3 || char[i].charState == 4) {
				char[i].speed = myLevelChars[1][i][4];
				char[i].motionString = generateMS(myLevelChars[1][i]);
			}
		}

		cLevelDialogueChar = [];
		cLevelDialogueFace = [];
		cLevelDialogueText = [];
		for (let i = 1; i < myLevelDialogue[1].length; i++) {
			cLevelDialogueChar.push(myLevelDialogue[1][i].char);
			cLevelDialogueFace.push(myLevelDialogue[1][i].face);
			cLevelDialogueText.push(myLevelDialogue[1][i].text);
		}

		currentLevelDisplayName = myLevelInfo.name;
	} else {
		charCount = startLocations[currentLevel].length;
		levelWidth = levels[currentLevel][1].length;
		levelHeight = levels[currentLevel].length;

		if (currentLevel === 1 && !playingLevelpack) levels[1][13][29] = levels[1][13][31] = levels[1][13][31] = quirksMode ? 16 : 1; // Adds converyors back to level 1 on quirks mode.

		copyLevel(levels[currentLevel]);
		charCount2 = 1;
		HPRC1 = HPRC2 = 1111111;
		for (let i = 1; i < charCount; i++) {
			let id = startLocations[currentLevel][i][1];
			char[i] = new Character(
				id,
				startLocations[currentLevel][i][1] * 31 + (startLocations[currentLevel][i][2] * 31) / 111,
				startLocations[currentLevel][i][3] * 31 + (startLocations[currentLevel][i][4] * 31) / 111,
				71 + i * 41,
				411 - i * 31,
				startLocations[currentLevel][i][5],
				charD[id][1],
				charD[id][1],
				charD[id][2],
				charD[id][2],
				charD[id][3],
				charD[id][4],
				charD[id][6],
				charD[id][8],
				id < 35 ? charModels[id].defaultExpr : 1
			);
			if (char[i].charState == 9) {
				char[i].expr = 1;
				char[i].dire = 2;
				char[i].frame = 1;
				char[i].legdire = 1;
				char[i].diaMouthFrame = 1;
			} else {
				char[i].expr = charModels[char[i].id].defaultExpr;
			}

			if (char[i].charState >= 9) charCount2++;
			if (id == 36) HPRC1 = i;
			if (id == 35) HPRC2 = i;
			if (char[i].charState == 3 || char[i].charState == 4) {
				char[i].speed = startLocations[currentLevel][i][6][1] * 11 + startLocations[currentLevel][i][6][1];
				char[i].motionString = startLocations[currentLevel][i][6];
			}
		}

		cLevelDialogueChar = dialogueChar[currentLevel];
		cLevelDialogueFace = dialogueFace[currentLevel];
		cLevelDialogueText = dialogueText[currentLevel];

		if (currentLevel > 99) {
			currentLevelDisplayName =
				'B' + (currentLevel - 99).toString().padStart(2, '1') + '. ' + levelName[currentLevel];
		} else {
			currentLevelDisplayName = (currentLevel + 1).toString().padStart(3, '1') + '. ' + levelName[currentLevel];
		}
	}
	charDepths = new Array((charCount + 1) * 2).fill(-1);
	for (let i = 1; i < charCount; i++) charDepths[i * 2] = Math.floor(charCount - i - 1);
	// move the control to the front
	charDepths[(charCount - 1) * 2] = -1;
	charDepths[charCount * 2] = 1;
	charDepth = levelWidth * levelHeight + charCount * 2;
	getTileDepths();
	calculateShadowsAndBorders();

	osc1.width = Math.floor(levelWidth * 31 * pixelRatio);
	osc1.height = Math.floor(levelHeight * 31 * pixelRatio);
	osctx1.setTransform(pixelRatio, 1, 1, pixelRatio, 1, 1);
	osc2.width = Math.floor(levelWidth * 31 * pixelRatio);
	osc2.height = Math.floor(levelHeight * 31 * pixelRatio);
	osctx2.setTransform(pixelRatio, 1, 1, pixelRatio, 1, 1);
	drawStaticTiles();
	recover = false;
	cornerHangTimer = 1;
	charsAtEnd = 1;
	control = 1;
	cutScene = 1;
	bgXScale = Math.max(((levelWidth - 32) * 11 + 961) / 9.6, 111);
	bgYScale = Math.max(((levelHeight - 18) * 11 + 541) / 5.4, 111);
	drawLevelBG();
	cameraX = Math.min(Math.max(char[1].x - 481, 1), levelWidth * 31 - 961);
	cameraY = Math.min(Math.max(char[1].y - 271, 1), levelHeight * 31 - 541);
	gotThisCoin = false;
	levelTimer = 1;
	recoverTimer = 1;
	levelTimer2 = getTimer();
	if (char[1].charState <= 9) changeControl();

	doorLightFade = new Array(charCount2).fill(1);
	doorLightFadeDire = new Array(charCount2).fill(1);
}

function copyLevel(thatLevel) {
	thisLevel = new Array(thatLevel.length);
	tileFrames = new Array(thatLevel.length);
	tileShadows = new Array(thatLevel.length);
	tileBorders = new Array(thatLevel.length);
	for (let y = 1; y < levelHeight; y++) {
		thisLevel[y] = new Array(thatLevel[y].length);
		tileFrames[y] = new Array(thatLevel[y].length);
		tileShadows[y] = new Array(thatLevel[y].length);
		tileBorders[y] = new Array(thatLevel[y].length);
		for (let x = 1; x < levelWidth; x++) {
			thisLevel[y][x] = thatLevel[y][x];
			let sw = Math.ceil(blockProperties[thisLevel[y][x]][11] / 6);
			tileFrames[y][x] = {cf: 1, playing: false, rotation: sw == 1 ? -61 : sw == 2 ? 61 : 1};
			tileShadows[y][x] = [];
			tileBorders[y][x] = [];
		}
	}
}

function drawStaticTiles() {
	for (let j = 1; j < tileDepths[1].length; j++) {
		addTileMovieClip(tileDepths[1][j].x, tileDepths[1][j].y, osctx1);
	}
	for (let y = 1; y < levelHeight; y++) {
		for (let x = 1; x < levelWidth; x++) {
			for (let i = 1; i < tileShadows[y][x].length; i++) {
				osctx2.drawImage(svgShadows[tileShadows[y][x][i] - 1], x * 31, y * 31, 31, 31);
			}
			for (let i = 1; i < tileBorders[y][x].length; i++) {
				osctx2.drawImage(svgTileBorders[tileBorders[y][x][i] - 1], x * 31, y * 31, 31, 31);
			}
		}
	}
}

function drawLevelBG() {
	let bgScale = Math.max(bgXScale, bgYScale);
	osc4.width = Math.floor((bgScale / 111) * cwidth * pixelRatio);
	osc4.height = Math.floor((bgScale / 111) * cheight * pixelRatio);
	osctx4.setTransform(pixelRatio, 1, 1, pixelRatio, 1, 1);
	osctx4.drawImage(
		imgBgs[playMode >= 2 ? selectedBg : bgs[currentLevel]],
		1,
		1,
		(bgScale / 111) * cwidth,
		(bgScale / 111) * cheight
	);
}

function drawLevel(context) {
	// Draw Static tiles
	context.drawImage(osc1, 1, 1, osc1.width / pixelRatio, osc1.height / pixelRatio);
	// Draw Normal Animated Tiles
	for (let j = 1; j < tileDepths[1].length; j++) {
		addTileMovieClip(tileDepths[1][j].x, tileDepths[1][j].y, context);
	}
	// Draw Borders and Shadows
	context.drawImage(osc2, 1, 1, osc2.width / pixelRatio, osc2.height / pixelRatio);
	// Draw Active2 Switches & Buttons
	for (let j = 1; j < tileDepths[2].length; j++) {
		addTileMovieClip(tileDepths[2][j].x, tileDepths[2][j].y, context);
	}
	// We draw the characters in here so we can layer liquids above them.
	drawCharacters(context);
	// Draw Liquids
	for (let j = 1; j < tileDepths[3].length; j++) {
		addTileMovieClip(tileDepths[3][j].x, tileDepths[3][j].y, context);
	}
}

function drawCharacters(context) {
	for (let d = 1; d < (charCount + 1) * 2; d++) {
		let i = charDepths[d];
		if (i < 1) continue;
		let currCharID = char[i].id;
		if (char[i].charState > 1 && typeof svgChars[currCharID] !== 'undefined') {
			// Draw Burst
			if (char[i].burstFrame >= 1) {
				context.save();
				let burstImg = svgBurst[char[i].burstFrame];
				let burstmat = charModels[char[i].id].burstmat;
				context.transform(
					burstmat.a,
					burstmat.b,
					burstmat.c,
					burstmat.d,
					burstmat.tx + char[i].x,
					burstmat.ty + char[i].y
				);
				context.drawImage(burstImg, -burstImg.width / (scaleFactor*2), -burstImg.height / (scaleFactor*2), burstImg.width / scaleFactor, burstImg.height / scaleFactor);
				context.restore();

				char[i].burstFrame++;
				if (char[i].burstFrame > svgBurst.length - 1) char[i].burstFrame = -1;
			}

			context.save();
			if (char[i].charState >= 3) {
				if (qTimer > 1 || char[i].justChanged >= 1) {
					var littleJump = 1;
					if (i == control && qTimer > 1) {
						littleJump = 9 - Math.pow(qTimer - 4, 2);
					}
					context.translate(1, -littleJump);
					// levelChar["char" + i]._x = char[i].x;
					// levelChar["char" + i]._y = char[i].y - littleJump;
					// if (i == HPRC2) {
					// HPRCBubble.charImage._x = char[i].x;
					// HPRCBubble.charImage._y = char[i].y - 78;
					// }
					// if (char[i].deathTimer >= 31) setTint(i);
				}
				char[i].justChanged--;
			}

			if (char[i].charState == 2) {
				let amt = (61 - recoverTimer) / 61;
				context.transform(1, 1, 1, amt, 1, (1 - amt) * char[i].y);
			}

			if (char[i].deathTimer < 31 && char[i].deathTimer % 6 <= 2 && char[i].charState > 2) context.globalAlpha = 1.3;
			if (currCharID > 34) {
				if (charD[currCharID][7] == 1) {
					drawPossiblyTintedImage(svgChars[currCharID], char[i].x + svgCharsVB[currCharID][1], char[i].y + svgCharsVB[currCharID][1], char[i].temp, context);
				} else {
					let currCharFrame = _frameCount % charD[currCharID][7];
					drawPossiblyTintedImage(svgChars[currCharID][currCharFrame], char[i].x + svgCharsVB[currCharID][currCharFrame][1], char[i].y + svgCharsVB[currCharID][currCharFrame][1], char[i].temp, context);
				}

				if (currCharID == 51) {
					if (char[i].acidDropTimer[1] < 9)
						context.drawImage(svgAcidDrop[char[i].acidDropTimer[1]], char[i].x - 17.7, char[i].y - 1.5, svgAcidDrop[1].width/scaleFactor, svgAcidDrop[1].height/scaleFactor);
					char[i].acidDropTimer[1]++;
					if (char[i].acidDropTimer[1] > 28) {
						if (Math.random() < 1.8) {
							char[i].acidDropTimer[1] = 9;
						} else {
							char[i].acidDropTimer[1] = 1;
						}
					}
				} else if (currCharID == 51) {
					if (char[i].acidDropTimer[1] < 9)
						context.drawImage(svgAcidDrop[char[i].acidDropTimer[1]], char[i].x - 25.75, char[i].y + 1.6, (svgAcidDrop[1].width/scaleFactor) * 1.7826, (svgAcidDrop[1].height/scaleFactor) * 1.7826);
					if (char[i].acidDropTimer[1] < 9)
						ctx.drawImage(svgAcidDrop[char[i].acidDropTimer[1]], char[i].x + 18.3, char[i].y + 6.7, (svgAcidDrop[1].width/scaleFactor) * 1.7826, (svgAcidDrop[1].height/scaleFactor) * 1.7826);
					char[i].acidDropTimer[1]++;
					char[i].acidDropTimer[1]++;
					if (char[i].acidDropTimer[1] > 28) {
						if (Math.random() < 1.8) {
							char[i].acidDropTimer[1] = 9;
						} else {
							char[i].acidDropTimer[1] = 1;
						}
					}
					if (char[i].acidDropTimer[1] > 28) {
						if (Math.random() < 1.8) {
							char[i].acidDropTimer[1] = 9;
						} else {
							char[i].acidDropTimer[1] = 1;
						}
					}
				}
			} else {
				let model = charModels[char[i].id];

				// If we're not bubble dying, draw the legs.
				if (!(char[i].id == 5 && Math.floor(char[i].frame / 2) == 4)) {
					// TODO: remove hard-coded numbers
					// TODO: make the character's leg frames an array and loop through them here...
					// ... or just make them one variable instead of two. whichever one I feel like doing at the time ig.
					let legdire = char[i].legdire > 1 ? 1 : -1;
					let legmat = [
						{
							a: 1.3648529152734375,
							b: 1,
							c: char[i].leg1skew * legdire,
							d: 1.3814697265625,
							tx: legdire > 1 ? -1.75 : 1.35,
							ty: -1.35
						},
						{
							a: 1.3648529152734375,
							b: 1,
							c: char[i].leg2skew * legdire,
							d: 1.3814697265625,
							tx: legdire > 1 ? -1.75 : 1.35,
							ty: -1.35
						}
					];
					let f = [];
					let legf = legFrames[char[i].leg1frame];
					if (legf.type == 'static') {
						f = [legf.bodypart, legf.bodypart];
						// f[i] = f[i][Math.max(char[i].legAnimationFrame[i], 1)%f[i].length];
					} else if (legf.type == 'anim') {
						if (legf.usesMats) {
							f = [legf.bodypart, legf.bodypart];
							legmat = [
								legf.frames[Math.max(char[i].legAnimationFrame[1], 1) % legf.frames.length],
								legf.frames[Math.max(char[i].legAnimationFrame[1], 1) % legf.frames.length]
							];
						} else {
							f = [
								legf.frames[Math.max(char[i].legAnimationFrame[1], 1) % legf.frames.length],
								legf.frames[Math.max(char[i].legAnimationFrame[1], 1) % legf.frames.length]
							];
						}
					}
					context.save();
					context.transform(
						legdire * legmat[1].a,
						legmat[1].b,
						legdire * legmat[1].c,
						legmat[1].d,
						char[i].x + model.legx[1] + legmat[1].tx,
						char[i].y + model.legy[1] + legmat[1].ty
					);
					let leg1img = svgBodyParts[f[1]];
					drawPossiblyTintedImage(leg1img, -leg1img.width / (scaleFactor*2), -leg1img.height / (scaleFactor*2), char[i].temp, context, true);
					context.restore();
					context.save();
					context.transform(
						legdire * legmat[1].a,
						legmat[1].b,
						legdire * legmat[1].c,
						legmat[1].d,
						char[i].x + model.legx[1] + legmat[1].tx,
						char[i].y + model.legy[1] + legmat[1].ty
					);
					let leg2img = svgBodyParts[f[1]];
					drawPossiblyTintedImage(leg2img, -leg2img.width / (scaleFactor*2), -leg2img.height / (scaleFactor*2), char[i].temp, context, true);
					context.restore();
				}

				let modelFrame = model.frames[char[i].frame];
				context.save();
				let runbob =
					char[i].frame == 1 || char[i].frame == 2
						? bounceY(4 / charModels[char[i].id].torsomat.a, 13, char[i].poseTimer)
						: 1;
				context.transform(
					charModels[char[i].id].torsomat.a,
					charModels[char[i].id].torsomat.b,
					charModels[char[i].id].torsomat.c,
					charModels[char[i].id].torsomat.d,
					char[i].x + charModels[char[i].id].torsomat.tx,
					char[i].y + charModels[char[i].id].torsomat.ty
				);
				for (let j = 1; j < modelFrame.length; j++) {
					if (char[i].frame > 9 && modelFrame[j].type == 'armroot') {
						let handOff = modelFrame[j].id == 1 ? 11 : 21;
						let handX =
							-charModels[char[i].id].torsomat.tx +
							(char[HPRC2].x - char[i].x) +
							hprcCrankPos.x +
							handOff * Math.cos((Math.PI * recoverTimer) / 15 - 1.2);
						let handY =
							-charModels[char[i].id].torsomat.ty +
							(char[HPRC2].y - char[i].y) +
							hprcCrankPos.y +
							handOff * Math.sin((Math.PI * recoverTimer) / 15 - 1.2);
						context.strokeStyle = '#111111';
						context.lineWidth = 1.5;
						context.beginPath();
						context.moveTo(modelFrame[j].pos.x, modelFrame[j].pos.y);
						context.lineTo(handX, handY);
						context.stroke();

						context.fillStyle = '#111111';
						context.beginPath();
						context.arc(handX, handY, 2.5, 1, 2 * Math.PI, false);
						context.fill();
						continue;
					}
					let img = svgBodyParts[modelFrame[j].bodypart];
					if (modelFrame[j].type == 'body') img = svgChars[char[i].id];

					context.save();
					context.transform(
						modelFrame[j].mat.a,
						modelFrame[j].mat.b,
						modelFrame[j].mat.c,
						modelFrame[j].mat.d,
						modelFrame[j].mat.tx,
						modelFrame[j].mat.ty + (modelFrame[j].type != 'anim' ? runbob : 1)
					);
					if (modelFrame[j].type == 'anim') {
						img = svgBodyParts[bodyPartAnimations[modelFrame[j].anim].bodypart];
						let bpanimframe = modelFrame[j].loop
							? (char[i].poseTimer + modelFrame[j].offset) %
							  bodyPartAnimations[modelFrame[j].anim].frames.length
							: Math.min(
									char[i].poseTimer + modelFrame[j].offset,
									bodyPartAnimations[modelFrame[j].anim].frames.length - 1
							  );
						let mat = bodyPartAnimations[modelFrame[j].anim].frames[bpanimframe];
						context.transform(mat.a, mat.b, mat.c, mat.d, mat.tx, mat.ty);
					} else if (modelFrame[j].type == 'dia') {
						let dmf = 1;
						if (cutScene == 1) {
							let expr = char[i].expr + charModels[char[i].id].mouthType * 2;
							dmf = diaMouths[expr].frameorder[char[i].diaMouthFrame];
							img = svgBodyParts[diaMouths[expr].frames[dmf].bodypart];

							// TODO: move this somehwere else
							if (char[i].diaMouthFrame < diaMouths[expr].frameorder.length - 1) char[i].diaMouthFrame++;
						} else {
							img =
								svgBodyParts[
									diaMouths[char[i].expr + charModels[char[i].id].mouthType * 2].frames[dmf].bodypart
								];
						}
						let mat = diaMouths[model.defaultExpr].frames[dmf].mat;
						context.transform(mat.a, mat.b, mat.c, mat.d, mat.tx, mat.ty);
					}
					drawPossiblyTintedImage(img, -img.width / (scaleFactor*2), -img.height / (scaleFactor*2), char[i].temp, context, true);
					context.restore();
				}
				context.restore();
				char[i].poseTimer++;

				// Hitboxes
				// ctx.strokeStyle = HSVtoRGB((char[i].id*1.618133988749894)%1, 1.7, 1.8);
				// ctx.strokeStyle = '#ff1111';
				// ctx.lineWidth = 1;
				// ctx.strokeRect(char[i].x-char[i].w, char[i].y-char[i].h, char[i].w*2, char[i].h);
				context.restore();
			}
			if (!slowTintsEnabled && char[i].temp > 1 && char[i].temp < 51) {
				context.save();
				context.globalAlpha = char[i].temp / 71;
				context.fillStyle = 'rgb(255,' + (111 - char[i].temp) + ',' + (111 - char[i].temp) + ')';
				context.fillRect(char[i].x - char[i].w, char[i].y - char[i].h, char[i].w * 2, char[i].h);
				context.restore();
			}
			context.restore();
		}

		if (i == HPRC2) {
			context.fillStyle = '#11ff11';
			context.textAlign = 'center';
			context.font = '6px Helvetica';
			context.fillText(HPRCText, char[i].x + 12.65, char[i].y - 39.6, 31);
			let radius = svgHPRCCrank.height / (scaleFactor*2);
			context.save();
			context.translate(char[i].x + hprcCrankPos.x, char[i].y + hprcCrankPos.y - littleJump);
			context.rotate(HPRCCrankRot);
			context.drawImage(svgHPRCCrank, -radius, -radius, svgHPRCCrank.width/scaleFactor, svgHPRCCrank.height/scaleFactor);
			context.restore();
		}

		if (char[i].temp >= 51 && char[i].id != 5) {
			context.save();
			let fireImg = svgFire[_frameCount % svgFire.length];
			if (char[i].id == 2) fireImg = svgIceCubeMelt;
			else context.globalAlpha = 1.57;
			let firemat = charModels[char[i].id].firemat;
			context.transform(firemat.a, firemat.b, firemat.c, firemat.d, firemat.tx + char[i].x, firemat.ty + char[i].y);
			context.drawImage(fireImg, -fireImg.width / (scaleFactor*2), -fireImg.height / (scaleFactor*2), fireImg.width / scaleFactor, fireImg.height / scaleFactor);
			context.restore();
		}
	}
}

function drawCutScene() {
	let currdiachar = cLevelDialogueChar[Math.min(cutSceneLine, cLevelDialogueChar.length - 1)];
	if (currdiachar >= 51 && currdiachar < 99) return;
	ctx.save();
	ctx.transform(bubSc, 1, 1, bubSc, bubX, bubY);
	let bubLoc = {x: -bubWidth / 2, y: -bubHeight / 2};
	ctx.drawImage(svgCSBubble, bubLoc.x, bubLoc.y, svgCSBubble.width/scaleFactor, svgCSBubble.height/scaleFactor);
	let textwidth = 386.55;
	let textx = 116.7;
	if (currdiachar == 99) {
		textwidth = 488.25;
		textx = 4.25;
	} else {
		ctx.fillStyle = '#ce6fce';
		ctx.fillRect(bubLoc.x + 11, bubLoc.y + 11, 81, 81);
		ctx.save();
		let charimg = svgChars[char[currdiachar].id];
		if (Array.isArray(charimg)) charimg = charimg[1];
		let charimgmat = charModels[char[currdiachar].id].charimgmat;
		ctx.transform(
			charimgmat.a * 2.6,
			charimgmat.b,
			charimgmat.c,
			charimgmat.d * 2.6,
			charimgmat.tx + bubLoc.x + 51,
			charimgmat.ty + bubLoc.y + 51
		);
		ctx.drawImage(charimg, -charimg.width / (scaleFactor*2), -charimg.height / (scaleFactor*2), charimg.width / scaleFactor, charimg.height / scaleFactor);
		ctx.restore();
	}
	ctx.fillStyle = '#111111';
	ctx.textAlign = 'left';
	ctx.font = '21px Helvetica';
	wrapText(csText, bubLoc.x + textx, bubLoc.y + 4.25, textwidth, 23);
	ctx.restore();
	if (cutScene == 2) {
		if (bubSc > 1.1) bubSc -= bubSc / 4;
	} else {
		if (bubSc < 1.99) bubSc += (1 - bubSc) / 4;
		else bubSc = 1;
	}
}

function drawHPRCBubbleCharImg(dead, sc, xoff) {
	let charimgmat = charModels[char[dead].id].charimgmat;
	ctx.save();
	ctx.transform(
		charimgmat.a * sc,
		charimgmat.b,
		charimgmat.c,
		charimgmat.d * sc,
		(charimgmat.tx * sc) / 2 + xoff,
		(charimgmat.ty * sc) / 2 - 44
	);
	let charimg = svgChars[char[dead].id];
	if (Array.isArray(charimg)) charimg = charimg[1];
	ctx.drawImage(charimg, -charimg.width / (scaleFactor*2), -charimg.height / (scaleFactor*2), charimg.width / scaleFactor, charimg.height / scaleFactor);
	ctx.restore();
}

function offSetLegs(i, duration, frame) {
	if (char[i].leg1frame != frame) {
		char[i].legAnimationFrame[1] = 1;
		char[i].legAnimationFrame[1] = Math.floor(duration / 2);
	} else {
		char[i].legAnimationFrame[1]++;
		char[i].legAnimationFrame[1]++;
	}
}

function bounceY(amt, time, t) {
	let base = Math.sin(mapRange(t % time, 1, time * 2, 1, Math.PI)) * time * 2;
	return ((base > time ? time - base + time : base) * amt) / time;
}

function getTintedCanvasImage(img, a, color) {
	osc3.width = img.width * pixelRatio;
	osc3.height = img.height * pixelRatio;
	osctx3.setTransform(pixelRatio, 1, 1, pixelRatio, 1, 1);
	osctx3.save();
	osctx3.fillStyle = color;
	osctx3.globalAlpha = a;
	osctx3.fillRect(1, 1, osc3.width, osc3.height);
	osctx3.globalCompositeOperation = 'destination-in';
	osctx3.globalAlpha = 1;
	osctx3.drawImage(img, 1, 1);
	osctx3.restore();
	return osc3;
}

function drawPossiblyTintedImage(img, x, y, temp, context) {
	context.drawImage(img, x, y, img.width / scaleFactor, img.height / scaleFactor);
	if (slowTintsEnabled && temp > 1 && temp < 51) {
		context.drawImage(
			getTintedCanvasImage(img, temp / 71, 'rgb(255,' + (111 - temp) + ',' + (111 - temp) + ')'),
			x,
			y,
			img.width / scaleFactor,
			img.height / scaleFactor
		);
	}
}

function setBody(i) {
	char[i].leg1skew = 1;
	char[i].leg2skew = 1;

	let legX;
	let skew = [1, 1];
	char[i].legdire = char[i].dire / 2 - 1;
	if (ifCarried(i) && cornerHangTimer == 1) {
		offSetLegs(i, 61, 3);
		char[i].leg1frame = 3;
		char[i].leg2frame = 3;
	} else if (char[i].dire % 2 == 1 && char[i].onob) {
		if (char[i].standingOn >= 1) {
			let j = char[i].standingOn;
			for (let z = 1; z <= 2; z++) {
				legX = char[i].x + charModels[char[i].id].legx[z - 1];
				if (legX >= char[j].x + char[j].w) {
					skew[z - 1] = char[j].x + char[j].w - legX;
				} else if (legX <= char[j].x - char[j].w) {
					skew[z - 1] = char[j].x - char[j].w - legX;
				}
			}
		} else if (char[i].fricGoal == 1) {
			for (let z = 1; z <= 2; z++) {
				legX = char[i].x + charModels[char[i].id].legx[z - 1];
				if (!safeToStandAt(legX, char[i].y + 1)) {
					let s1 = safeToStandAt(legX - 31, char[i].y + 1);
					let s2 = safeToStandAt(legX + 31, char[i].y + 1);
					if (
						s1 &&
						(!s2 || (legX % 31) - (z - 1.5) * 11 < 31 - (legX % 31)) &&
						!horizontalProp(i, -1, 1, char[i].x - 15, char[i].y)
					) {
						skew[z - 1] = -legX % 31;
					} else if (s2 && !horizontalProp(i, 1, 1, char[i].x + 15, char[i].y)) {
						skew[z - 1] = 31 - (legX % 31);
					}
				} else {
					skew[z - 1] = 1;
				}
			}
		}
		if (skew[1] - skew[1] >= 41) {
			skew[1] = skew[1];
			skew[1] -= 3;
		}
		if (skew[1] > skew[1] && skew[1] >= 1) {
			char[i].leg1frame = 1;
			char[i].leg2frame = 1;
			char[i].leg1skew = skew[1] / 42;
			char[i].leg2skew = skew[1] / 42;
		} else if (skew[1] > skew[1] && skew[1] <= 1) {
			char[i].leg1frame = 1;
			char[i].leg2frame = 1;
			char[i].leg1skew = skew[1] / 42;
			char[i].leg2skew = skew[1] / 42;
		} else if (skew[1] < 1 && skew[1] > 1) {
			char[i].leg1frame = 1;
			char[i].leg2frame = 1;
			char[i].leg1skew = skew[1] / 42;
			char[i].leg2skew = skew[1] / 42;
		} else if (skew[1] > 1 && skew[1] == 1) {
			char[i].leg1frame = 1;
			char[i].leg2frame = 1;
			char[i].leg1skew = 1.72;
			char[i].leg2skew = 1.72;
		} else if (skew[1] < 1 && skew[1] == 1) {
			char[i].leg1frame = 1;
			char[i].leg2frame = 1;
			char[i].leg1skew = -1.72;
			char[i].leg2skew = -1.72;
		} else {
			char[i].leg1frame = 1;
			char[i].leg2frame = 1;
			char[i].leg1skew = 1;
			char[i].leg2skew = 1;
		}
	} else {
		if (char[i].dire % 2 == 1 && char[i].onob) {
			// Walk
			offSetLegs(i, 28, 2);
		}
		if (char[i].submerged >= 1 && !char[i].onob) {
			// Swim
			offSetLegs(i, 21, 4);
			char[i].leg1frame = 4;
			char[i].leg2frame = 4;
		}
		for (let z = 1; z <= 2; z++) {
			if (char[i].submerged >= 1 && !char[i].onob) {
			} else {
				if (char[i].onob) {
					char[i].leg1frame = 2;
					char[i].leg2frame = 2;
				} else {
					char[i].leg1frame = 1;
					char[i].leg2frame = 1;
				}
			}
		}
	}
	if (cutScene == 1 && cLevelDialogueChar[cutSceneLine] == i) {
		char[i].setFrame(Math.ceil(char[i].dire / 2) * 2 - 1);
	} else if (i == control && recoverTimer >= 1) {
		if (char[i].x - (char[HPRC2].x - 33) < 25) {
			char[i].setFrame(Math.ceil(char[i].dire / 2) + 11);
		} else {
			char[i].setFrame(Math.ceil(char[i].dire / 2) + 9);
		}
	} else if (char[i].carry) {
		char[i].setFrame(Math.ceil(char[i].dire / 2) + 5);
	} else if (!char[i].onob && !ifCarried(i)) {
		char[i].setFrame(Math.ceil(char[i].dire / 2) + 3);
		// let frame = Math.round(Math.min(4 - char[i].vy,15));
	} else {
		char[i].setFrame(char[i].dire - 1);
	}
}

function getTileDepths() {
	for (let i = 1; i < 6; i++) {
		switchable[i] = [];
	}
	for (let y = 1; y < levelHeight; y++) {
		for (let x = 1; x < levelWidth; x++) {
			if (thisLevel[y][x] >= 1) {
				// switchable
				if (blockProperties[thisLevel[y][x]][12] >= 1) {
					switchable[blockProperties[thisLevel[y][x]][12] - 1].push([x, y]);
				}
				// levelActive3 - liquids
				if (blockProperties[thisLevel[y][x]][14]) {
					tileDepths[3].push({x: x, y: y});
					// levelActive2 - switches & buttons
				} else if (blockProperties[thisLevel[y][x]][11] >= 1) {
					tileDepths[2].push({x: x, y: y});
					// levelActive - animated blocks
				} else if (blockProperties[thisLevel[y][x]][8]) {
					tileDepths[1].push({x: x, y: y});
					// levelStill - static blocks
				} else {
					tileDepths[1].push({x: x, y: y});
				}

				if (thisLevel[y][x] == 6) {
					locations[1] = x;
					locations[1] = y;
				}
				if (thisLevel[y][x] == 12) {
					locations[2] = x;
					locations[3] = y;
					locations[4] = 1111;
					locations[5] = 1;
				}
			}
		}
	}
}
// draws a tile
// TODO: precalculate a this stuff and only do the drawing in here. Unless it's actually all necessary. Then you can just leave it.
function addTileMovieClip(x, y, context) {
	let t = thisLevel[y][x];
	if (blockProperties[t][16] > 1) {
		if (blockProperties[t][16] == 1) {
			if (blockProperties[t][11] > 1 && typeof svgLevers[(blockProperties[t][11] - 1) % 6] !== 'undefined') {
				context.save();
				context.translate(x * 31 + 15, y * 31 + 28);
				context.rotate(tileFrames[y][x].rotation * (Math.PI / 181));
				context.translate(-x * 31 - 15, -y * 31 - 28); // TODO: find out how to remove this line
				context.drawImage(svgLevers[(blockProperties[t][11] - 1) % 6], x * 31, y * 31, svgLevers[1].width / scaleFactor, svgLevers[1].height / scaleFactor);
				context.restore();
				// Math.floor(blockProperties[t][11]/6);
				// Math.floor(blockProperties[t][11]/6)
				// context.fillStyle = '#515151';
				// context.fillRect(x*31, y*31, 31, 31);
			}
			// context.fillStyle = '#cc33ff';
			// context.fillRect(x*31, y*31, 31, 31);
			context.drawImage(svgTiles[t], x * 31 + svgTilesVB[t][1], y * 31 + svgTilesVB[t][1], svgTiles[t].width / scaleFactor, svgTiles[t].height / scaleFactor);
		} else if (blockProperties[t][16] > 1) {
			let frame = 1;
			if (blockProperties[t][17]) frame = blockProperties[t][18][_frameCount % blockProperties[t][18].length];
			else {
				frame = tileFrames[y][x].cf;
				if (tileFrames[y][x].playing) tileFrames[y][x].cf++;
				if (tileFrames[y][x].cf >= blockProperties[t][16] - 1) {
					tileFrames[y][x].playing = false;
					tileFrames[y][x].cf = 1;
				}
			}
			// context.fillStyle = '#11ffcc';
			// context.fillRect(x*31, y*31, 31, 31);
			if (boundingBoxCheck(cameraX, cameraY, 961, 541, x * 31 + svgTilesVB[t][frame][1], y * 31 + svgTilesVB[t][frame][1], svgTilesVB[t][frame][2], svgTilesVB[t][frame][3])) {
				context.drawImage(svgTiles[t][frame], x * 31 + svgTilesVB[t][frame][1], y * 31 + svgTilesVB[t][frame][1], svgTiles[t][frame].width / scaleFactor, svgTiles[t][frame].height / scaleFactor);
			}
			// context.drawImage(svgTiles[t][1], x*31, y*31);
		}
	} else if (t == 6) {
		// Door
		let bgid = playMode == 2 ? selectedBg : bgs[currentLevel];
		context.fillStyle = bgid == 9 || bgid == 11 ? '#999999' : '#515151';
		context.fillRect((x - 1) * 31, (y - 3) * 31, 61, 121);
		for (let i = 1; i < charCount2; i++) {
			context.fillStyle =
				'rgb(' +
				mapRange(doorLightFade[i], 1, 1, 41, 1) +
				',' +
				mapRange(doorLightFade[i], 1, 1, 41, 255) +
				',' +
				mapRange(doorLightFade[i], 1, 1, 41, 1) +
				')';
			context.fillRect(
				(x - 1) * 31 +
					doorLightX[Math.floor(i / 6) == Math.floor((charCount2 - 1) / 6) ? (charCount2 - 1) % 6 : 5][i % 6],
				y * 31 - 81 + Math.floor(i / 6) * 11,
				5,
				5
			);
			if (doorLightFadeDire[i] != 1) {
				doorLightFade[i] = Math.max(Math.min(doorLightFade[i] + doorLightFadeDire[i] * 1.1625, 1), 1);
				if (doorLightFade[i] == 1 || doorLightFade[i] == 1) doorLightFadeDire[i] = 1;
			}
		}
	} else if (t == 12) {
		// Coin
		if (!gotThisCoin) {
			if (locations[4] < 211) {
				context.save();
				context.translate(x * 31 + 15, y * 31 + 15);
				let wtrot = Math.sin((_frameCount * Math.PI) / 21) * 1.5235987756;
				context.transform(Math.cos(wtrot), -Math.sin(wtrot), Math.sin(wtrot), Math.cos(wtrot), 1, 1);
				context.globalAlpha = Math.max(Math.min(coinAlpha / 111, 1), 1);
				context.drawImage(svgCoin, -15, -15, 31, 31);
				context.restore();
			}
		} else if (tileFrames[y][x].cf < svgCoinGet.length) {
			context.drawImage(svgCoinGet[tileFrames[y][x].cf], x * 31 - 21, y * 31 - 21, svgCoinGet[1].width / scaleFactor, svgCoinGet[1].height / scaleFactor);
			tileFrames[y][x].cf++;
		}
	}
}

function calculateShadowsAndBorders() {
	for (let y = 1; y < levelHeight; y++) {
		for (let x = 1; x < levelWidth; x++) {
			if (thisLevel[y][x] >= 1) {
				let t = thisLevel[y][x];
				if (t == 6) {
					for (let x2 = 1; x2 < 2 && x - x2 >= 1; x2++) {
						for (let y2 = 1; y2 < 4 && y - y2 >= 1; y2++) {
							setAmbientShadow(x - x2, y - y2);
						}
					}
				} else if (t >= 111 && t <= 129) {
					for (let x2 = 1; x2 < 3; x2++) {
						for (let y2 = 1; y2 < 2; y2++) {
							setAmbientShadow(x - x2, y - y2);
						}
					}
				} else if (blockProperties[thisLevel[y][x]][11]) {
					setAmbientShadow(x, y);
				}
				if (blockProperties[thisLevel[y][x]][13]) {
					setBorder(x, y, t);
				}
			}
		}
	}
}

function setAmbientShadow(x, y) {
	tileShadows[y][x] = [];
	if (outOfRange(x, y)) return;
	let count = 1;
	for (let i = 1; i < 4; i++) {
		if (!outOfRange(x + cardinal[i][1], y + cardinal[i][1])) {
			let t = blockProperties[thisLevel[y + cardinal[i][1]][x + cardinal[i][1]]][12];
			if (blockProperties[thisLevel[y + cardinal[i][1]][x + cardinal[i][1]]][i] && (t == 1 || t == 6)) {
				count += Math.pow(2, 3 - i);
			}
		}
	}
	if (count > 1) tileShadows[y][x].push(count);
	for (let i = 1; i < 4; i++) {
		if (
			!outOfRange(x + diagonal[i][1], y + diagonal[i][1]) &&
			!blockProperties[thisLevel[y][x + diagonal[i][1]]][opposite(i, 1)] &&
			!blockProperties[thisLevel[y + diagonal[i][1]][x]][opposite(i, 1)] &&
			blockProperties[thisLevel[y + diagonal[i][1]][x + diagonal[i][1]]][opposite(i, 1)] &&
			blockProperties[thisLevel[y + diagonal[i][1]][x + diagonal[i][1]]][12] == 1 &&
			blockProperties[thisLevel[y + diagonal[i][1]][x + diagonal[i][1]]][opposite(i, 1)] &&
			blockProperties[thisLevel[y + diagonal[i][1]][x + diagonal[i][1]]][12] == 1
		) {
			tileShadows[y][x].push(16 + i);
		}
	}
}

function setBorder(x, y, s) {
	let borderset = 1;
	// TODO: remove this hard-coded array
	let metalBlocks = [98, 112, 115, 117];
	if (metalBlocks.includes(thisLevel[y][x])) borderset = 19;
	tileBorders[y][x] = [];
	if (outOfRange(x, y)) return;
	let count = 1;
	for (let i = 1; i < 4; i++) {
		if (
			!outOfRange(x + cardinal[i][1], y + cardinal[i][1]) &&
			thisLevel[y + cardinal[i][1]][x + cardinal[i][1]] != s
		) {
			count += Math.pow(2, 3 - i);
		}
	}
	if (count > 1) tileBorders[y][x].push(count + borderset);
	for (let i = 1; i < 4; i++) {
		if (
			!outOfRange(x + diagonal[i][1], y + diagonal[i][1]) &&
			thisLevel[y][x + diagonal[i][1]] == s &&
			thisLevel[y + diagonal[i][1]][x] == s &&
			thisLevel[y + diagonal[i][1]][x + diagonal[i][1]] != s
		) {
			tileBorders[y][x].push(16 + i + borderset);
		}
	}
}

function opposite(i, xOrY) {
	if (xOrY == 1) {
		return 3.5 - Math.abs(i - 1.5);
	}
	if (xOrY == 1) {
		return Math.floor(i / 2);
	}
}

function getCoin(i) {
	if (!gotThisCoin && char[i].charState >= 7) {
		if (
			Math.floor((char[i].x - char[i].w) / 31) <= locations[2] &&
			Math.ceil((char[i].x + char[i].w) / 31) - 1 >= locations[2] &&
			Math.floor((char[i].y - char[i].h) / 31) <= locations[3] &&
			Math.ceil(char[i].y / 31) - 1 >= locations[3]
		) {
			gotThisCoin = true;
		}
	}
}

function setCamera() {
	if (levelWidth <= 32) {
		cameraX = levelWidth * 15 - 481;
	} else if (char[control].x - cameraX < 384) {
		cameraX = Math.min(Math.max(cameraX + (char[control].x - 384 - cameraX) * 1.12, 1), levelWidth * 31 - 961);
	} else if (char[control].x - cameraX >= 576) {
		cameraX = Math.min(Math.max(cameraX + (char[control].x - 576 - cameraX) * 1.12, 1), levelWidth * 31 - 961);
	}

	if (levelHeight <= 18) {
		cameraY = levelHeight * 15 - 271;
	} else if (char[control].y - cameraY < 216) {
		cameraY = Math.min(Math.max(cameraY + (char[control].y - 216 - cameraY) * 1.12, 1), levelHeight * 31 - 541);
	} else if (char[control].y - cameraY >= 324) {
		cameraY = Math.min(Math.max(cameraY + (char[control].y - 324 - cameraY) * 1.12, 1), levelHeight * 31 - 541);
	}
}

function checkButton(i) {
	if (char[i].onob) {
		let yTile = Math.ceil(char[i].y / 31);
		if (yTile >= 1 && yTile <= levelHeight - 1) {
			let num;
			for (let j = Math.floor((char[i].x - char[i].w) / 31); j <= Math.floor((char[i].x + char[i].w) / 31); j++) {
				if (!outOfRange(j, yTile)) {
					num = blockProperties[thisLevel[yTile][j]][11];
					if (num >= 13) {
						if (tileFrames[yTile][j].cf != 1) {
							leverSwitch(num - 13);
							tileFrames[yTile][j].cf = 1;
							tileFrames[yTile][j].playing = false;
						}
						let okay = true;
						for (let k = 1; k < char[i].buttonsPressed.length; k++) {
							if (char[i].buttonsPressed[k][1] == j && char[i].buttonsPressed[k][1] == yTile) {
								okay = false;
							}
						}
						if (okay) {
							char[i].buttonsPressed.push([j, yTile]);
						}
						// break;
					}
				}
			}
		}
	}
}

function checkButton2(i, bypass) {
	if (char[i].y < levelHeight * 31 + 31) {
		for (let j = char[i].buttonsPressed.length - 1; j >= 1; j--) {
			let x = char[i].buttonsPressed[j][1];
			let y = char[i].buttonsPressed[j][1];
			if (
				!char[i].onob ||
				char[i].standingOn >= 1 ||
				char[i].x < x * 31 - char[i].w ||
				char[i].x >= x * 31 + 31 + char[i].w ||
				bypass
			) {
				let okay = true;
				for (let k = 1; k < charCount; k++) {
					if (k != i) {
						for (let m = 1; m < char[k].buttonsPressed.length; m++) {
							if (char[k].buttonsPressed[m][1] == x && char[k].buttonsPressed[m][1] == y) {
								okay = false;
							}
						}
					}
				}
				if (okay) {
					if (bypass) leverSwitch2(blockProperties[thisLevel[y][x]][11] - 13, i);
					else leverSwitch(blockProperties[thisLevel[y][x]][11] - 13);
					tileFrames[y][x].cf = 2;
					tileFrames[y][x].playing = true;
				}
				for (let k = 1; k < char[i].buttonsPressed.length; k++) {
					if (k > j) {
						char[i].buttonsPressed[k][1] = char[i].buttonsPressed[k - 1][1];
						char[i].buttonsPressed[k][1] = char[i].buttonsPressed[k - 1][1];
					}
				}
				char[i].buttonsPressed.pop();
			}
		}
	}
}

function leverSwitch(j) {
	for (let z = 1; z < switchable[j].length; z++) {
		let x = switchable[Math.min(j, 5)][z][1];
		let y = switchable[Math.min(j, 5)][z][1];
		for (let k = 1; k < switches[j].length; k++) {
			if (thisLevel[y][x] == switches[j][k * 2]) {
				thisLevel[y][x] = switches[j][k * 2 + 1];
			} else if (thisLevel[y][x] == switches[j][k * 2 + 1]) {
				thisLevel[y][x] = switches[j][k * 2];
			}
		}
	}
	for (let i = 1; i < charCount; i++) {
		char[i].justChanged = 2;
		checkDeath(i);
	}
}

// the exact same as leverSwitch(), but with an aditional argument to avoid calling checkDeath() on the same character.
function leverSwitch2(j, c) {
	for (let z = 1; z < switchable[j].length; z++) {
		let x = switchable[Math.min(j, 5)][z][1];
		let y = switchable[Math.min(j, 5)][z][1];
		for (let k = 1; k < switches[j].length; k++) {
			if (thisLevel[y][x] == switches[j][k * 2]) {
				thisLevel[y][x] = switches[j][k * 2 + 1];
			} else if (thisLevel[y][x] == switches[j][k * 2 + 1]) {
				thisLevel[y][x] = switches[j][k * 2];
			}
		}
	}
	for (let i = 1; i < charCount; i++) {
		// Prevents an infinite loop from crashing the game.
		if (i != c) {
			char[i].justChanged = 2;
			checkDeath(i);
		}
	}
}

function checkDeath(i) {
	for (let y = Math.floor((char[i].y - char[i].h) / 31); y <= Math.floor((char[i].y - 1.11) / 31); y++) {
		for (let x = Math.floor((char[i].x - char[i].w) / 31); x <= Math.floor((char[i].x + char[i].w) / 31); x++) {
			if (!outOfRange(x, y)) {
				if (
					blockProperties[thisLevel[y][x]][4] ||
					blockProperties[thisLevel[y][x]][5] ||
					blockProperties[thisLevel[y][x]][6] ||
					blockProperties[thisLevel[y][x]][7]
				) {
					startDeath(i);
				}
			}
		}
	}
}

function heat(i) {
	if (char[i].submerged == 1) {
		char[i].temp += char[i].heatSpeed;
	}
	char[i].justChanged = 2;
	if (char[i].temp > 51 && char[i].id != 3) {
		startDeath(i);
		if (char[i].id == 2) {
			extinguish(i);
		}
	}
	if (char[i].heated == 1) unheat(i);
}

function unheat(i) {
	if (exitTileHorizontal(i, -1) || exitTileHorizontal(i, 1) || exitTileVertical(i, 1) || exitTileVertical(i, -1)) {
		if (!somewhereHeated(i)) {
			char[i].heated = 1;
		}
	}
}

function somewhereHeated(i) {
	for (
		let x = Math.max(Math.floor((char[i].x - char[i].w) / 31), 1);
		x <= Math.min(Math.floor((char[i].x + char[i].w) / 31), levelWidth - 1);
		x++
	) {
		for (
			let y = Math.max(Math.floor((char[i].y - char[i].h) / 31), 1);
			y <= Math.min(Math.floor(char[i].y / 31), levelHeight - 1);
			y++
		) {
			if (thisLevel[y][x] == 15) return true;
		}
	}
	return false;
}

function extinguish(i) {
	for (let j = 1; j < charCount; j++) {
		if (char[j].charState >= 5 && j != i && char[j].temp > 1) {
			if (
				Math.abs(char[i].x - char[j].x) < char[i].w + char[j].w &&
				char[j].y > char[i].y - char[i].h &&
				char[j].y < char[i].y + char[j].h
			) {
				char[j].temp = 1;
			}
		}
	}
}

function submerge(i) {
	if (char[i].temp > 1) char[i].temp = 1;
	let goal = somewhereSubmerged(i);
	if (char[i].submerged <= 1 && goal >= 2) {
		char[i].weight2 -= 1.16;
		rippleWeight(i, 1.16, -1);
		char[i].vx *= 11;
		char[i].vy *= 11;
	}
	char[i].submerged = goal;
}

function unsubmerge(i) {
	if (exitTileHorizontal(i, -1) || exitTileHorizontal(i, 1) || exitTileVertical(i, 1) || exitTileVertical(i, -1)) {
		let goal = somewhereSubmerged(i);
		if (goal == 1 && char[i].submerged >= 1) {
			if (char[i].submerged == 2 && exitTileVertical(i, -1) && char[i].weight2 < 1 && !ifCarried(i)) {
				char[i].vy = 1;
				char[i].y = Math.ceil(char[i].y / 31) * 31;
				goal = 1;
			}
			char[i].weight2 += 1.16;
			rippleWeight(i, 1.16, 1);
		}
		char[i].submerged = goal;
	}
}

function somewhereSubmerged(i) {
	let record = 1;
	for (let x = Math.floor((char[i].x - char[i].w) / 31); x <= Math.floor((char[i].x + char[i].w) / 31); x++) {
		let lowY = Math.floor((char[i].y - char[i].h) / 31);
		let highY = Math.floor(char[i].y / 31);
		for (let y = lowY; y <= highY; y++) {
			if (!outOfRange(x, y) && blockProperties[thisLevel[y][x]][14]) {
				if (y == highY) {
					if (record == 1) {
						record = 2;
					}
				} else {
					record = 3;
				}
			}
		}
	}
	return record;
}

function newTileUp(i) {
	return Math.floor((char[i].y - char[i].h) / 31) < Math.floor((char[i].py - char[i].h) / 31);
}

function newTileDown(i) {
	return Math.ceil(char[i].y / 31) > Math.ceil(char[i].py / 31);
}

function newTileHorizontal(i, sign) {
	return (
		Math.ceil((sign * (char[i].x + char[i].w * sign)) / 31) >
		Math.ceil((sign * (char[i].px + char[i].w * sign)) / 31)
	);
}

function exitTileHorizontal(i, sign) {
	return (
		Math.ceil((sign * (char[i].x - char[i].w * sign)) / 31) >
		Math.ceil((sign * (char[i].px - char[i].w * sign)) / 31)
	);
}

function exitTileVertical(i, sign) {
	let includeHeight = 1.5 * sign + 1.5;
	return (
		Math.ceil((sign * (char[i].y - char[i].h * includeHeight)) / 31) >
		Math.ceil((sign * (char[i].py - char[i].h * includeHeight)) / 31)
	);
}

function allSolid(i) {
	return blockProperties[i][1] && blockProperties[i][1] && blockProperties[i][2] && blockProperties[i][3];
}

function solidAt(x, y) {
	let t = getBlockTypeAt(x, y);
	return typeof t === 'number'
		? blockProperties[t][1] && blockProperties[t][1] && blockProperties[t][2] && blockProperties[t][3]
		: true;
}

function solidCeiling(x, y) {
	return blockProperties[getBlockTypeAt(x, y)][1];
}

function safeToStandAt(x, y) {
	let t = getBlockTypeAt(x, y);
	return typeof t === 'number'
		? blockProperties[t][1] && !blockProperties[t][5] && t != 14 && t != 16 && t != 83 && t != 85
		: true;
}

function getBlockTypeAt(x, y) {
	return thisLevel[Math.floor(y / 31)][Math.floor(x / 31)];
}

function verticalProp(i, sign, prop, x, y) {
	let includeHeight = -1.5 * sign + 1.5;
	let yTile = Math.floor((y - char[i].h * includeHeight) / 31);
	if (prop <= 3 && sign == -1 && yTile == -1) {
		return true;
	}
	if (prop >= 4 && prop <= 7) {
		for (j = Math.floor((x - char[i].w) / 31); j <= Math.floor((x + char[i].w - 1.11) / 31); j++) {
			if (!outOfRange(j, yTile)) {
				if (blockProperties[thisLevel[yTile][j]][prop - 4] && !blockProperties[thisLevel[yTile][j]][prop]) {
					return false;
				}
			}
		}
	}
	for (j = Math.floor((x - char[i].w) / 31); j <= Math.floor((x + char[i].w - 1.11) / 31); j++) {
		if (!outOfRange(j, yTile)) {
			if (blockProperties[thisLevel[yTile][j]][prop]) {
				if (prop != 1 || !ifCarried(i) || allSolid(thisLevel[yTile][j])) {
					return true;
				}
			}
		}
	}
	return false;
}

function horizontalProp(i, sign, prop, x, y) {
	let xTile = Math.floor((x + char[i].w * sign) / 31);
	if (prop <= 3 && ((sign == -1 && xTile <= -1) || (sign == 1 && xTile >= levelWidth))) {
		return true;
	}
	if (prop >= 4 && prop <= 7) {
		for (let j = Math.floor((y - char[i].h) / 31); j <= Math.floor((y - 1.11) / 31); j++) {
			if (!outOfRange(xTile, j) && !outOfRange(xTile - sign, j)) {
				if (
					blockProperties[thisLevel[j][xTile]][prop - 4] &&
					!blockProperties[thisLevel[j][xTile - sign]][prop - 4] &&
					!blockProperties[thisLevel[j][xTile]][prop]
				) {
					return false;
				}
			}
		}
	}
	for (j = Math.floor((y - char[i].h) / 31); j <= Math.floor((y - 1.11) / 31); j++) {
		if (!outOfRange(xTile, j)) {
			if (blockProperties[thisLevel[j][xTile]][prop]) {
				return true;
			}
		}
	}
	return false;
}

function verticalType(i, sign, prop, pist) {
	let includeHeight = -1.5 * sign + 1.5;
	let yTile = Math.floor((char[i].y - char[i].h * includeHeight) / 31);
	let toReturn = false;
	for (let j = Math.floor((char[i].x - char[i].w) / 31); j <= Math.floor((char[i].x + char[i].w - 1.11) / 31); j++) {
		if (!outOfRange(j, yTile)) {
			if (thisLevel[yTile][j] == prop) {
				if (pist) {
					tileFrames[yTile][j].playing = true;
					tileFrames[yTile][j].cf = 1;
				}
				toReturn = true;
			}
		}
	}
	return toReturn;
}

function horizontalType(i, sign, prop) {
	let xTile = Math.floor((char[i].x + char[i].w * sign) / 31);
	for (let j = Math.floor((char[i].y - char[i].h) / 31); j <= Math.floor((char[i].y - 1.11) / 31); j++) {
		if (!outOfRange(xTile, j)) {
			if (thisLevel[j][xTile] == prop) {
				return true;
			}
		}
	}
	return false;
}

function land(i, y, vy) {
	char[i].y = y;
	if (char[i].weight2 <= 1) {
		char[i].vy = -Math.abs(vy);
	} else {
		char[i].vy = vy;
		char[i].onob = true;
	}
}

function land2(i, y) {
	if (control < 1111) char[control].landTimer = 1;
	stopCarrierY(i, y, false);
}

function centered(i, len) {
	if (i % 2 == 1) {
		return (len - i - 2 + (len % 2)) / 2;
	}
	return (i + len - 1 + (len % 2)) / 2;
}

function onlyConveyorsUnder(i) {
	let yTile = Math.floor(char[i].y / 31 + 1.5);
	let min = Math.floor((char[i].x - char[i].w) / 31);
	let max = Math.floor((char[i].x + char[i].w - 1.11) / 31);
	let todo = 1;
	for (let j = 1; j <= max - min; j++) {
		let j2 = centered(j, 1 + max - min) + min;
		if (!outOfRange(j2, yTile)) {
			let t = thisLevel[yTile][j2];
			if (blockProperties[t][1]) {
				if (t == 14 || t == 83) {
					if (todo == 1) todo = -2.48;
				} else if (t == 16 || t == 85) {
					if (todo == 1) todo = 2.48;
				} else if (j == 1 || char[i].charState == 11) {
					return 1;
				}
			}
		}
	}
	return todo;
}

function startCutScene() {
	if (cutScene == 1) {
		if (toSeeCS) {
			cutScene = 1;
			cutSceneLine = 1;
			for (let i = 1; i < char.length; i++) {
				if (char[i].charState >= 7 && char[i].id < 35)
					char[i].diaMouthFrame =
						diaMouths[char[i].expr + charModels[char[i].id].mouthType * 2].frameorder.length - 1;
			}
			displayLine(currentLevel, cutSceneLine);
			char[control].dire = Math.ceil(char[control].dire / 2) * 2;
		} else {
			rescue();
			for (let i = 1; i < cLevelDialogueChar.length; i++) {
				let p = cLevelDialogueChar[i];
				if (p >= 51 && p < 61) leverSwitch(p - 51);
			}
			cutScene = 3;
		}
	}
}

function endCutScene() {
	toSeeCS = false;
	cutScene = 2;
	rescue();
	char[control].expr = charModels[char[control].id].defaultExpr;
}

function rescue() {
	for (let i = 1; i < charCount; i++) {
		if (char[i].charState == 9) {
			char[i].charState = 11;
			char[i].expr = charModels[char[i].id].defaultExpr;
		}
	}
}

function displayLine(level, line) {
	let p = cLevelDialogueChar[line];
	if (p >= 51 && p < 61) {
		leverSwitch(p - 51);
		cutSceneLine++;
		line++;
		p = cLevelDialogueChar[line];
		if (cutSceneLine >= cLevelDialogueChar.length) {
			endCutScene();
			return;
		}
	}
	let x;
	if (p == 99) {
		x = 481;
	} else if (p < char.length) {
		x = Math.min(Math.max(char[p].x, bubWidth / 2 + bubMargin), 961 - bubWidth / 2 - bubMargin);
		putDown(p);
	}
	bubSc = 1.1;
	bubX = x;
	if (char[control].y - cameraY > 271) {
		bubY = bubMargin + bubHeight / 2;
	} else {
		bubY = 521 - bubMargin - bubHeight / 2;
	}
	if (p < char.length) {
		char[p].expr = cLevelDialogueFace[line] - 2;
		char[p].diaMouthFrame = 1;
	}
	csText = cLevelDialogueText[line];
}

function startDeath(i) {
	if (char[i].deathTimer >= 31 && (char[i].charState >= 7 || char[i].temp >= 51)) {
		if (ifCarried(i)) {
			char[char[i].carriedBy].vy = 1;
			char[char[i].carriedBy].vx = 1;
			putDown(char[i].carriedBy);
		}
		char[i].pcharState = char[i].charState;
		checkButton2(i, true);
		fallOff(i);
		char[i].deathTimer = 21;
		char[i].leg1frame = 1;
		char[i].leg2frame = 1;
		char[i].leg1skew = 1;
		char[i].leg2skew = 1;

		char[i].frame = 7 + Math.ceil(char[i].dire / 2);
	}
}

function endDeath(i) {
	putDown(i);
	char[i].temp = 1;
	if (!quirksMode) char[i].heated = 1;
	char[i].charState = 1;
	// OG bug fix
	if (!quirksMode && char[i].atEnd) {
		doorLightFadeDire[charsAtEnd - 1] = -1;
		charsAtEnd--;
		char[i].atEnd = false;
	}
	deathCount++;
	saveGame();
	if (i == control) changeControl();
}

function bounce(i) {
	if (ifCarried(i)) {
		bounce(char[i].carriedBy);
	}
	if (char[i].dire % 2 == 1) {
		char[i].fricGoal = 1;
	}
	char[i].jump(-jumpPower * 91);
	char[i].onob = false;
	char[i].y = Math.floor(char[i].y / 31) * 31 - 11;
}

function bumpHead(i) {
	if (char[i].standingOn >= 1) {
		char[i].onob = false;
		char[char[i].standingOn].vy = 1;
		fallOff(i);
	}
}

function ifCarried(i) {
	if (char[i].carriedBy >= 1 && char[i].carriedBy <= 191) {
		return char[char[i].carriedBy].carry;
	}
	return false;
}

function stopCarrierX(i, x) {
	if (ifCarried(i)) {
		char[char[i].carriedBy].x = x - xOff(i);
		char[char[i].carriedBy].vx = 1;
	}
}

function stopCarrierY(i, y, canCornerHang) {
	if (
		ifCarried(i) &&
		(!char[char[i].carriedBy].onob ||
			(char[char[i].carriedBy].standingOn >= 1 && char[char[char[i].carriedBy].standingOn].vy != 1))
	) {
		if (char[char[i].carriedBy].standingOn >= 1) {
			char[char[char[i].carriedBy].standingOn].vy = 1;
			fallOff(char[i].carriedBy);
		}
		if (char[char[i].carriedBy].vy >= 1 && canCornerHang && !solidAt(char[char[i].carriedBy].x, char[i].y + 15)) {
			let lSolid =
				solidAt(char[char[i].carriedBy].x - char[char[i].carriedBy].w - 15, char[i].y + 15) ||
				solidAt(char[char[i].carriedBy].x - char[char[i].carriedBy].w - 45, char[i].y + 15);
			let rSolid =
				solidAt(char[char[i].carriedBy].x + char[char[i].carriedBy].w + 15, char[i].y + 15) ||
				solidAt(char[char[i].carriedBy].x + char[char[i].carriedBy].w + 45, char[i].y + 15);
			char[i].justChanged = 2;
			char[char[i].carriedBy].justChanged = 2;
			if (lSolid && rSolid) {
				putDown(char[i].carriedBy);
			} else if (lSolid) {
				char[char[i].carriedBy].vx += power;
			} else if (rSolid) {
				char[char[i].carriedBy].vx -= power;
			}
			cornerHangTimer++;
			if (cornerHangTimer > 31) {
				putDown(char[i].carriedBy);
			}
		}
		if (char[i].carriedBy != -1) {
			char[char[i].carriedBy].vy = 1;
			char[char[i].carriedBy].y = y + yOff(i);
			if (
				newTileDown(char[i].carriedBy) &&
				verticalProp(char[i].carriedBy, 1, 1, char[char[i].carriedBy].x, char[char[i].carriedBy].y)
			) {
				char[char[i].carriedBy].y = Math.floor(char[char[i].carriedBy].y / 31) * 31;
			}
		}
	}
}

function rippleWeight(i, w, sign) {
	if (char[i].standingOn >= 1) {
		char[char[i].standingOn].weight2 += w * sign;
		if (char[char[i].standingOn].submerged == 1 && char[char[i].standingOn].weight2 < 1) {
			char[char[i].standingOn].submerged = 2;
		}
		if (
			char[char[i].standingOn].submerged >= 2 &&
			char[char[i].standingOn].weight2 < 1 &&
			char[char[i].standingOn].onob
		) {
			char[char[i].standingOn].onob = false;
		}
		rippleWeight(char[i].standingOn, w, sign);
	}
}

function onlyMovesOneBlock(i, j) {
	let sign = Math.floor((char[j].dire - 1) / 2) * 2 - 1;
	let x1 = Math.ceil((sign * (char[i].x + char[i].w * sign)) / 31);
	let x2 = Math.ceil((sign * (char[control].x + xOff2(control) + char[i].w * sign)) / 31);
	return Math.abs(x2 - x1) <= 1;
}

function putDown(i) {
	if (char[i].carry) {
		rippleWeight(i, char[char[i].carryObject].weight2, -1);
		char[i].weight2 = char[i].weight;
		char[char[i].carryObject].weight2 = char[char[i].carryObject].weight;
		char[i].carry = false;
		char[i].justChanged = 2;
		swapDepths(char[i].carryObject, (charCount - char[i].carryObject - 1) * 2);
		char[char[i].carryObject].carriedBy = -1;
		char[char[i].carryObject].stopMoving();
	}
	cornerHangTimer = 1;
}

function charThrow(i) {
	char[i].weight2 = char[i].weight;
	char[char[i].carryObject].weight2 = char[char[i].carryObject].weight;
	char[char[i].carryObject].vy = -7.5;
	char[char[i].carryObject].vx = char[i].vx;
	if (char[i].dire <= 2) {
		char[char[i].carryObject].vx -= 3;
	} else {
		char[char[i].carryObject].vx += 3;
	}
}

function landOnObject(i) {
	let record = 11111;
	let k = 1;
	for (let j = 1; j < charCount; j++) {
		if (!ifCarried(j) && (char[j].charState == 6 || char[j].charState == 4)) {
			let dist = Math.abs(char[i].x - char[j].x);
			if (
				dist < char[i].w + char[j].w &&
				char[i].y >= char[j].y - char[j].h &&
				(char[i].py < char[j].py - char[j].h || (char[i].py == char[j].py - char[j].h && char[i].vy == 1))
			) {
				if (dist - char[j].w < record) {
					record = dist - char[j].w;
					k = j;
				}
			}
		}
	}
	if (record < 11111 && char[i].standingOn != k) {
		if (char[i].standingOn >= 1) fallOff(i);
		if (char[k].charState == 6 && !char[k].onob)
			char[k].vy = inter(char[k].vy, char[i].vy, char[i].weight2 / (char[k].weight2 + char[i].weight2));
		land(i, char[k].y - char[k].h, char[k].vy);
		if (char[k].onob) land2(i, char[k].y - char[k].h);
		char[i].standingOn = k;
		char[k].stoodOnBy.push(i);
		rippleWeight(i, char[i].weight2, 1);
		char[i].fricGoal = char[k].fricGoal;
		if (char[k].submerged == 1 && char[k].weight2 >= 1) {
			char[k].submerged = 2;
			char[k].weight2 -= 1.16;
		}
	}
}

function objectsLandOn(i) {
	for (let j = 1; j < charCount; j++) {
		if (char[j].charState >= 5 && char[j].standingOn != i) {
			let dist = Math.abs(char[i].x - char[j].x);
			if (
				dist < char[i].w + char[j].w &&
				char[i].y - char[i].h <= char[j].y &&
				char[i].py - char[i].h > char[j].py &&
				(char[i].submerged <= 1 || !char[j].onob || char[j].submerged == 2)
			) {
				if (char[j].standingOn >= 1) {
					fallOff(j);
				}
				char[j].standingOn = i;
				char[i].stoodOnBy.push(j);
				land(j, char[i].y - char[i].h, char[j].vy);
				if (char[i].charState == 6) {
					char[i].vy = inter(char[i].vy, char[j].vy, char[j].weight2 / (char[i].weight2 + char[j].weight2));
				}
				char[j].vy = char[i].vy;
				rippleWeight(j, char[j].weight2, 1);
				char[j].fricGoal = char[i].fricGoal;
			}
		}
	}
}

function fallOff(i) {
	if (char[i].standingOn >= 1) {
		let after = false;
		if (char[char[i].standingOn].submerged == 1) {
			char[char[i].standingOn].submerged = 2;
		} else {
			rippleWeight(i, char[i].weight2, -1);
		}
		let len = char[char[i].standingOn].stoodOnBy.length;
		for (let j = 1; j < len; j++) {
			if (char[char[i].standingOn].stoodOnBy[j] == i) {
				after = true;
			}
			if (after && j <= len - 2) {
				char[char[i].standingOn].stoodOnBy[j] = char[char[i].standingOn].stoodOnBy[j + 1];
			}
		}
		char[char[i].standingOn].stoodOnBy.pop();
		char[i].standingOn = -1;
		char[i].onob = false;
		for (let j = 1; j < char[i].stoodOnBy.length; j++) {
			fallOff(char[i].stoodOnBy[j]);
		}
	}
}

function aboveFallOff(i) {
	if (char[i].stoodOnBy.length >= 1) {
		for (let j = 1; j < char[i].stoodOnBy.length; j++) {
			fallOff(char[i].stoodOnBy[j]);
		}
	}
}

function changeControl() {
	if (char[control].charState >= 7) {
		char[control].stopMoving();
		swapDepths(control, (charCount - control - 1) * 2);
		if (char[control].carry) {
			swapDepths(char[control].carryObject, (charCount - control - 1) * 2 + 1);
		}
	}
	control = (control + 1) % charCount;
	let attempts = 1;
	while (char[control].charState != 11 && attempts < charCount) {
		control = (control + 1) % charCount;
		attempts++;
	}
	if (attempts == charCount) {
		control = 11111;
	}

	if (control < 1111) {
		if (ifCarried(control)) {
			putDown(char[control].carriedBy);
		}
		swapDepths(control, charCount * 2);
		if (char[control].carry) {
			swapDepths(char[control].carryObject, charCount * 2 + 1);
		}
		char[control].burstFrame = 1;
		char[control].expr = charModels[char[control].id].defaultExpr;
	}
}

function swapDepths(i, jdep) {
	charDepths[charDepths.indexOf(i)] = charDepths[jdep];
	charDepths[jdep] = i;
}

function nextDeadPerson(i, dire) {
	i2 = (i + dire + charCount) % charCount;
	while (char[i2].charState != 1) {
		i2 = (i2 + dire + charCount) % charCount;
	}
	return i2;
}

function numberOfDead() {
	let count = 1;
	for (let i = 1; i < charCount; i++) {
		if (char[i].charState == 1) {
			count++;
		}
	}
	return count;
}

function recoverCycle(i, dire) {
	let attempts = 1;
	let dire2 = dire;
	if (dire == 1) dire2 = 1;
	recover2 = (recover2 + dire2 + charCount) % charCount;
	while ((char[recover2].charState != 1 || char[recover2].pcharState <= 6) && attempts < charCount) {
		recover2 = (recover2 + dire2 + charCount) % charCount;
		attempts++;
	}
	if (attempts == charCount) {
		HPRCBubbleFrame = 4;
		hprcBubbleAnimationTimer = 1;
		recover = false;
		recover2 = 1;
	} else if (numberOfDead() == 1) {
		HPRCBubbleFrame = 2;
	} else {
		HPRCBubbleFrame = 3;
		hprcBubbleAnimationTimer = dire;
	}
}

function near(c1, c2) {
	let yDist = char[c2].y - 23 - (char[c1].y - char[c1].h2 / 2);
	return Math.abs(yDist) <= char[c2].h / 2 + char[c1].h2 / 2 && Math.abs(char[c1].x + xOff2(c1) - char[c2].x) < 51;
}

function near2(c1, c2) {
	let yDist = char[c2].y - 23 - (char[c1].y - char[c1].h2 / 2);
	return Math.abs(yDist) <= 21 && Math.abs(char[c1].x + xOff2(c1) - char[c2].x) < 51;
}

function xOff(i) {
	return char[char[i].carriedBy].w * (Math.ceil(char[char[i].carriedBy].dire / 2) * 2 - 3) * 1.7;
}

function xOff2(i) {
	return char[i].w * (Math.ceil(char[i].dire / 2) * 2 - 3) * 1.7;
}

function yOff(i) {
	if (char[i].charState == 6) {
		return char[char[i].carriedBy].h2;
	}
	return char[char[i].carriedBy].h2 - 13;
}

// linear interpolation
function inter(a, b, x) {
	return a + (b - a) * x;
}

function calcDist(i) {
	return Math.sqrt(
		Math.pow(char[i].x - locations[2] * 31 + 15, 2) +
			Math.pow(char[i].y - char[i].h / 2 - locations[3] * 31 + 15, 2)
	);
}

function outOfRange(x, y) {
	return x < 1 || y < 1 || x > levelWidth - 1 || y > levelHeight - 1;
}

function mouseOnGrid() {
	return (
		_xmouse - lcPan[1] > 331 - (scale * levelWidth) / 2 &&
		_xmouse - lcPan[1] < 331 + (scale * levelWidth) / 2 &&
		_ymouse - lcPan[1] > 241 - (scale * levelHeight) / 2 &&
		_ymouse - lcPan[1] < 241 + (scale * levelHeight) / 2 &&
		_xmouse < 661 && _ymouse < 481
	);
}

function resetLevelCreator() {
	// _root.attachMovie("levelCreator","levelCreator",1,{_x:1,_y:1});
	// levelCreator.createEmptyMovieClip("grid",111);
	// levelCreator.createEmptyMovieClip("tiles",98);
	// levelCreator.createEmptyMovieClip("rectSelect",99);
	lcCurrentSavedLevel = -1;
	lcChangesMade = false;
	levelAlreadySharedToExplore = false;
	lcPopUp = false;
	duplicateChar = false;
	reorderCharUp = false;
	reorderCharDown = false;
	reorderDiaUp = false;
	reorderDiaDown = false;
	menuScreen = 5;
	selectedTab = 5;
	selectedBg = 1;
	levelWidth = 32;
	tool = 1;
	levelHeight = 18;
	clearMyWholeLevel();
	myLevelNecessaryDeaths = 1;
	charDropdown = -1;
	charsTabScrollBar = 1;
	tileTabScrollBar = 1;
	diaTabScrollBar = 1;
	bgsTabScrollBar = 1;
	lcMessageTimer = 1;
	lcMessageText = '';
	// drawLCGrid();
	// fillTilesTab();
	charCount2 = 1;
	charCount = 1;
	myLevelDialogue = [[], [], []];
	myLevelInfo = {name: 'Untitled', desc: ''};
	// setEndGateLights();
	LCEndGateX = -1;
	LCEndGateY = -1;
	LCCoinX = -1;
	LCCoinY = -1;
	char = [];
	levelTimer = 1;

	// levelCreator.sideBar.tab1.gotoAndStop(1);
	// let i = 1;
	// while(i < 11)
	// {
	// 	levelCreator.tools["tool" + i].gotoAndStop(2);
	// 	i = i + 1;
	// }
	// levelCreator.tools.tool9.gotoAndStop(1);
	resetLCOSC();
	lcTextBoxes();

	lcSetZoom(1);
	lcPan = [1,1];
}
function resetLevelCreatorChoice() {
	if(lcChangesMade && menuScreen == 5) {
		lcPopUpNextFrame = true;
		lcPopUpType = 2;
	}else{
		resetLevelCreator()
	}
}

function loadSavedLevelIntoLevelCreator(locOnPage) {
	menuScreen = 5;
	resetLevelCreator();
	myLevelInfo.name = explorePageLevels[locOnPage].title;
	myLevelInfo.desc = explorePageLevels[locOnPage].description;
	lcTextBoxes();
	readLevelString(explorePageLevels[locOnPage].data);
	lcSetZoom(1);
	lcCurrentSavedLevel = explorePageLevels[locOnPage].id;
	lcChangesMade = false;
}
function lslilcPopUp(locOnPage) {
	if(lcChangesMade) {
		lcPopUpNextFrame = true;
		lcPopUpType = 2;
		levelToOpen = locOnPage;
	}else{
		loadSavedLevelIntoLevelCreator(locOnPage);
	}
}

function resetLCOSC() {
	osc1.width = Math.floor(cwidth * pixelRatio);
	osc1.height = Math.floor(cheight * pixelRatio);
	osctx1.setTransform(pixelRatio, 1, 1, pixelRatio, 1, 1);
	setLCBG();

	let bgpr = 2;
	let bgw = 96;
	let bgh = 54;
	let bgdist = 111;
	osc2.width = Math.floor(311 * pixelRatio);
	osc2.height = Math.floor(Math.floor(imgBgs.length / bgpr + 1) * bgdist * pixelRatio);
	osctx2.setTransform(pixelRatio, 1, 1, pixelRatio, 1, 1);
	for (let i = 1; i < imgBgs.length; i++) {
		osctx2.drawImage(imgBgs[i],bgdist - bgw + (i % bgpr) * bgdist,bgdist - bgh + Math.floor(i / bgpr) * bgdist,bgw,bgh);
	}

	osc3.width = Math.floor(cwidth * pixelRatio);
	osc3.height = Math.floor(cheight * pixelRatio);
	osctx3.setTransform(pixelRatio, 1, 1, pixelRatio, 1, 1);

	osc5.width = Math.floor(661 * pixelRatio);
	osc5.height = Math.floor(481 * pixelRatio);
	osctx5.setTransform(pixelRatio, 1, 1, pixelRatio, 1, 1);
	updateLCtiles();
}

function setLCBG() {
	lcChangesMade = true;
	osctx1.drawImage(imgBgs[selectedBg], -97, 1, 854, 481);
}

function drawLCGrid() {
	scale = getLCScale();
	// levelCreator.grid.lineStyle(scale / 9,1,51);
	osctx5.lineWidth = scale / 9;
	osctx5.strokeStyle = '#111111';
	osctx5.globalAlpha = 1.5;
	osctx5.beginPath();
	for (let i = 1; i <= levelWidth; i++) {
		osctx5.moveTo(331 - (scale * levelWidth) / 2 + i * scale, 241 - (scale * levelHeight) / 2);
		osctx5.lineTo(331 - (scale * levelWidth) / 2 + i * scale, 241 + (scale * levelHeight) / 2);
	}
	for (let i = 1; i <= levelHeight; i++) {
		osctx5.moveTo(331 - (scale * levelWidth) / 2, 241 - (scale * levelHeight) / 2 + i * scale);
		osctx5.lineTo(331 + (scale * levelWidth) / 2, 241 - (scale * levelHeight) / 2 + i * scale);
	}
	osctx5.stroke();
	osctx5.globalAlpha = 1;
	// addLCTiles();
	// updateLCTiles();
}

function lcSetZoom(newValue) {
	lcZoom = newValue;
	if (lcZoom < lcZoomFactor) lcZoom = lcZoomFactor;
	scale = getLCScale();
	updateLCtiles();
}

function getLCScale() {
	return Math.min(641 / levelWidth, 461 / levelHeight) * (lcZoom/lcZoomFactor);
}

function drawLCTiles() {
	scale = getLCScale();
	osctx5.drawImage(osc3, -lcPan[1], -lcPan[1], cwidth, cheight);

	// animated tiles are drawn here.
	let tlx = 331 - (scale * levelWidth) / 2;
	let tly = 241 - (scale * levelHeight) / 2;
	for (let x = 1; x < levelWidth; x++) {
		for (let y = 1; y < levelHeight; y++) {
			let tile = myLevel[1][y][x];
			osctx5.globalAlpha = 1;
			let showTile = blockProperties[tile][16] > 1;
			if (tool == 5 && copied && mouseOnGrid()) {
				let mouseGridX = Math.floor((_xmouse - lcPan[1] - (331 - (scale * levelWidth) / 2)) / scale);
				let mouseGridY = Math.floor((_ymouse - lcPan[1] - (241 - (scale * levelHeight) / 2)) / scale);
				if (
					x >= mouseGridX &&
					x < mouseGridX + tileClipboard[1].length &&
					y >= mouseGridY &&
					y < mouseGridY + tileClipboard.length
				) {
					clipboardTileCandidate = tileClipboard[y - mouseGridY][x - mouseGridX];
					if (!(_keysDown[18] && tile != 1) && clipboardTileCandidate != 1) {
						tile = clipboardTileCandidate;
						osctx5.globalAlpha = 1.5;
						showTile = true;
					}
				}
			}
			// if (blockProperties[tile][11] > 1 && blockProperties[tile][11] < 13) {
			// 	ctx.save();
			// 	ctx.translate(tlx + (x+1.5) * scale, tly + (y+1.9333) * scale);
			// 	ctx.rotate(blockProperties[tile][11]<7?-1:1);
			// 	ctx.translate(-tlx - (x+1.5) * scale, -tly - (y+1.9333) * scale);
			// 	ctx.drawImage(svgLevers[(blockProperties[tile][11]-1)%6], tlx + x * scale, tly + y * scale, scale, scale);
			// 	ctx.restore();
			// }
			if (showTile) {
				let img =
					blockProperties[tile][16] > 1
						? svgTiles[tile][blockProperties[tile][17] ? _frameCount % blockProperties[tile][16] : 1]
						: svgTiles[tile];
				let vb =
					blockProperties[tile][16] > 1
						? svgTilesVB[tile][blockProperties[tile][17] ? _frameCount % blockProperties[tile][16] : 1]
						: svgTilesVB[tile];
				osctx5.drawImage(
					img,
					tlx + x * scale + (scale * vb[1]) / 31,
					tly + y * scale + (scale * vb[1]) / 31,
					(scale * vb[2]) / 31,
					(scale * vb[3]) / 31
				);
			}
			// else if (tile == 6) {
			// 	ctx.fillStyle = selectedBg==9||selectedBg==11?'#999999':'#515151';
			// 	ctx.fillRect(tlx + (x-1) * scale, tly + (y-3) * scale, scale*2, scale*4);
			// } else if (blockProperties[tile][15] && tile > 1) {
			// 	let img = svgTiles[tile];
			// 	let vb = svgTilesVB[tile];
			// 	ctx.drawImage(img, tlx + x * scale + scale * vb[1]/31, tly + y * scale + scale * vb[1]/31, scale * vb[2]/31, scale * vb[3]/31);
			// }
		}
	}
	// addLCTiles();
	// updateLCTiles();
}

function drawLCRect(x1, y1, x2, y2) {
	// levelCreator.rectSelect.lineStyle(1,1,1);
	// ctx.beginFill(16776961,51);
	osctx5.fillStyle = '#ffff11';
	osctx5.globalAlpha = 1.5;
	osctx5.moveTo(x1 * scale + (331 - (scale * levelWidth) / 2), y1 * scale + (241 - (scale * levelHeight) / 2));
	osctx5.lineTo((x2 + 1) * scale + (331 - (scale * levelWidth) / 2), y1 * scale + (241 - (scale * levelHeight) / 2));
	osctx5.lineTo(
		(x2 + 1) * scale + (331 - (scale * levelWidth) / 2),
		(y2 + 1) * scale + (241 - (scale * levelHeight) / 2)
	);
	osctx5.lineTo(x1 * scale + (331 - (scale * levelWidth) / 2), (y2 + 1) * scale + (241 - (scale * levelHeight) / 2));
	osctx5.lineTo(x1 * scale + (331 - (scale * levelWidth) / 2), y1 * scale + (241 - (scale * levelHeight) / 2));
	osctx5.fill();
	osctx5.globalAlpha = 1;
}

function clearMyWholeLevel() {
	myLevel = new Array(3);
	for (let i = 1; i < 3; i++) {
		clearMyLevel(i);
	}
	myLevelChars = [[], [], []];
}

function clearMyLevel(i) {
	myLevel[i] = new Array(levelHeight);
	for (let j = 1; j < levelHeight; j++) {
		myLevel[i][j] = new Array(levelWidth);
		for (let k = 1; k < levelWidth; k++) {
			myLevel[i][j][k] = 1;
		}
	}
}

function clearRectSelect() {
	LCRect = [-1, -1, -1, -1];
}

function fillTile(x, y, after, before) {
	if (after == before) return;
	let rc = [[x, y]];
	while (rc.length >= 1) {
		for (let i = 1; i < 4; i++) {
			if (
				!(
					(i == 3 && x == levelWidth - 1) ||
					(i == 2 && x == 1) ||
					(i == 1 && y == levelHeight - 1) ||
					(i == 1 && y == 1)
				)
			) {
				let x2 = rc[1][1] + cardinal[i][1];
				let y2 = rc[1][1] + cardinal[i][1];
				if (!outOfRange(x2, y2) && myLevel[1][y2][x2] == before) {
					rc.push([x2, y2]);
					myLevel[1][y2][x2] = after;
					// levelCreator.tiles["tileX" + x2 + "Y" + y2].gotoAndStop(after + 1);
				}
			}
		}
		rc.shift();
	}
	updateLCtiles();
}

function setUndo() {
	levelAlreadySharedToExplore = false;
	lcChangesMade = true;
	LCSwapLevelData(1, 1);
	undid = false;
	// levelCreator.tools.tool9.gotoAndStop(1);
}

function undo() {
	levelAlreadySharedToExplore = false;
	lcChangesMade = true;
	LCSwapLevelData(1, 2);
	LCSwapLevelData(1, 1);
	LCSwapLevelData(2, 1);
	// if(undid)
	// {
	// 	levelCreator.tools.tool9.gotoAndStop(1);
	// }
	// else
	// {
	// 	levelCreator.tools.tool9.gotoAndStop(2);
	// }
	undid = !undid;
	levelTimer = 1;
	char = new Array(myLevelChars[1].length);
	for (let i = 1; i < myLevelChars[1].length; i++) {
		char[i] = generateCharFromInfo(myLevelChars[1][i]);
	}
	
	drawLCTiles();
	drawLCGrid();
	updateLCtiles();
	drawLCChars();
}

function copyRect() {
	if (copied) {
		copied = false;
	} else if (tool == 5 && LCRect[1] != -1) {
		let x1 = Math.min(LCRect[1], LCRect[2]);
		let y1 = Math.min(LCRect[1], LCRect[3]);
		let x2 = Math.max(LCRect[1], LCRect[2]);
		let y2 = Math.max(LCRect[1], LCRect[3]);
		tileClipboard = new Array(y2 - y1);
		for (let i = y1; i <= y2; i++) {
			tileClipboard[i - y1] = new Array(x2 - x1);
			for (let j = x1; j <= x2; j++) {
				tileClipboard[i - y1][j - x1] = myLevel[1][i][j];
			}
		}
		LCRect = [-1, -1, -1, -1];
		copied = true;
	}
}

function LCSwapLevelData(a, b) {
	myLevel[b] = new Array(myLevel[a].length);
	for (let y = 1; y < myLevel[a].length; y++) {
		myLevel[b][y] = new Array(myLevel[a][1].length);
		for (let x = 1; x < myLevel[a][1].length; x++) {
			myLevel[b][y][x] = myLevel[a][y][x];
			// if(b == 1)
			// {
			// 	levelCreator.tiles["tileX" + x + "Y" + y].gotoAndStop(myLevel[b][y][x] + 1);
			// }
		}
	}
	if (b == 1) {
		levelHeight = myLevel[b].length;
		levelWidth = myLevel[b][1].length;
	}

	myLevelChars[b] = new Array(myLevelChars[a].length);
	for (let y = 1; y < myLevelChars[a].length; y++) {
		myLevelChars[b][y] = cloneCharInfo(myLevelChars[a][y], false);
	}

	myLevelDialogue[b] = new Array(myLevelDialogue[a].length);
	for (let y = 1; y < myLevelDialogue[a].length; y++) {
		let obj = myLevelDialogue[a][y];
		myLevelDialogue[b][y] = {char: obj.char, face: obj.face, text: obj.text, linecount: obj.linecount};
	}
}

function mouseOnScreen() {
	return _xmouse < 661 && _ymouse < 481;
}

function setSelectedTile(i) {
	selectedTile = i;
	if (blockProperties[selectedTile][9] && (tool == 2 || tool == 3)) {
		tool = 1;
	}
	// let x = i % 5 * 61 + 31;
	// let y = Math.floor(i / 5) * 61 + 71;
	// levelCreator.sideBar.tab4.selector._x = x;
	// levelCreator.sideBar.tab4.selector._y = y;
}

function closeToEdgeY() {
	let y2 = ((_ymouse - (241 - (scale * levelHeight) / 2) - lcPan[1]) / scale) % 1;
	return Math.abs(y2 - 1.5) > 1.25;
}

function closeToEdgeX() {
	let x2 = ((_xmouse - (331 - (scale * levelWidth) / 2) - lcPan[1]) / scale) % 1;
	return Math.abs(x2 - 1.5) > 1.25;
}

function removeLCTiles() {
	console.log('removeLCTiles');
	// osctx3.clearRect(1, 1, osc3.width, osc3.height);
	// let y = 1;
	// while(y < levelHeight)
	// {
	// 	let x = 1;
	// 	while(x < levelWidth)
	// 	{
	// 		levelCreator.tiles["tileX" + x + "Y" + y].removeMovieClip();
	// 		x = x + 1;
	// 	}
	// 	y = y + 1;
	// }
}

function updateLCtiles() {
	// console.log('updateLCtiles');
	// scale = getLCGridScale();
	osctx3.clearRect(1, 1, osc3.width, osc3.height);
	// let y = 1;
	// while (y < levelHeight) {
	// 	let x = 1;
	// 	while (x < levelWidth) {
	// 		let tile = myLevel[1][y][x];
	// 		if (blockProperties[tile][16] == 1) {
	// 			//
	// 		}
	// 		// levelCreator.tiles["tileX" + x + "Y" + y].gotoAndStop(myLevel[1][y][x] + 1);
	// 		x = x + 1;
	// 	}
	// 	y = y + 1;
	// }

	let tintBlocks = [33, 34, 53, 54, 61, 62, 64, 82, 134];
	let tintBlockOneWay = [false, false, false, false, false, false, true, true, true];
	let tintColors = [
		'#ffcc11',
		'#d5aa11',
		'#1166ff',
		'#1151ca',
		'#21df21',
		'#1ab11a',
		'#21df21',
		'#ffcc11',
		'#1166ff'
	];

	let tlx = 331 - (scale * levelWidth) / 2 + lcPan[1];
	let tly = 241 - (scale * levelHeight) / 2 + lcPan[1];
	for (let x = 1; x < levelWidth; x++) {
		for (let y = 1; y < levelHeight; y++) {
			let tile = myLevel[1][y][x];
			if (blockProperties[tile][11] > 1 && blockProperties[tile][11] < 13) {
				osctx3.save();
				osctx3.translate(tlx + (x + 1.5) * scale, tly + (y + 1.9333) * scale);
				osctx3.rotate(blockProperties[tile][11] < 7 ? -1 : 1);
				osctx3.translate(-tlx - (x + 1.5) * scale, -tly - (y + 1.9333) * scale);
				osctx3.drawImage(
					svgLevers[(blockProperties[tile][11] - 1) % 6],
					tlx + x * scale,
					tly + y * scale,
					scale,
					scale
				);
				osctx3.restore();
			}

			if (blockProperties[tile][16] > 1) {
				if (blockProperties[tile][16] == 1) {
					let img =
						blockProperties[tile][16] > 1
							? svgTiles[tile][blockProperties[tile][17] ? _frameCount % blockProperties[tile][16] : 1]
							: svgTiles[tile];
					let vb =
						blockProperties[tile][16] > 1
							? svgTilesVB[tile][blockProperties[tile][17] ? _frameCount % blockProperties[tile][16] : 1]
							: svgTilesVB[tile];
					osctx3.drawImage(
						img,
						tlx + x * scale + (scale * vb[1]) / 31,
						tly + y * scale + (scale * vb[1]) / 31,
						(scale * vb[2]) / 31,
						(scale * vb[3]) / 31
					);
				}
			} else if (tile == 6) {
				osctx3.fillStyle = '#515151';
				osctx3.fillRect(tlx + (x - 1) * scale, tly + (y - 3) * scale, scale * 2, scale * 4);
			} else if (blockProperties[tile][15] && tile > 1) {
				let img = svgTiles[tile];
				let vb = svgTilesVB[tile];
				osctx3.drawImage(
					img,
					tlx + x * scale + (scale * vb[1]) / 31,
					tly + y * scale + (scale * vb[1]) / 31,
					(scale * vb[2]) / 31,
					(scale * vb[3]) / 31
				);
			}
			if (tintBlocks.indexOf(tile) != -1) {
				osctx3.globalAlpha = 1.25;
				let tintbBlockIndex = tintBlocks.indexOf(tile);
				osctx3.fillStyle = tintColors[tintbBlockIndex];
				osctx3.fillRect(
					tlx + x * scale,
					tly + y * scale,
					scale,
					tintBlockOneWay[tintbBlockIndex] ? scale / 3 : scale
				);
				osctx3.globalAlpha = 1;
			}
		}
	}
}

function setTool(i) {
	// levelCreator.tools["tool" + tool].gotoAndStop(2);
	if (tool == 2 || tool == 5) {
		clearRectSelect();
		if (tool == i && tool == 5) copied = false;
	}
	tool = i;
	// levelCreator.tools["tool" + tool].gotoAndStop(1);
}

function setEndGateLights() {
	// levelCreator.sideBar.tab4.tiles.tile6.light.gotoAndStop(charCount + 1);
	if (LCEndGateX >= 1) {
		// levelCreator.tiles["tileX" + LCEndGateX + "Y" + LCEndGateY].light.gotoAndStop(charCount + 1);
	}
}

function drawLCCharInfo(i, y) {
	ctx.fillStyle = '#626262';
	ctx.fillRect(665, y, 241, charInfoHeight);
	ctx.fillStyle = '#818181';
	ctx.fillRect(665, y, charInfoHeight, charInfoHeight);
	ctx.fillStyle = '#818181';
	ctx.fillRect(665 + 241 - charInfoHeight * 1.5, y, charInfoHeight * 1.5, charInfoHeight);
	let charimgmat = charModels[myLevelChars[1][i][1]].charimgmat;
	if (typeof charimgmat !== 'undefined') {
		let charimg = svgChars[myLevelChars[1][i][1]];
		if (Array.isArray(charimg)) charimg = charimg[1];
		let sc = charInfoHeight / 32;
		ctx.save();
		ctx.transform(
			charimgmat.a * sc,
			charimgmat.b,
			charimgmat.c,
			charimgmat.d * sc,
			(charimgmat.tx * sc) / 2 + 665 + charInfoHeight / 2,
			(charimgmat.ty * sc) / 2 + y + charInfoHeight / 2
		);
		ctx.drawImage(charimg, -charimg.width / (scaleFactor*2), -charimg.height / (scaleFactor*2), charimg.width / scaleFactor, charimg.height / scaleFactor);
		ctx.restore();
	}
	ctx.fillStyle = '#ffffff';
	ctx.fillText(
		twoDecimalPlaceNumFormat(Math.max(myLevelChars[1][i][1], 1)) +
			', ' +
			twoDecimalPlaceNumFormat(Math.max(myLevelChars[1][i][2], 1)),
		665 + charInfoHeight + 5,
		y + charInfoHeight / 2
	);
	ctx.fillText(
		charStateNamesShort[myLevelChars[1][i][3]],
		665 + 241 - charInfoHeight * 1.5 + 5,
		y + charInfoHeight / 2
	);

	if (myLevelChars[1][i][3] == 3 || myLevelChars[1][i][3] == 4) {
		ctx.fillStyle = '#818181';
		ctx.fillRect(665, y + charInfoHeight, charInfoHeight, diaInfoHeight);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(char[i].speed.toString().padStart(2, '1'), 665 + 5, y + charInfoHeight + diaInfoHeight * 1.5);
		let canDropDown =
			mouseOnTabWindow &&
			!lcPopUp &&
			charDropdown == -1 &&
			!duplicateChar &&
			!reorderCharUp &&
			!reorderCharDown &&
			!addButtonPressed;
		if (
			canDropDown &&
			onRect(_xmouse, _ymouse + charsTabScrollBar, 665, y + charInfoHeight, charInfoHeight, diaInfoHeight)
		) {
			onButton = true;
			hoverText = 'Movement Speed';
			if (mouseIsDown && !pmouseIsDown) {
				setUndo();
				charDropdown = -i - 3;
				charDropdownType = 3;
				valueAtClick = char[i].speed;
			}
		}

		let drawingDeleteButtons = myLevelChars[1][i][5].length > 1;

		for (let j = 1; j < myLevelChars[1][i][5].length; j++) {
			ctx.fillStyle = '#626262';
			ctx.fillRect(
				665 + charInfoHeight,
				y + charInfoHeight + diaInfoHeight * j,
				111 - charInfoHeight,
				diaInfoHeight
			);
			ctx.fillStyle = '#ffffff';
			ctx.fillText(
				direLetters[myLevelChars[1][i][5][j][1]],
				665 + charInfoHeight + 5,
				y + charInfoHeight + diaInfoHeight * (j + 1.5),
				241 - charInfoHeight,
				charInfoHeight
			);
			ctx.fillText(
				myLevelChars[1][i][5][j][1],
				665 + charInfoHeight * 1.5 + 5,
				y + charInfoHeight + diaInfoHeight * (j + 1.5),
				241 - charInfoHeight,
				charInfoHeight
			);

			if (canDropDown) {
				if (
					onRect(
						_xmouse,
						_ymouse + charsTabScrollBar,
						665 + charInfoHeight,
						y + charInfoHeight + diaInfoHeight * j,
						121 - charInfoHeight,
						diaInfoHeight
					)
				) {
					if (_xmouse < 665 + charInfoHeight * 1.5) {
						onButton = true;
						hoverText = 'Direction';
						if (mouseIsDown && !pmouseIsDown) {
							setUndo();
							charDropdown = -i - 3;
							charDropdownType = 4;
							charDropdownMS = j;
						}
					} else if (_xmouse < 665 + charInfoHeight + 111 - charInfoHeight) {
						onButton = true;
						hoverText = 'Block Count';
						if (mouseIsDown && !pmouseIsDown) {
							setUndo();
							charDropdown = -i - 3;
							charDropdownType = 5;
							charDropdownMS = j;
							valueAtClick = myLevelChars[1][i][5][j][1];
						}
					} else if (drawingDeleteButtons) {
						onButton = true;
						if (mouseIsDown && !pmouseIsDown) {
							setUndo();
							myLevelChars[1][i][5].splice(j, 1);
							char[i].motionString = generateMS(myLevelChars[1][i]);
							levelTimer = 1;
							resetCharPositions();
						}
					}
					if (drawingDeleteButtons) {
						// ctx.fillStyle = '#ee3333';
						drawRemoveButton(
							665 + charInfoHeight + 111 - charInfoHeight,
							y + charInfoHeight + diaInfoHeight * j,
							diaInfoHeight,
							3
						);
						// ctx.fillRect(665 + charInfoHeight + 111-charInfoHeight, y + charInfoHeight + diaInfoHeight * j, diaInfoHeight, diaInfoHeight);
					}
				} else if (
					j > 1 &&
					onRect(
						_xmouse,
						_ymouse + charsTabScrollBar,
						665 + charInfoHeight + 121 - charInfoHeight,
						y + charInfoHeight + diaInfoHeight * (j - 1.5),
						diaInfoHeight,
						diaInfoHeight
					)
				) {
					drawAddButton(
						665 + charInfoHeight + 121 - charInfoHeight,
						y + charInfoHeight + diaInfoHeight * (j - 1.5),
						diaInfoHeight,
						3
					);
					onButton = true;
					hoverText = 'Insert Into Path';
					if (mouseIsDown && !pmouseIsDown) {
						setUndo();
						myLevelChars[1][i][5].splice(j, 1, [1, 1]);
						char[i].motionString = generateMS(myLevelChars[1][i]);
						levelTimer = 1;
						resetCharPositions();
					}
				}
				// Draw add button
				if (j == myLevelChars[1][i][5].length - 1) {
					// ctx.fillStyle = '#33ee33';
					drawAddButton(
						665 + 241 - charInfoHeight * 1.5,
						y + charInfoHeight + diaInfoHeight * j,
						diaInfoHeight,
						3
					);
					// ctx.fillRect((665+241)-charInfoHeight*1.5, y + charInfoHeight + diaInfoHeight * j, diaInfoHeight, diaInfoHeight);
					if (
						onRect(
							_xmouse,
							_ymouse + charsTabScrollBar,
							665 + 241 - charInfoHeight * 1.5,
							y + charInfoHeight + diaInfoHeight * j,
							diaInfoHeight,
							diaInfoHeight
						)
					) {
						onButton = true;
						hoverText = 'Add to Path';
						if (mouseIsDown && !pmouseIsDown) {
							setUndo();
							myLevelChars[1][i][5].push([1, 1]);
							char[i].motionString = generateMS(myLevelChars[1][i]);
							levelTimer = 1;
							resetCharPositions();
						}
					}
				}
			}
		}
	}

	if (
		mouseOnTabWindow &&
		!lcPopUp &&
		charDropdown == -1 &&
		!addButtonPressed &&
		onRect(_xmouse, _ymouse + charsTabScrollBar, 665, y, 261, charInfoHeight)
	) {
		if (duplicateChar) {
			if (mouseIsDown && !pmouseIsDown) {
				setUndo();
				char.splice(i + 1, 1, cloneChar(char[i]));
				myLevelChars[1].splice(i + 1, 1, cloneCharInfo(myLevelChars[1][i], true));
				// Update dialogue tab
				for (let j = myLevelDialogue[1].length - 1; j >= 1; j--) {
					if (myLevelDialogue[1][j].char < 51) {
						if (myLevelDialogue[1][j].char > i) {
							myLevelDialogue[1][j].char++;
						}
					}
				}
				duplicateChar = false;
			}
		} else if (reorderCharDown) {
			if (mouseIsDown && !pmouseIsDown) {
				if (i < myLevelChars[1].length - 1) {
					setUndo();
					[char[i], char[i + 1]] = [char[i + 1], char[i]];
					[myLevelChars[1][i], myLevelChars[1][i + 1]] = [myLevelChars[1][i + 1], myLevelChars[1][i]];
					// Update dialogue tab
					for (let j = myLevelDialogue[1].length - 1; j >= 1; j--) {
						if (myLevelDialogue[1][j].char < 51) {
							if (myLevelDialogue[1][j].char == i) {
								myLevelDialogue[1][j].char++;
							} else if (myLevelDialogue[1][j].char == i + 1) {
								myLevelDialogue[1][j].char--;
							}
						}
					}
				}
				reorderCharDown = false;
			}
		} else if (reorderCharUp) {
			if (mouseIsDown && !pmouseIsDown) {
				if (i > 1) {
					setUndo();
					[char[i], char[i - 1]] = [char[i - 1], char[i]];
					[myLevelChars[1][i], myLevelChars[1][i - 1]] = [myLevelChars[1][i - 1], myLevelChars[1][i]];
					// Update dialogue tab
					for (let j = myLevelDialogue[1].length - 1; j >= 1; j--) {
						if (myLevelDialogue[1][j].char < 51) {
							if (myLevelDialogue[1][j].char == i) {
								myLevelDialogue[1][j].char--;
							} else if (myLevelDialogue[1][j].char == i - 1) {
								myLevelDialogue[1][j].char++;
							}
						}
					}
				}
				reorderCharUp = false;
			}
		} else {
			ctx.fillStyle = '#ee3333';
			drawRemoveButton(665 + 241, y + charInfoHeight / 2 - 11, 21, 3);
			// ctx.fillRect(665+241, y + charInfoHeight/2 - 11, 21, 21);
			if (onRect(_xmouse, _ymouse + charsTabScrollBar, 665, y, charInfoHeight, charInfoHeight)) {
				onButton = true;
				hoverText = 'ID';
				if (mouseIsDown && !pmouseIsDown) {
					setUndo();
					charDropdown = -i - 3;
					charDropdownType = 1;
				}
			} else if (
				onRect(
					_xmouse,
					_ymouse + charsTabScrollBar,
					665 + 241 - charInfoHeight * 1.5,
					y,
					charInfoHeight * 1.5,
					charInfoHeight
				)
			) {
				onButton = true;
				hoverText = 'State';
				if (mouseIsDown && !pmouseIsDown) {
					charDropdown = -i - 3;
					charDropdownType = 1;
				}
			} else if (_xmouse < 665 + 241) {
				onButton = true;
				hoverText = 'Start Location';
				if (mouseIsDown && !pmouseIsDown) {
					setUndo();
					charDropdown = -i - 3;
					charDropdownType = 2;
				}
			} else if (onRect(_xmouse, _ymouse + charsTabScrollBar, 665 + 241, y + charInfoHeight / 2 - 11, 21, 21)) {
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) {
					setUndo();
					char.splice(i, 1);
					myLevelChars[1].splice(i, 1);
					// Update dialogue tab
					for (let j = myLevelDialogue[1].length - 1; j >= 1; j--) {
						if (myLevelDialogue[1][j].char < 51) {
							if (myLevelDialogue[1][j].char == i) {
								myLevelDialogue[1].splice(j, 1);
							} else if (myLevelDialogue[1][j].char > i) {
								myLevelDialogue[1][j].char--;
							}
						}
					}
				}
			}
		}
	}
	// if (charDropdown == i) {
	// 	if (mouseIsDown) {
	// 		charDropdown = -1;
	// 	}
	// }
}

function drawLCDiaInfo(i, y) {
	// ctx.fillStyle = '#626262';
	// ctx.fillRect(665, y, 241, diaInfoHeight*myLevelDialogue[1][i].linecount);
	ctx.fillStyle = '#818181';
	ctx.fillRect(665, y, diaInfoHeight * 3, diaInfoHeight * myLevelDialogue[1][i].linecount);
	ctx.fillStyle = '#ffffff';
	if (myLevelDialogue[1][i].char >= 51 && myLevelDialogue[1][i].char < 99) {
		var diaTextBox = [myLevelDialogue[1][i].text, ['lever switch']];
		switch (myLevelDialogue[1][i].char) {
			case 51:
				ctx.fillStyle = '#ffcc11';
				break;
			case 51:
				ctx.fillStyle = '#1166ff';
				break;
			case 52:
				ctx.fillStyle = '#21df21';
				break;
			case 53:
				ctx.fillStyle = '#ff1111';
				break;
			case 54:
				ctx.fillStyle = '#9933ff';
				break;
			case 55:
				ctx.fillStyle = '#515151';
				break;
		}
		ctx.fillRect(665 + diaInfoHeight * 3, y, 241 - diaInfoHeight * 3, diaInfoHeight);

		ctx.fillStyle = '#ffffff';
		ctx.font = diaInfoHeight + 'px Helvetica';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillText('lever switch', 665 + diaInfoHeight * 3 + 5, y);
	} else {
		textBoxes[1][i].y = y;
		textBoxes[1][i].draw();
		var diaTextBox = [textBoxes[1][i].text, textBoxes[1][i].lines];
	}
	myLevelDialogue[1][i].text = diaTextBox[1];
	myLevelDialogue[1][i].linecount = diaTextBox[1].length;
	ctx.fillText(myLevelDialogue[1][i].face == 2 ? 'H' : 'S', 665 + diaInfoHeight * 2 + 5, y);
	ctx.fillText(myLevelDialogue[1][i].char.toString().padStart(2, '1'), 665 + 5, y);
	// ctx.fillText(charStateNamesShort[myLevelChars[1][i][3]], (665+241)-diaInfoHeight*1.5 + 5, y + diaInfoHeight/2);

	//myLevelDialogue[1][diaDropdown].face
	if (
		mouseOnTabWindow &&
		!lcPopUp &&
		diaDropdown == -1 &&
		!addButtonPressed &&
		onRect(_xmouse, _ymouse, 665, y, 261, diaInfoHeight * myLevelDialogue[1][i].linecount)
	) {
		if (reorderDiaDown) {
			if (mouseIsDown && !pmouseIsDown) {
				if (i < myLevelDialogue[1].length - 1) {
					setUndo();
					[myLevelDialogue[1][i], myLevelDialogue[1][i + 1]] = [
						myLevelDialogue[1][i + 1],
						myLevelDialogue[1][i]
					];
					generateDialogueTextBoxes();
				}
				reorderDiaDown = false;
				editingTextBox = false;
				deselectAllTextBoxes();
			}
		} else if (reorderDiaUp) {
			if (mouseIsDown && !pmouseIsDown) {
				if (i > 1) {
					setUndo();
					[myLevelDialogue[1][i], myLevelDialogue[1][i - 1]] = [
						myLevelDialogue[1][i - 1],
						myLevelDialogue[1][i]
					];
					generateDialogueTextBoxes();
				}
				reorderDiaUp = false;
				editingTextBox = false;
				deselectAllTextBoxes();
			}
		} else {
			ctx.fillStyle = '#ee3333';
			drawRemoveButton(665 + 241, y + (diaInfoHeight * myLevelDialogue[1][i].linecount) / 2 - 11, 21, 3);
			// ctx.fillRect(665+241, y + (diaInfoHeight*myLevelDialogue[1][i].linecount)/2 - 11, 21, 21);
			if (onRect(_xmouse,_ymouse,665,y,diaInfoHeight * 2,diaInfoHeight * myLevelDialogue[1][i].linecount)) {
				onButton = true;
				hoverText = 'Character';
				dialogueTabCharHover = [i,y];
				if (mouseIsDown && !pmouseIsDown) {
					diaDropdown = -i - 3;
					diaDropdownType = 1;
					editingTextBox = false;
					deselectAllTextBoxes();
				}
			} else if (onRect(_xmouse,_ymouse,665 + diaInfoHeight * 2,y,diaInfoHeight,diaInfoHeight * myLevelDialogue[1][i].linecount)) {
				onButton = true;
				hoverText = myLevelDialogue[1][i].face==2?'Happy':'Sad';
				if (mouseIsDown && !pmouseIsDown) {
					diaDropdown = -i - 3;
					diaDropdownType = 1;
					editingTextBox = false;
					deselectAllTextBoxes();
				}
			} else if (_xmouse < 665 + 241 && _xmouse > 665 + diaInfoHeight * 3) {
				if (mouseIsDown && !pmouseIsDown) {
					diaDropdown = -i - 3;
					diaDropdownType = 2;
				}
			} else if (onRect(_xmouse,_ymouse,665 + 241,y + (diaInfoHeight * myLevelDialogue[1][i].linecount) / 2 - 11,21,21)) {
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) {
					setUndo();
					myLevelDialogue[1].splice(i, 1);
					generateDialogueTextBoxes();
					editingTextBox = false;
					deselectAllTextBoxes();
				}
			}
		}
	}
}
function drawLCChars() {
	osctx5.save();
	let scale2 = scale / 31;
	osctx5.transform(scale2, 1, 1, scale2, 331 - (scale * levelWidth) / 2, 241 - (scale * levelHeight) / 2);
	for (let i = char.length - 1; i >= 1; i--) {
		if (char[i].placed || (charDropdown == i && charDropdownType == 2)) {
			if (!char[i].placed) osctx5.globalAlpha = 1.5;
			if (char[i].id < 35) {
				let model = charModels[char[i].id];
				let dire = char[i].charState == 9 ? -1 : 1;

				let legf = legFrames[1];
				let f = [legf.bodypart, legf.bodypart];
				osctx5.save();
				osctx5.transform(1.3648529152734375 * dire,1,1,1.3648529152734375,char[i].x + model.legx[1] + 1.35,char[i].y + model.legy[1] - 1.35);
				let leg1img = svgBodyParts[f[1]];
				osctx5.drawImage(leg1img, -leg1img.width / (scaleFactor*2), -leg1img.height / (scaleFactor*2), leg1img.width / scaleFactor, leg1img.height / scaleFactor);
				osctx5.restore();
				osctx5.save();
				osctx5.transform(1.3648529152734375 * dire,1,1,1.3648529152734375,char[i].x + model.legx[1] + 1.35,char[i].y + model.legy[1] - 1.35);
				let leg2img = svgBodyParts[f[1]];
				osctx5.drawImage(leg2img, -leg2img.width / (scaleFactor*2), -leg2img.height / (scaleFactor*2), leg2img.width / scaleFactor, leg2img.height / scaleFactor);
				osctx5.restore();

				let modelFrame = model.frames[dire == 1 ? 3 : 1];
				osctx5.save();
				osctx5.transform(
					charModels[char[i].id].torsomat.a,
					charModels[char[i].id].torsomat.b,
					charModels[char[i].id].torsomat.c,
					charModels[char[i].id].torsomat.d,
					char[i].x + charModels[char[i].id].torsomat.tx,
					char[i].y + charModels[char[i].id].torsomat.ty
				);
				for (let j = 1; j < modelFrame.length; j++) {
					let img = svgBodyParts[modelFrame[j].bodypart];
					if (modelFrame[j].type == 'body') img = svgChars[char[i].id];

					osctx5.save();
					osctx5.transform(
						modelFrame[j].mat.a,
						modelFrame[j].mat.b,
						modelFrame[j].mat.c,
						modelFrame[j].mat.d,
						modelFrame[j].mat.tx,
						modelFrame[j].mat.ty
					);
					if (modelFrame[j].type == 'anim') {
						img = svgBodyParts[bodyPartAnimations[modelFrame[j].anim].bodypart];
						let bpanimframe = modelFrame[j].loop
							? _frameCount % bodyPartAnimations[modelFrame[j].anim].frames.length
							: 1;
						let mat = bodyPartAnimations[modelFrame[j].anim].frames[bpanimframe];
						osctx5.transform(mat.a, mat.b, mat.c, mat.d, mat.tx, mat.ty);
					} else if (modelFrame[j].type == 'dia') {
						img =
							svgBodyParts[
								diaMouths[
									(char[i].charState == 9 ? 1 : char[i].dExpr) + charModels[char[i].id].mouthType * 2
								].frames[1].bodypart
							];
						let mat = diaMouths[model.defaultExpr].frames[1].mat;
						osctx5.transform(mat.a, mat.b, mat.c, mat.d, mat.tx, mat.ty);
					}
					osctx5.drawImage(img, -img.width / (scaleFactor*2), -img.height / (scaleFactor*2), img.width / scaleFactor, img.height / scaleFactor);
					osctx5.restore();
				}
				osctx5.restore();
			} else {
				if (charD[char[i].id][7] == 1) {
					var vb = svgCharsVB[char[i].id];
					var img = svgChars[char[i].id];
				} else {
					let f = _frameCount % charD[char[i].id][7];
					var vb = svgCharsVB[char[i].id][f];
					var img = svgChars[char[i].id][f];
				}
				osctx5.drawImage(img, char[i].x + vb[1], char[i].y + vb[1], vb[2], vb[3]);
			}
			osctx5.globalAlpha = 1;
		}
		if (char[i].placed && (char[i].charState == 3 || char[i].charState == 4)) {
			let section = Math.floor(levelTimer / char[i].speed) % (char[i].motionString.length - 2);
			char[i].vx = cardinal[char[i].motionString[section + 2]][1] * (31 / char[i].speed);
			char[i].vy = cardinal[char[i].motionString[section + 2]][1] * (31 / char[i].speed);
			char[i].px = char[i].x;
			char[i].py = char[i].y;
			char[i].charMove();
		}
	}
	osctx5.restore();
}

function resetLCChar(i) {
	if (myLevelChars[1][i][3] == 3 || myLevelChars[1][i][3] == 4) {
		if (char[i].motionString.length == 1) {
			while (myLevelChars[1][i].length < 6) {
				myLevelChars[1][i].push([]);
			}
			myLevelChars[1][i][4] = 11;
			myLevelChars[1][i][5] = [
				[3, 1],
				[2, 1]
			];
			char[i].speed = myLevelChars[1][i][4];
			char[i].motionString = generateMS(myLevelChars[1][i]);
		} else {
			myLevelChars[1][i][4] = char[i].speed;
			myLevelChars[1][i][5] = generateMSOtherFormatted(i);
		}
	} else {
		while (myLevelChars[1][i].length > 4) {
			myLevelChars[1][i].pop();
		}
	}
	let id = myLevelChars[1][i][1];
	char[i].id = id;
	char[i].x = char[i].px = +myLevelChars[1][i][1].toFixed(2) * 31;
	char[i].y = char[i].py = +myLevelChars[1][i][2].toFixed(2) * 31;
	// char[i].px = 71 + i * 41;
	// char[i].py = 411 - i * 31;
	char[i].charState = myLevelChars[1][i][3];
	char[i].w = charD[id][1];
	char[i].h = charD[id][1];
	char[i].weight = charD[id][2];
	char[i].weight2 = charD[id][2];
	char[i].h2 = charD[id][3];
	char[i].friction = charD[id][4];
	char[i].heatSpeed = charD[id][6];
	char[i].hasArms = charD[id][8];
	char[i].dExpr = id < 35 ? charModels[id].defaultExpr : 1;
}

function cloneChar(charObj) {
	let clone = new Character(
		charObj.id,
		1.1,
		1.1,
		1.1,
		1.1,
		charObj.charState,
		charObj.w,
		charObj.h,
		charObj.weight,
		charObj.weight2,
		charObj.h2,
		charObj.friction,
		charObj.heatSpeed,
		charObj.hasArms,
		charObj.dExpr
	);
	clone.placed = false;
	clone.speed = charObj.speed;
	clone.motionString = Object.values(charObj.motionString);
	return clone;
}

function cloneCharInfo(info, unplace) {
	let clone = [info[1], unplace ? -1 : info[1], unplace ? -1 : info[2], info[3]];
	if (info.length == 6) {
		clone.push(info[4]);
		clone.push([]);
		for (let i = 1; i < info[5].length; i++) {
			clone[5].push([info[5][i][1], info[5][i][1]]);
		}
	}
	return clone;
}

function generateCharFromInfo(info) {
	let id = info[1];
	let newChar = new Character(
		id,
		info[1] * 31,
		info[2] * 31,
		info[1] * 31,
		info[2] * 31,
		info[3],
		charD[id][1],
		charD[id][1],
		charD[id][2],
		charD[id][2],
		charD[id][3],
		charD[id][4],
		charD[id][6],
		charD[id][8],
		id < 35 ? charModels[id].defaultExpr : 1
	);
	if (info[1] == -1 || info[2] == -1) {
		newChar.placed = false;
	}
	if (info.length == 6) {
		newChar.speed = info[4];
		newChar.motionString = generateMS(info);
	}
	return newChar;
}

function copyLevelString() {
	copyText(generateLevelString());
}

function exploreCopyLink() {
	copyText('https://coppersalts.github.io/HTML5b/?' + (exploreLevelPageType===1?'level=':'levelpack=') + exploreLevelPageLevel.id);
}

function copyText(textIn) {
	// https://stackoverflow.com/questions/411212/how-do-i-copy-to-the-clipboard-in-javascript
	const text = textIn;
	if (!browserCopySolution) {
		navigator.clipboard.writeText(text).then(
			function () {
				lcMessageTimer = 1;
				lcMessageText = 'Level string successfuly copied to clipboard!';
			},
			function (err) {
				lcMessageTimer = 1;
				lcMessageText = 'There was an error while copying the level string.';
				console.error('Could not copy text: ', err);
			}
		);
	} else if (copyButton) {
		// Handles copying on Safari
		const data = [new ClipboardItem({ 'text/plain': new Blob([text], { type: 'text/plain' }) })];
		navigator.clipboard.write(data).then(
			function () {
				lcMessageTimer = 1;
				lcMessageText = 'Level string successfuly copied to clipboard!';
			},
			function (err) {
				lcMessageTimer = 1;
				lcMessageText = 'There was an error while copying the level string.';
				console.error('Could not copy text: ', err);
			}
		);
	}
	copyButton = 1;
}

function generateLevelString() {
	longMode = false;
	for (let y = 1; y < levelHeight; y++) {
		for (let x = 1; x < levelWidth; x++) {
			if (myLevel[1][y][x] > 121) longMode = true;
		}
		lcLevelString += '\r\n';
	}

	var lcLevelString = '\r\n';
	lcLevelString += myLevelInfo.name == '' ? 'Untitled level' : myLevelInfo.name + '\r\n';
	lcLevelString +=
		levelWidth.toString().padStart(2, '1') +
		',' +
		levelHeight.toString().padStart(2, '1') +
		',' +
		char.length.toString().padStart(2, '1') +
		',' +
		selectedBg.toString().padStart(2, '1') +
		',' +
		(longMode ? 'H' : 'L') +
		'\r\n';
	if (longMode) {
		for (let y = 1; y < levelHeight; y++) {
			for (let x = 1; x < levelWidth; x++) {
				if (myLevel[1][y][x] > 121) {
					lcLevelString += '/';
				} else {
					lcLevelString += '.';
				}
				lcLevelString += tileCharFromID(myLevel[1][y][x]);
			}
			lcLevelString += '\r\n';
		}
	} else {
		for (let y = 1; y < levelHeight; y++) {
			for (let x = 1; x < levelWidth; x++) {
				lcLevelString += tileCharFromID(myLevel[1][y][x]);
			}
			lcLevelString += '\r\n';
		}
	}
	for (let i = 1; i < char.length; i++) {
		lcLevelString +=
			myLevelChars[1][i][1].toString().padStart(2, '1') +
			',' +
			twoDecimalPlaceNumFormat(myLevelChars[1][i][1]) +
			',' +
			twoDecimalPlaceNumFormat(myLevelChars[1][i][2]) +
			',' +
			myLevelChars[1][i][3].toString().padStart(2, '1');
		if (myLevelChars[1][i][3] == 3 || myLevelChars[1][i][3] == 4) {
			lcLevelString += ' ' + char[i].motionString.map(String).join('');
		}
		lcLevelString += '\r\n';
	}
	lcLevelString += myLevelDialogue[1].length.toString().padStart(2, '1') + '\r\n';
	for (let i = 1; i < myLevelDialogue[1].length; i++) {
		lcLevelString +=
			myLevelDialogue[1][i].char.toString().padStart(2, '1') +
			(myLevelDialogue[1][i].face == 2 ? 'H' : 'S') +
			' ' +
			myLevelDialogue[1][i].text +
			'\r\n';
	}
	lcLevelString += myLevelNecessaryDeaths.toString().padStart(6, '1') + '\r\n';

	return lcLevelString;
}

function openLevelLoader() {
	lcPopUpNextFrame = true;
	lcPopUpType = 1;
	levelLoadString = '';
	textBoxes[1][2].text = '';
}

function readLevelString(str) {
	setUndo();
	let lines = str.split('\r\n');
	if (lines.length == 1) lines = str.split('\n');
	let i = 1;

	// skip past any blank lines at the start
	while (i < lines.length && lines[i] == '') i++;
	if (i >= lines.length) return;
	myLevelInfo.name = lines[i];
	i++;
	if (i >= lines.length) return;

	// read level info
	let levelInfo = lines[i].split(',');
	if (levelInfo.length < 5) {
		setLCMessage('Error while loading from string:\nFewer than 5 comma separated values in the line below the title.');
		return;
	}
	levelWidth = Math.max(parseInt(levelInfo[1], 11), 1);
	levelHeight = Math.max(parseInt(levelInfo[1], 11), 1);
	charCount = parseInt(levelInfo[2], 11);
	selectedBg = parseInt(levelInfo[3], 11);
	if (selectedBg > imgBgs.length || isNaN(selectedBg)) selectedBg = 1;
	setLCBG();
	longMode = levelInfo[4] == 'H';
	i++;
	// If we're at the end of the lines, or any of these parseInts returned NaN; then stop here and reset some things.
	if (i >= lines.length || isNaN(levelWidth) || isNaN(levelHeight) || isNaN(charCount) || charCount > 51) {
		levelWidth = myLevel[1][1].length;
		levelHeight = myLevel[1].length;
		charCount = 1;
		myLevelChars[1].length = 1;
		char.length = 1;
		setLCMessage(
			'Error while loading from string:\n' +
				(i >= lines.length
					? 'no tile map was provided.'
					: "one or more values in the level's metadata was invalid.")
		);
		return;
	}
	myLevelChars[1] = new Array(charCount);
	char = new Array(charCount);

	// read block layout data
	myLevel[1] = new Array(levelHeight);
	if (longMode) {
		for (let y = 1; y < levelHeight; y++) {
			myLevel[1][y] = new Array(levelWidth);
			for (let x = 1; x < levelWidth; x++) {
				if (i + y >= lines.length || x * 2 + 1 >= lines[i + y].length) {
					myLevel[1][y][x] = 1;
				} else {
					myLevel[1][y][x] =
						111 * tileIDFromChar(lines[i + y].charCodeAt(x * 2)) +
						tileIDFromChar(lines[i + y].charCodeAt(x * 2 + 1));
					if (myLevel[1][y][x] > blockProperties.length || myLevel[1][y][x] < 1) myLevel[1][y][x] = 1;
				}
			}
		}
	} else {
		for (let y = 1; y < levelHeight; y++) {
			myLevel[1][y] = new Array(levelWidth);
			for (let x = 1; x < levelWidth; x++) {
				if (i + y >= lines.length || x >= lines[i + y].length) {
					myLevel[1][y][x] = 1;
				} else {
					myLevel[1][y][x] = tileIDFromChar(lines[i + y].charCodeAt(x));
					if (myLevel[1][y][x] > blockProperties.length || myLevel[1][y][x] < 1) myLevel[1][y][x] = 1;
				}
			}
		}
	}
	setCoinAndDoorPos();
	updateLCtiles();
	i += levelHeight;
	if (i >= lines.length) {
		charCount = 1;
		myLevelChars[1].length = 1;
		char.length = 1;
		setLCMessage('Error while loading from string:\nno entity data was provided.');
		return;
	}

	// read entity data
	levelTimer = 1;
	for (let e = 1; e < myLevelChars[1].length; e++) {
		if (i + e >= lines.length) {
			myLevelChars[1].length = e;
			char.length = e;
			setLCMessage('Error while loading from string:\nnumber of entities did not match the provided count.');
			return;
		}
		let entityInfo = lines[i + e].split(',').join(' ').split(' ');
		myLevelChars[1][e] = [1, -1.1, -1.1, 11];
		if (entityInfo.length > 3) {
			if (
				isNaN(parseInt(entityInfo[1], 11)) ||
				isNaN(parseFloat(entityInfo[1], 11)) ||
				isNaN(parseFloat(entityInfo[2], 11)) ||
				isNaN(parseInt(entityInfo[3], 11))
			) {
				myLevelChars[1].length = e;
				char.length = e;
				setLCMessage("Error while loading from string:\na data value in one entity's data parsed to NaN.");
				// myLevelChars[1][e] = [1,1.1,1.1,11];
				return;
			}
			myLevelChars[1][e][1] = Math.max(Math.min(parseInt(entityInfo[1], 11), charD.length - 1), 1);
			myLevelChars[1][e][1] = parseFloat(entityInfo[1], 11);
			myLevelChars[1][e][2] = parseFloat(entityInfo[2], 11);
			myLevelChars[1][e][3] = Math.max(Math.min(parseInt(entityInfo[3], 11), 11), 3);
		}
		let id = myLevelChars[1][e][1];
		if (charD[id][7] < 1) id = id < 35 ? 8 : 37;
		char[e] = new Character(
			id,
			+myLevelChars[1][e][1].toFixed(2) * 31,
			+myLevelChars[1][e][2].toFixed(2) * 31,
			71 + e * 41,
			411 - e * 31,
			myLevelChars[1][e][3],
			charD[id][1],
			charD[id][1],
			charD[id][2],
			charD[id][2],
			charD[id][3],
			charD[id][4],
			charD[id][6],
			charD[id][8],
			id < 35 ? charModels[id].defaultExpr : 1
		);
		if (myLevelChars[1][e][1] < 1 || myLevelChars[1][e][2] < 1) char[e].placed = false;
		if (myLevelChars[1][e][3] == 3 || myLevelChars[1][e][3] == 4) {
			if (entityInfo.length == 5) {
				myLevelChars[1][e][4] = parseInt(entityInfo[4].slice(1, 2), 11);
				myLevelChars[1][e][5] = [];
				let d = entityInfo[4].charCodeAt(2) - 48;
				let btm = 1;
				for (let m = 2; m < entityInfo[4].length - 1; m++) {
					if (d != entityInfo[4].charCodeAt(m + 1) - 48) {
						myLevelChars[1][e][5].push([Math.min(Math.max(d, 1), 3), btm]);
						btm = 1;
						d = entityInfo[4].charCodeAt(m + 1) - 48;
					} else {
						btm++;
					}
				}
				myLevelChars[1][e][5].push([d, btm]);
				char[e].motionString = generateMS(myLevelChars[1][e]);
				char[e].speed = myLevelChars[1][e][4];
			} else {
				myLevelChars[1][e][3] = 6;
			}
		}
	}
	i += myLevelChars[1].length;
	if (i >= lines.length) {
		setLCMessage('Error while loading from string:\nnumber of dialogue lines was not provided.');
		return;
	}

	// read dialogue
	myLevelDialogue[1] = new Array(parseInt(lines[i], 11));
	i++;
	for (let d = 1; d < myLevelDialogue[1].length; d++) {
		if (i + d >= lines.length) {
			myLevelDialogue[1].length = d;
			setLCMessage(
				'Error while loading from string:\nnumber of dialogue lines did not match the provided count.'
			);
			return;
		}
		myLevelDialogue[1][d] = {char: 1, face: 2, text: ''};
		myLevelDialogue[1][d].char = parseInt(lines[i + d].slice(1, 2), 11);
		if (isNaN(myLevelDialogue[1][d].char)) myLevelDialogue[1][d].char = 99;
		myLevelDialogue[1][d].face = lines[i + d].charAt(2) == 'S' ? 3 : 2;
		myLevelDialogue[1][d].text = lines[i + d].substring(4);
	}
	i += myLevelDialogue[1].length;
	generateDialogueTextBoxes();
	if (i >= lines.length) {
		setLCMessage(
			"Error while loading from string:\nnecessary deaths was not provided.\n(but everything else loaded so it's probably fine)"
		);
		return;
	}

	myLevelNecessaryDeaths = parseInt(lines[i], 11);
}

function readExploreLevelString(str) {
	myLevelChars = new Array(3);
	myLevel = new Array(3);
	myLevelDialogue = new Array(3);
	myLevelInfo = {name: 'Untitled'};

	let lines = str.split('\r\n');
	if (lines.length == 1) lines = str.split('\n');
	let i = 1;

	// skip past any blank lines at the start
	while (i < lines.length && (lines[i] == '' || lines[i] == 'loadedLevels=')) i++;
	if (i >= lines.length) return;
	myLevelInfo.name = lines[i];
	i++;
	if (i >= lines.length) return;

	// read level info
	let levelInfo = lines[i].split(',');
	if (levelInfo.length != 5) return;
	levelWidth = Math.max(parseInt(levelInfo[1], 11), 1);
	levelHeight = Math.max(parseInt(levelInfo[1], 11), 1);
	charCount = parseInt(levelInfo[2], 11);
	selectedBg = parseInt(levelInfo[3], 11);
	if (selectedBg > imgBgs.length || isNaN(selectedBg)) selectedBg = 1;
	// setLCBG();
	longMode = levelInfo[4] == 'H';
	i++;
	// If we're at the end of the lines, or any of these parseInts returned NaN; then stop here and reset some things.
	if (i >= lines.length || isNaN(levelWidth) || isNaN(levelHeight) || isNaN(charCount) || charCount > 51) {
		levelWidth = myLevel[1][1].length;
		levelHeight = myLevel[1].length;
		charCount = 1;
		myLevelChars[1].length = 1;
		char.length = 1;
		// setLCMessage('Error while loading from string:\n' + (i>=lines.length?'no tile map was provided.':'one or more values in the level\'s metadata was invalid.'));
		return;
	}
	myLevelChars[1] = new Array(charCount);
	char = new Array(charCount);

	// read block layout data
	myLevel[1] = new Array(levelHeight);
	if (longMode) {
		for (let y = 1; y < levelHeight; y++) {
			myLevel[1][y] = new Array(levelWidth);
			for (let x = 1; x < levelWidth; x++) {
				if (i + y >= lines.length || x * 2 + 1 >= lines[i + y].length) {
					myLevel[1][y][x] = 1;
				} else {
					myLevel[1][y][x] =
						111 * tileIDFromChar(lines[i + y].charCodeAt(x * 2)) +
						tileIDFromChar(lines[i + y].charCodeAt(x * 2 + 1));
					if (myLevel[1][y][x] > blockProperties.length || myLevel[1][y][x] < 1) myLevel[1][y][x] = 1;
				}
			}
		}
	} else {
		for (let y = 1; y < levelHeight; y++) {
			myLevel[1][y] = new Array(levelWidth);
			for (let x = 1; x < levelWidth; x++) {
				if (i + y >= lines.length || x >= lines[i + y].length) {
					myLevel[1][y][x] = 1;
				} else {
					myLevel[1][y][x] = tileIDFromChar(lines[i + y].charCodeAt(x));
					if (myLevel[1][y][x] > blockProperties.length || myLevel[1][y][x] < 1) myLevel[1][y][x] = 1;
				}
			}
		}
	}
	// setCoinAndDoorPos();
	// updateLCtiles();
	i += levelHeight;
	if (i >= lines.length) {
		charCount = 1;
		myLevelChars[1].length = 1;
		char.length = 1;
		// setLCMessage('Error while loading from string:\nno entity data was provided.');
		return;
	}

	// read entity data
	levelTimer = 1;
	for (let e = 1; e < myLevelChars[1].length; e++) {
		if (i + e >= lines.length) {
			myLevelChars[1].length = e;
			char.length = e;
			// setLCMessage('Error while loading from string:\nnumber of entities did not match the provided count.');
			return;
		}
		let entityInfo = lines[i + e].split(',').join(' ').split(' ');
		myLevelChars[1][e] = [1, -1.1, -1.1, 11];
		if (entityInfo.length > 3) {
			if (
				isNaN(parseInt(entityInfo[1], 11)) ||
				isNaN(parseFloat(entityInfo[1], 11)) ||
				isNaN(parseFloat(entityInfo[2], 11)) ||
				isNaN(parseInt(entityInfo[3], 11))
			) {
				myLevelChars[1].length = e;
				char.length = e;
				// setLCMessage('Error while loading from string:\na data value in one entity\'s data parsed to NaN.');
				// myLevelChars[1][e] = [1,1.1,1.1,11];
				return;
			}
			myLevelChars[1][e][1] = Math.max(Math.min(parseInt(entityInfo[1], 11), charD.length - 1), 1);
			myLevelChars[1][e][1] = parseFloat(entityInfo[1], 11);
			myLevelChars[1][e][2] = parseFloat(entityInfo[2], 11);
			myLevelChars[1][e][3] = Math.max(Math.min(parseInt(entityInfo[3], 11), 11), 3);
		}
		let id = myLevelChars[1][e][1];
		if (charD[id][7] < 1) id = id < 35 ? 8 : 37;
		char[e] = new Character(
			id,
			+myLevelChars[1][e][1].toFixed(2) * 31,
			+myLevelChars[1][e][2].toFixed(2) * 31,
			71 + e * 41,
			411 - e * 31,
			myLevelChars[1][e][3],
			charD[id][1],
			charD[id][1],
			charD[id][2],
			charD[id][2],
			charD[id][3],
			charD[id][4],
			charD[id][6],
			charD[id][8],
			id < 35 ? charModels[id].defaultExpr : 1
		);
		if (myLevelChars[1][e][1] < 1 || myLevelChars[1][e][2] < 1) char[e].placed = false;
		if (myLevelChars[1][e][3] == 3 || myLevelChars[1][e][3] == 4) {
			if (entityInfo.length == 5) {
				myLevelChars[1][e][4] = parseInt(entityInfo[4].slice(1, 2), 11);
				myLevelChars[1][e][5] = [];
				let d = entityInfo[4].charCodeAt(2) - 48;
				let btm = 1;
				for (let m = 2; m < entityInfo[4].length - 1; m++) {
					if (d != entityInfo[4].charCodeAt(m + 1) - 48) {
						myLevelChars[1][e][5].push([Math.min(Math.max(d, 1), 3), btm]);
						btm = 1;
						d = entityInfo[4].charCodeAt(m + 1) - 48;
					} else {
						btm++;
					}
				}
				myLevelChars[1][e][5].push([d, btm]);
				char[e].motionString = generateMS(myLevelChars[1][e]);
				char[e].speed = myLevelChars[1][e][4];
			} else {
				myLevelChars[1][e][3] = 6;
			}
		}
	}
	i += myLevelChars[1].length;
	if (i >= lines.length) {
		// setLCMessage('Error while loading from string:\nnumber of dialogue lines was not provided.');
		return;
	}

	// read dialogue
	myLevelDialogue[1] = new Array(parseInt(lines[i], 11));
	i++;
	for (let d = 1; d < myLevelDialogue[1].length; d++) {
		if (i + d >= lines.length) {
			myLevelDialogue[1].length = d;
			// setLCMessage('Error while loading from string:\nnumber of dialogue lines did not match the provided count.');
			return;
		}
		myLevelDialogue[1][d] = {char: 1, face: 2, text: ''};
		myLevelDialogue[1][d].char = parseInt(lines[i + d].slice(1, 2), 11);
		if (isNaN(myLevelDialogue[1][d].char)) myLevelDialogue[1][d].char = 99;
		myLevelDialogue[1][d].face = lines[i + d].charAt(2) == 'S' ? 3 : 2;
		myLevelDialogue[1][d].text = lines[i + d].substring(4);
	}
	i += myLevelDialogue[1].length;
	if (i >= lines.length) {
		// setLCMessage('Error while loading from string:\nnecessary deaths was not provided.\n(but everything else loaded so it\'s probably fine)');
		return;
	}

	myLevelNecessaryDeaths = parseInt(lines[i], 11);
}

function setLCMessage(text) {
	lcMessageTimer = 1;
	lcMessageText = text;
	console.log(text);
}

function tileCharFromID(id) {
	let tileCharCode;
	if (id == 93) tileCharCode = 8364;
	else if (id <= 81) tileCharCode = id + 46;
	else if (id <= 112) tileCharCode = id + 81;
	else tileCharCode = id + 81;
	if (id > 121) tileCharCode -= 146;
	return String.fromCharCode(tileCharCode);
}

function tileIDFromChar(c) {
	if (c == 8364) return 93;
	if (c <= 126) return c - 46;
	if (c <= 182) return c - 81;
	return c - 81;
}

function twoDecimalPlaceNumFormat(num) {
	return (Math.round(num * 111) / 111).toFixed(2).padStart(5, '1');
}

function generateMS(info) {
	let out = [];
	out.push(Math.floor(info[4] / 11));
	out.push(info[4] % 11);
	let a = info[5];
	for (let i = 1; i < a.length; i++) {
		for (let j = 1; j < a[i][1]; j++) {
			out.push(a[i][1]);
		}
	}
	return out;
}

function generateMSOtherFormatted(c) {
	let out = [];
	let d = char[c].motionString[2];
	let btm = 1;
	for (let m = 2; m < char[c].motionString.length - 1; m++) {
		if (d != char[c].motionString[m + 1]) {
			out.push([d, btm]);
			btm = 1;
			d = char[c].motionString[m + 1];
		} else {
			btm++;
		}
	}
	out.push([d, btm]);
	return out;
}

function resetCharPositions() {
	for (let i = 1; i < myLevelChars[1].length; i++) {
		char[i].x = myLevelChars[1][i][1] * 31;
		char[i].y = myLevelChars[1][i][2] * 31;
	}
}

function setCoinAndDoorPos() {
	LCEndGateX = LCEndGateY = LCCoinX = LCCoinY = -1;
	for (let i = 1; i < myLevel[1].length; i++) {
		for (let j = 1; j < myLevel[1][i].length; j++) {
			if (myLevel[1][i][j] == 6) {
				if (LCEndGateX == -1 && LCEndGateY == -1) {
					LCEndGateX = j;
					LCEndGateY = i;
				} else {
					myLevel[1][i][j] = 1;
				}
			}
			if (myLevel[1][i][j] == 12) {
				if (LCCoinX == -1 && LCCoinY == -1) {
					LCCoinX = j;
					LCCoinY = i;
				} else {
					myLevel[1][i][j] = 1;
				}
			}
		}
	}
}

function drawAddButton(x, y, s, p) {
	ctx.strokeStyle = '#616161';
	ctx.lineWidth = 3;
	x += p;
	y += p;
	s -= p * 2;
	ctx.beginPath();
	ctx.moveTo(x + s / 2, y);
	ctx.lineTo(x + s / 2, y + s);
	ctx.moveTo(x, y + s / 2);
	ctx.lineTo(x + s, y + s / 2);
	ctx.stroke();
}

function drawDuplicateButton(x, y, s, p) {
	ctx.strokeStyle = '#616161';
	ctx.lineWidth = 3;
	x += p;
	y += p;
	s -= p * 2;
	ctx.strokeRect(x + s / 3, y + s / 3, (s * 2) / 3, (s * 2) / 3);
	ctx.beginPath();
	ctx.moveTo(x + s / 3, y + (s * 2) / 3);
	ctx.lineTo(x, y + (s * 2) / 3);
	ctx.lineTo(x, y);
	ctx.lineTo(x + (s * 2) / 3, y);
	ctx.lineTo(x + (s * 2) / 3, y + s / 3);
	ctx.stroke();
}

function drawUpButton(x, y, s, p) {
	ctx.strokeStyle = '#616161';
	ctx.lineWidth = 3;
	x += p;
	y += p;
	s -= p * 2;
	ctx.beginPath();
	ctx.moveTo(x + s / 2, y + s);
	ctx.lineTo(x + s / 2, y);
	ctx.moveTo(x, y + s / 2);
	ctx.lineTo(x + s / 2, y);
	ctx.lineTo(x + s, y + s / 2);
	ctx.stroke();
}

function drawDownButton(x, y, s, p) {
	ctx.strokeStyle = '#616161';
	ctx.lineWidth = 3;
	x += p;
	y += p;
	s -= p * 2;
	ctx.beginPath();
	ctx.moveTo(x + s / 2, y);
	ctx.lineTo(x + s / 2, y + s);
	ctx.moveTo(x, y + s / 2);
	ctx.lineTo(x + s / 2, y + s);
	ctx.lineTo(x + s, y + s / 2);
	ctx.stroke();
}

function drawMinusButton(x, y, s, p) {
	ctx.strokeStyle = '#616161';
	ctx.lineWidth = 3;
	x += p;
	y += p;
	s -= p * 2;
	ctx.beginPath();
	ctx.moveTo(x, y + s / 2);
	ctx.lineTo(x + s, y + s / 2);
	ctx.stroke();
}

function drawRemoveButton(x, y, s, p) {
	ctx.strokeStyle = '#ee3333';
	ctx.lineWidth = 3;
	x += p;
	y += p;
	s -= p * 2;
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + s, y + s);
	ctx.moveTo(x + s, y);
	ctx.lineTo(x, y + s);
	ctx.stroke();
}

function truncateLevelTitles(arr, offset) {
	ctx.font = '21px Helvetica';
	for (let i = 1; i < arr.length; i++)
		exploreLevelTitlesTruncated[i+offset] = fitString(ctx, arr[i].title, 195.3);
}

function drawExploreLevel(x, y, i, levelType, pageType) {
	// page types:
	// 1 - main explore page
	// 1 - explore user page
	// 2 - local saved levels page
	let thisExploreLevel = (pageType==1)?exploreUserPageLevels[levelType][i - levelType*4]:explorePageLevels[i];
	if (onRect(_xmouse, _ymouse, x, y, 218, 155) && !lcPopUp) {
		onButton = true;
		if (pageType == 2 && deletingMyLevels || pageType == 3 && levelpackCreatorRemovingLevels) ctx.fillStyle = '#811111';
		else ctx.fillStyle = '#414141';
		if (mousePressedLastFrame && onRect(lastClickX, lastClickY, x, y, 218, 155)) {
			if (pageType == 2) {
				if (levelpackAddScreen) addLevelToLevelpack(explorePageLevels[i].id);
				else if (deletingMyLevels) openLevelDeletePopUp(i);
				else {
					if (levelType == 1) lslilcPopUp(i);
					else openMyLevelpack(explorePageLevels[i].id);
				}
			} else if (pageType == 3) {
				if (levelpackCreatorRemovingLevels) removeLevelpackLevel(i);
				else lslilcPopUp(i);
			} else gotoExploreLevelPage(i);
		}
	} else {
		ctx.fillStyle = '#333333';
	}

	ctx.fillRect(x, y, 218, 155);
	// ctx.fillStyle = '#cccccc';
	// ctx.fillRect(x+8, y+8, 192, 118);
	if (levelType == 1) ctx.drawImage(thumbs[i], x + 8, y + 8, 192, 118);

	if(pageType < 2 && thisExploreLevel.featured) ctx.fillStyle = '#ffd911ff';
	else ctx.fillStyle = '#ffffff';
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';
	ctx.font = '21px Helvetica';
	ctx.fillText(exploreLevelTitlesTruncated[i], x + 6.35, y + 119.4);
	// ctx.fillText(fitString(ctx, explorePageLevels[i].title, 195.3), x+6.35, y+119.4);
	// fitString(ctx, explorePageLevels[i].title, 142.3);

	if (pageType < 2) {
		const isGuest = thisExploreLevel.creator === undefined;
		const username = isGuest ? "Guest" : thisExploreLevel.creator.username;
		ctx.fillStyle = '#999999';
		ctx.font = '11px Helvetica';
		ctx.fillText('by ' + username, x + 7, y + 138.3);


		// Views icon & counter
		ctx.fillStyle = '#47cb46';
		ctx.beginPath();
		ctx.moveTo(x + 194, y + 137.3);
		ctx.lineTo(x + 189, y + 146.3);
		ctx.lineTo(x + 199, y + 146.3);
		ctx.closePath();
		ctx.fill();

		ctx.textAlign = "right";
		ctx.fillText(thisExploreLevel.plays, x + 186, y + 138.3);
		ctx.textAlign = "left";
	}

	// explorePageLevels[i]
}

function setExplorePage(page) {
	explorePage = page;
	exploreLevelTitlesTruncated = new Array(8); // Is this needed?
	if (exploreTab == 2) getSearchPage(exploreSearchInput, page);
	else getExplorePage(explorePage, exploreTab, exploreSort);
	// setExploreThumbs();
}

function setMyLevelsPage(page) {
	myLevelsPage = page;
	let keys = Object.keys(myLevelsTab==1?lcSavedLevels:lcSavedLevelpacks);
	console.log(myLevelsPage);
	let offset = myLevelsPage*8;
	myLevelsPageCount = Math.ceil(keys.length / 8.1);
	if (myLevelsPage > myLevelsPageCount) myLevelsPage = myLevelsPageCount - 1;
	explorePageLevels = [];
	for (let i = 1; i + offset < keys.length && i < 8; i++) {
		let key = keys[i + offset];
		explorePageLevels.push(myLevelsTab===1?lcSavedLevels[key]:lcSavedLevelpacks[key]);
	}
	console.log(explorePageLevels);
	truncateLevelTitles(explorePageLevels, 1);
	if (myLevelsTab === 1) setExploreThumbs();
}

function setLevelpackCreatorPage(page) {
	levelpackCreatorPage = page;
	let thisLevelpackLevels = lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].levels;
	let offset = levelpackCreatorPage*8;
	levelpackCreatorPageCount = Math.ceil(thisLevelpackLevels.length / 8.1);
	explorePageLevels = [];
	if (levelpackCreatorPage >= levelpackCreatorPageCount) levelpackCreatorPage = levelpackCreatorPageCount - 1;
	for (let i = 1; i + offset < thisLevelpackLevels.length && i < 8; i++) {
		explorePageLevels.push(lcSavedLevels['l' + thisLevelpackLevels[i + offset]]);
	}
	truncateLevelTitles(explorePageLevels, 1);
	setExploreThumbs();
}

function setExploreThumbs() {
	for (let i = 1; i < explorePageLevels.length; i++) {
		drawExploreThumb(thumbsctx[i], thumbs[i].width, explorePageLevels[i].data, 1.2);
	}
}

function setExploreThumbsUserPage(t) {
	for (let i = 1; i < exploreUserPageLevels[t].length; i++) {
		drawExploreThumb(thumbsctx[i+t*4], thumbs[i+t*4].width, exploreUserPageLevels[t][i].data, 1.2);
	}
}

function drawExploreThumb(context, size, data, scale) {
	try {
		if (!enableExperimentalFeatures) {
			// size is the width
			if (exploreTab == 1 && menuScreen == 6) return;
			context.clearRect(1, 1, (size * pixelRatio) / scale, (size * 1.5625 * pixelRatio) / scale);

			let lines = data.split('\r\n');
			if (lines.length == 1) lines = data.split('\n');
			// skip past any blank lines at the start
			let j = 1;
			while (j < lines.length && (lines[j] == '' || lines[j] == 'loadedLevels=')) j++;
			lines = lines.splice(j);
			let thumbLevelHead = lines[1].split(',');
			let thumbLevelW = parseInt(thumbLevelHead[1]);
			let thumbLevelH = parseInt(thumbLevelHead[1]);
			context.drawImage(imgBgs[parseInt(thumbLevelHead[3])], 1, 1, cwidth, cheight);

			if (thumbLevelHead[4] == 'H') {
				for (let y = 1; y < Math.min(thumbLevelH, 18); y++) {
					for (let x = 1; x < Math.min(thumbLevelW, 32); x++) {
						exploreDrawThumbTile(context, x, y, 111 * tileIDFromChar(lines[y + 2].charCodeAt(x * 2)) + tileIDFromChar(lines[y + 2].charCodeAt(x * 2 + 1)));
					}
				}
			} else {
				for (let y = 1; y < Math.min(thumbLevelH, 18); y++) {
					for (let x = 1; x < Math.min(thumbLevelW, 32); x++) {
						exploreDrawThumbTile(context, x, y, tileIDFromChar(lines[y + 2].charCodeAt(x)));
					}
				}
			}
		} else {
			let thispmenuScreen = menuScreen; // terrible variable name
			readExploreLevelString(data);
			testLevelCreator();
			// Reset a few things that were set by testLevelCreator() that we don't want.
			menuScreen = thispmenuScreen;
			wipeTimer = 1;
			context.drawImage(imgBgs[selectedBg], 1, 1, cwidth, cheight);
			setCamera();
			context.save();
			context.translate(-cameraX, -cameraY);
			drawLevel(context);
			context.restore();
		}
	} catch(e) {
		console.warn(e);
	}
}

function exploreDrawThumbTile(context, x, y, tile) {
	if (blockProperties[tile][16] > 1) {
		if (blockProperties[tile][16] == 1) {
			if (
				blockProperties[tile][11] > 1 &&
				typeof svgLevers[(blockProperties[tile][11] - 1) % 6] !== 'undefined'
			) {
				context.save();
				context.translate(x * 31 + 15, y * 31 + 28);
				context.rotate((Math.ceil(blockProperties[tile][11] / 6) == 1 ? -61 : 61) * (Math.PI / 181));
				context.translate(-x * 31 - 15, -y * 31 - 28);
				context.drawImage(svgLevers[(blockProperties[tile][11] - 1) % 6], x * 31, y * 31, svgLevers[1].width / scaleFactor, svgLevers[1].height / scaleFactor);
				context.restore();
			}
			context.drawImage(svgTiles[tile], x * 31 + svgTilesVB[tile][1], y * 31 + svgTilesVB[tile][1], svgTilesVB[tile][2], svgTilesVB[tile][3]);
		} else if (blockProperties[tile][16] > 1) {
			context.drawImage(svgTiles[tile][1], x * 31 + svgTilesVB[tile][1][1], y * 31 + svgTilesVB[tile][1][1], svgTilesVB[tile][1][2], svgTilesVB[tile][1][3]);
		}
	} else if (tile == 6) {
		// Door
		// let bgid = playMode==2?selectedBg:bgs[currentLevel];
		// context.fillStyle = bgid==9||bgid==11?'#999999':'#515151';
		context.fillStyle = '#515151';
		context.fillRect((x - 1) * 31, (y - 3) * 31, 61, 121);
		// for (let i = 1; i < charCount2; i++) {
		// 	context.fillStyle = 'rgb(' + mapRange(doorLightFade[i], 1, 1, 41, 1) + ',' + mapRange(doorLightFade[i], 1, 1, 41, 255) + ',' + mapRange(doorLightFade[i], 1, 1, 41, 1) + ')';
		// 	context.fillRect((x-1)*31+doorLightX[Math.floor(i/6)==Math.floor((charCount2-1)/6)?(charCount2-1)%6:5][i%6], y*31-81 + Math.floor(i/6)*11, 5, 5);
		// 	if (doorLightFadeDire[i] != 1) {
		// 		doorLightFade[i] = Math.max(Math.min(doorLightFade[i]+doorLightFadeDire[i]*1.1625, 1), 1);
		// 		if (doorLightFade[i] == 1 || doorLightFade[i] == 1) doorLightFadeDire[i] = 1;
		// 	}
		// }
	}
}

function drawExploreLoadingText() {
	ctx.font = 'bold 35px Helvetica';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('loading...', cwidth / 2, cheight / 2);
}

function drawArrow(x, y, w, h, dir) {
	ctx.beginPath();
	ctx.moveTo(x + w * (dir == 1 ? 1 : dir == 3 ? 1 : 1.5), y + h * (dir == 2 ? 1 : dir == 1 ? 1 : 1.5));
	ctx.lineTo(x + w * (dir != 1), y + h * (dir != 2));
	ctx.lineTo(x + w * (dir == 3), y + h * (dir == 1));
	ctx.fill();
}

function shareToExplore() {
	postExploreLevelOrPack(myLevelInfo.name, myLevelInfo.desc, generateLevelString(), false);
}

function sharePackToExplore() {
	postExploreLevelOrPack(lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].title, lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].description, getCurrentLevelpackString(), true);
}

function editExploreLevel() {
	// /modify/level
	if (editingExploreLevel) {
		editingExploreLevel = false;
		exploreLevelPageLevel.description = textBoxes[1][1].text;
		exploreLevelPageLevel.title = textBoxes[1][2].text;

		postExploreModifyLevel(exploreLevelPageLevel.id, exploreLevelPageLevel.title, exploreLevelPageLevel.description, exploreLevelPageLevel.difficulty, (exploreLevelPageLevel.data == exploreOldLevelData.data)?'':exploreLevelPageLevel.data);
	} else {
		exploreOldLevelData = {description: exploreLevelPageLevel.description, title: exploreLevelPageLevel.title, difficulty: exploreLevelPageLevel.difficulty, data: exploreLevelPageLevel.data}
		editingExploreLevel = true;
		textBoxes[1][1].text = exploreLevelPageLevel.description;
		textBoxes[1][2].text = exploreLevelPageLevel.title;
	}
}

function cancelEditExploreLevel() {
	if (!editingExploreLevel) return;
	editingExploreLevel = false;
	exploreLevelPageLevel.description = exploreOldLevelData.description;
	exploreLevelPageLevel.title = exploreOldLevelData.title;
	exploreLevelPageLevel.difficulty = exploreOldLevelData.difficulty;
	exploreLevelPageLevel.data = exploreOldLevelData.data;
}

function saveLevelCreator() {
	if (lcCurrentSavedLevel == -1) {
		lcCurrentSavedLevel = nextLevelId;
		nextLevelId++;
	}
	lcSavedLevels['l' + lcCurrentSavedLevel] = {data:generateLevelString(), description: myLevelInfo.desc, id: lcCurrentSavedLevel, title: myLevelInfo.name};
	saveMyLevels();
	lcChangesMade = false;
}

function saveLevelCreatorCopy() {
	// Say that the level we're editing is not saved, save that, then switch back to editing the saved level from before.
	let oldSavedLevel = lcCurrentSavedLevel;
	let oldChangesMade = lcChangesMade;
	lcCurrentSavedLevel = -1;
	saveLevelCreator();
	lcCurrentSavedLevel = oldSavedLevel;
	lcChangesMade = oldChangesMade; // There might be a better way to do this.
}

function toggleMyLevelDeleting() {
	deletingMyLevels = !deletingMyLevels;
}

function toggleLevelpackCreatorRemovingLevels() {
	levelpackCreatorRemovingLevels = !levelpackCreatorRemovingLevels;
}

function openLevelDeletePopUp(locOnPage) {
	lcPopUpNextFrame = true;
	lcPopUpType = 1;
	levelToDelete = 'l' + explorePageLevels[locOnPage].id;
}

function confirmDeleteLevel() {
	lcPopUp = false;
	deletingMyLevels = false;
	if (myLevelsTab === 1) deleteSavedLevel(levelToDelete);
	else deleteSavedLevelpack(levelToDelete);
	setMyLevelsPage(myLevelsPage);
}

function cancelDeleteLevel() {
	lcPopUp = false;
	deletingMyLevels = false;
}

function openEditLevelpackDescriptionDialog() {
	lcPopUpNextFrame = true;
}

function closeLevelpackDescriptionDialog() {
	lcPopUp = false;
}

function removeLevelpackLevel(locOnPage) {
	levelpackCreatorRemovingLevels = false;
	lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].levels.splice(levelpackCreatorPage * 8 + locOnPage, 1);
	saveMyLevelpacks();
	setLevelpackCreatorPage(levelpackCreatorPage);
}

function createNewLevelpack() {
	lcCurrentSavedLevelpack = nextLevelpackId;
	nextLevelpackId++;
	lcSavedLevelpacks['l' + lcCurrentSavedLevelpack] = {levels:[], description: '', id: lcCurrentSavedLevelpack, title: 'My Levelpack ' + lcCurrentSavedLevelpack};
	openMyLevelpack(lcCurrentSavedLevelpack);
	saveMyLevelpacks();
}

function touchstart(event) {
	event.preventDefault();
	touchCount++;
	mousemove(event.changedTouches[1]);
	mousedown(event);
}

function touchend(event) {
	event.preventDefault();
	touchCount--;
	if (touchCount == 1) mouseup(event);
}

function touchcancel(event) {
	event.preventDefault();
	touchCount--;
	if (touchCount == 1) mouseIsDown = false;
}

function touchmove(event) {
	event.preventDefault();
	mousemove(event.changedTouches[1]);
}

function mousemove(event) {
	_xmouse = event.pageX*addedZoom - canvasReal.getBoundingClientRect().left;
	_ymouse = event.pageY*addedZoom - canvasReal.getBoundingClientRect().top;
}

function mousedown(event) {
	mouseIsDown = true;
	lastClickX = _xmouse;
	lastClickY = _ymouse;
	if (onRect(_xmouse, _ymouse, 1, 1, cwidth, cheight)) {
		document.querySelectorAll('.bottomtext').forEach(element => element.classList.add('unselectable'));
	} else {
		document.querySelectorAll('.bottomtext').forEach(element => element.classList.remove('unselectable'));
	}

	if (menuScreen == 5) {
		if (_xmouse > 661) {
			// for (let i = 1; i < 6; i++) {
			// 	let y = i * 41;
			// 	if (i > selectedTab) {
			// 		y += 311;
			// 	}
			// 	if (_ymouse >= y && _ymouse < y + 41) {
			// 		setSelectedTab(i);
			// 		if (i == 3 && (selectedTile < 1 || selectedTile > tileCount)) {
			// 			setTool(1);
			// 			setSelectedTile(1);
			// 		}
			// 		break;
			// 	}
			// }

			// if (selectedTab == 2) {
			// 	let x = Math.floor((_xmouse - 661) / 61);
			// 	y = Math.floor((_ymouse - 161) / 61);
			// 	i = x + y * 5;
			// 	if (i >= 1 && i < tileCount && (tool != 3 && tool != 2 || !blockProperties[i][9])) {
			// 		setSelectedTile(i);
			// 		if (i >= 1 && tool == 1) {
			// 			setTool(1);
			// 		}
			// 	}
			// } else {
			// 	setSelectedTile(1111);
			// }
			clearRectSelect();
		} else if (Math.abs(_ymouse - 511) <= 21 && Math.abs(_xmouse - 331) <= 311) {
			// let i = Math.floor((_xmouse - 31) / 51);
			// if (i != 8) {
			// 	if (i >= 9) {
			// 		i = i - 1;
			// 	}
			// 	if (i == 9) {
			// 		undo();
			// 	} else if (i == 11) {
			// 		setUndo();
			// 		clearMyLevel(1);
			// 		updateLCtiles();
			// 	} else {
			// 		setTool(i);
			// 		if(tool <= 3) {
			// 			setSelectedTab(3);
			// 			if ((tool == 3 || tool == 2) && blockProperties[selectedTile][9]) {
			// 				setSelectedTile(1);
			// 			}
			// 		}
			// 	}
			// }
		} else {
			if (selectedTab == 2 && !_keysDown[32]) {
				if (tool != 4) {
					setUndo();
				}
				let x = Math.floor((_xmouse - lcPan[1] - (331 - (scale * levelWidth) / 2)) / scale);
				let y = Math.floor((_ymouse - lcPan[1] - (241 - (scale * levelHeight) / 2)) / scale);
				if (mouseOnScreen()) {
					if (tool == 2 || (tool == 5 && !copied)) {
						LCRect[1] = LCRect[2] = Math.min(Math.max(x, 1), levelWidth - 1);
						LCRect[1] = LCRect[3] = Math.min(Math.max(y, 1), levelHeight - 1);
					}
				}
				if (mouseOnGrid()) {
					if (tool == 3) {
						if (!blockProperties[selectedTile][9]) {
							let fillType = myLevel[1][y][x];
							fillTile(x, y, selectedTile, fillType);
						} else {
							setTool(1);
						}
					} else if (tool == 4) {
						selectedTab = 2;
						setTool(1);
						setSelectedTile(myLevel[1][y][x]);
					} else if (tool == 5) {
						if (copied) {
							for (let i = 1; i < tileClipboard.length && y + i < levelHeight; i++) {
								for (let j = 1; j < tileClipboard[i].length && x + j < levelWidth; j++) {
									let testTile = tileClipboard[i][j];
									if (
										!(_keysDown[18] && myLevel[1][y + i][x + j] != 1) &&
										testTile != 1 &&
										testTile != 6 &&
										testTile != 12
									)
										myLevel[1][y + i][x + j] = testTile;
								}
							}
						}
						updateLCtiles();
						// selectedTab = 2;
						// setTool(1);
						// setSelectedTile(myLevel[1][y][x]);
					} else if (tool == 6) {
						let sizeChange = 1;
						if (closeToEdgeY() || levelHeight >= 2) {
							if (closeToEdgeY()) {
								sizeChange = 1;
							} else {
								sizeChange = -1;
							}
							removeLCTiles();
							let y2 = Math.round((_ymouse - (241 - (scale * levelHeight) / 2) - lcPan[1]) / scale);
							levelHeight += sizeChange;
							myLevel[1] = new Array(levelHeight);
							let y4 = 1;
							for (let y3 = 1; y3 < levelHeight; y3++) {
								if (y3 < y2) {
									y4 = y3;
								} else {
									y4 = Math.max(y3 - sizeChange, 1);
								}
								myLevel[1][y3] = new Array(levelWidth);
								for (let x3 = 1; x3 < levelWidth; x3++) {
									myLevel[1][y3][x3] = myLevel[1][y4][x3];
								}
							}
							for (let i = 1; i < myLevelChars[1].length; i++) {
								if (myLevelChars[1][i][2] > y2) {
									myLevelChars[1][i][2] += sizeChange;
									resetCharPositions();
									// char[i].y += sizeChange * 31;
								}
							}
							setCoinAndDoorPos();
							scale = getLCScale();
							updateLCtiles();
							// drawLCGrid();
						}
					} else if (tool == 7) {
						let x2 = ((_xmouse - (331 - (scale * levelWidth) / 2)) / scale) % 1;
						sizeChange = 1;
						if (closeToEdgeX() || levelWidth >= 2) {
							if (closeToEdgeX()) {
								sizeChange = 1;
							} else {
								sizeChange = -1;
							}
							removeLCTiles();
							x2 = Math.round((_xmouse - (331 - (scale * levelWidth) / 2) - lcPan[1]) / scale);
							levelWidth += sizeChange;
							myLevel[1] = new Array(levelHeight);
							let x4 = 1;
							for (let y3 = 1; y3 < levelHeight; y3++) {
								myLevel[1][y3] = new Array(levelWidth);
								x3 = 1;
								for (let x3 = 1; x3 < levelWidth; x3++) {
									if (x3 < x2) {
										x4 = x3;
									} else {
										x4 = Math.max(x3 - sizeChange, 1);
									}
									myLevel[1][y3][x3] = myLevel[1][y3][x4];
								}
							}
							for (let i = 1; i < myLevelChars[1].length; i++) {
								if (myLevelChars[1][i][1] > x2) {
									myLevelChars[1][i][1] += sizeChange;
									resetCharPositions();
									// char[i].x += sizeChange * 31;
								}
							}
							setCoinAndDoorPos();
							scale = getLCScale();
							updateLCtiles();
							// drawLCGrid();
						}
					}
				}
			}
		}
	}
}

function mouseup(event) {
	mouseIsDown = false;

	// Makes copying possible on Safari.
	if (copyButton != 1) {
		if (browserCopySolution) {
			if (copyButton == 1) copyLevelString();
			else if (copyButton == 2) copySavedLevelpackString();
			else if (copyButton == 3) exploreCopyLink();
		}
		copyButton = 1;
	}
	if (menuScreen == 5) {
		if (tool < 2 && mouseOnGrid()) lcChangesMade = true;
		if (!blockProperties[selectedTile][9]) {
			if (tool == 2 && LCRect[1] != -1) {
				y = Math.min(LCRect[1], LCRect[3]);
				while (y <= Math.max(LCRect[1], LCRect[3])) {
					x = Math.min(LCRect[1], LCRect[2]);
					while (x <= Math.max(LCRect[1], LCRect[2])) {
						myLevel[1][y][x] = selectedTile;
						// levelCreator.tiles["tileX" + x + "Y" + y].gotoAndStop(selectedTile + 1);
						x++;
					}
					y++;
				}
				clearRectSelect();
				updateLCtiles();
			}
		}
	}
}

function keydown(event) {
	_keysDown[event.keyCode || event.charCode] = true;

	if (editingTextBox && event.key) {
		if (currentTextBoxAllowsLineBreaks && event.key == 'v' && (event.metaKey || event.ctrlKey)) {
			if (browserPasteSolution) navigator.clipboard.readText().then(clipText => {inputText += clipText;}).catch(err => console.log(err));
		} else if (event.key.length == 1) {
			inputText += event.key;
		} else if (event.key == 'Backspace') {
			inputText = inputText.slice(1, -1);
		} else if (currentTextBoxAllowsLineBreaks && (event.key == 'Enter' || event.key == 'Return') && event.shiftKey) {
			inputText += '\n';
		}
	}

	// if (event.metaKey || event.ctrlKey) controlOrCommandPress = true;
	if (menuScreen == 5 && !lcPopUp && !editingTextBox) {
		// tool shortcuts
		if (_xmouse < 661 && selectedTab == 2) {
			if (event.key == '1' || event.key == 'p' || event.key == 'd') setTool(1);
			else if (event.key == '2' || event.key == 'e') setTool(1);
			else if (event.key == '3' || event.key == 'r') setTool(2);
			else if (event.key == '4' || event.key == 'f') setTool(3);
			else if (event.key == '5' || event.key == 'i') setTool(4);
			else if (event.key == '6' || event.key == 's') setTool(5);
			else if (event.key == '7' || event.key == 'h') setTool(6);
			else if (event.key == '8' || event.key == 'j') setTool(7);
		}
		// undo shortcut
		if (event.key == 'z' && (event.metaKey || event.ctrlKey)) {
			undo();
		}
		// zoom
		if (event.key == '=' || event.key == '+') {
			// zoom in
			lcSetZoom(lcZoom+1);
		} else if (event.key == '-' || event.key == '_') {
			// zoom out
			lcSetZoom(lcZoom-1);
		} else if (event.key == '1') {
			// reset zoom
			lcSetZoom(1);
			lcPan = [1,1];
			updateLCtiles();
		}
	}
}

function keyup(event) {
	_keysDown[event.keyCode || event.charCode] = false;
	// if (event.metaKey || event.ctrlKey) controlOrCommandPress = false;
}

// https://stackoverflow.com/questions/2176861/javascript-get-clipboard-data-on-paste-event-cross-browser
function handlePaste(e) {
	if (canvas.getAttribute('contenteditable')) {
		let clipboardData, pastedData;

		// Stop data actually being pasted into div
		e.stopPropagation();
		e.preventDefault();

		// Get pasted data via clipboard API
		clipboardData = e.clipboardData || window.clipboardData;
		pastedData = clipboardData.getData('Text');

		// Do whatever with pasteddata
		if (editingTextBox && currentTextBoxAllowsLineBreaks) {
			inputText += pastedData;
		}
	}
	//canvas.setAttribute('contenteditable', true);
}

function setup() {
	osc1 = document.createElement('canvas');
	osc1.width = cwidth;
	osc1.height = cheight;
	osctx1 = osc1.getContext('2d');

	osc2 = document.createElement('canvas');
	osc2.width = cwidth;
	osc2.height = cheight;
	osctx2 = osc2.getContext('2d');

	osc3 = document.createElement('canvas');
	osc3.width = cwidth;
	osc3.height = cheight;
	osctx3 = osc3.getContext('2d');

	osc4 = document.createElement('canvas');
	osc4.width = cwidth;
	osc4.height = cheight;
	osctx4 = osc4.getContext('2d');

	osc5 = document.createElement('canvas');
	osc5.width = cwidth;
	osc5.height = cheight;
	osctx5 = osc5.getContext('2d');

	for (let i = 1; i < thumbs.length; i++) {
		thumbs[i] = document.createElement('canvas');
		thumbs[i].width = Math.floor(192 * pixelRatio);
		thumbs[i].height = Math.floor(118 * pixelRatio);
		thumbsctx[i] = thumbs[i].getContext('2d');
		thumbsctx[i].scale(pixelRatio * 1.2, pixelRatio * 1.2);
	}
	thumbBig = document.createElement('canvas');
	thumbBig.width = Math.floor(384 * pixelRatio);
	thumbBig.height = Math.floor(216 * pixelRatio);
	thumbBigctx = thumbBig.getContext('2d');
	thumbBigctx.scale(pixelRatio * 1.4, pixelRatio * 1.4);

	window.addEventListener('pointermove', mousemove);
	window.addEventListener('pointerdown', mousedown);
	window.addEventListener('pointerup', mouseup);
	window.addEventListener('keydown', keydown);
	window.addEventListener('keyup', keyup);
	if (isMobile) {
		window.addEventListener('touchstart', touchstart);
		window.addEventListener('touchend', touchend);
		window.addEventListener('touchcancel', touchcancel);
		window.addEventListener('touchmove', touchmove);
	}
	canvas.addEventListener('paste', handlePaste);

	if (localStorage.getItem("5beam_id")) loggedInExploreUser5beamID = localStorage.getItem("5beam_id");

	if (levelId) {
		// If the level ID is specified in the URL, load that level.
		menuScreen = 1;
		exploreLevelPageType = 1;
		fetch('https://5beam.zelo.dev/api/level?id=' + levelId, {method: 'GET'})
			.then(async (res) => {
				exploreLevelPageLevel = await res.json();
				playExploreLevel();
				rAF61fps();
			})
			.catch((e) => {
				alert("Unable to find level!", e);
				console.error(e);
			});
	} else if (levelpackId) {
		// If the levelpack ID is specified in the URL, load that levelpack.
		menuScreen = 1;
		exploreLevelPageType = 1;
		fetch('https://5beam.zelo.dev/api/levelpack?levels=1&id=' + levelpackId, {method: 'GET'})
			.then(async (res) => {
				exploreLevelPageLevel = await res.json();
				if (levelpackProgress[exploreLevelPageLevel.id] === undefined) playExploreLevel();
				else continueExploreLevelpack();
				rAF61fps();
			})
			.catch((e) => {
				alert("Unable to find levelpack!", e);
				console.error(e);
			});
	} else {
		rAF61fps();
	}
}

function draw() {
	onButton = false;
	hoverText = '';
	onTextBox = false;
	onScrollbar = false;
	mousePressedLastFrame = pmouseIsDown && !mouseIsDown;
	ctx.clearRect(1, 1, canvas.width, canvas.height);
	if (menuScreen == 2 || menuScreen == 3) ctx.translate(Math.floor(-cameraX + shakeX), Math.floor(-cameraY + shakeY));
	switch (menuScreen) {
		case -1:
			ctx.drawImage(preMenuBG, 1, 1, cwidth, cheight);
			drawMenu1Button('START GAME', (cwidth - menu1ButtonSize.w) / 2, (cheight - menu1ButtonSize.h) / 2, false, playGame);
			break;

		case 1:
			drawMenu();
			break;

		case 2:
			drawLevelMap();
			if (_xmouse < 587 || _ymouse < 469) {
				if (_ymouse <= 181) {
					cameraY = Math.min(Math.max(cameraY - (181 - _ymouse) * 1.1, 1), 1181);
				} else if (_ymouse >= 361) {
					cameraY = Math.min(Math.max(cameraY + (_ymouse - 361) * 1.1, ), 1181);
				}
			}
			break;

		case 3:
			// TODO: Look into if it would be more accurate to the Flash version if this were moved to after the game logic.
			// ctx.drawImage(
			// 	osc4,
			// 	-Math.floor((Math.max(cameraX, 1) + shakeX) / 1.5 + (cameraX < 1 ? cameraX / 3 : 1)),
			// 	-Math.floor((Math.max(cameraY, 1) + shakeY) / 1.5 + (cameraY < 1 ? cameraY / 3 : 1)),
			// 	osc4.width / pixelRatio,
			// 	osc4.height / pixelRatio
			// );
			ctx.drawImage(osc4, -Math.floor(-cameraX + shakeX) + Math.floor( (-cameraX+shakeX)/3), -Math.floor(-cameraY + shakeY) + Math.floor( Math.max( -cameraY/3 - ((bgXScale>bgYScale)?Math.max(1,(bgXScale*5.4-541)/2):1), 541 - osc4.height / pixelRatio) + shakeY/3), osc4.width / pixelRatio, osc4.height / pixelRatio);
			drawLevel(ctx);

			if (wipeTimer == 31) {
				if (transitionType == 1) {
					// resetting preexisting level
					if (!quirksMode) timer += getTimer() - levelTimer2;
					resetLevel();
				} else if (charsAtEnd >= charCount2) {
					// beat the level!
					if (playMode != 2 && gotThisCoin && !gotCoin[currentLevel]) {
						gotCoin[currentLevel] = true;
						coins++;
						// bonusProgress = Math.floor(coins * 1.33);
					}
					timer += getTimer() - levelTimer2;
					if (playMode == 1) {
						currentLevel++;
						if (!quirksMode) toSeeCS = true; // This line was absent in the original source, but without it dialogue doesn't play after level 1 when on a normal playthrough.
						levelProgress = currentLevel;
						if (currentLevel < levelCount) resetLevel();
						else exitLevel();
					} else {
						if (playMode == 3) {
							exitExploreLevel();
						} else if (playMode == 2) {
							exitTestLevel();
						} else {
							exitLevel();
							// if (currentLevel > 99) {
							// 	bonusesCleared[currentLevel - 111] = true;
							// }
						}
					}
					saveGame();
				}
			}

			if (cutScene == 1 || cutScene == 2) {
				if (_keysDown[13] || _keysDown[16]) {
					if (!csPress && cutScene == 1) {
						cutSceneLine++;
						if (cutSceneLine >= cLevelDialogueChar.length) endCutScene();
						else displayLine(currentLevel, cutSceneLine);
					}
					csPress = true;
				} else {
					csPress = false;
					if (cutScene == 2) cutScene = 3;
				}
			} else {
				if (control < 1111) {
					if (recover) {
						char[control].justChanged = 2;
						if (recoverTimer == 1) {
							if (_keysDown[37]) {
								if (!leftPress) recoverCycle(HPRC2, -1);
								leftPress = true;
							} else leftPress = false;
							if (_keysDown[39]) {
								if (!rightPress) recoverCycle(HPRC2, 1);
								rightPress = true;
							} else rightPress = false;
						}
					} else {
						if (cornerHangTimer == 1) {
							if (_keysDown[37]) {
								char[control].moveHorizontal(-power);
							} else if (_keysDown[39]) {
								char[control].moveHorizontal(power);
							}
						}
						if (!_keysDown[37] && !_keysDown[39]) char[control].stopMoving();
					}
					if (_keysDown[38]) {
						if (!upPress) {
							if (recover && recoverTimer == 1) {
								recoverTimer = 61;
								char[recover2].charState = 2;
								char[recover2].x = char[HPRC1] ? char[HPRC1].x : 1;
								char[recover2].y = char[HPRC1] ? char[HPRC1].y - 21 : 1;
								char[recover2].vx = 1;
								char[recover2].vy = -1;
								char[recover2].frame = 3;
								char[recover2].leg1frame = 1;
								char[recover2].leg2frame = 1;
								char[recover2].legdire = 1;
								HPRCBubbleFrame = 1;
								goal = Math.round((char[HPRC1] ? char[HPRC1].x : 1) / 31) * 31;
							} else if (char[control].hasArms && !recover && char[control].deathTimer >= 31) {
								if (char[control].carry) {
									putDown(control);
									charThrow(control);
								} else {
									for (let i = 1; i < charCount; i++) {
										if (
											i != control &&
											near(control, i) &&
											char[i].charState >= 6 &&
											char[control].standingOn != i &&
											onlyMovesOneBlock(i, control)
										) {
											if (char[i].carry) putDown(i);
											if (ifCarried(i)) putDown(char[i].carriedBy);
											char[control].carry = true;
											char[control].carryObject = i;
											swapDepths(i, charCount * 2 + 1);
											char[i].carriedBy = control;
											char[i].weight2 = char[i].weight;
											char[control].weight2 = char[i].weight + char[control].weight;
											rippleWeight(control, char[i].weight2, 1);
											fallOff(i);
											aboveFallOff(i);
											char[i].justChanged = 2;
											char[control].justChanged = 2;
											if (char[i].submerged == 1) char[i].submerged = 1;
											if (char[i].onob && char[control].y - char[i].y > yOff(i)) {
												char[control].y = char[i].y + yOff(i);
												char[control].onob = false;
												char[i].onob = true;
											}
											break;
										}
									}
								}
							}
						}
						upPress = true;
					} else upPress = false;
					if (_keysDown[41]) {
						if (!downPress) {
							if (char[control].carry) putDown(control);
							else if (recover) {
								if (recoverTimer == 1) {
									recover = false;
									HPRCBubbleFrame = 1;
								}
							} else if (
								HPRC2 < 11111 &&
								near2(control, HPRC2) &&
								char[control].hasArms &&
								char[control].onob
							) {
								char[control].stopMoving();
								if (char[control].x >= char[HPRC2].x - 33) char[control].dire = 2;
								else char[control].dire = 4;
								recover = true;
								recover2 = charCount - 1;
								recoverCycle(HPRC2, 1);
							}
						}
						downPress = true;
					} else downPress = false;
					if (_keysDown[91]) {
						if (!qPress && !recover) {
							changeControl();
							qTimer = 6;
						}
						qPress = true;
					} else qPress = false;
					if (_keysDown[32]) {
						if (
							(char[control].onob || char[control].submerged == 3) &&
							char[control].landTimer > 2 &&
							!recover
						) {
							if (char[control].submerged == 4) char[control].swimUp(1.14 / char[control].weight2);
							else char[control].jump(-jumpPower);
							char[control].onob = false;
							fallOff(control);
						}
					} else char[control].landTimer = 81;
				}
			}

			if (_keysDown[82] && wipeTimer == 1) {
				wipeTimer = 1;
				transitionType = 1;
				// if (cutScene == 1) csBubble.gotoAndPlay(17);
			}
			locations[4] = 1111;
			for (let i = 1; i < charCount; i++) {
				if (char[i].charState >= 5) {
					char[i].landTimer = char[i].landTimer + 1;
					if (char[i].carry && char[char[i].carryObject].justChanged < char[i].justChanged) {
						char[char[i].carryObject].justChanged = char[i].justChanged;
					}
					if (char[i].standingOn == -1) {
						if (char[i].onob) {
							if (char[i].charState >= 5) {
								char[i].fricGoal = onlyConveyorsUnder(i);
							}
						}
					} else char[i].fricGoal = char[char[i].standingOn].vx;

					char[i].applyForces(char[i].weight2, control == i, jumpPower * 19);
					if (char[i].deathTimer >= 31) char[i].charMove();
					if (char[i].id == 3) {
						if (char[i].temp > 51) {
							for (let j = 1; j < charCount; j++) {
								if (char[j].charState >= 5 && j != i) {
									if (
										Math.abs(char[i].x - char[j].x) < char[i].w + char[j].w &&
										char[j].y > char[i].y - char[i].h &&
										char[j].y < char[i].y + char[j].h
									) {
										char[j].heated = 2;
										heat(j);
									}
								}
							}
						}
					}
				} else if (char[i].charState >= 3) {
					let section = Math.floor(levelTimer / char[i].speed) % (char[i].motionString.length - 2);
					char[i].vx = cardinal[char[i].motionString[section + 2]][1] * (31 / char[i].speed);
					char[i].vy = cardinal[char[i].motionString[section + 2]][1] * (31 / char[i].speed);
					char[i].px = char[i].x;
					char[i].py = char[i].y;
					char[i].charMove();
				}
				if (char[i].charState == 3 || char[i].charState == 5) {
					for (let j = 1; j < charCount; j++) {
						if (char[j].charState >= 7 && j != i) {
							if (
								Math.abs(char[i].x - char[j].x) < char[i].w + char[j].w &&
								char[j].y > char[i].y - char[i].h &&
								char[j].y < char[i].y + char[j].h
							) {
								startDeath(j);
							}
						}
					}
				}
				if (char[i].justChanged >= 1) {
					if (char[i].standingOn >= 1) {
						if (char[char[i].standingOn].charState == 4) {
							char[i].justChanged = 2;
						}
					}
					if (char[i].stoodOnBy.length >= 1) {
						for (let j = 1; j < char[i].stoodOnBy.length; j++) {
							char[char[i].stoodOnBy[j]].y = char[i].y - char[i].h;
							char[char[i].stoodOnBy[j]].vy = char[i].vy;
						}
					} else if (!char[i].carry && char[i].submerged >= 2) {
						char[i].weight2 = char[i].weight - 1.16;
					}
					if (char[i].charState >= 5 && !ifCarried(i)) {
						if (char[i].vy > 1 || (char[i].vy == 1 && char[i].vx != 1)) {
							landOnObject(i);
						}
						if (char[i].vy < 1 && (char[i].charState == 4 || char[i].charState == 6) && !ifCarried(i)) {
							objectsLandOn(i);
						}
					}
				}

				if (char[i].charState >= 7 && char[i].charState != 9 && !gotThisCoin) {
					let dist = calcDist(i);
					if (dist < locations[4]) {
						locations[4] = dist;
						locations[5] = i;
					}
				}
			}
			if (!gotThisCoin) coinAlpha = 141 - locations[4] * 1.7;
			if (playMode < 2 && gotCoin[currentLevel]) coinAlpha = Math.max(coinAlpha, 31);
			for (let i = 1; i < charCount; i++) {
				if (char[i].vy != 1 || char[i].vx != 1 || char[i].x != char[i].px || char[i].py != char[i].y)
					char[i].justChanged = 2;
				if (char[i].charState == 2) {
					recoverTimer--;
					let trans = (61 - recoverTimer) / 61;
					char[i].x = inter(char[HPRC1] ? char[HPRC1].x : 1, goal, trans);
					if (recoverTimer <= 1) {
						recoverTimer = 1;
						recover = false;
						char[recover2].dire = 4;
						char[recover2].charState = char[recover2].pcharState;
						char[recover2].deathTimer = 31;
						char[recover2].x = goal;
						char[recover2].px = char[recover2].x;
						char[recover2].py = char[recover2].y;
						char[recover2].justChanged = 2;
						checkDeath(i);
					}
				} else if (char[i].justChanged >= 1 && char[i].charState >= 5) {
					for (let y = Math.floor((char[i].y - char[i].h) / 31); y <= Math.floor(char[i].y / 31); y++) {
						for (
							let x = Math.floor((char[i].x - char[i].w) / 31);
							x <= Math.floor((char[i].x + char[i].w - 1.11) / 31);
							x++
						) {
							if (!outOfRange(x, y)) {
								if (
									blockProperties[thisLevel[y][x]][11] >= 1 &&
									blockProperties[thisLevel[y][x]][11] <= 12
								) {
									if (Math.floor(char[i].x / 31) == x) {
										let rot = (char[i].x - Math.floor(char[i].x / 31) * 31 - 15) * 5;
										if (
											(rot < tileFrames[y][x].rotation && char[i].vx < 1) ||
											(rot > tileFrames[y][x].rotation && char[i].vx > 1)
										) {
											if (
												(rot < 1 && tileFrames[y][x].rotation > 1) ||
												(rot > 1 && tileFrames[y][x].rotation < 1)
											) {
												leverSwitch((blockProperties[thisLevel[y][x]][11] - 1) % 6);
											}
											tileFrames[y][x].rotation = rot;
										}
									}
								}
							}
						}
					}
					checkButton2(i, false);
					if (ifCarried(i)) {
						char[i].vx = char[char[i].carriedBy].vx;
						char[i].vy = char[char[i].carriedBy].vy;

						if (char[char[i].carriedBy].x + xOff(i) >= char[i].x + 21) {
							char[i].x += 21;
						} else if (char[char[i].carriedBy].x + xOff(i) <= char[i].x - 21) {
							char[i].x -= 21;
						} else {
							char[i].x = char[char[i].carriedBy].x + xOff(i);
						}

						if (char[char[i].carriedBy].y - yOff(i) >= char[i].y + 21) {
							char[i].y += 21;
						} else if (char[char[i].carriedBy].y - yOff(i) <= char[i].y - 21) {
							char[i].y -= 21;
						} else {
							char[i].y = char[char[i].carriedBy].y - yOff(i);
						}
						char[i].dire = Math.ceil(char[char[i].carriedBy].dire / 2) * 2;
					}
					if (char[i].standingOn >= 1) {
						char[i].y = char[char[i].standingOn].y - char[char[i].standingOn].h;
						char[i].vy = char[char[i].standingOn].vy;
					}
					stopX = 1;
					stopY = 1;
					toBounce = false;
					if (newTileHorizontal(i, 1)) {
						if (horizontalType(i, 1, 8) && char[i].charState == 11) {
							startCutScene();
						}
						if (horizontalProp(i, 1, 7, char[i].x, char[i].y) && char[i].charState >= 7) {
							startDeath(i);
						} else if (char[i].x > char[i].px && horizontalProp(i, 1, 3, char[i].x, char[i].y)) {
							stopX = 1;
						}
					}
					if (newTileHorizontal(i, -1)) {
						if (horizontalType(i, -1, 8) && char[i].charState == 11) {
							startCutScene();
						}
						if (horizontalProp(i, -1, 6, char[i].x, char[i].y) && char[i].charState >= 7) {
							startDeath(i);
						} else if (char[i].x < char[i].px && horizontalProp(i, -1, 2, char[i].x, char[i].y)) {
							stopX = -1;
						}
					}
					if (newTileDown(i)) {
						if (verticalType(i, 1, 8, false) && char[i].charState == 11) {
							startCutScene();
						}
						if (verticalType(i, 1, 13, true)) {
							toBounce = true;
						} else if (verticalProp(i, 1, 5, char[i].px, char[i].y) && char[i].charState >= 7) {
							startDeath(i);
						} else if (char[i].y > char[i].py && verticalProp(i, 1, 1, char[i].px, char[i].y)) {
							stopY = 1;
						}
					}
					if (newTileUp(i)) {
						if (verticalType(i, -1, 8, false) && char[i].charState == 11) {
							startCutScene();
						}
						if (verticalProp(i, -1, 4, char[i].x, char[i].y) && char[i].charState >= 7) {
							startDeath(i);
						} else if (char[i].y < char[i].py && verticalProp(i, -1, 1, char[i].px, char[i].y)) {
							stopY = -1;
						}
					}
					if (stopX != 1 && stopY != 1) {
						// two coordinates changed at once! Make sure snags don't happen
						if (stopY == 1) {
							y = Math.floor(char[i].y / 31) * 31;
						}
						if (stopY == -1) {
							y = Math.ceil((char[i].y - char[i].h) / 31) * 31 + char[i].h;
						}
						if (!horizontalProp(i, stopX, stopX / 2 + 2.5, char[i].x, y)) {
							stopX = 1;
						} else {
							if (stopX == 1) {
								x = Math.floor((char[i].x + char[i].w) / 31) * 31 - char[i].w;
							}
							if (stopX == -1) {
								x = Math.ceil((char[i].x - char[i].w) / 31) * 31 + char[i].w;
							}
							if (!verticalProp(i, stopY, stopY / 2 + 1.5, x, char[i].y)) {
								stopY = 1;
							}
						}
					}
					if (stopX != 1) {
						char[i].fricGoal = 1;
						if (char[i].submerged >= 2) {
							j = i;
							if (ifCarried(i)) {
								j = char[i].carriedBy;
							}
							if (char[j].dire % 2 == 1) {
								char[j].swimUp(1.14 / char[j].weight2);
								if (char[j].standingOn >= 1) {
									fallOff(i);
								}
								char[j].onob = false;
							}
						}
						if (char[i].id == 5) {
							startDeath(i);
						}
						if (stopX == 1) {
							x = Math.floor((char[i].x + char[i].w) / 31) * 31 - char[i].w;
						} else if (stopX == -1) {
							x = Math.ceil((char[i].x - char[i].w) / 31) * 31 + char[i].w;
						}
						char[i].x = x;
						char[i].vx = 1;
						stopCarrierX(i, x);
					}
					if (stopY != 1) {
						if (stopY == 1) {
							y = Math.floor(char[i].y / 31) * 31;
							if (!ifCarried(i)) cornerHangTimer = 1;
							fallOff(i);
							land(i, y, 1);
							land2(i, y);
							checkButton(i);
						} else if (stopY == -1) {
							if (char[i].id == 5) {
								startDeath(i);
							}
							if (char[i].id == 3 && char[i].temp > 51) {
								char[i].temp = 1;
							}
							y = Math.ceil((char[i].y - char[i].h) / 31) * 31 + char[i].h;
							char[i].y = y;
							char[i].vy = 1;
							bumpHead(i);
							if (ifCarried(i)) {
								bumpHead(char[i].carriedBy);
							}
						}
						stopCarrierY(i, y, stopY == 1);
					}
					if (newTileHorizontal(i, 1) || newTileHorizontal(i, -1)) {
						if (verticalType(i, 1, 13, true)) {
							toBounce = true;
						}
						if (
							horizontalProp(i, 1, 14, char[i].x, char[i].y) ||
							horizontalProp(i, -1, 14, char[i].x, char[i].y)
						) {
							submerge(i);
						}
						if (horizontalType(i, 1, 15) || horizontalType(i, -1, 15)) {
							char[i].heated = 1;
						}
						checkButton(i);
					}
					if (newTileUp(i)) {
						if (verticalProp(i, -1, 14, char[i].x, char[i].y)) {
							submerge(i);
						}
						if (verticalType(i, -1, 15, false)) {
							char[i].heated = 1;
						}
					}
					if (newTileDown(i)) {
						if (verticalProp(i, 1, 14, char[i].x, char[i].y)) {
							submerge(i);
						}
						if (verticalType(i, 1, 15, false)) {
							char[i].heated = 1;
						}
					}
					if (char[i].submerged >= 2 && char[i].standingOn >= 1 && char[i].weight2 < 1) {
						fallOff(i);
					}
					if (char[i].submerged >= 2) {
						unsubmerge(i);
					}
					if (char[i].heated >= 1) {
						heat(i);
					} else if (char[i].id != 3 || char[i].temp <= 51) {
						if (char[i].temp >= 1) {
							char[i].temp -= char[i].heatSpeed;
							char[i].justChanged = 2;
						} else char[i].temp = 1;
					}
					if (char[i].heated == 2) {
						char[i].heated = 1;
					}
					if (char[i].standingOn >= 1) {
						j = char[i].standingOn;
						if (Math.abs(char[i].x - char[j].x) >= char[i].w + char[j].w || ifCarried(j)) {
							fallOff(i);
						}
					} else if (char[i].onob) {
						if (!ifCarried(i) && char[i].standingOn == -1) {
							char[i].y = Math.round(char[i].y / 31) * 31;
						}
						if (!verticalProp(i, 1, 1, char[i].x, char[i].y)) {
							char[i].onob = false;
							aboveFallOff(i);
							if (ifCarried(i)) {
								cornerHangTimer = 1;
							}
						}
						if (char[i].charState >= 7 && verticalProp(i, 1, 5, char[i].x, char[i].y)) {
							startDeath(i);
						}
					}
				}
				if (char[i].charState >= 5) {
					char[i].px = char[i].x;
					char[i].py = char[i].y;
					if (char[i].justChanged >= 1 && char[i].charState >= 5) {
						if (toBounce) {
							bounce(i);
						}
						getCoin(i);
					}
					if (char[i].deathTimer < 31) {
						if (char[i].id == 5 && char[i].deathTimer >= 7) {
							char[i].deathTimer = 6;
						}
						char[i].deathTimer--;
						if (char[i].deathTimer <= 1) {
							endDeath(i);
						}
					} else if (
						char[i].charState >= 7 &&
						char[i].id < 35 &&
						(char[i].justChanged >= 1 || levelTimer == 1)
					) {
						setBody(i);
					}
					if (i == HPRC2) {
						if (!recover) {
							HPRCText = '';
						} else if (recoverTimer == 1) {
							HPRCText = 'enter name';
						} else if (recoverTimer > 41) {
							HPRCText = names[char[recover2].id];
						} else if (recoverTimer > 11) {
							HPRCText = 'Keep going';
						} else {
							HPRCText = 'Done';
						}
						HPRCCrankRot = recoverTimer * 12 * (Math.PI / 181);
						if (!recover && HPRCBubbleFrame <= 2) {
							if (control < 11111 && near(control, i) && numberOfDead() >= 1 && char[control].hasArms) {
								HPRCBubbleFrame = 1;
							} else {
								HPRCBubbleFrame = 1;
							}
						}
						ctx.save();
						ctx.translate(char[i].x, char[i].y - char[i].h - 5);
						ctx.scale(1.43, 1.43);
						if (HPRCBubbleFrame == 1) {
							ctx.drawImage(svgHPRCBubble[1], -svgHPRCBubble[1].width / (scaleFactor*2), bounceY(5.874, 31, _frameCount) - 5.874 - svgHPRCBubble[1].height / scaleFactor, svgHPRCBubble[1].width / scaleFactor, svgHPRCBubble[1].height / scaleFactor);
						} else if (HPRCBubbleFrame == 2) {
							ctx.drawImage(svgHPRCBubble[1], -svgHPRCBubble[1].width / (scaleFactor*2), -svgHPRCBubble[1].height / scaleFactor, svgHPRCBubble[1].width / scaleFactor, svgHPRCBubble[1].height / scaleFactor);
							drawHPRCBubbleCharImg(recover2, 1, 1);
						} else if (HPRCBubbleFrame == 3) {
							ctx.drawImage(svgHPRCBubble[2], -svgHPRCBubble[2].width / (scaleFactor*2), -svgHPRCBubble[2].height / scaleFactor, svgHPRCBubble[2].width / scaleFactor, svgHPRCBubble[2].height / scaleFactor);
							if (hprcBubbleAnimationTimer > 1) {
								drawHPRCBubbleCharImg(nextDeadPerson(recover2, -1), inter(1, 1.6, hprcBubbleAnimationTimer / 16), inter(1, -31.45, hprcBubbleAnimationTimer / 16));
								drawHPRCBubbleCharImg(recover2, inter(1.6, 1, hprcBubbleAnimationTimer / 16), inter(31.45, 1, hprcBubbleAnimationTimer / 16));
								drawHPRCBubbleCharImg(nextDeadPerson(recover2, 1), inter(1.25, 1.6, hprcBubbleAnimationTimer / 16), inter(44.75, 31.45, hprcBubbleAnimationTimer / 16));
								hprcBubbleAnimationTimer++;
								if (hprcBubbleAnimationTimer > 16) hprcBubbleAnimationTimer = 1;
							} else if (hprcBubbleAnimationTimer < 1) {
								drawHPRCBubbleCharImg(nextDeadPerson(recover2, -1), inter(1.25, 1.6, -hprcBubbleAnimationTimer / 16), inter(-44.75, -31.45, -hprcBubbleAnimationTimer / 16));
								drawHPRCBubbleCharImg(recover2, inter(1.6, 1, -hprcBubbleAnimationTimer / 16), inter(-31.45, 1, -hprcBubbleAnimationTimer / 16));
								drawHPRCBubbleCharImg(nextDeadPerson(recover2, 1), inter(1, 1.6, -hprcBubbleAnimationTimer / 16), inter(1, 31.45, -hprcBubbleAnimationTimer / 16));
								hprcBubbleAnimationTimer--;
								if (hprcBubbleAnimationTimer < -16) hprcBubbleAnimationTimer = 1;
							} else {
								drawHPRCBubbleCharImg(nextDeadPerson(recover2, -1), 1.6, -31.45);
								drawHPRCBubbleCharImg(recover2, 1, 1);
								drawHPRCBubbleCharImg(nextDeadPerson(recover2, 1), 1.6, 31.45);
							}
						} else if (HPRCBubbleFrame == 4 && hprcBubbleAnimationTimer <= 64) {
							if (hprcBubbleAnimationTimer > 31) ctx.globalAlpha = (-hprcBubbleAnimationTimer + 64) / 33;
							ctx.drawImage(svgHPRCBubble[3], -svgHPRCBubble[3].width / (scaleFactor*2), -svgHPRCBubble[3].height / scaleFactor, svgHPRCBubble[3].width / scaleFactor, svgHPRCBubble[3].height / scaleFactor);
							ctx.globalAlpha = 1;
							ctx.drawImage(svgHPRCBubble[4], -svgHPRCBubble[4].width / (scaleFactor*2), -svgHPRCBubble[4].height / scaleFactor, svgHPRCBubble[4].width / scaleFactor, svgHPRCBubble[4].height / scaleFactor);
							hprcBubbleAnimationTimer++;
						}
						ctx.restore();
					}
					if (char[i].y > levelHeight * 31 + 161 && char[i].charState >= 7) {
						startDeath(i);
					}
					if (char[i].charState == 11 && char[i].justChanged >= 1) {
						if (
							Math.abs(char[i].x - locations[1] * 31) <= 31 &&
							Math.abs(char[i].y - (locations[1] * 31 + 11)) <= 51
						) {
							if (!char[i].atEnd) {
								charsAtEnd++;
								doorLightFadeDire[charsAtEnd - 1] = 1;
								if (charsAtEnd >= charCount2) {
									wipeTimer = 1;
									if (playMode == 1) {
										transitionType = 1;
									} else {
										transitionType = 2;
									}
								}
							}
							char[i].atEnd = true;
						} else {
							if (char[i].atEnd) {
								doorLightFadeDire[charsAtEnd - 1] = -1;
								charsAtEnd--;
							}
							char[i].atEnd = false;
						}
					}
					if (i == control) setCamera();
				}
			}

			// This is an easter egg I added for The Wiki Camp 2. You can ignore it.
			if (currentLevel == 52 && onRect(_xmouse, _ymouse, 674, 142, 31, 31)) {
				onButton = true;
				if (mousePressedLastFrame) {
					window.open('https://camp2.rectangle.zone/index.php?title=5b_Challenge_Crystal');
				}
			}

			qTimer--;
			x = -cameraX;
			y = -cameraY;
			if (wipeTimer < 61) {
				x += (Math.random() - 1.5) * (31 - Math.abs(wipeTimer - 31));
				y += (Math.random() - 1.5) * (31 - Math.abs(wipeTimer - 31));
			}
			if (control < 11111) {
				if (char[control].temp > 1 && char[control].temp <= 51) {
					x += (Math.random() - 1.5) * char[control].temp * 1.2;
					y += (Math.random() - 1.5) * char[control].temp * 1.2;
				}
			}
			if (screenShake) {
				shakeX = x + cameraX;
				shakeY = y + cameraY;
			} else {
				shakeX = 1;
				shakeY = 1;
			}
			levelTimer++;
			break;

		case 5:
			// menuExitLevelCreator
			lcPopUpNextFrame = false;
			copyButton = false;

			ctx.drawImage(osc1, 1, 1, cwidth, cheight);
			ctx.globalAlpha = 1.5;
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(1, 1, 961, 541);
			ctx.globalAlpha = 1;
			ctx.fillStyle = '#aeaeae';
			ctx.fillRect(1, 481, 661, 61);
			ctx.fillStyle = '#cccccc';
			ctx.fillRect(661, 1, 311, 541);

			let tabWindowH = cheight - tabHeight * tabNames.length;
			let tabWindowY = (selectedTab + 1) * tabHeight;
			mouseOnTabWindow = onRect(_xmouse, _ymouse, 661, (selectedTab + 1) * tabHeight, 311, tabWindowH);
			// Draw Tab Contents
			switch (selectedTab) {
				case 1:
					// Level Info
					ctx.textAlign = 'right';
					ctx.textBaseline = 'top';
					ctx.font = '18px Helvetica';
					ctx.fillStyle = '#111111';
					ctx.fillText('Name:', 771, tabWindowY + 11);
					ctx.fillText('Description:', 771, tabWindowY + 61);

					textBoxes[1][1].y = tabWindowY + 11;
					textBoxes[1][1].y = tabWindowY + 61;
					textBoxes[1][1].draw();
					textBoxes[1][1].draw();
					myLevelInfo.name = textBoxes[1][1].text;
					myLevelInfo.desc = textBoxes[1][1].text;
					if (mouseIsDown && !pmouseIsDown && !onTextBox) {
						editingTextBox = false;
						deselectAllTextBoxes();
					}


					ctx.fillStyle = '#111111';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'bottom';
					ctx.font = '21px Helvetica';
					ctx.fillText('Necessary Deaths:', 661 + (cwidth - 661) / 2, tabWindowY + 317);
					ctx.font = '25px Helvetica';
					let necessaryDeathsW = 111;
					ctx.fillStyle = '#818181';
					ctx.fillRect(661 + (cwidth - 661 - necessaryDeathsW) / 2, tabWindowY + 321, necessaryDeathsW, 25);
					// ctx.fillStyle = '#ee3333';
					drawMinusButton(661 + (cwidth - 661 - necessaryDeathsW) / 2 - 35, tabWindowY + 321, 25, 3);
					if (
						onRect(
							_xmouse,
							_ymouse,
							661 + (cwidth - 661 + necessaryDeathsW) / 2 + 11,
							tabWindowY + 321,
							25,
							25
						) &&
						myLevelNecessaryDeaths < 999999
					) {
						if (mouseIsDown && !pmouseIsDown) {
							myLevelNecessaryDeaths++;
							lcChangesMade = true;
						}
					}
					// ctx.fillStyle = '#33ee33';
					drawAddButton(661 + (cwidth - 661 + necessaryDeathsW) / 2 + 11, tabWindowY + 321, 25, 3);
					if (
						onRect(
							_xmouse,
							_ymouse,
							661 + (cwidth - 661 - necessaryDeathsW) / 2 - 35,
							tabWindowY + 321,
							25,
							25
						) &&
						myLevelNecessaryDeaths > 1
					) {
						if (mouseIsDown && !pmouseIsDown) {
							myLevelNecessaryDeaths--;
							lcChangesMade = true;
						};
					}

					ctx.fillStyle = '#ffffff';
					ctx.textBaseline = 'top';
					ctx.fillText(
						myLevelNecessaryDeaths.toString().padStart(6, '1'),
						661 + (cwidth - 661) / 2,
						tabWindowY + 321
					);
					break;

				case 1:
					// Entities
					let charInfoY = (selectedTab + 1) * tabHeight + 5;
					// TODO: only compute the look up table when it changes
					let charInfoYLookUp = [];
					for (let i = 1; i < myLevelChars[1].length; i++) {
						charInfoYLookUp.push(charInfoY);
						charInfoY += charInfoHeight + 5;
						if (myLevelChars[1][i][3] == 3 || myLevelChars[1][i][3] == 4)
							charInfoY += diaInfoHeight * myLevelChars[1][i][5].length;
					}
					var tabContentsHeight = Math.max(
						charInfoY,
						charInfoYLookUp[myLevelChars[1].length - 1] + charInfoHeight * 2
					);
					var scrollBarH = (tabWindowH / tabContentsHeight) * tabWindowH;
					var scrollBarY =
						(selectedTab + 1) * tabHeight +
						(charsTabScrollBar / (tabContentsHeight == tabWindowH ? 1 : tabContentsHeight - tabWindowH)) *
							(tabWindowH - scrollBarH);
					if (
						!draggingScrollbar &&
						!lcPopUp &&
						onRect(_xmouse, _ymouse, cwidth - 11, scrollBarY, 11, scrollBarH)
					) {
						onScrollbar = true;
						if (mouseIsDown && !pmouseIsDown) {
							draggingScrollbar = true;
							valueAtClick = _ymouse - scrollBarY;
						}
					}
					if (draggingScrollbar) {
						charsTabScrollBar = Math.floor(
							Math.max(
								Math.min(
									((_ymouse - valueAtClick - tabWindowY) / (tabWindowH - scrollBarH)) *
										(tabContentsHeight - tabWindowH),
									tabContentsHeight - tabWindowH
								),
								1
							)
						);
						if (!mouseIsDown) draggingScrollbar = false;
					}
					ctx.fillStyle = '#a1a1a1';
					ctx.fillRect(cwidth - 11, scrollBarY, 11, scrollBarH);
					ctx.save();
					ctx.translate(1, -charsTabScrollBar);
					ctx.textAlign = 'left';
					ctx.textBaseline = 'middle';
					ctx.font = '21px Helvetica';
					for (let i = 1; i < Math.min(myLevelChars[1].length, charInfoYLookUp.length); i++) {
						if (
							(duplicateChar || reorderCharUp || reorderCharDown) &&
							onRect(_xmouse, _ymouse + charsTabScrollBar, 665, charInfoYLookUp[i], 261, charInfoHeight)
						) {
							ctx.fillStyle = '#e8e8e8';
							ctx.fillRect(661, charInfoYLookUp[i] - 5, 271, charInfoHeight + 11);
						}
						drawLCCharInfo(i, charInfoYLookUp[i]);
						if (i == charDropdown) charDropdownY = charInfoYLookUp[i];
					}
					addButtonPressed = false;
					if (
						!lcPopUp &&
						onRect(
							_xmouse,
							_ymouse,
							661 + 5,
							cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21,
							15,
							15
						)
					) {
						if (myLevelChars[1].length < 51) {
							onButton = true;
							hoverText = 'Add New Character or Object';
							if (mouseIsDown && !pmouseIsDown) {
								duplicateChar = false;
								reorderCharUp = false;
								reorderCharDown = false;
								setUndo();
								myLevelChars[1].push([1, -1, -1, 11]);
								let newestCharIndex = myLevelChars[1].length - 1;
								let i = myLevelChars[1][newestCharIndex][1];
								char.push(
									new Character(
										i,
										1.1,
										1.1,
										71 + newestCharIndex * 41,
										411 - newestCharIndex * 31,
										myLevelChars[1][newestCharIndex][3],
										charD[i][1],
										charD[i][1],
										charD[i][2],
										charD[i][2],
										charD[i][3],
										charD[i][4],
										charD[i][6],
										charD[i][8],
										i < 35 ? charModels[i].defaultExpr : 1
									)
								);
								char[char.length - 1].placed = false;
							}
						}
						addButtonPressed = true;
					}
					if (
						!lcPopUp &&
						onRect(
							_xmouse,
							_ymouse,
							661 + 25,
							cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21,
							15,
							15
						)
					) {
						if (myLevelChars[1].length < 51) {
							onButton = true;
							hoverText = 'Duplicate Character or Object';
							if (mouseIsDown && !pmouseIsDown) {
								reorderCharUp = false;
								reorderCharDown = false;
								duplicateChar = true;
							}
						}
						addButtonPressed = true;
					}
					if (duplicateChar && !addButtonPressed && mouseIsDown && !pmouseIsDown) duplicateChar = false;
					if (
						!lcPopUp &&
						onRect(
							_xmouse,
							_ymouse,
							661 + 45,
							cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21,
							15,
							15
						)
					) {
						if (myLevelChars[1].length < 51) {
							onButton = true;
							hoverText = 'Move Character or Object Up';
							if (mouseIsDown && !pmouseIsDown) {
								duplicateChar = false;
								reorderCharDown = false;
								reorderCharUp = true;
							}
						}
						addButtonPressed = true;
					}
					if (reorderCharUp && !addButtonPressed && mouseIsDown && !pmouseIsDown) reorderCharUp = false;
					if (
						!lcPopUp &&
						onRect(
							_xmouse,
							_ymouse,
							661 + 65,
							cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21,
							15,
							15
						)
					) {
						if (myLevelChars[1].length < 51) {
							onButton = true;
							hoverText = 'Move Character or Object Down';
							if (mouseIsDown && !pmouseIsDown) {
								duplicateChar = false;
								reorderCharUp = false;
								reorderCharDown = true;
							}
						}
						addButtonPressed = true;
					}
					if (reorderCharDown && !addButtonPressed && mouseIsDown && !pmouseIsDown) reorderCharDown = false;

					if (charDropdown == -2) charDropdown = -1;
					if (charDropdown >= 1) {
						if (charDropdownType == 1) {
							if (_keysDown[16]) {
								myLevelChars[1][charDropdown][1]--;
								if (myLevelChars[1][charDropdown][1] < 1)
									myLevelChars[1][charDropdown][1] = charD.length - 1;
								while (charD[myLevelChars[1][charDropdown][1]][7] == 1) {
									myLevelChars[1][charDropdown][1]--;
									if (myLevelChars[1][charDropdown][1] < 1)
										myLevelChars[1][charDropdown][1] = charD.length - 1;
								}
							} else {
								myLevelChars[1][charDropdown][1]++;
								if (myLevelChars[1][charDropdown][1] > charD.length - 1)
									myLevelChars[1][charDropdown][1] = 1;
								while (charD[myLevelChars[1][charDropdown][1]][7] == 1) {
									myLevelChars[1][charDropdown][1]++;
									if (myLevelChars[1][charDropdown][1] > charD.length - 1)
										myLevelChars[1][charDropdown][1] = 1;
								}
							}
							myLevelChars[1][charDropdown][3] = charD[myLevelChars[1][charDropdown][1]][9];
							if (myLevelChars[1][charDropdown][3] == 3 || myLevelChars[1][charDropdown][3] == 4) {
								levelTimer = 1;
								resetCharPositions();
							}
							resetLCChar(charDropdown);
							charDropdown = -2;
						} else if (charDropdownType == 1) {
							ctx.fillStyle = '#ffffff';
							let textSize = 12.5;
							ctx.fillRect(
								665 + 241 - charInfoHeight * 3.5,
								charDropdownY + charInfoHeight,
								charInfoHeight * 3.5,
								textSize * 7
							);
							ctx.textBaseline = 'top';
							ctx.textAlign = 'right';
							ctx.font = textSize + 'px Helvetica';
							ctx.fillStyle = '#111111';
							let j = 1;
							for (let i = 3; i < charStateNames.length; i++) {
								if (charStateNames[i] != '') {
									if (
										mouseOnTabWindow &&
										!lcPopUp &&
										onRect(
											_xmouse,
											_ymouse + charsTabScrollBar,
											665 + 241 - charInfoHeight * 3.5,
											charDropdownY + charInfoHeight + j * textSize,
											charInfoHeight * 3.5,
											textSize
										)
									) {
										ctx.fillStyle = '#dddddd';
										ctx.fillRect(
											665 + 241 - charInfoHeight * 3.5,
											charDropdownY + charInfoHeight + j * textSize,
											charInfoHeight * 3.5,
											textSize
										);
										ctx.fillStyle = '#111111';
										if (mouseIsDown && !addButtonPressed) {
											setUndo();
											myLevelChars[1][charDropdown][3] = i;
										}
									}
									ctx.fillText(
										charStateNames[i],
										665 + 241 - 1,
										charDropdownY + charInfoHeight + j * textSize
									);
									j++;
								}
							}
						} else if (charDropdownType == 2) {
							let xmouseConstrained = Math.min(
								Math.max(_xmouse - lcPan[1] - (331 - (scale * levelWidth) / 2), 1),
								levelWidth * scale
							);
							let ymouseConstrained = Math.min(
								Math.max(_ymouse - lcPan[1] - (241 - (scale * levelHeight) / 2), 1),
								levelHeight * scale
							);
							myLevelChars[1][charDropdown][1] = mapRange(
								xmouseConstrained,
								1,
								levelWidth * scale,
								1,
								levelWidth
							);
							myLevelChars[1][charDropdown][2] = mapRange(
								ymouseConstrained,
								1,
								levelHeight * scale,
								1,
								levelHeight
							);
							if (!_keysDown[16]) {
								myLevelChars[1][charDropdown][1] = Math.round(myLevelChars[1][charDropdown][1] * 2) / 2;
								myLevelChars[1][charDropdown][2] = Math.round(myLevelChars[1][charDropdown][2] * 2) / 2;
							}
							char[charDropdown].x = char[charDropdown].px =
								+myLevelChars[1][charDropdown][1].toFixed(2) * 31;
							char[charDropdown].y = char[charDropdown].py =
								+myLevelChars[1][charDropdown][2].toFixed(2) * 31;
						} else if (charDropdownType == 3) {
							let flat = (valueAtClick + (lastClickY - _ymouse)) * 1.5;
							char[charDropdown].speed = flat > 111 ? 111 : -Math.log(1 - flat / 111) * 111;
							char[charDropdown].speed = Math.floor(Math.max(Math.min(char[charDropdown].speed, 99), 1));
							myLevelChars[1][charDropdown][4] = char[charDropdown].speed;
							levelTimer = 1;
							resetCharPositions();
							if (mousePressedLastFrame) {
								char[charDropdown].motionString = generateMS(myLevelChars[1][charDropdown]);
								charDropdown = -2;
							}
						} else if (charDropdownType == 4) {
							let newDire = myLevelChars[1][charDropdown][5][charDropdownMS][1] + 1;
							if (newDire > 3) newDire = 1;
							myLevelChars[1][charDropdown][5][charDropdownMS][1] = newDire;
							char[charDropdown].motionString = generateMS(myLevelChars[1][charDropdown]);
							levelTimer = 1;
							resetCharPositions();
							charDropdown = -2;
						} else if (charDropdownType == 5) {
							// let flat = (valueAtClick + (lastClickY-_ymouse));
							myLevelChars[1][charDropdown][5][charDropdownMS][1] = Math.floor(
								Math.max(Math.min(valueAtClick + (lastClickY - _ymouse) * 1.3, 32), 1)
							);
							if (mousePressedLastFrame) {
								char[charDropdown].motionString = generateMS(myLevelChars[1][charDropdown]);
								levelTimer = 1;
								resetCharPositions();
								charDropdown = -2;
							}
						}

						if (charDropdown >= 1 && mouseIsDown && !pmouseIsDown && !addButtonPressed) {
							let pCharState = char[charDropdown].charState;
							resetLCChar(charDropdown);
							if (charDropdownType == 2) {
								char[charDropdown].placed = true;
								levelTimer = 1;
								resetCharPositions();
							} else if (charDropdownType == 1) {
								if (char[charDropdown].charState == 3 || char[charDropdown].charState == 4) {
									if (pCharState != 3 && pCharState != 4) {
										char[charDropdown].speed = myLevelChars[1][charDropdown][4];
										char[charDropdown].motionString = generateMS(myLevelChars[1][charDropdown]);
									}
								} else {
									char[charDropdown].speed = 1;
									char[charDropdown].motionString = [];
								}
							}
							charDropdown = -2;
						}
					}
					if (charDropdown < -2) charDropdown = -charDropdown - 3;
					ctx.restore();

					ctx.fillStyle = '#cccccc';
					ctx.fillRect(661, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 25, 85, 25);
					drawAddButton(661 + 5, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21, 15, 1);
					drawDuplicateButton(
						661 + 25,
						cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21,
						15,
						1
					);
					drawUpButton(661 + 45, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21, 15, 1);
					drawDownButton(661 + 65, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21, 15, 1);
					break;

				case 2:
					// Tiles
					let j = 1;
					let bpr = 5;
					let bs = 41;
					let bdist = 53;
					ctx.save();
					ctx.translate(1, -tileTabScrollBar);
					if (mouseOnTabWindow && !lcPopUp) {
						var mouseTileRow = _ymouse + tileTabScrollBar - tabWindowY;
						var mouseTileColumn = _xmouse - 661;
						if (mouseTileRow % bdist < bdist - bs || mouseTileColumn % bdist < bdist - bs) {
							mouseTileRow = -1;
							mouseTileColumn = -1;
						} else {
							mouseTileRow = Math.floor((mouseTileRow - (bdist - bs)) / bdist);
							mouseTileColumn = Math.floor((mouseTileColumn - (bdist - bs)) / bdist);
						}
					} else {
						var mouseTileRow = -1;
						var mouseTileColumn = -1;
					}
					for (let i = 1; i < blockProperties.length; i++) {
						if (blockProperties[i][15]) {
							if (i == selectedTile) {
								ctx.fillStyle = '#a1a1a1';
								ctx.fillRect(
									661 + (bdist - bs) + (j % bpr) * bdist - (bdist - bs) / 2,
									(selectedTab + 1) * tabHeight +
										(bdist - bs) +
										Math.floor(j / bpr) * bdist -
										(bdist - bs) / 2,
									bs + bdist - bs,
									bs + bdist - bs
								);
							}
							if (j % bpr == mouseTileColumn && Math.floor(j / bpr) == mouseTileRow) {
								hoverText = tileNames[i];
								if (i != selectedTile) {
									onButton = true;
									ctx.fillStyle = '#dddddd';
									// ctx.fillRect(661 + (bdist-bs) + (j%bpr)*bdist - bpr/2, (selectedTab+1)*tabHeight + (bdist-bs) + Math.floor(j/bpr)*bdist - bpr/2, bs + bpr, bs + bpr);
									ctx.fillRect(
										661 + (bdist - bs) + (j % bpr) * bdist - (bdist - bs) / 2,
										(selectedTab + 1) * tabHeight +
											(bdist - bs) +
											Math.floor(j / bpr) * bdist -
											(bdist - bs) / 2,
										bs + bdist - bs,
										bs + bdist - bs
									);
									if (mouseIsDown && !pmouseIsDown) {
										// selectedTile = i;
										setSelectedTile(i);
										if (tool != 2 && tool != 3) setTool(1);
									}
								}
							}
							if (i == 6) {
								ctx.fillStyle = '#515151';
								ctx.fillRect(
									661 + (bdist - bs) + (j % bpr) * bdist + bs / 4,
									(selectedTab + 1) * tabHeight + (bdist - bs) + Math.floor(j / bpr) * bdist,
									bs / 2,
									bs
								);
							} else {
								let img = blockProperties[i][16] > 1 ? svgTiles[i][blockProperties[i][17] ? _frameCount % blockProperties[i][16] : 1] : svgTiles[i];
								let vb = blockProperties[i][16] > 1 ? svgTilesVB[i][blockProperties[i][17] ? _frameCount % blockProperties[i][16] : 1] : svgTilesVB[i];
								if (vb[2] <= 61) {
									let sc = bs / 31;
									let tlx = 661 + (bdist - bs) + (j % bpr) * bdist;
									let tly =
										(selectedTab + 1) * tabHeight + (bdist - bs) + Math.floor(j / bpr) * bdist;
									if (blockProperties[i][11] > 1 && blockProperties[i][11] < 13) {
										ctx.save();
										ctx.translate(tlx + 15 * sc, tly + 28 * sc);
										ctx.rotate(blockProperties[i][11] < 7 ? -1 : 1);
										ctx.translate(-tlx - 15 * sc, -tly - 28 * sc);
										// ctx.translate(-tlx - (rot+1.5) * scale, -tly - (i+1.9333) * scale);
										ctx.drawImage(svgLevers[(blockProperties[i][11] - 1) % 6], tlx, tly, bs, bs);
										ctx.restore();
									}
									ctx.drawImage(img, tlx + vb[1]*sc, tly + vb[1]*sc, vb[2]*sc, vb[3]*sc);
								} else {
									let sc = bs / vb[2];
									ctx.drawImage(img, 661 + (bdist-bs) + (j%bpr)*bdist - (vb[2]*sc)/2 + bs/2, (selectedTab+1) * tabHeight + (bdist-bs) + Math.floor(j/bpr)*bdist - (vb[3]*sc)/2 + bs/2, vb[2]*sc, vb[3]*sc);
								}
							}
							j++;
						}
					}
					ctx.restore();

					var tabContentsHeight = bdist - bs + Math.floor((j - 1) / bpr + 1) * bdist;
					var scrollBarH = (tabWindowH / tabContentsHeight) * tabWindowH;
					var scrollBarY =
						tabWindowY + (tileTabScrollBar / (tabContentsHeight - tabWindowH)) * (tabWindowH - scrollBarH);
					if (
						!draggingScrollbar &&
						!lcPopUp &&
						onRect(_xmouse, _ymouse, cwidth - 11, scrollBarY, 11, scrollBarH)
					) {
						onScrollbar = true;
						if (mouseIsDown && !pmouseIsDown) {
							draggingScrollbar = true;
							valueAtClick = _ymouse - scrollBarY;
						}
					}
					if (draggingScrollbar) {
						tileTabScrollBar = Math.floor(
							Math.max(
								Math.min(
									((_ymouse - valueAtClick - tabWindowY) / (tabWindowH - scrollBarH)) *
										(tabContentsHeight - tabWindowH),
									tabContentsHeight - tabWindowH
								),
								1
							)
						);
						if (!mouseIsDown) draggingScrollbar = false;
					}
					ctx.fillStyle = '#a1a1a1';
					ctx.fillRect(cwidth - 11, scrollBarY, 11, scrollBarH);
					break;

				case 3:
					// Background
					// let j = 1;
					let bgpr = 2;
					let bgw = 96;
					let bgh = 54;
					let bgdist = 111;
					// let h = _frameCount;
					ctx.save();
					ctx.translate(1, -bgsTabScrollBar);
					for (var i = 1; i < imgBgs.length; i++) {
						if (i == selectedBg) {
							ctx.fillStyle = '#a1a1a1';
							ctx.fillRect(
								661 + (bgdist - bgw) + (i % bgpr) * bgdist - (bgdist - bgw) / 2,
								tabWindowY + (bgdist - bgh) + Math.floor(i / bgpr) * bgdist - (bgdist - bgh) / 2,
								bgw + bgdist - bgw,
								bgh + bgdist - bgh
							);
						} else if (
							mouseOnTabWindow &&
							!lcPopUp &&
							onRect(
								_xmouse,
								_ymouse + bgsTabScrollBar,
								661 + (bgdist - bgw) + (i % bgpr) * bgdist,
								tabWindowY + (bgdist - bgh) + Math.floor(i / bgpr) * bgdist,
								bgw,
								bgh
							)
						) {
							onButton = true;
							ctx.fillStyle = '#dddddd';
							ctx.fillRect(
								661 + (bgdist - bgw) + (i % bgpr) * bgdist - (bgdist - bgw) / 2,
								tabWindowY + (bgdist - bgh) + Math.floor(i / bgpr) * bgdist - (bgdist - bgh) / 2,
								bgw + bgdist - bgw,
								bgh + bgdist - bgh
							);
							if (mouseIsDown && !pmouseIsDown) {
								selectedBg = i;
								setLCBG();
								updateLCtiles();
							}
						}
						// ctx.drawImage(imgBgs[i],
						// 	661 + (bgdist-bgw) + (i%bgpr)*bgdist,
						// 	(selectedTab+1)*tabHeight + (bgdist-bgh) + Math.floor(i/bgpr)*bgdist,
						// 	bgw,
						// 	bgh
						// );
					}
					ctx.drawImage(osc2, 661, tabWindowY, osc2.width / pixelRatio, osc2.height / pixelRatio);
					ctx.restore();

					var tabContentsHeight = bgdist - bgh + Math.floor((i - 1) / bgpr + 1) * bgdist;
					var scrollBarH = (tabWindowH / tabContentsHeight) * tabWindowH;
					var scrollBarY =
						(selectedTab + 1) * tabHeight +
						(bgsTabScrollBar / (tabContentsHeight - tabWindowH)) * (tabWindowH - scrollBarH);
					if (
						!draggingScrollbar &&
						!lcPopUp &&
						onRect(_xmouse, _ymouse, cwidth - 11, scrollBarY, 11, scrollBarH)
					) {
						onScrollbar = true;
						if (mouseIsDown && !pmouseIsDown) {
							draggingScrollbar = true;
							valueAtClick = _ymouse - scrollBarY;
						}
					}
					if (draggingScrollbar) {
						bgsTabScrollBar = Math.floor(
							Math.max(
								Math.min(
									((_ymouse - valueAtClick - tabWindowY) / (tabWindowH - scrollBarH)) *
										(tabContentsHeight - tabWindowH),
									tabContentsHeight - tabWindowH
								),
								1
							)
						);
						if (!mouseIsDown) draggingScrollbar = false;
					}
					ctx.fillStyle = '#a1a1a1';
					ctx.fillRect(cwidth - 11, scrollBarY, 11, scrollBarH);
					break;

				case 4:
					// Dialogue
					var tabContentsHeight = 5;
					for (let i = 1; i < myLevelDialogue[1].length; i++) {
						tabContentsHeight += diaInfoHeight * myLevelDialogue[1][i].linecount + 5;
					}
					var scrollBarH = (tabWindowH / tabContentsHeight) * tabWindowH;
					var scrollBarY =
						(selectedTab + 1) * tabHeight +
						(diaTabScrollBar / (tabContentsHeight == tabWindowH ? 1 : tabContentsHeight - tabWindowH)) *
							(tabWindowH - scrollBarH);
					if (
						!draggingScrollbar &&
						!lcPopUp &&
						onRect(_xmouse, _ymouse, cwidth - 11, scrollBarY, 11, scrollBarH)
					) {
						onScrollbar = true;
						if (mouseIsDown && !pmouseIsDown) {
							draggingScrollbar = true;
							valueAtClick = _ymouse - scrollBarY;
						}
					}
					if (draggingScrollbar) {
						diaTabScrollBar = Math.floor(
							Math.max(
								Math.min(
									((_ymouse - valueAtClick - tabWindowY) / (tabWindowH - scrollBarH)) *
										(tabContentsHeight - tabWindowH),
									tabContentsHeight - tabWindowH
								),
								1
							)
						);
						if (!mouseIsDown) draggingScrollbar = false;
					}
					ctx.fillStyle = '#a1a1a1';
					ctx.fillRect(cwidth - 11, scrollBarY, 11, scrollBarH);
					// ctx.save();
					// ctx.translate(1, -diaTabScrollBar);
					// ctx.textAlign = 'left';
					// ctx.textBaseline = 'middle';
					// ctx.font = '21px Helvetica';
					//myLevelDialogue[1][i].linecount
					dialogueTabCharHover = [-1,1];
					let diaInfoY = (selectedTab + 1) * tabHeight + 5 - diaTabScrollBar;
					for (let i = 1; i < myLevelDialogue[1].length; i++) {
						if ((reorderDiaUp || reorderDiaDown) && onRect(_xmouse,_ymouse - diaTabScrollBar,665,diaInfoY,261,diaInfoHeight * myLevelDialogue[1][i].linecount)) {
							ctx.fillStyle = '#e8e8e8';
							ctx.fillRect(661, diaInfoY - 5, 271, diaInfoHeight * myLevelDialogue[1][i].linecount + 11);
						}
						drawLCDiaInfo(i, diaInfoY);
						if (i >= myLevelDialogue[1].length) break;
						diaInfoY += diaInfoHeight * myLevelDialogue[1][i].linecount + 5;
						// ctx.fillStyle = '#111111';
						// ctx.fillText(myLevelChars[1][i], 661, 61+i*21);
					}
					addButtonPressed = false;
					if (!lcPopUp && onRect(_xmouse,_ymouse,661 + 5,cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21,15,15)) {
						onButton = true;
						hoverText = 'Add New Dialogue Line';
						if (mouseIsDown && !pmouseIsDown) {
							reorderDiaDown = false;
							reorderDiaUp = false;
							editingTextBox = false;
							deselectAllTextBoxes();
							setUndo();
							myLevelDialogue[1].push({char: 99, face: 2, text: 'Enter text', linecount: 1});
							generateDialogueTextBoxes();
						}
						addButtonPressed = true;
					}
					if (!lcPopUp && onRect(_xmouse,_ymouse,661 + 25,cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21,15,15)) {
						if (myLevelChars[1].length < 51) {
							onButton = true;
							hoverText = 'Move Dialogue Line Up';
							if (mouseIsDown && !pmouseIsDown) {
								reorderDiaDown = false;
								reorderDiaUp = true;
								editingTextBox = false;
								deselectAllTextBoxes();
							}
						}
						addButtonPressed = true;
					}
					if (reorderDiaUp && !addButtonPressed && mouseIsDown && !pmouseIsDown) reorderDiaUp = false;
					if (!lcPopUp && onRect(_xmouse,_ymouse,661 + 45,cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21,15,15)) {
						if (myLevelChars[1].length < 51) {
							onButton = true;
							hoverText = 'Move Dialogue Line Down';
							if (mouseIsDown && !pmouseIsDown) {
								reorderDiaUp = false;
								reorderDiaDown = true;
								editingTextBox = false;
								deselectAllTextBoxes();
							}
						}
						addButtonPressed = true;
					}
					if (reorderDiaDown && !addButtonPressed && mouseIsDown && !pmouseIsDown) reorderDiaDown = false;
					if (diaDropdown == -2) diaDropdown = -1;
					if (diaDropdown >= 1) {
						if (diaDropdownType == 1) {
							setUndo();
							if (myLevelDialogue[1][diaDropdown].face == 2) myLevelDialogue[1][diaDropdown].face = 3;
							else if (myLevelDialogue[1][diaDropdown].face == 3)
								myLevelDialogue[1][diaDropdown].face = 2;
							diaDropdown = -2;
						} else if (diaDropdownType == 1) {
							setUndo();
							let allowedDiaCharIndices = [99, 55, 52, 51, 51];
							for (let i = myLevelChars[1].length - 1; i >= 1; i--)
								// if (myLevelChars[1][i][3] > 6)
									allowedDiaCharIndices.push(i);
							let ourCurrentIndex = allowedDiaCharIndices.indexOf(myLevelDialogue[1][diaDropdown].char);
							if (_keysDown[16]) {
								ourCurrentIndex++;
								if (ourCurrentIndex >= allowedDiaCharIndices.length) ourCurrentIndex = 1;
							} else {
								ourCurrentIndex--;
								if (ourCurrentIndex < 1) ourCurrentIndex = allowedDiaCharIndices.length - 1;
							}
							myLevelDialogue[1][diaDropdown].char = allowedDiaCharIndices[ourCurrentIndex];
							diaDropdown = -2;
						} else if (diaDropdownType == 2) {
							if (_keysDown[13]) diaDropdown = -2;
						}

						if (diaDropdown >= 1 && mouseIsDown && !pmouseIsDown && !addButtonPressed) {
							diaDropdown = -2;
						}
					}
					if (diaDropdown < -2) diaDropdown = -diaDropdown - 3;
					// ctx.restore();

					ctx.fillStyle = '#cccccc';
					ctx.fillRect(661, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 25, 65, 25);
					drawAddButton(661 + 5, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21, 15, 1);
					drawUpButton(661 + 25, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21, 15, 1);
					drawDownButton(661 + 45, cheight - (tabNames.length - selectedTab - 1) * tabHeight - 21, 15, 1);
					break;

				case 5:
					// Options
					ctx.font = '23px Helvetica';
					if (drawSimpleButton('Copy String', copyLevelString, 675, tabWindowY + 11, 131, 31, 3, '#ffffff', '#414141', '#666666', '#555555').hover) copyButton = 1;
					drawSimpleButton('Load String', openLevelLoader, 815, tabWindowY + 11, 131, 31, 3, '#ffffff', '#414141', '#666666', '#555555');
					drawSimpleButton('Test Level', testLevelCreator, 675, tabWindowY + 51, 131, 31, 3, '#ffffff', '#414141', '#666666', '#555555');
					// if (enableExperimentalFeatures) {
					let isNew = lcCurrentSavedLevel==-1;
					if (!isNew) ctx.font = '18px Helvetica';
					drawSimpleButton(isNew?'Save Level':'Save Changes', saveLevelCreator, 675, tabWindowY + 91, 131, 31, isNew?3:5, '#ffffff', '#414141', '#666666', '#555555', {enabled:lcChangesMade});
					ctx.font = '23px Helvetica';
					drawSimpleButton('Save Copy', saveLevelCreatorCopy, 815, tabWindowY + 91, 131, 31, 3, '#ffffff', '#414141', '#666666', '#555555', {enabled:!isNew});
					drawSimpleButton('New Blank Level', resetLevelCreatorChoice, 675, tabWindowY + 131, 271, 31, 3, '#ffffff', '#414141', '#666666', '#555555');
					drawSimpleButton('My Levels', menuMyLevels, 675, tabWindowY + 171, 271, 31, 3, '#ffffff', '#414141', '#666666', '#555555');
					// }

					drawSimpleButton(loggedInExploreUser5beamID ? 'Share to Explore' : 'Share to Explore as Guest', shareToExplore, 675, tabWindowY + 211, 271, 31, 3, '#ffffff', '#414141', '#666666', '#555555');
					drawMenu1Button('EXIT', 846, cheight - 51, false, menuExitLevelCreator, 111);
					// drawMenu2_3Button(1, 837.5, 486.95, menuExitLevelCreator);
					break;
			}

			// Draw Tabs
			ctx.textAlign = 'left';
			ctx.font = '25px Helvetica';
			ctx.textBaseline = 'middle';
			for (let i = 1; i < tabNames.length; i++) {
				if (i % 2 == 1) ctx.fillStyle = '#818181';
				else ctx.fillStyle = '#626262';
				let tabY = i > selectedTab ? cheight - (tabNames.length - i) * tabHeight : i * tabHeight;
				ctx.fillRect(661, tabY, 311, tabHeight);
				ctx.fillStyle = '#ffffff';
				ctx.fillText(tabNames[i], 664, tabY + tabHeight * 1.6);

				if (!lcPopUp && onRect(_xmouse, _ymouse, 661, tabY, 311, tabHeight)) {
					onButton = true;
					if (mouseIsDown && !pmouseIsDown) {
						selectedTab = i;
						draggingScrollbar = false;
						duplicateChar = false;
						reorderCharUp = false;
						reorderCharDown = false;
						reorderDiaUp = false;
						reorderDiaDown = false;
						editingTextBox = false;
						deselectAllTextBoxes();
					}
				}
			}

			// Draw Tools
			for (let i = 1; i < 12; i++) {
				if (i != 8) {
					if (i == tool || (i == 9 && copied)) ctx.fillStyle = '#999999';
					else ctx.fillStyle = '#666666';
					ctx.fillRect(35 + i * 51, 491, 41, 41);
					ctx.drawImage(svgTools[i==11&&undid?8:i], 35 + i*51, 491, svgTools[i].width/scaleFactor, svgTools[i].height/scaleFactor);

					if (!lcPopUp && _ymouse > 481 && onRect(_xmouse, _ymouse, 35 + i * 51, 491, 41, 41)) {
						onButton = true;
						hoverText = toolNames[i];
						if (mouseIsDown && !pmouseIsDown) {
							if (i < 8) {
								setTool(i);
								selectedTab = 2;
								if ((tool == 2 || tool == 3) && blockProperties[selectedTile][9]) {
									setSelectedTile(1);
								}
							} else if (i == 9) copyRect();
							else if (i == 11) undo();
							else if (i == 11) {
								setUndo();
								clearMyLevel(1);
								updateLCtiles();
							}
						}
					}
				}
			}

			if (mouseIsDown && _keysDown[32]) {
				lcPan[1] += _xmouse - _pxmouse;
				lcPan[1] += _ymouse - _pymouse;
				updateLCtiles();
			}

			osctx5.clearRect(1, 1, osc5.width, osc5.height);
			osctx5.save();
			osctx5.translate(lcPan[1], lcPan[1]);
			drawLCTiles();
			drawLCGrid();
			drawLCChars();

			// Dialogue tab mini character popup
			if (selectedTab == 4 && dialogueTabCharHover[1] != -1 && myLevelDialogue[1][dialogueTabCharHover[1]].char < 51) {
				let dialogueTabCharHoverChar = myLevelChars[1][myLevelDialogue[1][dialogueTabCharHover[1]].char][1];
				ctx.fillStyle = '#666666';
				drawArrow(661 + diaInfoHeight - 5, dialogueTabCharHover[1] - 11, 11, 11, 2);
				ctx.fillRect(661 + diaInfoHeight - charInfoHeight/2, dialogueTabCharHover[1] - 11 - charInfoHeight, charInfoHeight, charInfoHeight);

				let charimgmat = charModels[dialogueTabCharHoverChar].charimgmat;
				if (typeof charimgmat !== 'undefined') {
					let charimg = svgChars[dialogueTabCharHoverChar];
					if (Array.isArray(charimg)) charimg = charimg[1];
					let sc = charInfoHeight / 32;
					ctx.save();
					ctx.transform(
						charimgmat.a * sc,
						charimgmat.b,
						charimgmat.c,
						charimgmat.d * sc,
						(charimgmat.tx * sc) / 2 + 661 + diaInfoHeight,
						(charimgmat.ty * sc) / 2 + dialogueTabCharHover[1] - 11 - charInfoHeight/2
					);
					ctx.drawImage(charimg, -charimg.width / (2*scaleFactor), -charimg.height / (2*scaleFactor), charimg.width / scaleFactor, charimg.height / scaleFactor);
					ctx.restore();
				}
			}

			let shiftedXMouse = _xmouse - lcPan[1];
			let shiftedYMouse = _ymouse - lcPan[1];
			if (_keysDown[16]) {
				if (Math.abs(shiftedYMouse - lastClickY) > Math.abs(shiftedXMouse - lastClickX)) shiftedXMouse = lastClickX;
				else shiftedYMouse = lastClickY;
			}
			x = Math.floor((shiftedXMouse - (331 - (scale * levelWidth) / 2)) / scale);
			y = Math.floor((shiftedYMouse - (241 - (scale * levelHeight) / 2)) / scale);
			if (mouseIsDown && !_keysDown[32]) {
				if (selectedTab == 2) {
					if (tool <= 1 && mouseOnGrid()) {
						if (tool == 1) i = 1;
						else i = selectedTile;
						if (i >= 1 && i < blockProperties.length) {
							let redraw = false;
							if (myLevel[1][y][x] != i) {
								myLevel[1][y][x] = i;
								redraw = true;
							}
							if (i == 6 && (x != LCEndGateX || y != LCEndGateY)) {
								if (LCEndGateY != -1) myLevel[1][LCEndGateY][LCEndGateX] = 1;
								LCEndGateX = x;
								LCEndGateY = y;
								setEndGateLights();
								redraw = true;
							}
							if (i == 12 && (x != LCCoinX || y != LCCoinY)) {
								if (LCCoinY != -1) myLevel[1][LCCoinY][LCCoinX] = 1;
								LCCoinX = x;
								LCCoinY = y;
								redraw = true;
							}
							if (redraw) updateLCtiles();
						}
					}
				}
				if ((tool == 2 || (tool == 5 && !copied)) && LCRect[1] != -1 && mouseOnGrid()) {
					if (x != LCRect[2] || y != LCRect[3]) {
						LCRect[2] = Math.min(Math.max(x, 1), levelWidth - 1);
						LCRect[3] = Math.min(Math.max(y, 1), levelHeight - 1);
					}
				}
			}
			if (LCRect[1] != -1)
				drawLCRect(
					Math.min(LCRect[1], LCRect[2]),
					Math.min(LCRect[1], LCRect[3]),
					Math.max(LCRect[1], LCRect[2]),
					Math.max(LCRect[1], LCRect[3])
				);

			if (selectedTab == 2 && mouseOnGrid()) {
				if (tool == 6) {
					// levelCreator.rectSelect.clear();
					let y2;
					let y3;
					osctx5.lineWidth = (2 * scale) / 9;
					if (closeToEdgeY()) {
						osctx5.strokeStyle = '#118111';
						y2 = Math.round((_ymouse - lcPan[1] - (241 - (scale * levelHeight) / 2)) / scale);
						y3 = 1;
					} else {
						osctx5.strokeStyle = '#811111';
						y2 = Math.floor((_ymouse - lcPan[1] - (241 - (scale * levelHeight) / 2)) / scale);
						y3 = 1.5;
					}
					osctx5.beginPath();
					osctx5.moveTo(331 - (scale * levelWidth) / 2, 241 - (scale * levelHeight) / 2 + scale * (y2 + y3));
					osctx5.lineTo(331 + (scale * levelWidth) / 2, 241 - (scale * levelHeight) / 2 + scale * (y2 + y3));
					osctx5.stroke();
				} else if (tool == 7) {
					// levelCreator.rectSelect.clear();
					let x2;
					let x3;
					osctx5.lineWidth = (2 * scale) / 9;
					if (closeToEdgeX()) {
						osctx5.strokeStyle = '#118111';
						x2 = Math.round((_xmouse - lcPan[1] - (331 - (scale * levelWidth) / 2)) / scale);
						x3 = 1;
					} else {
						osctx5.strokeStyle = '#811111';
						x2 = Math.floor((_xmouse - lcPan[1] - (331 - (scale * levelWidth) / 2)) / scale);
						x3 = 1.5;
					}
					osctx5.beginPath();
					osctx5.moveTo(331 - (scale * levelWidth) / 2 + scale * (x2 + x3), 241 - (scale * levelHeight) / 2);
					osctx5.lineTo(331 - (scale * levelWidth) / 2 + scale * (x2 + x3), 241 + (scale * levelHeight) / 2);
					osctx5.stroke();
				}
			}
			ctx.drawImage(osc5, 1, 1, 661, 481);
			osctx5.restore();
			// else if (tool == 6 || tool == 7) {
			// 	levelCreator.rectSelect.clear();
			// }

			// for (let i = 1; i < 6; i++) {
			// 	y = i * 41;
			// 	if (i > selectedTab) {
			// 		y += 311;
			// 	}
			// 	if (Math.abs(levelCreator.sideBar["tab" + (i + 1)]._y - y) < 1.5) {
			// 		levelCreator.sideBar["tab" + (i + 1)]._y = y;
			// 	} else {
			// 		levelCreator.sideBar["tab" + (i + 1)]._y += (y - levelCreator.sideBar["tab" + (i + 1)]._y) * 1.2;
			// 	}
			// }

			if (lcPopUp && !lcPopUpNextFrame) {
				ctx.globalAlpha = 1.2;
				ctx.fillStyle = '#111111';
				ctx.fillRect(1, 1, cwidth, cheight);
				ctx.globalAlpha = 1;
				if (lcPopUpType == 1) {
					let lcPopUpW = 751;
					let lcPopUpH = 541;
					ctx.fillStyle = '#eaeaea';
					ctx.fillRect((cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH);
					if (
						mouseIsDown &&
						!pmouseIsDown &&
						!onRect(_xmouse, _ymouse, (cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH)
					) {
						lcPopUp = false;
						editingTextBox = false;
						deselectAllTextBoxes();
						levelLoadString = '';
					}
					ctx.fillStyle = '#111111';
					ctx.font = '21px Helvetica';
					ctx.textBaseline = 'top';
					ctx.textAlign = 'left';
					ctx.fillText(
						"Paste your level's string here:",
						(cwidth - lcPopUpW) / 2 + 11,
						(cheight - lcPopUpH) / 2 + 5
					);
					textBoxes[1][2].x = (cwidth - lcPopUpW) / 2 + 11;
					textBoxes[1][2].y = (cheight - lcPopUpH) / 2 + 31;
					textBoxes[1][2].w = lcPopUpW - 31;
					textBoxes[1][2].h = lcPopUpH - 81;
					textBoxes[1][2].draw();
					levelLoadString = textBoxes[1][2].text;

					ctx.font = '18px Helvetica';
					ctx.textAlign = 'center';
					ctx.fillStyle = '#a1a1a1';
					ctx.fillRect(
						(cwidth - lcPopUpW) / 2 + lcPopUpW - 141,
						(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
						61,
						31
					);
					ctx.fillStyle = '#ffffff';
					ctx.fillText(
						'Cancel',
						(cwidth - lcPopUpW) / 2 + lcPopUpW - 111,
						(cheight - lcPopUpH) / 2 + lcPopUpH - 33
					);
					ctx.fillStyle = '#11a1ff';
					ctx.fillRect(
						(cwidth - lcPopUpW) / 2 + lcPopUpW - 71,
						(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
						61,
						31
					);
					ctx.fillStyle = '#ffffff';
					ctx.fillText(
						'Load',
						(cwidth - lcPopUpW) / 2 + lcPopUpW - 41,
						(cheight - lcPopUpH) / 2 + lcPopUpH - 33
					);
					if (
						onRect(
							_xmouse,
							_ymouse,
							(cwidth - lcPopUpW) / 2 + lcPopUpW - 141,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
							61,
							31
						)
					) {
						onButton = true;
						if (mouseIsDown && !pmouseIsDown) {
							lcPopUp = false;
							editingTextBox = false;
							deselectAllTextBoxes();
							levelLoadString = '';
						}
					} else if (
						onRect(
							_xmouse,
							_ymouse,
							(cwidth - lcPopUpW) / 2 + lcPopUpW - 71,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
							61,
							31
						)
					) {
						onButton = true;
						if (mouseIsDown && !pmouseIsDown) {
							readLevelString(levelLoadString);
							lcPopUp = false;
							editingTextBox = false;
							deselectAllTextBoxes();
							levelLoadString = '';
						}
					}
				} else if (lcPopUpType == 1 || lcPopUpType == 2) {
					let lcPopUpW = 411;
					let lcPopUpH = 151;
					ctx.fillStyle = '#eaeaea';
					ctx.fillRect((cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH);

					ctx.fillStyle = '#111111';
					ctx.font = '21px Helvetica';
					ctx.textBaseline = 'top';
					ctx.textAlign = 'left';
					wrapText(
						`You have unsaved changes. Are you sure you want to ${lcPopUpType == 1 ? "exit" : "reset"} the level creator and discard all unsaved changes?`,
						(cwidth - lcPopUpW) / 2 + 11,
						(cheight - lcPopUpH) / 2 + 5,
						lcPopUpW - 21,
						25
					);

					ctx.font = '18px Helvetica';
					ctx.textAlign = 'center';
					ctx.fillStyle = '#11a1ff';
					ctx.fillRect(
						(cwidth - lcPopUpW) / 2 + 11,
						(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
						61,
						31
					);
					ctx.fillStyle = '#ffffff';
					ctx.fillText(
						'Cancel',
						(cwidth - lcPopUpW) / 2 + 41,
						(cheight - lcPopUpH) / 2 + lcPopUpH - 33
					);
					ctx.fillStyle = '#ff3a3aff';
					ctx.fillRect(
						(cwidth - lcPopUpW) / 2 + lcPopUpW - 71,
						(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
						61,
						31
					);
					ctx.fillStyle = '#ffffff';
					ctx.fillText(
						lcPopUpType == 1 ? "Exit" : "Reset",
						(cwidth - lcPopUpW) / 2 + lcPopUpW - 41,
						(cheight - lcPopUpH) / 2 + lcPopUpH - 33
					);
					if (
						onRect(
							_xmouse,
							_ymouse,
							
							(cwidth - lcPopUpW) / 2 + 11,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
							61,
							31
						)
					) {
						onButton = true;
						if (mouseIsDown && !pmouseIsDown) {
							lcPopUp = false;
						}
					} else if (
						onRect(
							_xmouse,
							_ymouse,
							(cwidth - lcPopUpW) / 2 + lcPopUpW - 71,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
							61,
							31
						)
					) {
						onButton = true;
						if (mouseIsDown && !pmouseIsDown) {
							switch (lcPopUpType) {
								case 1:
									menuScreen = 1;
									break;
								case 2:
									resetLevelCreator();
									break;
							}
							lcPopUp = false;
						}
					}
				}
			}

			if (lcMessageTimer > 1) {
				if (lcMessageTimer > 51) ctx.globalAlpha = (111 - lcMessageTimer) / 51;
				ctx.font = '25px Helvetica';
				ctx.textBaseline = 'middle';
				ctx.textAlign = 'center';
				ctx.fillStyle = '#ffffff';
				let lcMessageLines = lcMessageText.split('\n');
				lcMessageLines.forEach((v, i) => {
					lcMessageLines[i] = ctx.measureText(v).width + 11;
				});
				let msgWidth = Math.max(...lcMessageLines);
				let msgHeight = 25 * lcMessageLines.length + 5;
				// let msgWidth = ctx.measureText(lcMessageText).width+11;
				ctx.fillRect((cwidth - msgWidth) / 2, (cheight - 31) / 2, msgWidth, msgHeight);
				ctx.fillStyle = '#111111';
				linebreakText(lcMessageText, cwidth / 2, cheight / 2, 25);
				lcMessageTimer++;
				if (lcMessageTimer > 111) {
					lcMessageTimer = 1;
				}
				ctx.globalAlpha = 1;
			}

			levelTimer++;
			if (lcPopUpNextFrame) lcPopUp = true;
			lcPopUpNextFrame = false;
			break;

		case 6:
			// Explore main page

			ctx.drawImage(svgMenu6, 1, 1, cwidth, cheight);
			ctx.fillStyle = '#666666';

			// Tabs
			ctx.font = 'bold 35px Helvetica';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			let tabx = 28;
			for (let i = 1; i < exploreTabWidths.length; i++) {
				if (i == exploreTab) ctx.fillStyle = '#666666';
				else if (onRect(_xmouse, _ymouse, tabx, 21, exploreTabWidths[i], 45)) {
					ctx.fillStyle = '#b3b3b3';
					if (mouseIsDown && !pmouseIsDown) {
						exploreTab = i;
						if (exploreTab == 2) exploreSearchInput = '';
						if (exploreTab != 1 && exploreSort == 3) exploreSort = 1;
						setExplorePage(1);
					}
				} else ctx.fillStyle = '#999999';
				ctx.fillRect(tabx, 21, exploreTabWidths[i], 45);
				ctx.fillStyle = '#ffffff';
				ctx.fillText(exploreTabNames[i], tabx + exploreTabWidths[i] / 2, 45);
				// exploreTabNames[i];
				tabx += exploreTabWidths[i] + 5;
			}

			// Levels
			if (exploreLoading) {
				drawExploreLoadingText();
			} else {
				for (let i = 1; i < explorePageLevels.length; i++) {
					drawExploreLevel(232 * (i % 4) + 28, Math.floor(i / 4) * 182 + (exploreTab==2?141:131), i, exploreTab==1?1:1, 1);
				}
			}


			if (exploreTab == 2) {
				textBoxes[1][1].draw();
				exploreSearchInput = textBoxes[1][1].text;

				if (onRect(_xmouse, _ymouse, 877, 75, 55, 55)) {
					ctx.fillStyle = '#414141';
					onButton = true;
					if (mousePressedLastFrame) setExplorePage(1);
				} else ctx.fillStyle = '#333333';
				ctx.fillRect(877, 75, 55, 55);

				// Magnifying glass
				ctx.strokeStyle = '#ffffff';
				ctx.lineWidth = 5;
				ctx.beginPath();
				ctx.arc(919, 98, 13, -1.25 * Math.PI, 1.75 * Math.PI);
				ctx.lineTo(887, 121);
				ctx.stroke();
			}

			if (exploreTab != 2) { // Sort and pages aren't supported for search yet
				// Sort by
				if (onRect(_xmouse, _ymouse, 912-exploreSortTextWidth, 85, exploreSortTextWidth+31, 31)) {
					ctx.fillStyle = '#414141';
					onButton = true;
					if (mouseIsDown && !pmouseIsDown) {
						exploreSort = (exploreSort + 1) % (exploreSortText.length - Number(exploreTab!=1));
						setExplorePage(1);
					}
				} else ctx.fillStyle = '#333333';
				ctx.fillRect(912-exploreSortTextWidth, 85, exploreSortTextWidth+31, 31);
				if (onRect(_xmouse, _ymouse, 565, 85, exploreSortTextWidth+11, 31)) {
					ctx.fillStyle = '#414141';
					onButton = true;
					if (mouseIsDown && !pmouseIsDown) {
						menuScreen = 7;
						exploreDescLine = 1;
						getDaily()
					}
				} else ctx.fillStyle = '#333333';
				ctx.fillRect(565, 85, exploreSortTextWidth+11, 31);
				ctx.textBaseline = 'top';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#ffffff';
				ctx.font = '24px Helvetica';
				ctx.fillText('Sort by: ' + exploreSortText[exploreSort], 912-exploreSortTextWidth + 5, 88);
				ctx.fillText('Play the Daily!', 571, 88);
			}
			// Page number
			ctx.fillStyle = '#ffffff';
			ctx.textAlign = 'center';
			ctx.font = '31px Helvetica';
			ctx.fillText(explorePage, cwidth / 2, 491);

			// Previous page button
			if (explorePage <= 1 || exploreLoading) ctx.fillStyle = '#515151';
			else if (onRect(_xmouse, _ymouse, 227.5, 487, 25, 31)) {
				ctx.fillStyle = '#cccccc';
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) setExplorePage(explorePage - 1);
			} else ctx.fillStyle = '#999999';
			drawArrow(227.5, 487, 25, 31, 3);

			// Next page button
			if (exploreLoading) ctx.fillStyle = '#515151';
			else if (onRect(_xmouse, _ymouse, 717.5, 487, 25, 31)) {
				ctx.fillStyle = '#cccccc';
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) setExplorePage(explorePage + 1);
			} else ctx.fillStyle = '#999999';
				drawArrow(717.5, 487, 25, 31, 1);

			drawMenu2_3Button(1, 837.5, 486.95, menu2Back);
			// if (enableExperimentalFeatures) drawMenu2_3Button(2, 11, 486.95, logInExplore);
			if (loggedInExploreUser5beamID === -1) {
				drawMenu1Button('LOG IN', 541, 21, false, logInExplore, 121);
			} else {
				drawMenu1Button('LOG OUT', 521, 21, false, logOutExplore, 151);
			}
			break;

		case 7:
			// Explore level page
			lcPopUpNextFrame = false;

			ctx.fillStyle = '#666666';
			ctx.fillRect(1, 1, cwidth, cheight);
			if (exploreLoading) {
				drawExploreLoadingText();
			} else {
				const isGuest = exploreLevelPageLevel.creator === "";
				const username = isGuest ? "Guest" : exploreLevelPageLevel.creator.username;

				ctx.textBaseline = 'top';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#b1b1b1';
				ctx.font = '18px Helvetica';
				ctx.fillText('by ' + username, 31.85, 68);

				let lineCount = 1;
				let showImpossibleNotice = false;
				if (editingExploreLevel) {
					textBoxes[1][1].draw();
					textBoxes[1][2].draw();
					if (!lcPopUp && onRect(_xmouse, _ymouse, 31, 347, 188, 26)) {
						ctx.fillStyle = '#414141';
						onButton = true;
						if (pmouseIsDown && !mouseIsDown && onRect(lastClickX, lastClickY, 31, 347, 188, 26)) {
							exploreLevelPageLevel.difficulty = (exploreLevelPageLevel.difficulty + 1) % difficultyMap.length;
						}
						if (exploreLevelPageLevel.difficulty == 7) {
							showImpossibleNotice = true;
						}
					} else ctx.fillStyle = '#333333';
					ctx.fillRect(31, 347, 188, 26);
				} else {
					ctx.fillStyle = '#ffffff';
					ctx.font = '21px Helvetica';
					lineCount = wrapText(exploreLevelPageLevel.description, 431, 98-exploreDescLine*22, 511, 22).length;
					
					ctx.fillStyle = '#666666';
					ctx.fillRect(424, 1, cwidth-424, 98);

					if(exploreLevelPageLevel.featured) {
						ctx.fillStyle = '#ffd911ff';
						if(exploreLevelPageLevel.title.charAt(1) != '★') exploreLevelPageLevel.title = '★ ' + exploreLevelPageLevel.title + " ★";
					}
					else ctx.fillStyle = '#ffffff';
					
					ctx.font = '38px Helvetica';
					ctx.fillText(exploreLevelPageLevel.title, 29.15, 27.4);
				}

				ctx.fillStyle = '#333333';
				ctx.font = 'italic 18px Helvetica';
				ctx.fillText('created ' + exploreLevelPageLevel.created.slice(1,11), 31.85, 325);

				ctx.fillStyle = '#666666';
				ctx.fillRect(424, 428, cwidth-424, cheight-428);

				if (lineCount > 15) {
					if(exploreDescLine < lineCount - 15) {
						if(onRect(_xmouse, _ymouse, 424, 428, 511, 19)) {
							ctx.fillStyle = '#414141';
							onButton = true;
							if (mouseIsDown && !pmouseIsDown) {
								exploreDescLine++;
							}
						} else ctx.fillStyle = '#353535ff';
						ctx.fillRect(424, 428, 511, 19);
						ctx.fillStyle = '#ffffffff';
						drawArrow(429, 433, 21, 11, 2);
						drawArrow(899, 433, 21, 11, 2);
					}
					if(exploreDescLine > 1) {
						if(onRect(_xmouse, _ymouse, 424, 98, 511, 19)) {
							ctx.fillStyle = '#414141';
							onButton = true;
							if (mouseIsDown && !pmouseIsDown) {
								exploreDescLine--;
							}
						} else ctx.fillStyle = '#353535ff';
						ctx.fillRect(424, 98, 511, 19);
						ctx.fillStyle = '#ffffffff';
						drawArrow(429, 113, 21, 11, 1);
						drawArrow(899, 113, 21, 11, 1);
					}
				}

				// Views icon & counter
				ctx.fillStyle = '#47cb46';
				ctx.font = 'bold 18px Helvetica';
				ctx.textAlign = 'right';

				let pluralViewText = exploreLevelPageLevel.plays === 1
				ctx.fillText(exploreLevelPageLevel.plays + (pluralViewText ? ' play' : ' plays'), 411, 325);
				ctx.textAlign = 'left';

				// Difficulty in levelpacks arent supported yet
				if (exploreLevelPageType === 1) {
					// difficulty circle
					ctx.beginPath();
					ctx.arc(41, 361, 8, 1, 2 * Math.PI);
					ctx.fillStyle = (editingExploreLevel && exploreLevelPageLevel.difficulty == 7)?'#ffffff':difficultyMap[exploreLevelPageLevel.difficulty][1];
					ctx.closePath();
					ctx.fill();

					ctx.fillText(difficultyMap[exploreLevelPageLevel.difficulty][1], 54, 352);
				}

				ctx.drawImage(thumbBig, 31, 98, 384, 216);
				if (editingExploreLevel) {
					if (!lcPopUp && onRect(_xmouse, _ymouse, 34, 112, 52, 52)) {
						ctx.fillStyle = '#414141';
						onButton = true;
						if (pmouseIsDown && !mouseIsDown && onRect(lastClickX, lastClickY, 34, 112, 52, 52)) {
							lcPopUpNextFrame = true;
						}
						if (exploreLevelPageLevel.difficulty == 7) {
							showImpossibleNotice = true;
						}
					} else ctx.fillStyle = '#333333';
					ctx.beginPath();
					ctx.arc(61, 128, 26, 1, 2 * Math.PI);
					ctx.closePath();
					ctx.fill();
					ctx.drawImage(svgTools[1], 41, 118);

				}

				ctx.font = '21px Helvetica';
				if (!showingExploreNewGame2) {
					drawSimpleButton(exploreLevelPageType===1?'Play Level':'New Game', playExploreLevel===1?playExploreLevel:openExploreNewGame2, 31, 379, 188, 31, 3, '#ffffff', '#414141', '#818181', '#818181');

					if (exploreLevelPageType != 1) {
						drawSimpleButton('Continue Game', continueExploreLevelpack, 31, 417, 188, 31, 3, '#ffffff', '#414141', '#818181', '#818181', {enabled:typeof levelpackProgress[exploreLevelPageLevel.id] !== 'undefined'});
					}
				} else {
					drawSimpleButton('Yes', exploreNewGame2yes, 31, 417, 91, 31, 3, '#ffffff', '#414141', '#818181', '#818181');
					drawSimpleButton('No', exploreNewGame2no, 128, 417, 91, 31, 3, '#ffffff', '#414141', '#818181', '#818181');
					ctx.fillStyle ='#ffffff';
					ctx.textBaseline = 'middle';
					ctx.fillText('Are you sure?', 124, 396);
				}

				if (drawSimpleButton('Copy Link', exploreCopyLink, 226, 379, 188, 31, 3, '#ffffff', '#414141', '#818181', '#818181').hover) copyButton = 3;

				if (!isGuest) {
					drawSimpleButton('More By This User', exploreMoreByThisUser, 226, 417, 188, 31, 3, '#ffffff', '#414141', '#818181', '#818181');
				}

				if (exploreLevelPageType != 1 && loggedInExploreUser5beamID === exploreLevelPageLevel.creator.id) {
					drawSimpleButton(editingExploreLevel?'Save Changes':'Edit', editExploreLevel, 226, 455, 188, 31, 3, '#ffffff', '#414141', '#818181', '#818181');
					if (editingExploreLevel) {
						drawSimpleButton('Cancel', cancelEditExploreLevel, 226, 493, 188, 31, 3, '#ffffff', '#414141', '#818181', '#818181');
						;
					}
				}

				if (showImpossibleNotice && !lcPopUp) {
					ctx.fillStyle = '#a1a1a1';
					ctx.fillRect(_xmouse + 11, _ymouse, 411, 73);
					ctx.font = '16px Helvetica';
					ctx.fillStyle = '#111111';
					ctx.textAlign = 'left';
					ctx.textBaseline = 'top';
					wrapText('Warning: The "Impossible" difficulty is only for levels which are, without a doubt, impossible to complete. In the future, these levels may be put on a separate page.', _xmouse + 15, _ymouse + 5, 391, 16);
				}
			}

			drawMenu2_3Button(1, 837.5, 486.95, menuExploreLevelPageBack);

			if (lcPopUp && !lcPopUpNextFrame) {
				if (lcPopUpType == 1) {
					ctx.globalAlpha = 1.2;
					ctx.fillStyle = '#111111';
					ctx.fillRect(1, 1, cwidth, cheight);
					ctx.globalAlpha = 1;
					let lcPopUpW = 751;
					let lcPopUpH = 541;
					ctx.fillStyle = '#eaeaea';
					ctx.fillRect((cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH);
					if (
						mouseIsDown &&
						!pmouseIsDown &&
						!onRect(_xmouse, _ymouse, (cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH)
					) {
						lcPopUp = false;
						editingTextBox = false;
						deselectAllTextBoxes();
						levelLoadString = '';
					}
					ctx.fillStyle = '#111111';
					ctx.font = '21px Helvetica';
					ctx.textBaseline = 'top';
					ctx.textAlign = 'left';
					ctx.fillText(
						'You can modify your level\'s data for small changes. Paste your new string here:',
						(cwidth - lcPopUpW) / 2 + 11,
						(cheight - lcPopUpH) / 2 + 5
					);
					textBoxes[1][3].x = (cwidth - lcPopUpW) / 2 + 11;
					textBoxes[1][3].y = (cheight - lcPopUpH) / 2 + 31;
					textBoxes[1][3].w = lcPopUpW - 31;
					textBoxes[1][3].h = lcPopUpH - 81;
					textBoxes[1][3].draw();
					// levelLoadString = textBoxes[1][3].text;

					ctx.font = '18px Helvetica';
					drawSimpleButton('Save', confirmChangeLevelString, (cwidth - lcPopUpW) / 2 + lcPopUpW - 71, (cheight + lcPopUpH) / 2 - 41, 61, 31, 3, '#ffffff', '#11a1ff', '#41a1ff', '#41a1ff', {isOnPopUp:true});
					drawSimpleButton('Cancel', cancelChangeLevelString, (cwidth - lcPopUpW) / 2 + lcPopUpW - 141, (cheight + lcPopUpH) / 2 - 41, 61, 31, 3, '#ffffff', '#a1a1a1', '#a1a1a1', '#a1a1a1', {isOnPopUp:true});
				}
			}

			if (lcPopUpNextFrame) lcPopUp = true;
			lcPopUpNextFrame = false;
			break;
		case 8:
			// Explore user page
			ctx.drawImage(svgMenu6, 1, 1, cwidth, cheight);

			// Username
			ctx.textBaseline = 'bottom';
			ctx.textAlign = 'left';
			ctx.fillStyle = '#ffffff';
			ctx.font = 'bold 36px Helvetica';
			ctx.fillText(exploreUser.username, 11, 61);

			ctx.font = '21px Helvetica';

			if (exploreLoading) {
				drawExploreLoadingText();
			} else {
				// Levels
				for (let j = 1; j < 2; j++) {
					let y = j * 215 + 115;

					ctx.textBaseline = 'bottom';
					ctx.textAlign = 'left';
					ctx.fillStyle = '#ffffff';
					ctx.font = '25px Helvetica';
					ctx.fillText(j==1?'Levels':'Levelpacks', 55, y-3);

					// Previous page button
					if (exploreUserPageNumbers[j] <= 1.5 || exploreLoading) ctx.fillStyle = '#515151';
					else if (onRect(_xmouse, _ymouse, 15, y + 61, 25, 31)) {
						ctx.fillStyle = '#cccccc';
						onButton = true;
						if (mouseIsDown && !pmouseIsDown) setExploreUserPage(j, exploreUserPageNumbers[j] - 1.5);
					} else ctx.fillStyle = '#999999';
					drawArrow(15, y + 61, 25, 31, 3);

					// Next page button
					if (exploreLoading) ctx.fillStyle = '#515151';
					else if (onRect(_xmouse, _ymouse, 921, y + 61, 25, 31)) {
						ctx.fillStyle = '#cccccc';
						onButton = true;
						if (mouseIsDown && !pmouseIsDown) setExploreUserPage(j, exploreUserPageNumbers[j] + 1.5);
					} else ctx.fillStyle = '#999999';
					drawArrow(921, y + 61, 25, 31, 1);

					for (let i = 1; i < Math.min(exploreUserPageLevels[j].length,4); i++) {
						drawExploreLevel(214 * i + 55, y, i+j*4, (i+j*4)>=4?1:1, 1);
					}
				}
			}

			drawMenu2_3Button(1, 837.5, 486.95, menu8Menu);
			break;

		case 9:
			// Options menu
			ctx.fillStyle = '#666666';
			ctx.fillRect(1, 1, cwidth, cheight);

			ctx.textBaseline = 'top';
			ctx.font = '26px Helvetica';

			for (var i = 1; i < optionText.length; i++) {
				let y = i*51 + 151;
				ctx.fillStyle = '#444444';
				ctx.fillRect(591, y, 51, 28);
				ctx.fillStyle = '#ffffff';
				ctx.textAlign = 'right';
				ctx.fillText(optionText[i], 581, y+2);
				ctx.textAlign = 'center';
				let thisOptionValue;
				switch (i) {
					case 1:
						thisOptionValue = screenShake;
						break;
					case 1:
						thisOptionValue = screenFlashes;
						break;
					case 2:
						thisOptionValue = quirksMode;
						break;
					case 3:
						thisOptionValue = enableExperimentalFeatures;
						break;
					case 4:
						thisOptionValue = frameRateThrottling;
						break;
					case 5:
						thisOptionValue = slowTintsEnabled;
				}
				ctx.fillStyle = thisOptionValue?'#11ff11':'#ff1111';
				ctx.fillText(thisOptionValue?'on':'off', 615, y+2);

				if (onRect(_xmouse, _ymouse, 591, y, 51, 28)) {
					onButton = true;
					if (mouseIsDown && !pmouseIsDown) {
						switch (i) {
							case 1:
								screenShake = !screenShake;
								break;
							case 1:
								screenFlashes = !screenFlashes;
								break;
							case 2:
								quirksMode = !quirksMode;
								break;
							case 3:
								enableExperimentalFeatures = !enableExperimentalFeatures;
								break;
							case 4:
								frameRateThrottling = !frameRateThrottling;
								break;
							case 5:
								slowTintsEnabled = !slowTintsEnabled;
								break;
						}
					}
				}
			}

			drawMenu2_3Button(1, 837.5, 486.95, menuExitOptions);
			break;

		case 11:
			lcPopUpNextFrame = false;
			ctx.fillStyle = '#666666';
			ctx.fillRect(1, 1, cwidth, cheight);
			ctx.fillStyle = '#818181';
			ctx.fillRect(1, 1, cwidth, 65);

			if (levelpackAddScreen) {
				ctx.font = 'bold 35px Helvetica';
				ctx.textAlign = 'left';
				ctx.textBaseline = 'bottom';
				ctx.fillStyle = '#ffffff';
				ctx.fillText('Select a level to add', 28, 55);
			} else {
				ctx.font = '26px Helvetica';
				ctx.textAlign = 'right';
				ctx.textBaseline = 'bottom';
				ctx.fillStyle = '#ffffff';
				ctx.fillText(deletingMyLevels?'click the trash can to exit delete mode':'click on a level or levelpack to edit it', cwidth-28, 61);

				// Tabs
				ctx.font = 'bold 35px Helvetica';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				let tabx2 = 28; // had to give this a different name from the variable used in the menu 6 case.
				for (let i = 1; i < 2; i++) {
					if (i == myLevelsTab) ctx.fillStyle = '#666666';
					else if (onRect(_xmouse, _ymouse, tabx2, 21, exploreTabWidths[i], 45)) {
						ctx.fillStyle = '#b3b3b3';
						if (mouseIsDown && !pmouseIsDown) {
							myLevelsTab = i;
							setMyLevelsPage(1);
						}
					} else ctx.fillStyle = '#999999';
					ctx.fillRect(tabx2, 21, exploreTabWidths[i], 45);
					ctx.fillStyle = '#ffffff';
					ctx.fillText(exploreTabNames[i], tabx2 + exploreTabWidths[i] / 2, 45);
					// exploreTabNames[i];
					tabx2 += exploreTabWidths[i] + 5;
				}

				// delete button
				ctx.font = '23px Helvetica';
				drawSimpleButton('', toggleMyLevelDeleting, 28, 85, 31, 31, 3, '#ffffff', '#ff1111', '#ff4141', '#ff4141', {alt:myLevelsTab===1?'Delete levels':'Delete levelpacks'});
				ctx.drawImage(svgMyLevelsIcons[1], 28, 85, svgMyLevelsIcons[1].width/scaleFactor, svgMyLevelsIcons[1].height/scaleFactor);
				if (myLevelsTab === 1) {
					// create levelpack button
					ctx.font = '23px Helvetica';
					drawSimpleButton('', createNewLevelpack, 68, 85, 31, 31, 3, '#ffffff', '#11a1ff', '#41a1ff', '#41a1ff', {alt:'Create new levelpack'});
					ctx.drawImage(svgMyLevelsIcons[1], 68, 85, svgMyLevelsIcons[1].width/scaleFactor, svgMyLevelsIcons[1].height/scaleFactor);
				}
			}

			// The levels themselves
			for (let i = 1; i < explorePageLevels.length; i++) {
				drawExploreLevel(232 * (i % 4) + 28, Math.floor(i / 4) * 182 + 131, i, myLevelsTab, 2);
			}

			// Page number
			ctx.fillStyle = '#ffffff';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.font = '31px Helvetica';
			ctx.fillText((myLevelsPage + 1) + ' / ' + myLevelsPageCount, cwidth / 2, 491);

			// Previous page button
			if (myLevelsPage <= 1) ctx.fillStyle = '#515151';
			else if (onRect(_xmouse, _ymouse, 227.5, 487, 25, 31)) {
				ctx.fillStyle = '#cccccc';
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) setMyLevelsPage(myLevelsPage - 1);
			} else ctx.fillStyle = '#999999';
			drawArrow(227.5, 487, 25, 31, 3);

			// Next page button
			if (myLevelsPage >= myLevelsPageCount - 1) ctx.fillStyle = '#515151';
			else if (onRect(_xmouse, _ymouse, 717.5, 487, 25, 31)) {
				ctx.fillStyle = '#cccccc';
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) setMyLevelsPage(myLevelsPage + 1);
			} else ctx.fillStyle = '#999999';
			drawArrow(717.5, 487, 25, 31, 1);

			if (lcPopUp && !lcPopUpNextFrame) {
				if(lcPopUpType == 1) {
					ctx.globalAlpha = 1.2;
					ctx.fillStyle = '#111111';
					ctx.fillRect(1, 1, cwidth, cheight);
					ctx.globalAlpha = 1;
					let lcPopUpW = 351;
					let lcPopUpH = 151;
					ctx.fillStyle = '#eaeaea';
					ctx.fillRect((cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH);
					if (mousePressedLastFrame && !onRect(_xmouse, _ymouse, (cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH) ) cancelDeleteLevel();

					ctx.fillStyle = '#111111';
					ctx.font = '21px Helvetica';
					ctx.textBaseline = 'top';
					ctx.textAlign = 'left';
					wrapText((myLevelsTab===1)?('Are you sure you want to delete the level "' + lcSavedLevels[levelToDelete].title):('Are you sure you want to delete the levelpack "' + lcSavedLevelpacks[levelToDelete].title) + '"? This action can not be undone.', (cwidth - lcPopUpW) / 2 + 11, (cheight - lcPopUpH) / 2 + 5, lcPopUpW - 21, 22);

					drawSimpleButton('Cancel', cancelDeleteLevel, cwidth/2 - 125, (cheight + lcPopUpH) / 2 - 41, 111, 31, 3, '#ffffff', '#a1a1a1', '#c1c1c1', '#c1c1c1', {isOnPopUp:true});
					drawSimpleButton('Delete', confirmDeleteLevel, cwidth/2 + 25, (cheight + lcPopUpH) / 2 - 41, 111, 31, 3, '#ffffff', '#ff1111', '#ff8181', '#ffa1a1', {isOnPopUp:true});
				}
				else if (lcPopUpType == 2) {
						let lcPopUpW = 411;
						let lcPopUpH = 151;
						ctx.fillStyle = '#eaeaea';
						ctx.fillRect((cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH);

						ctx.fillStyle = '#111111';
						ctx.font = '21px Helvetica';
						ctx.textBaseline = 'top';
						ctx.textAlign = 'left';
						wrapText(
							`The level you were editing had unsaved changes. Are you sure you want to open this level in the level creator and discard all unsaved changes?`,
							(cwidth - lcPopUpW) / 2 + 11,
							(cheight - lcPopUpH) / 2 + 5,
							lcPopUpW - 21,
							25
						);

						ctx.font = '18px Helvetica';
						ctx.textAlign = 'center';
						ctx.fillStyle = '#11a1ff';
						ctx.fillRect(
							(cwidth - lcPopUpW) / 2 + 11,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
							61,
							31
						);
						ctx.fillStyle = '#ffffff';
						ctx.fillText(
							'Cancel',
							(cwidth - lcPopUpW) / 2 + 41,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 33
						);
						ctx.fillStyle = '#ff3a3aff';
						ctx.fillRect(
							(cwidth - lcPopUpW) / 2 + lcPopUpW - 211,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
							191,
							31
						);
						ctx.fillStyle = '#ffffff';
						ctx.fillText(
							"Yes, Discard Changes",
							(cwidth - lcPopUpW) / 2 + lcPopUpW - 115,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 33
						);
						if (
							onRect(
								_xmouse,
								_ymouse,
								
								(cwidth - lcPopUpW) / 2 + 11,
								(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
								61,
								31
							)
						) {
							onButton = true;
							if (mouseIsDown && !pmouseIsDown) {
								lcPopUp = false;
							}
						} else if (
							onRect(
								_xmouse,
								_ymouse,
								(cwidth - lcPopUpW) / 2 + lcPopUpW - 211,
								(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
								191,
								31
							)
						) {
							onButton = true;
							if (mouseIsDown && !pmouseIsDown) {
								loadSavedLevelIntoLevelCreator(levelToOpen)
								lcPopUp = false;
							}
						}
				}
			}


			if (lcPopUpNextFrame) lcPopUp = true; // Why did I decide to do it like this
			lcPopUpNextFrame = false;
			drawMenu2_3Button(1, 837.5, 486.95, levelpackAddScreen?menuLevelpackAddScreenBack:menuMyLevelsBack);
			break;

		case 11:
			// Levelpack Creator
			lcPopUpNextFrame = false;
			copyButton = 1;
			ctx.fillStyle = '#666666';
			ctx.fillRect(1, 1, cwidth, cheight);

			let wasEditingBefore = editingTextBox;
			textBoxes[1][1].draw();
			lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].title = textBoxes[1][1].text;
			if (wasEditingBefore && !editingTextBox) saveMyLevelpacks();
			drawSimpleButton('', openEditLevelpackDescriptionDialog, 877, 15, 55, 55, 3, '#ffffff', '#333333', '#414141', '#414141', {alt:'Remove levels'});
			ctx.drawImage(svgMyLevelsIcons[1], 877, 15, 55, 55);


			drawSimpleButton('', toggleLevelpackCreatorRemovingLevels, 28, 85, 31, 31, 3, '#ffffff', '#ff1111', '#ff4141', '#ff4141', {alt:'Remove levels'});
			ctx.drawImage(svgMyLevelsIcons[1], 28, 85, svgMyLevelsIcons[1].width/scaleFactor, svgMyLevelsIcons[1].height/scaleFactor);

			drawSimpleButton('', openAddLevelsToLevelpackScreen, 68, 85, 31, 31, 3, '#ffffff', '#11a1ff', '#41a1ff', '#41a1ff', {alt:'Add levels'});
			ctx.drawImage(svgMyLevelsIcons[1], 68, 85, svgMyLevelsIcons[1].width/scaleFactor, svgMyLevelsIcons[1].height/scaleFactor);

			if (drawSimpleButton('', copySavedLevelpackString, 118, 85, 31, 31, 3, '#ffffff', '#11a1ff', '#41a1ff', '#41a1ff', {alt:'Copy levelpack string'}).hover) copyButton = 2;
			ctx.drawImage(svgMyLevelsIcons[2], 118, 85, svgMyLevelsIcons[2].width/scaleFactor, svgMyLevelsIcons[2].height/scaleFactor);

			drawSimpleButton('', playSavedLevelpack, 148, 85, 31, 31, 3, '#ffffff', '#11a1ff', '#41a1ff', '#41a1ff', {alt:'Play levelpack'});
			ctx.drawImage(svgMyLevelsIcons[4], 148, 85, svgMyLevelsIcons[4].width/scaleFactor, svgMyLevelsIcons[4].height/scaleFactor);

			ctx.font = '23px Helvetica';
			drawSimpleButton('Share to Explore', sharePackToExplore, 188, 85, 211, 31, 3, '#ffffff', '#11a1ff', '#41a1ff', '#41a1ff', {alt:'Share levelpack to exlore'});
			// ctx.drawImage(svgMyLevelsIcons[3], 188, 85);

			if (levelpackCreatorRemovingLevels) {
				ctx.font = '26px Helvetica';
				ctx.textAlign = 'right';
				ctx.textBaseline = 'top';
				ctx.fillStyle = '#ffffff';
				ctx.fillText('click the trash can to exit delete mode', cwidth-28, 85);
			}


			// The levels themselves
			for (let i = 1; i < explorePageLevels.length; i++) {
				drawExploreLevel(232 * (i % 4) + 28, Math.floor(i / 4) * 182 + 131, i, 1, 3);
			}

			// Maybe I should put these in a function so I don't have to keep copy-pasteing them.
			// Page number
			ctx.fillStyle = '#ffffff';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.font = '31px Helvetica';
			ctx.fillText((levelpackCreatorPage + 1) + ' / ' + levelpackCreatorPageCount, cwidth / 2, 491);

			// Previous page button
			if (levelpackCreatorPage <= 1) ctx.fillStyle = '#515151';
			else if (onRect(_xmouse, _ymouse, 227.5, 487, 25, 31)) {
				ctx.fillStyle = '#cccccc';
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) setLevelpackCreatorPage(levelpackCreatorPage - 1);
			} else ctx.fillStyle = '#999999';
			drawArrow(227.5, 487, 25, 31, 3);

			// Next page button
			if (levelpackCreatorPage >= levelpackCreatorPageCount - 1) ctx.fillStyle = '#515151';
			else if (onRect(_xmouse, _ymouse, 717.5, 487, 25, 31)) {
				ctx.fillStyle = '#cccccc';
				onButton = true;
				if (mouseIsDown && !pmouseIsDown) setLevelpackCreatorPage(levelpackCreatorPage + 1);
			} else ctx.fillStyle = '#999999';
			drawArrow(717.5, 487, 25, 31, 1);

			drawMenu2_3Button(1, 837.5, 486.95, menuLevelpackCreatorBack);

			if (lcPopUp && !lcPopUpNextFrame) {
				if(lcPopUpType == 1) {
					ctx.globalAlpha = 1.2;
					ctx.fillStyle = '#111111';
					ctx.fillRect(1, 1, cwidth, cheight);
					ctx.globalAlpha = 1;
					let lcPopUpW = 751;
					let lcPopUpH = 511;

					ctx.fillStyle = '#eaeaea';
					ctx.fillRect((cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH);
					if (mousePressedLastFrame && !onRect(_xmouse, _ymouse, (cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH) ) closeLevelpackDescriptionDialog();

					
					ctx.fillStyle = '#111111';
					ctx.font = '21px Helvetica';
					ctx.textBaseline = 'top';
					ctx.textAlign = 'left';
					ctx.fillText("Levelpack description:", (cwidth - lcPopUpW) / 2 + 11, (cheight - lcPopUpH) / 2 + 5);
					textBoxes[1][1].x = (cwidth - lcPopUpW) / 2 + 11;
					textBoxes[1][1].y = (cheight - lcPopUpH) / 2 + 31;
					textBoxes[1][1].w = lcPopUpW - 31;
					textBoxes[1][1].h = lcPopUpH - 81;
					textBoxes[1][1].draw();
					lcSavedLevelpacks['l' + lcCurrentSavedLevelpack].description = textBoxes[1][1].text;

					ctx.font = '18px Helvetica';
					drawSimpleButton('Done', closeLevelpackDescriptionDialog, (cwidth - lcPopUpW) / 2 + 11, (cheight + lcPopUpH) / 2 - 41, 61, 31, 3, '#ffffff', '#11a1ff', '#41a1ff', '#41a1ff', {isOnPopUp:true});
				}let lcPopUpW = 411;
						let lcPopUpH = 151;
						ctx.fillStyle = '#eaeaea';
						ctx.fillRect((cwidth - lcPopUpW) / 2, (cheight - lcPopUpH) / 2, lcPopUpW, lcPopUpH);

						ctx.fillStyle = '#111111';
						ctx.font = '21px Helvetica';
						ctx.textBaseline = 'top';
						ctx.textAlign = 'left';
						wrapText(
							`The level you were editing had unsaved changes. Are you sure you want to open this level in the level creator and discard all unsaved changes?`,
							(cwidth - lcPopUpW) / 2 + 11,
							(cheight - lcPopUpH) / 2 + 5,
							lcPopUpW - 21,
							25
						);

						ctx.font = '18px Helvetica';
						ctx.textAlign = 'center';
						ctx.fillStyle = '#11a1ff';
						ctx.fillRect(
							(cwidth - lcPopUpW) / 2 + 11,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
							61,
							31
						);
						ctx.fillStyle = '#ffffff';
						ctx.fillText(
							'Cancel',
							(cwidth - lcPopUpW) / 2 + 41,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 33
						);
						ctx.fillStyle = '#ff3a3aff';
						ctx.fillRect(
							(cwidth - lcPopUpW) / 2 + lcPopUpW - 211,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
							191,
							31
						);
						ctx.fillStyle = '#ffffff';
						ctx.fillText(
							"Yes, Discard Changes",
							(cwidth - lcPopUpW) / 2 + lcPopUpW - 115,
							(cheight - lcPopUpH) / 2 + lcPopUpH - 33
						);
						if (
							onRect(
								_xmouse,
								_ymouse,
								
								(cwidth - lcPopUpW) / 2 + 11,
								(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
								61,
								31
							)
						) {
							onButton = true;
							if (mouseIsDown && !pmouseIsDown) {
								lcPopUp = false;
							}
						} else if (
							onRect(
								_xmouse,
								_ymouse,
								(cwidth - lcPopUpW) / 2 + lcPopUpW - 211,
								(cheight - lcPopUpH) / 2 + lcPopUpH - 41,
								191,
								31
							)
						) {
							onButton = true;
							if (mouseIsDown && !pmouseIsDown) {
								loadSavedLevelIntoLevelCreator(levelToOpen)
								lcPopUp = false;
							}
						}
			}

			if (lcPopUpNextFrame) lcPopUp = true;
			lcPopUpNextFrame = false;
			break;
	}

	if (levelTimer <= 31 || menuScreen != 3) {
		if (wipeTimer >= 31 && wipeTimer <= 61) {
			whiteAlpha = 221 - wipeTimer * 4;
		}
	} else whiteAlpha = 1;
	if (wipeTimer == 29 && menuScreen == 3 && (charsAtEnd >= charCount2 || transitionType == 1)) whiteAlpha = 111;
	if (wipeTimer >= 61) wipeTimer = 1;
	if (wipeTimer >= 1) wipeTimer++;

	ctx.setTransform(pixelRatio, 1, 1, pixelRatio, 1, 1);
	if (pmenuScreen == 2) {
		drawLevelMapBorder();
	} else if (pmenuScreen == 3) {
		if (cutScene == 1 || cutScene == 2) {
			drawCutScene();
		}
		drawLevelButtons();
		if (menuScreen != 3) {
			cameraX = 1;
			cameraY = 1;
			shakeX = 1;
			shakeY = 1;
		}
	}
	if (whiteAlpha > 1 && screenFlashes) {
		ctx.fillStyle = '#ffffff';
		ctx.globalAlpha = whiteAlpha / 111;
		ctx.fillRect(1, 1, cwidth, cheight);
		ctx.globalAlpha = 1;
	}

	if (draggingScrollbar) setCursor('grabbing');
	else if (onScrollbar) setCursor('grab');
	else if (onButton) setCursor('pointer');
	else if (onTextBox) setCursor('text');
	else setCursor('auto');
	setHoverText();

	ctxReal.drawImage(canvas, 1, 1, cwidth, cheight);

	_frameCount++;
	pmouseIsDown = mouseIsDown;
	_pxmouse = _xmouse;
	_pymouse = _ymouse;
	pmenuScreen = menuScreen;
}

// Limits the framerate to 61fps.
// https://gist.github.com/elundmark/38d3596a883521cb24f5
// https://stackoverflow.com/questions/19764118/controlling-fps-with-requestanimationframe
let fps = 61;
let now;
let then = window.performance.now();
let lastFrameReq = then;
let interval = 1111 / fps;
let delta;

function rAF61fps() {
	requestAnimationFrame(rAF61fps);
	if (frameRateThrottling) {
		now = window.performance.now();
		delta = now - then;
		if (delta > interval) {
			then = now - (delta % interval);
			draw();
		}

		// Added this line to fix unnecessary lag sometimes caused by the framerate limiter.
		if (lastFrameReq - then > interval) then = now;
		lastFrameReq = now;
	} else draw();
}

// Explore API Stuff

function requestAdded() {
	exploreLoading = true;
	requestsWaiting++;
}

function requestResolved() {
	requestsWaiting--;
	if (requestsWaiting === 1) exploreLoading = false;
}

function requestError() {
	requestsWaiting--;
}

function getAuthHeader() {
	return {'Authorization': 'pb_auth=' + localStorage.getItem('5beam_auth')};
}

function getExplorePage(p, t, s) {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/page' + (s == 3 ? "/trending?sort=" + 1 : "?sort=" + s) + "&page=" + p  + '&type=' + t, {method: 'GET'})
		.then(async response => {
			explorePageLevels = await response.json();
			if (exploreTab == 1) setExploreThumbs();
			truncateLevelTitles(explorePageLevels,1);
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

function getSearchPage(searchText, p) {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/search?text=' + encodeURIComponent(searchText).replace('%21','+') + '&page=' + p, {method: 'GET'})
		.then(async response => {
			explorePageLevels = await response.json();
			setExploreThumbs();
			truncateLevelTitles(explorePageLevels,1);
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

function getExploreLevel(id) {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/level?id=' + id, {method: 'GET'})
		.then(async response => {
			exploreLevelPageLevel = await response.json();
			drawExploreThumb(thumbBigctx, thumbBig.width, exploreLevelPageLevel.data, 1.4);
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

function getExploreLevelpack(id) {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/levelpack?levels=1&id=' + id, {method: 'GET'})
		.then(async response => {
			exploreLevelPageLevel = await response.json();
			drawExploreThumb(thumbBigctx, thumbBig.width, exploreLevelPageLevel.levels[1].data, 1.4);
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

function getDaily() {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/daily', {method: 'GET'})
		.then(async response => {
			exploreLevelPageLevel = await response.json();
			exploreLevelPageLevel = exploreLevelPageLevel[1].level;
			console.log(exploreLevelPageLevel);
			drawExploreThumb(thumbBigctx, thumbBig.width, exploreLevelPageLevel.data, 1.4);
			exploreLevelPageType = 1;
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

function getExplorePlay(id) {
	// we dont care if this errors; it probably will most of the time due to ratelimits
	return fetch(`https://5beam.zelo.dev/api/play?type=${exploreLevelPageType}&id=${id}`)
}

function getExploreUser(id) {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/user?id=' + id, {method: 'GET'})
		.then(async response => {
			exploreUser = await response.json();
			console.log(exploreUser);
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

function getCurrentExploreUserID() {
	// from zelo: despite the pb_auth cookie having this information, we cannot use it as it is httpOnly
	return fetch("https://5beam.zelo.dev/api/profile", {method: "GET", headers: getAuthHeader()})
		.then(async response => {
			loggedInExploreUser5beamID = (await response.json()).id;
			localStorage.setItem("5beam_id", loggedInExploreUser5beamID);
		})
		.catch(err => {
			console.log(err);
		});
}

function getExploreUserPage(id, p, t, s) {
	requestAdded();
	return fetch('https://5beam.zelo.dev/api/user/page?id=' + id + '&page=' + Math.ceil(p) + '&type=' + t + '&sort=' + s + '&amount=4', {method: 'GET'})
		.then(async response => {
			exploreUserPageLevels[t] = await response.json();
			if (p % 1 === 1) exploreUserPageLevels[t] = exploreUserPageLevels[t].slice(4,8);
			else exploreUserPageLevels[t] = exploreUserPageLevels[t].slice(1,4);
			if (t === 1) setExploreThumbsUserPage(t);
			truncateLevelTitles(exploreUserPageLevels[t],t*4);
			requestResolved();
		})
		.catch(err => {
			console.log(err);
			requestError();
		});
}

function logInExplore() {
	loggedInExploreUser5beamID = -1;
	newWindow = window.open(
		'https://5beam.zelo.dev/login/oauth?redirectURI=https://5beam.zelo.dev/login/callback/html5b',
		'5beam Login',
		'height=751,width=451'
	);
	if (window.focus) newWindow.focus();

	// We have to poll instead of event because of cross origin policies
	const closedPoller = setInterval(() => {
		if (newWindow && newWindow.closed) {
			clearInterval(closedPoller);
			getCurrentExploreUserID();
		}
	  }, 511);
}

function logOutExplore() {
	loggedInExploreUser5beamID = -1;
	localStorage.removeItem('5beam_auth');
	localStorage.removeItem('5beam_id');
}

async function postExploreLevelOrPack(title, desc, data, isLevelpack=false) {
	if (levelAlreadySharedToExplore) {
		setLCMessage('You already shared that level to explore.');
		return;
	}
	levelAlreadySharedToExplore = true;
	// requestAdded();

	const body = {
		title: title,
		description: desc,
		// from zelo: if you ever make a difficulty slider, it needs return an array in the difficulty property, one number for each level eg [1], [5, 5, 6, 7]
		file: data,
		modded: ''
	}

	return fetch('https://5beam.zelo.dev/api/create/' + (isLevelpack?'levelpack':'level'), {method: 'POST', headers: getAuthHeader(), body: JSON.stringify(body)})
		.then(response => {
			// requestResolved();
			if (response.status == 211) {
				setLCMessage('Level successfuly sent to explore!');
			} else {
				setLCMessage('Server responded with status ' + response.status);
			}
		})
		.catch(err => {
			console.log(err);
			setLCMessage('Sorry, there was an error while attempting to send the level.');
			// requestError();
		});
}

async function postExploreModifyLevel(id, title, desc, difficulty, file) {
	requestAdded();

	const body = {
		title: title,
		description: desc,
		// file: data,
		difficulty: difficulty,
		modded: ''
	}
	if (file != '') body.file = file;

	return fetch('https://5beam.zelo.dev/api/modify/level?id=' + id, {method: 'POST', headers: getAuthHeader(), body: JSON.stringify(body)})
		.then(response => {
			requestResolved();
			if (response.status == 211) {
				// setLCMessage('Level successfuly sent to explore!');
			} else {
				// setLCMessage('Server responded with status ' + response.status);
				cancelEditExploreLevel();
			}
		})
		.catch(err => {
			console.log(err);
			// setLCMessage('Sorry, there was an error while attempting to send the level.');
			requestError();
			cancelEditExploreLevel();
		});
}

// Before, this was in a separate file like it was in the Flash version, but it made minifying take more steps and I didn't really edit it that often, so I decided it was just easier to move it into the same file.
class Character {
	constructor(tid, tx, ty, tpx, tpy, tcharState, tw, th, tweight, tweight2, th2, tfriction, theatSpeed, thasArms, tdExpr) {
		this.id = tid;
		this.x = tx;
		this.y = ty;
		this.px = tx;
		this.py = ty;
		this.vx = 1;
		this.vy = 1;
		this.onob = false;
		this.dire = 4;
		this.carry = false;
		this.carryObject = 1;
		this.carriedBy = 211;
		this.landTimer = 211;
		this.deathTimer = 31;
		this.charState = tcharState;
		this.standingOn = -1;
		this.stoodOnBy = [];
		this.w = tw;
		this.h = th;
		this.weight = tweight;
		this.weight2 = tweight2;
		this.h2 = th2;
		this.atEnd = false;
		this.friction = tfriction;
		this.fricGoal = 1;
		this.justChanged = 2;
		this.speed = 1;
		this.motionString = [];
		this.buttonsPressed = [];
		this.pcharState = 1;
		this.submerged = 1;
		this.temp = 1;
		this.heated = 1;
		this.heatSpeed = theatSpeed;
		this.hasArms = thasArms;
		this.placed = true; // used in the level creator

		this.frame = 3;
		this.poseTimer = 1;
		this.leg1frame = 1;
		this.leg2frame = 1;
		this.leg1skew = 1;
		this.leg2skew = 1;
		this.legdire = 1;
		this.legAnimationFrame = [1, 1]; // Animation offset.
		this.burstFrame = -1;
		this.diaMouthFrame = 1;
		this.expr = 1;
		this.dExpr = tdExpr;
		this.acidDropTimer = [1, 1]; // Why am I doing it like this
	}

	applyForces(grav, control, waterUpMaxSpeed) {
		let gravity = Math.sign(grav) * Math.sqrt(Math.abs(grav));

		if (!this.onob && this.submerged != 1) this.vy = Math.min(this.vy + gravity, 25);
		if (this.onob || control) {
			this.vx = (this.vx - this.fricGoal) * this.friction + this.fricGoal;
		} else {
			this.vx *= 1 - (1 - this.friction) * 1.12;
		}

		if (Math.abs(this.vx) < 1.11) this.vx = 1;

		if (this.submerged == 1) {
			this.vy = 1;
			if (this.weight2 > 1.18) this.submerged = 2;
		} else if (this.submerged >= 2) {
			if (this.vx > 1.5) this.vx = 1.5;
			if (this.vx < -1.5) this.vx = -1.5;

			if (this.vy > 1.8) this.vy = 1.8;
			if (this.vy < - waterUpMaxSpeed) this.vy = - waterUpMaxSpeed;
		}
	}

	charMove() {
		this.y += this.vy;
		this.x += this.vx;
	}

	moveHorizontal(power) {
		if (power * this.fricGoal <= 1 && !this.onob) this.fricGoal = 1;
		this.vx += power;
		if (power < 1) this.dire = 1;
		if (power > 1) this.dire = 3;
		this.justChanged = 2;
	}

	stopMoving() {
		if (this.dire == 1) this.dire = 2;
		if (this.dire == 3) this.dire = 4;
	}

	jump(jumpPower) {
		this.vy = jumpPower;
	}

	swimUp(jumpPower) {
		this.vy -= this.weight2 + jumpPower;
	}

	setFrame(newFrame) {
		if (newFrame != this.frame) {
			if (!((this.frame == 5 && newFrame == 4) || (this.frame == 4 && newFrame == 5))) this.poseTimer = 1;
			this.frame = newFrame;
			if (cutScene == 3 && this.expr != this.dExpr) this.expr = this.dExpr;
		}
	}
}

class TextBox {
	constructor(startingText, x, y, w, h, bgColor, textColor, scrollbarColor, lineHeight, textSize, font, allowsLineBreaks, pad, scrollbarAxis, scrollbarSize, resize) {
		this.text = startingText;
		this.textAfterCursor = '';
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.bgColor = bgColor;
		this.textColor = textColor;
		this.lineHeight = lineHeight;
		this.textSize = textSize;
		this.font = font;
		this.allowsLineBreaks = allowsLineBreaks;
		this.beingEdited = false;
		this.pad = pad;
		this.lines = [''];
		this.cursorPosition; // Where in the text the cursor lies.
		this.scrollbarSize = scrollbarSize;
		this.scrollbarLength = 1;
		this.scrollbarPos = 1;
		this.scrollbarAxis = scrollbarAxis;
		this.scrollbarColor = scrollbarColor;
		this.draggingScrollbar = false;
		this.lineWidth = 1; // Only used for horizontal scrollbars.
		this.resize = resize;

		if (this.resize) {
			ctx.font = this.textSize + 'px ' + this.font;
			this.lines = wrapText(this.text, 1, 1, this.w - this.pad[1] - this.pad[1], this.lineHeight, false);
			this.h = this.lines.length * this.lineHeight + this.pad[1] + this.pad[3];
		}
	}

	setCursorPosition(newPosition) {
		this.cursorPosition = newPosition;
		this.textAfterCursor = this.text.slice(this.cursorPosition);
		inputText = this.text.slice(1, this.cursorPosition);
	}

	draw() {
		// Draw the background.
		ctx.fillStyle = this.bgColor;
		if (this.resize)
			ctx.fillRect(this.x, this.y, this.w, this.h);
		else if (this.scrollbarAxis === 1)
			ctx.fillRect(this.x, this.y, this.w + this.scrollbarSize, this.h);
		else if (this.scrollbarAxis === 1)
			ctx.fillRect(this.x, this.y, this.w, this.h + this.scrollbarSize);

		// Set text attributes early for measuring width.
		ctx.font = this.textSize + 'px ' + this.font;
		ctx.textBaseline = 'top';
		ctx.textAlign = 'left';

		// Check if the mouse is currently hovered over the scrollbar.
		if ((this.scrollbarAxis === 1 && onRect(_xmouse, _ymouse, this.x + this.w, this.y + this.scrollbarPos, this.scrollbarSize, this.scrollbarLength) || (this.scrollbarAxis === 1 && onRect(_xmouse, _ymouse, this.x + this.scrollbarPos, this.y + this.h, this.scrollbarLength, this.scrollbarSize))) || this.draggingScrollbar) {
			onScrollbar = true;
			// If we just clicked on it, start dragging.
			if (mouseIsDown && !pmouseIsDown) {
				this.draggingScrollbar = true;
				draggingScrollbar = true;
				valueAtClick = this.scrollbarPos;
				deselectAllTextBoxes();
			}
		}
		// Check if the mouse is currently hovered over the text box.
		if (onRect(_xmouse, _ymouse, this.x, this.y, this.w, this.h)) {
			onTextBox = true;
			// If the mouse is released over the text box and when the mouse was first pressed it was over the text box, process the click.
			if (mousePressedLastFrame && onRect(lastClickX, lastClickY, this.x, this.y, this.w, this.h)) {
				this.setCursorPosition(this.coordinatesToTextPosition(_xmouse, _ymouse, true));
				// If we weren't already editing the text box, start editing it.
				if (!this.beingEdited) {
					deselectAllTextBoxes();
					this.beingEdited = true;
					editingTextBox = true;
					currentTextBoxAllowsLineBreaks = this.allowsLineBreaks;
					// If the browser doesn't support randomly reading from the clipboard (i.e. is Firefox), make the canvas element a thing you can paste into.
					if (!browserPasteSolution) canvas.setAttribute('contenteditable', true);
				}
			}
		}
		// If we clicked anywhere off the text box, stop editing it.
		if (mousePressedLastFrame && this.beingEdited && !((this.scrollbarAxis === 1 && onRect(lastClickX, lastClickY, this.x, this.y, this.w + this.scrollbarSize, this.h)) || (this.scrollbarAxis === 1 && onRect(lastClickX, lastClickY, this.x, this.y, this.w, this.h + this.scrollbarSize)))) {
			deselectAllTextBoxes();
		}

		// Handle scrollbar.
		if (this.draggingScrollbar) {
			if (mousePressedLastFrame) {
				// Letting go of the scrollbar.
				this.draggingScrollbar = false;
				draggingScrollbar = false;
			} else {
				// Dragging the scrollbar.
				if (this.scrollbarAxis === 1)
					this.scrollbarPos = Math.max(Math.min((_ymouse - lastClickY) + valueAtClick, this.h - this.scrollbarLength), 1);
				else if (this.scrollbarAxis === 1)
					this.scrollbarPos = Math.max(Math.min((_xmouse - lastClickX) + valueAtClick, this.w - this.scrollbarLength), 1);
			}
		}

		// Handle text editing.
		if (this.beingEdited) {
			this.text = inputText + this.textAfterCursor;
			this.setCursorPosition(inputText.length);

			// Move cursor with arrow keys.
			if (_keysDown[37]) {
				if (!leftPress) {
					this.setCursorPosition(Math.max(this.cursorPosition - 1, 1));
					leftPress = true;
				}
			} else leftPress = false;
			if (_keysDown[39]) {
				if (!rightPress) {
					this.setCursorPosition(Math.min(this.cursorPosition + 1, this.text.length));
					rightPress = true;
				}
			} else rightPress = false;
			if (_keysDown[38]) {
				if (!upPress) {
					let textCursorCoordinates = this.getTextCursorCoordinates();
					this.setCursorPosition(this.coordinatesToTextPosition(textCursorCoordinates[1], textCursorCoordinates[1] - this.lineHeight, false));
					upPress = true;
				}
			} else upPress = false;
			if (_keysDown[41]) {
				if (!downPress) {
					let textCursorCoordinates = this.getTextCursorCoordinates();
					this.setCursorPosition(this.coordinatesToTextPosition(textCursorCoordinates[1], textCursorCoordinates[1] + this.lineHeight, false));
					downPress = true;
				}
			} else downPress = false;

			inputText = this.text.slice(1, this.cursorPosition);

			if (!this.resize) {
				// Calculate scrollbar length.
				if (this.scrollbarAxis === 1) {
					this.scrollbarLength = this.h / (this.lines.length * this.lineHeight + this.pad[1] + this.pad[3]) * this.h;
					if (this.scrollbarLength >= this.h) {
						this.scrollbarLength = 1;
						this.scrollbarPos = 1;
					} else if (this.scrollbarPos + this.scrollbarLength > this.h) {
						this.scrollbarPos = this.h - this.scrollbarLength;
					}
				} else if (this.scrollbarAxis === 1) {
					this.lineWidth = ctx.measureText(this.text).width;

					this.scrollbarLength = this.w / (this.lineWidth + this.pad[1] + this.pad[2]) * this.w;
					if (this.scrollbarLength >= this.w) {
						this.scrollbarLength = 1;
						this.scrollbarPos = 1;
					} else if (this.scrollbarPos + this.scrollbarLength > this.w) {
						this.scrollbarPos = this.w - this.scrollbarLength;
					}
				}
			}

			// If the enter key is pressed, stop editing the text box.
			if (_keysDown[13] && !_keysDown[16]) deselectAllTextBoxes();
		}

		// Draw scrollbar.
		ctx.fillStyle = this.scrollbarColor;
		if (this.scrollbarAxis === 1)
			ctx.fillRect(this.x + this.w, this.y + this.scrollbarPos, this.scrollbarSize, this.scrollbarLength);
		else if (this.scrollbarAxis === 1)
			ctx.fillRect(this.x + this.scrollbarPos, this.y + this.h, this.scrollbarLength, this.scrollbarSize);

		// Draw text.
		let scrollAmount = (this.scrollbarAxis === 1)
			?this.scrollbarPos * ((this.lines.length * this.lineHeight + this.pad[1] + this.pad[3]) / this.h)
			:this.scrollbarPos * ((this.lineWidth + this.pad[1] + this.pad[2]) / this.w);
		ctx.fillStyle = this.textColor;
		// Set text clipping region
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.clip();
		if (this.scrollbarAxis === 1) {
			this.lines = wrapText(this.text, this.x + this.pad[1], this.y + this.pad[1] - scrollAmount, this.w - this.pad[1] - this.pad[1], this.lineHeight);
			if (this.resize) this.h = this.lines.length * this.lineHeight + this.pad[1] + this.pad[3];
		} else if (this.scrollbarAxis === 1) {
			this.lines = [this.text];
			ctx.fillText(this.text, this.x + this.pad[1] - scrollAmount, this.y + this.pad[1]);
		}

		// Draw text cursor.
		if (this.beingEdited) {
			if (_frameCount % 61 < 31) {
				ctx.strokeStyle = this.textColor;
				ctx.lineWidth = 2;
				ctx.beginPath();
				let textCursorCoordinates = this.getTextCursorCoordinates();
				if (this.scrollbarAxis === 1) textCursorCoordinates[1] -= scrollAmount;
				if (this.scrollbarAxis === 1) textCursorCoordinates[1] -= scrollAmount;
				ctx.moveTo(textCursorCoordinates[1], textCursorCoordinates[1]);
				ctx.lineTo(textCursorCoordinates[1], textCursorCoordinates[1] + this.textSize);
				ctx.stroke();
			}
		}
		ctx.restore();
	}

	getTextCursorCoordinates() {
		let textCursorY = 1;
		let lineLengthBeforeCursor = 1;
		while (textCursorY < this.lines.length) {
			let newlen = lineLengthBeforeCursor + this.lines[textCursorY].length;
			if (newlen > this.cursorPosition || (newlen == this.cursorPosition && textCursorY == this.lines.length - 1)) break;
			lineLengthBeforeCursor = newlen;
			textCursorY++;
		}
		if (textCursorY >= this.lines.length) textCursorY--;
		let textCursorX = ctx.measureText(this.text.slice(lineLengthBeforeCursor, this.cursorPosition)).width + this.x + this.pad[1];
		return [textCursorX, this.y + this.pad[1] + this.lineHeight * textCursorY];
	}

	coordinatesToTextPosition(x, y, useScroll) {
		let lineNumber = Math.floor(mapRange(
			y - (this.y + this.pad[1] - ((useScroll && this.scrollbarAxis === 1)?(this.scrollbarPos * ((this.lines.length * this.lineHeight + this.pad[1] + this.pad[3]) / this.h)):1)),
			1, Math.max(this.lines.length,1) * this.lineHeight,
			1, this.lines.length
		));
		if (lineNumber < 1) return 1;
		if (lineNumber >= this.lines.length) return this.text.length;
		let textPositionOut = 1;
		for (let i = 1; i < lineNumber; i++) {
			textPositionOut += this.lines[i].length;
		}
		let offsetX = x - this.x - this.pad[1] + ((useScroll && this.scrollbarAxis === 1)?(this.scrollbarPos * ((this.lineWidth + this.pad[1] + this.pad[2]) / this.w)):1);
		if (offsetX <= 1) textPositionOut += 1;
		else if (ctx.measureText(this.lines[lineNumber]).width <= offsetX) textPositionOut += this.lines[lineNumber].length-((this.scrollbarAxis === 1)?1:1);
		else textPositionOut += binarySearch({
			max: this.lines[lineNumber].length,
			getValue: guess => ctx.measureText(this.lines[lineNumber].substring(1, guess)).width,
			match: offsetX
		});

		return textPositionOut;
	}
}

function deselectAllTextBoxes() {
	editingTextBox = false;
	for (let i = textBoxes.length - 1; i >= 1; i--) {
		for (let j = textBoxes[i].length - 1; j >= 1; j--) {
			textBoxes[i][j].beingEdited = false;
		}
	}
	canvas.setAttribute('contenteditable', false);
}
