var qtd_tarefas = [];
var filtroAtual = "todas";
var editando = -1;
var textoAntes = "";
var ordenacaoAtual = "pendentes";

// FUNÇÃO PARA ADICIONAR TAREFA --------------------------------------------------------------
function tarefaadicionada(){

    var input = document.getElementById('tarefa');
    var tarefa = input.value;
    var lista_tarefas = document.getElementById("lista_tarefas");


        if (tarefa.trim() === "") {
        alert("Please enter a task!");
        return;
    }

    qtd_tarefas.push({texto: tarefa, done: false});
    salvartarefas();
    renderizartarefas();
    atualizarcontador();

    input.value = "";
    input.focus();
    
}

// FUNÇÃO PARA EXCLUIR TAREFA ----------------------------------------------------------------
function excluirtarefa(i) {

    qtd_tarefas.splice(i, 1);
    salvartarefas();
    renderizartarefas();
    atualizarcontador();
}

// FUNÇÃO PARA CONCLUIR TAREFA ---------------------------------------------------------------
function concluirtarefa(checkbox, i) {

    qtd_tarefas[i].done = checkbox.checked;
    renderizartarefas();
    salvartarefas();
    atualizarcontador();
}

// FUNÇÃO PARA ATUALIZAR O CONTADOR ----------------------------------------------------------
function atualizarcontador() {

    var contador_tarefas = document.getElementById("contador_tarefas");
    var total = qtd_tarefas.length;

    // CONTADOR DE TAREFAS CONCLÚIDAS --------------------------------------------------------
    var concluidas = 0;
    for(var k = 0; k < qtd_tarefas.length; k++){
        if (qtd_tarefas[k].done) {
            concluidas++;
        }    
    }
    // CONTADOR DE TAREFAS PENDENTES ---------------------------------------------------------
    var pendentes = total - concluidas;

    // CASO TENHA 0 TAREFAS ------------------------------------------------------------------
    if (total === 0) {
        contador_tarefas.innerHTML = `<p class="listatarefas">You currently have <strong>no</strong> tasks.</p>`
        return;
    }
    // TRATANDO PLURAL E SINGULAR ------------------------------------------------------------
    var pTarefa = (total === 1) ? "task" : "tasks";
    var pConcluida = (concluidas === 1) ? "completed" : "completed";
    var pPendente = (pendentes === 1) ? "pending" : "pending";

    // CONTADOR DE TAREFAS -------------------------------------------------------------------
    contador_tarefas.innerHTML = `<p class="listatarefas">You currently have <strong>${total} ${pTarefa}</strong> <br><br> <strong>${concluidas}</strong> ${pConcluida} • ${pendentes} ${pPendente}</p>`
}

// FUNÇÃO PARA MUDAR O FILTRO ----------------------------------------------------------------
function mudarFiltro(novoFiltro) {

    filtroAtual = novoFiltro;
    atualizarBotoesFiltro();
    renderizartarefas();
}

// FUNÇÃO PARA MUDAR ORDENAÇÃO ---------------------------------------------------------------
function mudarOrdenacao(novaOrdenacao) {

    ordenacaoAtual = novaOrdenacao;
    renderizartarefas();
}

// FUNÇÃO PARA MUDAR O FILTRO ----------------------------------------------------------------
function atualizarBotoesFiltro() {

    var botoes = document.querySelectorAll("#filtros .filtro");
    for (var j=0; j < botoes.length; j++) {
        var btn = botoes[j];
        btn.classList.remove("ativo");
        if (btn.getAttribute("onclick").includes("'" + filtroAtual + "'")) {
            btn.classList.add("ativo");
        }
    }
}

// FUNÇÃO PARA ATUALIZAR A ORDENACAO ---------------------------------------------------------
function atualizarSelectOrdenacao(){

    var select = document.getElementById("selectOrdenacao");
    if (select){
        select.value = ordenacaoAtual;
    }
}

// FUNÇÃO PARA EDITAR A TAREFA ---------------------------------------------------------------
function iniciarEdit(i) {

    if(editando !== -1 && editando !== i){
        cancelarEdit();
    }

    editando = i;
    textoAntes = qtd_tarefas[i].texto;

    renderizartarefas();

    var inputEdit = document.getElementById("edit_input" + idx);
    if (inputEdit){
        inputEdit.focus();
        inputEdit.select();
    }
}

// FUNÇÃO PARA SALVAR A EDIÇÃO DA TAREFA -----------------------------------------------------
function salvarEdit(i, textoNovo) {

    var textoLimpo = textoNovo.trim();
    if (textoLimpo === "") {
        alert("A tarefa não pode ficar vazia!");
        cancelarEdit();
        return;
    }

    qtd_tarefas[i].texto = textoLimpo;
    editando = -1;
    textoAntes = "";

    salvartarefas();
    renderizartarefas();
    atualizarcontador();
}

// FUNÇÃO PARA CANCELAR A EDIÇÃO DA TAREFA ---------------------------------------------------
function cancelarEdit(){

    editando = -1;
    textoAntes = "";

    renderizartarefas();
}

// FUNÇÃO CAPTAR ENTER/ESC -------------------------------------------------------------------
function teclaEdit(e, i){

    if(e.key === "Enter"){
        salvarEdit(i, e.target.value);
    }
    if(e.key === "Escape"){
        cancelarEdit();
    }
}

// FUNÇÃO PARA SALVAR TAREFA -----------------------------------------------------------------
function salvartarefas(){

    localStorage.setItem("lista_tarefas", JSON.stringify(qtd_tarefas));
}

// FUNÇÃO PARA CARREGAR TAREFA ---------------------------------------------------------------
function carregartarefas(){

    var tarefassalvas = localStorage.getItem("lista_tarefas");
    if (tarefassalvas) {
        qtd_tarefas = JSON.parse(tarefassalvas)
    }
}

// FUNÇÃO PARA RENDERIZAR TAREFA -------------------------------------------------------------
function renderizartarefas(){

    var listaRender = [];
    for(var i = 0; i < qtd_tarefas.length; i++){
        listaRender.push({index: i, tarefa: qtd_tarefas[i]});
    }

    var filtradas = [];
    for (var a = 0; a < listaRender.length; a++){
        var item = listaRender[a];
        if(filtroAtual === "pendentes" && item.tarefa.done) continue;
        if(filtroAtual === "concluidas" && !item.tarefa.done) continue;

        filtradas.push(item);
    }

    filtradas.sort(function(x, y){
        var t1 = x.tarefa;
        var t2 = y.tarefa;

        if(ordenacaoAtual === "pendentes"){
            return (t1.done === t2.done) ? 0 : (t1.done ? 1 : -1);
        }
        if(ordenacaoAtual === "concluidas"){
            return (t1.done === t2.done) ? 0 : (t1.done ? -1 : 1);
        }
        if(ordenacaoAtual === "az"){
            return t1.texto.localeCompare(t2.texto, "pt-BR");
        }
        if(ordenacaoAtual === "za"){
            return t2.texto.localeCompare(t1.texto, "pt-BR");
        }
        return 0;
    });

    var lista_tarefas = document.getElementById("lista_tarefas");
    lista_tarefas.innerHTML = "";

    for (var i = 0; i < filtradas.length; i++){
        var item = filtradas[i];
        var idx = item.index; 
        var tarefaa = item.tarefa; 

        var conteudoTexto = "";
        if(editando === idx){
            conteudoTexto = `
            <input type="text" 
            id="edit_input${i}" 
            value="${tarefaa.texto.replace(/"/g, "&quot;")}" 
            onkeydown="teclaEdit(event, ${idx})"
            onblur="salvarEdit(${idx}, this.value)">`;
        } else {
            conteudoTexto = `
              <span ondblclick="iniciarEdit(${idx})">
              ${tarefaa.texto}
              </span>`;
        }

        lista_tarefas.innerHTML += `
        <li class="elementostarefa ${tarefaa.done ? "concluida" : ""}"> 
        <input type="checkbox"class="confirmartarefa"onclick="concluirtarefa(this, ${idx})"${tarefaa.done ? "checked" : ""}> 
        ${conteudoTexto} 
        <input type="button"value="X"onclick="excluirtarefa(${idx})"class="excluirtarefa">
        </li>`;
    }
}

// FUNÇÕES CARREGADAS ------------------------------------------------------------------------
carregartarefas();
renderizartarefas();
atualizarcontador();
atualizarBotoesFiltro();
atualizarSelectOrdenacao();
// -------------------------------------------------------------------------------------------
