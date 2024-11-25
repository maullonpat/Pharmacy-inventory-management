$(document).ready(function () {
  let myArray = []; // To hold fetched data

  // Fetch and display data
  function loadData(query = '') {
    $.ajax({
      url: 'fetch_data.php',
      type: 'GET',
      data: { search: query },
      dataType: 'json',
      success: function (data) {
        myArray = data; // Store fetched data in `myArray`
        renderTable(myArray); // Initial rendering
      },
    });
  }

  // Render the table
  function renderTable(data) {
    let rows = '';
    data.forEach((item) => {
      rows += `
        <tr data-id="${item.product_id}" class="">
          <td><input type="text" value="${item.distributor}" class="distributor" /></td>     
          <td><input type="text" value="${item.brand_name}" class="brand_name" /></td>
          <td><input type="text" value="${item.generic_name}" class="generic_name" /></td>
          <td><input type="text" value="${item.purchase_price}" class="purchase_price" /></td>
          <td><input type="text" value="${item.selling_price}" class="selling_price" /></td>
          <td><input type="number" value="${item.stock}" class="stock" /></td>    
          <td><input type="date" value="${item.expiry_date}" class="expiry_date" /></td>    
          <td>
            <button class="btn btn-success editBtn">Edit</button>
            <button class="btn btn-danger deleteBtn">Delete</button>
          </td>
        </tr>
      `;
    });
    $('#inventoryTable tbody').html(rows);
  }

  // Sorting functionality
  $('th').on('click', function () {
    let column = $(this).data('column'); // Get column to sort
    let order = $(this).data('order'); // Get current order
    if (order === 'asc') {
      $(this).data('order', 'desc');
      myArray.sort((a, b) => (a[column] > b[column] ? 1 : -1));
    } else {
      $(this).data('order', 'asc');
      myArray.sort((a, b) => (a[column] < b[column] ? 1 : -1));
    }

    // Update arrow icons
    $('th i').removeClass('bi-arrow-up bi-arrow-down'); // Reset all icons
    $(this)
      .find('i')
      .addClass(order === 'asc' ? 'bi-arrow-down' : 'bi-arrow-up');
    renderTable(myArray); // Re-render table with sorted data
  });

  // Load initial data
  loadData();

  // Search functionality
  $('#searchInput').on('input', function () {
    const query = $(this).val();
    loadData(query);
  });

  // Add new product
  $('#addForm').on('submit', function (e) {
    e.preventDefault();
    const distributor = $('#distributor').val();
    const brand_name = $('#brand_name').val();
    const generic_name = $('#generic_name').val();
    const purchase_price = $('#purchase_price').val();
    const selling_price = $('#selling_price').val();
    const stock = $('#stock').val();
    const expiry_date = $('#expiry_date').val();

    $.ajax({
      url: 'add_data.php',
      type: 'POST',
      data: {
        distributor: distributor,
        brand_name: brand_name,
        generic_name: generic_name,
        purchase_price: purchase_price,
        selling_price: selling_price,
        stock: stock,
        expiry_date: expiry_date,
      },
      success: function (response) {
        alert(response);
        $('#addForm')[0].reset(); // Clear the form
        loadData(); // Reload the table
      },
    });
  });
  // Toggle edit/save functionality
  $(document).on('click', '.editBtn', function () {
    const $button = $(this);
    const row = $button.closest('tr');
    const id = row.data('id');

    if ($button.text() === 'Edit') {
      $button.text('Save');
      row.find('input').prop('disabled', false);
    } else {
      const generic_name = row.find('.generic_name').val();
      const name = row.find('.name').val();
      const size = row.find('.size').val();
      const price = row.find('.price').val();
      const stock = row.find('.stock').val();
      const expiry_date = row.find('.expiry_date').val();

      $.ajax({
        url: 'edit_data.php',
        type: 'POST',
        data: {
          action: 'edit',
          id: id,
          generic_name: generic_name,
          name: name,
          size: size,
          price: price,
          stock: stock,
          expiry_date: expiry_date,
        },
        success: function (response) {
          alert(response);
          loadData();
        },
      });

      $button.text('Edit');
      row.find('input').prop('disabled', true);
    }
  });

  // Delete record
  $(document).on('click', '.deleteBtn', function () {
    const id = $(this).closest('tr').data('id');

    if (confirm('Are you sure you want to delete this record?')) {
      $.ajax({
        url: 'delete_data.php',
        type: 'POST',
        data: { action: 'delete', id: id },
        success: function (response) {
          alert(response);
          loadData();
        },
      });
    }
  });
});
