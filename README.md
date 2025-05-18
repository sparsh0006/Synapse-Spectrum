# Synapse Spectrum - Neon 3D Mind Map Builder

✨ **Visualize Your Ideas in an Immersive 3D Neon Space** ✨

Synapse Spectrum transforms brainstorming and organization by moving beyond flat diagrams into a dynamic, interconnected 3D mind map with a stunning neon aesthetic.

**Live Demo:** [https://synapse-spectrum.vercel.app/](https://synapse-spectrum.vercel.app/)

---

## 🚀 Core Features

*   **Immersive 3D Environment:** Build and navigate mind maps in interactive 3D.
*   **Dynamic Node Management:** Add root/child nodes, edit titles (double-click), delete nodes.
*   **Basic Task Integration:** Add descriptions, statuses, and due dates to nodes via prompts.
*   **Calculated 3D Layouts:** Custom hybrid algorithm (horizontal & radial) using Z-depth to minimize overlap.
*   **Interactive Controls:** Pan, zoom, rotate the scene; drag nodes to reposition.
*   **Neon Aesthetics:** Glowing elements, neon gradients, and a dark background.
*   **Export:** Save your mind map view as a PNG image.
*   **Responsive Landing Page:** Introduces the app with animations and a consistent theme.

## 💡 Design & 3D Focus

Synapse Spectrum leverages 3D for intuitive visualization of hierarchical information.
*   **Spatial Organization:** X, Y, Z coordinates for clarity, with Z-depth separating branches.
*   **Neon Theme:** Striking visuals to enhance focus on information structure.
*   **Custom Layout:** Fine-grained control over node placement with a hybrid tree/radial algorithm.
*   **Interactive Experience:** Direct control over perspective and idea arrangement.
*   **Minimalist 3D Elements:** Glowing cubes and clear connection lines.

## 🛠️ Tech Stack

*   **Frontend:** React, TypeScript, React Three Fiber (R3F), Three.js, @react-three/drei, @react-three/postprocessing, Tailwind CSS, Framer Motion, React Router DOM.
*   **Build Tool:** Webpack, Babel.
*   **Layout:** Custom JavaScript algorithm.
*   **Utilities:** `html2canvas`, `uuid`.

## ⚙️ Setup and Running Locally

1.  **Clone the repository and navigate into the directory:**
    ```bash
    git clone https://github.com/sparsh0006/Synapse-Spectrum.git && cd Synapse-Spectrum
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will typically open the application in your default browser at `http://localhost:3000`.

4.  **Build for production:**
    ```bash
    npm run build
    ```
    The production-ready files will be in the `dist/` directory.

## 📜 How It Works (App Usage)

1.  **Visit Landing Page:** Learn about Synapse Spectrum.
2.  **Launch App:** Navigate to the mind map builder.
3.  **Manage Nodes:** Use sidebar and on-node interactions (click, double-click) to add, edit, detail, and delete nodes.
4.  **Navigate Scene:** Use mouse (left-click drag, scroll, middle-click drag or Shift+drag) to explore.
5.  **Export/Reset:** Use sidebar buttons.

## 🚧 Future Ideas

*   Advanced UI for task details (modals).
*   More layout options & customization.
*   Persistence (saving/loading).
*   Improved overlap avoidance.
*   Performance optimizations.
*   Accessibility & mobile enhancements.

## 🤝 Contributing

Contributions are welcome!
1.  Fork the repo.
2.  Create a feature/bugfix branch.
3.  Make changes & test.
4.  Commit with clear messages.
5.  Push to your fork.
6.  Open a Pull Request against `main`.
Discuss large changes via an issue first.

## 📄 License

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md).

---

Made with ❤️ during the CodeCircuit Hackathon.
