import { ProductList } from "@/components/ProductList";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Product Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage and view your products with ease.
            </p>
          </div>
          <div className="flex items-center gap-4 cursor-pointer ">
            <ThemeToggle />
          </div>
        </div>

        <ProductList />
      </div>
    </main>
  );
}

