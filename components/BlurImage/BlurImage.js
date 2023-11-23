'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function BlurImage(props) {
	const [isLoading, setLoading] = useState(true);

	const { className, alt, src } = props;

	return (
		<Image
			{...props}
			alt={alt}
			src={src}
			className={`
              tw-duration-700 tw-ease-in-out
              ${
								isLoading
									? 'tw-scale-110 tw-blur-2xl tw-grayscale'
									: 'tw-scale-100 tw-blur-0 tw-grayscale-0'
							} ${className}`}
			onLoadingComplete={() => setLoading(false)}
		/>
	);
}
