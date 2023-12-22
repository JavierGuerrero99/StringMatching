function tunedBM(pattern, text) {
  const ASIZE = 256;
  const m = pattern.length;
  const n = text.length;
  const bmBc = new Array(ASIZE).fill(0);
  let highlightedText = '';
  let indices = [];
  let count = 0;

  function preBmBc(x, m, bmBc) {
    for (let i = 0; i < ASIZE; ++i) {
      bmBc[i] = m;
    }
    for (let i = 0; i < m - 1; ++i) {
      bmBc[x.charCodeAt(i)] = m - i - 1;
    }
  }

  // Preprocessing
  preBmBc(pattern, m, bmBc);
  const shift = bmBc[pattern.charCodeAt(m - 1)];
  bmBc[pattern.charCodeAt(m - 1)] = 0;
  let paddedText = text.padEnd(n + m - 1, pattern[m - 1]);

  // Searching
  let j = 0;
  let i = 0;

  while (i < n) {
    j = m - 1;

    while (j >= 0 && pattern[j] === paddedText[i + j]) {
      j--;
    }

    if (j < 0) {
      highlightedText += `<span class="marcador">${text.substring(i, i + m)}</span>`;
      indices.push(i);
      count++;
      i += m;
    } else {
      highlightedText += text[i];
      i++;
    }
  }

  const result = document.getElementById("output");
  if (indices.length > 0) {
    result.value = `The "${pattern}" is matched ${count} times in the text: ${indices.join(", ")}`;
  } else {
    result.value = `The "${pattern}" is not found in the text.`;
  }

  return highlightedText;
}



let text = "";

function loadTXT() {
  const archivoInput = document.getElementById("fileInput");
  const archivo = archivoInput.files[0];

  if (archivo) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const contenido = e.target.result;
      text = contenido;
      const result = document.getElementById("output");
      result.value = "Archivo cargado exitosamente.";
    };
    reader.readAsText(archivo);
  }
}

let indices = [];

function match() {
  const pattern = document.getElementById("pattern").value;
  const result = document.getElementById("template");
  if (text == "") {
    alert("You must upload a text file first.", "Error");
  }
  let q = 101;
  textM = tunedBM(pattern, text);
  result.innerHTML = textM;
}

function generatePDF() {
  const template = document.getElementById("template");
  const textR = template.innerHTML;

  html2pdf()
    .set({
      margin: 1,
      filename: "resultado.pdf",
      html2canvas: { scale: 3 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    })
    .from(textR)
    .save()
    .catch((err) => console.log(err));
  const result = document.getElementById("output");
  result.value = "PDF generated successfully.";
}