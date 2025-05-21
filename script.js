/* ---------- CONSTANTS ---------- */
const c = 299792458;                // m/s
const G = 6.674e-11;                // SI
const Mearth = 5.972e24;            // kg
const Rearth = 6.371e6;             // m

/* ---------- 1. TIME-DILATION SLIDER ---------- */
const vSlider = document.getElementById('speed');
const vLabel  = document.getElementById('vLabel');
const gammaOut= document.getElementById('gamma');
const dilOut  = document.getElementById('dilated');

function updateDilation(){
    const vFrac = parseFloat(vSlider.value);
    vLabel.textContent = vFrac.toFixed(2);
    const gamma = 1 / Math.sqrt(1 - vFrac*vFrac);
    gammaOut.textContent = gamma.toFixed(2);
    dilOut.textContent   = gamma.toFixed(2);
}
vSlider.addEventListener('input',updateDilation);
updateDilation();

/* ---------- 2. SPACESHIP CANVAS CLOCKS ---------- */
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');
let shipX = 20, t = 0;

function resizeCanvas(){
    canvas.width = canvas.clientWidth;
    canvas.height= canvas.clientHeight;
}
window.addEventListener('resize',resizeCanvas);
resizeCanvas();

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const vFrac = parseFloat(vSlider.value);
    const gamma = 1 / Math.sqrt(1 - vFrac*vFrac);
    // Earth clock (white)
    ctx.fillStyle="#fff"; ctx.font="16px monospace";
    ctx.fillText("Earth: "+formatTime(t),10,25);
    // Ship clock (blue, dilated)
    ctx.fillStyle="#00b4d8";
    ctx.fillText("Ship : "+formatTime(t/gamma),canvas.width-150,25);
    // Draw ship
    ctx.fillStyle="#00b4d8";
    ctx.fillRect(shipX, canvas.height/2 -10, 40,20);
    // Advance positions
    shipX += vFrac*4; // speed scaling
    if(shipX>canvas.width) shipX=-40;
    t += 0.02;
    requestAnimationFrame(draw);
}
function formatTime(s){return (s).toFixed(1)+" s";}
draw();

/* ---------- 3. GRAVITY SLIDER ---------- */
const hSlider=document.getElementById('height');
const hLabel=document.getElementById('hLabel');
const gFactor=document.getElementById('gFactor');

function updateGravity(){
    const h=parseFloat(hSlider.value)*1000;
    hLabel.textContent=(h/1000).toFixed(0);
    const factor=1+ G*Mearth/( (Rearth+h)*c*c );
    gFactor.textContent=((factor-1)*100).toFixed(2);
}
hSlider.addEventListener('input',updateGravity);
updateGravity();

/* ---------- 4. TRAIN & LIGHTNING ---------- */
const train=document.getElementById('train');
const boltL=document.getElementById('boltLeft');
const boltR=document.getElementById('boltRight');
const cap = document.getElementById('trainCaption');
const btn = document.getElementById('perspectiveBtn');
let groundView=true;

function animateTrain(){
    train.style.transition='left 8s linear';
    train.style.left='110%';
    setTimeout(()=>{train.style.transition='none';train.style.left='-320px';animateTrain();},8000);
}
animateTrain();

function flashBolts(delayLeft,delayRight){
    setTimeout(()=>{boltL.style.left="15%"; boltL.style.opacity=1; setTimeout(()=>boltL.style.opacity=0,300);},delayLeft);
    setTimeout(()=>{boltR.style.left="85%"; boltR.style.opacity=1; setTimeout(()=>boltR.style.opacity=0,300);},delayRight);
}
function cycleBolts(){
    const simultaneous = 2500; // when train center passes
    setInterval(()=>{
        if(groundView) flashBolts(simultaneous,simultaneous);
        else flashBolts(simultaneous-400,simultaneous+400);
    },4000);
}
cycleBolts();

btn.addEventListener('click',()=>{
    groundView=!groundView;
    btn.textContent = groundView? "Switch to Train's Perspective":"Switch to Ground Perspective";
    cap.textContent = groundView?
        "Ground observer: bolts hit simultaneously.":
        "Passenger: front bolt first, rear bolt later!";
});