async function fetchData() {
    try {
      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();
      return data.products.slice(0, 30); // Pobierz pierwsze 30 elementów
    } catch (error) {
      console.error('Błąd pobierania danych:', error);
    }
  }

  function renderTable(products) {
    const tableBody = document.querySelector('#productTable tbody');
    tableBody.innerHTML = ''; // Wyczyść tabelę

    products.forEach(product => {
      const row = document.createElement('tr');

      const imageCell = document.createElement('td');
      const img = document.createElement('img');
      img.src = product.thumbnail;
      imageCell.appendChild(img);

      const titleCell = document.createElement('td');
      titleCell.textContent = product.title;

      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = product.description;

      row.appendChild(imageCell);
      row.appendChild(titleCell);
      row.appendChild(descriptionCell);
      
      tableBody.appendChild(row);
    });
  }

  function filterAndSortProducts(products) {
    const filterValue = document.getElementById('filterInput').value.toLowerCase();
    const sortOrder = document.getElementById('sortSelect').value;

    let filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(filterValue) ||
      product.description.toLowerCase().includes(filterValue)
    );

    if (sortOrder === 'asc') {
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'desc') {
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
    }

    renderTable(filteredProducts);
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchData();
    renderTable(products);

    document.getElementById('filterInput').addEventListener('input', () => filterAndSortProducts(products));
    document.getElementById('sortSelect').addEventListener('change', () => filterAndSortProducts(products));
  });