import { Alert, Container, Grid, Input, Loader, Select, TextInput, Textarea, createStyles } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getPatients } from "../redux/services/patientService";
import { IconAlertCircle } from "@tabler/icons";
import { btnStyle } from "../utils/linkStyle";
import { toast } from "react-hot-toast";
import { getRendezvous, updateRendezvous } from "../redux/services/rendezvousService";
import { format } from 'date-fns';


// ? ################### STYLE MANTINE ############################
const useStyles = createStyles((theme) => ({ 
  input: {
    margin: "20px 0",
  },
  ButtonAjoute : {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      marginTop : '100px'
    }
  }
}));

function EditRendezvous() {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [errorTime, SetErrorTime] = useState("");
  const [error, setError] = useState("");
  const currentUser = useSelector((state) => state.user);
  const patients = useSelector((state) => state.patients?.data);
  const rendezVous = useSelector((state) => state.rendezvous);
  const rv = rendezVous?.data.find((item) => item._id === id);
  const [rendezvous, setRendezvous] = useState({
    ...rv,
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    const newRendezvous = {
      ...rendezvous,
    };
    

    if (rendezvous.patientId === "" && rendezvous.description === "" && rendezvous.dateRendezvous === "") {
        setError("Veillez remplire tous les champs.");
      } else if (rendezvous.patientId === "") {
        setError("Veillez selectionner un patient.");
      } else if (rendezvous.description === "") {
        setError("Veillez remplire la description.");
      } else if (rendezvous.dateRendezvous === "") {
          setError("Veillez remplire la date de Rendez-vous.");
      } else {
        dispatch(updateRendezvous(newRendezvous))
          .then((res) => {
            console.log(res.type);
            if(res.type === "rendezvous/updateRendezvous/rejected"){
              SetErrorTime(res.payload.message)
            } else {
              toast("Rendez-vous modifié avec success", { icon: "👏" });
              setRendezvous({
                description: "",
                dateRendezvous: "",
                patients: "",
                dataPatient:{}
              });
              navigate("/dashboard/rendezvous");
              
            }
          })
          .catch((err) => {
            console.log("error", err);
            toast(err.response.data.error);
          });
      }
    };
  

  // ? ####################### DISPATCHER LA FONCTION QUI RECUPERE LES PATIENTS #########################
  useEffect(() => {
    dispatch(getPatients());
    dispatch(getRendezvous());
  }, [dispatch]);

  // ! Foncion qui convertir le select en donnant value et label
  const optionItem = () => {
    return patients
    .filter((patient) => patient.idMedecin === currentUser._id)
    .map((patient) => ({
      value: patient._id,
      label: `${patient.firstname} ${patient.lastname}`,
    }));
  };

  // ? #################### RECUPERER LE PATIENT SELECTIONNER ############################
  const handlePatientChange = (value) => {
    setRendezvous({ ...rendezvous, patientId: value });
  };


  return (
    <div className="table-container">
      <h1>Modifier le Rendez-vous</h1>
      <Container size="sm">
        <form onSubmit={handleSubmit}>
        <Input.Wrapper
            className={classes.input}
            id={"3"}
            label="Selectionnez un patient"
            required
            // maw={320}
            // mx="auto"
          >
            <Select
              
              placeholder={`${rendezvous.dataPatient.firstname} ${rendezvous.dataPatient.lastname}`}
              data={optionItem()}
              onChange={handlePatientChange}
            />
            {error === "Veillez remplire tous les champs." ? (
              <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                {error}
              </Alert>
            ) : error === "Veillez selectionner un patient." ? (
              <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                {error}
              </Alert>
            ) : null}
          </Input.Wrapper>
         
           <Input.Wrapper
            className={classes.input}
            id={"3"}
            label="Chioisir votre date de Rendez vous"
            required
          >
            <div>
            <input
              style={{
                fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
                height: "2.25rem",
                color: "transparent",
                lineHeight: 'calc(2.25rem - 0.125rem)',
                border: '0.0625rem solid #ced4da',
                boxSizing: 'border-box',
                fontSize:' 0.875rem',
                width: '100%',
                color: '#000',
                display: 'block',
                textAlign: 'left',
                backgroundColor: '#fff',
                transition: 'border-color 100ms ease',
                minHeight: '2.25rem',
                paddingLeft: 'calc(2.25rem / 3)',
                paddingRight: '2.25rem',
                borderRadius: '0.25rem',
              }}
              type="date"
              placeholder="date de rendez vous"
              value={rendezvous._id ? format(new Date(rendezvous.dateRendezvous), 'yyyy-MM-dd') : rendezvous.dateRendezvous}
              onChange={(e) =>
                setRendezvous({ ...rendezvous, dateRendezvous: e.target.value })
              }
            />

            </div>
            {error === "Viellez remplire ce champ ." &&
              rendezvous.dateRendezvous === "" && (
                <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                  {error}
                </Alert>
              )}
          </Input.Wrapper>
            <Input.Wrapper className={classes.input}>
          <Grid style={{ fontSize: "0.8rem", fontWeight: "700"}} mt="sm">
            <Grid.Col span={12} sm={6}>
              <TextInput
                value={rendezvous.heureDebut}
                onChange={(e) =>
                  setRendezvous({
                    ...rendezvous,
                    heureDebut: e.target.value,
                  })
                }
                label="Début du rendez-vous"
                type="time"
              />
              {errorTime && (
                <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                  {errorTime}
                </Alert>
              )}
            </Grid.Col>

            <Grid.Col span={12} sm={6}>
              <TextInput
                value={rendezvous.heureFin}
                onChange={(e) =>
                  setRendezvous({
                    ...rendezvous,
                    heureFin: e.target.value,
                  })
                }
                label="Fin du rendez-vous"
                type="time"
              />
              {errorTime && (
                <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                  {errorTime}
                </Alert>
              )}
            </Grid.Col>
          </Grid>
            </Input.Wrapper>

          <Textarea
            value={rendezvous.description}
            onChange={(e) =>
              setRendezvous({ ...rendezvous, description: e.target.value })
            }
           
            placeholder="Description"
            label="Entrez votre Description"
            autosize
            minRows={2}
          />
            {error === "Veillez remplire tous les champs." ? (
              <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                {error}
              </Alert>
            ) : error === "Veillez remplire la préscription." ? (
              <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                {error}
              </Alert>
            ) : null}
          <div className={classes.ButtonAjoute}>
          <button
            style={{ ...btnStyle, width: "100%", padding: "0.8rem" }}
            type="submit"
          >
            {rendezvous.updateRendezvous !== "pending" ? (
                "Modifier"
              ) : (
                <Loader color="white" variant="dots" />
              )}
          </button>

          </div>
        </form>
      </Container>
    </div>
  );
}

export default EditRendezvous;
