const inputQuestion = document.getElementById("inputQuestion");
const result = document.getElementById("result");

inputQuestion.addEventListener("keypress", (e) => {
    if (inputQuestion.value && e.key === "Enter")
    SendQuestion();
});


const OPENAI_API_KEY = "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";

// FUNÇÃO RESPONSÁVEL POR CONSUMIR A API DO ChatGPT!
function SendQuestion() {
    let sQuetion = inputQuestion.value;

    fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + OPENAI_API_KEY,
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: sQuetion,
            max_tokens: 2048, // Tamanho da Resposta
            temperature: 0.5, // Criatividade na Resposta
        }),
    })

    // Transformando Resposta em JSON, até verificar se o Result tem algum valor!
    // Até validar se tem algum ERRO no JSON, para depois armazenar a Resposta em Váriavel -> text!
    .then((response) => response.json())
    .then((json) => {
        if (result.value) result.value += "\n";

        if (json.error?.message) {
            result.value += `Error: ${json.error.message}`;
        } else if (json.choices?.[0].text) {
            let text = json.choices[0].text || "Sem resposta";

            result.value += "Chat GPT: " + text;
        }

        result.scrollTop = result.scrollHeight;
    })

    // Abaixo são algumas formas de válidar o ERRO e mostrar em CONSOLE.
    .catch((error) => console.error("Error:", error))
    .finally(() => {
        inputQuestion.value = "";
        inputQuestion.disabled = false;
        inputQuestion.focus();
    })

    // Após Perguntar, vem o carregamento até exibir a Resposta!
    if (result.value) result.value += "\n\n\n";

    result.value += `Eu: ${sQuetion}`;
    inputQuestion.value = `Carregando...`;
    inputQuestion.disabled = true;

    result.scrollTop = result.scrollHeight;
}