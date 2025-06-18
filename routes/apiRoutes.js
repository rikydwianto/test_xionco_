var express = require("express");
var app = express();
var router = express.Router();
const db = require("../config/db");
const response = require("../helpers/response");
const { success } = require("../helpers/response");
const session = require("express-session");
router.get("/", function (req, res, next) {
  console.log("GET /api");
  return success(res, "API is running", {
    message: "Connected to BMC API",
  });
});
router.get("/dashboard-stats", async (req, res) => {
  try {
    // Query untuk Total Pengguna
    const [usersResult] = await db
      .promise()
      .query(`SELECT COUNT(id) AS total_users FROM users`);
    const totalUsers = usersResult[0].total_users;

    // Query untuk Total Produk
    const [productsResult] = await db
      .promise()
      .query(`SELECT COUNT(id) AS total_products FROM products`);
    const totalProducts = productsResult[0].total_products;

    // Query untuk Total Pesanan (semua status)
    const [ordersResult] = await db
      .promise()
      .query(`SELECT COUNT(id) AS total_orders FROM orders`);
    const totalOrders = ordersResult[0].total_orders;

    return response.success(res, "Statistik dashboard berhasil diambil", {
      totalUsers: totalUsers,
      totalProducts: totalProducts,
      totalOrders: totalOrders,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return response.error(
      res,
      "Gagal mengambil statistik dashboard.",
      null,
      500
    );
  }
});
router.get("/products", function (req, res) {
  const query = ` SELECT
      p.id,
      p.name,
      p.description,
      p.image_path,
      p.price,
      p.category,
      p.is_active,
      p.created_at,
      p.updated_at,
      s.id,
      s.quantity,
      s.updated_at 
    FROM
      products AS p
      INNER JOIN stock AS s ON p.id = s.product_id
  `;

  db.query(query, (err, results) => {
    if (err) return response.error(res, "Gagal ambil produk", err);
    return response.success(res, "Data produk berhasil diambil", results);
  });
});
router.get("/product/:id", function (req, res) {
  const query = ` SELECT
      p.id,
      p.name,
      p.description,
      p.image_path,
      p.price,
      p.category,
      p.is_active,
      p.created_at,
      p.updated_at,
      s.id,
      s.quantity,
      s.updated_at 
    FROM
      products AS p
      INNER JOIN stock AS s ON p.id = s.product_id
    WHERE p.id=?
  `;
  const idProduk = req.params.id;
  db.query(query, [idProduk], (err, results) => {
    if (err) return response.error(res, "Gagal ambil produk", err);
    return response.success(res, "Data produk berhasil diambil", results);
  });
});

router.post("/product/:id/stock", (req, res) => {
  const productId = req.params.id;
  const { quantity: newQuantity, oldquantity: oldQuantity } = req.body;

  // --- Validasi Input ---
  if (
    newQuantity === undefined ||
    isNaN(newQuantity) ||
    parseInt(newQuantity) < 0
  ) {
    return response.error(
      res,
      "Jumlah stok baru tidak valid. Harus angka positif.",
      null,
      400
    );
  }

  const parsedNewQuantity = parseInt(newQuantity);
  const parsedOldQuantity = parseInt(oldQuantity);

  // Hitung perubahan stok
  const stockChange = parsedNewQuantity - parsedOldQuantity;
  const changeType = stockChange >= 0 ? "IN" : "OUT";
  const absoluteChangeQuantity = Math.abs(stockChange);
  const description = `Perubahan stok dari ${parsedOldQuantity} menjadi ${parsedNewQuantity}`;

  const updateProductQ = `UPDATE stock SET quantity = ?, updated_at = NOW() WHERE product_id = ?`; // Sesuaikan dengan nama tabel produk Anda

  db.query(
    updateProductQ,
    [parsedNewQuantity, productId],
    (err, productUpdateResult) => {
      if (err) {
        console.error("Database error saat memperbarui stok produk:", err);
        return response.error(
          res,
          "Terjadi kesalahan server saat memperbarui stok produk.",
          null,
          500
        );
      }

      if (productUpdateResult.affectedRows === 0) {
        return response.error(
          res,
          "Produk tidak ditemukan atau stok tidak berubah.",
          null,
          404
        );
      }

      if (stockChange !== 0) {
        const insertLogQ = `
                INSERT INTO stock_logs (product_id, change_type, quantity, description)
                VALUES (?, ?, ?, ?)
            `;

        db.query(
          insertLogQ,
          [productId, changeType, absoluteChangeQuantity, description],
          (logErr, logResult) => {
            if (logErr) {
              console.error("Database error saat mencatat log stok:", logErr);
            }
            return response.success(
              res,
              "Stok produk berhasil diperbarui dan log dicatat!",
              null
            );
          }
        );
      } else {
        return response.success(
          res,
          "Stok produk berhasil diperbarui (tidak ada perubahan kuantitas).",
          null
        );
      }
    }
  );
});

router.get("/orders", function (req, res) {
  // var limit = req.body.query("limit");
  var q_order = `
            SELECT
            ord.id as order_id, 
            u.username, 
            u.full_name, 
            u.email, 
            u.role, 
            u.status AS status_user, 
            ord.order_date, 
            ord.status_proses AS status_proses, 
            ord.status_order AS status_order, 
            ord.shipping_address, 
            ord.payment_method, 
            ord.order_ref
          FROM
            orders AS ord
            INNER JOIN
            users AS u
            ON 
              ord.user_id = u.id 
              ORDER BY ord.id desc
            `;
  db.query(q_order, function (err, result) {
    if (err) return response.error(res, "Gagal mengambil data : ", err);

    return response.success(res, "Berhasil load data order", result);
  });
});
// Approve Order
router.post("/orders/:id/approve", function (req, res) {
  const orderId = req.params.id;

  const q_update = `UPDATE orders SET status_proses = 'processing' WHERE id = ?`;
  db.query(q_update, [orderId], function (err, result) {
    if (err) return response.error(res, "Gagal menyetujui pesanan", err);
    return response.success(res, "Pesanan berhasil disetujui", result);
  });
});
router.post("/orders/:id/finish", async function (req, res) {
  const orderId = req.params.id;

  try {
    // Langkah 1: Update status order di tabel 'orders'
    const q_update_order = `UPDATE orders SET status_proses = 'completed', status_order = 'success', updated_at = NOW() WHERE id = ?`;

    // Menggunakan db.query langsung (tanpa transaksi)
    const [orderUpdateResult] = await db
      .promise()
      .query(q_update_order, [orderId]); // Asumsi db.promise() ada

    if (orderUpdateResult.affectedRows === 0) {
      // Jika order tidak ditemukan, atau statusnya tidak berubah, kembalikan error
      return response.error(
        res,
        "Pesanan tidak ditemukan atau tidak dalam status yang bisa diselesaikan.",
        null,
        400
      );
    }

    // Langkah 2: Ambil semua item dari order_items untuk order ini
    const q_get_order_items = `SELECT product_id, quantity FROM order_items WHERE order_id = ?`;
    const [orderItems] = await db.promise().query(q_get_order_items, [orderId]); // Asumsi db.promise() ada

    if (orderItems.length === 0) {
      console.warn(
        `Order ID ${orderId} diselesaikan tetapi tidak memiliki item. Tidak ada log stok yang dicatat.`
      );
      // Jika tidak ada item, kita tetap mengembalikan sukses karena update order berhasil
      return response.success(
        res,
        "Pesanan berhasil diselesaikan (tanpa log stok karena tidak ada item).",
        null
      );
    }

    // Langkah 3: Catat setiap item ke stock_logs sebagai 'OUT'
    for (const item of orderItems) {
      const description = `Order selesai: ID Order ${orderId}, item: ${item.product_id}`;
      const q_insert_log = `
                INSERT INTO stock_logs (product_id, change_type, quantity, description)
                VALUES (?, 'OUT', ?, ?)
            `;
      // Menggunakan db.query langsung
      // CATATAN: Jika salah satu INSERT log ini gagal, status order sudah terupdate,
      // dan tidak ada mekanisme rollback di sini.
      await db
        .promise()
        .query(q_insert_log, [item.product_id, item.quantity, description]);
    }

    // Semua operasi berhasil (setidaknya yang dicoba)
    return response.success(
      res,
      "Pesanan berhasil diselesaikan dan log stok dicatat!",
      null
    );
  } catch (err) {
    // Ini akan menangkap error dari UPDATE order, SELECT order_items, atau INSERT stock_logs
    console.error(
      "Error saat menyelesaikan pesanan dan mencatat log stok:",
      err
    );
    return response.error(
      res,
      "Terjadi kesalahan server saat menyelesaikan pesanan." + err.message, // err.message lebih informatif
      null,
      500
    );
  }
});
router.post("/orders/:id/reject", function (req, res) {
  const orderId = req.params.id;

  const q_update = `UPDATE orders SET status_proses = 'rejected',status_order='reject' WHERE id = ?`;
  db.query(q_update, [orderId], function (err, result) {
    if (err) return response.error(res, "Gagal menolak pesanan", err);
    return response.success(res, "Pesanan berhasil ditolak", result);
  });
});

router.get("/orderDetail/:id", function (req, res) {
  // var limit = req.body.query("limit");
  var orderId = req.params.id;

  var q_detail_order = `
                        SELECT
                            oi.id AS id,
                            oi.order_id,
                            oi.product_id,
                            oi.quantity,
                            oi.price AS order_price,
                            oi.size,
                            oi.created_at,
                            oi.updated_at,
                            p.name,
                            p.description,
                            p.image_path,
                            p.price AS product_price,
                            p.category,
                            p.is_active,
                            p.created_at,
                            p.updated_at 
                          FROM
                            order_items AS oi
                            INNER JOIN products AS p ON oi.product_id = p.id
                          WHERE oi.order_id = ?
                              `;

  db.query(q_detail_order, [orderId], function (err, resultDetail) {
    if (err) return response.error(res, "Error : " + err);
    if (resultDetail.length > 0) {
      return response.success(
        res,
        "data detail order berhasil diload",
        resultDetail
      );
    } else {
      return response.error(res, "Tidak ada data ditemukan", resultDetail);
    }
  });
});

router.post("/cart/add", async (req, res) => {
  const { productId, quantity } = req.body;

  if (
    !productId ||
    isNaN(productId) ||
    parseInt(productId) <= 0 ||
    !quantity ||
    isNaN(quantity) ||
    parseInt(quantity) <= 0
  ) {
    return response.error(
      res,
      "ID produk atau kuantitas tidak valid.",
      null,
      400
    );
  }

  const parsedProductId = parseInt(productId);
  const parsedQuantity = parseInt(quantity);
  var userId = 2;
  try {
    const [productRows] = await db
      .promise()
      .query(
        `SELECT id, name, price FROM products WHERE id = ? AND is_active = 1`,
        [parsedProductId]
      );

    if (productRows.length === 0) {
      return response.error(
        res,
        "Produk tidak ditemukan atau tidak aktif.",
        null,
        404
      );
    }

    const product = productRows[0];
    if (product.quantity < parsedQuantity) {
      return response.error(
        res,
        `Stok ${product.name} tidak mencukupi. Tersedia: ${product.quantity}.`,
        null,
        400
      );
    }

    let [orderRows] = await db
      .promise()
      .query(
        `SELECT id FROM orders WHERE user_id = ? AND status_order = 'pending'`,
        [userId]
      );

    let orderId;
    if (orderRows.length === 0) {
      // Jika tidak ada order pending, buat order baru
      const orderRef = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`; // Contoh: ORD-timestamp-randomnumber
      const [newOrderResult] = await db.promise().query(
        `INSERT INTO orders (user_id, order_ref, status_proses, status_order) VALUES (?, ?, 'pending', 'pending')`, // Sertakan order_ref, status_proses, dan status_order jika Anda ingin eksplisit
        [userId, orderRef]
      );
      orderId = newOrderResult.insertId;
    } else {
      orderId = orderRows[0].id;
    }

    // Langkah 3: Tambahkan item ke order_items
    await db
      .promise()
      .query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [orderId, parsedProductId, parsedQuantity, product.price]
      );

    //Langkah 4: kurangi quantity product

    return response.success(res, "Produk berhasil ditambahkan ke keranjang!", {
      productName: product.name,
      orderId: orderId, // Kirim ID order ke frontend jika diperlukan
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    return response.error(
      res,
      "Terjadi kesalahan server saat menambahkan produk ke keranjang." + err,
      null,
      500
    );
  }
});

// AUTH
router.post("/auth-login", function (req, res, next) {
  const { username, password } = req.body;

  // Validasi sederhana (jika diperlukan di backend juga)
  if (!username || !password) {
    return response.error(
      res,
      "Username dan password tidak boleh kosong",
      null,
      400
    ); // Status 400 Bad Request
  }

  var q = `
          SELECT
          u.id,
          u.username,
          u.full_name,
          u.email,
          u.role,
          u.status,
          u.created_at,
          u.updated_at 
        FROM
          users AS u
        WHERE u.username='${username}' and u.password='${password}' and status='Active' 
          `;
  db.query(q, function (err, result) {
    if (err) return response.error(res, "Error : " + err);

    var total = result.length;
    if (total != 0) {
      req.session.username = username;
      req.session.userId = result.id;
      return response.success(res, "Autentikasi berhasil", result);
    } else {
      return response.error(
        res,
        "Autentikasi Gagal, username atau password salah",
        result
      );
    }
  });
});

module.exports = router;
