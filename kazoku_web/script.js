// Semua tulisan Jepang memakai hiragana dan katakana saja (tanpa kanji).

// ===== SIFAT DAN KESAN =====
const traits = {
  keren:   { id: "Keren",     jp: "かっこいい", ro: "kakkoii" },
  tampan:  { id: "Tampan",    jp: "ハンサム",   ro: "hansamu" },
  cantik:  { id: "Cantik",    jp: "きれい",     ro: "kirei" },
  imut:    { id: "Imut",      jp: "かわいい",   ro: "kawaii" },
  baik:    { id: "Baik hati", jp: "やさしい",   ro: "yasashii" },
  tegas:   { id: "Tegas",     jp: "きびしい",   ro: "kibishii" },
  pendiam: { id: "Pendiam",   jp: "おとなしい", ro: "otonashii" },
  ceria:   { id: "Ceria",     jp: "あかるい",   ro: "akarui" },
};

// ===== ANGGOTA KELUARGA (urutan = urutan di halaman 3) =====
const people = [
  { role: "Ayah", name: "ちち", ro: "chichi", img: "ayah.jpg",
    traits: ["tegas"],
    jp: "ちちは きびしいです。",
    sro: "Chichi wa kibishii desu.",
    arti: "Ayahku tegas." },
  { role: "Ibu", name: "はは", ro: "haha", img: "ibu.jpg",
    traits: ["ceria", "baik"], sometimes: ["tegas"],
    jp: "ははは あかるくて やさしいです。ときどき きびしいです。",
    sro: "Haha wa akarukute yasashii desu. Tokidoki kibishii desu.",
    arti: "Ibuku ceria dan baik hati. Kadang ibu juga tegas." },
  { role: "Kakak laki-laki", name: "あに", ro: "ani", img: "abang.jpg",
    traits: ["keren", "tampan"],
    jp: "あには かっこよくて ハンサムです。",
    sro: "Ani wa kakkoyokute hansamu desu.",
    arti: "Kakak laki-lakiku keren dan tampan." },
  { role: "Aku", name: "わたし", ro: "watashi", img: "aku.jpg", me: true,
    traits: ["pendiam", "ceria"],
    jp: "わたしは おとなしくて あかるいです。",
    sro: "Watashi wa otonashikute akarui desu.",
    arti: "Aku pendiam dan ceria." },
  { role: "Adik perempuan pertama", short: "Adik 1", name: "いもうと", ro: "imouto", img: "adik1.jpg",
    traits: ["ceria", "cantik"],
    jp: "いちばんめの いもうとは あかるくて きれいです。",
    sro: "Ichibanme no imouto wa akarukute kirei desu.",
    arti: "Adik perempuan pertamaku ceria dan cantik." },
  { role: "Adik perempuan kedua", short: "Adik 2", name: "いもうと", ro: "imouto", img: "adik2.jpg",
    traits: ["imut", "baik"],
    jp: "にばんめの いもうとは かわいくて やさしいです。",
    sro: "Nibanme no imouto wa kawaikute yasashii desu.",
    arti: "Adik perempuan keduaku imut dan baik hati." },
];
const IDX = { ayah: 0, ibu: 1, abang: 2, aku: 3, adik1: 4, adik2: 5 };

// ===== FOTO (kalau file belum ada, tampil kotak pengganti) =====
function makePhoto(p, size) {
  const box = document.createElement("div");
  box.className = "photo";
  const img = new Image();
  img.alt = "Foto " + p.role;
  img.onload = () => { box.innerHTML = ""; box.appendChild(img); };
  box.innerHTML = `<div class="ph">${size === "small" ? p.name : p.name + "<br>images/" + p.img}</div>`;
  img.src = "images/" + p.img;
  return box;
}

// ===== BAGAN (halaman 2) =====
function makeNode(i) {
  const p = people[i];
  const b = document.createElement("button");
  b.className = "node" + (p.me ? " me" : "");
  b.appendChild(makePhoto(p));
  b.insertAdjacentHTML("beforeend",
    `<span class="n-jp">${p.name}</span><span class="n-ro">${p.ro}</span><span class="n-id">${p.role}</span>`);
  b.addEventListener("click", () => { selected = i; go(3); });
  return b;
}

function renderTree() {
  const tree = document.getElementById("tree");
  tree.innerHTML = "";
  const couple = document.createElement("div");
  couple.className = "couple";
  couple.append(makeNode(IDX.ayah), makeNode(IDX.ibu));

  const stem = document.createElement("div");
  stem.className = "stem";

  const kids = document.createElement("div");
  kids.className = "kids";
  [IDX.abang, IDX.aku, IDX.adik1, IDX.adik2].forEach((i) => {
    const k = document.createElement("div");
    k.className = "kid";
    k.appendChild(makeNode(i));
    kids.appendChild(k);
  });
  tree.append(couple, stem, kids);
}

// ===== SIFAT DAN KESAN (halaman 3) =====
let selected = 0;

function renderPicker() {
  const box = document.getElementById("picker");
  box.innerHTML = "";
  people.forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "pick" + (i === selected ? " active" : "");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", i === selected);
    b.appendChild(makePhoto(p, "small"));
    b.insertAdjacentHTML("beforeend", `<span>${p.short || p.role}</span>`);
    b.addEventListener("click", () => { selected = i; renderDetail(); });
    box.appendChild(b);
  });
}

function renderDetail() {
  const p = people[selected];
  const tags = p.traits.map((k) =>
    `<li><b>${traits[k].jp}</b><small>${traits[k].ro} · ${traits[k].id}</small></li>`).join("")
    + (p.sometimes || []).map((k) =>
    `<li class="some"><b>${traits[k].jp}</b><small>${traits[k].ro} · kadang ${traits[k].id.toLowerCase()}</small></li>`).join("");

  const d = document.getElementById("detail");
  d.innerHTML = `
    <div id="d-photo"></div>
    <div>
      <p class="d-role">${p.role}</p>
      <p class="d-name jp">${p.name}</p>
      <p class="d-ro">${p.ro}</p>
      <ul class="tags">${tags}</ul>
      <div class="story">
        <p class="s-jp jp">${p.jp}</p>
        <p class="s-ro">${p.sro}</p>
        <p class="s-id">${p.arti}</p>
      </div>
    </div>`;
  document.getElementById("d-photo").replaceWith(makePhoto(p));

  renderPicker();
  document.getElementById("prev").textContent = selected === 0 ? "Kembali ke bagan" : "Sebelumnya";
  document.getElementById("next").textContent = selected === people.length - 1 ? "Selesai" : "Selanjutnya";
}

document.getElementById("prev").addEventListener("click", () => {
  if (selected === 0) { go(2); return; }
  selected--; renderDetail();
});
document.getElementById("next").addEventListener("click", () => {
  if (selected === people.length - 1) { selected = 0; go(1); return; }
  selected++; renderDetail();
});

// ===== PINDAH HALAMAN =====
function go(n) {
  [1, 2, 3].forEach((i) => { document.getElementById("page" + i).hidden = i !== n; });
  document.querySelectorAll(".steps button").forEach((b) =>
    b.classList.toggle("active", Number(b.dataset.go) === n));
  if (n === 3) renderDetail();
  history.replaceState(null, "", "#" + n);
  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-go]").forEach((el) =>
  el.addEventListener("click", () => go(Number(el.dataset.go))));

// ===== MULAI =====
renderTree();
const start = Number(location.hash.slice(1));
go([1, 2, 3].includes(start) ? start : 1);
