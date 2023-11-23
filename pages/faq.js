import React, { useState } from 'react';
import Navbar from '@/components/Layout/Navigations/Navbar4';
import FaqOne from '@/components/Faq/FaqOne';
//import PartnerStyle1 from '@/components/Partners/PartnerStyle1';
import FooterFour from '@/components/Layout/Footer/FooterFour';
import { Controller, useForm } from 'react-hook-form';

const Faq = () => {
	const [searchValue, setSearchValue] = useState(null);

	const { control, reset, handleSubmit } = useForm({
		mode: 'all',
		reValidateMode: 'onChange',
		defaultValues: {
			searchTerm: '',
		},
	});

	const findFaq = (data) => {
		setSearchValue(data.searchTerm);
		reset();
	};

	const clearSearch = () => {
		setSearchValue(null);
	};

	return (
		<>
			<Navbar />
			<div className="page-title-area">
				<div className="container">
					<div className="page-title-content">
						<span className="sub-title">FAQ</span>
						<h1>Frequently Asked Questions</h1>
						<form onSubmit={handleSubmit(findFaq)}>
							<Controller
								name={`searchTerm`}
								control={control}
								defaultValue={''}
								rules={{ required: true }}
								render={({ field: { ref, ...field } }) => (
									<>
										<label>
											<i className="bx bx-search"></i>
										</label>
										<input
											{...field}
											ref={ref}
											type="text"
											className="input-search"
											placeholder="Find a question..."
											required
										/>
									</>
								)}
							/>
							<button type="submit">Search</button>
						</form>
					</div>
				</div>
			</div>
			<FaqOne searchValue={searchValue} reset={clearSearch} />
			{/**
			 *
			<PartnerStyle1 />
			 */}
			<FooterFour />
		</>
	);
};

export default Faq;
