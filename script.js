// ===== SCRIPT DE CONTATO - FUNCIONAL =====
// SEM REDIRECIONAMENTO, LIMPA FORMULÁRIO

class FormularioContato {
    constructor() {
        this.form = document.getElementById('form-contato');
        if (this.form) {
            this.init();
        } else {
            console.error('Formulário não encontrado!');
        }
    }

    init() {
        this.adicionarEventListeners();
    }

    adicionarEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.enviarFormulario();
        });
        
        // Validação em tempo real
        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const mensagemInput = document.getElementById('mensagem');
        
        if (nomeInput) nomeInput.addEventListener('input', () => this.validarNome(nomeInput));
        if (emailInput) emailInput.addEventListener('input', () => this.validarEmail(emailInput));
        if (mensagemInput) mensagemInput.addEventListener('input', () => this.validarMensagem(mensagemInput));
    }

    validarNome(input) {
        const valor = input.value.trim();
        if (valor.length < 3) {
            this.mostrarErro(input, 'Nome deve ter pelo menos 3 caracteres');
            return false;
        }
        this.mostrarSucesso(input);
        return true;
    }

    validarEmail(input) {
        const valor = input.value.trim();
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        
        if (valor === '') {
            this.mostrarErro(input, 'E-mail é obrigatório');
            return false;
        }
        if (!emailRegex.test(valor)) {
            this.mostrarErro(input, 'Digite um e-mail válido');
            return false;
        }
        this.mostrarSucesso(input);
        return true;
    }

    validarMensagem(input) {
        const valor = input.value.trim();
        if (valor.length < 10) {
            this.mostrarErro(input, 'Mensagem deve ter pelo menos 10 caracteres');
            return false;
        }
        this.mostrarSucesso(input);
        return true;
    }

    mostrarErro(input, mensagem) {
        input.style.borderColor = '#ff6b6b';
        input.style.backgroundColor = '#fff5f5';
        
        let erroSpan = input.nextElementSibling;
        if (!erroSpan || !erroSpan.classList.contains('mensagem-erro')) {
            erroSpan = document.createElement('span');
            erroSpan.className = 'mensagem-erro';
            erroSpan.style.cssText = 'display: block; color: #ff6b6b; font-size: 0.75rem; margin-top: 0.3rem;';
            input.parentNode.insertBefore(erroSpan, input.nextSibling);
        }
        erroSpan.textContent = mensagem;
    }

    mostrarSucesso(input) {
        input.style.borderColor = '#51cf66';
        input.style.backgroundColor = '#f0fff4';
        
        const erroSpan = input.nextElementSibling;
        if (erroSpan && erroSpan.classList.contains('mensagem-erro')) {
            erroSpan.style.display = 'none';
        }
    }

    validarFormulario() {
        const nomeValido = this.validarNome(document.getElementById('nome'));
        const emailValido = this.validarEmail(document.getElementById('email'));
        const mensagemValida = this.validarMensagem(document.getElementById('mensagem'));
        
        return nomeValido && emailValido && mensagemValida;
    }

    mostrarLoading(botao) {
        const textoOriginal = botao.innerHTML;
        botao.disabled = true;
        botao.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        return textoOriginal;
    }

    restaurarBotao(botao, textoOriginal) {
        botao.disabled = false;
        botao.innerHTML = textoOriginal;
    }

    mostrarNotificacao(mensagem, tipo = 'success') {
        const notificacaoAntiga = document.querySelector('.notificacao-toast');
        if (notificacaoAntiga) notificacaoAntiga.remove();
        
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-toast';
        
        const cores = { success: '#51cf66', error: '#ff6b6b', warning: '#ffd93d' };
        const icones = { success: '✅', error: '❌', warning: '⚠️' };
        
        notificacao.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 1.2rem;">${icones[tipo]}</span>
                <span style="flex: 1;">${mensagem}</span>
                <button style="background: none; border: none; font-size: 1.2rem; cursor: pointer;">&times;</button>
            </div>
        `;
        
        notificacao.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            z-index: 10001;
            border-left: 4px solid ${cores[tipo]};
            max-width: 380px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notificacao);
        
        const fecharBtn = notificacao.querySelector('button');
        fecharBtn.onclick = () => notificacao.remove();
        setTimeout(() => notificacao.remove(), 5000);
    }

    limparFormulario() {
        const campos = ['nome', 'email', 'mensagem'];
        campos.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = '';
                input.style.borderColor = '';
                input.style.backgroundColor = '';
                const erroSpan = input.nextElementSibling;
                if (erroSpan && erroSpan.classList.contains('mensagem-erro')) {
                    erroSpan.style.display = 'none';
                }
            }
        });
    }

    async enviarFormulario() {
        if (!this.validarFormulario()) {
            this.mostrarNotificacao('Preencha todos os campos corretamente!', 'error');
            return;
        }
        
        const botao = this.form.querySelector('.btn-enviar');
        const textoOriginal = this.mostrarLoading(botao);
        
        const dados = {
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('email').value.trim(),
            mensagem: document.getElementById('mensagem').value.trim()
        };
        
        try {
            const formData = new FormData();
            formData.append('nome', dados.nome);
            formData.append('email', dados.email);
            formData.append('mensagem', dados.mensagem);
            formData.append('_subject', '📬 Novo contato do Portfólio!');
            formData.append('_captcha', 'false');
            formData.append('_replyto', dados.email);
            
            const response = await fetch('https://formsubmit.co/duclesionhaca@gmail.com', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                this.mostrarNotificacao('✅ Mensagem enviada com sucesso!', 'success');
                this.limparFormulario();
            } else {
                throw new Error('Erro no envio');
            }
            
        } catch (error) {
            console.error('Erro:', error);
            this.mostrarNotificacao('❌ Erro ao enviar. Tente novamente ou use o WhatsApp.', 'error');
            
            // Salvar localmente como backup
            let mensagens = JSON.parse(localStorage.getItem('mensagens_contato') || '[]');
            mensagens.push({ ...dados, data: new Date().toLocaleString('pt-BR') });
            localStorage.setItem('mensagens_contato', JSON.stringify(mensagens));
            
        } finally {
            this.restaurarBotao(botao, textoOriginal);
        }
    }
}

// Adicionar animação CSS
const styleAnim = document.createElement('style');
styleAnim.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(styleAnim);

// Smooth scroll para links do menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Animação de entrada das seções
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.secao').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});

// Efeito de digitação no título
const titulo = document.querySelector('#home h1');
if (titulo) {
    const textoOriginal = titulo.textContent;
    titulo.textContent = '';
    let i = 0;
    function typeWriter() {
        if (i < textoOriginal.length) {
            titulo.textContent += textoOriginal.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();
}

// Inicializar o formulário quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new FormularioContato();
});

// Funções úteis para debug (use no console F12)
function verMensagensSalvas() {
    const mensagens = JSON.parse(localStorage.getItem('mensagens_contato') || '[]');
    if (mensagens.length === 0) {
        alert('Nenhuma mensagem salva.');
        return;
    }
    console.table(mensagens);
    alert(`📋 ${mensagens.length} mensagem(ns) salva(s). Verifique o console (F12) para detalhes.`);
}

function exportarMensagens() {
    const mensagens = JSON.parse(localStorage.getItem('mensagens_contato') || '[]');
    if (mensagens.length === 0) {
        alert('Nenhuma mensagem para exportar.');
        return;
    }
    const dadosStr = JSON.stringify(mensagens, null, 2);
    const blob = new Blob([dadosStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mensagens_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Mensagens exportadas com sucesso!');
}

console.log('💡 Dica: use verMensagensSalvas() para ver mensagens guardadas');
console.log('💡 Dica: use exportarMensagens() para baixar todas as mensagens');