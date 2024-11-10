document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Erro: ID de usuário não encontrado. Por favor, realize a primeira etapa do cadastro.");
        window.location.href = "pag3.html"; // Redireciona para a primeira etapa do cadastro se o ID não estiver presente
    }
});

document.getElementById('form-cadastro-etapa2').addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o envio tradicional do formulário

    const endereco = document.getElementById('endereco').value;
    const complemento = document.getElementById('complemento').value;
    const cep = document.getElementById('cep').value;
    const cpf = document.getElementById('cpf').value;

    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('Erro: ID de usuário não encontrado. Por favor, realize a primeira etapa do cadastro.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/cadastro-etapa2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ endereco, complemento, cep, cpf, userId })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Exibe a mensagem de sucesso
            console.log("Redirecionando para pag5.html");
            window.location.href = './pag5.html'; // Redireciona para a próxima página após sucesso
        } else {
            alert(result.error || 'Erro ao atualizar o cadastro.');
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        alert('Erro ao enviar os dados. Tente novamente.');
    }
});
