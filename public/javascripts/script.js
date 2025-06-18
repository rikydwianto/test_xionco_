function login() {
  var username = $("#username").val();
  var password = $("#password").val();

  if (username === "" || password === "") {
    Swal.fire({
      icon: "error",
      title: "Username dan password tidak boleh kosong",
    });
    return;
  } else {
    $.ajax({
      url: "/api/auth-login", // URL endpoint
      method: "POST", // Metode HTTP
      contentType: "application/json", // Tipe konten data yang dikirim
      data: JSON.stringify({ username: username, password: password }), // Data harus berupa string JSON
      dataType: "json", // Harapan tipe data respon dari server (JSON)
      success: function (data) {
        // Fungsi yang dijalankan jika request berhasil (status 2xx)
        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Login Berhasil ",
            text: data.message,
          }).then(() => {
            // Ini akan dijalankan setelah SweetAlert tertutup (baik oleh timer atau manual)
            window.location.href = "/";
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Gagal ",
            text: data.message,
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Fungsi yang dijalankan jika request gagal (misalnya, error jaringan, status 4xx/5xx)
        let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
        if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
          errorMessage = jqXHR.responseJSON.message; // Ambil pesan error dari server jika ada
        } else if (errorThrown) {
          errorMessage = errorThrown; // Ambil pesan error standar
        }

        Swal.fire({
          icon: "error",
          title: "Error Jaringan/Server",
          text: errorMessage,
        });
        console.error(
          "AJAX Error:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
      },
    });
  }
}

$(document).ready(function () {
  $.extend(true, $.fn.dataTable.defaults, {
    responsive: true,
    paging: true,
    searching: true,
    ordering: false,
    pageLength: 10,
    language: {
      sEmptyTable: "Tidak ada data",
      sInfo: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
      sInfoEmpty: "Menampilkan 0 sampai 0 dari 0 data",
      sInfoFiltered: "(disaring dari _MAX_ total data)",
      sLengthMenu: "Tampilkan _MENU_ data",
      sLoadingRecords: "Memuat...",
      sProcessing: "Memproses...",
      sSearch: "Cari:",
      sZeroRecords: "Tidak ditemukan data yang sesuai",
      oPaginate: {
        sFirst: "Pertama",
        sLast: "Terakhir",
        sNext: "Berikutnya",
        sPrevious: "Sebelumnya",
      },
    },
  });

  //ORDER DATA
  var table_orders = $("#orderTable").DataTable({
    ajax: {
      url: "/api/orders",
    },
    responsive: true,
    columns: [
      { data: "order_ref" },
      { data: "full_name" },
      { data: "email" },
      { data: "shipping_address" },
      { data: "payment_method" },
      { data: "status_proses" },
      { data: "status_order" },
      {
        data: "order_date",
      },
      {
        data: "order_id",
        render: function (data, type, row) {
          let buttons = `
      <button class="btn btn-sm btn-info mb-1 btn-detail" data-id="${data}">Detail</button>
    `;

          if (row.status_proses === "pending") {
            buttons += `
                        <button class="btn btn-sm btn-success mb-1 btn-approve" data-id="${data}">Terima</button>
                        <button class="btn btn-sm btn-danger mb-1 btn-reject" data-id="${data}">Tolak</button>
                    `;
          }
          if (
            row.status_proses == "pending" ||
            row.status_proses == "rejected" ||
            row.status_proses == "completed" ||
            row.status_proses == "cancelled"
          ) {
          } else {
            buttons += `
                            <button class="btn btn-sm btn-success mb-1 btn-finish" data-id="${data}">Selesai</button>
                        `;
          }

          return buttons;
        },
      },
    ],
  });
  $("#orderTable tbody").on("click", ".btn-detail", function () {
    const tr = $(this).closest("tr");
    const row = table_orders.row(tr);

    if (row.child.isShown()) {
      // Close
      row.child.hide();
      tr.removeClass("shown");
    } else {
      // Open
      row.child(formatOrder(row.data())).show();
      tr.addClass("shown");
    }
  });

  function formatOrder(row) {
    let html = `<div class="text-center">Loading...</div>`;

    $.ajax({
      url: `/api/orderdetail/${row.order_id}`,
      method: "GET",
      success: function (response) {
        if (response.success && response.data.length > 0) {
          let total = 0;
          let totalItem = 0;

          let detailRows = response.data
            .map((item) => {
              const subtotal = parseFloat(item.order_price) * item.quantity;
              total += subtotal;
              totalItem += item.quantity;
              return `
              <tr>
                <td>${item.name}</td>
                <td>${item.size}</td>
                <td>${item.quantity}</td>
                <td>Rp ${parseInt(item.order_price).toLocaleString(
                  "id-ID"
                )}</td>
              </tr>
            `;
            })
            .join("");

          html = `
          <table class="table table-sm table-bordered mt-2">
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Ukuran</th>
                <th>Jumlah</th>
                <th>Harga per Item</th>
              </tr>
            </thead>
            <tbody>
              ${detailRows}
              
            </tbody>
            <tfoot>
                <tr class="fw-bold table-light">
                <th colspan="2" class="text-end">Total</th>
                <th>${totalItem}</th>
                <th>Rp ${total.toLocaleString("id-ID")}</th>
              </tr>
            </tfoot>
          </table>
        `;

          $(`#detail-${row.id}`).html(html);
        } else {
          html = `<div class="text-danger">Data detail tidak ditemukan.</div>`;
          $(`#detail-${row.id}`).html(html);
        }
      },
      error: function () {
        html = `<div class="text-danger">Gagal memuat detail order.</div>`;
        $(`#detail-${row.id}`).html(html);
      },
    });

    return `<div id="detail-${row.id}"><div class="text-muted">Memuat detail...</div></div>`;
  }

  $(document).on("click", ".btn-approve", function () {
    const id = $(this).data("id");

    Swal.fire({
      title: "Terima Pesanan?",
      text: "Apakah kamu yakin ingin menerima pesanan ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Terima",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // Lakukan aksi approve
        approveOrder(id);
      }
    });
  });

  $(document).on("click", ".btn-reject", function () {
    const id = $(this).data("id");

    Swal.fire({
      title: "Tolak Pesanan?",
      text: "Apakah kamu yakin ingin menolak pesanan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Tolak",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // Lakukan aksi reject
        rejectOrder(id);
      }
    });
  });

  function approveOrder(id) {
    $.ajax({
      url: `/api/orders/${id}/approve`,
      method: "POST",
      success: function (res) {
        Swal.fire("Berhasil!", "Pesanan telah diterima.", "success");
        // Reload datatable atau halaman
        $("#orderTable").DataTable().ajax.reload();
      },
      error: function () {
        Swal.fire(
          "Gagal!",
          "Terjadi kesalahan saat menerima pesanan.",
          "error"
        );
      },
    });
  }

  function rejectOrder(id) {
    $.ajax({
      url: `/api/orders/${id}/reject`,
      method: "POST",
      success: function (res) {
        Swal.fire("Ditolak!", "Pesanan telah ditolak.", "success");
        $("#orderTable").DataTable().ajax.reload();
      },
      error: function () {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menolak pesanan.", "error");
      },
    });
  }

  // --- FUNGSI BARU UNTUK TOMBOL 'ORDER SELESAI' ---
  $(document).on("click", ".btn-finish", function () {
    const orderId = $(this).data("id"); // Ambil ID order dari data-id atribut
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Order ini akan ditandai sebagai selesai!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Selesaikan!",
    }).then((result) => {
      if (result.isConfirmed) {
        finishOrder(orderId); // Panggil fungsi untuk menyelesaikan order
      }
    });
  });
  function finishOrder(orderId) {
    $.ajax({
      url: `/api/orders/${orderId}/finish`, // Endpoint API baru
      method: "POST", // Atau PUT/PATCH, tergantung desain RESTful API Anda
      contentType: "application/json",
      dataType: "json",
      success: function (response) {
        if (response.success) {
          Swal.fire("Selesai!", response.message, "success");
          // Opsional: Reload halaman atau hapus baris order dari tampilan
          // Misalnya, $('#order-row-' + orderId).remove();
          $("#orderTable").DataTable().ajax.reload();
        } else {
          Swal.fire("Gagal!", response.message, "error");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        let errorMessage = "Terjadi kesalahan saat menyelesaikan order.";
        if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
          errorMessage = jqXHR.responseJSON.message;
        }
        Swal.fire("Error!", errorMessage, "error");
        console.error(
          "AJAX Error:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
      },
    });
  }

  // ***   PRODUCTS ****//

  $("#productTable").DataTable({
    processing: true, // Menampilkan indikator loading
    serverSide: false, // Karena data diambil sekaligus, bukan dari server per halaman
    ajax: {
      url: "/api/products", // Ganti dengan URL endpoint API produk Anda
      type: "GET",
      dataSrc: function (json) {
        // Pastikan struktur data sesuai dengan respons API Anda
        // Jika data berada di dalam properti 'data' dari objek respons
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        } else {
          console.error("Format data API tidak sesuai:", json);
          return []; // Kembalikan array kosong jika format tidak sesuai
        }
      },
      error: function (xhr, error, thrown) {
        console.error("Error fetching product data:", error, thrown, xhr);
        alert("Gagal mengambil data produk. Silakan coba lagi.");
      },
    },
    columns: [
      { data: "id" },
      { data: "name" },
      { data: "description" },
      {
        data: "price",
        render: function (data, type, row) {
          // Format harga ke format Rupiah
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(data);
        },
      },
      { data: "category" },
      {
        data: "is_active",
        render: function (data, type, row) {
          return data === 1 ? "Aktif" : "Tidak Aktif";
        },
      },
      { data: "quantity" },
      {
        data: "created_at",
        render: function (data, type, row) {
          // Format tanggal agar lebih mudah dibaca
          return new Date(data).toLocaleString();
        },
      },
      {
        data: "updated_at",
        render: function (data, type, row) {
          return new Date(data).toLocaleString();
        },
      },
      {
        data: null, // Kolom ini tidak mengambil data langsung dari JSON
        render: function (data, type, row) {
          // 'row' berisi seluruh objek data untuk baris ini
          const productId = row.id;
          const nama = row.name;
          const stok = row.quantity;
          return `
            <button class="btn btn-sm btn-info btn-stock-product mr-1" data-id="${productId}" data-nama="${nama}" data-current-stock="${stok}" title="Atur Stok Produk">
                <i class="fas fa-box"></i> Stok
            </button>
            <button class="btn btn-sm btn-warning btn-edit-product mr-1" data-id="${productId}" title="Edit Produk">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger btn-delete-product" data-id="${productId}" title="Hapus Produk">
                <i class="fas fa-trash-alt"></i> Hapus
            </button>                    `;
        },
        orderable: false, // Kolom ini tidak bisa diurutkan
        searchable: false, // Kolom ini tidak bisa dicari
      },
    ],
  });

  // Tombol 'Stok'
  $(document).on("click", ".btn-stock-product", function () {
    const productId = $(this).data("id");
    const nama = $(this).data("nama");
    const currentStock = $(this).data("current-stock"); // Ambil stok saat ini

    Swal.fire({
      title: "Perbarui Stok Produk",
      html: `
                <p> Produk: <strong>${nama}</strong></p>
                <p>Stok Saat Ini: <strong>${currentStock}</strong></p>
                <input type="number" id="swal-input-stock" class="swal2-input" placeholder="Masukkan jumlah stok baru" value="${currentStock}">
            `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      preConfirm: () => {
        const newStock = $("#swal-input-stock").val();
        if (newStock === "" || isNaN(newStock) || parseInt(newStock) < 0) {
          Swal.showValidationMessage("Jumlah stok harus berupa angka positif.");
          return false; // Jangan tutup Swal
        }
        return parseInt(newStock); // Kembalikan nilai stok baru yang sudah divalidasi
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newQuantity = result.value;
        updateProductStock(productId, newQuantity, currentStock); // Panggil fungsi update stok
      }
    });
  });

  function updateProductStock(productId, newQuantity, oldQuantity) {
    $.ajax({
      url: `/api/product/${productId}/stock`, // Endpoint API baru untuk update stok
      method: "POST", // Atau PUT/PATCH, sesuai desain API Anda
      contentType: "application/json",
      data: JSON.stringify({ quantity: newQuantity, oldquantity: oldQuantity }), // Kirim data stok baru
      dataType: "json",
      success: function (response) {
        if (response.success) {
          Swal.fire("Berhasil!", response.message, "success");
          $("#productTable").DataTable().ajax.reload(); // Muat ulang data DataTable untuk melihat perubahan stok
        } else {
          Swal.fire("Gagal!", response.message, "error");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        let errorMessage = "Terjadi kesalahan saat memperbarui stok.";
        if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
          errorMessage = jqXHR.responseJSON.message;
        }
        Swal.fire("Error!", errorMessage, "error");
        console.error(
          "AJAX Stock Update Error:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
      },
    });
  }
  const productListContainer = $("#product-list-container");
  const loadingMessage = $("#loading-message");
  const errorMessage = $("#error-message");

  //   PRODUK TRNSAKSI
  function loadProducts() {
    loadingMessage.show(); // Tampilkan pesan loading
    errorMessage.hide(); // Sembunyikan pesan error sebelumnya
    productListContainer.empty(); // Kosongkan container sebelum memuat data baru

    $.ajax({
      url: "/api/products", // Ganti dengan URL endpoint API produk Anda
      method: "GET",
      dataType: "json",
      success: function (response) {
        loadingMessage.hide(); // Sembunyikan pesan loading
        if (
          response.success &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          response.data.forEach(function (product) {
            // Hanya tampilkan produk yang aktif dan punya stok > 0
            if (product.is_active === 1 && product.quantity > 0) {
              const formattedPrice = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(product.price);

              const productCard = `
    <div class="col-md-3 col-sm-6 col-12"> 
        <div class="card product-card">
           
            <img src="images/product.jpg" class="card-img-top" alt="${
              product.name
            }">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description.substring(
                  0,
                  70
                )}...</p>
                <p class="product-price">${formattedPrice}</p>
                <p class="card-text text-muted">Stok: ${product.quantity}</p>
                <button class="btn btn-primary add-to-cart-btn"
                        data-id="${product.id}"
                        data-name="${product.name}"
                        data-price="${product.price}"
                        data-stock="${product.quantity}">
                    <i class="fas fa-shopping-cart"></i> Tambah ke Keranjang
                </button>
            </div>
        </div>
    </div>
`;
              productListContainer.append(productCard);
            }
          });
          if (productListContainer.children().length === 0) {
            productListContainer.append(
              '<p class="col-12 text-center">Tidak ada produk aktif atau tersedia.</p>'
            );
          }
        } else {
          errorMessage
            .text(response.message || "Tidak ada produk ditemukan.")
            .show();
          productListContainer.append(
            '<p class="col-12 text-center">Tidak ada produk untuk ditampilkan.</p>'
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        loadingMessage.hide();
        let msg = "Gagal memuat produk. Silakan coba lagi.";
        if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
          msg = jqXHR.responseJSON.message;
        }
        errorMessage.text(msg).show();
        console.error(
          "Error loading products:",
          textStatus,
          errorThrown,
          jqXHR
        );
      },
    });
  }

  // Panggil fungsi untuk memuat produk saat halaman dimuat
  loadProducts();

  $(document).on("click", ".add-to-cart-btn", function () {
    const productId = $(this).data("id");
    const productName = $(this).data("name");
    const productPrice = $(this).data("price");
    const productStock = $(this).data("stock"); // Stok yang tersedia

    // Tampilkan SweetAlert untuk input kuantitas
    Swal.fire({
      title: `Tambah ${productName} ke Keranjang`,
      html: `
                <p>Harga: <strong>${new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(productPrice)}</strong></p>
                <p class="text-muted">Stok Tersedia: ${productStock}</p>
                <input type="number" id="swal-input-quantity" class="swal2-input" placeholder="Jumlah" value="1" min="1" max="${productStock}">
            `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Tambah",
      cancelButtonText: "Batal",
      preConfirm: () => {
        const quantityInput = $("#swal-input-quantity").val();
        const quantity = parseInt(quantityInput);

        if (quantityInput === "" || isNaN(quantity) || quantity <= 0) {
          Swal.showValidationMessage("Jumlah harus angka positif.");
          return false;
        }
        if (quantity > productStock) {
          Swal.showValidationMessage(
            `Jumlah tidak boleh melebihi stok (${productStock}).`
          );
          return false;
        }
        return quantity;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const quantityToAdd = result.value;
        addToCart(productId, quantityToAdd); // Panggil fungsi AJAX untuk menambahkan ke keranjang
      }
    });
  });

  // --- Fungsi AJAX untuk Menambahkan ke Keranjang ---
  function addToCart(productId, quantity) {
    // Asumsi: Anda memiliki endpoint API untuk menambahkan item ke keranjang
    // Ini bisa berupa tabel 'cart_items' atau session keranjang di backend
    $.ajax({
      url: "/api/cart/add", // Ganti dengan endpoint API keranjang Anda
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ productId: productId, quantity: quantity }),
      dataType: "json",
      success: function (response) {
        if (response.success) {
          Swal.fire(
            "Ditambahkan!",
            `${quantity}x ${
              response.productName || "produk"
            } berhasil ditambahkan ke keranjang.`,
            "success"
          );
          // Opsional: Perbarui jumlah item di ikon keranjang di navbar (jika ada)
        } else {
          Swal.fire(
            "Gagal!",
            response.message || "Gagal menambahkan produk ke keranjang.",
            "error"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        let msg = "Terjadi kesalahan saat menambahkan ke keranjang.";
        if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
          msg = jqXHR.responseJSON.message;
        }
        Swal.fire("Error!", msg, "error");
        console.error("AJAX Cart Error:", textStatus, errorThrown, jqXHR);
      },
    });
  }

  function loadDashboardStats() {
    $.ajax({
      url: "/api/dashboard-stats", // Endpoint API statistik dashboard yang baru
      method: "GET",
      dataType: "json",
      success: function (response) {
        if (response.success && response.data) {
          $("#total-users-stat").text(response.data.totalUsers);
          $("#total-products-stat").text(response.data.totalProducts);
          $("#total-orders-stat").text(response.data.totalOrders);
        } else {
          console.error("Gagal memuat data statistik:", response.message);
          $("#total-users-stat").text("N/A");
          $("#total-products-stat").text("N/A");
          $("#total-orders-stat").text("N/A");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching dashboard stats:", errorThrown, jqXHR);
        $("#total-users-stat").text("Error");
        $("#total-products-stat").text("Error");
        $("#total-orders-stat").text("Error");
      },
    });
  }

  // Panggil fungsi untuk memuat statistik saat halaman dimuat
  loadDashboardStats();
});
