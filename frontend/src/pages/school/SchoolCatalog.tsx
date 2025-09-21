import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Store } from "lucide-react";

interface School {
  id: number;
  name: string;
  address: string;
  contact: string;
  students: number;
  canteens: number;
}

interface Menu {
  id: number;
  schoolId: number;
  name: string;
  price: number;
  description: string;
  image?: string;
}

const SchoolCatalog = () => {
  const { id } = useParams();
  const [school, setSchool] = useState<School | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);

  // fetch detail sekolah
  useEffect(() => {
    fetch(`http://localhost:3002/schools/${id}`)
      .then((res) => res.json())
      .then((data) => setSchool(data))
      .catch((err) => console.error("Error fetching school:", err));
  }, [id]);

  // fetch menu berdasarkan sekolah
  useEffect(() => {
    fetch(`http://localhost:3002/menus?schoolId=${id}`)
      .then((res) => res.json())
      .then((data) => setMenus(data))
      .catch((err) => console.error("Error fetching menus:", err));
  }, [id]);

  if (!school) {
    return <p className="text-center text-muted-foreground mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Sekolah */}
      <section className="bg-primary/10 py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">{school.name}</h1>
          <div className="flex justify-center items-center text-muted-foreground gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {school.address}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {school.students} siswa
            </div>
            <div className="flex items-center gap-1">
              <Store className="w-4 h-4" /> {school.canteens} kantin
            </div>
          </div>
        </div>
      </section>

      {/* Daftar Menu */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Menu Tersedia</h2>

          {menus.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Belum ada menu terdaftar untuk sekolah ini
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <Card key={menu.id} className="p-4 flex flex-col">
                  {menu.image && (
                    <img
                      src={menu.image}
                      alt={menu.name}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="font-bold text-lg">{menu.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{menu.description}</p>
                  <p className="font-semibold mb-4">Rp {menu.price.toLocaleString()}</p>
                  <Button variant="default">Pesan</Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SchoolCatalog;
