import { Toolbar } from './Toolbar';
import Matcher from './matcher';
import { fontSizes } from './main';

function position(el: HTMLElement) {
	const { top, left } = el.getBoundingClientRect();
	const { marginTop, marginLeft } = getComputedStyle(el);
	return {
		top: top - parseInt(marginTop, 10),
		left: left - parseInt(marginLeft, 10)
	};
}
export class Prompter {
	editor: HTMLTextAreaElement;
	player: HTMLDivElement;
	matcher: Matcher;
	position: number = 0;
	guessSize: number = 0;
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
			console.log(error);
			speech.abort();
			window.setTimeout(() => speech.start(), 100);
		}
		speech.onresult = this.onresult.bind(this);
		speech.start();
	}

	onspeechstart() {
		console.log('speech started!');
	}

	onresult(event: { results: SpeechRecognitionResultList }) {
		let result = Array.from(event.results).map(r => r[0].transcript).join(' ').replace(/ +/g, ' ');
		if (this.latestResult == result) return;
		this.latestResult = result;
		let [ filteredSpeech, update ] = this.filterAndApplyCommands(result);
		if (update) this.updateSpeech(filteredSpeech);
	}

	filterAndApplyCommands(speech: string) : [result: string, update: boolean] {
		let update = true;
		let lastTwoWords = speech.toLowerCase().split(' ').slice(-2);
		if (lastTwoWords.length == 2 && lastTwoWords[0] == "benedict") {
			update = false;
			switch(lastTwoWords[1]) {
				case "bigger": this.updateTextSize(+1); break;
				case "smaller": this.updateTextSize(-1); break;
				case "wider": this.pad(-1); break;
				case "narrower": this.pad(+1); break;
				case "up": this.moveLine(-1); break;
				case "down": this.moveLine(+1); break;
				case "reset": this.reset(); break;
				case "go": this.reset(); this.play(); break;
			}
		}
		let filteredSpeech = speech.replace(/ benedict \w+/g, ' ').replace(/ benedict$/, '');
		return [ filteredSpeech, update ];
	}

	init() {
		this.pad(0);
		this.updateScript();
		this.updateSpeech();
	}

	edit() {
		window.clearInterval(this.scrollInterval);
		this.started = false;
		this.player.style.display = "none";
		this.editor.style.display = "block";
		this.editor.value = this.player.innerText;
		this.editor.selectionStart = this.position + this.guessSize;
		this.editor.focus();
	}

	play() {
		this.updateScript();
		this.started = true;
		this.player.style.display = "block";
		this.editor.style.display = "none";
		this.scrollInterval = window.setInterval(this.updateScroll.bind(this), 1000 / 50);
	}

	reset() {
		this.speech.abort();
		window.setTimeout((() => {
			this.position = 0;
			this.guessSize = 0;
			this.updateScript();
			this.updateSpeech('');
			this.updateScroll();
			this.speech.start();
		}).bind(this), 100);
	}

	flip = (className: string) => {
		console.log(this.container.classList);
		this.vflip = this.container.classList.toggle(className);
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
		let padding = 200;
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
		var fontSize = window.getComputedStyle(this.player).fontSize;
		var index = fontSizes.indexOf(fontSize);
		if (index < 0) index = 3;
		index += offset;
		if (index < 0) index = 0;
		if (index >= fontSizes.length) index = fontSizes.length - 1;
		var size = fontSizes[index];
		this.player.style.fontSize = size;
		this.editor.style.fontSize = size;
		this.updateScroll();
	}

	updateSpeech(speech: string = ''): void {
		var script = this.matcher.originalText;
		console.log(script);
		console.log(speech);
		var index = this.matcher.match(speech, 20);
		this.toolbar.updateStatus(speech.slice(-50));
		if (index >= this.position) {
			this.position = index;
			this.guessSize = 0;
		} else {
			this.guessSize += 3;
		}
		var matched = script.substring(0, this.position);
		var guessed = script.substring(this.position, this.position + this.guessSize);
		var remainder = script.substring(this.position + this.guessSize);
		const PADDING = '\n\n\n\n\n\n\n\n\n\n';
		let html = `${PADDING}<span class="matched">${matched}</span><span class="guessed">${guessed}</span>${remainder}${PADDING}`;
		this.player.innerHTML = html.replace(/\n/g, '<br />\n');
	}

	get #scrollDistance() {
		let markerRect = this.marker!.getBoundingClientRect();
		let guessRect = this.player.querySelector("span.guessed")!.getBoundingClientRect();
		let distance = (this.vflip ? guessRect.bottom - guessRect.height - markerRect.bottom : guessRect.top + guessRect.height - markerRect.top);
		return (distance);
	}

	updateScroll() {
		if (Math.abs(this.#scrollDistance) > 2) {
			let log = Math.log(Math.abs(this.#scrollDistance));
			let scroll = Math.pow(log, 2)/2;
			let sign = Math.sign(this.#scrollDistance) * (this.vflip ? -1 : +1);
			this.player.scrollTop += sign * scroll;
		}
	}
}
