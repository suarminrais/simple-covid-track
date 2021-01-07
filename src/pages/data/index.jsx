import React, { useEffect, useState } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import { Box, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  margin: {
    marginBottom: '1em',
  }
}));

const DataPreview = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false)
  const [daerah, setDaerah] = useState('')
  const [kasus, setKasus] = useState('')
  const [meninggal, setMeninggal] = useState('')
  const [sembuh, setSembuh] = useState('')
  const [modalStyle] = useState(getModalStyle)
  const [items, setItems] = useState()
  const [total, setTotal] = useState()

  const handleSubmit = e => {
    e.preventDefault()
    fetch('http://localhost:9200/data/_doc/' + (parseInt(total) + 1), {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        daerah,
        kasus,
        meninggal,
        sembuh
      })
    })
      .then(res => res.json())
      .then(() => setOpen(false))
  }

  const handleDelete = (id) => {
    fetch('http://localhost:9200/data/_doc/' + id, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(() => { })
  }

  useEffect(() => {
    fetch('http://localhost:9200/data/_search')
      .then(response => response.json())
      .then(({ hits: { hits, total: { value } } }) => {
        setItems(hits)
        setTotal(value)
      });
  }, [items])

  return (
    <Box>
      <Button onClick={() => setOpen(true)} variant="contained" color="primary" startIcon={<AddIcon />}>Tambah Data</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <TextField required onChange={(e) => setDaerah(e.target.value)} className={classes.margin} id="daerah" label="Daerah" variant="outlined" fullWidth />
            <TextField required onChange={(e) => setKasus(e.target.value)} className={classes.margin} id="kasus" type="number" label="Kasus" variant="outlined" fullWidth />
            <TextField required onChange={(e) => setMeninggal(e.target.value)} className={classes.margin} id="meninggal" type="number" label="Meninggal" variant="outlined" fullWidth />
            <TextField required onChange={(e) => setSembuh(e.target.value)} className={classes.margin} id="sembuh" type="number" label="Sembuh" variant="outlined" fullWidth />
            <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />}>Tambah Data</Button>
          </form>
        </div>
      </Modal>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Daerah</TableCell>
              <TableCell align="right">Kasus</TableCell>
              <TableCell align="right">Meninggal</TableCell>
              <TableCell align="right">Sembuh</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((row, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {row["_source"].daerah}
                </TableCell>
                <TableCell align="right">{row["_source"].kasus}</TableCell>
                <TableCell align="right">{row["_source"].meninggal}</TableCell>
                <TableCell align="right">{row["_source"].sembuh}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDelete(row["_id"])} color="secondary" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box >
  )
}

export default DataPreview
