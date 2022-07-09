"use strict";
// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu 
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let apiKey;
let listId;
let mediaName;
let password;
let requestToken;
let sessionId;
let username;
let userId;
const messagesSpan = document.getElementById("messages");
const loginButton = document.getElementById('login-button');
const searchButton = document.getElementById('search-button');
const searchContainer = document.getElementById('search-container');
const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");
const apiKeyInput = document.getElementById("api-key");
loginButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    yield criarRequestToken();
    yield logar();
    yield criarSessao();
    yield pegarInformacoesDaConta();
    showMessage('alert', 'Login com sucesso');
}));
function preencherSenha() {
    password = document.getElementById('senha').value;
    validateLoginButton();
}
function preencherLogin() {
    username = document.getElementById('username').value;
    validateLoginButton();
}
function preencherApi() {
    apiKey = document.getElementById('api-key').value;
    validateLoginButton();
}
function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.disabled = false;
    }
    else {
        loginButton.disabled = true;
    }
}
searchButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let query = document.getElementById('search');
    let listaDeFilmes;
    listaDeFilmes = yield procurarFilme(query);
    let ul = document.createElement('ul');
    ul.id = "lista";
    for (const item of listaDeFilmes.result) {
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(item.original_title));
        ul.appendChild(li);
    }
    console.log(listaDeFilmes);
    searchContainer.appendChild(ul);
}));
class HttpClient {
    static get({ url, method, body = null }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open(method, url, true);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(JSON.parse(request.responseText));
                    }
                    else {
                        reject({
                            status: request.status,
                            statusText: request.statusText
                        });
                    }
                };
                request.onerror = () => {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                };
                if (body) {
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    body = JSON.stringify(body);
                }
                request.send(body);
            });
        });
    }
}
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        console.log(query);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
            method: "GET"
        });
        return result;
    });
}
function adicionarFilme(filmeId) {
    return __awaiter(this, void 0, void 0, function* () {
        filmeId = encodeURI(filmeId);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`,
            method: "GET"
        });
        console.log(result);
    });
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
            method: "GET",
        });
        console.log("TOKEN: ", result);
        requestToken = result.request_token;
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function* () {
        yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
            method: "POST",
            body: {
                username: `${username}`,
                password: `${password}`,
                request_token: `${requestToken}`
            },
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = (yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
            method: "GET"
        }));
        console.log('Session ', result);
        sessionId = result.session_id;
    });
}
function criarLista(nomeDaLista, descricao) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                name: nomeDaLista,
                description: descricao,
                language: "pt-br"
            }
        });
        console.log(result);
    });
}
function adicionarFilmeNaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                media_id: filmeId
            }
        });
        console.log(result);
    });
}
function pegarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
            method: "GET"
        });
        console.log(result);
    });
}
function blockLoginForm(disabled) {
    loginInput.disabled = disabled;
    passwordInput.disabled = disabled;
    apiKeyInput.disabled = disabled;
    loginButton.disabled = disabled;
}
function showMessage(type, message) {
    messagesSpan.classList.add(type);
    messagesSpan.innerText = message;
}
function clearForms() {
    loginInput.value = "";
    passwordInput.value = "";
    apiKeyInput.value = "";
}
function pegarInformacoesDaConta() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${sessionId}`,
            method: "GET"
        });
        console.log("Account information: ", result);
        userId = result.id;
    });
}
