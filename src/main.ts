import Adder from './adder';

let adder = new Adder(5);
let h1 = document.querySelector("h1");
h1.innerHTML = adder.add(5).toString();


