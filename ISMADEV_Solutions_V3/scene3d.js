/** ISMADEV Solutions — escena 3D original.
 * Three.js: geometría, materiales, iluminación, cámara y animación.
 * Sin React ni Blender. Escena 3D real (no fotografías animadas).
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const canvas=document.querySelector('#scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.65;
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x253a66);
scene.fog=new THREE.FogExp2(0x253a66,.016);
const camera=new THREE.PerspectiveCamera(42,1,.1,400);
const ambient=new THREE.HemisphereLight(0xdde9ff,0x5966a0,3.0);scene.add(ambient);
const sun=new THREE.DirectionalLight(0xfff0dd,4.2);sun.position.set(-25,45,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-65;sun.shadow.camera.right=65;sun.shadow.camera.top=65;sun.shadow.camera.bottom=-65;scene.add(sun);
const accent=new THREE.PointLight(0x8b5cf6,85,45);accent.position.set(1,10,10);scene.add(accent);
const mat=(color,metalness=0,roughness=.7)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
const palette={street:mat(0x283c61),sidewalk:mat(0x8498c0),walls:[mat(0x627bb0),mat(0x6867a3),mat(0x8086b6),mat(0x5376a8)],glass:mat(0xb7ddff,.25,.18),frame:mat(0x344e80),purple:mat(0x9667ed,.2,.32),pink:mat(0xe9a4dc),green:mat(0x4d8d80),wood:mat(0x9a6673),gold:mat(0xffd98c,.15,.35),white:mat(0xe6eaff)};
const boxGeo=new THREE.BoxGeometry(1,1,1);
function cube(parent,w,h,d,x,y,z,material,shadow=true){const o=new THREE.Mesh(boxGeo,material);o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=shadow;o.receiveShadow=true;parent.add(o);return o}
function cylinder(parent,r1,r2,h,x,y,z,material){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,10),material);o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o}
function textTexture(text,fg='#ffffff',bg='#26254b',font='bold 72px Arial'){const c=document.createElement('canvas');c.width=1024;c.height=256;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,c.width,c.height);g.fillStyle=fg;g.font=font;g.textAlign='center';g.textBaseline='middle';g.fillText(text,512,128);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex}
function sign(parent,text,w,h,x,y,z){const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:textTexture(text),side:THREE.DoubleSide}));mesh.position.set(x,y,z);parent.add(mesh);return mesh}
// Mundo: una calle comercial con edificios volumétricos.
const world=new THREE.Group();scene.add(world);
cube(world,180,.3,180,0,-.22,0,mat(0x33466e),false);
cube(world,14,.08,150,0,-.02,0,palette.street,false);
for(const side of [-1,1]){cube(world,11,.28,150,side*12.5,.06,0,palette.sidewalk,false);cube(world,.17,.03,150,side*7.2,.015,0,palette.gold,false)}
function building(x,z,w,h,d,index){const b=new THREE.Group();world.add(b);cube(b,w,h,d,x,h/2,z,palette.walls[index%4]);cube(b,w+.7,.55,d+.7,x,h+.2,z,palette.frame);const front=z+(d/2+.035);for(let y=2.7;y<h-1.2;y+=3.2){for(let xx=x-w/2+1.5;xx<x+w/2-1;xx+=2.7){cube(b,1.45,1.8,.13,xx,y,front,palette.glass,false);cube(b,1.65,.1,.2,xx,y+.95,front+.06,palette.frame,false)}}return b}
for(let i=0;i<9;i++){const z=-57+i*14;building(-21,z,12,11+(i*7)%13,9,i);building(21,z,12,13+(i*5)%13,9,i+2)}
// Tienda central: geometría real, toldo, cristales y rótulo.
const shop=new THREE.Group();shop.position.set(-13,0,10);world.add(shop);
cube(shop,13,8,10,0,4,0,mat(0x575b8e));cube(shop,14,.6,11,0,8.15,0,palette.frame);
cube(shop,11,4,.18,0,2.3,5.1,palette.glass);cube(shop,.4,4,.35,0,2.3,5.26,palette.frame);
cube(shop,12,1.4,2.2,0,5.35,5.8,palette.purple);for(let i=0;i<6;i++)cube(shop,1.9,1.45,2.24,-4.95+i*1.98,5.35,5.85,i%2?palette.white:palette.pink);
sign(shop,'TU NEGOCIO',11,1.7,0,7,5.07);
// Árboles con tronco y copa 3D.
function tree(x,z){const g=new THREE.Group();world.add(g);cylinder(g,.24,.35,3,x,1.5,z,palette.wood);const foliage=new THREE.Mesh(new THREE.IcosahedronGeometry(2.2,1),palette.green);foliage.position.set(x,4.25,z);foliage.castShadow=true;g.add(foliage)}
for(const z of [-45,-22,0,25,48]){tree(-8.8,z);tree(8.8,z)}
// Farolas tridimensionales y líneas viales para dar escala y profundidad.
const roadMarkings = mat(0xf5dcaa, 0, 0.6);
for (let z = -65; z < 65; z += 11) {
  cube(world, 0.24, 0.025, 4.5, 0, 0.055, z, roadMarkings, false);
}
const lampGlow = new THREE.MeshBasicMaterial({ color: 0xffd6a2 });
for (const side of [-1, 1]) {
  for (let z = -50; z < 60; z += 22) {
    const lamp = new THREE.Group();
    world.add(lamp);
    cylinder(lamp, 0.09, 0.14, 6.8, side * 8.4, 3.4, z, palette.frame);
    cube(lamp, 1.8, 0.13, 0.13, side * 7.65, 6.75, z, palette.frame);
    cube(lamp, 0.75, 0.18, 0.55, side * 6.9, 6.63, z, lampGlow, false);
  }
}
// Un segundo dispositivo 3D: teléfono con pantalla y marco.
const phone = new THREE.Group();
scene.add(phone);
phone.position.set(9, -8, 7);
cube(phone, 3.4, 6.4, 0.5, 0, 3.3, 0, palette.frame);
cube(phone, 3.05, 5.7, 0.08, 0, 3.3, 0.3, mat(0x6954bc, 0.15, 0.25));
sign(phone, 'TU MARCA', 2.8, 0.8, 0, 4.5, 0.36);
// Ordenador 3D emergente.
const computer=new THREE.Group();computer.position.set(0,-7,4);scene.add(computer);
cube(computer,13,8,.7,0,7,0,palette.frame);cube(computer,11.9,6.9,.12,0,7,.43,mat(0x29396d,.2,.3));cube(computer,4,1,.7,0,2.3,0,palette.frame);cube(computer,8,.4,4,0,1.5,1,palette.frame);
const display=new THREE.Mesh(new THREE.PlaneGeometry(11.4,6.4),new THREE.MeshBasicMaterial({map:textTexture('TU WEB PROFESIONAL','#ffffff','#34317b','bold 64px Arial')}));display.position.set(0,7,.52);computer.add(display);
// Cubo 3D de marca.
const logo=new THREE.Group();scene.add(logo);logo.position.set(0,0,0);const core=cube(logo,4,4,4,0,0,0,palette.purple);const edges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4.15,4.15,4.15)),new THREE.LineBasicMaterial({color:0xc7b4ff}));logo.add(edges);
const sparkle=[];for(let i=0;i<35;i++){const p=new THREE.Mesh(new THREE.OctahedronGeometry(.12+(i%4)*.05),new THREE.MeshBasicMaterial({color:i%2?0x9e7aff:0x7bb4ff}));p.position.set((Math.sin(i*12.3))*19,3+(i*7)%16,(Math.cos(i*8.7))*19);scene.add(p);sparkle.push(p)}
const captions=[
{at:0,end:5.5,chapter:'01 / UNA NUEVA PERSPECTIVA',html:'<small>ISMADEV SOLUTIONS</small><h1>Tu negocio merece<br><em>destacar.</em></h1><p>Una presencia digital que abre puertas.</p>'},
{at:5.5,end:11,chapter:'02 / TU NEGOCIO',html:'<small>UNA IDEA, MUCHAS POSIBILIDADES</small><h1>Haz crecer tu<br><em>presencia digital.</em></h1><p>Diseño web adaptado a tu negocio.</p>'},
{at:11,end:17,chapter:'03 / TU PÁGINA WEB',html:'<small>DISEÑO Y DESARROLLO WEB</small><h1>Tu web cobra<br><em>vida en 3D.</em></h1><p>Moderna, adaptable y personalizada.</p>'},
{at:17,end:23,chapter:'04 / ISMADEV SOLUTIONS',html:'<small>PRECIOS DESDE</small><h1>650 € <em>+ IVA</em></h1><p>O 45 €/mes + IVA · permanencia de 12 meses.</p>'},
{at:23,end:28,chapter:'05 / HABLEMOS',html:'<small>ISMADEV SOLUTIONS</small><h1>Tu próxima web<br><em>empieza aquí.</em></h1><p>Diseño y desarrollo web para toda España.</p>'}
];
const duration=28;let elapsed=0,playing=true,previous=performance.now(),currentCaption=-1;
const caption=document.querySelector('#caption'),chapter=document.querySelector('#chapter'),bar=document.querySelector('#bar');
const play=document.querySelector('#play');
function smooth(a,b,t){const u=THREE.MathUtils.clamp((t-a)/(b-a),0,1);return u*u*(3-2*u)}
function lerpVec(a,b,t){return new THREE.Vector3(...a).lerp(new THREE.Vector3(...b),t)}
function animate(t){const a=smooth(0,6,t),b=smooth(6,12,t),c=smooth(12,18,t),d=smooth(18,23,t);
 let pos,target;
 if(t<6){pos=lerpVec([34,27,64],[17,15,35],a);target=lerpVec([0,4,-10],[-12,5,9],a)}
 else if(t<12){pos=lerpVec([17,15,35],[-1,10,24],b);target=lerpVec([-12,5,9],[-13,4,10],b)}
 else if(t<18){pos=lerpVec([-1,10,24],[5,7,28],c);target=lerpVec([-13,4,10],[0,7,4],c)}
 else{pos=lerpVec([5,7,28],[14,9,32],d);target=lerpVec([0,7,4],[0,5,4],d)}
 camera.position.copy(pos);camera.lookAt(target);
 shop.position.y=(t>5&&t<12)?Math.sin((t-5)/7*Math.PI)*.25:0;
 computer.position.y=-9+smooth(11,14,t)*9;
 computer.rotation.y=.16*Math.sin(t*.65);
 logo.visible=t>=17;logo.position.set(0,7,4);logo.rotation.set(t*.18,t*.6,t*.08);logo.scale.setScalar(t<17?0:1.3*smooth(17,19,t));
 computer.visible=t>=11&&t<17.3;
 phone.visible=t>=11&&t<17.3;
 phone.position.y=-8+smooth(12,15,t)*8;
 phone.rotation.y=-.18+Math.sin(t*.7)*.08;
 for(let i=0;i<sparkle.length;i++){sparkle[i].rotation.y=t*.8+i;sparkle[i].position.y+=Math.sin(t*.5+i)*.001}
 const idx=captions.findIndex(x=>t>=x.at&&t<x.end);if(idx!==currentCaption&&idx>=0){currentCaption=idx;caption.classList.add('hide');setTimeout(()=>{if(currentCaption!==idx)return;caption.innerHTML=captions[idx].html;chapter.textContent=captions[idx].chapter;caption.classList.remove('hide')},180)}
 bar.style.width=`${(t/duration)*100}%`;
}
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
window.addEventListener('resize',resize);resize();
function frame(now){const dt=Math.min((now-previous)/1000,.1);previous=now;if(playing){elapsed+=dt;if(elapsed>=duration)elapsed=0}animate(elapsed);renderer.render(scene,camera);requestAnimationFrame(frame)}
requestAnimationFrame(frame);
play.addEventListener('click',()=>{playing=!playing;play.textContent=playing?'❚❚ Pausar':'▶ Reproducir';play.setAttribute('aria-label',playing?'Pausar animación':'Reproducir animación')});
document.querySelector('#restart').addEventListener('click',()=>{elapsed=0;playing=true;play.textContent='❚❚ Pausar';currentCaption=-1;caption.innerHTML=captions[0].html;chapter.textContent=captions[0].chapter});
