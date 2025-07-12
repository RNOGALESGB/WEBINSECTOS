class InsectDetail {
  constructor() {
    this.init();
  }

  init() {
    try {
      const insectData = this.getInsectData();
      if (insectData) {
        this.renderDetail(insectData);
      } else {
        this.showError("No se encontraron datos del insecto");
      }
    } catch (error) {
      this.showError("Error al cargar los detalles: " + error.message);
    }
  }

  getInsectData() {
    const data = localStorage.getItem("selectedInsect");
    return data ? JSON.parse(data) : null;
  }

  renderDetail(insect) {
    // Actualizar el título de la página
    document.title = `${insect.nombre} - Detalle del Insecto`;

    // Actualizar elementos del DOM
    this.updateElement("insect-name", insect.nombre);
    this.updateElement(
      "forma-text",
      insect.forma || "Información no disponible"
    );
    this.updateElement(
      "antenas-text",
      insect.antenas || "Información no disponible"
    );
    this.updateElement("alas-text", insect.alas || "Información no disponible");
    this.updateElement(
      "habitat-text",
      insect.habitat || "Información no disponible"
    );
    this.updateElement(
      "notas-text",
      insect.notasClave || "Información no disponible"
    );

    // Actualizar imagen
    const imageElement = document.getElementById("insect-image");
    if (imageElement) {
      // Corregir rutas de imágenes locales conocidas
      let imageUrl = insect.fotoEnlace;
      if (imageUrl === "../FOTOS/Coreidae.jpeg") {
        imageUrl = "../RECURSOS/FOTOS/Coreidae01.jpeg";
      } else if (imageUrl === "../FOTOS/Reduviidae01.jpeg") {
        imageUrl = "../RECURSOS/FOTOS/Reduviidae01.jpeg";
      } else if (!imageUrl || imageUrl.trim() === "") {
        imageUrl = "../RECURSOS/IMAGENES/insects.png";
      }
      
      imageElement.src = imageUrl;
      imageElement.alt = insect.nombre;
      imageElement.style.opacity = "0";

      // Manejar carga exitosa
      imageElement.onload = () => {
        imageElement.style.opacity = "1";
      };

      // Manejar error de carga de imagen
      imageElement.onerror = () => {
        imageElement.src = "../RECURSOS/IMAGENES/insects.png";
        imageElement.style.opacity = "0.7";
        imageElement.title = `Imagen no disponible para ${insect.nombre}`;
        console.log(`No se pudo cargar la imagen para: ${insect.nombre}`);
      };
    }
  }

  updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = content;
    }
  }

  showError(message) {
    const container = document.querySelector(".detail-container");
    if (container) {
      container.innerHTML = `
                <div class="error">
                    <h2>Error</h2>
                    <p>${message}</p>
                    <button class="back-btn" onclick="goBack()" style="margin-top: 20px;">
                        ← Volver al Catálogo
                    </button>
                </div>
            `;
    }
  }
}

// Función global para volver atrás
function goBack() {
  window.location.href = "../index.html";
}

// Inicializar cuando se cargue la página
document.addEventListener("DOMContentLoaded", () => {
  new InsectDetail();
});
