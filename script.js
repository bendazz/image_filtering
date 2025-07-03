class ImageFilter {
    constructor() {
        this.originalImageData = null;
        this.currentKernel = null;
        this.kernelStrength = 1.0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateGeometricShapes(); // Load default image
        this.updateKernelDisplay();
        this.applyFilter(); // Apply initial filter
    }

    initializeElements() {
        this.sampleImageSelect = document.getElementById('sampleImageSelect');
        this.kernelSelect = document.getElementById('kernelSelect');
        this.strengthSlider = document.getElementById('strengthSlider');
        this.strengthValue = document.getElementById('strengthValue');
        this.applyBtn = document.getElementById('applyBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.originalCanvas = document.getElementById('originalCanvas');
        this.filteredCanvas = document.getElementById('filteredCanvas');
        this.kernelDisplay = document.getElementById('kernelDisplay');
        this.kernelInfo = document.getElementById('kernelInfo');
        
        this.originalCtx = this.originalCanvas.getContext('2d');
        this.filteredCtx = this.filteredCanvas.getContext('2d');
    }

    setupEventListeners() {
        this.sampleImageSelect.addEventListener('change', () => this.loadSelectedImage());
        this.kernelSelect.addEventListener('change', () => {
            this.updateKernelDisplay();
            this.applyFilter(); // Automatically apply filter when kernel changes
        });
        this.strengthSlider.addEventListener('input', (e) => {
            this.kernelStrength = parseFloat(e.target.value);
            this.strengthValue.textContent = this.kernelStrength.toFixed(1);
            this.applyFilter(); // Automatically apply filter when strength changes
        });
        this.applyBtn.addEventListener('click', () => this.applyFilter());
        this.resetBtn.addEventListener('click', () => this.resetToOriginal());
    }

    // Kernel definitions
    getKernels() {
        return {
            identity: {
                matrix: [
                    [0, 0, 0],
                    [0, 1, 0],
                    [0, 0, 0]
                ],
                divisor: 1,
                name: "Identity",
                description: "Returns the original image unchanged. Used as a baseline for testing."
            },
            gaussianBlur: {
                matrix: [
                    [1, 2, 1],
                    [2, 4, 2],
                    [1, 2, 1]
                ],
                divisor: 16,
                name: "Gaussian Blur",
                description: "Smooths the image by averaging neighboring pixels with a Gaussian weight distribution. Reduces noise and creates a natural-looking blur effect."
            },
            boxBlur: {
                matrix: [
                    [1, 1, 1],
                    [1, 1, 1],
                    [1, 1, 1]
                ],
                divisor: 9,
                name: "Box Blur",
                description: "Simple blur effect that averages all surrounding pixels equally. Creates a uniform blur but less sophisticated than Gaussian blur."
            },
            sharpen: {
                matrix: [
                    [0, -1, 0],
                    [-1, 5, -1],
                    [0, -1, 0]
                ],
                divisor: 1,
                name: "Sharpen",
                description: "Enhances edges and details by emphasizing differences between neighboring pixels. Makes the image appear crisper and more defined."
            },
            edgeDetection: {
                matrix: [
                    [0, -1, 0],
                    [-1, 4, -1],
                    [0, -1, 0]
                ],
                divisor: 1,
                name: "Edge Detection (Laplacian)",
                description: "Highlights edges and rapid intensity changes in the image. Useful for finding boundaries and structural features."
            },
            emboss: {
                matrix: [
                    [-2, -1, 0],
                    [-1, 1, 1],
                    [0, 1, 2]
                ],
                divisor: 1,
                name: "Emboss",
                description: "Creates a raised or carved appearance by emphasizing edges in one direction. Gives the image a 3D sculptural effect."
            },
            sobelX: {
                matrix: [
                    [-1, 0, 1],
                    [-2, 0, 2],
                    [-1, 0, 1]
                ],
                divisor: 1,
                name: "Sobel X (Vertical Edges)",
                description: "Detects vertical edges by calculating horizontal gradients. Part of the Sobel edge detection algorithm."
            },
            sobelY: {
                matrix: [
                    [-1, -2, -1],
                    [0, 0, 0],
                    [1, 2, 1]
                ],
                divisor: 1,
                name: "Sobel Y (Horizontal Edges)",
                description: "Detects horizontal edges by calculating vertical gradients. Complements Sobel X for complete edge detection."
            },
            motionBlur: {
                matrix: [
                    [1, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 1, 0],
                    [0, 0, 0, 0, 1]
                ],
                divisor: 5,
                name: "Motion Blur",
                description: "Creates a diagonal motion blur effect, simulating camera shake or object movement during exposure."
            },
            unsharpMask: {
                matrix: [
                    [0, -1, 0],
                    [-1, 5, -1],
                    [0, -1, 0]
                ],
                divisor: 1,
                name: "Unsharp Mask",
                description: "Advanced sharpening technique that enhances details while preserving natural appearance. Used in professional image editing."
            }
        };
    }

    updateKernelDisplay() {
        const kernels = this.getKernels();
        const selectedKernel = this.kernelSelect.value;
        const kernel = kernels[selectedKernel];
        
        this.currentKernel = kernel;
        
        // Display kernel matrix
        let displayText = kernel.matrix.map(row => 
            '[' + row.map(val => val.toString().padStart(3)).join(',') + ']'
        ).join('<br>');
        
        if (kernel.divisor !== 1) {
            displayText += `<br><br>÷ ${kernel.divisor}`;
        }
        
        this.kernelDisplay.innerHTML = displayText;
        
        // Update kernel info
        this.kernelInfo.innerHTML = `
            <h4>${kernel.name}</h4>
            <p>${kernel.description}</p>
        `;
    }

    loadSelectedImage() {
        const selectedType = this.sampleImageSelect.value;
        if (!selectedType) return;

        switch (selectedType) {
            case 'geometric':
                this.generateGeometricShapes();
                break;
            case 'gradient':
                this.generateGradientImage();
                break;
            case 'checkerboard':
                this.generateCheckerboard();
                break;
            case 'noise':
                this.generateNoisePattern();
                break;
            case 'mandelbrot':
                this.generateMandelbrotFractal();
                break;
            case 'circles':
                this.generateConcentricCircles();
                break;
            case 'hilbert':
                this.loadHilbertPhotograph();
                break;
        }
    }

    generateGeometricShapes() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 400, 300);
        gradient.addColorStop(0, '#ff9a9e');
        gradient.addColorStop(0.5, '#fecfef');
        gradient.addColorStop(1, '#fecfef');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 300);
        
        // Add geometric shapes for testing
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(50, 50, 100, 100);
        
        ctx.fillStyle = '#ed8936';
        ctx.beginPath();
        ctx.arc(300, 100, 50, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#38a169';
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.lineTo(250, 150);
        ctx.lineTo(300, 200);
        ctx.lineTo(275, 250);
        ctx.lineTo(225, 250);
        ctx.closePath();
        ctx.fill();
        
        // Add some text
        ctx.fillStyle = '#2d3748';
        ctx.font = '24px Arial';
        ctx.fillText('Geometric Shapes', 50, 280);
        
        this.setCanvasAsOriginal(canvas);
    }

    generateGradientImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Create multiple gradients
        const gradient1 = ctx.createLinearGradient(0, 0, 400, 0);
        gradient1.addColorStop(0, '#ff0000');
        gradient1.addColorStop(0.5, '#00ff00');
        gradient1.addColorStop(1, '#0000ff');
        ctx.fillStyle = gradient1;
        ctx.fillRect(0, 0, 400, 100);
        
        const gradient2 = ctx.createRadialGradient(200, 200, 0, 200, 200, 150);
        gradient2.addColorStop(0, '#ffff00');
        gradient2.addColorStop(0.5, '#ff00ff');
        gradient2.addColorStop(1, '#00ffff');
        ctx.fillStyle = gradient2;
        ctx.fillRect(0, 100, 400, 200);
        
        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial';
        ctx.fillText('Color Gradients', 10, 25);
        
        this.setCanvasAsOriginal(canvas);
    }

    generateCheckerboard() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        const squareSize = 25;
        for (let y = 0; y < 300; y += squareSize) {
            for (let x = 0; x < 400; x += squareSize) {
                const isEven = (Math.floor(x / squareSize) + Math.floor(y / squareSize)) % 2 === 0;
                ctx.fillStyle = isEven ? '#ffffff' : '#000000';
                ctx.fillRect(x, y, squareSize, squareSize);
            }
        }
        
        this.setCanvasAsOriginal(canvas);
    }

    generateNoisePattern() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        const imageData = ctx.createImageData(400, 300);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const value = Math.random() * 255;
            imageData.data[i] = value;     // R
            imageData.data[i + 1] = value; // G
            imageData.data[i + 2] = value; // B
            imageData.data[i + 3] = 255;   // A
        }
        ctx.putImageData(imageData, 0, 0);
        
        this.setCanvasAsOriginal(canvas);
    }

    generateMandelbrotFractal() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        const imageData = ctx.createImageData(400, 300);
        const maxIterations = 50;
        
        for (let x = 0; x < 400; x++) {
            for (let y = 0; y < 300; y++) {
                const c_re = (x - 200) * 4.0 / 400;
                const c_im = (y - 150) * 4.0 / 300;
                let z_re = 0, z_im = 0;
                let iterations = 0;
                
                while (z_re * z_re + z_im * z_im < 4 && iterations < maxIterations) {
                    const temp = z_re * z_re - z_im * z_im + c_re;
                    z_im = 2 * z_re * z_im + c_im;
                    z_re = temp;
                    iterations++;
                }
                
                const index = (y * 400 + x) * 4;
                const color = iterations === maxIterations ? 0 : (iterations / maxIterations) * 255;
                imageData.data[index] = color;
                imageData.data[index + 1] = color * 0.7;
                imageData.data[index + 2] = color * 0.3;
                imageData.data[index + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        
        this.setCanvasAsOriginal(canvas);
    }

    generateConcentricCircles() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 400, 300);
        
        // Draw concentric circles
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        const centerX = 200;
        const centerY = 150;
        
        for (let radius = 10; radius < 150; radius += 15) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Add some filled circles for variety
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(100, 100, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#4ecdc4';
        ctx.beginPath();
        ctx.arc(300, 200, 25, 0, Math.PI * 2);
        ctx.fill();
        
        this.setCanvasAsOriginal(canvas);
    }

    setCanvasAsOriginal(canvas) {
        // Copy to original canvas
        this.originalCtx.clearRect(0, 0, this.originalCanvas.width, this.originalCanvas.height);
        this.originalCtx.drawImage(canvas, 0, 0);
        this.originalImageData = this.originalCtx.getImageData(0, 0, this.originalCanvas.width, this.originalCanvas.height);
        this.resetToOriginal();
        this.applyFilter(); // Automatically apply current filter to new image
    }

    drawImageToCanvas(img, canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate scaling to fit image in canvas while maintaining aspect ratio
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    }

    applyFilter() {
        if (!this.originalImageData || !this.currentKernel) return;
        
        this.applyBtn.classList.add('loading');
        
        // Use setTimeout to allow UI to update
        setTimeout(() => {
            const filteredData = this.applyConvolution(this.originalImageData, this.currentKernel, this.kernelStrength);
            this.filteredCtx.putImageData(filteredData, 0, 0);
            this.applyBtn.classList.remove('loading');
        }, 10);
    }

    applyConvolution(imageData, kernel, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const inputData = imageData.data;
        const outputData = new Uint8ClampedArray(inputData.length);
        
        const matrix = kernel.matrix;
        const divisor = kernel.divisor;
        const kernelSize = matrix.length;
        const halfKernel = Math.floor(kernelSize / 2);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0;
                
                // Apply kernel
                for (let ky = 0; ky < kernelSize; ky++) {
                    for (let kx = 0; kx < kernelSize; kx++) {
                        const px = x + kx - halfKernel;
                        const py = y + ky - halfKernel;
                        
                        // Handle edge cases by clamping
                        const clampedX = Math.max(0, Math.min(width - 1, px));
                        const clampedY = Math.max(0, Math.min(height - 1, py));
                        
                        const pixelIndex = (clampedY * width + clampedX) * 4;
                        const kernelValue = matrix[ky][kx];
                        
                        r += inputData[pixelIndex] * kernelValue;
                        g += inputData[pixelIndex + 1] * kernelValue;
                        b += inputData[pixelIndex + 2] * kernelValue;
                    }
                }
                
                // Apply divisor and strength
                r = (r / divisor) * strength;
                g = (g / divisor) * strength;
                b = (b / divisor) * strength;
                
                // Blend with original based on strength
                const outputIndex = (y * width + x) * 4;
                const originalR = inputData[outputIndex];
                const originalG = inputData[outputIndex + 1];
                const originalB = inputData[outputIndex + 2];
                
                // For certain filters, we want different blending
                if (kernel.name.includes('Edge') || kernel.name.includes('Emboss')) {
                    // For edge detection, add 128 to make edges visible
                    r += 128;
                    g += 128;
                    b += 128;
                }
                
                outputData[outputIndex] = Math.max(0, Math.min(255, r));
                outputData[outputIndex + 1] = Math.max(0, Math.min(255, g));
                outputData[outputIndex + 2] = Math.max(0, Math.min(255, b));
                outputData[outputIndex + 3] = inputData[outputIndex + 3]; // Alpha
            }
        }
        
        return new ImageData(outputData, width, height);
    }

    resetToOriginal() {
        if (!this.originalImageData) return;
        this.filteredCtx.putImageData(this.originalImageData, 0, 0);
    }

    loadHilbertPhotograph() {
        // Load the actual David Hilbert photograph from Wikimedia Commons
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Enable CORS for external image
        img.onload = () => {
            this.drawImageToCanvas(img, this.originalCanvas);
            this.originalImageData = this.originalCtx.getImageData(0, 0, this.originalCanvas.width, this.originalCanvas.height);
            this.resetToOriginal();
            this.applyFilter(); // Automatically apply current filter to new image
        };
        img.onerror = () => {
            // Fallback to placeholder if image fails to load
            console.warn('Failed to load Hilbert photograph, using placeholder');
            this.loadHilbertPlaceholder();
        };
        img.src = 'https://upload.wikimedia.org/wikipedia/commons/7/79/Hilbert.jpg';
    }

    loadHilbertPlaceholder() {
        // Fallback placeholder if the external image fails to load
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Create a sepia-toned background to simulate an old photograph
        const gradient = ctx.createLinearGradient(0, 0, 400, 300);
        gradient.addColorStop(0, '#f4f1e8');
        gradient.addColorStop(0.5, '#e8dcc0');
        gradient.addColorStop(1, '#d4c4a0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 300);
        
        // Add some texture to simulate an old photograph
        ctx.fillStyle = '#8b7355';
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.fillText('David Hilbert', 200, 50);
        ctx.font = '16px serif';
        ctx.fillText('(1862-1943)', 200, 75);
        
        // Draw a simple representation
        ctx.fillStyle = '#654321';
        ctx.fillRect(150, 100, 100, 120);
        ctx.fillStyle = '#432818';
        ctx.fillRect(175, 110, 50, 40);
        
        // Add some age spots/texture
        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = `rgba(139, 115, 85, ${Math.random() * 0.3})`;
            ctx.fillRect(Math.random() * 400, Math.random() * 300, 2, 2);
        }
        
        ctx.fillStyle = '#2d1810';
        ctx.font = '12px serif';
        ctx.textAlign = 'center';
        ctx.fillText('Image failed to load - using placeholder', 200, 280);
        
        this.setCanvasAsOriginal(canvas);
    }

    // Method to load actual photograph from data URL
    loadHilbertFromDataURL(dataURL) {
        const img = new Image();
        img.onload = () => {
            this.drawImageToCanvas(img, this.originalCanvas);
            this.originalImageData = this.originalCtx.getImageData(0, 0, this.originalCanvas.width, this.originalCanvas.height);
            this.resetToOriginal();
        };
        img.src = dataURL;
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ImageFilter();
});
