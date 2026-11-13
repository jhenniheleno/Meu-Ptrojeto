document.addEventListener("DOMContentLoaded", () => {
  const paginaAtual = location.pathname.split("/").pop() || "index.html";
  const linksMenu = document.querySelectorAll(".nav a");
  for (const link of linksMenu) {
    if (link.getAttribute("href") === paginaAtual) link.classList.add("active");
  }

  const botaoMenu = document.querySelector(".menu-btn");
  const menu = document.querySelector(".nav");
  if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", () => {
      const aberto = menu.classList.toggle("open");
      botaoMenu.setAttribute("aria-expanded", String(aberto));
    });
  }

  document.querySelectorAll("[data-count]").forEach((elemento) => {
    const total = Number(elemento.dataset.count);
    let atual = 0;
    const incremento = Math.ceil(total / 60);
    const intervalo = setInterval(() => {
      atual = Math.min(atual + incremento, total);
      elemento.textContent = atual + "+";
      if (atual >= total) clearInterval(intervalo);
    }, 25);
  });

  const formularioContato = document.getElementById("formContato");
  if (formularioContato) {
    const parametros = new URLSearchParams(location.search);
    const animal = parametros.get("pet");
    if (parametros.get("assunto")) formularioContato.assunto.value = parametros.get("assunto");
    if (animal) {
      formularioContato.pet.value = animal;
      formularioContato.mensagem.value = "Olá! Tenho interesse em adotar " + animal + ".";
    }
    formularioContato.addEventListener("submit", (evento) => {
      evento.preventDefault();
      if (!formularioContato.checkValidity()) { formularioContato.reportValidity(); return; }
      const nome = formularioContato.elements.nome.value.trim().split(" ")[0];
      document.getElementById("retorno").textContent = "Obrigado, " + nome + "! Sua mensagem foi registrada nesta demonstração.";
      formularioContato.reset();
    });
  }

  const formularioCadastro = document.getElementById("cadastroAdocao");
  const areaCadastros = document.getElementById("cadastrosSalvos");
  const chaveLocal = "amigoPetCadastros";
  function lerCadastros() {
    const dados = localStorage.getItem(chaveLocal);
    return dados ? JSON.parse(dados) : [];
  }
  function mostrarCadastros() {
    if (!areaCadastros) return;
    const cadastros = lerCadastros();
    areaCadastros.innerHTML = "";
    if (cadastros.length === 0) { areaCadastros.textContent = "Nenhum cadastro salvo ainda."; return; }
    const lista = document.createElement("ul");
    lista.className = "lista";
    for (const cadastro of cadastros) {
      const item = document.createElement("li");
      item.textContent = cadastro.nome + " — " + cadastro.pet + " — " + cadastro.email;
      lista.appendChild(item);
    }
    areaCadastros.appendChild(lista);
  }
  if (formularioCadastro) {
    mostrarCadastros();
    formularioCadastro.addEventListener("submit", (evento) => {
      evento.preventDefault();
      if (!formularioCadastro.checkValidity()) { formularioCadastro.reportValidity(); return; }
      const novoCadastro = {
        nome: formularioCadastro.elements.nome.value.trim(),
        email: formularioCadastro.elements.email.value.trim(),
        pet: formularioCadastro.elements.pet.value,
        mensagem: formularioCadastro.elements.mensagem.value.trim(),
        data: new Date().toLocaleDateString("pt-BR")
      };
      const cadastros = lerCadastros();
      cadastros.push(novoCadastro);
      localStorage.setItem(chaveLocal, JSON.stringify(cadastros));
      const retorno = document.getElementById("cadRetorno");
      retorno.hidden = false;
      retorno.textContent = "Cadastro salvo neste dispositivo com sucesso!";
      formularioCadastro.reset();
      mostrarCadastros();
    });
  }
});
