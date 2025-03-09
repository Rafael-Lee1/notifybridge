<p align="center">
  <img width="460" height="300" src="https://github.com/Rafael-Lee1/Icons/blob/c4bc7ef90014f37d39225d538dd609d9a033624a/message_typescript.png">
</p>

# Interactive Messaging System Simulation

## Overview

Este projeto é uma aplicação de simulação interativa de sistemas de mensagens, desenvolvida para demonstrar e visualizar operações de message brokers. Ele fornece uma interface completa para simular padrões de produtores/consumidores em sistemas de filas de mensagens, servindo como uma ferramenta educativa para entender os conceitos de comunicação assíncrona em sistemas distribuídos.

**Você pode acessar o projeto clicando <a href="https://preview--notifybridge.lovable.app/">aqui</a>.</p>

## Core Features

### Message Production and Consumption
- **Painel do Produtor:** Interface visual intuitiva para envio de mensagens.
- **Painel do Consumidor:** Permite ajuste de velocidade de processamento para simular diferentes cenários.
- **Visualização em Tempo Real:** Feedback instantâneo sobre a entrega e consumo de mensagens.
- **Simulação de Fila:** Demonstração do enfileiramento e processamento das mensagens.

### Message Broker Configuration
- **Suporte a Múltiplos Brokers:** Configurável para trabalhar com:
  - [RabbitMQ](https://www.rabbitmq.com/)
  - [Kafka](https://kafka.apache.org/)
  - [ActiveMQ](https://activemq.apache.org/)
- **Modos de Persistência:** Escolha entre armazenamento em memória ou em disco.
- **Configuração de Exchanges:** Suporta tipos direct, topic e fanout.
- **Opções Avançadas:** Configurações para compressão de mensagens e retenção de dados.

### Visualization and Monitoring
- **Dashboard de Métricas:** Exibição de métricas em tempo real de mensagens e monitoramento do uso de recursos (CPU, memória).
- **Visualizações do Fluxo de Mensagens:** Desde visualizações básicas até as mais avançadas.
- **Histórico:** Acompanhamento do throughput de mensagens ao longo do tempo.

### Authentication and Security
- **Controle de Acesso Baseado em Papéis:** Diferentes níveis de acesso (admin, user, viewer) com rotas protegidas.
- **Autenticação de Usuário:** Funcionalidade de login e registro, com tratamento adequado para acessos não autorizados.

### Documentation
- **Documentação Abrangente:** Seção completa com guias de início rápido, explicações de recursos e manuais administrativos.
- **Pesquisa e Categorias:** Documentação organizada e pesquisável para facilitar a navegação.

### Message History and Management
- **Histórico Persistente:** Armazenamento local para registro contínuo das mensagens.
- **Arquivamento e Processamento em Lote:** Capacidade de arquivar mensagens e processar lotes de mensagens enfileiradas.
- **Logs Separados:** Registros distintos para atividades do produtor e do consumidor.

## Tecnologias Utilizadas

### Frontend Framework
- **React com TypeScript:** Desenvolvimento de interfaces robustas com tipagem estática para maior segurança.  
  - [React Documentation](https://reactjs.org/)  
  - [TypeScript Documentation](https://www.typescriptlang.org/)

### UI Components e Estilização
- **Tailwind CSS:** Framework para estilização responsiva e moderna.  
  - [Tailwind CSS](https://tailwindcss.com/)
- **Shadcn UI:** Biblioteca de componentes reutilizáveis e consistentes.
- **Framer Motion:** Para animações e transições suaves na interface.  
  - [Framer Motion](https://www.framer.com/motion/)
- **Lucide Icons:** Conjunto de ícones de alta qualidade para aprimorar a interface visual.

### Gerenciamento de Estado e Manipulação de Dados
- **React Context API:** Gerenciamento de estado global da aplicação.
- **React Query:** Para busca, cache e sincronização de dados.
- **Local Storage:** Persistência dos dados entre sessões.
- **Hooks Personalizados:** Compartilhamento de funcionalidades e lógica reutilizável.

### Experiência do Desenvolvedor
- **Vite:** Ferramenta de desenvolvimento rápida para build e hot-reloading.  
  - [Vite](https://vitejs.dev/)
- **UUID:** Utilizado para a geração de identificadores únicos.

## Getting Started

### Prerequisites
- Node.js (v14 ou superior)
- npm ou yarn

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repo.git

2. Acesse o diretório do projeto:
   ```bash
   cd seu-repo

3. Instale as dependências:
   ```bash
   npm install
   # ou
   npm install

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev

### Uso
Após iniciar o servidor de desenvolvimento, abra seu navegador e acesse http://localhost:3000 para explorar a simulação interativa do sistema de mensagens. Utilize o painel do produtor para enviar mensagens e o painel do consumidor para ajustar a velocidade de processamento. Acompanhe as métricas em tempo real e visualize detalhadamente o fluxo das mensagens.

### Contribuição
Contribuições são bem-vindas! Consulte o arquivo CONTRIBUTING.md para mais informações sobre como colaborar com este projeto.

### License
Este projeto está licenciado sob a MIT License.

## Referências

- [RabbitMQ Official Website](https://www.rabbitmq.com/)
- [Apache Kafka Official Website](https://kafka.apache.org/)
- [Apache ActiveMQ Official Website](https://activemq.apache.org/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Vite Documentation](https://vitejs.dev/)

