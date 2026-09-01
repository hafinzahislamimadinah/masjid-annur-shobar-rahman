const CONFIG = {
  mosque: "Masjid Annur Shobar Rahman",
  fallbackLat: -6.3970,
  fallbackLon: 106.9550,
  fallbackLabel: "Ciangsana, Jawa Barat",
  method: 20, // Kementerian Agama Republik Indonesia
  school: 0,
  api: "https://api.aladhan.com/v1/timings"
};

const PRAYERS = [
  ["Fajr","Subuh"],["Dhuhr","Dzuhur"],["Asr","Ashar"],["Maghrib","Maghrib"],["Isha","Isya"]
];

let state = { lat: null, lon: null, label: "", timings: null, next: null };

const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2,"0");

function showToast(msg){
  const t=$("toast"); t.textContent=msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),3200);
}

function updateClock(){
  const now=new Date();
  $("clock").textContent=`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  $("dateLine").textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(now);
}
setInterval(updateClock,1000); updateClock();

function getCoords(){
  return new Promise(resolve=>{
    if(!navigator.geolocation){
      resolve({lat:CONFIG.fallbackLat,lon:CONFIG.fallbackLon,label:CONFIG.fallbackLabel,fallback:true}); return;
    }
    navigator.geolocation.getCurrentPosition(
      p=>resolve({lat:p.coords.latitude,lon:p.coords.longitude,label:"Lokasi perangkat",fallback:false}),
      ()=>resolve({lat:CONFIG.fallbackLat,lon:CONFIG.fallbackLon,label:CONFIG.fallbackLabel,fallback:true}),
      {enableHighAccuracy:true,timeout:10000,maximumAge:300000}
    );
  });
}

async function loadPrayerTimes(force=false){
  $("connectionDot").style.background="#f0b429";
  try{
    const c=force ? await getCoords() : await getCoords();
    state.lat=c.lat; state.lon=c.lon; state.label=c.label;
    $("locationLabel").textContent=c.fallback ? "Mode lokasi masjid" : "Lokasi perangkat aktif";
    $("locationTitle").textContent=c.fallback ? "Ciangsana, Jawa Barat" : "Lokasi perangkat";
    $("locationDetail").textContent=`Koordinat: ${c.lat.toFixed(5)}, ${c.lon.toFixed(5)} • Zona waktu perangkat`;
    const date=new Date();
    const dd=`${date.getDate().toString().padStart(2,"0")}-${(date.getMonth()+1).toString().padStart(2,"0")}-${date.getFullYear()}`;
    const url=`${CONFIG.api}/${dd}?latitude=${c.lat}&longitude=${c.lon}&method=${CONFIG.method}&school=${CONFIG.school}`;
    const res=await fetch(url);
    if(!res.ok) throw new Error("API error");
    const json=await res.json();
    state.timings=json.data.timings;
    $("hijriLine").textContent=`${json.data.date.hijri.day} ${json.data.date.hijri.month.en} ${json.data.date.hijri.year} H`;
    renderPrayers();
    $("connectionDot").style.background="#20a66b";
    showToast(c.fallback ? "Lokasi perangkat tidak tersedia. Menggunakan Ciangsana sebagai cadangan." : "Jadwal diperbarui berdasarkan lokasi perangkat.");
  }catch(err){
    $("connectionDot").style.background="#d95757";
    $("prayerGrid").innerHTML=`<div class="loading">Jadwal belum dapat dimuat. Periksa koneksi internet lalu tekan ↻.</div>`;
    showToast("Gagal mengambil jadwal salat.");
  }
}

function parseTime(value){
  const m=String(value).match(/(\d{1,2}):(\d{2})/);
  if(!m) return null;
  const d=new Date();
  d.setHours(+m[1],+m[2],0,0);
  return d;
}

function renderPrayers(){
  const grid=$("prayerGrid");
  grid.innerHTML=PRAYERS.map(([api,name])=>`
    <div class="prayer" data-prayer="${api}">
      <div class="pname">${name}</div>
      <div class="ptime">${String(state.timings[api]).slice(0,5)}</div>
    </div>`).join("");
  updateNext();
}

function updateNext(){
  if(!state.timings) return;
  const now=new Date();
  const list=PRAYERS.map(([api,name])=>({api,name,time:parseTime(state.timings[api])})).filter(x=>x.time);
  let next=list.find(x=>x.time>now);
  if(!next){
    next=list[0];
    next={...next,time:new Date(next.time.getTime()+86400000)};
  }
  state.next=next;
  $("nextPrayer").textContent=next.name;
  $("nextPrayerTime").textContent=`Pukul ${String(state.timings[next.api]).slice(0,5)}`;
  document.querySelectorAll(".prayer").forEach(el=>el.classList.toggle("active",el.dataset.prayer===next.api));
}

function tickCountdown(){
  if(!state.next) return;
  const now=new Date(), diff=Math.max(0,state.next.time-now);
  const h=Math.floor(diff/3600000), m=Math.floor(diff%3600000/60000), s=Math.floor(diff%60000/1000);
  $("countdown").textContent=`${pad(h)}:${pad(m)}:${pad(s)}`;
  if(diff<1000) setTimeout(()=>loadPrayerTimes(true),1200);
}
setInterval(tickCountdown,1000);

$("refreshBtn").addEventListener("click",()=>loadPrayerTimes(true));
$("locationBtn").addEventListener("click",()=>loadPrayerTimes(true));

loadPrayerTimes();
