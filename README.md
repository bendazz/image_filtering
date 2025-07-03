# 🖼️ Interactive Image Filtering with Kernels

A web-based interactive application that demonstrates image filtering using convolution kernels. Users can apply various well-known image processing filters to images and see the effects in real-time.

## 🌟 Features

- **Interactive Web Interface**: Clean, modern UI with real-time preview
- **Multiple Kernels**: 10 different convolution kernels including:
  - Identity (Original)
  - Gaussian Blur
  - Box Blur
  - Sharpen
  - Edge Detection (Laplacian)
  - Emboss
  - Sobel X & Y (Edge Detection)
  - Motion Blur
  - Unsharp Mask

- **Sample Images**: 
  - Choose from 6 different sample images
  - Each designed to showcase specific filtering effects
  - Includes geometric shapes, gradients, patterns, and fractals
  
- **Adjustable Parameters**:
  - Kernel strength slider (0.1x to 2.0x)
  - Real-time kernel matrix display
  - Detailed kernel descriptions

- **Educational**: Each kernel includes explanations of its effects and use cases

## 🖼️ Sample Images

The application includes 6 carefully designed sample images to demonstrate different filtering effects:

1. **Geometric Shapes** - Mixed shapes with gradient background, perfect for general testing
2. **Color Gradients** - Linear and radial gradients ideal for color-based filters
3. **Checkerboard Pattern** - High contrast pattern excellent for edge detection
4. **Noise Pattern** - Random grayscale noise for testing blur and smoothing filters
5. **Mandelbrot Fractal** - Complex mathematical pattern with fine details
6. **Concentric Circles** - Circular patterns ideal for testing radial effects

## 🚀 Getting Started

1. **Clone or download** this repository
2. **Open `index.html`** in a web browser
3. **Select a sample image** from the dropdown and click "Load Selected Image"
4. **Select a kernel** from the dropdown menu
5. **Adjust the strength** using the slider if desired
6. **Click "Apply Filter"** to see the effect
7. **Use "Reset to Original"** to return to the unfiltered image

## 📊 Available Kernels

### 3x3 Kernels

#### Identity
```
[0, 0, 0]
[0, 1, 0]
[0, 0, 0]
```
Returns the original image unchanged - useful for testing.

#### Gaussian Blur
```
[1, 2, 1]
[2, 4, 2] ÷ 16
[1, 2, 1]
```
Smooths the image with a natural-looking blur effect.

#### Box Blur
```
[1, 1, 1]
[1, 1, 1] ÷ 9
[1, 1, 1]
```
Simple averaging blur effect.

#### Sharpen
```
[ 0, -1,  0]
[-1,  5, -1]
[ 0, -1,  0]
```
Enhances edges and details.

#### Edge Detection (Laplacian)
```
[ 0, -1,  0]
[-1,  4, -1]
[ 0, -1,  0]
```
Highlights edges and rapid intensity changes.

#### Emboss
```
[-2, -1,  0]
[-1,  1,  1]
[ 0,  1,  2]
```
Creates a 3D raised/carved effect.

#### Sobel X (Vertical Edges)
```
[-1,  0,  1]
[-2,  0,  2]
[-1,  0,  1]
```
Detects vertical edges.

#### Sobel Y (Horizontal Edges)
```
[-1, -2, -1]
[ 0,  0,  0]
[ 1,  2,  1]
```
Detects horizontal edges.

### 5x5 Kernels

#### Motion Blur
```
[1, 0, 0, 0, 0]
[0, 1, 0, 0, 0]
[0, 0, 1, 0, 0] ÷ 5
[0, 0, 0, 1, 0]
[0, 0, 0, 0, 1]
```
Creates diagonal motion blur effect.

#### Unsharp Mask
Advanced sharpening technique for professional results.

## 🛠️ Technical Details

### How Convolution Works

1. **Kernel Application**: Each pixel's new value is calculated by multiplying surrounding pixels with corresponding kernel values
2. **Normalization**: Many kernels are divided by a sum (divisor) to prevent brightness changes
3. **Edge Handling**: Pixels at image borders are handled by clamping to nearest valid pixel
4. **Color Channels**: Each color channel (R, G, B) is processed independently

### Implementation Features

- **HTML5 Canvas**: Used for image rendering and pixel manipulation
- **Real-time Processing**: Filters are applied using JavaScript's ImageData API
- **Responsive Design**: Works on desktop and mobile devices
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🎯 Educational Value

This application is perfect for:
- **Learning image processing concepts**
- **Understanding convolution operations**
- **Experimenting with different kernel effects**
- **Visualizing how filters affect images**
- **Teaching computer vision basics**

## 🔧 Customization

You can easily add new kernels by:
1. Adding a new entry to the `getKernels()` method in `script.js`
2. Including the kernel matrix, divisor, name, and description
3. Adding the option to the select dropdown in `index.html`

## 📱 Browser Support

- **Modern browsers** with HTML5 Canvas support
- **Chrome, Firefox, Safari, Edge** (latest versions)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Feel free to:
- Add new kernel types
- Improve the UI/UX
- Add more image processing features
- Enhance mobile responsiveness
- Add more educational content

## 📄 License

This project is open source and available under the MIT License.

---

**Happy filtering!** 🎨✨