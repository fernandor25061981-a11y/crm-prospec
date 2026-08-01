
# PRD: CRM de Prospecção (Kanban-based)

## 1. Visão Geral do Produto
Um sistema de CRM simplificado e focado em prospecção ativa. O sistema baseia-se em uma visualização Kanban para gestão de fluxo de trabalho, com recursos automatizados de lembrete de follow-up e um sistema de "temperatura" para qualificação de leads.

## 2. Stack Tecnológica
*   **Banco de Dados & Autenticação:** Supabase (PostgreSQL)
*   **Front-end (Sugerido):** Next.js (React), Tailwind CSS, Lucide Icons
*   **Gestão de Estado/Drag-and-Drop:** `@hello-pangea/dnd` ou `dnd-kit`

## 3. Especificações das Funcionalidades

### 3.1. Gestão de Fluxo (Kanban)
A tela principal do sistema, composta por 7 colunas fixas:
1.  **Lead novo:** Empresas recém-adicionadas.
2.  **Não atendeu:** Leads em tentativa de contato telefônico.
3.  **Atendente:** Em contato com a atendente para pegar informações.
4.  **Responsável:** Em contato direto com o tomador de decisão.
5.  **Apresentação:** Reunião agendada e confirmada.
6.  **Follow up:** Reuniões com no-show ou propostas não fechadas.
7.  **Whatsapp:** Transição de canal (não atendem telefone ou preferem texto).

### 3.2. Cards do Kanban (Interface Simplificada)
Devem exibir apenas o essencial para visualização rápida:
*   **Nome da Empresa:** Texto principal em destaque.
*   **Telefone de Contato:** Exibição do Telefone ou WhatsApp para contato rápido.
*   **Próximo Contato:** Data e Hora. (Regra de UI: O texto deve ficar **vermelho** se a data/hora estiver no passado/atrasada).
*   **Ações Rápidas:** Botão de WhatsApp e Botão de Agendamento (com dados pré-carregados).
*   **Indicadores visuais:** Exibição resumida dos "Selos de Temperatura".

### 3.3. Sistema de Lembretes (Notificações)
*   **Área de Alerta:** Uma linha (fila) horizontal posicionada **acima** do Kanban.
*   **Gatilho:** Quando o sistema atingir a data/hora definida no campo "Próximo Contato" de um cliente, um card de notificação deve ser gerado e adicionado a esta fila para chamar a atenção do usuário.

### 3.4. Ficha do Cliente
Modal ou página lateral que se abre ao clicar em um card ou adicionar um novo lead:
*   **Dados Cadastrais:** Nome, Categoria, Idade do Negócio, Cidade.
*   **Contatos:** Telefone Fixo, WhatsApp, Nome da Recepcionista, Nome do Responsável (Tomador de decisão).
*   **Links:**
    *   Maps (URL) -> Botão para abrir o perfil do Google Maps em nova aba.
    *   Website (URL) -> Link vinculado à ficha do GMN.
*   **Agendamento:** Campo *Próximo Contato* (DatePicker + TimePicker).
*   **Selos de Temperatura:** (Detalhado na seção 3.5).

### 3.5. Selos de Temperatura (Qualificação)
Indicadores visuais em formato de barra ou badge colorida presentes na ficha do cliente e nos cards do Kanban. Possui duas métricas distintas:
1.  **Status do Site:** Vermelho (Sem site) | Amarelo (Incompleto) | Verde (Ranqueado)
2.  **Status do GMN (Google Meu Negócio):** Vermelho (Sem perfil) | Amarelo (Abandonado) | Verde (Otimizado)

### 3.6. Histórico e Interações
Uma sub-seção dentro da Ficha do Cliente para rastrear a jornada de prospecção:
*   **Logs Automáticos:** Registro de data/hora sempre que houver mudança de coluna no Kanban.
*   **Entradas Manuais:**
    *   *Resumo de Ligações:* Campo de texto longo para notas da chamada.
    *   *Resumo de WhatsApp:* Campo de texto longo para principais mensagens/status.

### 3.7. Módulo de Agenda
Página separada focada na visualização temporal:
*   Calendário mensal com seletor de mês.
*   Painel acima do calendário exibindo a lista de compromissos específicos do **dia atual**.