import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory, NavLink } from 'react-router-dom'
import './signup.css';
import { useSnackbar } from 'notistack';



const useStyles = makeStyles((theme) => ({
  myclass: {
    paddingTop: theme.spacing(10),
    paddingLeft: "0",
    paddingRight: "0"
  },
  paper: {
    marginTop: theme.spacing(0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [passwordShown, setPasswordShown] = useState(false);

  const showPassword = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: ""
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  }

  const history = useHistory();

  const postData = async (e) => {
    e.preventDefault();
    const { userName, email, password } = user;
    console.log(user);
    console.log(userName);
    console.log(email);
    const res = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName, email, password
      })
    })

    const data = await res.json();
    console.log(data);
    console.log(res);
    if (res.status === 422 || !data) {
      enqueueSnackbar('Enter Details Properly 😢', {
        variant: "error"
      })
      console.log("Invalid registration request");
    }
    else {
      enqueueSnackbar('Registration Successfull 🐱', {
        variant: "success"
      })
      console.log("Registration Successfull");

      history.push("/login");
    }
  }


  return (
    <div className='sigdiv'>
      <Container component="main" maxWidth="xs">
        <div className={`${classes.myclass}`} >
          <div className="mt-2 p-0 px-2 pb-2 w-100 pt-1" id='box1' >
            <CssBaseline />
            <div className={classes.paper} style={{margin:"15px"}}>
              <Avatar className={classes.avatar} 
                style={{color: "white", backgroundColor: "green"}}
              >
                <LockOutlinedIcon />
              </Avatar>
              <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="userName"
                      variant="standard"
                      required
                      fullWidth
                      value={user.userName}
                      id="currUsername"
                      label="Username"
                      onChange={handleInputs}
                      autoFocus
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      variant="standard"
                      required
                      fullWidth
                      id="currEmail"
                      value={user.email}
                      label="Email Address"
                      name="email"
                      onChange={handleInputs}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="standard"
                      required
                      fullWidth
                      name="password"
                      value={user.password}
                      onChange={handleInputs}
                      label="Password min(10)"
                      type={passwordShown ? "text" : "password"}
                      id="currPassword"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox value="allowExtraEmails" color="primary" onClick={showPassword} />}
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
                  onClick={postData}
                >
                  Sign Up
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                      <NavLink variant="body2" to="/login" style={{color: "green"}}>
                          Already have an account.? log in here😄
                      </NavLink>
                  </Grid>
                </Grid>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
};