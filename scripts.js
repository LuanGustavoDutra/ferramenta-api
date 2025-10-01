let urlCount = 0;

function adicionarURL() {
  const container = document.getElementById("url-container");

  // Remove o estado vazio se existir
  const emptyState = container.querySelector(".empty-state");
  if (emptyState) emptyState.remove();

  urlCount++;

  // Mostrar o botão secundário (caso estivesse oculto)
  document.querySelector(".url-button-add-line").style.display = "block";

  const wrapper = document.createElement("div");
  wrapper.className = "url-section-wrapper";
  wrapper.innerHTML = `
    <div class="url-section">
      <div class="url-token-block">
        <input type="text" placeholder="URL" class="url">
        <input type="text" placeholder="Token" class="token">
        <button type="button" class="btn btn-dark" onclick="toggleResultado(this)">▼</button>
        <div class="url-button-group">
          <button type="button" class="btn btn-danger" onclick="removerURL(this)">
            <i class="ri-close-line"></i>
          </button>
        </div>
      </div>
      <div class="result-area"></div>
    </div>
  `;
  container.appendChild(wrapper);
}

function removerURL(btn) {
  const container = document.getElementById("url-container");
  const wrapper = btn.closest(".url-section-wrapper");

  if (wrapper) {
    wrapper.remove();
    urlCount--;

    if (urlCount === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = `
        <p>Nenhuma URL preenchida até o momento</p>
        <button class="btn-adicionar" id="toggle" onclick="adicionarURL()">
          <ix-icon name="add-circle-filled" class="btn-sm-icon"></ix-icon>
          <div class="add-sm"> Adicionar</div>
        </button>
      `;
      container.appendChild(emptyState);

      document.querySelector(".url-button-add-line").style.display = "none";
    }
  }
}

function toggleResultado(btn) {
  const area = btn.parentElement.nextElementSibling;
  area.style.display = area.style.display === 'block' ? 'none' : 'block';
  btn.textContent = area.style.display === 'block' ? '▲' : '▼';
}

async function enviarRequisicoes() {
  const metodo = document.getElementById("metodo").value;
  const nome = document.getElementById("nome").value;
  const login = document.getElementById("login").value;
  const identificador = document.getElementById("identificador").value;
  const email = document.getElementById("email").value;
  const situacao = document.getElementById("situacao").value;
  const endpoint = document.getElementById("endpoint").value;

  const body = {
    NomeUsuario: nome,
    Login: login,
    Identificador: identificador,
    Email: email,
    Situacao: situacao,
    CODPerfilFavorito: "ADM",
    UnidadesPerfil: [
      { IDPerfil: 1, CODPerfil: "ADM", CODUnidade: "empresa" }
    ]
  };

  const destinos = [];
  const secoes = document.querySelectorAll(".url-section");
  for (let sec of secoes) {
    destinos.push({
      url: sec.querySelector(".url").value,
      token: sec.querySelector(".token").value
    });
  }

  if (destinos.length === 0) {
    alert("Adicione pelo menos uma URL antes de enviar as requisições.");
    return;
  }

  // Detecta se está rodando local ou no Render
  const API_BASE = window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://ferramenta-api.onrender.com";

  try {
    const response = await fetch(`${API_BASE}/executar-requisicoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metodo, endpoint, body, destinos })
    });

    const resultados = await response.json();
    resultados.forEach((resultado, i) => {
      const result = secoes[i].querySelector(".result-area");
      result.textContent = `Status: ${resultado.status}\n\n${JSON.stringify(resultado.data, null, 2)}`;
      result.style.display = "block";

      const btn = secoes[i].querySelector(".accordion-toggle");
      if (btn) btn.textContent = "▲";
    });
  } catch (e) {
    alert("Erro ao enviar requisições: " + e.message);
    console.error(e);
  }
}
