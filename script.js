const colors = [
  "beige","brown","dkgrey","lime","ltgrey",
  "orange","pink","purple","red","royal","teal","yellow"
];

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]]=[a[j],a[i]];
  }
  return a;
}

function randomBunnies() {
  const shuffledColors = shuffle([...colors]);
  const arr = [];
  for(let h=1; h<=6; h++) {
    arr.push({height: h, file:`stimuli/h${h}_${shuffledColors[h-1]}.jpg`});
  }
  return shuffle(arr);
}

function isSorted() {
  for(let i=1;i<state.length;i++) {
    if(state[i-1].height>state[i].height) return false;
  }
  return true;
}

let state = randomBunnies();
let selected = [];
let animating = false;
const container = document.getElementById("bunnies");

function render() {
  container.innerHTML = "";

  state.forEach((b,i)=>{
    const div = document.createElement("div");
    div.className="bunny";
    if(selected.includes(i)) div.classList.add("selected");

    div.onclick = ()=>{
      if(animating) return;
      if(selected.includes(i)) selected = selected.filter(x=>x!==i);
      else if(selected.length<2) selected.push(i);
      render();
    };

    const img = document.createElement("img");
    img.src=b.file;

    const check = document.createElement("div");
    check.className="check";

    div.appendChild(img);
    div.appendChild(check);
    container.appendChild(div);
  });
}

function swapAnim(a,b) {
  animating=true;
  const divs = container.children;
  const posA=divs[a].offsetLeft;
  const posB=divs[b].offsetLeft;

  divs[a].style.transition="transform 0.5s";
  divs[b].style.transition="transform 0.5s";

  divs[a].style.transform=`translateX(${posB-posA}px) translateY(-20px)`;
  divs[b].style.transform=`translateX(${posA-posB}px) translateY(-20px)`;

  setTimeout(()=>{
    [state[a],state[b]]=[state[b],state[a]];
    selected=[];
    render();
    animating=false;

    if(isSorted()){
      setTimeout(()=>{
        document.getElementById("curtain").classList.add("open");
      },400);
    }
  },500);
}

let compareCount = 0;
const maxCompare = 15;
const compareRow = document.getElementById("compareRow");

// előre létrehozunk 15 boxot
for (let i = 0; i < maxCompare; i++) {
  const box = document.createElement("div");
  box.className = "compareBox";
  compareRow.appendChild(box);
}

function markCompare() {
  if (compareCount < maxCompare) {
    compareRow.children[compareCount-1].classList.add("active");
  }

  // ha elfogyott a 15 jelzés, függöny fel
  if (compareCount >= maxCompare) {
    document.getElementById("curtain").classList.add("open");
  }
}

document.getElementById("compareBtn").onclick=()=>{
  if(selected.length!==2 || animating) return;
  compareCount++;
  document.getElementById("curtain").textContent = `Összehasonlítások: ${compareCount}`;
  let [a, b] = selected;
  if (a > b) [a, b] = [b, a];
  if(state[a].height > state[b].height){
    swapAnim(a,b);
  } else {
    selected=[];
    render();
  }
  markCompare();
};

document.getElementById("revealBtn").onclick=()=>{
  document.getElementById("curtain").classList.add("open");
};

render();
