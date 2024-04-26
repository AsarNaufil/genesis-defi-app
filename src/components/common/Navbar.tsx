import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

// Define navigation links
const navLinks = [
	{ to: '/signup', label: 'SignUp' },
	{ to: '/login', label: 'Login' },
	{ to: '/dashboard', label: 'Dashboard' },
	{ to: '/payments', label: 'Payments' }
];

const Navbar: React.FC = () => {
	const [darkMode, setdarkMode] = useState<boolean>(true)

	const toggleDarkMode = () => {
		if (darkMode)
			document.documentElement.classList.add('dark');
		else
			document.documentElement.classList.remove('dark');
		setdarkMode(!darkMode);
	}

	return (
		<>
			<nav className="z-[50] fixed top-0 w-full border-b backdrop-blur-sm bg-white/[0.6] dark:bg-black/[0.6] border-neutral-200 dark:border-white/[0.1]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								{/* Your logo or brand icon */}
								<span className="text-xl text-gray-900 dark:text-gray-300 font-bold">Genesis DeFi</span>
							</div>
						</div>

						<div className="flex items-center">
							<div className="hidden md:flex items-center">
								<button onClick={toggleDarkMode} className="text-gray-900 dark:text-gray-300 dark:shadow-gray-600 shadow-sm p-3 py-2 rounded-md text-sm font-medium">
									<span>
										{darkMode ? <Moon className='size-4' /> : <Sun className='size-4' />}
									</span>
								</button>
								{navLinks.map((link, index) => (
									<Link key={index} to={link.to} className="text-gray-900 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">{link.label}</Link>
								))}
							</div>
						</div>

					</div>
				</div>
			</nav>
			<div className="h-16" />
		</>
	);
}

export default Navbar;

