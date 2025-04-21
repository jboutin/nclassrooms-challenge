import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Apolo instance for GraphQL state
export const client = new ApolloClient({
	uri: 'https://nextjs-randomuser-graphql.vercel.app/api/graphql',
	cache: new InMemoryCache(),
});

// GraphQL query
export const GET_USERS = gql`
	query GetUsers($results: Int!, $nat: String!) {
		users(results: $results, nat: $nat) {
			gender
			name {
				first
				last
			}
			dob {
				date
				age
			}
			location {
				state
			}
		}
	}
`;

// fetchUsers function to get data.
export const fetchUsers = async (results: number = 200, nat: string = 'US') => {
	try {
		const response = await client.query({
			query: GET_USERS,
			variables: { results, nat },
		});
		return response.data.users;
	} catch (error) {
		console.error('Error fetching users:', error);
		return [];
	}
};