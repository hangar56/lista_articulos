
//const DB_URL = 'http://localhost:8080/db/items.db';
const DB_URL = 'https://hangar56.github.io/lista_articulos/db/items.db';  
let SQL;

// Initialize SQL.js
initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` })
    .then(sql => {
        SQL = sql;
        console.log("SQL.js initialized");
        loadDatabase();
    })
    .catch(err => console.error('Error initializing SQL.js:', err));

    async function loadDatabase() {
        try {
            const response = await fetch(DB_URL);
            const arrayBuffer = await response.arrayBuffer();
            db = new SQL.Database(new Uint8Array(arrayBuffer));
            
            // Load initial data
            loadTableData();
            
            // Populate dropdowns
            populateDropdown('escalaSelect', 'escala');
            populateDropdown('modeloSelect', 'cat1');
            populateDropdown('tipoSelect', 'cat2');
            
            // Initialize event listeners
            //initializeEventListeners();
        } catch (error) {
            console.error('Error loading database:', error);
            document.getElementById('table-container').innerHTML = 'Error loading database. Please check the console for details.';
        } finally {
            //document.getElementById('loading').style.display = 'none';
        }
    }

    function populateDropdown(selectId, columnName) {
        try {
            const query = `SELECT DISTINCT ${columnName} FROM articulos WHERE idioma='ESP' ORDER BY ${columnName}`;
            const result = db.exec(query);
            
            if (result.length > 0) {
                const select = document.getElementById(selectId);
                result[0].values.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value[0];
                    option.textContent = value[0];
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error(`Error populating ${selectId}:`, error);
        }
    }

    function loadTableData() {
        const escala = document.getElementById('escalaSelect').value;
        const modelo = document.getElementById('modeloSelect').value;
        const tipo = document.getElementById('tipoSelect').value;
        
        let query = `
            SELECT cat1 as Modelo, 
                   cat2 as Tipo, 
                   descripcion as Descripción,
                   item as Item,
                   escala as Escala,
                   precio as Precio 
            FROM articulos 
            WHERE idioma='ESP'
        `;
        
        // Add filter conditions
        if (escala !== '*') {
            query += ` AND escala='${escala}'`;
        }
        if (modelo !== '*') {
            query += ` AND cat1='${modelo}'`;
        }
        if (tipo !== '*') {
            query += ` AND cat2='${tipo}'`;
        }
        
        try {
            const result = db.exec(query);
            if (result.length > 0) {
                createTable(result[0].values, result[0].columns);
            } else {
                document.getElementById('table-container').innerHTML = 'No se encontraron resultados.';
            }
        } catch (error) {
            console.error('Error loading table data:', error);
            document.getElementById('table-container').innerHTML = 'Error loading table data. Please check the console for details.';
        }
        finally{
            initializeEventListeners(); // nuevo... testing.
        }
    }
    
function createTable(data, columns) {
    const table = document.createElement('table');
    table.id = 'productTable'; // Added ID for search functionality
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create header row
    const headerRow = document.createElement('tr');
    columns.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Add header for the image column
    const imageHeader = document.createElement('th');
    imageHeader.textContent = 'Imagen';
    headerRow.appendChild(imageHeader);
    thead.appendChild(headerRow);

    // Create data rows
    data.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cellData => {
            const td = document.createElement('td');
            td.textContent = cellData !== null ? cellData : '';
            tr.appendChild(td);
        });

        // Add image column
        const imageTd = document.createElement('td');
        const img = document.createElement('img');
        img.src = `images/${row[3]}.jpeg`;
        img.alt = "Ver Foto";
        img.className = "thumbnail";
        imageTd.appendChild(img);
        tr.appendChild(imageTd);

        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    const container = document.getElementById('table-container');
    container.innerHTML = ''; // Clear previous content
    container.appendChild(table);
}

function initializeEventListeners() {
    // Search functionality
    document.getElementById('filterButton').addEventListener('click', loadTableData);

    document.getElementById('searchInput').addEventListener('keyup', function() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("searchInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("productTable");
        tr = table.getElementsByTagName("tr");

        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[2];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    });

    // Image modal functionality
    var modal = document.getElementById("imageModal");
    var modalImg = document.getElementById("modalImage");
    var thumbnails = document.getElementsByClassName("thumbnail");
    var closeModal = document.getElementById("closeModal");

    for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].onclick = function(){
            modal.style.display = "block";
            modalImg.src = this.src;
        }
    }

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}