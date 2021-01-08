import { Box, Grid, makeStyles, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyle = makeStyles(() => ({
  margin: {
    marginTop: '5rem',
    marginBottom: '5rem',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  row: {
    display: 'flex'
  }
}))

const HomePage = () => {
  const classes = useStyle()
  const [items, setItems] = useState()

  const handleSearch = e => {
    fetch('http://localhost:9200/data/_search/', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
          match: {
            daerah: e.target.value
          }
        }
      })
    })
      .then(res => res.json())
      .then(({ hits: { hits } }) => {
        setItems(hits)
      })
  }
  return (
    <Grid container>
      <Grid sm="12">
        <Box className={classes.row}>
          <TextField onChange={handleSearch} className={classes.margin} type="search" label="Cari Daerah" id="cari-daerah" placeholder="Masukkan dearah" variant="outlined" />
        </Box>
      </Grid>
      <Grid sm="12">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Daerah</TableCell>
                <TableCell align="right">Kasus</TableCell>
                <TableCell align="right">Meninggal</TableCell>
                <TableCell align="right">Sembuh</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default HomePage
