document.addEventListener('DOMContentLoaded', () => {
    const formFornecedor = document.getElementById('form-cadastro');

    formFornecedor.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o comportamento padrão de recarregar a página

        const fornecedor = {
            nome_empresa: document.getElementById('nomeempresa').value.trim(),
            nome_contato: document.getElementById('nome').value.trim(),
            telefone: document.getElementById('telefone').value.trim(),
            cpf_cnpj: document.getElementById('cpf_cnpj').value.trim(),
            numero_cadastro: document.getElementById('numero_cadastro').value.trim(),
        };

        if (
            !fornecedor.nome_empresa ||
            !fornecedor.nome_contato ||
            !fornecedor.telefone ||
            !fornecedor.cpf_cnpj ||
            !fornecedor.numero_cadastro
        ) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:3000/fornecedores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fornecedor),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                // Redireciona para pag20.html
                window.location.href = 'pag20.html';
            } else {
                alert(result.error || 'Erro ao cadastrar fornecedor.');
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
            alert('Erro ao conectar com o servidor.');
        }
    });
});
