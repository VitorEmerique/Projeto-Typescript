// Como podemos melhorar o esse código usando TS? 
enum profissao{
    atriz,
    Padeiro
}
interface pessoa {nome:string,idade:number,profissao:profissao}

let pessoa1:pessoa = {
    nome : "maria",
    idade : 29,
    profissao:profissao.atriz
};


let pessoa2 :pessoa ={
    nome : "roberto",
    idade : 19,
    profissao:profissao.Padeiro
}


let pessoa3:pessoa ={
    nome: "laura",
    idade: 32,
    profissao:profissao.atriz
};

let pessoa4 :pessoa  ={
    nome : "carlos",
    idade : 19,
    profissao :profissao.Padeiro
}