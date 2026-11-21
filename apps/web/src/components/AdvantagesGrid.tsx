import React from 'react';
import {
  Lock,
  Sparkles,
  ShieldCheck,
  Activity,
  Utensils,
  Smartphone,
  Database,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const AdvantagesGrid: React.FC = () => {
  const advantages = [
    {
      icon: <Lock size={26} />,
      colorClass: 'icon-box-red',
      badge: 'Segurança Máxima',
      title: 'Exames Laboratoriais Criptografados',
      description:
        'Todos os exames de sangue, laudos médicos e bioimpedâncias são armazenados em bucket seguro com criptografia de ponta a ponta e links de visualização temporários pré-assinados (15 min). Zero risco de exposição indevida.',
      bullets: [
        'Criptografia no repouso e no trânsito',
        'Visualização restrita por tokens assinados',
        'Suporte a PDFs pesados e fotos de alta resolução'
      ]
    },
    {
      icon: <Sparkles size={26} />,
      colorClass: 'icon-box-green',
      badge: 'Identidade Própria',
      title: 'SaaS 100% White Label com Sua Marca',
      description:
        'Seus pacientes nunca verão o nome de outra plataforma. A aplicação Web, o aplicativo mobile e os PDFs exportados recebem automaticamente a sua logo, sua paleta de cores e o seu domínio próprio.',
      bullets: [
        'Domínio personalizado (ex: app.suaclinica.com.br)',
        'Cores e logotipo adaptados dinamicamente',
        'PDFs com timbre oficial e cabeçalho profissional'
      ]
    },
    {
      icon: <ShieldCheck size={26} />,
      colorClass: 'icon-box-blue',
      badge: 'Conformidade Jurídica',
      title: 'Prontuário CFN & Auditoria Imutável LGPD',
      description:
        'Atenda com respaldo legal absoluto. O prontuário segue as resoluções CFN nº 306/2003 e 600/2018 com registro auditável e indelével de qualquer consulta ou edição feita na ficha de saúde do paciente.',
      bullets: [
        'Trilha de auditoria por IP, usuário e timestamp',
        'Classificação rigorosa de dados sensíveis de saúde',
        'Guarda legal garantida e exportação facilitada'
      ]
    },
    {
      icon: <Activity size={26} />,
      colorClass: 'icon-box-purple',
      badge: 'Cálculos Científicos',
      title: 'Motor Antropométrico & Estratégias de TMB',
      description:
        'Chega de planilhas lentas. Calcule gasto calórico e taxa metabólica instantaneamente com os protocolos mais respeitados da literatura científica através do Strategy Pattern.',
      bullets: [
        'Fórmulas: Mifflin-St Jeor, Harris-Benedict, Cunningham',
        'Dobras: Jackson & Pollock (3 e 7), Petroski (4)',
        'Gráficos de evolução corporal e bioimpedância'
      ]
    },
    {
      icon: <Utensils size={26} />,
      colorClass: 'icon-box-green',
      badge: 'Prescrição Eficiente',
      title: 'Tabela TACO Oficial & Meal Plan Builder',
      description:
        'Crie planos alimentares em minutos com acesso direto aos dados nutricionais da TACO (Unicamp). Balanço de macronutrientes, micronutrientes e calorias totais atualizados em tempo real.',
      bullets: [
        'Base oficial TACO com índice glicêmico',
        'Cálculo dinâmico de gramas/kg de proteína',
        'Geração instantânea de lista de compras'
      ]
    },
    {
      icon: <Smartphone size={26} />,
      colorClass: 'icon-box-blue',
      badge: 'Experiência do Paciente',
      title: 'App Mobile Nativo (Offline-First)',
      description:
        'Seu paciente consulta a dieta no supermercado ou na academia mesmo sem sinal de internet. Registro fotográfico de refeições com câmera nativa, controle de hidratação e Face ID / Touch ID.',
      bullets: [
        'Desenvolvido em React Native de alta performance',
        'Sincronização inteligente via fila offline local',
        'Autenticação biométrica nativa (Touch ID / Face ID)'
      ]
    },
    {
      icon: <Database size={26} />,
      colorClass: 'icon-box-red',
      badge: 'Arquitetura Forte',
      title: 'Isolamento Absoluto: PostgreSQL RLS',
      description:
        'Segurança garantida no nível do motor do banco de dados com Row-Level Security (RLS). Nenhuma clínica tem acesso sequer a um único byte de dados de outra clínica, impedindo falhas humanas de código.',
      bullets: [
        'Políticas de RLS forçadas no kernel do PostgreSQL',
        'Hashing de senhas ultra-resistente com Argon2id',
        'Rotação contínua de JWT com detecção de intrusão'
      ]
    },
    {
      icon: <Layers size={26} />,
      colorClass: 'icon-box-purple',
      badge: 'Ergonomia Total',
      title: 'Design Mobile-First Real',
      description:
        'Projetado para você atender e prescrever tanto confortavelmente pelo celular quanto em monitores widescreen com visão dividida (Split-View). Botões grandes de 48px e ações na Thumb Zone.',
      bullets: [
        'Botões e controles táteis mínimos de 48x48px',
        'Bottom Sheets deslizantes em telas de smartphones',
        'Split-View no computador: anamnese e dieta lado a lado'
      ]
    }
  ];

  return (
    <section id="vantagens" style={{ padding: '4rem 0', background: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Diferenciais Exclusivos
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
            Tudo o que sua clínica precisa para liderar o mercado
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Reunimos a mais alta tecnologia de software com rigor científico nutricional e segurança jurídica completa.
          </p>
        </div>

        <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
          {advantages.map((adv, index) => (
            <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className={`icon-box ${adv.colorClass}`}>
                  {adv.icon}
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  {adv.badge}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', marginTop: '0.5rem' }}>
                {adv.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem', flexGrow: 1 }}>
                {adv.description}
              </p>
              <div style={{ borderTop: '1px solid var(--gray-border)', paddingTop: '1rem' }}>
                {adv.bullets.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <CheckCircle2 size={16} color="var(--primary)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--dark)', fontWeight: 500 }}>
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
