document.addEventListener("DOMContentLoaded", () => {
  // --- Login ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const rut = document.getElementById("rut").value.trim();
      const password = document.getElementById("password").value.trim();
      const user = users.find(u => u.rut === rut && u.password === password);

      if (user) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        window.location.href = "report.html";
      } else {
        document.getElementById("loginMessage").innerText = "RUT o clave incorrecta.";
      }
    });
    return;
  }

  // --- Report page logic ---
  const reportPage = window.location.pathname.includes("report.html");
  if (!reportPage) return;

  const user = JSON.parse(localStorage.getItem("loggedUser"));
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  document.getElementById("supervisor").value = user.name;

  // --- Control de fecha: solo hoy o ayer ---
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yyyyy = yesterday.getFullYear();
    const ymm = String(yesterday.getMonth() + 1).padStart(2, '0');
    const ydd = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayStr = `${yyyyy}-${ymm}-${ydd}`;
    dateInput.setAttribute('max', todayStr);
    dateInput.setAttribute('min', yesterdayStr);
    dateInput.value = todayStr;
  }

  // --- Selección de cuadrilla multidisciplinaria con filtro de búsqueda ---
  const cuadrillaSelectorDiv = document.getElementById("cuadrillaSelector");
  const cuadrillaSeleccionadaDiv = document.getElementById("cuadrillaSeleccionada");
  let cuadrilla = [];

  // Estado de filtros de cuadrilla
  let cuadrillaFilterState = {
    especialidad: "",
    cargo: "",
    search: ""
  };

  function renderCuadrillaSelector() {
    cuadrillaSelectorDiv.innerHTML = "";

    // Especialidad
    const especialidadSelect = document.createElement("select");
    especialidadSelect.innerHTML = `<option value="">Especialidad</option>`;
    [...new Set(workers.map(w => w.especialidad))].forEach(esp => {
      especialidadSelect.innerHTML += `<option value="${esp}">${esp}</option>`;
    });
    if (cuadrillaFilterState.especialidad) especialidadSelect.value = cuadrillaFilterState.especialidad;

    // Cargo
    const cargoSelect = document.createElement("select");
    cargoSelect.innerHTML = `<option value="">Cargo</option>`;
    cargoSelect.disabled = !cuadrillaFilterState.especialidad;
    if (cuadrillaFilterState.especialidad) {
      const cargos = [...new Set(workers.filter(w => w.especialidad === cuadrillaFilterState.especialidad).map(w => w.cargo))];
      cargos.forEach(cargo => {
        cargoSelect.innerHTML += `<option value="${cargo}">${cargo}</option>`;
      });
      if (cuadrillaFilterState.cargo) cargoSelect.value = cuadrillaFilterState.cargo;
    }

    // Buscador de trabajadores
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Buscar trabajador por nombre...";
    searchInput.className = "worker-search-input";
    searchInput.disabled = !cuadrillaFilterState.especialidad;
    searchInput.value = cuadrillaFilterState.search;

    // Trabajadores (multiselect)
    const trabajadoresDiv = document.createElement("div");
    trabajadoresDiv.style.maxHeight = "120px";
    trabajadoresDiv.style.overflowY = "auto";
    trabajadoresDiv.style.margin = "8px 0";
    trabajadoresDiv.style.border = "1px solid #e5eaf1";
    trabajadoresDiv.style.borderRadius = "4px";
    trabajadoresDiv.style.padding = "6px 8px";
    trabajadoresDiv.style.background = "#f8fafc";

    // Botón agregar
    const btnAgregar = document.createElement("button");
    btnAgregar.type = "button";
    btnAgregar.textContent = "Agregar a cuadrilla";
    btnAgregar.className = "main-btn";
    btnAgregar.disabled = true;
    btnAgregar.style.marginLeft = "8px";

    let listaFiltrada = [];

    function updateTrabajadoresList() {
      trabajadoresDiv.innerHTML = "";
      let disponibles = workers.filter(w =>
        (!especialidadSelect.value || w.especialidad === especialidadSelect.value) &&
        (!cargoSelect.value || w.cargo === cargoSelect.value) &&
        !cuadrilla.some(c => c.rut === w.rut)
      );
      if (searchInput.value.trim()) {
        const filtro = searchInput.value.trim().toLowerCase();
        disponibles = disponibles.filter(w => w.nombre.toLowerCase().includes(filtro));
      }
      listaFiltrada = disponibles;
      disponibles.forEach(w => {
        const label = document.createElement("label");
        label.style.display = "block";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = w.rut;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(
          ` ${w.nombre} (${w.rut}) - ${w.especialidad} / ${w.cargo}`
        ));
        trabajadoresDiv.appendChild(label);
      });
      btnAgregar.disabled = trabajadoresDiv.querySelectorAll("input[type=checkbox]").length === 0;
    }

    especialidadSelect.addEventListener("change", function () {
      cuadrillaFilterState.especialidad = this.value;
      cuadrillaFilterState.cargo = "";
      cuadrillaFilterState.search = "";
      renderCuadrillaSelector();
    });

    cargoSelect.addEventListener("change", function () {
      cuadrillaFilterState.cargo = this.value;
      cuadrillaFilterState.search = "";
      updateTrabajadoresList();
    });

    searchInput.addEventListener("input", function () {
      cuadrillaFilterState.search = this.value;
      updateTrabajadoresList();
    });

    trabajadoresDiv.addEventListener("change", function () {
      btnAgregar.disabled = trabajadoresDiv.querySelectorAll("input[type=checkbox]:checked").length === 0;
    });

    btnAgregar.addEventListener("click", function () {
      const seleccionados = Array.from(trabajadoresDiv.querySelectorAll("input[type=checkbox]:checked")).map(cb => cb.value);
      if (seleccionados.length > 0) {
        const nuevos = workers.filter(w =>
          seleccionados.includes(w.rut) &&
          !cuadrilla.some(c => c.rut === w.rut)
        );
        cuadrilla = cuadrilla.concat(nuevos);
        renderCuadrillaSeleccionada();
        renderCuadrillaSelector();
      }
    });

    cuadrillaSelectorDiv.appendChild(especialidadSelect);
    cuadrillaSelectorDiv.appendChild(cargoSelect);
    cuadrillaSelectorDiv.appendChild(searchInput);
    cuadrillaSelectorDiv.appendChild(trabajadoresDiv);
    cuadrillaSelectorDiv.appendChild(btnAgregar);

    if (cuadrillaFilterState.especialidad) updateTrabajadoresList();
  }

  function renderCuadrillaSeleccionada() {
    cuadrillaSeleccionadaDiv.innerHTML = "";
    if (cuadrilla.length === 0) {
      cuadrillaSeleccionadaDiv.innerHTML = "<em>No hay trabajadores en la cuadrilla.</em>";
      return;
    }
    const ul = document.createElement("ul");
    ul.className = "cuadrilla-list";
    cuadrilla.forEach(w => {
      const li = document.createElement("li");
      li.textContent = `${w.nombre} (${w.rut}) - ${w.especialidad} / ${w.cargo}`;
      const btnQuitar = document.createElement("button");
      btnQuitar.type = "button";
      btnQuitar.textContent = "Quitar";
      btnQuitar.className = "remove-btn";
      btnQuitar.onclick = () => {
        cuadrilla = cuadrilla.filter(c => c.rut !== w.rut);
        renderCuadrillaSeleccionada();
      };
      li.appendChild(btnQuitar);
      ul.appendChild(li);
    });
    cuadrillaSeleccionadaDiv.appendChild(ul);
  }

  renderCuadrillaSelector();
  renderCuadrillaSeleccionada();

  // --- Selección de tareas y TAGs (con Choices.js en actividades) ---
  const tareasSelectorDiv = document.getElementById("tareasSelector");
  const tareasSeleccionadasDiv = document.getElementById("tareasSeleccionadas");
  let tareas = [];
  let tagsUtilizados = [];

  // Variables para mantener el estado de los selects
  let tareaSelectState = {
    proyecto: "",
    especialidad: "",
    area: "",
    actividad: "",
    tarea: "",
    tag: ""
  };

  function renderTareasSelector() {
    tareasSelectorDiv.innerHTML = "";

    // Primera fila: Proyecto, Especialidad, Área
    const row1 = document.createElement("div");
    row1.className = "tareas-selector-row";

    // Proyecto
    const proyectoSelect = document.createElement("select");
    proyectoSelect.innerHTML = `<option value="">Proyecto</option>`;
    projects.forEach(p => {
      proyectoSelect.innerHTML += `<option value="${p.nombre}">${p.nombre}</option>`;
    });
    if (tareaSelectState.proyecto) proyectoSelect.value = tareaSelectState.proyecto;

    // Especialidad
    const especialidadSelect = document.createElement("select");
    especialidadSelect.innerHTML = `<option value="">Especialidad</option>`;
    especialidadSelect.disabled = true;

    // Área
    const areaSelect = document.createElement("select");
    areaSelect.innerHTML = `<option value="">Área</option>`;
    areaSelect.disabled = true;

    // Segunda fila: Actividad (con Choices.js), Tarea, TAG, Botón
    const row2 = document.createElement("div");
    row2.className = "tareas-selector-row2";

    // Actividad select (con Choices.js)
    const actividadCol = document.createElement("div");
    actividadCol.className = "tareas-selector-actividad-col";
    const actividadSelect = document.createElement("select");
    actividadSelect.style.width = "100%";
    actividadSelect.innerHTML = `<option value="">Actividad</option>`;
    actividadSelect.disabled = true;
    actividadSelect.id = "actividadSelectChoices";
    actividadCol.appendChild(actividadSelect);

    // Tarea
    const tareaCol = document.createElement("div");
    tareaCol.className = "tareas-selector-tag-col";
    const tareaSelect = document.createElement("select");
    tareaSelect.innerHTML = `<option value="">Tarea</option>`;
    tareaSelect.disabled = true;
    tareaCol.appendChild(tareaSelect);

    // TAG
    const tagCol = document.createElement("div");
    tagCol.className = "tareas-selector-tag-col";
    const tagSelect = document.createElement("select");
    tagSelect.innerHTML = `<option value="">TAG</option>`;
    tagSelect.disabled = true;
    tagCol.appendChild(tagSelect);

    // Botón agregar tarea
    const btnAgregarTarea = document.createElement("button");
    btnAgregarTarea.type = "button";
    btnAgregarTarea.textContent = "Agregar tarea";
    btnAgregarTarea.className = "main-btn";
    btnAgregarTarea.disabled = true;
    btnAgregarTarea.style.marginLeft = "8px";

    function setSelectValue(select, value) {
      if (value && Array.from(select.options).some(opt => opt.value === value)) {
        select.value = value;
      }
    }

    // --- Eventos ---
    proyectoSelect.addEventListener("change", function () {
      tareaSelectState.proyecto = this.value;
      tareaSelectState.especialidad = "";
      tareaSelectState.area = "";
      tareaSelectState.actividad = "";
      tareaSelectState.tarea = "";
      tareaSelectState.tag = "";
      renderTareasSelector();
    });

    especialidadSelect.addEventListener("change", function () {
      tareaSelectState.especialidad = this.value;
      tareaSelectState.area = "";
      tareaSelectState.actividad = "";
      tareaSelectState.tarea = "";
      tareaSelectState.tag = "";
      renderTareasSelector();
    });

    areaSelect.addEventListener("change", function () {
      tareaSelectState.area = this.value;
      tareaSelectState.actividad = "";
      tareaSelectState.tarea = "";
      tareaSelectState.tag = "";
      renderTareasSelector();
    });

    actividadSelect.addEventListener("change", function () {
      tareaSelectState.actividad = this.value;
      tareaSelectState.tarea = "";
      tareaSelectState.tag = "";
      renderTareasSelector();
    });

    tareaSelect.addEventListener("change", function () {
      tareaSelectState.tarea = this.value;
      tareaSelectState.tag = "";
      renderTareasSelector();
    });

    tagSelect.addEventListener("change", function () {
      tareaSelectState.tag = this.value;
      btnAgregarTarea.disabled = false;
    });

    // --- Llenado dinámico de selects según estado ---
    if (proyectoSelect.value) {
      const proyecto = projects.find(p => p.nombre === proyectoSelect.value);
      if (proyecto) {
        proyecto.especialidades.forEach(e => {
          especialidadSelect.innerHTML += `<option value="${e.nombre}">${e.nombre}</option>`;
        });
        especialidadSelect.disabled = false;
        setSelectValue(especialidadSelect, tareaSelectState.especialidad);
      }
    }
    if (especialidadSelect.value) {
      const proyecto = projects.find(p => p.nombre === proyectoSelect.value);
      const especialidad = proyecto?.especialidades.find(e => e.nombre === especialidadSelect.value);
      if (especialidad) {
        especialidad.areas.forEach(a => {
          areaSelect.innerHTML += `<option value="${a.nombre}">${a.nombre}</option>`;
        });
        areaSelect.disabled = false;
        setSelectValue(areaSelect, tareaSelectState.area);
      }
    }
    if (areaSelect.value) {
      const proyecto = projects.find(p => p.nombre === proyectoSelect.value);
      const especialidad = proyecto?.especialidades.find(e => e.nombre === especialidadSelect.value);
      const area = especialidad?.areas.find(a => a.nombre === areaSelect.value);
      if (area) {
        let acts = area.actividades;
        acts.forEach(act => {
          actividadSelect.innerHTML += `<option value="${act.id}">${act.id} - ${act.descripcion}</option>`;
        });
        actividadSelect.disabled = false;
        setSelectValue(actividadSelect, tareaSelectState.actividad);
      }
    }

    // Inicializa Choices.js en el select de actividades (mejor búsqueda y ancho)
    setTimeout(() => {
      if (document.getElementById("actividadSelectChoices")) {
        if (window.actividadChoices) window.actividadChoices.destroy();
        window.actividadChoices = new Choices("#actividadSelectChoices", {
          searchEnabled: true,
          shouldSort: false,
          itemSelectText: '',
          placeholder: true,
          placeholderValue: 'Actividad',
          noResultsText: 'No hay resultados',
          searchPlaceholderValue: 'Buscar actividad...',
          searchFields: ['label', 'value'],
          fuseOptions: {
            threshold: 0.4,
            ignoreLocation: true,
            includeScore: true,
            keys: ['label', 'value']
          }
        });
        document.querySelector('.choices[data-type*=select-one] .choices__inner').style.minWidth = "480px";
        document.querySelector('.choices[data-type*=select-one] .choices__inner').style.maxWidth = "900px";
        document.querySelector('.choices[data-type*=select-one] .choices__inner').style.fontSize = "1.12em";
        if (tareaSelectState.actividad) {
          window.actividadChoices.setChoiceByValue(tareaSelectState.actividad);
        }
        document.getElementById("actividadSelectChoices").addEventListener("change", function () {
          tareaSelectState.actividad = this.value;
          tareaSelectState.tarea = "";
          tareaSelectState.tag = "";
          renderTareasSelector();
        });
      }
    }, 0);

    if (actividadSelect.value) {
      const proyecto = projects.find(p => p.nombre === proyectoSelect.value);
      const especialidad = proyecto?.especialidades.find(e => e.nombre === especialidadSelect.value);
      const area = especialidad?.areas.find(a => a.nombre === areaSelect.value);
      const actividad = area?.actividades.find(act => act.id === actividadSelect.value);
      if (actividad && actividad.tareas && actividad.tareas.length > 0) {
        actividad.tareas.forEach(t => {
          tareaSelect.innerHTML += `<option value="${t.descripcion}" data-requiere-tag="${t.requiereTag}">${t.descripcion}</option>`;
        });
        tareaSelect.disabled = false;
        setSelectValue(tareaSelect, tareaSelectState.tarea);
      }
    }
    if (tareaSelect.value) {
      const requiereTag = tareaSelect.selectedOptions[0]?.getAttribute('data-requiere-tag') === "true";
      if (requiereTag) {
        const proyecto = projects.find(p => p.nombre === proyectoSelect.value);
        const especialidad = proyecto?.especialidades.find(e => e.nombre === especialidadSelect.value);
        const area = especialidad?.areas.find(a => a.nombre === areaSelect.value);
        const actividad = area?.actividades.find(act => act.id === actividadSelect.value);
        if (actividad && actividad.consumibles) {
          actividad.consumibles.forEach(tag => {
            tagSelect.innerHTML += `<option value="${tag.tag}" data-unidad="${tag.unidad || ''}">${tag.tag} - ${tag.descripcion || ""}</option>`;
          });
          tagSelect.disabled = false;
          setSelectValue(tagSelect, tareaSelectState.tag);
        }
      } else {
        tagSelect.disabled = true;
        btnAgregarTarea.disabled = false;
      }
    }

    if (
      proyectoSelect.value &&
      especialidadSelect.value &&
      areaSelect.value &&
      actividadSelect.value &&
      tareaSelect.value &&
      (
        !tareaSelect.selectedOptions[0]?.getAttribute('data-requiere-tag') ||
        (tareaSelect.selectedOptions[0]?.getAttribute('data-requiere-tag') === "false") ||
        (tagSelect.value)
      )
    ) {
      btnAgregarTarea.disabled = false;
    } else {
      btnAgregarTarea.disabled = true;
    }

    btnAgregarTarea.addEventListener("click", function () {
      const tareaObj = {
        proyecto: proyectoSelect.value,
        especialidad: especialidadSelect.value,
        area: areaSelect.value,
        actividad: actividadSelect.value,
        tarea: tareaSelect.value,
        tag: tagSelect.value || null,
        unidad: tagSelect.selectedOptions[0]?.getAttribute('data-unidad') || null
      };
      if (
        tareaObj.proyecto &&
        tareaObj.especialidad &&
        tareaObj.area &&
        tareaObj.actividad &&
        tareaObj.tarea &&
        !tareas.some(t =>
          t.proyecto === tareaObj.proyecto &&
          t.especialidad === tareaObj.especialidad &&
          t.area === tareaObj.area &&
          t.actividad === tareaObj.actividad &&
          t.tarea === tareaObj.tarea &&
          t.tag === tareaObj.tag
        )
      ) {
        tareas.push(tareaObj);
        renderTareasSeleccionadas();
        renderTareasSelector();
      }
    });

    row1.appendChild(proyectoSelect);
    row1.appendChild(especialidadSelect);
    row1.appendChild(areaSelect);

    row2.appendChild(actividadCol);
    row2.appendChild(tareaCol);
    row2.appendChild(tagCol);
    row2.appendChild(btnAgregarTarea);

    tareasSelectorDiv.appendChild(row1);
    tareasSelectorDiv.appendChild(row2);
  }

  function renderTareasSeleccionadas() {
    tareasSeleccionadasDiv.innerHTML = "";
    if (tareas.length === 0) {
      tareasSeleccionadasDiv.innerHTML = "<em>No hay tareas seleccionadas.</em>";
      document.getElementById("generarDistribucionBtn").disabled = true;
      return;
    }
    const ul = document.createElement("ul");
    tareas.forEach((t, idx) => {
      const li = document.createElement("li");
      li.textContent = `[${t.proyecto}] [${t.especialidad}] [${t.area}] ${t.actividad} / ${t.tarea}` + (t.tag ? ` / TAG: ${t.tag}` : "");
      const btnQuitar = document.createElement("button");
      btnQuitar.type = "button";
      btnQuitar.textContent = "Quitar";
      btnQuitar.className = "remove-btn";
      btnQuitar.onclick = () => {
        tareas.splice(idx, 1);
        renderTareasSeleccionadas();
      };
      li.appendChild(btnQuitar);
      ul.appendChild(li);
    });
    tareasSeleccionadasDiv.appendChild(ul);
    document.getElementById("generarDistribucionBtn").disabled = cuadrilla.length === 0 || tareas.length === 0;
  }

  renderTareasSelector();
  renderTareasSeleccionadas();

  // --- Distribución de HH y TAGs ---
  const generarDistribucionBtn = document.getElementById("generarDistribucionBtn");
  const hhDistribucionDiv = document.getElementById("hhDistribucion");
  const tagsDistribucionDiv = document.getElementById("tagsDistribucion");

  generarDistribucionBtn.addEventListener("click", () => {
    renderHHDistribucion();
    renderTagsDistribucion();
  });

  function renderHHDistribucion() {
    hhDistribucionDiv.innerHTML = "";
    if (cuadrilla.length === 0 || tareas.length === 0) return;

    // Tabla
    const table = document.createElement("table");
    table.className = "hh-table";
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    trHead.innerHTML = `<th>N°</th><th>Nombre y Apellido</th><th>Especialidad</th><th>Cargo</th>`;
    tareas.forEach((t, idx) => {
      trHead.innerHTML += `<th>${idx + 1}</th>`;
    });
    trHead.innerHTML += `<th>HH</th><th>HH extra</th>`;
    thead.appendChild(trHead);

    // Subencabezado tareas
    const trActs = document.createElement("tr");
    trActs.innerHTML = `<th></th><th></th><th></th><th></th>`;
    tareas.forEach(t => {
      trActs.innerHTML += `<th style="font-size:0.95em">${t.tarea}${t.tag ? ' / ' + t.tag : ''}</th>`;
    });
    trActs.innerHTML += `<th></th><th></th>`;
    thead.appendChild(trActs);

    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    cuadrilla.forEach((trab, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${i + 1}</td><td>${trab.nombre}</td><td>${trab.especialidad}</td><td>${trab.cargo}</td>`;
      tareas.forEach((t, j) => {
        tr.innerHTML += `<td><input type="number" min="0" max="24" step="1" class="hh-input" data-trab="${trab.rut}" data-tarea="${j}" style="width:50px"/></td>`;
      });
      tr.innerHTML += `<td class="hh-total" id="hh-total-${trab.rut}">0</td>
        <td><input type="checkbox" class="hh-extra-checkbox" data-trab="${trab.rut}" title="Permitir más de 12HH"></td>`;
      tbody.appendChild(tr);
    });

    // Fila total por tarea
    const trTotal = document.createElement("tr");
    trTotal.innerHTML = `<td colspan="4" style="text-align:right;font-weight:bold">TOTAL HH</td>`;
    tareas.forEach((t, j) => {
      trTotal.innerHTML += `<td class="hh-tarea-total" id="hh-tarea-total-${j}">0</td>`;
    });
    trTotal.innerHTML += `<td></td><td></td>`;
    tbody.appendChild(trTotal);

    table.appendChild(tbody);
    hhDistribucionDiv.appendChild(table);

    // Validación y suma en tiempo real
    const inputs = table.querySelectorAll(".hh-input");
    inputs.forEach(input => {
      input.addEventListener("input", () => {
        // Suma por trabajador
        cuadrilla.forEach(trab => {
          let sum = 0;
          tareas.forEach((t, j) => {
            const val = parseInt(table.querySelector(`.hh-input[data-trab="${trab.rut}"][data-tarea="${j}"]`)?.value) || 0;
            sum += val;
          });
          table.querySelector(`#hh-total-${trab.rut}`).textContent = sum;
          const extra = table.querySelector(`.hh-extra-checkbox[data-trab="${trab.rut}"]`).checked;
          if (sum > 12 && !extra) table.querySelector(`#hh-total-${trab.rut}`).style.color = "#e74c3c";
          else table.querySelector(`#hh-total-${trab.rut}`).style.color = "";
        });
        // Suma por tarea
        tareas.forEach((t, j) => {
          let sum = 0;
          cuadrilla.forEach(trab => {
            const val = parseInt(table.querySelector(`.hh-input[data-trab="${trab.rut}"][data-tarea="${j}"]`)?.value) || 0;
            sum += val;
          });
          table.querySelector(`#hh-tarea-total-${j}`).textContent = sum;
        });
      });
    });

    // Checkbox HH extra
    table.querySelectorAll(".hh-extra-checkbox").forEach(cb => {
      cb.addEventListener("change", () => {
        inputs.forEach(input => input.dispatchEvent(new Event("input")));
      });
    });
  }

  function renderTagsDistribucion() {
    tagsDistribucionDiv.innerHTML = "";
    // Recolectar todos los tags únicos de las tareas seleccionadas
    let tags = [];
    tareas.forEach(t => {
      if (t.tag && !tags.some(tagObj => tagObj.tag === t.tag && tagObj.unidad === t.unidad)) {
        tags.push({ tag: t.tag, unidad: t.unidad });
      }
    });
    if (tags.length === 0) return;
    const table = document.createElement("table");
    table.className = "tags-table";
    const thead = document.createElement("thead");
    thead.innerHTML = `<tr>
      <th>TAG</th>
      <th>Cantidad utilizada</th>
      <th>Unidad</th>
    </tr>`;
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    tags.forEach(tagObj => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tagObj.tag}</td>
        <td><input type="number" min="0" step="any" class="tag-cant-input" data-tag="${tagObj.tag}" style="width:80px"/></td>
        <td>${tagObj.unidad || ""}</td>
      `;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tagsDistribucionDiv.appendChild(document.createElement("br"));
    tagsDistribucionDiv.appendChild(document.createTextNode("Consumo de TAGs:"));
    tagsDistribucionDiv.appendChild(table);
  }

  // --- Enviar formulario con validaciones de HH ---
  const form = document.getElementById("dailyReportForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formError = document.getElementById("formError");
    formError.textContent = "";

    // Validar HH
    const hhTable = document.querySelector(".hh-table");
    if (!hhTable) {
      formError.textContent = "Debe distribuir las HH antes de enviar el reporte.";
      return;
    }
    let valid = true;
    let mensaje = "";
    cuadrilla.forEach(trab => {
      let sum = 0;
      tareas.forEach((t, j) => {
        const val = parseInt(hhTable.querySelector(`.hh-input[data-trab="${trab.rut}"][data-tarea="${j}"]`)?.value) || 0;
        sum += val;
      });
      const extra = hhTable.querySelector(`.hh-extra-checkbox[data-trab="${trab.rut}"]`).checked;
      if (sum < 12) {
        valid = false;
        mensaje = `El trabajador ${trab.nombre} debe tener exactamente 12 HH asignadas.`;
      }
      if (sum > 12 && !extra) {
        valid = false;
        mensaje = `El trabajador ${trab.nombre} tiene más de 12 HH y no está marcado como HH extra.`;
      }
    });
    if (!valid) {
      formError.textContent = mensaje;
      return;
    }

    // Obtener la firma como imagen base64 (opcional, para guardar/enviar)
    const signaturePad = document.getElementById('signaturePad');
    let signatureData = "";
    if (signaturePad) {
      signatureData = signaturePad.toDataURL();
      // Puedes enviar signatureData al backend o guardarlo donde necesites
    }

        // Recolectar distribución de HH
    let hhDistribucion = [];
    cuadrilla.forEach(trab => {
      tareas.forEach((t, j) => {
        const val = parseInt(hhTable.querySelector(`.hh-input[data-trab="${trab.rut}"][data-tarea="${j}"]`)?.value) || 0;
        if (val > 0) {
          hhDistribucion.push({
            trabajador: trab.nombre,
            rut: trab.rut,
            tarea: t.tarea,
            tag: t.tag || "",
            hh: val
          });
        }
      });
    });

    // Recolectar distribución de TAGs
    let tagsDistribucion = [];
    document.querySelectorAll(".tag-cant-input").forEach(input => {
      const cantidad = parseFloat(input.value) || 0;
      if (cantidad > 0) {
        tagsDistribucion.push({
          tag: input.getAttribute("data-tag"),
          cantidad
        });
      }
    });

    // Recolectar toda la info del formulario
    const data = {
      fecha: document.getElementById("date")?.value || "",
      supervisor: document.getElementById("supervisor")?.value || "",
      clima: document.getElementById("clima")?.value || "",
      turno: document.getElementById("shift")?.value || "",
      cuadrilla,
      tareas,
      hh: hhDistribucion,
      tags: tagsDistribucion,
      comentarios: document.getElementById("comments")?.value || "",
      firma: signatureData
    };

    // Enviar al backend
    fetch("/guardar-reporte", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    .then(resp => {
      if (resp.ok) {
        alert("Reporte guardado correctamente en Excel.");
        form.reset();
        window.location.reload();
      } else {
        formError.textContent = "Error al guardar el reporte.";
      }
    })
    .catch(() => {
      formError.textContent = "No se pudo conectar al servidor.";
    });  }); // <-- Cierre del form.addEventListener("submit", ...)

}); // <-- Cierre del document.addEventListener("DOMContentLoaded", ...)