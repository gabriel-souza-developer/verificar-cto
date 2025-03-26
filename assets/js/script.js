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

    // Variáveis para os valores dos campos
    let protocoloValue = '';
    let ctoNameValue = '';
    let gponNameValue = '';
    let portCountValue = '';

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
        protocoloValue = protocoloInput.value.trim();
        ctoNameValue = ctoNameInput.value.trim();
        gponNameValue = gponInput.value.trim(); // Captura o valor da GPON
        portCountValue = parseInt(portCountInput.value);

        if (protocoloValue === '' || ctoNameValue === '' || isNaN(portCountValue) || portCountValue <= 0) {
            showMessage('Por favor, preencha o protocolo, o nome da CTO/OLT e a quantidade de portas corretamente.', 'danger');
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
        if (protocoloValue) {
            titleText += `PROTOCOLO: ${protocoloValue} - `;
        }
        titleText += `VERIFICAR CTO/OLT: ${ctoNameValue}`;
        if (gponNameValue) {
            titleText += ` - GPON: ${gponNameValue}`;
        }
        titleText += ` - PORTAS: ${portCountValue}`;
        gponTitle.textContent = titleText;
    }

    // Cria a tabela de portas
    function createPortTable() {
        ctoTableBody.innerHTML = ''; // Limpa a tabela

        for (let i = 1; i <= parseInt(portCountInput.value); i++) {
            const newRow = document.createElement('tr');
            newRow.classList.add('minha-tabela__linha');

            const portaCell = document.createElement('td');
            portaCell.textContent = i;
            portaCell.classList.add('minha-tabela__celula');
            newRow.appendChild(portaCell);

            const idCell = document.createElement('td');
            idCell.classList.add('minha-tabela__celula');
            const idInput = document.createElement('input');
            idInput.type = 'text';
            idInput.classList.add('form-control-custom'); /* Removido form-control, form-control-sm */
            idCell.appendChild(idInput);
            newRow.appendChild(idCell);

            const statusCell = document.createElement('td');
            statusCell.classList.add('minha-tabela__celula');
            const statusSelect = document.createElement('select');
            statusSelect.classList.add('form-select-custom'); /* Removido form-select, form-select-sm */
            const statusOptions = ['', 'Livre', 'Em uso', 'Com defeito'];
            statusOptions.forEach(option => {
                const statusOption = document.createElement('option');
                statusOption.value = option;
                statusOption.textContent = option || ''; /*Removendo SELECIONE, para ficar vazio*/
                statusSelect.appendChild(statusOption);
            });
            statusCell.appendChild(statusSelect);
            newRow.appendChild(statusCell);

            const verificacaoCell = document.createElement('td');
            verificacaoCell.classList.add('minha-tabela__celula');
            const verificacaoSelect = document.createElement('select');
            verificacaoSelect.classList.add('form-select-custom'); /* Removido form-select, form-select-sm */
            const verificacaoOptions = ['', 'Cliente Online', 'Cliente Offline'];
            verificacaoOptions.forEach(option => {
                const verificacaoOption = document.createElement('option');
                verificacaoOption.value = option;
                verificacaoOption.textContent = option || ''; /*Removendo SELECIONE, para ficar vazio*/
                verificacaoSelect.appendChild(verificacaoOption);
            });
            verificacaoCell.appendChild(verificacaoSelect);
            newRow.appendChild(verificacaoCell);

            const acoesCell = document.createElement('td');
            acoesCell.classList.add('minha-tabela__celula');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.classList.add('minha-tabela__botao-excluir'); /* Removido btn, btn-sm, btn-danger */
            acoesCell.appendChild(deleteButton);
            newRow.appendChild(acoesCell);

            ctoTableBody.appendChild(newRow);

            gerarRelatorioBtn.style.display = 'block';
        }
    }


    // Cria o relatório
    function generateReport() {
        let relatorio = ``;

        if (protocoloValue) {
            relatorio += `Protocolo: ${protocoloValue}\n`;
        }

        relatorio += `Verificação CTO/OLT: ${ctoNameValue}\n`;

        if (gponNameValue) {
            relatorio += `Gpon: ${gponNameValue}\n`;
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
         if (event.target.classList.contains('minha-tabela__botao-excluir')) {
            if (confirm('Tem certeza que deseja excluir esta porta?')) {
                event.target.closest('tr').remove();
            }
        }
    });

   // Gerar Relatório
   gerarRelatorioBtn.addEventListener('click', function() {

    validateForm(); 
    gerarRelatorioBtn.style.display = 'block';
     relatorioContainer.style.display = 'block';

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