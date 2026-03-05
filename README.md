## Getting Started

First clone the project and install dependencies:
`npm i`

Then create an env file named ".env.local" in root directory.
Values that env file require are: -

- MONGODB_URI="your local or cloud uri"
- JWT_SECRET="any secret key for jwt"
- NEXT_PUBLIC_GOOGLE_MAP_API="sign up to google maps js api and get the key"
- NEXT_PUBLIC_GEMINI_API_KEY="get your api key from aistudio.google.com"

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
