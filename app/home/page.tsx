import CsvToSqlPanel from "@/pageComponents/home";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#DFD0B8] text-gray-900">
      <h1 className="text-2xl font-bold mb-6">CSV to SQL Insert Generator</h1>
      <CsvToSqlPanel />
    </main>
  );
}
