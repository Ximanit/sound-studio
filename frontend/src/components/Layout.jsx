import { NavLink, Outlet } from 'react-router-dom';
import {
	Headphones,
	Building2,
	Users,
	Disc3,
	UserRound,
	Mic2,
	Handshake,
	CalendarCheck,
	Music2,
	Menu,
	X,
} from 'lucide-react';
import { useState } from 'react';
import { navItems } from '../config/tables';

const iconMap = {
	Headphones,
	Building2,
	Users,
	Disc3,
	UserRound,
	Mic2,
	Handshake,
	CalendarCheck,
};

export default function Layout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex min-h-screen">
			{/* Mobile overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/60 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-900/95 backdrop-blur-xl 
                    border-r border-white/5 flex flex-col transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
				{/* Logo */}
				<div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
					<div
						className="w-10 h-10 rounded-xl bg-gradient-to-br from-studio-500 to-studio-700 
                          flex items-center justify-center shadow-glow">
						<Music2 className="w-5 h-5 text-white" />
					</div>
					<div>
						<h1 className="font-bold text-lg tracking-tight">SoundLab</h1>
						<p className="text-xs text-gray-500">Studio Manager</p>
					</div>
					<button
						className="ml-auto lg:hidden text-gray-400 hover:text-white"
						onClick={() => setSidebarOpen(false)}>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
					{navItems.map((item) => {
						const Icon = iconMap[item.icon] || Headphones;
						return (
							<NavLink
								key={item.key}
								to={`/${item.key}`}
								onClick={() => setSidebarOpen(false)}
								className={({ isActive }) =>
									`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                   ${
											isActive
												? 'bg-studio-600/20 text-studio-300 shadow-glow'
												: 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
										}`
								}>
								<Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
								{item.title}
							</NavLink>
						);
					})}
				</nav>
			</aside>

			{/* Main content */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top bar (mobile) */}
				<header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-dark-900/80 backdrop-blur">
					<button
						onClick={() => setSidebarOpen(true)}
						className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
						<Menu className="w-5 h-5" />
					</button>
					<span className="font-semibold">SoundLab Studio</span>
				</header>

				<main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
