function stringSearch(text, pattern) {
  const ALPHABET_SIZE = 256;
  const n = text.length;
  const m = pattern.length;
  const badChar = new Array(ALPHABET_SIZE).fill(-1);

  function badCharHeuristic(pattern, m, badChar) {
    for (let i = 0; i < m; i++) {
      badChar[pattern.charCodeAt(i)] = i;
    }
  }

  badCharHeuristic(pattern, m, badChar);

  let s = 0;
  const indices = [];
  let count = 0;
  let highlightedText = "";

  while (s <= n - m) {
    let j = m - 1;

    while (j >= 0 && pattern[j] === text[s + j]) {
      j--;
    }

    if (j < 0) {
      indices.push(s);
      count++;
      highlightedText += `<span class="marcador">${text.substring(
        s,
        s + m
      )}</span>`;
      s += s + m < n ? m - badChar[text.charCodeAt(s + m)] : 1;
    } else {
      highlightedText += text[s];
      const jump = j - badChar[text.charCodeAt(s + j)];
      s += jump > 0 ? jump : 1;
    }
  }

  const result = document.getElementById("output");
  if (indices.length > 0) {
    result.value = `The "${pattern}" is matched ${
      indices.length
    } times in the text: ${indices.join(", ")}`;
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
      const result = document.getElementById("result");
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
  textM = stringSearch(text, pattern);
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
