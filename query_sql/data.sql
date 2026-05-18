CREATE TABLE `table_kpi_marketing` (
  `id` int(11) NOT NULL,
  `tasklist` varchar(100) DEFAULT NULL,
  `kpi` varchar(100) DEFAULT NULL,
  `karyawan` varchar(100) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `aktual` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `table_kpi_marketing`
(`id`, `tasklist`, `kpi`, `karyawan`, `deadline`, `aktual`)
VALUES
(1, 'Tasklist 1', 'Sales', 'Budi', '2022-01-10', '2022-01-09'),
(2, 'Tasklist 2', 'Sales', 'Budi', '2022-01-10', '2022-01-08'),
(3, 'Tasklist 3', 'Report', 'Budi', '2022-01-10', '2022-01-07'),
(4, 'Tasklist 4', 'Report', 'Budi', '2022-01-10', '2022-01-12'),
(5, 'Tasklist 5', 'Sales', 'Adi', '2022-01-10', '2022-01-09'),
(6, 'Tasklist 6', 'Sales', 'Adi', '2022-01-10', '2022-01-12'),
(7, 'Tasklist 7', 'Report', 'Adi', '2022-01-10', '2022-01-07'),
(8, 'Tasklist 8', 'Report', 'Adi', '2022-01-10', '2022-01-07'),
(9, 'Tasklist 9', 'Sales', 'Rara', '2022-01-10', '2022-01-12'),
(10, 'Tasklist 10', 'Sales', 'Rara', '2022-01-10', '2022-01-09'),
(11, 'Tasklist 11', 'Report', 'Rara', '2022-01-10', '2022-01-12'),
(12, 'Tasklist 12', 'Report', 'Doni', '2022-01-10', '2022-01-09'),
(13, 'Tasklist 13', 'Sales', 'Doni', '2022-01-10', '2022-01-12');