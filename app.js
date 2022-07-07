"use strict";
let andre;
let paula;
var Profissao;
(function (Profissao) {
    Profissao[Profissao["Desenvolvedora"] = 0] = "Desenvolvedora";
    Profissao[Profissao["Atriz"] = 1] = "Atriz";
    Profissao[Profissao["Autonomo"] = 2] = "Autonomo";
    Profissao[Profissao["JogadorDeFutebol"] = 3] = "JogadorDeFutebol";
    Profissao[Profissao["Estudante"] = 4] = "Estudante";
})(Profissao || (Profissao = {}));
let vanessa = {
    nome: "Vanessa",
    idade: 23,
    profissao: Profissao.Desenvolvedora
};
let maria = {
    nome: "Maria",
    idade: 43,
    profissao: Profissao.Desenvolvedora
};
let jessica = {
    materias: ['Matemática', 'Física', 'Programação'],
    nome: "",
    idade: 0,
    profissao: Profissao.Estudante
};
let monica = {
    materias: ['Engenharia Física'],
    nome: "Mônica",
    idade: 89
};
function listar(lista) {
    for (const item of lista) {
        console.log('--', item);
    }
}
listar(jessica.materias);
