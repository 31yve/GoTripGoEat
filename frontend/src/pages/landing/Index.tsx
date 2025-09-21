const Landing = () => {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/schools');
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      const data = await response.json();
      console.log('Fetched schools:', data); // Tambah log untuk debug
      if (Array.isArray(data)) setSchools(data);
      else {
        console.warn('Data is not an array:', data);
        setSchools([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch schools';
      console.error('Fetch error:', errorMessage);
      setError(errorMessage);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading schools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-destructive">Gagal Memuat Data</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchSchools}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Selamat Datang di GoTripGoEat
            <span className="text-primary block">Platform Kantin Sekolah</span>
          </h1>
          {schools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {schools.map((school) => (
                <Card key={school.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold">{school.name}</h3>
                  <p className="text-muted-foreground mt-2">{school.address}</p>
                  <p className="text-sm mt-1">Kontak: {school.contact}</p>
                  <p className="text-sm mt-1">Siswa: {school.students}</p>
                  <p className="text-sm mt-1">Kantin: {school.canteens}</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mt-6">Belum Ada Sekolah Terdaftar</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;