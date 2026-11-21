/**
 * Utilitário Centralizado de Tratamento e Normalização de Erros da API
 * Ygeía SaaS (Υγεία)
 *
 * Mapeia erros do NestJS/Fastify, PostgreSQL, RLS e falhas de rede para
 * mensagens claras, seguras e compreensíveis em português do Brasil.
 */

export interface NormalizedApiError {
  title: string;
  message: string;
  details?: string[];
  statusCode?: number;
  code?: string;
  isNetworkError: boolean;
}

export interface BackendNestErrorPayload {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/**
 * Dicionário semântico de status HTTP com títulos e mensagens amigáveis
 */
const HTTP_ERROR_MAP: Record<number, { title: string; defaultMessage: string }> = {
  400: {
    title: 'Dados Incompletos ou Inválidos',
    defaultMessage: 'Verifique as informações preenchidas e tente novamente.',
  },
  401: {
    title: 'Acesso Não Autorizado',
    defaultMessage: 'Sua sessão expirou ou suas credenciais estão incorretas.',
  },
  403: {
    title: 'Acesso Restrito',
    defaultMessage: 'Você não possui permissão para executar esta operação.',
  },
  404: {
    title: 'Registro Não Encontrado',
    defaultMessage: 'O recurso solicitado não existe ou foi removido.',
  },
  409: {
    title: 'Conflito de Informações',
    defaultMessage: 'Já existe um registro com estes dados no sistema (ex: e-mail já cadastrado).',
  },
  422: {
    title: 'Regra de Negócio Não Atendida',
    defaultMessage: 'Os dados informados violam regras cadastrais da plataforma.',
  },
  429: {
    title: 'Limite de Requisições Atingido',
    defaultMessage: 'Muitas tentativas em curto período. Aguarde alguns instantes antes de tentar novamente.',
  },
  500: {
    title: 'Instabilidade Temporária',
    defaultMessage: 'Nosso serviço encontrou uma falha temporária. Nossa equipe já foi notificada.',
  },
  502: {
    title: 'Serviço Indisponível',
    defaultMessage: 'O servidor está reiniciando ou temporariamente inacessível. Aguarde um instante.',
  },
  503: {
    title: 'Serviço em Manutenção',
    defaultMessage: 'O sistema está passando por melhorias. Tente novamente em breve.',
  },
};

/**
 * Tradução de mensagens técnicas comuns de backend/banco para linguagem amigável
 */
const TECHNICAL_MESSAGE_TRANSLATIONS: Record<string, string> = {
  'Invalid credentials': 'E-mail ou senha incorretos.',
  'Unauthorized': 'Sessão expirada. Faça login novamente.',
  'User not found': 'Usuário não localizado.',
  'Tenant not found': 'Consultório/clínica não localizada.',
  'Email already registered': 'Este e-mail já está em uso por outro profissional ou paciente.',
  'Failed to fetch': 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
  'NetworkError when attempting to fetch resource.': 'Sem conexão com a internet ou servidor indisponível.',
};

/**
 * Normaliza qualquer erro (Error nativo, payload do NestJS, Response ou string)
 * em uma estrutura consistente para exibição de Toasts e logs.
 */
export function parseApiError(error: unknown): NormalizedApiError {
  // Caso 1: String simples
  if (typeof error === 'string') {
    return {
      title: 'Atenção',
      message: TECHNICAL_MESSAGE_TRANSLATIONS[error] || error,
      isNetworkError: false,
    };
  }

  // Caso 2: Falha de conexão / Network Error
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      title: 'Falha de Conexão',
      message: 'Não foi possível estabelecer contato com a API Ygeía. Verifique sua internet.',
      isNetworkError: true,
    };
  }

  // Caso 3: Objeto com estrutura do NestJS ou Custom Error
  if (error && typeof error === 'object') {
    const errObj = error as Record<string, any>;

    // Extrai statusCode se existir
    const statusCode: number | undefined =
      typeof errObj.statusCode === 'number'
        ? errObj.statusCode
        : typeof errObj.status === 'number'
        ? errObj.status
        : undefined;

    const baseHttp = statusCode ? HTTP_ERROR_MAP[statusCode] : undefined;
    let title = baseHttp?.title || 'Erro na Operação';
    let message = baseHttp?.defaultMessage || 'Ocorreu um erro ao processar sua solicitação.';
    let details: string[] | undefined = undefined;

    // Se o backend enviou array de validação (ex: Zod / ClassValidator)
    if (Array.isArray(errObj.message)) {
      details = errObj.message.map((m) => String(m));
      message = details[0] || message;
    } else if (typeof errObj.message === 'string' && errObj.message.trim().length > 0) {
      const translated = TECHNICAL_MESSAGE_TRANSLATIONS[errObj.message];
      message = translated || errObj.message;
    } else if (typeof errObj.error === 'string' && errObj.error.trim().length > 0) {
      message = TECHNICAL_MESSAGE_TRANSLATIONS[errObj.error] || errObj.error;
    }

    // Se veio de um Error instanciado
    if (error instanceof Error && !errObj.statusCode && error.message) {
      const translated = TECHNICAL_MESSAGE_TRANSLATIONS[error.message];
      message = translated || error.message;
      if (error.name === 'AbortError') {
        title = 'Operação Cancelada';
        message = 'A requisição demorou mais do que o esperado.';
      }
    }

    return {
      title,
      message,
      details,
      statusCode,
      code: errObj.code ? String(errObj.code) : undefined,
      isNetworkError: false,
    };
  }

  // Fallback genérico
  return {
    title: 'Erro Inesperado',
    message: 'Não foi possível concluir a ação. Tente novamente em instantes.',
    isNetworkError: false,
  };
}
