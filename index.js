
console.clear();

const particle_count = 200;
const safe_distance = 70;
const max_speed = 0.5;
let particles = [];

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let width, height;

function resize(){
  width = canvas.width = document.body.clientWidth;
  height = canvas.height = document.body.clientHeight;
}
resize();

window.addEventListener("resize", resize);


class Particle{
  constructor(){
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = 2;
    this.color = "red";
    this.dx =  Math.random() * max_speed;
    this.dy = Math.random() * max_speed;
  }
  
  draw(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  
  update(){
    if(this.x+this.radius > width || this.x-this.radius < 0){
      this.dx = -this.dx;    
    }
    if(this.y+this.radius > height || this.y-this.radius < 0){
       this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
  }
}

function distance(x1, y1, x2, y2){
  var tempx = x1-x2;
  var tempy = y1-y2;
  return Math.sqrt(tempx*tempx + tempy*tempy);
}

function linkParticles(particle, otherParticles, ctx){
  for(const p of otherParticles){
    const d = distance(particle.x, particle.y, p.x, p.y);
    if(d > safe_distance){
       continue;
    }
    const opacity = 0.8 - (d/safe_distance) * 0.8;
    // const opacity = 0.5;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = particle.color;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(p.x, p.y);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function init(){
  particles = [];
    for(var i=0;i<particle_count;i++){
      particles.push(new Particle())
      particles[i].draw(ctx);
    }
}

function render(){
    requestAnimationFrame(render);
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(particle =>{
      particle.update();
      linkParticles(particle, particles, ctx);
      particle.draw(ctx);
    })
   
}
init();
render();


function audioPlay() {
    let sound = document.getElementById("audio");
    let div = document.getElementById("audioDiv")
    div.innerHTML = null;
    let img = document.createElement("img");
    img.src = "https://img.icons8.com/ios/50/fa314a/room-sound.png"
    img.onclick = () => {
        pause()
    }
    div.append(img)
    sound.play()
}

function pause() {
    let sound = document.getElementById("audio");
    let div = document.getElementById("audioDiv")
    div.innerHTML = null;
    let img = document.createElement("img");
    img.src = "https://img.icons8.com/ios/50/fa314a/mute.png"
    img.onclick = () => {
        audioPlay()
    }
    div.append(img)
    sound.pause()
}

let resultDiv = document.getElementById("resultsDiv");
let dummy = document.getElementById("dummy")
resultDiv.style.display = "none"
dummy.style.display = "none"

async function searchChar(name) {
    let res = await fetch(`https://www.superheroapi.com/api.php/4647868875320356/search/${name}`)
    let data = await res.json()
    // console.log(data.results);
    return data.results   
}

function appendResult(data) {
    resultDiv.innerHTML = null;
    data.forEach(({name,image, biography, connections}) => {
        let div = document.createElement("div")
        div.setAttribute('class', "info")

        let p = document.createElement('h4')
        p.innerHTML = name;

        let {url} = image

        let imgDiv = document.createElement("div")
        let img = document.createElement("img")
        img.setAttribute('class', 'imgDiv')
        img.src = url

        imgDiv.append(img)

        div.append(p, imgDiv)

        div.onclick = () => {
            showDetails(name, biography, image, connections)
            console.log("hello");
        }
        
        resultDiv.append(div)
    });   
}


let detailsDiv = document.createElement('div')

function showDetails(name, biography, image, connections) {
    let main_div = document.getElementById("container")
    main_div.style.display = "none"

    let div = document.createElement('div')
    let topDiv = document.createElement('div')
    let bottomDiv = document.createElement('div')
    let rightDiv = document.createElement("div")
    

    div.setAttribute("class", "detailsDiv")
    topDiv.setAttribute("class", "topDiv")
    bottomDiv.setAttribute("class", "btnDiv")

    rightDiv.setAttribute("class", "rightDiv")

    let imgDiv = document.createElement('div')

    let {url} = image;
    let img = document.createElement('img')
    img.setAttribute("class", "charImg")
    img.src = url;
    imgDiv.append(img)


    let h1 = document.createElement("h1")
    h1.innerHTML = name;
    let bio_div  = document.createElement('div')
    let bio_h2 = document.createElement('h2')
    bio_h2.innerHTML = "BIOGRAPHY"

    let dob = biography["place-of-birth"]
    let p_dob = document.createElement("p")
    p_dob.innerHTML = "D.O.B- " + dob;

    let f_name = biography["full-name"]
    let p_name = document.createElement("p")
    p_name.innerHTML = "Full-Name- "+ f_name

    let f_appe = biography["first-appearance"]
    let p_appe = document.createElement("p")
    p_appe.innerHTML = "First Appearance- " + f_appe
    bio_div.setAttribute("class", "bio_div")
    bio_div.append(bio_h2, p_dob, p_name, p_appe)

    let g_a = connections["group-affiliation"]
    let conn_div = document.createElement('div')

    conn_div.setAttribute("class", "conn_div")
    let conn_h2 = document.createElement('h2')
    conn_h2.innerHTML = "CONNECTION"
    let p_affi = document.createElement("p")
    p_affi.innerHTML ="Group Affiliation- "+ g_a

    conn_div.append(conn_h2, p_affi)

    let btn = document.createElement("button")
    btn.setAttribute("class", "btn")
    btn.innerText = "Back"
    rightDiv.append(bio_div, conn_div)
    topDiv.append(imgDiv, rightDiv)
    bottomDiv.append(btn)
    div.append(topDiv, bottomDiv)

    detailsDiv.append(div)
    btn.onclick = () => {
        main_div.style.display = "block"
        detailsDiv.innerHTML = ""
        document.getElementById("query").value = ""
        resultDiv.style.display = "none"
        dummy.style.display = "none"

    }
    document.body.append(detailsDiv)    
}

async function main() {
    let name = document.getElementById("query").value
    if(name.length < 3){
        return false
    }
    let results = await searchChar(name)
    console.log(results);
    if(results === undefined){
        return false
    }
    resultDiv.style.display = "block";
    dummy.style.display = "block";
    appendResult(results)
}

let timerId

function debounce(func, delay) {
    let name = document.getElementById("query").value
    if(name.length == 0){
        resultDiv.style.display = "none"
        dummy.style.display ="none"
    }

    if(name.length < 3){
        return false;
    }

    if(timerId){
        clearTimeout(timerId)
    }

    timerId = setTimeout(()=>{
        func()
    }, delay)
    
}
