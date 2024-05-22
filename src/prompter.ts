import Toolbar from './toolbar';
import Matcher from './matcher';
import { getCookie, setCookie } from './cookies';

const fontSizes = ["32px", "48px", "64px", "80px", "96px", "128px", "144px", "192px"];

function position(el: HTMLElement) {
	const { top, left } = el.getBoundingClientRect();
	const { marginTop, marginLeft } = getComputedStyle(el);
	return {
		top: top - parseInt(marginTop, 10),
		left: left - parseInt(marginLeft, 10)
	};
}

const FPS = 50;

// How long do we recognise speech for before we start looking for a restart?
const RESTART_AFTER_SPEECH_MS = 60000;
// When we're looking for a restart, how long does the pause need to be to trigger one?
const RESTART_PAUSE_LENGTH_MS = 1000;
// OK, the listen process:
// We start listening immediately, with a 30-second reset loop.
// After 30 seconds, we go into a 1-second delay loop
// if we don't get any audio for 1 second, we stop speech, destroy it,
// create a new one, and start the 30-second loop again.

export default class Prompter {
	editor: HTMLTextAreaElement;
	player: HTMLDivElement;
	speechStatusElement: HTMLDivElement;
	scriptStatusElement: HTMLDivElement;
	matcher: Matcher;
	position: number = 0;
	guessSize: number = 0;
	lookahead: number = 100; // how many characters ahead of the current position should we look when deciding if a match is valid?
	toolbar: Toolbar;
	marker: HTMLHRElement;
	markerTop: number = 0;
	container: HTMLElement;
	vflip: boolean = false;
	started: boolean = false;
	scrollInterval!: number;
	latestResult: string = '';
	speech: SpeechRecognition;
	createSpeech: () => SpeechRecognition;

	constructor(container: HTMLElement, toolbar: Toolbar, createSpeech: () => SpeechRecognition) {
		this.container = container;
		this.player = container.querySelector("div#playback")!;
		this.editor = container.querySelector("textarea")!;
		this.marker = container.querySelector("hr")!;
		this.scriptStatusElement = container.querySelector("div#script-status")!;
		this.speechStatusElement = container.querySelector("div#speech-status")!;
		this.markerTop = position(this.marker).top;
		this.matcher = new Matcher(this.editor.value);
		this.editor.addEventListener("change", this.editorChange.bind(this));
		this.player.addEventListener("click", this.edit.bind(this));
		this.toolbar = toolbar;
		this.toolbar.prompter = this;
		this.createSpeech = createSpeech;
		this.startSpeechRecognition();
	}

	restartTimeout: number = 0;

	startSpeechRecognition() {
		this.speech = this.createSpeech();
		this.speech.onspeechstart = this.onspeechstart.bind(this);
		this.speech.onnomatch = console.log;
		this.speech.onerror = this.speech_onerror.bind(this);
		this.speech.onresult = this.onresult.bind(this);
		this.speech.onspeechend = (event: any) => console.log("speech.onspeechend");
		this.speech.onsoundend = (event: any) => console.log("speech.onsoundend");
		this.speech.onend = this.speech_onend.bind(this);
		this.speech.start();
		this.restartTimeout = 0;
		window.setTimeout(() => {
			this.restartTimeout = window.setTimeout(this.restartSpeechRecognition.bind(this), RESTART_PAUSE_LENGTH_MS);
		}, RESTART_AFTER_SPEECH_MS)
	}

	restartSpeechRecognition() {
		window.clearTimeout(this.restartTimeout);
		this.restartTimeout = 0;
		this.resultsSinceWeShouldHaveRestarted = 0;
		this.speech.abort();
		this.startSpeechRecognition();
		this.container.style.backgroundColor = "";
	};

	speech_onend(event: any) {
		console.log("speech.onend", event);
		let container = this.container;
		container.classList.add("speech-ended");
		this.speech.abort();
		this.speech = this.createSpeech();
		window.setTimeout(() => {
			try {
				this.speech.start();
			} catch (error) {
				console.log(error);
			}
			container.classList.remove("speech-ended");
		}, 200);
	};

	speech_onerror(error: any) {
		this.container.classList.add("speech-error");
		console.error("speech.onerror", error);
		this.speech.abort();
		window.setTimeout(() => {
			try {
				this.speech.start();
			} catch (error) {
				console.log(error);
			}
			this.container.classList.remove("speech-error");
		}, 200);
	};


	onspeechstart() {
		console.log('speech started!');
	}

	resultsSinceWeShouldHaveRestarted: number = 0;

	onresult(event: { results: SpeechRecognitionResultList }) {
		if (this.restartTimeout) {
			this.resultsSinceWeShouldHaveRestarted = Math.min(this.resultsSinceWeShouldHaveRestarted + 5, 255);
			window.clearTimeout(this.restartTimeout);
			this.restartTimeout = window.setTimeout(this.restartSpeechRecognition.bind(this), RESTART_PAUSE_LENGTH_MS);
			this.container.style.backgroundColor = "#" + ("000000" + (this.resultsSinceWeShouldHaveRestarted * 0x10000).toString(16)).slice(-6);
		}
		let result = Array.from(event.results).map(r => r[0].transcript).join(' ').replace(/ +/g, ' ');
		var hasSpeechActuallyChanged = this.latestResult != result;
		if (hasSpeechActuallyChanged) {
			this.latestResult = result;
			let [filteredSpeech, update] = this.filterAndApplyCommands(result);
			if (update) this.updateSpeech(filteredSpeech);
		}
	}

	filterAndApplyCommands(speech: string): [result: string, update: boolean] {
		let update = true;
		let lastTwoWords = speech.toLowerCase().split(' ').slice(-2);
		if (lastTwoWords.length == 2 && lastTwoWords.includes("benedict")) {
			update = false;
			switch (lastTwoWords[1]) {
				case "ben":
				case "bened":
				case "benedict": break;
				case "bigger": this.updateTextSize(+1); break;
				case "smaller": this.updateTextSize(-1); break;
				case "wider": this.pad(-1); break;
				case "narrower": this.pad(+1); break;
				case "up": this.moveLine(-1); break;
				case "down": this.moveLine(+1); break;
				case "reset": this.reset(); break;
				case "go": this.reset(); this.play(); break;
				case "flip": this.flip("vflip"); break;
				case "mirror": this.flip("hflip"); break;
			}
		}
		let filteredSpeech = speech.replace(/ benedict \w+/g, ' ').replace(/ benedict$/, '');
		return [filteredSpeech, update];
	}

	init() {
		let storedScript = localStorage.getItem("benedict-script");
		this.pad(0);
		this.updateTextSize(0);
		this.updateScript(storedScript);
		this.updateSpeech();
	}

	edit() {
		window.clearInterval(this.scrollInterval);
		this.started = false;
		this.player.style.display = "none";
		this.editor.style.display = "block";
		this.editor.value = this.player.innerText.trim();
		this.editor.selectionStart = this.position + this.guessSize;
		this.editor.focus();
	}

	play() {
		this.updateScript();
		this.updateSpeech('');
		localStorage.setItem("benedict-script", this.editor.value);
		this.started = true;
		this.player.style.display = "block";
		this.editor.style.display = "none";
		this.scrollInterval = window.setInterval(this.updateScroll.bind(this), 1000 / FPS);
	}

	reset() {
		this.container.classList.add("reset-flash");
		this.speech.abort();
		window.setTimeout((() => {
			this.position = 0;
			this.guessSize = 0;
			this.updateScript();
			this.updateSpeech('');
			this.updateScroll();
			window.setTimeout((() => {
				this.container.classList.remove("reset-flash");
				this.speech.start()
			}).bind(this), 200);
		}).bind(this), 200);
	}

	flip = (className: string) => {
		switch (className) {
			case "vflip":
				this.vflip = this.container.classList.toggle(className); return;
			default:
				this.container.classList.toggle(className); return;
		}
	};

	moveLine(direction: number): void {
		let lineHeight = parseFloat(window.getComputedStyle(this.player).lineHeight)
		let updatedTop = (this.markerTop + (direction * lineHeight));
		if (updatedTop > 0 && updatedTop < this.container.getBoundingClientRect().height) {
			this.markerTop = updatedTop;
			this.marker.style.top = updatedTop + "px";
		}
	}



	pad(direction = 0) {
		const SCROLLBAR_WIDTH = 16;
		let padding = parseInt(getCookie("benedict-padding")!) ?? 200;
		if (direction !== 0) {
			padding = parseInt(window.getComputedStyle(this.player).paddingLeft)
				||
				parseInt(window.getComputedStyle(this.editor).paddingLeft);

			var elementWidth = (this.player.getBoundingClientRect().width
				||
				this.editor.getBoundingClientRect().width);
			var upperLimit = (elementWidth / 2) - 200;
			var lowerLimit = 0;
			padding += (direction * 100);
			padding = Math.min(upperLimit, Math.max(lowerLimit, padding));
		}
		setCookie("benedict-padding", padding.toString());
		this.editor.style.paddingLeft = padding + SCROLLBAR_WIDTH + "px";
		this.editor.style.paddingRight = padding + "px";
		this.player.style.paddingLeft = padding + "px";
		this.player.style.paddingRight = padding + "px";
		this.marker.style.left = padding + "px";
		this.marker.style.right = padding + "px";
	}

	editorChange(event: Event) {
		this.updateScript(this.editor.value);
	}

	updateScript(script: string | null = null): void {
		if (script != null) this.editor.value = script;
		this.position = 0;
		this.guessSize = 0;
		this.matcher.updateScript(this.editor.value);
	}


	updateTextSize(offset = 0) {
		var fontSizeIndex = parseInt(getCookie("benedict-fontSizeIndex")!);
		if (isNaN(fontSizeIndex)) {
			var fontSize = window.getComputedStyle(this.player).fontSize;
			fontSizeIndex = fontSizes.indexOf(fontSize);
		}
		if (fontSizeIndex < 0) fontSizeIndex = 3;
		fontSizeIndex += offset;
		if (fontSizeIndex < 0) fontSizeIndex = 0;
		if (fontSizeIndex >= fontSizes.length) fontSizeIndex = fontSizes.length - 1;
		setCookie("benedict-fontSizeIndex", fontSizeIndex.toString());
		var size = fontSizes[fontSizeIndex];
		this.player.style.fontSize = size;
		this.editor.style.fontSize = size;
		this.updateScroll();
	}

	updateSpeech(speech: string = ''): void {
		const WINDOW_SIZE = 50;
		var script = this.matcher.fancyText;
		var needle = speech.slice(-20);

		var index = this.matcher.match(needle, this.position, WINDOW_SIZE + this.guessSize);

		this.scriptStatusElement.innerText = `haystack: ${this.matcher.haystack}`;
		this.speechStatusElement.innerText = `needle: ${needle} position: ${this.position}, guessSize: ${this.guessSize}`;

		this.toolbar.updateStatus(speech.slice(-50));
		let hasAdvanced = index >= this.position;
		let goneRunaway = index > (this.position + this.guessSize + this.lookahead);
		if (hasAdvanced && !goneRunaway) {
			this.position = index;
			this.guessSize = 0;
		} else {
			this.guessSize += 4;
		}
		var matched = script.substring(0, this.position);
		var guessed = script.substring(this.position, this.position + this.guessSize);
		var lookaheadIndex = this.position + this.guessSize + this.lookahead;
		while (lookaheadIndex < script.length && script[lookaheadIndex] != ' ') lookaheadIndex++;
		var lookahead = script.substring(this.position + this.guessSize, lookaheadIndex)
		var remainder = script.substring(lookaheadIndex);
		const PADDING = '\n\n\n\n\n\n\n\n\n\n';
		let html = `${PADDING}<span class="matched">${matched}</span>`
			+ `<span class="guessed">${guessed}</span>`
			+ `<span class="lookahead">${lookahead}</span>`
			+ `<span class="remainder">${remainder}</span>${PADDING}`;
		this.player.innerHTML = html.replace(/\n/g, '<br />\n');
	}

	get #scrollDistance() {
		let markerRect = this.marker!.getBoundingClientRect();
		let guessRect = this.player.querySelector("span.guessed")?.getBoundingClientRect()
			?? { height: 0, top: 0, bottom: 0 };
		let distance = (this.vflip ? guessRect.bottom - guessRect.height - markerRect.bottom : guessRect.top + guessRect.height - markerRect.top);
		return (distance);
	}

	updateScroll() {
		let absDistance = Math.abs(this.#scrollDistance);
		if (absDistance > 1) {
			let scroll = (absDistance > 500 ? absDistance / 2 : absDistance / 10);
			let sign = Math.sign(this.#scrollDistance) * (this.vflip ? -1 : +1);
			this.player.scrollTop += sign * scroll;
		}
	}
}
