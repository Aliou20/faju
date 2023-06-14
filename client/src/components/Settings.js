import { Badge, Box, Collapse, Container, Divider, Grid, Input } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAt } from '@tabler/icons'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editBusyTimes, getOneBusyTimes } from '../redux/services/busyTimesServices'
import successMsg from '../utils/functions/successMsg'
import { btnStyle } from '../utils/linkStyle'
import EditInput from './EditInput'

const Settings = () => {
    const currentUser = useSelector(state => state.user)
    const busyTimes = useSelector(state => state.busyTimes)
    const busyTime = busyTimes?.currentBusyTIme
    const [editForm, setEditForm] = useState(false)
    const dispatch = useDispatch()
    const form = useForm({
        initialValues: { 
            workStartAt: busyTime?.workStartAt, 
            workEndAt: busyTime?.workEndAt, 
            appointmentDuration: busyTime?.appointmentDuration, 
            breakTime: busyTime?.breakTime 
        },

        // functions will be used to validate values at corresponding key
        validate: {
            workStartAt: (value) => (value === '' ? 'Les champs ne doivent pas etre vides' : null),
            workEndAt: (value) => (value === '' ? 'Les champs ne doivent pas etre vides' : null),
            appointmentDuration: (value) => (value === '' ? 'Les champs ne doivent pas etre vides' : null),
            breakTime: (value) => (value === '' ? 'Les champs ne doivent pas etre vides' : null),
        },
    });

    useEffect(() => {
        dispatch(getOneBusyTimes(currentUser._id))
    }, [])

    const editUserParams = form.onSubmit(values => {
        dispatch(editBusyTimes({id: currentUser._id, data: values}))
        .then(res => {
            if (res.type === "busyTimes/edit/fulfilled") {
                successMsg("Paramètres modifiés")
                setEditForm(false)
                form.reset()
            }
        })
        // console.log(values)
    })

    return (
        <div>
            <Container p="sm" sx={{ boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)' }}>
                <h2 style={{ margin: '0' }}>Paramètres</h2>
                <Box p="sm">
                    <h4>Informations personnelles</h4>
                    <Grid style={{ fontSize: '0.8rem', fontWeight: '700' }} mt="sm">
                        <Grid.Col span={12} sm={6}>Prénom : <Badge color="pink">{currentUser.firstname}</Badge></Grid.Col>
                        <Grid.Col span={12} sm={6}>Nom : <Badge color="pink">{currentUser.lastname}</Badge></Grid.Col>
                        <Grid.Col span={12} sm={6}>Email : <Badge color="pink">{currentUser.email}</Badge></Grid.Col>
                        <Grid.Col span={12} sm={6}>Teléphone : <Badge color="pink">{currentUser.phone}</Badge></Grid.Col>
                    </Grid>
                </Box>
                <Divider></Divider>
                <Box p="sm">
                    <h4>Paramètres avancés</h4>
                    <form onSubmit={editUserParams}>
                        <Grid style={{ fontSize: '0.8rem', fontWeight: '700' }} mt="sm">
                            <Grid.Col span={12} sm={6}>
                                <div>
                                    Début journée de travail : <Badge color="pink">{busyTime?.workStartAt}</Badge>
                                </div>
                                <EditInput editForm={editForm} placeholder="Heure de debut" form={form} name="workStartAt" type="time" />
                            </Grid.Col>
                            <Grid.Col span={12} sm={6}>
                                <div>
                                    Fin de la journée : <Badge color="pink">{busyTime?.workEndAt}</Badge>
                                </div>
                                <EditInput editForm={editForm} placeholder="Heure de fin" form={form} name="workEndAt" type="time" />
                            </Grid.Col>
                            <Grid.Col span={12} sm={6}>
                                <div>
                                    Durée des rendez-vous : <Badge color="pink">{Number(busyTime?.appointmentDuration) === 60 ? '1h' : `${busyTime?.appointmentDuration} '`}</Badge>
                                </div>
                                <EditInput editForm={editForm} placeholder="Durée des rendez-vous" form={form} name="appointmentDuration" type="number" />
                            </Grid.Col>
                            <Grid.Col span={12} sm={6}>
                                <div>
                                    Durée de la pause : <Badge color="pink">{Number(busyTime?.breakTime) === 60 ? '1h' : `${busyTime?.breakTime} '`}</Badge>
                                </div>
                                <EditInput editForm={editForm} placeholder="Durée de la pause" form={form} name="breakTime" type="number" />
                            </Grid.Col>
                        </Grid>
                        {
                            editForm && <> 
                            <button style={{...btnStyle, backgroundColor: '#008F7A'}} type="submit">Valider</button> 
                             <button onClick={() => setEditForm(state => !state)} style={{ ...btnStyle, margin: '1rem 1rem' }} type="">Annuler</button>
                             </> 
                        }
                    </form>
                    {
                        !editForm && <button onClick={() => {
                            form.setValues({ 
                                workStartAt: busyTime?.workStartAt, 
                                workEndAt: busyTime?.workEndAt, 
                                appointmentDuration: busyTime?.appointmentDuration, 
                                breakTime: busyTime?.breakTime 
                            })
                            setEditForm(state => !state)
                        }} style={{ ...btnStyle, margin: '1rem 0' }} type="">Modifier</button>
                    }
                </Box>
            </Container>
        </div>
    )
}

export default Settings