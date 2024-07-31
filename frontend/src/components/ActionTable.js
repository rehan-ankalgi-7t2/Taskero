import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Chip, TablePagination,
  Checkbox, IconButton, TextField
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import * as XLSX from 'xlsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const fetchData = async () => {
  try {
    const response = await axios.get('http://your-api-endpoint/tasks');
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const CustomTable = ({ columns, actions, tableData }) => {
  const [data, setData] = useState(tableData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("");

//   useEffect(() => {
//     const getData = async () => {
//       const result = await fetchData();
//       setData(result);
//     };
//     getData();
//   }, []);

    useEffect(() => {
        setData(tableData);
    }, [tableData]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "tasks.xlsx");
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredData = data.filter(item => 
    columns.some(column => 
      item[column.id]?.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <TableContainer component={Paper}>
      <TextField
        label="Filter"
        value={filter}
        onChange={handleFilterChange}
        variant="outlined"
        style={{ margin: '10px' }}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selected.length > 0 && selected.length < data.length}
                checked={data.length > 0 && selected.length === data.length}
                onChange={handleSelectAllClick}
              />
            </TableCell>
            {columns.map((column) => (
              <TableCell key={column.id}>
                {column.label}
              </TableCell>
            ))}
            <TableCell>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
            const isItemSelected = isSelected(row._id);
            return (
              <TableRow
                hover
                onClick={(event) => handleClick(event, row._id)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row._id}
                selected={isItemSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isItemSelected}
                  />
                </TableCell>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  );
                })}
                <TableCell>
                  {actions.map((action) => (
                    <Button
                      key={action.label}
                      onClick={() => action.onClick(row)}
                      variant="contained"
                      color={action.color}
                      className='me-1'
                    >
                      {action.label === 'Edit' ? <EditIcon/> : action.label === 'Delete'? <DeleteIcon/> : action.label}
                    </Button>
                  ))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Button
        variant="text"
        color="primary"
        onClick={handleExport}
        style={{ margin: '10px' }}
      >
        Export to XLSX
      </Button>
    </TableContainer>
  );
};

export default CustomTable;
