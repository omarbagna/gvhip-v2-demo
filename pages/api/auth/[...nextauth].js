import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from '../axios';

export default NextAuth({
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				login: {
					label: 'Email or Policy Number',
					type: 'text',
					placeholder: 'email or policy number',
				},
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				const { login, password } = credentials;

				try {
					const response = await axios.post(
						'/login',
						{
							login: login.replace(' ', ''),
							password: password,
						},
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
						}
					);

					//console.log(response.data);

					const data = response.data;

					if (data.status === 200) {
						return data;
					} else {
						return Promise.resolve(null);
					}
				} catch (error) {
					console.error('Login error:', error);
					return Promise.resolve(null);
				}

				/*
				const res = await axios.post('/login', {
					//method: 'POST',
					body: JSON.stringify({
						email: email,
						password: password,
					}),
				});

				console.log(res);

				const user = res.json();
				
				const user = {
					id: 1,
					first_name: 'John',
					last_name: 'Smith',
					email: 'bagna@email.com',
					password: '1234',
					role: 'admin',
				};
				
				if (user.email === email && user.password === password) {
					return user;
				} else {
					return null;
				}
				*/
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,

	callbacks: {
		async jwt({ token, user }) {
			return { ...token, ...user };
		},
		async session({ session, token, user }) {
			session.user = token;
			return session;
		},
		/*
		async redirect({ url, baseUrl }) {
			return `/dashboard`;
		},
		*/
	},
	pages: {
		signIn: '/authentication',
		error: '/authentication',
	},
	session: {
		strategy: 'jwt',
	},
});
