// Mars Waste Recycling System - JavaScript
class MarsWasteSystem {
    constructor() {
        this.wasteData = {
            total: 12600,
            categories: {
                fabrics: { amount: 3150, percentage: 25, outputs: ['insulation', 'fabric sheets'] },
                packaging: { amount: 3780, percentage: 30, outputs: ['containers', 'storage units'] },
                eva: { amount: 1890, percentage: 15, outputs: ['tools', 'equipment parts'] },
                aluminum: { amount: 1260, percentage: 10, outputs: ['reinforcements', 'structural elements'] },
                foam: { amount: 2520, percentage: 20, outputs: ['bricks', 'building blocks'] }
            },
            efficiency: 78,
            totalOutput: 9800
        };

        this.processingData = {
            'foam': { input: 200, output: 120, unit: 'bricks', process: 'compression molding' },
            'fabrics': { input: 50, output: 30, unit: 'm² insulation', process: 'thermal processing' },
            'packaging': { input: 100, output: 85, unit: 'containers', process: 'reformation' },
            'aluminum': { input: 75, output: 65, unit: 'reinforcements', process: 'melting & casting' },
            'eva': { input: 80, output: 55, unit: 'tools', process: 'molecular restructuring' }
        };

        this.init();
    }

    init() {
        this.setupNavigation();
        this.animateCounters();
        this.setupModals();
        this.setupFilters();
        this.initCharts();
        this.setupRealTimeSimulation();
        this.addPageAnimations();
    }

    setupNavigation() {
        // Set active navigation based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Mobile navigation toggle
        const navToggle = document.createElement('button');
        navToggle.className = 'nav-toggle';
        navToggle.innerHTML = '☰';
        navToggle.style.display = 'none';

        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.appendChild(navToggle);
        }

        navToggle.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('active');
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        };

        // Intersection Observer for counter animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target.querySelector('.stat-number');
                    if (counter && !counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        setTimeout(() => animateCounter(counter), 200);
                    }
                }
            });
        });

        document.querySelectorAll('.stat-card').forEach(card => {
            observer.observe(card);
        });
    }

    setupModals() {
        // Create modal HTML if not exists
        if (!document.querySelector('.modal')) {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title"></h2>
                        <button class="modal-close">×</button>
                    </div>
                    <div class="modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const modal = document.querySelector('.modal');
        const modalTitle = document.querySelector('.modal-title');
        const modalBody = document.querySelector('.modal-body');
        const modalClose = document.querySelector('.modal-close');

        // Close modal handlers
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // ESC key close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });

        this.modal = { element: modal, title: modalTitle, body: modalBody };
    }

    showModal(title, content) {
        this.modal.title.textContent = title;
        this.modal.body.innerHTML = content;
        this.modal.element.classList.add('active');
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                // Filter content based on category
                const category = btn.getAttribute('data-category');
                this.filterContent(category);
            });
        });
    }

    filterContent(category) {
        const items = document.querySelectorAll('.filterable-item');

        items.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.classList.add('fade-in');
            } else {
                item.style.display = 'none';
            }
        });
    }

    initCharts() {
        // Initialize charts based on current page
        if (document.querySelector('#wasteChart')) {
            this.createWasteChart();
        }

        if (document.querySelector('#outputChart')) {
            this.createOutputChart();
        }

        if (document.querySelector('#efficiencyChart')) {
            this.createEfficiencyChart();
        }
    }

    createWasteChart() {
        const ctx = document.getElementById('wasteChart').getContext('2d');
        const data = this.wasteData.categories;

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(data).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
                datasets: [{
                    data: Object.values(data).map(item => item.percentage),
                    backgroundColor: [
                        '#a83232', // Mars red
                        '#ffcc66', // Mars gold
                        '#4a90e2', // Mars blue
                        '#27ae60', // Mars green
                        '#e74c3c'  // Red variant
                    ],
                    borderColor: '#1c1c1c',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: {
                                family: 'Exo'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const category = Object.keys(data)[context.dataIndex];
                                const amount = data[category].amount;
                                return `${context.label}: ${amount} kg (${context.parsed}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    createOutputChart() {
        const ctx = document.getElementById('outputChart').getContext('2d');
        const data = this.processingData;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
                datasets: [{
                    label: 'Input (kg)',
                    data: Object.values(data).map(item => item.input),
                    backgroundColor: '#a83232',
                    borderColor: '#ffcc66',
                    borderWidth: 1
                }, {
                    label: 'Output (units)',
                    data: Object.values(data).map(item => item.output),
                    backgroundColor: '#ffcc66',
                    borderColor: '#a83232',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            font: {
                                family: 'Exo'
                            }
                        }
                    }
                }
            }
        });
    }

    createEfficiencyChart() {
        const ctx = document.getElementById('efficiencyChart').getContext('2d');

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Recycled', 'Waste'],
                datasets: [{
                    data: [78, 22],
                    backgroundColor: ['#27ae60', '#e74c3c'],
                    borderColor: '#1c1c1c',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: {
                                family: 'Exo'
                            }
                        }
                    }
                }
            }
        });
    }

    setupRealTimeSimulation() {
        // Simulate real-time waste processing
        let processedAmount = 0;
        const totalTarget = 12600;

        setInterval(() => {
            if (processedAmount < totalTarget) {
                processedAmount += Math.random() * 10;

                // Update any real-time counters
                const realtimeCounters = document.querySelectorAll('.realtime-counter');
                realtimeCounters.forEach(counter => {
                    counter.textContent = Math.floor(processedAmount).toLocaleString();
                });

                // Update progress bars
                const progressBars = document.querySelectorAll('.progress-fill');
                progressBars.forEach(bar => {
                    const percentage = (processedAmount / totalTarget) * 100;
                    bar.style.width = `${Math.min(percentage, 100)}%`;
                });
            }
        }, 3000);
    }

    addPageAnimations() {
        // Add entrance animations to page elements
        const animateOnScroll = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        };

        const scrollObserver = new IntersectionObserver(animateOnScroll, {
            threshold: 0.1
        });

        // Observe elements for animation
        document.querySelectorAll('.overview-card, .nav-card, .chart-container').forEach(el => {
            scrollObserver.observe(el);
        });
    }

    // Waste processing simulation methods
    getWasteProcessInfo(wasteType) {
        const processes = {
            fabrics: {
                title: 'Fabric Processing System',
                steps: [
                    { title: 'Collection & Sorting', description: 'Fabric waste is collected and sorted by material type and contamination level.' },
                    { title: 'Decontamination', description: 'Materials undergo UV sterilization and chemical cleaning processes.' },
                    { title: 'Shredding & Processing', description: 'Clean fabrics are mechanically processed into fiber components.' },
                    { title: 'Thermal Forming', description: 'Processed fibers are thermally bonded into insulation sheets and panels.' }
                ],
                outputs: ['Thermal insulation panels', 'Fabric reinforcement sheets', 'Protective coverings'],
                efficiency: '85%'
            },
            packaging: {
                title: 'Food Packaging Recycling',
                steps: [
                    { title: 'Separation', description: 'Multi-layer packaging is separated into component materials.' },
                    { title: 'Cleaning Process', description: 'Removal of food residues and adhesives using safe solvents.' },
                    { title: 'Material Recovery', description: 'Recovery of aluminum, plastic, and composite materials.' },
                    { title: 'Reformation', description: 'Clean materials are reformed into new container shapes.' }
                ],
                outputs: ['Storage containers', 'Component trays', 'Protective housings'],
                efficiency: '72%'
            },
            eva: {
                title: 'EVA Suit Component Recovery',
                steps: [
                    { title: 'Component Analysis', description: 'EVA waste is analyzed for material composition and integrity.' },
                    { title: 'Selective Disassembly', description: 'Valuable components are carefully extracted and catalogued.' },
                    { title: 'Material Processing', description: 'Polymers and metals undergo molecular restructuring.' },
                    { title: 'Tool Fabrication', description: 'Processed materials are shaped into mission-critical tools.' }
                ],
                outputs: ['Maintenance tools', 'Equipment parts', 'Safety components'],
                efficiency: '68%'
            },
            aluminum: {
                title: 'Aluminum Composite Processing',
                steps: [
                    { title: 'Metal Recovery', description: 'Aluminum is extracted from composite materials using heat treatment.' },
                    { title: 'Purification', description: 'Recovered aluminum undergoes purification to remove impurities.' },
                    { title: 'Melting & Casting', description: 'Pure aluminum is melted and cast into standardized forms.' },
                    { title: 'Structural Assembly', description: 'Cast components are assembled into habitat reinforcements.' }
                ],
                outputs: ['Structural reinforcements', 'Habitat panels', 'Equipment frames'],
                efficiency: '91%'
            },
            foam: {
                title: 'Foam Packaging Compression',
                steps: [
                    { title: 'Collection', description: 'Foam packaging materials are collected and sorted by density.' },
                    { title: 'Compression Prep', description: 'Materials are cleaned and prepared for compression molding.' },
                    { title: 'High-Pressure Forming', description: 'Foam is compressed under high pressure to form dense blocks.' },
                    { title: 'Brick Cutting', description: 'Compressed foam is cut into standardized building bricks.' }
                ],
                outputs: ['Construction bricks', 'Insulation blocks', 'Foundation elements'],
                efficiency: '88%'
            }
        };

        return processes[wasteType] || null;
    }

    // Search functionality
    performSearch(query) {
        const searchableElements = document.querySelectorAll('[data-searchable]');
        const results = [];

        searchableElements.forEach(element => {
            const content = element.textContent.toLowerCase();
            if (content.includes(query.toLowerCase())) {
                results.push(element);
                element.style.display = 'block';
                element.classList.add('search-highlight');
            } else {
                element.style.display = 'none';
                element.classList.remove('search-highlight');
            }
        });

        return results;
    }

    // Utility methods
    formatNumber(number) {
        return number.toLocaleString();
    }

    getRandomWasteUpdate() {
        const categories = Object.keys(this.wasteData.categories);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomAmount = Math.floor(Math.random() * 50) + 10;

        return {
            category: randomCategory,
            amount: randomAmount,
            timestamp: new Date().toLocaleString()
        };
    }
}

// Global functions for page-specific interactions
function showWasteDetail(wasteType) {
    const system = window.marsSystem || new MarsWasteSystem();
    const processInfo = system.getWasteProcessInfo(wasteType);

    if (processInfo && system.modal) {
        const content = `
            <div class="process-overview">
                <div class="process-efficiency">
                    <strong>Processing Efficiency: ${processInfo.efficiency}</strong>
                </div>
                <div class="process-steps">
                    <h4>Processing Steps:</h4>
                    ${processInfo.steps.map((step, index) => `
                        <div class="process-step">
                            <div class="step-number">${index + 1}</div>
                            <div class="step-title">${step.title}</div>
                            <div class="step-description">${step.description}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="process-outputs">
                    <h4>Output Products:</h4>
                    <ul>
                        ${processInfo.outputs.map(output => `<li>${output}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        system.showModal(processInfo.title, content);
    }
}

function updateDashboardFilter(category) {
    const system = window.marsSystem || new MarsWasteSystem();
    system.filterContent(category);
}

function searchContent(query) {
    const system = window.marsSystem || new MarsWasteSystem();
    return system.performSearch(query);
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.marsSystem = new MarsWasteSystem();

    // Add search functionality if search input exists
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length > 2) {
                searchContent(query);
            } else {
                // Reset search if query is too short
                document.querySelectorAll('[data-searchable]').forEach(el => {
                    el.style.display = 'block';
                    el.classList.remove('search-highlight');
                });
            }
        });
    }

    // Add click handlers for interactive elements
    document.addEventListener('click', (e) => {
        // Handle waste type cards
        if (e.target.closest('.waste-card')) {
            const wasteType = e.target.closest('.waste-card').getAttribute('data-waste-type');
            showWasteDetail(wasteType);
        }

        // Handle filter buttons
        if (e.target.classList.contains('filter-btn')) {
            const category = e.target.getAttribute('data-category');
            updateDashboardFilter(category);
        }
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarsWasteSystem;
}