//endereço seleção
const cepInput = document.querySelector("#cep");
const logradouroInput = document.querySelector("#logradouro");
const numeroInput = document.querySelector("#numero");
const bairroInput = document.querySelector("#bairro");
const cidadeInput = document.querySelector("#cidade");
const estadoInput = document.querySelector("#estado");

const formInputs = document.querySelectorAll("[data-input]");


// Evento pegar endereço
cepInput.addEventListener("keyup", (e) => {
    const inputValue = e.target.value;
  
    //   Checagem se é um CEP
    if (inputValue.length === 8) {
        getAddress(inputValue);
    }
  });
  
  // pegando o cep pela API
  const getAddress = async (cep) => {
  
    cepInput.blur();
  
    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
  
    const response = await fetch(apiUrl);
  
    const data = await response.json();
  
    console.log(data);
    console.log(formInputs);
    console.log(data.erro);
  
    logradouroInput.value = data.logradouro;
    cidadeInput.value = data.localidade;
    bairroInput.value = data.bairro;
    estadoInput.value = data.uf;
  
  }


// Add ou remove disable attribute
const toggleDisabled = () => {
    if (logradouroInput.hasAttribute("disabled")) {
        formInputs.forEach((input) => {
            input.removeAttribute("disabled");
        });
    } else {
        formInputs.forEach((input) => {
            input.setAttribute("disabled", "disabled");
        });
    }
  };