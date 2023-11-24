import { ThemeProvider, createTheme, TableSortLabel } from '@mui/material';

import {
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TablePagination,
} from '@mui/material';
import { useStateContext } from 'context/StateContext';

import { useMemo } from 'react';
import {
	useTable,
	usePagination,
	useFilters,
	useSortBy,
	useRowSelect,
} from 'react-table';

const StatsTable = ({ COLUMNS, DATA }) => {
	const finalTheme = createTheme({
		components: {
			MuiTableCell: {
				styleOverrides: {
					head: {
						backgroundColor: '#F6F9FB',
						color: '#AAACAD',
						'&:nth-of-type(1)': {
							textAlign: 'left',
							width: '25%',
						},
						textAlign: 'left',
						textTransform: 'capitalize',
					},
					body: {
						//border: 'none',
						textTransform: 'capitalize',
						textAlign: 'left',
					},
				},
			},
		},
	});

	const columns = useMemo(() => COLUMNS, [COLUMNS]);
	const data = useMemo(() => DATA, [DATA]);

	const { setViewTraveller, setViewTravellerData } = useStateContext();

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		rows,
		gotoPage,
		setPageSize,
		state,
		prepareRow,
	} = useTable(
		{
			columns,
			data,
		},
		useFilters,
		useSortBy,
		usePagination,
		useRowSelect,
		(hooks) => {
			hooks.visibleColumns.push((columns) => {
				return [
					...columns,
					{
						id: 'action',
						Header: 'Action',
						Cell: ({ row }) => (
							<button
								className="btn-style-one dark-green-color !tw-py-1 !tw-px-3 !tw-rounded-lg !tw-h-fit !tw-w-fit !tw-text-xs"
								type="button"
								onClick={() => {
									setViewTravellerData(row.original);
									setViewTraveller(true);
								}}>
								View
							</button>
						),
					},
				];
			});
		}
	);

	const { pageIndex, pageSize } = state;

	return (
		<>
			<ThemeProvider theme={finalTheme}>
				<TableContainer className="tw-bg-transparent tw-rounded-md">
					<Table aria-label="data table" stickyHeader {...getTableProps()}>
						<TableHead>
							{headerGroups.map((headerGroup, headerIndex) => (
								<TableRow
									key={headerIndex}
									{...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map((column, columnIndex) => (
										<TableCell
											key={columnIndex}
											{...column.getHeaderProps(column.getSortByToggleProps())}>
											{column.canSort ? (
												<TableSortLabel
													direction={column.isSortedDesc ? 'desc' : 'asc'}>
													{column.render('Header')}
												</TableSortLabel>
											) : (
												<span>{column.render('Header')}</span>
											)}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableHead>

						<TableBody {...getTableBodyProps()}>
							{page?.map((row, index) => {
								prepareRow(row);
								return (
									<TableRow
										{...row.getRowProps()}
										key={index}
										hover
										sx={{
											'&:last-child td, &:last-child th': { border: 0 },
										}}>
										{row.cells.map((cell, cellIndex) => (
											<TableCell key={cellIndex} {...cell.getCellProps()}>
												{cell.render('Cell')}
											</TableCell>
										))}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
				<div className="tw-hidden lg:tw-flex tw-w-full tw-justify-end lg:tw-px-10">
					{rows.length > 10 && (
						<TablePagination
							rowsPerPageOptions={[10, 25, 50]}
							component="div"
							count={rows.length}
							rowsPerPage={pageSize}
							page={pageIndex}
							onPageChange={(e, page) => gotoPage(page)}
							onRowsPerPageChange={(e) => setPageSize(Number(e.target.value))}
						/>
					)}
				</div>
				<div className="tw-flex lg:tw-hidden tw-w-full tw-justify-end lg:tw-px-10">
					{rows.length > 10 && (
						<TablePagination
							rowsPerPageOptions={[]}
							component="div"
							count={rows.length}
							rowsPerPage={pageSize}
							page={pageIndex}
							onPageChange={(e, page) => gotoPage(page)}
							onRowsPerPageChange={(e) => setPageSize(Number(e.target.value))}
						/>
					)}
				</div>
			</ThemeProvider>
		</>
	);
};

export default StatsTable;
