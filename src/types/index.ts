export interface User {
	gender: string;
	name: {
		first: string;
		last: string;
	};
	dob: {
		date: string;
		age: number;
	};
	location: {
		state: string;
	};
}

export interface Statistics {
	genderStats: {
		[key: string]: number;
	};
	ageRangeStats: {
		[key: string]: number;
	};
	lastNameLengthStats: {
		[key: string]: number;
	};
	topStatesStats: {
		[key: string]: number;
	};
}