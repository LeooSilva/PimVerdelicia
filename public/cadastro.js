document.getElementById('cadastro-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    const telefone = document.getElementById('telefone').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha, telefone })
        });

        const data = await response.json();

        if (response.ok && data.userId) { // Verifica se o userId está presente
            localStorage.setItem('userId', data.userId); // Salva o userId no localStorage
            window.location.href = 'pag4.html';
        } else {
            alert(data.erro || 'Erro ao cadastrar. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar. Tente novamente.');
    }
});
