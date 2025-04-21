import React, { useState, useEffect } from "react";
import { fetchUsers } from "../services/api";
import { User, Statistics } from "../types";
import PieChart from "./PieChart";

const UserStats: React.FC = () => {
	// formfield states
	const [userCount, setUserCount] = useState<number>(200);
	const [nationality, setNationality] = useState<string>("US");

	// Users and Loading Status states
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// statistic data state
	const [stats, setStats] = useState<Statistics>({
		genderStats: {},
		ageRangeStats: {},
		lastNameLengthStats: {},
		topStatesStats: {},
	});

	const nationalities = [
		"AU",
		"BR",
		"CA",
		"CH",
		"DE",
		"DK",
		"ES",
		"FI",
		"FR",
		"GB",
		"IE",
		"IN",
		"IR",
		"MX",
		"NL",
		"NO",
		"NZ",
		"RS",
		"TR",
		"UA",
		"US",
	];

	// Fetch users when component mounts or inputs change
	useEffect(() => {
		const loadUsers = async () => {
			// Don't fetch if either field is not valid.
			// TODO :: Proper form/field validation.
			if (userCount < 1 || userCount > 5000) {
				setError("User count must be between 1 and 5000");
				return;
			}

			if (!nationalities.includes(nationality)) {
				setError("Please select a valid nationality");
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const userData = await fetchUsers(userCount, nationality);
				setUsers(userData);
				calculateStatistics(userData);
			} catch (err) {
				setError("Failed to fetch users. Please try again.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		// Debounce before feetch after form field change to prevent too many API calls
		const timeoutId = setTimeout(loadUsers, 500);

		// Cleanup timeout when component unmounts or inputs change again
		return () => clearTimeout(timeoutId);
	}, [userCount, nationality]);

	// Calculate stats based on user data
	const calculateStatistics = (userData: User[]) => {
		if (!userData.length) return;

		// Gender stats
		const genderCounts: { [key: string]: number } = {};
		userData.forEach((user) => {
			const gender = user.gender;
			genderCounts[gender] = (genderCounts[gender] || 0) + 1;
		});

		const genderStats: { [key: string]: number } = {};
		Object.keys(genderCounts).forEach((gender) => {
			genderStats[gender] = (genderCounts[gender] / userData.length) * 100;
		});

		// Age range stats
		const ageRanges: { [key: string]: number } = {
			"0-20": 0,
			"21-40": 0,
			"41-60": 0,
			"61-80": 0,
			"81-100": 0,
			"100+": 0,
		};

		userData.forEach((user) => {
			const age = user.dob.age;
			if (age <= 20) ageRanges["0-20"]++;
			else if (age <= 40) ageRanges["21-40"]++;
			else if (age <= 60) ageRanges["41-60"]++;
			else if (age <= 80) ageRanges["61-80"]++;
			else if (age <= 100) ageRanges["81-100"]++;
			else ageRanges["100+"]++;
		});

		const ageRangeStats: { [key: string]: number } = {};
		Object.keys(ageRanges).forEach((range) => {
			ageRangeStats[range] = (ageRanges[range] / userData.length) * 100;
		});

		// Last name length stats
		const lastNameLengths: { [key: string]: number } = {};
		userData.forEach((user) => {
			const length = user.name.last.length;
			lastNameLengths[length] = (lastNameLengths[length] || 0) + 1;
		});

		// Top 10 states stats
		const stateCounts: { [key: string]: number } = {};
		userData.forEach((user) => {
			const state = user.location.state;
			if (state) {
				stateCounts[state] = (stateCounts[state] || 0) + 1;
			}
		});

		const sortedStates = Object.entries(stateCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10);

		const topStatesStats: { [key: string]: number } = {};
		sortedStates.forEach(([state, count]) => {
			topStatesStats[state] = (count / userData.length) * 100;
		});

		setStats({
			genderStats,
			ageRangeStats,
			lastNameLengthStats: lastNameLengths,
			topStatesStats,
		});
	};

	// onChange handler for form fields
	const handleUserCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value);
		if (!isNaN(value)) {
			setUserCount(value);
		}
	};

	const handleNationalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setNationality(e.target.value);
	};

	const genderChartData = Object.entries(stats.genderStats).map(
		([label, value]) => ({
			label,
			value,
		})
	);

	const ageChartData = Object.entries(stats.ageRangeStats).map(
		([label, value]) => ({
			label,
			value,
		})
	);

	const statesChartData = Object.entries(stats.topStatesStats).map(
		([label, value]) => ({
			label,
			value,
		})
	);

	return (
		<div className="flex flex-col gap-8">
			<h1 className="text-4xl font-bold text-center mb-4">
				Random User Statistics
			</h1>
			<div className="card bg-base-100 shadow-xl input-container">
				<div className="card-body">
					<div className="mt-4">
						<div className="flex flex-col md:flex-row gap-4 justify-center items-end">
							<div className="form-control w-full max-w-xs">
								<label className="label">
									<span className="label-text">Number of Users</span>
									<span className="label-text-alt">1-5000</span>
								</label>
								<input
									type="number"
									placeholder="200"
									value={userCount}
									onChange={handleUserCountChange}
									className="input input-bordered w-full max-w-xs"
									min="1"
									max="5000"
								/>
								<label className="label">
									<span className="label-text-alt">
										Data updates automatically as you type
									</span>
								</label>
							</div>

							<div className="form-control w-full max-w-xs">
								<label className="label">
									<span className="label-text">Nationality</span>
								</label>
								<select
									value={nationality}
									onChange={handleNationalityChange}
									className="select select-bordered w-full max-w-xs"
								>
									{nationalities.map((nat) => (
										<option key={nat} value={nat}>
											{nat}
										</option>
									))}
								</select>
								<label className="label">
									<span className="label-text-alt">Country code</span>
								</label>
							</div>
						</div>

						{error && (
							<div role="alert" className="alert alert-error mt-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="stroke-current shrink-0 h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>{error}</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Loading Spinner State */}
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="card bg-base-100 shadow-xl p-12">
						<span className="loading loading-spinner loading-lg text-primary"></span>
						<p className="mt-4 text-center">Fetching user data...</p>
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-8">
					{/* Statistics Display */}
					<div className="stats shadow w-full bg-primary text-primary-content stat-container">
						<div className="stat">
							<div className="stat-title">Total Users</div>
							<div className="stat-value text-5xl">{users.length}</div>
							<div className="stat-desc">From {nationality} nationality</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Gender Stat Card */}
						<div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
							<div className="card-body">
								<h2 className="card-title text-2xl mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									Gender Distribution
								</h2>
								<div className="divider"></div>
								{Object.entries(stats.genderStats).map(
									([gender, percentage]) => (
										<div
											key={gender}
											className="flex justify-between items-center mb-2"
										>
											<span className="capitalize">{gender}</span>
											<div className="flex items-center">
												<div className="badge badge-primary mr-2">
													{percentage.toFixed(1)}%
												</div>
												<progress
													className="progress progress-primary w-56"
													value={percentage}
													max="100"
												></progress>
											</div>
										</div>
									)
								)}
								<div className="flex justify-center mt-6">
									<PieChart
										data={genderChartData}
										title="Gender Distribution"
									/>
								</div>
							</div>
						</div>

						{/* Age Range Stat Card */}
						<div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
							<div className="card-body">
								<h2 className="card-title text-2xl mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									Age Distribution
								</h2>
								<div className="divider"></div>
								{Object.entries(stats.ageRangeStats).map(
									([ageRange, percentage]) => (
										<div
											key={ageRange}
											className="flex justify-between items-center mb-2"
										>
											<span>{ageRange}</span>
											<div className="flex items-center">
												<div className="badge badge-secondary mr-2">
													{percentage.toFixed(1)}%
												</div>
												<progress
													className="progress progress-secondary w-56"
													value={percentage}
													max="100"
												></progress>
											</div>
										</div>
									)
								)}
								<div className="flex justify-center mt-6">
									<PieChart data={ageChartData} title="Age Distribution" />
								</div>
							</div>
						</div>

						{/* Last Name Length Stat Card */}
						<div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
							<div className="card-body">
								<h2 className="card-title text-2xl mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
										/>
									</svg>
									Last Name Length Counts
								</h2>
								<div className="divider"></div>
								<div className="overflow-x-auto">
									<table className="table table-zebra w-full">
										<thead>
											<tr>
												<th className="bg-accent text-accent-content">
													Length
												</th>
												<th className="bg-accent text-accent-content">Count</th>
											</tr>
										</thead>
										<tbody>
											{Object.entries(stats.lastNameLengthStats)
												.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
												.map(([length, count]) => (
													<tr key={length} className="hover">
														<td>{length} characters</td>
														<td>
															<div className="badge badge-accent">{count}</div>
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
							</div>
						</div>

						{/* Top States Stat Card */}
						<div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
							<div className="card-body">
								<h2 className="card-title text-2xl mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									Top 10 States
								</h2>
								<div className="divider"></div>
								{Object.entries(stats.topStatesStats).map(
									([state, percentage]) => (
										<div
											key={state}
											className="flex justify-between items-center mb-2"
										>
											<span>{state}</span>
											<div className="flex items-center">
												<div className="badge badge-info mr-2">
													{percentage.toFixed(1)}%
												</div>
												<progress
													className="progress progress-info w-56"
													value={percentage}
													max="100"
												></progress>
											</div>
										</div>
									)
								)}
								<div className="flex justify-center mt-6">
									<PieChart
										data={statesChartData}
										title="Top States Distribution"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserStats;
