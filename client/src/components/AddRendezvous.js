import {
  Alert,
  Input,
  Modal,
  Tooltip,
  createStyles,
  Textarea,
} from "@mantine/core";
import React, { useState } from "react";
import { btnStyle } from "../utils/linkStyle";
import { IconAlertCircle, IconAt, IconBrandTwitter } from "@tabler/icons";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  addRendezvous,
  updateRendezvous,
} from "../redux/services/rendezvousService";
import { format } from "date-fns";

const useStyles = createStyles((theme) => ({
  input: {
    margin: "20px 0",
  },
}));

function AddRendezvous({
  opened,
  setOpened,
  title,
  rendezvous,
  setRendezvous,
  error,
  setError,
}) {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  console.log('salut');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      rendezvous.nomCompletPatient === "" ||
      rendezvous.dateRendezvous === "" ||
      rendezvous.description === ""
    ) {
      setError("Viellez remplire tous les champs .");
    } else {
      if (rendezvous._id) {
        dispatch(updateRendezvous(rendezvous))
          .then(() => {
            setOpened(false);
            toast("Rendez-vous modifié avec success", { icon: "👏" });
          })
          .catch((err) => {
            console.log(err);
            toast("Error");
          });
      } else {
        dispatch(addRendezvous(rendezvous))
          .then((res) => {
            if (res.type === "rendezvous/addRendezvous/rejected") {
              console.log(res);
              toast(res.payload.error);
            } else if (res.type === "rendezvous/addRendezvous/fulfilled") {
              setOpened(false);
              toast("Rendez-vous ajouté avec success", { icon: "👏" });
              setRendezvous({
                nomComplet: "",
                dateRendezvous: "",
                description: "",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            toast(err.response.data.err);
          });
      }
    }
  };


  return (
    <div>
      <Modal
        radius="lg"
        overlayOpacity={0.43}
        overlayBlur={2}
        opened={opened}
        onClose={() => setOpened(false)}
        title={title}
      >
        <form onSubmit={handleSubmit}>
          <Input.Wrapper
            className={classes.input}
            id={"3"}
            label="Entrez votre Nom Complet"
            required
          >
            <Input
              value={rendezvous.nomCompletPatient}
              onChange={(e) =>
                setRendezvous({
                  ...rendezvous,
                  nomCompletPatient: e.target.value,
                })
              }
              placeholder="Nom Complet"
              rightSection={
                <Tooltip label="This is public" position="top-end" withArrow>
                  <div>
                    <IconAlertCircle
                      size="1rem"
                      style={{ display: "block", opacity: 0.5 }}
                    />
                  </div>
                </Tooltip>
              }
            />
            {error === "Viellez remplire ce champ ." &&
              rendezvous.nomCompletPatient === "" && (
                <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                  {error}
                </Alert>
              )}
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
                  fontFamily:
                    "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji",
                  height: "2.25rem",
                  color: "transparent",
                  lineHeight: "calc(2.25rem - 0.125rem)",
                  border: "0.0625rem solid #ced4da",
                  boxSizing: "border-box",
                  fontSize: " 0.875rem",
                  width: "100%",
                  color: "#000",
                  display: "block",
                  textAlign: "left",
                  backgroundColor: "#fff",
                  transition: "border-color 100ms ease",
                  minHeight: "2.25rem",
                  paddingLeft: "calc(2.25rem / 3)",
                  paddingRight: "2.25rem",
                  borderRadius: "0.25rem",
                }}
                type="date"
                placeholder="date de rendez vous"
                value={
                  rendezvous._id
                    ? format(new Date(rendezvous.dateRendezvous), "yyyy-MM-dd")
                    : rendezvous.dateRendezvous
                }
                onChange={(e) =>
                  setRendezvous({
                    ...rendezvous,
                    dateRendezvous: e.target.value,
                  })
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

          {/* <DatesProvider>
      <DatePickerInput
        label="Select a date"
        value={selectedDate}
        onChange={handleDateChange}
        placeholder="Choose a date"
        disabled={false}
        required={true}
      />
      </DatesProvider> */}

          {/* <DateInput
      valueFormat="DD/MM/YYYY"
      label="Date input"
      placeholder="Date input"
      maw={400}
      mx="auto"
      value={rendezvous.dateRendezvous}
             onChange={(e) => setRendezvous({...rendezvous , dateRendezvous : e.target.value})} /> */}
          <div></div>

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
          {error === "Viellez remplire ce champ ." &&
            rendezvous.description === "" && (
              <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                {error}
              </Alert>
            )}

          <button
            style={{ ...btnStyle, width: "100%", padding: "0.8rem" }}
            type="submit"
          >
            {rendezvous._id ? "Modifier" : "Ajouter"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default AddRendezvous;
