import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productImageStorage } from "../../../_api";
import { showProduct } from "../../../_services/products";
// Tambahkan import untuk fungsi penambah keranjang jika sudah ada
// import { addToCart } from "../../../_services/cart";

export default function ShowProduct() {
   const { id } = useParams();

   const navigate = useNavigate();
   const [product, setProduct] = useState({});
   const [loading, setLoading] = useState(true);
   const [quantity, setQuantity] = useState(1); // Default quantity 1

   // Mendefinisikan variabel bantu untuk harga dan stok
   const productPrice = product.price || 0;
   // ASUMSI: Properti ini ada di objek produk yang dikembalikan dari API
   const availableStock = product.stock || 0;

   // Menghitung Subtotal
   const subTotal = quantity * productPrice;

   const remainingStock = availableStock - quantity;

   const loadProduct = useCallback(async () => {
      if (!id) return;

      setLoading(true);
      try {
         const data = await showProduct(id);
         setProduct(data);

         // Opsional: Cek jika stok 0, set quantity ke 0 atau 1
         if (data.stock_available === 0) {
            setQuantity(0);
         }
      } catch (error) {
         console.error(`Cannot load Product Detail for ID ${id}:`, error);
      } finally {
         setLoading(false);
      }
   }, [id]);

   useEffect(() => {
      loadProduct();
   }, [loadProduct]);

   // Fungsi untuk menangani perubahan kuantitas dengan validasi stok
   const handleQuantityChange = (e) => {
      let value = parseInt(e.target.value);

      if (isNaN(value) || value < 1) {
         value = 1; // Minimal 1
      }

      // 🚨 Batasan Stok: Tidak bisa melebihi stok yang tersedia
      if (value > availableStock) {
         value = availableStock;
      }

      setQuantity(value);
   };

   // Fungsi untuk menangani pengiriman form (Tombol Beli)
   const handleSubmit = (e) => {
      e.preventDefault();

      const initialStock = parseInt(product.stock) || 0;
      const currentQuantity = parseInt(quantity) || 0;

      // Validasi Stok dan Kuantitas
      if (currentQuantity < 1 || currentQuantity > initialStock) {
         alert("Kuantitas tidak valid atau melebihi stok.");
         return;
      }

      const transactionData = {
         // Data yang WAJIB dibawa untuk API call
         product_id: id,
         quantity: currentQuantity,

         // Data tambahan untuk tampilan ringkasan
         total_price: subTotal,
         product_name: product.name,
         product_price: productPrice,
      };

      // 🚨 KUNCI: Menyimpan data yang terstruktur
      localStorage.setItem("checkoutData", JSON.stringify(transactionData));

      navigate("/staff/products/checkout", { state: transactionData });

      console.log(
         `Menambahkan ke Keranjang: ID ${id}, Jumlah ${quantity}, Total Rp. ${subTotal.toLocaleString(
            "id-ID"
         )}`
      );
      // Anda bisa memanggil fungsi API addToCart(id, quantity) di sini.
   };

   // --- (Kode Loading dan Rendering) ---
   if (loading) {
      return (
         <div className="text-center py-10">
            <p className="text-xl dark:text-white">Memuat Produk...</p>
         </div>
      );
   }

   if (!product || Object.keys(product).length === 0) {
      return (
         <div className="text-center py-10">
            <p className="text-xl text-red-600">Produk tidak ditemukan.</p>
         </div>
      );
   }

   // Fungsi pembantu untuk memformat Rupiah
   const formatRupiah = (number) => {
      return `Rp. ${Number(number).toLocaleString("id-ID")}`;
   };

   return (
      <>
         <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
               <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                  {/* Kolom Gambar */}
                  <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                     <img
                        className="mx-auto h-full"
                        src={`${productImageStorage}/${product.photo_product}`}
                        alt={product.name}
                     />
                  </div>

                  {/* Kolom Detail */}
                  <div className="mt-6 sm:mt-8 lg:mt-0">
                     <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                        {product.name}
                     </h1>
                     <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                        <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                           {formatRupiah(productPrice)}
                        </p>
                        {/* ... (Bagian rating tidak diubah) ... */}
                     </div>

                     <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                           {/* 🚨 KONTEN BARU: STOK & SUBTOTAL */}
                           <div className="flex items-start gap-4">
                              {/* Bagian Kuantitas */}
                              <div className="w-1/3">
                                 <label
                                    htmlFor="quantity"
                                    className="block text-sm font-medium text-gray-700 dark:text-white"
                                 >
                                    <span className="text-red-500 text-xm ml-1 block">
                                       Sisa: {remainingStock}
                                    </span>
                                 </label>
                                 <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={quantity}
                                    min={1}
                                    max={availableStock}
                                    onChange={handleQuantityChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    disabled={availableStock === 0}
                                 />
                              </div>

                              {/* Bagian Subtotal */}
                              <div className="w-2/3 mt-6">
                                 <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                                    {formatRupiah(subTotal)}
                                 </p>
                              </div>
                           </div>
                           {/* 🚨 END KONTEN BARU */}

                           <button
                              type="submit"
                              disabled={quantity === 0 || availableStock === 0} // Disable jika stok 0 atau kuantitas 0
                              className={`w-full text-white mt-4 sm:mt-0 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800 flex items-center justify-center ${
                                 quantity === 0 || availableStock === 0
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                              }`}
                           >
                              Beli
                           </button>
                        </form>
                     </div>

                     <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

                     <p className="mb-6 text-gray-500 dark:text-gray-400">
                        {product.description}
                     </p>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
}
