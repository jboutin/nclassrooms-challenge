# Demographix

A React application that visualizes demographic statistics from random user data. This project uses the Random User GraphQL API to fetch user profiles and display statistical breakdowns through interactive visualizations.

## Features

- Configurable sample size (1-5000 users)
- Nationality filtering via country codes
- Interactive D3.js data visualizations
- Real-time statistics updates
- Responsive design implementation

## User Statistics Displayed

- Percentage of users by gender
- Percentage of users in the following age ranges: 0-20, 21-40, 41-60, 61-80, 81-100, 100+
- Counts of users by length of last name
- Percentage of users in each state for the 10 most common states in the results

---


## Development Setup

### Prerequisites

- Node@23.x.x
- npm@10.x.x

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/demographix.git
   cd demographix
   ```

2. Install dependencies: `npm install`

3. Start development server: `npm start`

4. Access the application at [http://localhost:3000](http://localhost:3000)

### Production Build

Generate a production-ready build: `npm run build`

This creates an optimized `build` directory that's minified and ready for deployment.

## Technology Stack

- [React 19](https://react.dev/blog/2024/12/05/react-19)
- [TypeScript](https://www.typescriptlang.org/docs/handbook/react.html)
- [Apollo Client for GraphQL](https://www.apollographql.com/docs/react) (GraphQL State Management)
- [D3.js](https://d3js.org/) (for data visualization via Pie Charts)
- [TailwindCSS](https://v3.tailwindcss.com/) with [DaisyUI](https://v4.daisyui.com/) (Front-end UI)
