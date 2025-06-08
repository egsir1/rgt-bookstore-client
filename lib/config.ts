export const sortOptions = [
	{ value: 'newest', label: 'Newest' },
	{ value: 'top_rated', label: 'Top Rated' },
	{ value: 'most_sold', label: 'Best Sellers' },
];

export const categoryOptions = [
	'FICTION',
	'NONFICTION',
	'SCIENCE',
	'TECHNOLOGY',
	'HISTORY',
	'BIOGRAPHY',
	'BUSINESS',
	'CHILDREN',
	'FANTASY',
];

export const BookStatus = ['ACTIVE', 'PAUSED', 'SOLD_OUT'];

/** Difficulty / target-audience levels */
export const levelOptions = [
	'BEGINNER',
	'INTERMEDIATE',
	'ADVANCED',
	'ALL_LEVELS', // mixed audiences
] as const;

/** Primary course languages */
export const languageOptions = [
	'ENGLISH',
	'KOREAN',
	'UZBEK',
	'JAPANESE',
	'CHINESE',
	'SPANISH',
	'FRENCH',
	'GERMAN',
	'PORTUGUESE',
	'RUSSIAN',
] as const;
