import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useHistory} from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import './login.css';


const useStyles = makeStyles((theme) => ({
  myclass:{
    paddingTop: theme.spacing(15),
    paddingLeft:"0",
    paddingRight:"0",
    width: "420px"
  },
  paper: {
    marginTop: theme.spacing(0),
    marginLeft: "15px",
    marginRight: "15px",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
  },
}));

export default function Login() {
    const classes = useStyles();

  	const { enqueueSnackbar } = useSnackbar();

    const [passwordShown, setPasswordShown] = useState(false);

    const showPassword = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const [user, setUser] = useState({
        userName: "",
        password: ""
    });

    let name, value;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        
        setUser({...user, [name]: value});
    }

    const history = useHistory();

    const postDataLogin = async (e) => {
        e.preventDefault();

        const { userName, password } = user;
        console.log(user);
        console.log(userName);
        const res = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName, password
            })
        })
        
        const data = await res.json();
        console.log(res);
        console.log(data);
        if (res.status===422 || res.status===400 || !data) {
          enqueueSnackbar('Oops.. 😢', {
            variant: "error"
          })
            console.log("Invalid Credentials");
        }
        else {
          enqueueSnackbar('Successfully Logged In 🐱', {
            variant: "success"
          })
            console.log("Logged In Successfully");
            history.push("/");
        }
    }


  return (
    <div className='logdiv'>
    <Container component="main" maxWidth="xs"  >
      <div className={`${classes.myclass}`}>
      <div className="mt-2 p-0 px-2 pb-2 w-100 pt-4 text-dark" id='BOX'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}
                style={{color: "white", backgroundColor: "green"}}        
        >
          <LockOutlinedIcon />
        </Avatar>
        <form className={classes.form} noValidate>
          <Grid container spacing={2} >
            <Grid item xs={12} >
              <TextField
                name="userName"
                variant="standard"
                required
                fullWidth
                value={user.name}
                id="currUsername"
                label="Username"
                onChange={handleInputs}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} >
              <TextField
                variant="standard"
                required
                fullWidth
                name="password"
                value={user.password}
                onChange={handleInputs}
                label="Password"
                type={passwordShown ? "text" : "password"}
                id="currPassword"
              />
            </Grid>
            <Grid item xs={12} > 
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" onClick={showPassword}/>}
                label="Show Password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{color: "white", backgroundColor: "green"}}        
            className={classes.submit}
            onClick={postDataLogin}
          >
            Log In 👍
          </Button>
          <Grid container justify="flex-end" >
            <Grid item>
              <Link href="/" variant="body2" style={{color: "green"}}>Back To Home 😢</Link>
              &nbsp; &nbsp;
              <NavLink variant="body2" to="/signup" style={{color: "green" }}>Sign Up 😄</NavLink>
              <br></br>
              <br></br>
            </Grid>
          </Grid>
        </form>
      </div>
      </div>
      </div>
    </Container>
  </div>
  )};