import React from 'react';
import Navbar from '@/components/Layout/Navigations/Navbar4';
//import ContactInfo from '@/components/Contact/ContactInfo';
import ContactForm from '@/components/Contact/ContactForm';
import FooterFour from '@/components/Layout/Footer/FooterFour';

const Contact = () => {
	return (
		<>
			<Navbar />
			{/**
			<div className="page-title-area">
				<div className="container">
					<div className="page-title-content">
						<span className="sub-title red-light-color">Get in Touch</span>
						<h1>Connecting People With Knowledge</h1>
					</div>
				</div>
			</div>
			<ContactInfo />
			 */}
			<ContactForm />
			<FooterFour />
		</>
	);
};

export default Contact;
