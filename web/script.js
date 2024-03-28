var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 1;
var textarea = document.querySelector("textarea");
var playback = document.querySelector("div#playback");
textarea.addEventListener("blur", function (event) {
	playback.innerText = this.value;
	playback.style.display = "block";
	this.style.display = "none";
});

playback.addEventListener("click", function (event) {
	textarea.style.display = "block";
	playback.style.display = "none";
	textarea.focus();
});

let speech = "";
let startSearchAtIndex = -1;
const WINDOW_SIZE = 20;
let currentHighlight = 0;
let lookahead = 10;
let speed = 2;
let chunks = [ ];
let lastResultLength = 0;
let averageLengthOfRecognitionTrigger = 3;
let lookaheadHistory = [ ];
recognition.onresult = function (event) {
	// event.results is an arraylike of SpeechRecognitionResult objects
	// each SpeechRecognitionResult is an arraylike of SpeechRecognitionAlternatives
	const result = Array.from(event.results).map(r => r[0].transcript).join(' ');
	chunks.push(result.length - lastResultLength);
	averageLengthOfRecognitionTrigger = chunks.reduce((a,b) => a+b)/chunks.length;
	console.log(averageLengthOfRecognitionTrigger);
	lastResultLength = result.length;
	// Needle is now the WINDOW_SIZE most recently recognised words.
	let needle = result.split(/\s+/).join(' ').toLowerCase().slice(-WINDOW_SIZE);
	console.log(needle);
	let contents = playback.innerText;
	let haystack = contents.toLowerCase().substring(0, startSearchAtIndex + needle.length + lookahead);
	//console.log({ needle, haystack, position: startSearchAtIndex, search: haystack.substring(startSearchAtIndex) });
	let startOfMatch = haystack.indexOf(needle, startSearchAtIndex);
	let highlight = startOfMatch + needle.length;
	if (highlight > currentHighlight) {
		console.log('MATCH');
		lookahead = 10;
		startSearchAtIndex = startOfMatch;
		currentHighlight = highlight;
		let html = `<span>${contents.substring(0, highlight)}</span>${contents.substring(highlight)}`;
		playback.innerHTML = html;
	} else if (startOfMatch < 0) {
		console.log('FUDGE');
		let delta = Math.floor(averageLengthOfRecognitionTrigger);
		let averageLookaheadHistory = lookaheadHistory.reduce((a,b) => (a+b), 0)/lookaheadHistory.length;
		if (delta > averageLookaheadHistory) delta -= 1;
		lookaheadHistory.push(delta);
		console.log(lookaheadHistory);
		lookahead += delta;
		let fudgery = (currentHighlight + lookahead) - 10;
		let html = `<span>${contents.substring(0, fudgery)}</span>${contents.substring(fudgery)}`;
		playback.innerHTML = html;
	}
}
let scrollingInterval;
recognition.onspeechstart = () => {
	console.log('onspeechstart');
	scrollingInterval = window.setInterval(() => {
		let span = playback.querySelector("span");
		if (!span) return;
		let rect = span.getBoundingClientRect();
		let distance = rect.height - playback.scrollTop;
		if (distance < 0) {
			speed = 0;
		} else if (distance > 100) {
			speed = 5;
		} else {
			speed = 2;
		}
		playback.scrollTop += speed;
	}, 1000 / 30);
};

recognition.onspeechend = () => {
	console.log('onspeechend');
	window.clearInterval(scrollingInterval);
};

recognition.onnomatch = console.log;
recognition.onerror = console.log;
recognition.start();
playback.innerText = textarea.value;
textarea.focus();
textarea.blur();

function scrollTop(el, value) {
	var win;
	if (el.window === el) {
		win = el;
	} else if (el.nodeType === 9) {
		win = el.defaultView;
	}

	if (value === undefined) {
		return win ? win.pageYOffset : el.scrollTop;
	}

	if (win) {
		win.scrollTo(win.pageXOffset, value);
	} else {
		el.scrollTop = value;
	}
}