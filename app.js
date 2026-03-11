// Clase principal de la aplicación NeuroFlow
class NeuroFlowApp {
    constructor() {
        this.currentView = 'visualization';
        this.threeScene = null;
        this.threeCamera = null;
        this.threeRenderer = null;
        this.neurons = [];
        this.isPlaying = false;
        this.animationId = null;
        this.cognitiveFocus = 75;
        this.intensity = 60;
        this.visualMode = '3d';
        this.brainActivity = 94;
        this.neuralConnections = 2300;
        this.userLevel = 7;
        this.userPoints = 8450;
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeThreeJS();
        this.loadUserData();
        this.renderRecommendations();
        this.startBrainWaves();
    }

    initializeElements() {
        // Elementos de navegación
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.views = document.querySelectorAll('.view');
        
        // Elementos de visualización
        this.neuralCanvas = document.getElementById('neural-canvas');
        this.visualModeSelect = document.getElementById('visual-mode');
        this.cognitiveFocusSlider = document.getElementById('cognitive-focus');
        this.intensitySlider = document.getElementById('intensity');
        this.playPauseBtn = document.getElementById('play-pause');
        this.resetViewBtn = document.getElementById('reset-view');
        this.exportDataBtn = document.getElementById('export-data');
        
        // Elementos de análisis
        this.analysisTabs = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Elementos de recomendaciones
        this.recTypeButtons = document.querySelectorAll('.rec-type-btn');
        this.recommendationsGrid = document.getElementById('recommendations-grid');
        
        // Elementos de configuración
        this.resolution3D = document.getElementById('resolution-3d');
        this.renderQuality = document.getElementById('render-quality');
        this.aiLevel = document.getElementById('ai-level');
        
        // Corregido: Buscar el toggle switch correctamente
        this.animationToggle = document.querySelector('#settings .toggle-switch input[type="checkbox"]');
        if (!this.animationToggle) {
            console.warn('Animation toggle not found, falling back to default');
            this.animationToggle = { checked: true };
        }
    }

    setupEventListeners() {
        // Navegación
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchView(btn.dataset.view);
            });
        });

        // Visualización controls
        this.visualModeSelect.addEventListener('change', (e) => {
            this.visualMode = e.target.value;
            this.updateVisualization();
        });

        this.cognitiveFocusSlider.addEventListener('input', (e) => {
            this.cognitiveFocus = e.target.value;
            this.updateBrainActivity();
        });

        this.intensitySlider.addEventListener('input', (e) => {
            this.intensity = e.target.value;
            this.updateIntensity();
        });

        this.playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause();
        });

        this.resetViewBtn.addEventListener('click', () => {
            this.resetVisualization();
        });

        this.exportDataBtn.addEventListener('click', () => {
            this.exportData();
        });

        // Analysis tabs
        this.analysisTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        // Recommendations
        this.recTypeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchRecommendationType(btn.dataset.type);
            });
        });

        // Settings
        this.resolution3D.addEventListener('change', () => {
            this.updateSettings();
        });

        this.renderQuality.addEventListener('change', () => {
            this.updateSettings();
        });

        this.aiLevel.addEventListener('input', (e) => {
            this.updateAILevel(e.target.value);
        });

        // Corregido: Manejar el toggle switch de forma segura
        if (this.animationToggle) {
            this.animationToggle.addEventListener('change', (e) => {
                this.toggleAnimations(e.target.checked);
            });
        }
    }

    initializeThreeJS() {
        try {
            // Scene setup
            this.threeScene = new THREE.Scene();
            this.threeScene.background = new THREE.Color(0x0a0a1e);
            
            // Camera setup
            this.threeCamera = new THREE.PerspectiveCamera(
                75,
                this.neuralCanvas.clientWidth / this.neuralCanvas.clientHeight,
                0.1,
                1000
            );
            this.threeCamera.position.z = 5;
            
            // Renderer setup
            this.threeRenderer = new THREE.WebGLRenderer({ antialias: true });
            this.threeRenderer.setSize(this.neuralCanvas.clientWidth, this.neuralCanvas.clientHeight);
            this.threeRenderer.setPixelRatio(window.devicePixelRatio);
            this.neuralCanvas.appendChild(this.threeRenderer.domElement);
            
            // Lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 2);
            this.threeScene.add(ambientLight);
            
            const pointLight = new THREE.PointLight(0xffffff, 1);
            pointLight.position.set(5, 5, 5);
            this.threeScene.add(pointLight);
            
            // Create neurons
            this.createNeurons();
            
            // Handle resize
            window.addEventListener('resize', () => {
                this.threeCamera.aspect = this.neuralCanvas.clientWidth / this.neuralCanvas.clientHeight;
                this.threeCamera.updateProjectionMatrix();
                this.threeRenderer.setSize(this.neuralCanvas.clientWidth, this.neuralCanvas.clientHeight);
            });
            
            // Start animation
            this.animate();
        } catch (error) {
            console.error('Three.js initialization failed:', error);
            this.fallbackVisualization();
        }
    }

    fallbackVisualization() {
        // Create a simple canvas fallback
        const canvas = document.createElement('canvas');
        canvas.width = this.neuralCanvas.clientWidth;
        canvas.height = this.neuralCanvas.clientHeight;
        canvas.style.background = '#1a1a2e';
        this.neuralCanvas.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Draw simple animation
        let time = 0;
        const animate = () => {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw some circles
            for (let i = 0; i < 20; i++) {
                const x = Math.sin(time * 0.001 + i) * 100 + canvas.width / 2;
                const y = Math.cos(time * 0.001 + i) * 100 + canvas.height / 2;
                const radius = 20 + Math.sin(time * 0.002 + i) * 10;
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${(time * 0.1 + i * 20) % 360}, 70%, 60%)`;
                ctx.fill();
            }
            
            time++;
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    createNeurons() {
        if (!this.threeScene) return;
        
        const neuronGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const neuronMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8b5cf6,
            emissive: 0x4c1d95,
            emissiveIntensity: 0.5,
            shininess: 100
        });
        
        // Create neural network structure
        const positions = [
            [0, 0, 0], [1, 1, 0], [-1, 1, 0], [0, 1, 1], [0, 1, -1],
            [2, 0, 0], [-2, 0, 0], [0, 0, 2], [0, 0, -2],
            [1, -1, 0], [-1, -1, 0], [0, -1, 1], [0, -1, -1]
        ];
        
        positions.forEach(pos => {
            const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial);
            neuron.position.set(pos[0], pos[1], pos[2]);
            this.threeScene.add(neuron);
            this.neurons.push(neuron);
        });
        
        // Create connections
        this.createConnections();
    }

    createConnections() {
        if (!this.threeScene) return;
        
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x6366f1,
            opacity: 0.6,
            transparent: true
        });
        
        // Create neural connections
        for (let i = 0; i < this.neurons.length; i++) {
            for (let j = i + 1; j < this.neurons.length; j++) {
                if (Math.random() > 0.6) {
                    const points = [];
                    points.push(this.neurons[i].position);
                    points.push(this.neurons[j].position);
                    
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, lineMaterial);
                    this.threeScene.add(line);
                }
            }
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.isPlaying && this.threeScene) {
            // Animate neurons
            this.neurons.forEach((neuron, index) => {
                neuron.rotation.x += 0.01;
                neuron.rotation.y += 0.01;
                neuron.scale.x = 1 + Math.sin(Date.now() * 0.001 + index) * 0.1;
                neuron.scale.y = 1 + Math.sin(Date.now() * 0.001 + index) * 0.1;
                neuron.scale.z = 1 + Math.sin(Date.now() * 0.001 + index) * 0.1;
            });
        }
        
        if (this.threeRenderer && this.threeScene && this.threeCamera) {
            this.threeRenderer.render(this.threeScene, this.threeCamera);
        }
    }

    updateVisualization() {
        // Clear existing scene
        if (this.threeScene) {
            while(this.threeScene.children.length > 2) {
                this.threeScene.remove(this.threeScene.children[2]);
            }
        }
        
        // Recreate based on visual mode
        switch(this.visualMode) {
            case '3d':
                this.createNeurons();
                break;
            case '2d':
                this.create2DMap();
                break;
            case 'wave':
                this.createBrainWaves();
                break;
            case 'network':
                this.createNeuralNetwork();
                break;
        }
    }

    create2DMap() {
        if (!this.threeScene) return;
        
        const geometry = new THREE.PlaneGeometry(10, 10);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x1e293b,
            wireframe: true
        });
        const plane = new THREE.Mesh(geometry, material);
        this.threeScene.add(plane);
    }

    createBrainWaves() {
        if (!this.threeScene) return;
        
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const numPoints = 1000;
        
        for (let i = 0; i < numPoints; i++) {
            const x = (i - numPoints/2) * 0.02;
            const y = Math.sin(x * 10 + Date.now() * 0.001) * 2;
            const z = 0;
            vertices.push(x, y, z);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        const material = new THREE.LineBasicMaterial({ 
            color: 0x8b5cf6,
            linewidth: 2
        });
        
        const wave = new THREE.Line(geometry, material);
        this.threeScene.add(wave);
    }

    createNeuralNetwork() {
        if (!this.threeScene) return;
        
        const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x10b981 });
        
        // Create network nodes
        for (let i = 0; i < 50; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            );
            this.threeScene.add(node);
        }
    }

    startBrainWaves() {
        // Simulate brain wave data
        setInterval(() => {
            this.brainActivity = 85 + Math.random() * 15;
            document.querySelector('.brain-activity span').textContent = `${Math.round(this.brainActivity)}% Actividad`;
            
            this.neuralConnections = 2000 + Math.random() * 800;
            document.querySelector('.neural-connections span').textContent = `${Math.round(this.neuralConnections)} Conexiones`;
            
            this.updateStats();
        }, 3000);
    }

    updateBrainActivity() {
        // Update based on cognitive focus
        this.brainActivity = this.cognitiveFocus + Math.random() * 10;
        document.querySelector('.brain-activity span').textContent = `${Math.round(this.brainActivity)}% Actividad`;
    }

    updateIntensity() {
        // Update visualization intensity
        this.neurons.forEach(neuron => {
            if (neuron.material) {
                neuron.material.emissiveIntensity = this.intensity / 100;
            }
        });
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        const icon = this.playPauseBtn.querySelector('i');
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    resetVisualization() {
        // Reset camera and scene
        if (this.threeCamera) {
            this.threeCamera.position.set(0, 0, 5);
            this.threeCamera.lookAt(0, 0, 0);
        }
        
        // Clear and recreate
        if (this.threeScene) {
            while(this.threeScene.children.length > 2) {
                this.threeScene.remove(this.threeScene.children[2]);
            }
            this.createNeurons();
        }
    }

    exportData() {
        const data = {
            brainActivity: this.brainActivity,
            neuralConnections: this.neuralConnections,
            cognitiveFocus: this.cognitiveFocus,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'neuroflow-data.json';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Datos exportados correctamente');
    }

    switchTab(tabName) {
        this.tabContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
        
        this.analysisTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });
    }

    renderRecommendations() {
        const recommendations = {
            immediate: [
                {
                    icon: 'fas fa-brain',
                    title: 'Meditación Corta',
                    description: '5 minutos de meditación para mejorar la coherencia cerebral',
                    priority: 'high',
                    time: 'Ahora'
                },
                {
                    icon: 'fas fa-lightbulb',
                    title: 'Ejercicio Cognitivo',
                    description: 'Resuelve un rompecabezas para estimular las conexiones neuronales',
                    priority: 'medium',
                    time: 'Pronto'
                }
            ],
            daily: [
                {
                    icon: 'fas fa-book',
                    title: 'Lectura Activa',
                    description: '30 minutos de lectura para expandir el vocabulario y el conocimiento',
                    priority: 'high',
                    time: 'Diario'
                },
                {
                    icon: 'fas fa-running',
                    title: 'Ejercicio Físico',
                    description: 'Actividad cardiovascular para aumentar el flujo sanguíneo cerebral',
                    priority: 'medium',
                    time: 'Diario'
                }
            ],
            weekly: [
                {
                    icon: 'fas fa-users',
                    title: 'Interacción Social',
                    description: 'Actividades sociales para mejorar la función ejecutiva',
                    priority: 'medium',
                    time: 'Semanal'
                },
                {
                    icon: 'fas fa-music',
                    title: 'Música Clásica',
                    description: 'Escucha música clásica para mejorar la concentración',
                    priority: 'low',
                    time: 'Semanal'
                }
            ],
            longterm: [
                {
                    icon: 'fas fa-graduation-cap',
                    title: 'Aprendizaje Nuevo',
                    description: 'Empieza un nuevo curso o habilidad para crear nuevas conexiones neuronales',
                    priority: 'high',
                    time: 'A Largo Plazo'
                },
                {
                    icon: 'fas fa-bed',
                    title: 'Mejora del Sueño',
                    description: 'Optimiza tus patrones de sueño para la consolidación记忆',
                    priority: 'high',
                    time: 'A Largo Plazo'
                }
            ]
        };
        
        const currentType = document.querySelector('.rec-type-btn.active').dataset.type;
        const recs = recommendations[currentType];
        
        this.recommendationsGrid.innerHTML = '';
        
        recs.forEach(rec => {
            const recElement = this.createRecommendationElement(rec);
            this.recommendationsGrid.appendChild(recElement);
        });
    }

    createRecommendationElement(rec) {
        const recDiv = document.createElement('div');
        recDiv.className = `recommendation-card priority-${rec.priority}`;
        
        const priorityColors = {
            high: '#10b981',
            medium: '#f59e0b',
            low: '#6b7280'
        };
        
        recDiv.innerHTML = `
            <div class="rec-header" style="border-left: 4px solid ${priorityColors[rec.priority]}">
                <i class="${rec.icon}"></i>
                <div>
                    <h3>${rec.title}</h3>
                    <span class="rec-time">${rec.time}</span>
                </div>
            </div>
            <p class="rec-description">${rec.description}</p>
            <div class="rec-actions">
                <button class="btn small primary">Comenzar</button>
                <button class="btn small secondary">Más Info</button>
            </div>
        `;
        
        return recDiv;
    }

    switchRecommendationType(type) {
        this.recTypeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.type === type) {
                btn.classList.add('active');
            }
        });
        
        this.renderRecommendations();
    }

    updateSettings() {
        // Apply settings changes
        console.log('Settings updated:', {
            resolution: this.resolution3D.value,
            quality: this.renderQuality.value,
            aiLevel: this.aiLevel.value,
            animations: this.animationToggle?.checked
        });
        
        this.showNotification('Configuración actualizada');
    }

    updateAILevel(level) {
        // Update AI recommendations based on level
        console.log('AI Level updated:', level);
    }

    toggleAnimations(enabled) {
        if (this.threeRenderer?.domElement) {
            this.threeRenderer.domElement.style.animation = enabled ? 'pulse 2s infinite' : 'none';
        }
    }

    updateStats() {
        // Update stat values with animation
        const stats = document.querySelectorAll('.stat-value');
        stats.forEach(stat => {
            const currentValue = stat.textContent;
            const newValue = stat.textContent.includes('Hz') ? 
                (4 + Math.random() * 30).toFixed(1) + ' Hz' :
                Math.round(60 + Math.random() * 40) + '%';
            
            stat.style.transform = 'scale(1.1)';
            stat.textContent = newValue;
            
            setTimeout(() => {
                stat.style.transform = 'scale(1)';
            }, 300);
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    loadUserData() {
        const savedData = localStorage.getItem('neuroflowUserData');
        if (savedData) {
            const userData = JSON.parse(savedData);
            this.userLevel = userData.userLevel || 7;
            this.userPoints = userData.userPoints || 8450;
            
            document.querySelector('.user-level span').textContent = `Nivel ${this.userLevel}`;
            document.querySelector('.user-points span').textContent = `${this.userPoints.toLocaleString()} Puntos`;
        }
    }

    saveUserData() {
        const userData = {
            userLevel: this.userLevel,
            userPoints: this.userPoints
        };
        localStorage.setItem('neuroflowUserData', JSON.stringify(userData));
    }

    switchView(viewName) {
        this.views.forEach(view => {
            view.classList.remove('active');
        });
        document.querySelector(`.${viewName}-view`).classList.add('active');
        
        this.navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === viewName) {
                btn.classList.add('active');
            }
        });
        
        this.currentView = viewName;
        
        // Initialize specific view components
        if (viewName === 'visualization') {
            this.initializeThreeJS();
        } else if (viewName === 'analysis') {
            this.drawTrendChart();
        }
    }

    drawTrendChart() {
        const canvas = document.getElementById('trendCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = [65, 72, 78, 82, 85, 88, 92, 94];
        const labels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom', 'Hoy'];
        const maxValue = Math.max(...data);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 5; i++) {
            const y = (canvas.height - 40) * (i / 5) + 20;
            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(canvas.width - 20, y);
            ctx.stroke();
        }
        
        // Draw line chart
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = 40 + (index * (canvas.width - 60) / (data.length - 1));
            const y = canvas.height - 20 - ((value / maxValue) * (canvas.height - 40));
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        data.forEach((value, index) => {
            const x = 40 + (index * (canvas.width - 60) / (data.length - 1));
            const y = canvas.height - 20 - ((value / maxValue) * (canvas.height - 40));
            
            ctx.fillStyle = '#8b5cf6';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#94a3b8';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(labels[index], x, canvas.height - 5);
        });
        
        // Draw title
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Progreso Cognitivo Semanal', canvas.width / 2, 15);
    }

    init() {
        this.switchView('visualization');
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new NeuroFlowApp();
    app.init();
});
