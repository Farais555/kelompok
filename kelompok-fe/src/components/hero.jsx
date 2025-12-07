export default function Hero() {
   return (
      <>
         <section className="bg-white">
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
               <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-6xl dark:text-white">
                  Sedia <span className="text-green-600">Gas</span> &{" "}
                  <span className="text-blue-700">Galon</span> untuk kebutuhan
                  rumah.
               </h1>
               <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                  Kami menyediakan gas dan galon untuk memenuhi kebutuhan pokok
                  rumah tangga dengan layanan praktis dan terpercaya.
               </p>
            </div>
         </section>
      </>
   );
}
