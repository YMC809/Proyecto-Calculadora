// Capturamos as referencias dos elementos HTML cos que imos traballar
let pantalla = document.querySelector("#pantalla");
let teclas = document.querySelectorAll(".tecla");

// Variables que gardan os datos da operación mentres a calculadora está aberta
let operando1 = null;
let operando2 = null;
let operador = null;

/* Estas variables permiten distinguir se xa se comezou a introducir o segundo
   operando e se o contido da pantalla procede dun cálculo anterior. */
let segundoIniciado = false;
let resultadoAmosado = false;

// A pantalla comeza sempre en cero
pantalla.textContent = "0";

// Función que xestiona as pulsacións das teclas
function premerTecla(evento) {
    let tecla = evento.currentTarget.textContent;
    let contido = pantalla.textContent;

    let eNumero = /^[0-9]$/.test(tecla);
    let operacions = ["+", "-", "*", "/"];
    let eOperacion = operacions.includes(tecla);

    // C: reinicia completamente a operación e a pantalla
    if (tecla === "C") {
        operando1 = null;
        operando2 = null;
        operador = null;
        segundoIniciado = false;
        resultadoAmosado = false;
        pantalla.textContent = "0";
    }

    // CE: borra só o operando actual, mantendo o resto da operación
    else if (tecla === "CE") {
        pantalla.textContent = "0";

        if (operador !== null) {
            operando2 = null;
            segundoIniciado = false;
        } else {
            operando1 = null;
        }
        resultadoAmosado = false;
    }

    // TECLAS NUMÉRICAS
    else if (eNumero) {
        /* Se se acaba de amosar un resultado, a nova cifra inicia unha operación
           independente. Se había un operador visible, inicia o segundo operando. */
        if (resultadoAmosado) {
            operando1 = null;
            operando2 = null;
            operador = null;
            resultadoAmosado = false;
            pantalla.textContent = tecla;
        } else if (operador !== null && !segundoIniciado) {
            pantalla.textContent = tecla;
            segundoIniciado = true;
        } else if (contido === "0") {
            pantalla.textContent = tecla;
        } else {
            pantalla.textContent += tecla;
        }
    }

    // TECLA DECIMAL
    else if (tecla === ",") {
        if (resultadoAmosado) {
            operando1 = null;
            operando2 = null;
            operador = null;
            resultadoAmosado = false;
            pantalla.textContent = "0,";
        } else if (operador !== null && !segundoIniciado) {
            pantalla.textContent = "0,";
            segundoIniciado = true;
        } else if (!contido.includes(",")) {
            pantalla.textContent += ",";
        }
    }

    // TECLAS DE OPERACIÓNS ARITMÉTICAS
    else if (eOperacion) {
        if (operador === null) {
            /* A pantalla emprega a coma, pero JavaScript utiliza o punto para
               interpretar os decimais; por iso substituímos antes de converter. */
            operando1 = parseFloat(contido.replace(",", "."));
            operador = tecla;
            pantalla.textContent = tecla;
            resultadoAmosado = false;
            segundoIniciado = false;
        } else if (!segundoIniciado) {
            // Se aínda non hai segundo operando, pódese cambiar o operador
            operador = tecla;
            pantalla.textContent = tecla;
        }
        // Se xa se introduciu o segundo operando, ignórase a nova operación
    }

    // TECLA IGUAL
    else if (tecla === "=" && operador !== null && segundoIniciado) {
        operando2 = parseFloat(contido.replace(",", "."));
        let resultado;

        // Escollemos a operación aritmética que corresponda
        switch (operador) {
            case "+": resultado = operando1 + operando2; break;
            case "-": resultado = operando1 - operando2; break;
            case "*": resultado = operando1 * operando2; break;
            case "/": resultado = operando1 / operando2; break;
        }

        // Amosamos o resultado con coma decimal
        pantalla.textContent = String(resultado).replace(".", ",");

        // Borramos os datos da operación, pero mantemos o resultado na pantalla
        operando1 = null;
        operando2 = null;
        operador = null;
        segundoIniciado = false;
        resultadoAmosado = true;
    }
}

/* Asociamos un evento click a cada tecla, aproveitando unha única función
   para xestionar todas as pulsacións. */
teclas.forEach(function (tecla) {
    tecla.addEventListener("click", premerTecla);
});
