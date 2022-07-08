"use strict";
// O código abaixo tem alguns erros e não funciona como deveria. Você pode identificar quais são e corrigi-los em um arquivo TS?
let botaoAtualizar = document.getElementById('atualizar-saldo');
let botaoLimpar = document.getElementById('limpar-saldo');
let soma = document.getElementById('soma');
let campoSaldo = document.getElementById('campo-saldo');
let saldoTotal = 0;
if (campoSaldo) {
    campoSaldo.innerHTML = saldoTotal.toString();
}
function somarAoSaldo(soma) {
    if (campoSaldo) {
        saldoTotal += soma;
        campoSaldo.innerHTML = saldoTotal.toString();
        limparCampoSaldo();
    }
    if (campoSaldo) {
        campoSaldo.innerHTML = saldoTotal.toString();
    }
}
function limparCampoSaldo() {
    campoSaldo.innerHTML = '';
}
function limparSaldo() {
    if (campoSaldo) {
        saldoTotal = 0;
        campoSaldo.innerHTML = saldoTotal.toString();
        limparCampoSaldo();
    }
    if (campoSaldo) {
        campoSaldo.innerHTML = saldoTotal.toString();
    }
}
botaoAtualizar.addEventListener('click', function () {
    somarAoSaldo(Number(soma.value));
    console.log(Number(soma.value));
});
botaoLimpar.addEventListener('click', function () {
    soma.value = '0';
    console.log(Number(soma.value));
});
/**
    <h4>Valor a ser adicionado: <input id="soma"> </h4>
    <button id="atualizar-saldo">Atualizar saldo</button>
    <button id="limpar-saldo">Limpar seu saldo</button>
    <h1>"Seu saldo é: " <span id="campo-saldo"></span></h1>
 */ 
