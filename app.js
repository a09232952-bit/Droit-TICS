const $=id=>document.getElementById(id);
let list=[],i=0,score=0,wrong=[];
const themes=[...new Set(QUESTIONS.map(q=>q[0]))];
$("theme").innerHTML=`<option value="">Tous les thèmes (${QUESTIONS.length} questions)</option>`+
  themes.map(t=>`<option>${t} (${QUESTIONS.filter(q=>q[0]===t).length})</option>`).join("");
const show=id=>["home","game","end"].forEach(s=>$(s).hidden=s!==id);
const shuf=a=>{for(let k=a.length-1;k>0;k--){const j=Math.random()*(k+1)|0;[a[k],a[j]]=[a[j],a[k]]}return a};
function availableQuestions(){
  const t=$("theme").value.replace(/ \(\d+\)$/,"");
  return QUESTIONS.filter(q=>!t||q[0]===t);
}
function updateQuestionLimit(){
  const total=availableQuestions().length;
  const input=$("questionCount");
  input.max=total;
  input.value=Math.min(Math.max(Number(input.value)||1,1),total);
  $("questionLimit").textContent=`Maximum disponible : ${total}`;
}

function start(){
  list=availableQuestions().map(q=>q.slice());
  if($("shuffle").checked)shuf(list);
  const count=Math.min(Math.max(Number($("questionCount").value)||1,1),list.length);
  list=list.slice(0,count);
  $("questionCount").value=count;
  i=0;score=0;wrong=[];show("game");render();
}
function render(){
  const [th,q,opts,ans]=list[i];
  $("count").textContent=`Question ${i+1}/${list.length}`;
  $("score").textContent=`Score : ${score}`;
  $("progress").style.width=(i/list.length*100)+"%";
  $("tag").textContent=th;$("question").textContent=q;
  $("explain").hidden=$("next").hidden=true;
  $("options").innerHTML="";
  const order=shuf(opts.map((o,k)=>k));
  order.forEach(k=>{
    const b=document.createElement("button");
    b.className="opt";b.textContent=opts[k];
    b.onclick=()=>answer(k,order);
    b.dataset.k=k;$("options").appendChild(b);
  });
}
function answer(k){
  const [,q,opts,ans,exp]=list[i];
  const good=k===ans;
  if(good)score++;else wrong.push([q,opts[ans],exp]);
  document.querySelectorAll(".opt").forEach(b=>{
    b.disabled=true;
    if(+b.dataset.k===ans)b.classList.add("ok");
    else if(+b.dataset.k===k)b.classList.add("ko");
  });
  $("score").textContent=`Score : ${score}`;
  $("explain").innerHTML=`<b>${good?"✅ Bonne réponse !":"❌ Mauvaise réponse."}</b> ${exp}`;
  $("explain").hidden=false;
  $("next").textContent=i===list.length-1?"Voir le résultat":"Suivant →";
  $("next").hidden=false;
}
function finish(){
  show("end");
  const p=Math.round(score/list.length*100);
  $("final").textContent=`${score} / ${list.length} (${p} %) — ${p>=80?"Excellent !":p>=50?"Bien, continue !":"Relis le cours et réessaie."}`;
  $("review").innerHTML=wrong.length?"<h3>À revoir</h3>"+wrong.map(w=>`<div class="rev"><b class="ko">${w[0]}</b><br>Réponse : <b class="ok">${w[1]}</b><br>${w[2]}</div>`).join(""):"<p>Aucune erreur 🎉</p>";
}
$("start").onclick=start;
$("theme").onchange=updateQuestionLimit;
$("next").onclick=()=>{++i<list.length?render():finish()};
$("menu").onclick=()=>show("home");
$("restart").onclick=()=>show("home");
updateQuestionLimit();
