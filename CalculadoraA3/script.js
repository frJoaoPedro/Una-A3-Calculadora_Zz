function adicionar(valor){
    document.getElementById("visor").value += valor;
}

function apagar(){
    let visor = document.getElementById("visor");
    visor.value = visor.value.slice(0, -1);
}

function limpar(){
    document.getElementById("visor").value = "";
}

function calcular() {
    let visor = document.getElementById("visor");
    // esse let aqui e um defina ent defina que o id de visor que vai catar la do document vai ser igual ao visor variavel que foi criada, o js e bonzinho e n cria variavel como no java com um sla, char visor = x sla oq 
    let conta = visor.value.replace(/x/g, "*").replace(/÷/g, "/").replace(/,/g, ".");
    // cria a var conta e fala que conta vai ser igual visor que vai buscar no valor digitado e subistituir que e replace em portugues, ai ta subistituindo o x pelo * que é o sinal de multiplicação da maquina

    try {
        visor.value = eval(conta);
        // aqui o valor que foi colocado no valor tem que passar na conta que e o let, ou seja ele tem que entrar 2 numeros e um dos * ou / ou . se nao passa ele manda pro cach
    } catch (erro) {
        visor.value = "Erro";
        // ele pego que o meliante nao passou no teste que seria ter 2 numeros pelo menos e um operador
    }
}
// esse function ta criando uma função, o nome da função vem apos o function, ela se chama adicionar e ta afetando a variavel valor que vfoi criada ja insta aq diferente do java n precisa de Int ou Boolean ou String
// document.getElementalByID n sei mt bem mecher com isso mas basicamente ele ta pegando o documento que e a minha pasta e buscando pelo id visor
// oq ta acontecendo na funcao e q ela criou a variavel valor ai ela ta procurando por visor e o valor q sair dela o .value ta sendo adicionado a valor que vai computar que o usucario clico no botao
// o .value é o texto que já tá dentro do visor. O += valor pega esse texto e gruda o valor novo no final. Pensa assim: visor tem “12”, clica no 3, vira “123”.