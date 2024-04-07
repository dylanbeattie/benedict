import Matcher from './matcher';

let div = document.querySelector("div#playback");
let matcher = new Matcher(div.innerText);
let input = document.querySelector("input");
input?.addEventListener("keyup", function() {
    var index = matcher.match(this.value.trim());
    console.log(index);
    var text = div.innerText;
    let html = `<span>${text.substring(0,index)}</span>${text.substring(index)}`;
    html = html.replace(/\n/g, '<br />\n');
    div.innerHTML = html;
});



