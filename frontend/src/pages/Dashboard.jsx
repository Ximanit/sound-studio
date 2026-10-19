import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Headphones, Building2, Users, Disc3, UserRound,
  Mic2, Handshake, CalendarCheck, TrendingUp, ArrowRight
} from 'lucide-react';
import {
  servicesApi, roomsApi, employeesApi, catalogApi,
  clientsApi, equipmentApi, dealsApi, provisionsApi,
} from '../api/client';
import { navItems } from '../config/tables';

const iconMap = {
  Headphones, Building2, Users, Disc3, UserRound,
  Mic2, Handshake, CalendarCheck,
};

const apiList = [
  { key: 'services', api: servicesApi },
  { key: 'rooms', api: roomsApi },
  { key: 'employees', api: employeesApi },
  { key: 'catalog', api: catalogApi },
  { key: 'clients', api: clientsApi },
  { key: 'equipment', api: equipmentApi },
  { key: 'deals', api: dealsApi },
  { key: 'provisions', api: provisionsApi },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const results = {};
      await Promise.all(
        apiList.map(async ({ key, api }) => {
          try {
            const data = await api.getAll();
            results[key] = data.length;
          } catch {
            results[key] = '—';
          }
        })
      );
      setCounts(results);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden card p-8 sm:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-studio-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative">
          <div className="flex items-center gap-2 text-studio-400 text-sm font-medium mb-3">
            <TrendingUp className="w-4 h-4" />
            Панель управления
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            SoundLab Studio
          </h1>
          <p className="text-gray-400 max-w-lg">
            Система управления студией звукозаписи. Услуги, помещения, сотрудники,
            каталог треков, клиенты, оборудование, сделки и оказание услуг.
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || Headphones;
          return (
            <Link
              key={item.key}
              to={`/${item.key}`}
              className="card p-5 group hover:border-studio-500/30 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-studio-600/15 flex items-center justify-center
                                group-hover:bg-studio-600/25 transition-colors">
                  <Icon className="w-5 h-5 text-studio-400" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-studio-400 
                                       group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-sm text-gray-400 mb-1">{item.title}</p>
              <p className="text-2xl font-bold tracking-tight">
                {loading ? (
                  <span className="inline-block w-8 h-7 bg-white/5 rounded animate-pulse" />
                ) : (
                  counts[item.key] ?? '—'
                )}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
