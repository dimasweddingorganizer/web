let state = {
    guests: 200,
    menuPrice: 55000,
    venuePrice: 5000000,
    decoPrice: 8000000,
    addons: { doc: 5000000, ent: 4000000 }
  };
  
  function openPage(p){
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    document.getElementById(p).classList.add('active');
  }
  
  function syncFromSlider(){
    const v = parseInt(document.getElementById('guestSlider').value);
    state.guests = v;
    document.getElementById('guestNumber').value = v;
    document.getElementById('guestValHeader').textContent = v;
  }
  
  function syncFromNumber(){
    let v = parseInt(document.getElementById('guestNumber').value) || 50;
    state.guests = v;
    document.getElementById('guestSlider').value = v;
    document.getElementById('guestValHeader').textContent = v;
  }
  
  function getTotal(){
    return state.guests * state.menuPrice
      + state.decoPrice
      + state.venuePrice
      + Object.values(state.addons).reduce((a,b)=>a+b,0);
  }
  
  function calculate(){
    const total = getTotal();
    document.getElementById('resultCard').innerHTML =
      "<h2>Total: Rp " + total.toLocaleString("id-ID") + "</h2>";
  }
  
  /* WA BUTTON (fix, tidak duplikat lagi) */
  function toggleWA(){
    const c = document.getElementById("waContacts");
    if(c) c.classList.toggle("open");
  }
  
  document.addEventListener("click", function(e){
    const wrap = document.querySelector(".wa-fab-wrap");
    if (wrap && !wrap.contains(e.target)) {
      const el = document.getElementById("waContacts");
      if(el) el.classList.remove("open");
    }
  });