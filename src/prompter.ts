import Toolbar from './toolbar';
import Matcher from './matcher';
import { getCookie, setCookie } from './cookies';

const fontSizes = ["18px", "24px", "32px", "48px", "64px", "80px", "96px", "128px", "144px", "192px"];

function position(el: HTMLElement) {
	const { top, left } = el.getBoundingClientRect();
	const { marginTop, marginLeft } = getComputedStyle(el);
	return {
		top: top - parseInt(marginTop, 10),
		left: left - parseInt(marginLeft, 10)
	};
}

const FPS = 50;

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
	recog: any;
	started: boolean = false;
	scrollInterval!: number;

	constructor(container: HTMLElement, toolbar: Toolbar, recog: any) {
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
		this.recog = recog;
		recog.onspeechstart = this.onspeechstart.bind(this);
		recog.onnomatch = console.log;
		recog.onerror = (error: any) => {
			if (error.error == 'aborted') return;
			if (error.error == 'no-speech') return;
			container.classList.add("speech-error");
			console.error("speech.onerror", error);
			recog.abort();
			window.setTimeout(() => {
				try {
					recog.start();
				} catch (error) {
					console.log(error);
				}
				container.classList.remove("speech-error");
			}, 200);
		}
		recog.onresult = this.onresult.bind(this);
		recog.onend = (event: any) => {
			container.classList.add("speech-ended");
			recog.abort();
			window.setTimeout(() => {
				try {
					recog.start();
				} catch (error) {
					console.log(error);
				}
				container.classList.remove("speech-ended");
			}, 200);
		}
		recog.start();
	}

	onspeechstart() {
		console.log('speech started!');
	}

	previousSpeechResult: string = '';
	filteredSpeechResult: string = '';
	commandMode: boolean = false;

	onresult(event: { results: SpeechRecognitionResultList }) {
		let latestResult = Array.from(event.results).map(r => r[0].transcript).join(' ').replace(/ +/g, ' ');
		let hasSpeechActuallyChanged = this.previousSpeechResult != latestResult;
		if (hasSpeechActuallyChanged) {
			let newWords = latestResult.substring(this.previousSpeechResult.length);
			// if (/benedict/i.test(newWords)) debugger;
			console.log("New Words: " + newWords);
			let matches = /ben(?:ed(?:ict(?:\s+(\w+))?)?)?$/i.exec(newWords);
			if (matches) {
				if (matches[1] && this.runCommand(matches[1])) {
					this.previousSpeechResult = latestResult;
					this.updateSpeech();
				}
			} else {
				this.filteredSpeechResult += newWords;
				this.previousSpeechResult = latestResult;
				this.updateSpeech();
			}
		}
	}

	runCommand(command: string): boolean {
		console.log(`Running ${command}`);
		switch (command) {
			case "screen": this.toggleFullscreen(); return (true);
			case "restart": this.rewind(/\n/); return true;
			case "back": this.rewind(/[\.\?\!]/); return true;
			case "bigger": this.updateTextSize(+1); return true;
			case "smaller": this.updateTextSize(-1); return true;
			case "wider": this.pad(-1); return true;
			case "narrower": this.pad(+1); return true;
			case "up": this.moveLine(-1); return true;
			case "down": this.moveLine(+1); return true;
			case "reset": this.reset(); return true;
			case "go": this.reset(); this.play(); return true;
			case "flip": this.flip("vflip"); return true;
			case "mirror": this.flip("hflip"); return true;
		}
		return false;
	}

	toggleFullscreen() {
		if (document.fullscreenElement !== null) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
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
		this.updateSpeech();
		localStorage.setItem("benedict-script", this.editor.value);
		this.started = true;
		this.player.style.display = "block";
		this.editor.style.display = "none";
		this.scrollInterval = window.setInterval(this.updateScroll.bind(this), 1000 / FPS);
	}

	reset() {
		this.container.classList.add("reset-flash");
		this.recog.abort();
		window.setTimeout((() => {
			this.position = 0;
			this.guessSize = 0;
			this.updateScript();
			this.updateSpeech();
			this.updateScroll();
			window.setTimeout((() => {
				this.container.classList.remove("reset-flash");
				this.recog.start()
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

	rewind(regexp: RegExp) {
		var script = this.matcher.fancyText;
		console.log(script);
		var index = this.position - 5;
		while (index > 0 && !regexp.test(script[index])) index--;
		var fancyText = script.substring(0, index);
		console.log(fancyText);
		var plainText = fancyText.replace(/\W+/g, ' ').toLowerCase()
		console.log(plainText);
		this.guessSize = 0;
		this.position = index;
		this.filteredSpeechResult = plainText;
	}

	updateSpeech(allowGuess: boolean = true): void {
		var speech = this.filteredSpeechResult;
		const WINDOW_SIZE = 50;
		var script = this.matcher.fancyText;
		var needle = speech.slice(-20);

		var index = this.matcher.match(needle, this.position, WINDOW_SIZE + this.guessSize);

		this.scriptStatusElement.innerText = `haystack: ${this.matcher.haystack}`;
		this.toolbar.updateStatus(speech.slice(-50));
		let hasAdvanced = index >= this.position;
		let goneRunaway = index > (this.position + this.guessSize + this.lookahead);
		if (hasAdvanced && !goneRunaway) {
			this.position = index;
			this.guessSize = 0;
		} else {
			if (allowGuess) this.guessSize += 4;
		}
		this.speechStatusElement.innerText = `index: ${index}, position: ${this.position}, guessSize: ${this.guessSize}, needle: '${needle}', `;
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
