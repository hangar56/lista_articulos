
const DB_URL = 'http://localhost:8080/db/items.db';
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
        const db = new SQL.Database(new Uint8Array(arrayBuffer));
        const result = db.exec("SELECT cat1 as Modelo,cat2 as Tipo,descripcion as Descripción,item as Item,escala as Escala,precio as Precio FROM articulos where idioma='ESP'");
        createTable(result[0].values, result[0].columns);
        // Initialize event listeners and modal functionality after table is created
        initializeEventListeners();
    } catch (error) {
        console.error('Error loading database:', error);
        document.getElementById('table-container').innerHTML = 'Error loading database. Please check the console for details.';
    } finally {
        document.getElementById('loading').style.display = 'none';
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
    imageHeader.textContent = 'Image';
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