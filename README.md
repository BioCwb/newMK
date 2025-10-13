# Metais MK - Vitrine Moderna com Painel de Administração

Este é um projeto de site moderno e responsivo para a empresa "Metais MK", especializada em projetos de metal. O site serve como uma vitrine digital, apresentando um portfólio de projetos, testemunhos de clientes e informações de contato. Além disso, conta com um painel de administração completo para gerenciar todo o conteúdo dinâmico do site.

## ✨ Funcionalidades

### 🌐 Site Público
- **Página Inicial Dinâmica:** Apresenta seções como "Sobre", "Galeria", "Testemunhos" e "Contato".
- **Galeria de Fotos:** Exibe imagens de projetos diretamente do Firebase Storage. A galeria possui um carrossel horizontal para fácil navegação.
- **Testemunhos de Clientes:** Mostra os 6 testemunhos mais recentes e aprovados, incluindo uma avaliação por estrelas (1 a 5).
- **Formulário de Depoimento:** Permite que clientes enviem seus próprios testemunhos, que ficam pendentes de aprovação no painel de administração.
- **Formulário de Contato:** Salva as mensagens enviadas diretamente no Firestore para consulta do administrador.
- **Rodapé Dinâmico:** As informações de contato, incluindo o horário de atendimento, são carregadas do banco de dados e podem ser alteradas pelo administrador.
- **Responsividade:** O layout é totalmente adaptado para visualização em desktops, tablets e dispositivos móveis.

### 🔐 Painel de Administração (`/admin`)
- **Autenticação Segura:** Acesso ao painel protegido por email e senha através do Firebase Authentication.
- **Dashboard Principal:** Exibe um resumo com notificações de novos testemunhos pendentes e mensagens recebidas.
- **Gerenciador de Galeria:**
    - Upload de novas fotos para a galeria.
    - Pré-visualização de imagens antes do upload.
    - Exclusão de fotos existentes.
- **Gerenciador de Testemunhos:**
    - Listagem de todos os testemunhos, indicando o status (pendente ou aprovado).
    - Aprovação de testemunhos enviados por clientes.
    - Exclusão de testemunhos.
    - Adição manual de novos testemunhos (que já entram como aprovados).
- **Gerenciador de Mensagens:**
    - Visualização de todas as mensagens recebidas pelo formulário de contato.
    - Exclusão de mensagens.
- **Gerenciador de Configurações:**
    - Edição do texto do horário de atendimento exibido no rodapé do site.

## 🚀 Stack de Tecnologia

- **Frontend:**
  - **React 19** (via CDN)
  - **TypeScript**
  - **Tailwind CSS** (via CDN) para estilização rápida e responsiva.
  - **Font Awesome** (via CDN) para ícones.

- **Backend & Banco de Dados (BaaS):**
  - **Firebase v8 (Compat)**
    - **Firestore:** Para armazenar testemunhos, mensagens e configurações.
    - **Firebase Storage:** Para hospedar as imagens da galeria.
    - **Firebase Authentication:** Para a autenticação do painel de administração.

- **Ambiente de Desenvolvimento:**
  - O projeto é configurado para rodar diretamente no navegador sem um passo de _build_, utilizando `importmap` no `index.html` para carregar as dependências via CDN.

## 📂 Estrutura do Projeto

```
/
├── components/
│   ├── admin/                 # Componentes exclusivos do painel de administração
│   │   ├── AdminDashboard.tsx
│   │   ├── GalleryManager.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MessagesManager.tsx
│   │   ├── SettingsManager.tsx
│   │   └── TestimonialsManager.tsx
│   ├── About.tsx              # Seção "Sobre"
│   ├── ContactForm.tsx        # Formulário de Contato
│   ├── Footer.tsx             # Rodapé do site
│   ├── Gallery.tsx            # Galeria de fotos pública
│   ├── Header.tsx             # Cabeçalho e navegação
│   ├── Hero.tsx               # Seção principal
│   ├── TestimonialForm.tsx    # Formulário para enviar testemunho
│   └── Testimonials.tsx       # Seção que exibe os testemunhos
├── App.tsx                    # Componente principal com a lógica de roteamento
├── firebase.ts                # Configuração e inicialização do Firebase SDK
├── index.html                 # Arquivo HTML principal (entry point)
├── index.tsx                  # Ponto de entrada do React
└── metadata.json              # Metadados do projeto
```

## ⚙️ Configuração e Instalação

Como este projeto não utiliza um empacotador como Vite ou Webpack, a configuração é focada no Firebase e em como executar um servidor local simples.

### 1. Configuração do Firebase
1.  **Crie um Projeto:** Vá até o [Console do Firebase](https://console.firebase.google.com/) e crie um novo projeto.
2.  **Adicione um App Web:** Dentro do seu projeto, adicione um novo aplicativo da Web. O Firebase fornecerá um objeto de configuração (`firebaseConfig`).
3.  **Copie a Configuração:** Copie o objeto `firebaseConfig`.
4.  **Cole no Código:** Abra o arquivo `firebase.ts` e substitua o objeto `firebaseConfig` existente pelo do seu projeto.
5.  **Habilite os Serviços:**
    - **Authentication:** No console do Firebase, vá para a seção "Authentication", clique em "Sign-in method" e habilite o provedor "Email/Senha".
    - **Firestore Database:** Vá para a seção "Firestore Database", crie um novo banco de dados em modo de produção e configure as regras de segurança conforme necessário.
    - **Storage:** Vá para a seção "Storage" e inicie o serviço.

### 2. Criar o Usuário Administrador
1.  No console do Firebase, vá para a seção "Authentication".
2.  Clique na aba "Users" e em "Add user".
3.  Adicione um email e uma senha. Este será o login para acessar o painel de administração.

### 3. Configurar Estrutura no Firestore
O aplicativo espera as seguintes coleções. Você pode criá-las manualmente para começar ou deixar que o app as crie na primeira interação:
- `messages`: Armazena as mensagens do formulário de contato.
- `testimonials`: Armazena os testemunhos.
- `settings`: Para configurações gerais. Crie um documento com o ID `businessInfo` dentro desta coleção e adicione um campo de texto `operatingHours`.

### 4. Configurar Estrutura no Storage
O aplicativo irá salvar e buscar as imagens da galeria em uma pasta chamada `photo/` na raiz do seu bucket do Storage.

## ▶️ Executando o Projeto Localmente

Para visualizar o projeto, você precisa de um servidor web local para servir os arquivos `HTML`, `TSX`, etc.

1.  **Pré-requisito:** Tenha o [Node.js](https://nodejs.org/) instalado (usaremos o `npx`, que vem com ele).
2.  **Abra o Terminal:** Navegue até a pasta raiz do projeto.
3.  **Inicie o Servidor:** Execute o seguinte comando:
    ```bash
    npx serve
    ```
4.  **Acesse no Navegador:** O terminal mostrará um endereço local (geralmente `http://localhost:3000`). Abra-o no seu navegador para ver o site.

## 🔗 Dependências

Todas as dependências são carregadas externamente via CDN, conforme definido no `importmap` do arquivo `index.html`. Nenhuma instalação via `npm` ou `yarn` é necessária.

- **React & ReactDOM:** Biblioteca principal para a construção da interface.
- **Firebase:** SDK para integração com os serviços do Firebase (Auth, Firestore, Storage).
- **Tailwind CSS:** Framework de CSS para estilização.
- **Font Awesome:** Biblioteca de ícones.
