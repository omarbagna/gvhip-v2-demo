import { SessionProvider } from 'next-auth/react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import React, { useState } from 'react';
import AOS from 'aos';
import '../node_modules/aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '/styles/flaticon.css';
import '/styles/boxicons.min.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'swiper/css/bundle';
import 'react-tabs/style/react-tabs.css';
import '/styles/faq.css';
import '/styles/global.css';
import '/styles/style.css';
import '/styles/header.css';
import '/styles/footer.css';
import '/styles/responsive.css';
import NextNProgress from 'nextjs-progressbar';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import ScrollToTop from '@/components/Layout/ScrollToTop';

import Head from 'next/head';
import { StateContext } from 'context/StateContext';

function MyApp({ Component, pageProps }) {
	const [queryClient] = useState(() => new QueryClient());
	React.useEffect(() => {
		AOS.init();
	}, []);
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>GVHIP - Ghana Visitors Health Insurance Platform</title>
				<meta
					name="title"
					content="GVHIP - Ghana Visitors Health Insurance Platform"
				/>
				<meta
					name="description"
					content="The Ghana Visitors Health Insurance Platform (GVHIP) ensures that you have a seamless, safe, and medically secure trip within our beautiful country.
Ghana welcomes you with open arms!"
				/>

				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://gvhip-v2-demo.netlify.app/" />
				<meta
					property="og:title"
					content="GVHIP - Ghana Visitors Health Insurance Platform"
				/>
				<meta
					property="og:description"
					content="The Ghana Visitors Health Insurance Platform (GVHIP) ensures that you have a seamless, safe, and medically secure trip within our beautiful country.
Ghana welcomes you with open arms!"
				/>
				<meta property="og:image" content="/gsti_logo.jpeg" />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://gvhip-v2.netlify.app/" />
				<meta
					property="twitter:title"
					content="GVHIP - Ghana Visitors Health Insurance Platform"
				/>
				<meta
					property="twitter:description"
					content="The Ghana Visitors Health Insurance Platform (GVHIP) ensures that you have a seamless, safe, and medically secure trip within our beautiful country.
Ghana welcomes you with open arms!"
				/>
				<meta property="twitter:image" content="/gsti_logo.jpeg" />
			</Head>

			<QueryClientProvider client={queryClient}>
				<Hydrate state={pageProps.dehydratedState}>
					<StateContext>
						<SessionProvider session={pageProps.session}>
							<NextNProgress color="#8e6abf" height={5} />
							<Component {...pageProps} />
							<ToastContainer
								position="top-right"
								autoClose={10000}
								hideProgressBar={false}
								newestOnTop={false}
								closeOnClick
								rtl={false}
								pauseOnFocusLoss
								draggable
								pauseOnHover
								theme="colored"
							/>
						</SessionProvider>
					</StateContext>
				</Hydrate>
				<ReactQueryDevtools initialIsOpen={false} position="bottom-left" />
			</QueryClientProvider>

			<ScrollToTop />
		</>
	);
}

export default MyApp;
