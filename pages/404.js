import React from 'react';
import Link from 'next/link';

import errorImg from '@/public/images/error.png';
import BlurImage from '@/components/BlurImage/BlurImage';

export default function Custom404() {
	return (
		<div className="not-found-area ptb-100">
			<div className="d-table">
				<div className="d-table-cell">
					<div className="container">
						<div className="not-found-content">
							<BlurImage src={errorImg} alt="error-image" />

							<h3>Oops! That page can&apos;t be found</h3>

							<p>
								The page you are looking for might have been removed had its
								name changed or is temporarily unavailable.
							</p>

							<Link href="/">
								<a className="btn-style-one red-light-color">
									Back to Home <i className="bx bx-chevron-right"></i>
								</a>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
