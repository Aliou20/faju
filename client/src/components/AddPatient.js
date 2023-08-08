import { Alert, Input, InputBase, Modal, Tooltip, createStyles } from '@mantine/core'
import React from 'react'
import { btnStyle } from '../utils/linkStyle';
import { IconAlertCircle, IconAt, IconBrandTwitter } from '@tabler/icons';
import { IMaskInput } from 'react-imask';
import { useDispatch, useSelector } from 'react-redux';
import { addPatient, updatePatients } from '../redux/services/patientService';
import { toast } from 'react-hot-toast';


const useStyles = createStyles((theme) => ({
    // button: {
    //   color: theme.white,
    //   backgroundColor: theme.colors.blue[6],
    //   border: 0,
    //   borderRadius: theme.radius.md,
    //   padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    //   cursor: 'pointer',
    //   margin: theme.spacing.md,
  
    //   // Use pseudo-classes just like you would in Sass
    //   '&:hover': {
    //     backgroundColor: theme.colors.blue[9],
    //   },
  
    //   '&:not(:first-of-type)': {
    //     backgroundColor: theme.colors.violet[6],
  
    //     // pseudo-classes can be nested
    //     '&:hover': {
    //       backgroundColor: theme.colors.violet[9],
    //     },
    //   },
    // },
  
    input : {
      margin : "20px 0"
    }
  }));

function AddPatient({opened , setOpened , title , patients , setPatients , error , setError}) {

    // ############################################## STYLE DE L'APP #############################################
    const modules = {
        toolbar : [
          [{ headers : [1, 2 , 3 , 4 , 5 ,6 ,false] }],
          [{font : []}],
          [{  size : [] }],
          ['bold' , 'italic' , 'underline' , 'strike' , "blockquote"],
          [
            {list : "ordered"},
            {list : "bullet"},
            {indent : "-1"},
            {indent : "+1"}
          ],
          ["link" , "image" , "video"]
        ]
    }
    const {classes} = useStyles()
    const dispatch = useDispatch()
    const currentUser = useSelector((state) => state.user);

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(patients.firstname === "" || patients.lastname ==="" || patients.phone==="") {
          setError("Viellez remplire ce champ .")
        } else {
          if(patients._id) {
            dispatch(updatePatients(patients))
            .then(() => {
              setOpened(false)
              toast('Patient modifié avec success', {icon: '👏',});
            })
            .catch((err) => {
              console.log(err);
              toast('Error')
            })
  
          } else {
            dispatch(addPatient(patients))
            .then((res) => {
              if(res.type === "patient/addPatient/rejected") {
                console.log(res);
                toast(res.payload.error)
              } else if(res.type === "patient/addPatient/fulfilled") {
                setOpened(false)
                toast('Patient ajouté avec success', {icon: '👏',});
                setPatients({
                    idMedecin : "",
                    firstname : "",
                    lastname : "",
                    phone : "",
                    email : "",
                    password : "1234",
                    role: 'client'
                })
              }
            })
            .catch((err) => {
              console.log(err);
              toast(err.response.data.err)
            })
          }
        }
    }
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
      {/* <Input.Wrapper className={classes.input} id={'3'} label="Entrez votre prénom" required maw={320} mx="auto"> */}
        <InputBase
        //   icon={<IconBrandTwitter size="1rem" />}
            value={patients.firstname}
            label="Entrez votre prénom" 
            type='text'
            onChange={(e) => setPatients({...patients , firstname : e.target.value})}
            placeholder="Prénom"
            rightSection={
                <Tooltip label="This is public" position="top-end" withArrow>
                <div>
                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                </div>
                </Tooltip>
            }
        /> 
        {
        error === "Viellez remplire ce champ ." && patients?.firstname === "" && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red">
              {error}
            </Alert>
          )
        }
      {/* </Input.Wrapper> */}
      {/* <Input.Wrapper className={classes.input} id={'3'} label="Entrez votre Nom" required maw={320} mx="auto"> */}
        <InputBase
        //   icon={<IconBrandTwitter size="1rem" />}
            value={patients.lastname}
            label="Entrez votre Nom"
            type = 'text'
            onChange={(e) => setPatients({...patients, lastname : e.target.value})}
            placeholder="Nom"
            rightSection={
                <Tooltip label="This is public" position="top-end" withArrow>
                <div>
                    <IconAlertCircle size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                </div>
                </Tooltip>
            }
        /> 
        {
        error === "Viellez remplire ce champ ." && patients?.lastname === "" && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red">
              {error}
            </Alert>
          )
        }
      {/* </Input.Wrapper> */}
      {/* <Input.Wrapper className={classes.input} id={'3'} label="Entrez votre numéro de téléphone" required maw={320} mx="auto"> */}
        <InputBase 
            value={patients.phone}
            label="Entrez votre numéro de téléphone"
            onChange={(e) => setPatients({...patients, phone : e.target.value})}
            placeholder="Téléphone" 
            component={IMaskInput} 
            // mask="221 00 000 00 00"
        />
        {
        error === "Viellez remplire ce champ ." && patients?.phone === "" && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red">
              {error}
            </Alert>
          )
        }
      {/* </Input.Wrapper> */}

      {/* <Input.Wrapper className={classes.input} id={'3'} label="Entrez votre email" required maw={320} mx="auto"> */}
        <InputBase
          label="Entrez votre email"
          type='email'
          value={patients.email}
          onChange={(e) => setPatients({...patients, email : e.target.value})}
          // icon={<IconAt />}
          placeholder="Email"
        />
          {
        error === "Viellez remplire ce champ ." && patients?.email === "" && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red">
              {error}
            </Alert>
          )
        }
      {/* </Input.Wrapper> */}
      <button 
       style={{ ...btnStyle, width: '100%', padding: '0.8rem' }} type="submit">
                        {/* {
                            !loading ? "Ajouter" : <Loader color="white" variant="dots" />
                        } */}
                        {
                          patients._id ? "Modifier" : "Ajouter"
                        }
                        
      </button>
    </form>
      </Modal>
    </div>
  )
}

export default AddPatient
