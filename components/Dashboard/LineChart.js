import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	//PointElement,
	//LineElement,
	BarElement,
	Title,
	Filler,
	Tooltip,
	Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';

ChartJS.register(
	CategoryScale,
	LinearScale,
	//PointElement,
	//LineElement,
	BarElement,
	Title,
	Filler,
	Tooltip,
	Legend
);

const options = {
	responsive: true,
	animation: true,
	scales: {
		x: {
			grid: {
				display: false,
			},
		},
		y: {
			display: false,
			grid: {
				display: false,
			},
		},
	},
	plugins: {
		legend: {
			position: 'bottom',
			align: 'end',
			labels: {
				usePointStyle: true,
				padding: 30,
				font: {
					size: 14,
				},
			},
		},
		title: {
			display: true,
			color: 'rgb(119, 98, 175)',
			align: 'start',
			font: {
				size: 25,
				weight: 500,
			},
			text: 'Application Verification History',
		},
	},
};

const LineChart = ({ chartData, chartType }) => {
	const data = {
		labels: chartData?.map(({ label }) =>
			chartType === 'this_year'
				? label
				: chartType === 'this_week'
				? dayjs(label).format('dddd')
				: chartType === 'this_month' && dayjs(label).format('DD MMM, YYYY')
		),
		datasets: [
			{
				fill: false,
				label: 'Verified',
				data: chartData?.map(({ verified }) => verified),
				borderColor: 'rgb(119, 98, 175)',
				backgroundColor: 'rgba(119, 98, 175, 1)',
				borderRadius: 3,
			},
			{
				fill: false,
				label: 'Declined',
				data: chartData?.map(({ declined }) => declined),
				borderColor: 'rgb(255, 236, 244)',
				backgroundColor: 'rgba(255, 236, 244, 1)',
				borderRadius: 3,
			},
		],
	};

	return (
		<Bar
			options={options}
			data={data}
			className="tw-bg-white tw-shadow-sm tw-rounded-lg tw-p-2 tw-w-full"
		/>
	);
};

export default LineChart;
