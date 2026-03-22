// ===== SCRIPT DE CONTATO CORRIGIDO =====
// Versão simplificada e funcional

class FormularioContato {
    constructor() {
        this.form = document.getElementById('form-contato');
        this.init();
    }

    init() {
        if (this.form) {
            this.criarElementosFeedback();
            this.adicionarEventListeners();
            this.configurarMascaras();
        }
    }

    // Criar elementos de feedback visual
    criarElementosFeedback() {
        const campos = ['nome', 'email', 'assunto'];
        
        campos.forEach(campoId => {
            const input = document.getElementById(campoId);
            if (input) {
                // Criar elemento de mensagem de erro
                const erroSpan = document.createElement('span');
                erroSpan.className = 'mensagem-erro';
                erroSpan.style.display = 'none';
                erroSpan.style.fontSize = '0.8rem';
                erroSpan.style.marginTop = '0.3rem';
                erroSpan.style.color = '#ff6b6b';
                input.parentNode.insertBefore(erroSpan, input.nextSibling);
                
                // Criar indicador de validação
                const validIcon = document.createElement('i');
                validIcon.className = 'validacao-icon';
                validIcon.style.position = 'absolute';
                validIcon.style.right = '15px';
                validIcon.style.top = '50%';
                validIcon.style.transform = 'translateY(-50%)';
                validIcon.style.display = 'none';
                validIcon.style.fontSize = '1rem';
                input.parentNode.style.position = 'relative';
                input.parentNode.appendChild(validIcon);
                
                input.validIcon = validIcon;
                input.erroSpan = erroSpan;
            }
        });
    }

    // Adicionar event listeners
    adicionarEventListeners() {
        this.form.addEventListener('submit', (e) => this.enviarFormulario(e));
        
        // Validação em tempo real
        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const assuntoInput = document.getElementById('assunto');
        
        if (nomeInput) nomeInput.addEventListener('input', () => this.validarNome(nomeInput));
        if (emailInput) emailInput.addEventListener('input', () => this.validarEmail(emailInput));
        if (assuntoInput) assuntoInput.addEventListener('input', () => this.validarAssunto(assuntoInput));
    }

    // Configurar máscaras de input
    configurarMascaras() {
        const nomeInput = document.getElementById('nome');
        if (nomeInput) {
            nomeInput.addEventListener('input', (e) => {
                // Impedir números e caracteres especiais no nome
                e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
            });
        }
    }

    // Validações específicas
    validarNome(input) {
        const valor = input.value.trim();
        
        if (valor.length < 3) {
            this.mostrarErro(input, 'Nome deve ter pelo menos 3 caracteres');
            return false;
        } else if (valor.length > 100) {
            this.mostrarErro(input, 'Nome muito longo (máximo 100 caracteres)');
            return false;
        } else {
            this.mostrarSucesso(input);
            return true;
        }
    }

    validarEmail(input) {
        const valor = input.value.trim();
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        
        if (valor === '') {
            this.mostrarErro(input, 'E-mail é obrigatório');
            return false;
        } else if (!emailRegex.test(valor)) {
            this.mostrarErro(input, 'Digite um e-mail válido (ex: nome@dominio.com)');
            return false;
        } else {
            this.mostrarSucesso(input);
            return true;
        }
    }

    validarAssunto(input) {
        const valor = input.value.trim();
        
        if (valor.length < 10) {
            this.mostrarErro(input, 'Mensagem deve ter pelo menos 10 caracteres');
            return false;
        } else if (valor.length > 1000) {
            this.mostrarErro(input, 'Mensagem muito longa (máximo 1000 caracteres)');
            return false;
        } else {
            this.mostrarSucesso(input);
            return true;
        }
    }

    mostrarErro(input, mensagem) {
        const erroSpan = input.erroSpan;
        const validIcon = input.validIcon;
        
        if (erroSpan) {
            erroSpan.textContent = mensagem;
            erroSpan.style.display = 'block';
        }
        if (validIcon) validIcon.style.display = 'none';
        
        input.style.borderColor = '#ff6b6b';
        input.style.backgroundColor = '#fff5f5';
        
        // Animação de shake
        input.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            input.style.animation = '';
        }, 300);
    }

    mostrarSucesso(input) {
        const erroSpan = input.erroSpan;
        const validIcon = input.validIcon;
        
        if (erroSpan) erroSpan.style.display = 'none';
        if (validIcon) {
            validIcon.style.display = 'block';
            validIcon.innerHTML = '✓';
            validIcon.style.color = '#51cf66';
        }
        
        input.style.borderColor = '#51cf66';
        input.style.backgroundColor = '#f0fff4';
    }

    // Validar formulário completo
    validarFormulario() {
        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const assuntoInput = document.getElementById('assunto');
        
        const nomeValido = this.validarNome(nomeInput);
        const emailValido = this.validarEmail(emailInput);
        const assuntoValido = this.validarAssunto(assuntoInput);
        
        return nomeValido && emailValido && assuntoValido;
    }

    // Mostrar loading no botão
    mostrarLoading(botao) {
        const textoOriginal = botao.innerHTML;
        botao.disabled = true;
        botao.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        return textoOriginal;
    }

    // Restaurar botão
    restaurarBotao(botao, textoOriginal) {
        botao.disabled = false;
        botao.innerHTML = textoOriginal;
    }

    // Enviar formulário usando FormSubmit
    async enviarFormulario(event) {
        event.preventDefault();
        
        if (!this.validarFormulario()) {
            this.mostrarNotificacao('Por favor, preencha todos os campos corretamente!', 'error');
            return;
        }
        
        const botao = this.form.querySelector('.btn-enviar');
        const textoOriginal = this.mostrarLoading(botao);
        
        try {
            // Coletar dados do formulário
            const formData = new FormData(this.form);
            
            // Enviar para FormSubmit
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.mostrarNotificacao('✅ Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
                this.limparFormulario();
                
                // Salvar no localStorage como backup
                const dados = {
                    nome: document.getElementById('nome').value,
                    email: document.getElementById('email').value,
                    mensagem: document.getElementById('assunto').value,
                    data: new Date().toLocaleString('pt-BR')
                };
                this.salvarNoLocalStorage(dados);
                
            } else {
                throw new Error('Erro no envio');
            }
            
        } catch (error) {
            console.error('Erro:', error);
            // Fallback: salvar localmente
            const dados = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                mensagem: document.getElementById('assunto').value,
                data: new Date().toLocaleString('pt-BR')
            };
            this.salvarNoLocalStorage(dados);
            this.mostrarDialogoConfirmacao(dados);
            
        } finally {
            this.restaurarBotao(botao, textoOriginal);
        }
    }
    
    // Salvar mensagem no localStorage
    salvarNoLocalStorage(dados) {
        let mensagens = JSON.parse(localStorage.getItem('mensagens_contato') || '[]');
        mensagens.push({
            ...dados,
            id: Date.now()
        });
        if (mensagens.length > 50) mensagens = mensagens.slice(-50);
        localStorage.setItem('mensagens_contato', JSON.stringify(mensagens));
    }
    
    // Mostrar diálogo de confirmação (fallback)
    mostrarDialogoConfirmacao(dados) {
        const modal = document.createElement('div');
        modal.className = 'modal-confirmacao';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle"></i> Mensagem Registrada</h3>
                    <button class="modal-fechar">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Sua mensagem foi registrada com sucesso! Entre em contato diretamente pelo WhatsApp:</p>
                    <div class="dados-mensagem">
                        <p><strong>Nome:</strong> ${this.escapeHtml(dados.nome)}</p>
                        <p><strong>E-mail:</strong> ${this.escapeHtml(dados.email)}</p>
                        <p><strong>Mensagem:</strong> ${this.escapeHtml(dados.mensagem)}</p>
                        <p><strong>Data:</strong> ${dados.data}</p>
                    </div>
                    <a href="https://wa.me/258855777584?text=Olá! Enviei uma mensagem pelo site: ${encodeURIComponent(dados.mensagem)}" 
                       target="_blank" class="btn-whatsapp" style="display: inline-block; width: 100%; text-align: center; background: #25D366; color: white; padding: 0.7rem; border-radius: 25px; text-decoration: none; margin-top: 10px;">
                        <i class="fab fa-whatsapp"></i> Falar no WhatsApp
                    </a>
                    <button class="btn-copiar-dados" style="margin-top: 10px;">📋 Copiar dados</button>
                </div>
                <div class="modal-footer">
                    <button class="btn-fechar">Fechar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Estilos do modal
        const style = document.createElement('style');
        style.textContent = `
            .modal-confirmacao {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow: auto;
                animation: slideUp 0.3s ease;
            }
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h3 {
                color: #51cf66;
                margin: 0;
            }
            .modal-fechar {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #999;
            }
            .modal-body {
                padding: 1.5rem;
            }
            .dados-mensagem {
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 10px;
                margin: 1rem 0;
                font-size: 0.9rem;
            }
            .dados-mensagem p {
                margin: 0.5rem 0;
                word-break: break-word;
            }
            .btn-copiar-dados, .btn-whatsapp {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 0.7rem 1.5rem;
                border-radius: 25px;
                cursor: pointer;
                width: 100%;
                font-size: 1rem;
                transition: all 0.3s;
            }
            .btn-whatsapp {
                background: #25D366;
            }
            .btn-copiar-dados:hover, .btn-whatsapp:hover {
                transform: scale(1.05);
            }
            .modal-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid #eee;
                text-align: right;
            }
            .btn-fechar {
                background: #e9ecef;
                border: none;
                padding: 0.5rem 1.5rem;
                border-radius: 20px;
                cursor: pointer;
            }
            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Eventos do modal
        const fechar = () => modal.remove();
        modal.querySelector('.modal-fechar').addEventListener('click', fechar);
        modal.querySelector('.btn-fechar').addEventListener('click', fechar);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) fechar();
        });
        
        modal.querySelector('.btn-copiar-dados').addEventListener('click', () => {
            const dadosTexto = `Nome: ${dados.nome}\nE-mail: ${dados.email}\nMensagem: ${dados.mensagem}\nData: ${dados.data}`;
            navigator.clipboard.writeText(dadosTexto).then(() => {
                this.mostrarNotificacao('Dados copiados para a área de transferência!', 'success');
            });
        });
        
        this.limparFormulario();
    }
    
    // Limpar formulário
    limparFormulario() {
        const campos = ['nome', 'email', 'assunto'];
        campos.forEach(campoId => {
            const input = document.getElementById(campoId);
            if (input) {
                input.value = '';
                input.style.borderColor = '';
                input.style.backgroundColor = '';
                if (input.erroSpan) input.erroSpan.style.display = 'none';
                if (input.validIcon) input.validIcon.style.display = 'none';
            }
        });
    }
    
    // Mostrar notificação
    mostrarNotificacao(mensagem, tipo = 'info') {
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao notificacao-${tipo}`;
        
        const cores = {
            success: '#51cf66',
            error: '#ff6b6b',
            info: '#667eea'
        };
        
        notificacao.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.8rem;">
                <span>${tipo === 'success' ? '✅' : tipo === 'error' ? '❌' : 'ℹ️'}</span>
                <span>${mensagem}</span>
            </div>
        `;
        
        notificacao.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            padding: 1rem 1.5rem;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            max-width: 350px;
            border-left: 4px solid ${cores[tipo]};
        `;
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            notificacao.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notificacao.remove(), 300);
        }, 4000);
    }
    
    // Escapar HTML para evitar XSS
    escapeHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }
}

// Adicionar animações ao CSS
const styleAnimations = document.createElement('style');
styleAnimations.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(styleAnimations);

// Inicializar o formulário quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new FormularioContato();
});