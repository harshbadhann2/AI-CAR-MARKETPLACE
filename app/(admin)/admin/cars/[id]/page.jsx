import { getCarById } from "@/actions/cars";
import { EditCarForm } from "./_components/edit-car-form";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Car | Admin | Vehiql",
  description: "Edit car details",
};

export default async function EditCarPage({ params }) {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Car</h1>
      <EditCarForm car={result.data} />
    </div>
  );
}
