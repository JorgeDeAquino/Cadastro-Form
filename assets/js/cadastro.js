//endereço seleção
const cepInput = document.querySelector("#cep");
const logradouroInput = document.querySelector("#logradouro");
const numeroInput = document.querySelector("#numero");
const bairroInput = document.querySelector("#bairro");
const cidadeInput = document.querySelector("#cidade");
const estadoInput = document.querySelector("#estado");

const formInputs = document.querySelectorAll("[data-input]");

//classe de validação
class Validar {
    constructor() {
        this.validations = [
            'data-min-length',
        ]
    }

    //Validação dos campos
    validate(form) {
        let inputs = form.getElementsByTagName('input');

        //transformando html colection em array
        let inputsArray = [...inputs];

        //loop nos inputs e validação
        inputsArray.forEach(function(input) {

            //loop em todas as validações
            for(let i = 0; this.validations.length > i; i++) {
                //verificação se existe no input
                if (input.getAttribute(this.validations[i]) != null ) {

                    //transformando string no nome do method
                    //transformar data-min-length=> minlength
                    let method = this.validations[i].replace('data-', '').replace('-', '');

                    //valor do input
                    let value = input.getAttribute(this.validations[i]);

                    //invocando o method
                    this[method](input, value);

                }
            }

        }, this);

    }

    //metodo para min de caracteres (apos ser transformado em metodo)
    minlength(input, minValue) {

        let inputLength = input.value.length;

        let errorMessage = `O campo deve conter pelo menos ${minValue} caracteres`;

        if (inputLength < minValue) {
            console.log(errorMessage);
        }

    }
}

//formulario
let form = document.getElementById("registro-form");
let submit = document.getElementById("btn-submit");

//objeto de validação
let validador = new Validar();


//evento para validações
submit.addEventListener('click', function(e) {
    e.preventDefault();

    validador.validate(form);
})



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