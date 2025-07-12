class InsectCatalog {
  constructor() {
    this.insects = [];
    this.init();
  }

  async init() {
    try {
      await this.loadCSVData();
      this.renderInsects();
    } catch (error) {
      this.showError("Error al cargar los datos: " + error.message);
    }
  }

  async loadCSVData() {
    try {
      const response = await fetch(
        "./RECURSOS/FILES/TablaChinches(Heteroptera).csv"
      );
      const csvText = await response.text();
      this.parseCSV(csvText);
    } catch (error) {
      throw new Error("No se pudo cargar el archivo CSV");
    }
  }

  parseCSV(csvText) {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",");

    // Crear objeto para cada insecto (cada columna después de la primera)
    for (let col = 1; col < headers.length; col++) {
      const insectData = {
        nombre: headers[col],
        forma: "",
        antenas: "",
        alas: "",
        habitat: "",
        notasClave: "",
        fotoEnlace: "",
      };

      // Llenar los datos de cada fila
      for (let row = 1; row < lines.length; row++) {
        const values = this.parseCSVLine(lines[row]);
        const characteristic = values[0];
        const value = values[col] || "";

        switch (characteristic.toLowerCase()) {
          case "forma":
            insectData.forma = value;
            break;
          case "antenas":
            insectData.antenas = value;
            break;
          case "alas":
            insectData.alas = value;
            break;
          case "habitat":
            insectData.habitat = value;
            break;
          case "notas clave":
            insectData.notasClave = value;
            break;
          case "fotoenlace":
            insectData.fotoEnlace = value;
            break;
        }
      }

      if (insectData.nombre) {
        this.insects.push(insectData);
      }
    }
  }

  parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  renderInsects() {
    const container = document.getElementById("insects-container");

    if (!container) {
      this.showError("No se encontró el contenedor de insectos");
      return;
    }

    container.innerHTML = "";

    this.insects.forEach((insect, index) => {
      const card = this.createInsectCard(insect, index);
      container.appendChild(card);
    });
  }

  createInsectCard(insect, index) {
    const card = document.createElement("div");
    card.className = "insect-card";
    card.onclick = () => this.showDetail(insect);

    // Corregir rutas de imágenes locales conocidas
    let imageUrl = insect.fotoEnlace;
    if (imageUrl === "../FOTOS/Coreidae.jpeg") {
      imageUrl = "./RECURSOS/FOTOS/Coreidae01.jpeg";
    } else if (imageUrl === "../FOTOS/Reduviidae01.jpeg") {
      imageUrl = "./RECURSOS/FOTOS/Reduviidae01.jpeg";
    } else if (!imageUrl || imageUrl.trim() === "") {
      imageUrl = "./RECURSOS/IMAGENES/insects.png";
    }

    card.innerHTML = `
            <img src="${imageUrl}" alt="${insect.nombre}" class="insect-image" 
                 onerror="this.handleImageError(this, '${insect.nombre}')"
                 onload="this.style.opacity = '1'">
            <h3 class="insect-name">${insect.nombre}</h3>
            <div class="insect-info">
                <div class="info-item">
                    <span class="info-label">Forma:</span>
                    <span class="info-value">${insect.forma}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Hábitat:</span>
                    <span class="info-value">${insect.habitat}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Antenas:</span>
                    <span class="info-value">${insect.antenas}</span>
                </div>
            </div>
        `;

    return card;
  }

  handleImageError(img, insectName) {
    img.src = "./RECURSOS/IMAGENES/insects.png";
    img.style.opacity = "0.7";
    img.title = `Imagen no disponible para ${insectName}`;
    console.log(`No se pudo cargar la imagen para: ${insectName}`);
  }

  showDetail(insect) {
    // Guardar los datos del insecto en localStorage para la página de detalle
    localStorage.setItem("selectedInsect", JSON.stringify(insect));

    // Redirigir a la página de detalle
    window.location.href = "./HTML/detalle.html";
  }

  showError(message) {
    const container = document.getElementById("insects-container");
    if (container) {
      container.innerHTML = `<div class="error">${message}</div>`;
    }
  }
}

// Inicializar cuando se cargue la página
document.addEventListener("DOMContentLoaded", () => {
  const catalog = new InsectCatalog();
  
  // Hacer el método handleImageError accesible globalmente
  window.handleImageError = function(img, insectName) {
    catalog.handleImageError(img, insectName);
  };
});
