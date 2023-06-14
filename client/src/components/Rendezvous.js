import {
    Button,
    Grid,
    Loader,
    ScrollArea,
    Table,
    Text,
    createStyles,
  } from "@mantine/core";
  import React, { useEffect, useState } from "react";
  import { btnStyle } from "../utils/linkStyle";
  import { useDispatch, useSelector } from "react-redux";
  import {
    deleteRendezvous,
    getRendezvous,
   
  } from "../redux/services/rendezvousService";
  import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
  import { getPatients } from "../redux/services/patientService";
  import { useNavigate } from "react-router-dom";
  import { openConfirmModal } from "@mantine/modals";
  import { toast } from "react-hot-toast";
  
  const useStyles = createStyles((theme) => ({
    button: {
      color: theme.white,
      backgroundColor: theme.colors.blue[6],
      border: 0,
      borderRadius: theme.radius.md,
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      cursor: "pointer",
      margin: theme.spacing.md,
  
      // Use pseudo-classes just like you would in Sass
      "&:hover": {
        backgroundColor: theme.colors.blue[9],
      },
  
      "&:not(:first-of-type)": {
        backgroundColor: theme.colors.violet[6],
  
        // pseudo-classes can be nested
        "&:hover": {
          backgroundColor: theme.colors.violet[9],
        },
      },
    },
    div: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      // height: "100vh",
    },
    header: {
      position: "sticky",
      top: 0,
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      transition: "box-shadow 150ms ease",
  
      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        // borderBottom: `${rem(1)} solid ${
        //   theme.colorScheme === "dark"
        //     ? theme.colors.dark[3]
        //     : theme.colors.gray[2]
        // }`,
      },
    },
  
    scrolled: {
      boxShadow: theme.shadows.sm,
    },
    Table: {
      width: "100%",
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        width: 600,
      },
    },
  }));
  
  export default function Rendezvous() {
    const navigate = useNavigate()
    const { classes, cx } = useStyles();
    const [scrolled, setScrolled] = useState(false);
    const dispatch = useDispatch();
    const rendezVous = useSelector((state) => state.rendezvous);
    const currentUser = useSelector((state) => state.user);

    
    useEffect(() => {
      dispatch(getPatients());
      dispatch(getRendezvous());
    }, [dispatch]);
  
    const openDeleteModal = (rendezvous) =>
      openConfirmModal({
        title: "Supprimer la préscription",
        centered: true,
        children: (
          <Text size="sm">
            Êtes-vous sûr de vouloir supprimer ce Rendez-vous
          </Text>
        ),
        labels: { confirm: "Supprimé", cancel: "Annulé" },
        confirmProps: { color: "red" },
        onCancel: () => console.log("Cancel"),
        onConfirm: () => {
          dispatch(deleteRendezvous(rendezvous._id))
            .then(() => {
              toast("Rendez-vous Supprimé avec success", { icon: "👏" });
            })
            .catch((error) => {
              console.log(error);
              toast("Error");
            });
        },
      });
  
    return (
      <>
        {rendezVous.getRendezvous === "pending" ? (
          <div className={classes.div}>
            <Loader color="red" size="xl" />
          </div>
        ) : (
          <div className="table-container">
            <h1>Rendez-vous</h1>
            <Grid justify="flex-end">
              <button
                onClick={() => navigate("/dashboard/addRendezvous")}
                style={btnStyle}
              >
                Programmer un Rendez-vous
              </button>
            </Grid>
            <ScrollArea
            >
              <Table
                className={classes.Table}
              >
                <thead
                  className={cx(classes.header, { [classes.scrolled]: scrolled })}
                >
                  <tr>
                    <th>Prénom patient</th>
                    <th>Nom patient</th>
                    <th>Date Rendez-vous</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rendezVous?.data
                    ?.filter((item) => item?.userId === currentUser._id)
                    ?.map((rv) => (
                      <tr key={rv?._id}>
                        <td>{rv?.dataPatient?.firstname}</td>
                        <td>{rv?.dataPatient?.lastname}</td>
                        <td>{rv.dateRendezvous}</td>
                        <td className="">
                          <Grid style={{padding : '5px' , justifyContent : 'space-around' , alignItems : 'center'}}>
                            <Grid.Col span={2}>
                              <AiOutlineDelete
                                onClick={() => {
                                  openDeleteModal(rv);
                                }}
                              />
                            </Grid.Col>
                            <Grid.Col span={2}>
                              <AiOutlineEdit
                                onClick={() =>
                                  navigate(
                                    `/dashboard/rendezvous/${rv?._id}`
                                  )
                                }
                              />
                            </Grid.Col>
                            {/* <Grid.Col span={2}>
                              <GrFormView
                                onClick={() =>
                                  navigate(
                                    `/dashboard/detail-prescription/${rv?._id}`
                                  )
                                }
                              />
                            </Grid.Col> */}
                          </Grid>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </ScrollArea>
  
            {/* <div>
            <Table>
            <thead>
              <tr>
                <th>Prénom patient</th>
                <th>Nom patient</th>
                <th>Numéro téléphone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                prescriptions?.data
                ?.filter((item) => item.userId === currentUser._id)
                ?.map((prescription) => (
                  <tr key={prescription?._id}>
                    <td>{prescription?.dataPatient?.firstname}</td>
                    <td>{prescription?.dataPatient?.lastname}</td>
                    <td>{prescription?.dataPatient?.phone}</td>
                    <td className='d-flex'>
                      <div>
                        <AiOutlineDelete
                          
                          onClick={ 
                            () => {
                            openDeleteModal(prescription)
                          }
                        }
                        />
                      </div>
                      <div className=''>
                      <AiOutlineEdit 
                        onClick={() => navigate(`/dashboard/prescription/${prescription?._id}`)
                        }
                      />
                      </div>
                      <div className=''>
                        <GrFormView 
                          onClick={() => navigate(`/dashboard/detail-prescription/${prescription?._id}`)}
                        />
                      </div>
                    </td>
                  </tr>
                ))  
              }
  
            </tbody>
          </Table>
              {
                ouvre && <ModalConfirm  
                setOuvre={setOuvre} 
                ouvre={ouvre}
                title={'Confirmer la suppréssion'} 
                contenu={'Vous vous supprimer cette préscription.'}
                // handleDelete={handleDelete}
                id={id} />
              }
            </div> */}
          </div>
        )}
      </>
    );
  }
  