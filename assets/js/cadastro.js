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
            'data-required',
            'data-min-length',
            'data-max-length',
            'data-email-validate',
            'data-only-letters',
            'data-equal',
            'data-password-validate',
        ]
    }

    //Validação dos campos
    validate(form) {

        //resgata todas as validações
        let currentValidations = document.querySelectorAll('form .error-validation');

        if (currentValidations.length > 0) {
            this.cleanValidations(currentValidations);
        }


        //captura os inputs
        let inputs = form.getElementsByTagName('input');

        //transformando html colection em array
        let inputsArray = [...inputs];

        //loop nos inputs e validação
        inputsArray.forEach(function (input) {

            //loop em todas as validações
            for (let i = 0; this.validations.length > i; i++) {
                //verificação se existe no input
                if (input.getAttribute(this.validations[i]) != null) {

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

    // validando o campo de senha
    passwordvalidate(input) {

        // explodir string em array
        let charArr = input.value.split("");

        let uppercases = 0;
        let numbers = 0;

        for (let i = 0; charArr.length > i; i++) {
            if (charArr[i] === charArr[i].toUpperCase() && isNaN(parseInt(charArr[i]))) {
                uppercases++;
            } else if (!isNaN(parseInt(charArr[i]))) {
                numbers++;
            }
        }

        if (uppercases === 0 || numbers === 0) {
            let errorMessage = `A senha precisa um caractere maiúsculo e um número`;

            this.printMessage(input, errorMessage);
        }

    }

    // verificar se um campo está igual o outro
    equal(input, inputName) {

        let inputToCompare = document.getElementsByName(inputName)[0];

        let errorMessage = `Este campo precisa estar igual ao ${inputName}`;

        if (input.value != inputToCompare.value) {
            this.printMessage(input, errorMessage);
        }
    }


    //metodo para min de caracteres (apos ser transformado em metodo)
    minlength(input, minValue) {

        let inputLength = input.value.length;

        let errorMessage = `O campo deve conter pelo menos ${minValue} caracteres`;

        if (inputLength < minValue) {
            // console.log(errorMessage);

            this.printMessage(input, errorMessage);
        }

    }

    //metodo caracteres maximos
    maxlength(input, maxValue) {

        let inputLength = input.value.length;

        let errorMessage = `O campo deve conter no maximo ${maxValue} caracteres`;

        if (inputLength > maxValue) {
            // console.log(errorMessage);

            this.printMessage(input, errorMessage);
        }

    }

    // método para validar strings que só contem letras
    onlyletters(input) {

        let re = /^[A-Za-z]+$/;

        let inputValue = input.value;

        let errorMessage = `Este campo não aceita números nem caracteres especiais`;

        if (!re.test(inputValue)) {
            this.printMessage(input, errorMessage);
        }

    }

    //validação de email
    emailvalidate(input) {
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        let email = input.value;

        let errorMessage = `Insira um e-mail no padrão jorge@email.com`;

        if (!re.test(email)) {
            this.printMessage(input, errorMessage);
        }
    }


    //metodo para imprimir msg de erro na tela
    printMessage(input, msg) {

        //varificar quantidade de erros que input possui
        let errorsQuantidade = input.parentNode.querySelector('.error-validation');

        if (errorsQuantidade === null) {
            let template = document.querySelector('.error-validation').cloneNode(true);

            template.textContent = msg;

            let inputParent = input.parentNode;

            template.classList.remove('template');

            inputParent.appendChild(template);
        }

    }

    //verificação de required
    required(input) {
        let inputValue = input.value;

        //verificação se o input está vazio
        if (inputValue === '') {
            let errorMessage = `Este campo precisa ser preenchido!`

            this.printMessage(input, errorMessage);
        }

    }


    //limpa as validações da tela
    cleanValidations(validations) {

        //percorre e remove o elemento para limpar a tela
        validations.forEach(el => el.remove());
    }

}

//formulario
let form = document.getElementById("registro-form");
let submit = document.getElementById("btn-submit");

//objeto de validação
let validador = new Validar();


//evento para validações
submit.addEventListener('click', function (e) {
    e.preventDefault();

    termos()
    
    
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

//somente numeros no cep
function onlynumber(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    //var regex = /^[0-9.,]+$/;
    var re = /^[0-9.]+$/;
    if (!re.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

//validação checked
function termos() {
    let checkbox = document.getElementById('agreement');
    let pCheckbox = document.getElementById('errortermos');
    if (!checkbox.checked) {
        pCheckbox.textContent = "Precisa ser marcado";
        pCheckbox.classList.remove("hide")
    } else {
        pCheckbox.classList.add("hide")
    }
}
