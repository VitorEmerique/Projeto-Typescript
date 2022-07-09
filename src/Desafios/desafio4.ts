// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu 
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?

// A ideia dessa atividade é criar um aplicativo que: 
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela

// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction
interface HttpClientGetArguments {
  url: string,
  method: string,
  body?: object | null | string
}





interface RequestTokenResponse {
  request_token:string,
}

interface SessionResponse {
  session_id: number,
}

interface AccountResponse {
  id: number
}




let apiKey: string;
let listId: string;
let mediaName: string;
let password: string;
let requestToken: string;
let sessionId: number;
let username: string;
let userId:number;

const messagesSpan = document.getElementById("messages") as HTMLSpanElement;
const loginButton = document.getElementById('login-button') as HTMLInputElement;
const searchButton = document.getElementById('search-button') as HTMLInputElement;
const searchContainer = document.getElementById('search-container') as HTMLInputElement;


const loginInput = document.getElementById("login") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const apiKeyInput = document.getElementById("api-key") as HTMLInputElement;


loginButton.addEventListener("click", async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
  await pegarInformacoesDaConta();
  showMessage('alert','Login com sucesso')
});

function preencherSenha() {
  password = (document.getElementById('senha') as HTMLInputElement).value;
  validateLoginButton();
}

function preencherLogin() {
  username = (document.getElementById('username') as HTMLInputElement).value;
  validateLoginButton();
}

function preencherApi() {
  apiKey = (document.getElementById('api-key') as HTMLInputElement).value;
  validateLoginButton();
}

function validateLoginButton() {
  if (password && username && apiKey) {
      loginButton.disabled = false;
  } else {
      loginButton.disabled = true;
  }
}

searchButton.addEventListener('click', async () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let query:any = document.getElementById('search');
  let listaDeFilmes:any;
  listaDeFilmes = await procurarFilme(query);
  let ul = document.createElement('ul');
  ul.id = "lista"
  for (const item of listaDeFilmes.result) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(item.original_title))
    ul.appendChild(li)
  }
  console.log(listaDeFilmes);
  searchContainer.appendChild(ul);
})


type HttpClientResponse = RequestTokenResponse & 
SessionResponse & AccountResponse;


class HttpClient {
  static async get({ url, method, body = null }: HttpClientGetArguments): Promise<HttpClientResponse> {
      return new Promise((resolve, reject) => {
          let request = new XMLHttpRequest();
          request.open(method, url, true);

          request.onload = () => {
              if (request.status >= 200 && request.status < 300) {
                  resolve(JSON.parse(request.responseText));
              } else {
                  reject({
                      status: request.status,
                      statusText: request.statusText
                  })
              }
          }
          request.onerror = () => {
              reject({
                  status: request.status,
                  statusText: request.statusText
              })
          }

          if (body) {
              request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
              body = JSON.stringify(body);
          }
          request.send(body);
      })
  }
}

async function procurarFilme(query: string) {
  query = encodeURI(query)
  console.log(query)
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET"
  })
  return result
}

async function adicionarFilme(filmeId:any) {
  filmeId = encodeURI(filmeId )
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`,
    method: "GET"
  })
  console.log(result);
}

async function criarRequestToken():Promise<void> {
  let result:RequestTokenResponse = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET",
  });
  
  console.log("TOKEN: ",result)
  requestToken = result.request_token ;
}

async function logar():Promise<void> {
 
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    },
  })
  
}

async function criarSessao():Promise<void> {
  let result:SessionResponse = (await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET"
  }))
  console.log('Session ',result)
  sessionId = result.session_id;
}


async function criarLista(nomeDaLista, descricao) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br"
    }
  })
  console.log(result);
}

async function adicionarFilmeNaLista(filmeId, listaId) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
  console.log(result);
}

async function pegarLista() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  })
  console.log(result);
}


function blockLoginForm(disabled: boolean) {
  loginInput.disabled = disabled;
  passwordInput.disabled = disabled;
  apiKeyInput.disabled = disabled;
  loginButton.disabled = disabled;
  
}


function showMessage(type: string, message: string) {
  messagesSpan.classList.add(type);
  messagesSpan.innerText = message;
}

function clearForms() {
  loginInput.value = "";
  passwordInput.value = "";
  apiKeyInput.value = "";
}

async function pegarInformacoesDaConta(): Promise<void> {
  let result: AccountResponse = await HttpClient.get({
      url: `https://api.themoviedb.org/3/account?api_key=${apiKey}&session_id=${sessionId}`,
      method: "GET"
  })
  console.log("Account information: ", result);
  userId = result.id;
}
