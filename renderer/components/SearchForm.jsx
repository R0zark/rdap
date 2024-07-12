
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import SCOPE from '../../main/constants/scope';
import TYPE_OBJECT from '../../main/constants/typeobject';
import ResultTable from './ResultTable';
import { useEffect } from 'react';
export default function SearchForm({ resultSearch, querySearch, sendDelete,sendModify }) {
    const [resultList, setResultList] = useState(resultSearch);
    const [typeObject, setTypeObject] = useState(1);
    const [scope, setScope] = useState(2);
    const [name, setName] = useState('');


    useEffect(() => {
        setResultList(resultSearch);
    }, [resultSearch])

    function handleQuery() {
        querySearch({ name, typeObject, scope });
    }
    function sendDelete(record) {
        sendDelete(record);
    }

    function handleModifyObject(record) {
        sendModify(record.pojo);
    }

    return (
        <>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                rowSpacing={2}
                spacing={{ xs: 2, md: 3, lg: 4 }}
            >
                <Grid item xs={3} md={3} lg={3} alignContent='center'>
                    <TextField fullWidth={true} label="Nombre de objeto" onChange={(e) => setName(e.target.value)} required variant='filled' />
                </Grid>
                <Grid item justifyContent={'center'} xs={3} md={3} lg={3}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Tipo de objeto</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            variant='filled'
                            value={typeObject}
                            label="Objeto"
                            onChange={(e) => setTypeObject(e.target.value)}
                        >
                            <MenuItem value={TYPE_OBJECT.ALL}>Todos</MenuItem>
                            <MenuItem value={TYPE_OBJECT.OU}>Unidad Organizativa</MenuItem>
                            <MenuItem value={TYPE_OBJECT.USER}>Usuario</MenuItem>
                            <MenuItem value={TYPE_OBJECT.GROUP}>Grupo</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3} md={3} lg={3}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Alcance</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            variant='filled'
                            defaultValue={SCOPE.SUB}
                            value={scope}
                            label="Alcance"
                            onChange={(e) => setScope(e.target.value)}
                        >
                            <MenuItem value={SCOPE.BASE}>Base</MenuItem>
                            <MenuItem value={SCOPE.SUB}>Sub</MenuItem>
                            <MenuItem value={SCOPE.ONE}>Uno</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} md={3} lg={3}>
                    <Box>
                        <Button fullWidth={true} variant="contained" style={{ margin: 4 }} color="primary" onClick={() => handleQuery()} >Buscar</Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    {
                        resultList && resultList.length > 0 && <ResultTable resultQuery={resultList} sendDelete={sendDelete} sendModifyObject={handleModifyObject} />
                    }
                </Grid>
            </Grid>
        </>
    )
}