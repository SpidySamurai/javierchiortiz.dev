import Header from "@/components/Header";

export default function Home() {
  return (
    <main>
      <Header />
      <h1 className="mt-6 text-3xl text-center text-white">
        Página en construcción
      </h1 >
      <p className="text-lg text-center text-white mb-6">
        Tomate un tecito o un cafecito, que ya está por llover 🌧️☕
      </p>
      <div className="flex justify-center ">
        <img
          src="https://i.gifer.com/7plP.gif" // puedes cambiar este gif por otro si quieres
          alt="Lluvia tranquila"
          className="w-72 h-auto rounded-lg shadow-md"
        />
      </div>
    </main>
  );
}
