// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const ctoForm = document.getElementById('ctoForm');
    const protocoloInput = document.getElementById('protocoloInput');
    const ctoNameInput = document.getElementById('ctoNameInput');
    const gponInput = document.getElementById('gponInput');
    const portCountInput = document.getElementById('portCountInput');
    const gponTitleContainer = document.getElementById('gponTitleContainer');
    const ctoTableBody = document.getElementById('ctoTableBody');
    const gerarRelatorioBtn = document.getElementById('gerarRelatorioBtn');
    const relatorioContainer = document.getElementById('relatorioContainer');

    // Funções auxiliares

    // Exibe mensagens de erro ou sucesso
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('alert', `alert-${type}`, 'mt-2');
        messageDiv.textContent = message;
        if (type === 'danger') {
            ctoForm.insertBefore(messageDiv, ctoForm.firstChild);
        } else {
            gerarRelatorioBtn.parentNode.insertBefore(messageDiv, gerarRelatorioBtn.nextSibling);
        }
        setTimeout(() => messageDiv.remove(), 3000);
    }

    // Valida os campos do formulário
    function validateForm() {
        if (protocoloInput.value.trim() === '' || ctoNameInput.value.trim() === '' || isNaN(parseInt(portCountInput.value)) || parseInt(portCountInput.value) <= 0) {
            showMessage('Por favor, preencha o protocolo, o nome da CTO e a quantidade de portas corretamente.', 'danger');
            return false;
        }
        return true;
    }

    // Cria o título da GPON
    function updateGponTitle() {
        let gponTitle = gponTitleContainer.querySelector('h3');
        if (!gponTitle) {
            gponTitle = document.createElement('h3');
            gponTitleContainer.appendChild(gponTitle);
            gponTitle.classList.add('gpon-title');
        }

        let titleText = ``;
        if (protocoloInput.value.trim()) {
            titleText += `Protocolo: ${protocoloInput.value.trim()} - `;
        }
        titleText += `Verificação CTO ${ctoNameInput.value.trim()}`;
        if (gponInput.value.trim()) {
            titleText += ` - GPON: ${gponInput.value.trim()}`;
        }
        titleText += ` - Portas: ${parseInt(portCountInput.value)}`;
        gponTitle.textContent = titleText;
    }

    // Cria a tabela de portas
    function createPortTable() {
        ctoTableBody.innerHTML = ''; // Limpa a tabela

        for (let i = 1; i <= parseInt(portCountInput.value); i++) {
            const newRow = document.createElement('tr');
            const portaCell = document.createElement('td');
            portaCell.textContent = i;
            newRow.appendChild(portaCell);

            const idCell = document.createElement('td');
            const idInput = document.createElement('input');
            idInput.type = 'text';
            idInput.classList.add('form-control', 'form-control-sm');
            idCell.appendChild(idInput);
            newRow.appendChild(idCell);

            const statusCell = document.createElement('td');
            const statusSelect = document.createElement('select');
            statusSelect.classList.add('form-select', 'form-select-sm');
            const statusOptions = ['', 'Livre', 'Em uso', 'Com defeito'];
            statusOptions.forEach(option => {
                const statusOption = document.createElement('option');
                statusOption.value = option;
                statusOption.textContent = option || 'Selecione';
                statusSelect.appendChild(statusOption);
            });
            statusCell.appendChild(statusSelect);
            newRow.appendChild(statusCell);

            const verificacaoCell = document.createElement('td');
            const verificacaoSelect = document.createElement('select');
            verificacaoSelect.classList.add('form-select', 'form-select-sm');
            const verificacaoOptions = ['', 'Cliente Online', 'Cliente Offline'];
            verificacaoOptions.forEach(option => {
                const verificacaoOption = document.createElement('option');
                verificacaoOption.value = option;
                verificacaoOption.textContent = option || 'Selecione';
                verificacaoSelect.appendChild(verificacaoOption);
            });
            verificacaoCell.appendChild(verificacaoSelect);
            newRow.appendChild(verificacaoCell);

            const acoesCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('btn', 'btn-sm', 'btn-danger', 'delete-button');
            acoesCell.appendChild(deleteButton);
            newRow.appendChild(acoesCell);

            ctoTableBody.appendChild(newRow);
        }
    }

    // Cria o relatório
    function generateReport() {
        let relatorio = ``;

        if (protocoloInput.value.trim()) {
            relatorio += `Protocolo: ${protocoloInput.value.trim()}\n`;
        }

        relatorio += `Verificação CTO: ${ctoNameInput.value.trim()}\n`;

        if (gponInput.value.trim()) {
            relatorio += `Gpon: ${gponInput.value.trim()}\n`;
        }

        const portasLivres = [];
        // Coleta os dados das portas livres
        for (let i = 0; i < ctoTableBody.rows.length; i++) {
            const row = ctoTableBody.rows[i];
            const statusSelect = row.cells[2].querySelector('select');
            const status = statusSelect ? statusSelect.value : ''; // Segurança caso o select não exista
            const porta = i + 1;

            if (status === 'Livre') {
                portasLivres.push(porta);
            }
        }

        if (portasLivres.length > 0) {
            relatorio += `Portas livres: ${portasLivres.join(', ')}\n`;
        } else {
            relatorio += 'Não há portas livres.\n';
        }

        relatorioContainer.textContent = relatorio;
        return relatorio;
    }

    // Listeners de eventos

    // Submit do formulário
    ctoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!validateForm()) return; // Se a validação falhar, interrompe

        updateGponTitle();
        createPortTable();
    });

    // Delegação de eventos para os botões de exclusão
    ctoTableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-button')) {
            if (confirm('Tem certeza que deseja excluir esta porta?')) {
                event.target.closest('tr').remove();
            }
        }
    });

    // Gerar Relatório
    gerarRelatorioBtn.addEventListener('click', function() {
        const relatorio = generateReport(); // Gera o relatório
        navigator.clipboard.writeText(relatorio)
            .then(() => {
                showMessage('Copiado para área de transferência!', 'success');
            })
            .catch(err => {
                console.error('Falha ao copiar o relatório: ', err);
                alert('Falha ao copiar o relatório para a área de transferência. Verifique as permissões do seu navegador.');
            });
    });
});