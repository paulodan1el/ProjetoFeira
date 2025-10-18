/* ===================================================================
   1. LÓGICA DO MODO ESCURO (DARK MODE)
   =================================================================== */

// Selecionar os elementos do tema
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement; // Seleciona a tag <html>

// Função para aplicar o tema
function setTheme(isDark) {
    if (isDark) {
        htmlElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
}

// Adicionar o "escutador" de clique no botão de tema
if (themeToggle) { 
    themeToggle.addEventListener('click', () => {
        const isCurrentlyDark = htmlElement.classList.contains('dark-mode');
        setTheme(!isCurrentlyDark);
    });
}

// Verificar a preferência do usuário ao carregar a página
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(systemPrefersDark);
    }
});


/* ===================================================================
   2. LÓGICA DOS GRÁFICOS (Chart.js)
   =================================================================== */

// --- Variáveis globais para os gráficos ---
let ibovespaChart;
let portfolioChart;

// --- DADOS FALSOS (MOCK DATA) PARA OS GRÁFICOS ---
// (No futuro, você pode buscar isso de uma API)
const chartData = {
    '1D': {
        labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
        values: [119500, 119800, 120100, 119900, 120300, 120500, 120200, 120400, 120000]
    },
    '7D': {
        labels: ['19', '20', '21', '22', '23', '24', 'Hoje'],
        values: [118000, 118500, 118200, 119000, 119300, 119500, 120000]
    },
    '30D': {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Hoje'],
        values: [115000, 117000, 116500, 120000]
    },
    '6M': {
        labels: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Outubro'],
        values: [110000, 112000, 115000, 113000, 118000, 120000]
    },
    '1A': {
        labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Outubro'],
        values: [105000, 112000, 110000, 114000, 118000, 117000, 120000]
    },
    '5A': {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        values: [90000, 95000, 110000, 105000, 120000]
    }
};

// --- Função para ATUALIZAR o gráfico Ibovespa ---
function updateIbovespaChart(period) {
    if (!ibovespaChart) return; // Se o gráfico não existe, não faz nada

    const data = chartData[period] || chartData['1A']; // Pega os dados do período, ou '1A' como padrão

    // Atualiza os dados do gráfico
    ibovespaChart.data.labels = data.labels;
    ibovespaChart.data.datasets[0].data = data.values;
    
    // Anima a atualização
    ibovespaChart.update();
}

// --- INICIALIZAÇÃO DO GRÁFICO IBOVESPA ---
const ctxIbov = document.getElementById('ibovespaChart');
if (ctxIbov) {
    ibovespaChart = new Chart(ctxIbov, {
        type: 'line',
        data: {
            labels: chartData['1A'].labels, // Começa com dados de 1 Ano
            datasets: [{
                label: 'Ibovespa',
                data: chartData['1A'].values, // Começa com dados de 1 Ano
                borderColor: '#4f46e5', 
                backgroundColor: 'rgba(79, 70, 229, 0.1)', 
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// --- INICIALIZAÇÃO DO GRÁFICO PIZZA CARTEIRA ---
const ctxPizza = document.getElementById('portfolioChart');
if (ctxPizza) {
     portfolioChart = new Chart(ctxPizza, { // Salva na variável global
        type: 'doughnut',
        data: {
            labels: ['Renda Fixa', 'Ações', 'Fundos Invest.', 'Fundos Imob.'],
            datasets: [{
                label: 'Distribuição',
                data: [25, 30, 15, 30], // Dados de exemplo
                backgroundColor: ['#4f46e5', '#20C997', '#FFC107', '#00B8D9'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: { legend: { display: false } }
         }
    });
}


/* ===================================================================
   3. LÓGICA DOS BOTÕES DE FILTRO (NOVO!)
   =================================================================== */

// --- Lógica para os filtros de tempo do IBOVESPA ---
const ibovFiltersContainer = document.getElementById('ibov-time-filters');

if (ibovFiltersContainer) {
    const filterButtons = ibovFiltersContainer.querySelectorAll('button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Remove a classe 'active' de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 2. Adiciona a classe 'active' apenas no botão clicado
            button.classList.add('active');
            
            // 3. Pega o período (ex: "1D", "7D") do atributo 'data-period'
            const period = button.dataset.period;
            
            // 4. Chama a função para atualizar o gráfico com o novo período
            updateIbovespaChart(period);
        });
    });
}