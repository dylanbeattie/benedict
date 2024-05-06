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

export default class Prompter {
	editor: HTMLTextAreaElement;
	player: HTMLDivElement;
	matcher: Matcher;
	position: number = 0;
	guessSize: number = 0;
	lookahead: number = 100; // how many characters ahead of the current position should we look when deciding if a match is valid?
	toolbar: Toolbar;
	marker: HTMLHRElement;
	markerTop: number = 0;
	container: HTMLElement;
	vflip: boolean = false;
	speech: any;
	started: boolean = false;
	scrollInterval!: number;
	latestResult: string = '';

	constructor(container: HTMLElement, toolbar: Toolbar, speech: any) {
		this.container = container;
		this.player = container.querySelector("div#playback")!;
		this.editor = container.querySelector("textarea")!;
		this.marker = container.querySelector("hr")!;
		this.markerTop = position(this.marker).top;
		this.matcher = new Matcher(this.editor.value);
		this.editor.addEventListener("change", this.updateScript.bind(this));
		this.player.addEventListener("click", this.edit.bind(this));
		this.toolbar = toolbar;
		this.toolbar.prompter = this;
		this.speech = speech;
		speech.onspeechstart = this.onspeechstart.bind(this);
		speech.onnomatch = console.log;
		speech.onerror = (error: any) => {
			if (error.error == 'aborted') return;
			container.classList.add("speech-error");
			console.error("speech.onerror", error);
			speech.abort();
			window.setTimeout(() => {
				try {
					speech.start();
				} catch (error) {
					console.log(error);
				}
				container.classList.remove("speech-error");
			}, 200);
		}
		speech.onresult = this.onresult.bind(this);
		speech.onend = (event: any) => {
			console.log("speech.onend", event);
			container.classList.add("speech-ended");
			window.setTimeout(() => {
				try {
					speech.start();
				} catch (error) {
					console.log(error);
				}
				container.classList.remove("speech-ended");
			}, 200);
		}
		speech.start();
	}

	onspeechstart() {
		console.log('speech started!');
	}

	onresult(event: { results: SpeechRecognitionResultList }) {
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
		this.pad(0);
		this.updateTextSize(0);
		this.updateScript();
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

	updateScript(): void {
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
		var script = this.matcher.originalText;
		var index = this.matcher.match(speech, 20);
		this.toolbar.updateStatus(speech.slice(-50));
		let hasAdvanced = index >= this.position;
		let goneRunaway = index > (this.position + this.guessSize + this.lookahead);
		if (hasAdvanced && !goneRunaway) {
			this.position = index;
			this.guessSize = 0;
		} else {
			this.guessSize += 3;
		}
		var matched = script.substring(0, this.position);
		var guessed = script.substring(this.position, this.position + this.guessSize);
		var lookaheadIndex = this.position + this.guessSize + this.lookahead;
		while (script[lookaheadIndex] != ' ') lookaheadIndex++;
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
		let guessRect = this.player.querySelector("span.guessed")!.getBoundingClientRect();
		let distance = (this.vflip ? guessRect.bottom - guessRect.height - markerRect.bottom : guessRect.top + guessRect.height - markerRect.top);
		return (distance);
	}

	updateScroll() {
		let absDistance = Math.abs(this.#scrollDistance);
		if (absDistance > 2) {
			let log = Math.log(Math.abs(this.#scrollDistance));
			let scroll = (absDistance > 500 ? absDistance / 2 : (Math.pow(log, 2) / 2));
			let sign = Math.sign(this.#scrollDistance) * (this.vflip ? -1 : +1);
			this.player.scrollTop += sign * scroll;
		}
	}
}
