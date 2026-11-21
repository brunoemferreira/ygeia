import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'O que significa um software ser 100% White Label para nutricionistas?',
    answer:
      'Significa que em nenhum momento o nome "Ygeía" aparece para o seu paciente. A aplicação Web, o aplicativo mobile para iOS e Android, os relatórios em PDF timbrados e as mensagens de notificação exibem exclusivamente o nome da sua clínica, sua paleta de cores, seu logotipo e até mesmo seu domínio próprio (ex: app.suaclinica.com.br).'
  },
  {
    question: 'Como funciona a segurança e criptografia dos exames laboratoriais?',
    answer:
      'Ao contrário dos sistemas tradicionais que salvam PDFs em links públicos indexáveis pelo Google, o Ygeía armazena exames laboratoriais com criptografia simétrica no repouso (AES-256). Quando o nutricionista ou o paciente solicita a visualização, a API emite uma URL temporária com assinatura criptográfica válida por 15 minutos. Após esse tempo, o link expira automaticamente.'
  },
  {
    question: 'O prontuário atende aos requisitos do CFN e da LGPD?',
    answer:
      'Sim, rigorosamente. O prontuário foi modelado em conformidade com as Resoluções CFN nº 306/2003 e 600/2018 (guarda legal por 20 anos e integridade). Em relação à LGPD (dados sensíveis de saúde), cada acesso de leitura ou modificação é registrado em trilha de auditoria indelével (AuditLog) com IP, identificador do usuário e timestamp UTC.'
  },
  {
    question: 'Posso usar meu próprio domínio (ex: app.meuconsultorio.com.br)?',
    answer:
      'Sim. O Ygeía possui suporte nativo a domínios personalizados. Basta adicionar um registro CNAME no seu provedor de domínio (Registro.br, GoDaddy, Cloudflare) apontando para a nossa rede, e nosso sistema provisiona e renova certificados SSL automaticamente.'
  },
  {
    question: 'O aplicativo do paciente realmente funciona sem internet?',
    answer:
      'Sim! Desenvolvido nativamente em React Native, o aplicativo do paciente salva o plano alimentar, as metas de água e a lista de compras em cache local de alta performance (MMKV e SQLite). Se o paciente estiver no supermercado, academia ou subsolo sem sinal 4G, ele consegue consultar sua dieta e registrar fotos de refeições offline. Assim que a internet voltar, tudo sincroniza automaticamente.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section style={{ padding: '5rem 0', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="pill-badge pill-cyan" style={{ marginBottom: '1rem' }}>
            <HelpCircle size={14} /> Dúvidas Frequentes
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Perguntas & Respostas sobre a Plataforma
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
            Tudo o que você precisa saber sobre tecnologia, segurança e White Label.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              style={{
                border: openIndex === idx ? '1.5px solid #059669' : '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                background: openIndex === idx ? '#fcfdfd' : 'white'
              }}
            >
              <button
                onClick={() => toggle(idx)}
                style={{
                  width: '100%',
                  minHeight: '56px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: '#0f172a'
                }}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={20}
                  color={openIndex === idx ? '#059669' : '#94a3b8'}
                  style={{
                    transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    flexShrink: 0,
                    marginLeft: '1rem'
                  }}
                />
              </button>

              {openIndex === idx && (
                <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', color: '#475569', fontSize: '0.95rem', lineHeight: '1.65' }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
