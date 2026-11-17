"use strict";

const TIPOS = [
  ["Normal","normal","Equilibrado"],["Fuego","fuego","Fuerte vs Planta"],["Agua","agua","Fuerte vs Fuego"],
  ["Planta","planta","Fuerte vs Agua"],["Eléctrico","electrico","Fuerte vs Agua"],["Hielo","hielo","Fuerte vs Dragón"],
  ["Lucha","lucha","Fuerte vs Normal"],["Veneno","veneno","Fuerte vs Hada"],["Tierra","tierra","Fuerte vs Eléctrico"],
  ["Volador","volador","Fuerte vs Lucha"],["Psíquico","psiquico","Fuerte vs Veneno"],["Bicho","bicho","Fuerte vs Psíquico"],
  ["Roca","roca","Fuerte vs Volador"],["Fantasma","fantasma","Fuerte vs Psíquico"],["Dragón","dragon","Fuerte vs Dragón"],
  ["Siniestro","siniestro","Fuerte vs Fantasma"],["Acero","acero","Fuerte vs Hielo"],["Hada","hada","Fuerte vs Dragón"]
];

// 1) Año del pie y menú móvil
const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();
const btnMenu = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
if (btnMenu && menu) {
  btnMenu.addEventListener("click", () => {
    btnMenu.setAttribute("aria-expanded", menu.classList.toggle("abierto"));
  });
}

// 2) Página 1: pintar los 18 tipos
const lista = document.getElementById("tipos");
if (lista) {
  lista.innerHTML = TIPOS.map(([n, s, d]) =>
    `<li class="chip t-${s}">${n}<small>${d}</small></li>`).join("");
}

// 3) Página 2: buscador y filtro por tipo
const catalogo = document.getElementById("catalogo");
if (catalogo) {
  const buscador = document.getElementById("buscador");
  const filtro = document.getElementById("filtro-tipo");
  const resultados = document.getElementById("resultados");
  const tarjetas = [...catalogo.querySelectorAll(".tarjeta")];
  TIPOS.forEach(([n]) => filtro.add(new Option(n, n.toLowerCase())));

  const filtrar = () => {
    const q = buscador.value.trim().toLowerCase();
    let visibles = 0;
    tarjetas.forEach(t => {
      const ok = (t.dataset.nombre + " " + t.dataset.tipos).includes(q) &&
                 (!filtro.value || t.dataset.tipos.split(" ").includes(filtro.value));
      t.classList.toggle("oculto", !ok);
      if (ok) visibles++;
    });
    resultados.textContent = `Mostrando ${visibles} de ${tarjetas.length} Pokémon`;
  };
  document.querySelector(".filtros").addEventListener("submit", e => e.preventDefault());
  buscador.addEventListener("input", filtrar);
  filtro.addEventListener("change", filtrar);
  filtrar();
}

// 4) Página 4: validación del formulario
const form = document.getElementById("form-entrenador");
if (form) {
  const err = (id, msg) => { document.getElementById("e-" + id).textContent = msg; return !msg; };
  form.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const edad = Number(form.edad.value);
    const tipos = [...form.querySelectorAll("input[name=tipos]:checked")].map(c => c.value);
    const validos = [
      err("nombre", nombre.length < 3 ? "Escribe al menos 3 letras." : ""),
      err("correo", form.correo.value && form.correo.checkValidity() ? "" : "Escribe un correo válido."),
      err("edad", edad >= 6 && edad <= 99 ? "" : "La edad debe estar entre 6 y 99."),
      err("tipos", tipos.length ? "" : "Elige al menos un tipo.")
    ];
    if (!validos.every(Boolean)) return;

    const inicial = form.inicial.value;
    const nombres = { planta: "Bulbasaur", fuego: "Charmander", agua: "Squirtle" };
    const carta = document.createElement("article");
    carta.className = "tarjeta t-" + inicial;
    const h = document.createElement("h3");
    h.textContent = `Registro exitoso: ${nombre}`;
    const p = document.createElement("p");
    p.textContent = `Región: ${form.region.value} · Inicial: ${nombres[inicial]} · Tipos: ${tipos.join(", ")}`;
    carta.append(h, p);
    document.getElementById("resultado").replaceChildren(carta);
    form.reset();
  });
}
