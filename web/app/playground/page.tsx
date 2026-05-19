import { PlaygroundEditor } from "@/features/playground/components/playground-editor";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function PlaygroundPage() {
  return (
    <div className="flex flex-col min-h-screen p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Interactive Postgres Playground</h2>
          <p className="text-muted-foreground">Jalankan Raw SQL langsung ke database terisolasi (Soal 1 & 2)</p>
        </div>
      </div>
      
      <div className="pb-12">
        <PlaygroundEditor />
      </div>
    </div>
  );
}
