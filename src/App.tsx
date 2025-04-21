import React from 'react';
import './App.css';
import UserStats from './components/UserStats';
import { ApolloProvider } from '@apollo/client';
import { client } from './services/api';

function App() {
	return (
		<ApolloProvider client={client}>
			<div className="App min-h-screen bg-base-200">
				<div className="container mx-auto p-4">
					<UserStats />
				</div>
			</div>
		</ApolloProvider>
	);
}

export default App;