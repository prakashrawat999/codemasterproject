import React, { useRef, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react"
import { BrowserView } from "react-device-detect";
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import Brightness7RoundedIcon from '@material-ui/icons/Brightness7Rounded';
import Brightness4RoundedIcon from '@material-ui/icons/Brightness4Rounded';
import ShareRoundedIcon from '@material-ui/icons/ShareRounded';
import Messages from '../ChatFeature/Messages/Messages';
import Input from '../ChatFeature/Input/Input';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import fileDownload from 'js-file-download'
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';

const MyEditor = (props) => {

	const socket = props.socket;
	const history = useHistory();

	const [theme, setTheme] = useState("vs-dark");

	const [language, setLanguage] = useState("cpp")
	const [isEditorReady, setIsEditorReady] = useState(false)
	const [editorCode, seteditorCode] = useState("")
	const [value, setValue] = useState( )
	const [valid, setValid] = useState(false)
	const [sendInitialData, setSendInitialData] = useState(false)
	const [users, setUsers] = useState(0)
	const [title, setTitle] = useState("Code")
	const [fileExtensionValue, setfileExtensionValue] = useState(0)

	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [fontsize, setFontsize] = useState("16px")

	const { enqueueSnackbar } = useSnackbar();

	let { id } = useParams(); // destructuring params : id


	useEffect(() => {
		if (socket === undefined) {
			props.setIsDisconnected(true);
			history.push("/");
		} else {
			socket.emit('room-id', id)
			setValid(true)
		}
		return () => {

		}
	}, [])

	// Ref for editor
	const editorRef = useRef()

	// Called on initialization, adds ref
	const handleEditorDidMount = (_, editor) => {
		setIsEditorReady(true);
		editorRef.current = editor
	}

	// Called whenever there is a change in the editor
	const handleEditorChange = (value, event) => {
		seteditorCode(value)
		props.setcodeInRoom(value)
	};

	// For theme of code editor
	const toggleTheme = () => {
		if (theme === "light") {
			enqueueSnackbar('Dark Mode Activate', {
				variant: "info"
			});
		}
		else {
			enqueueSnackbar('Light mode Activate', {
				variant: "info"
			});
		}
		setTheme(theme === "light" ? "vs-dark" : "light")
		props.setRoomTheme(theme === "light" ? "vs-dark" : "light")
	}

	//for copying room code
	const copyRoomCode = () => {
		navigator.clipboard.writeText(id);
		enqueueSnackbar(`Room Id Copied 😄`, {
			variant: "success"
		});
	}

	// If language changes on one socket, emit to all other
	useEffect(() => {
		if (socket === undefined) {
			props.setIsDisconnected(true);
			history.push("/");
		} else {
			socket.emit('language-change', language)
		}

	}, [language])


	// If there is a code change on a socket, emit to all other
	useEffect(() => {
		if (socket === undefined) {
			history.push("/");
		} else {
			socket.emit('code-change', editorCode)
		}

	}, [editorCode])


	// Recieve code,language changes
	useEffect(() => {
		if (socket === undefined) {
			props.setIsDisconnected(true);
			history.push("/");
		}
		else {
			socket.on('code-update', (data) => {
				setValue(data)
				props.setcodeInRoom(data.code)
			})
			socket.on('language-update', (data) => {
				setLanguage(data)
				props.setlanguageInRoom(data)
			})


			socket.on('receive-message', message => {
				setMessages(messages => [...messages, message]);
			});

			socket.on('room-check', (data) => {
				if (data === false) {
					setValid(false)
				} else {
					socket.emit('join-room', { id, nameOfUser: props.nameOfUser })
					enqueueSnackbar('New User Joined 😺', {
						variant: "success"
					  })
				}

			})

			socket.on('request-info', (data) => {
				setSendInitialData(true)
			})

			// Triggered if new user joins
			socket.on('accept-info', (data) => {
				setLanguage(data.language)
				props.setlanguageInRoom(data.language)
				setValue(data.code)
				props.setcodeInRoom(data.code)
			})

			// Update participants
			socket.on('joined-users', (data) => {
				setUsers(data)
				console.log(data)
			})
		}

	}, [])


	// If a new user join, send him current language and title used by other sockets.
	useEffect(() => {
		if (socket === undefined) {
			props.setIsDisconnected(true);
			history.push("/")
		} else {
			if (sendInitialData === true) {
				socket.emit('user-join', { code: editorCode, title: title, language: language })
				setSendInitialData(false)
			}
		}

	}, [sendInitialData])

	const languages = ["cpp", "python", "javascript", "c", "java", "go"]
	const languageExtension = ["cpp", "py", "js", "c", "java", "go"]
	const fontSizes = ["10px", "12px", "14px", "16px", "18px", "20px", "22px", "24px"]

	const changeLanguage = (e) => {
		setLanguage(languages[e.target.value])
		props.setlanguageInRoom(languages[e.target.value])
		setfileExtensionValue(e.target.value)
	}

	const changeFontSize = (e) => {
		setFontsize(fontSizes[e.target.value])
		props.setRoomFontSize(fontSizes[e.target.value])
	}

	const leaveRoom = (e) => {
		if (socket === undefined) {
			props.setIsDisconnected(true);
			history.push("/");
		} else {
			socket.emit('leaving', { nameOfUser: props.nameOfUser });
			socket.disconnect();
			props.setIsDisconnected(true);
			history.push("/");
		}
	}

	const sendMessage = (event) => {
		event.preventDefault();

		if (message) {
			socket.emit('sendMessage', { message, sender: props.nameOfUser });
			setMessage("");
		}
	}

	const downloadCode = (e) => {
		e.preventDefault();
		fileDownload(editorCode, `${title}.${languageExtension[fileExtensionValue]}`)
	}


	return (
		<>
			<BrowserView className="w-100" >

				<nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-2 ">
					<div className="navbar-brand" to="/" >Code Master ❤️</div>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav ml-auto">
							<li className="nav-item ">
								<IconButton style={{ color: "#3EE305" }} title="Run code" onClick={props.runcode}>
									<PlayArrowRoundedIcon/> 
								</IconButton>
							</li>

							<li className="nav-item">
								<IconButton style={{ color: "#05E7F9" }} title="Download the code" onClick={downloadCode}>
									<GetAppRoundedIcon />
								</IconButton>
							</li>

							<li className="nav-item">
								{
									theme === "vs-dark" ?
										<IconButton style={{ color: "#05E7F9" }} onClick={toggleTheme} title="Change to Light theme">
											<Brightness7RoundedIcon />
										</IconButton>
										:
										<IconButton style={{ color: "#05E7F9" }} onClick={toggleTheme} title="Change to Dark theme">
											<Brightness4RoundedIcon />
										</IconButton>
								}
							</li>

							<li className="nav-item">
								<IconButton style={{ color: "#05E7F9" }} onClick={copyRoomCode} title="Share the room code">
									<ShareRoundedIcon />
								</IconButton>
								{/* <span className="nav-link">{id}</span> */}
							</li>

							<li className="nav-item">
								<select className="custom-select mt-1 bg-dark text-light" title="Select Language" onChange={changeLanguage}>
									<option value="0">C++</option>
									<option value="1">Python</option>
									<option value="2">Javascript</option>
									<option value="3">C</option>
									<option value="4">Java</option>
									<option value="5">Go</option>
								</select>
							</li>

							<li className="nav-item mr-1 ml-2">
								<select className="custom-select mt-1 bg-dark text-light" title="change font size" onChange={changeFontSize}>
									<option value="0">10px</option>
									<option value="1">12px</option>
									<option value="2">14px</option>
									<option value="3" selected>16px</option>
									<option value="4">18px</option>
									<option value="5">20px</option>
									<option value="6">22px</option>
									<option value="7">24px</option>
								</select>
							</li>

							<li className="nav-item">
								<select className="custom-select mt-1 bg-dark text-light" title="change font size" >
								<option>{users} 👨 Joined</option>
								<option>👨 {props.nameOfUser}</option>
								</select>
							</li>

							<li className="nav-item">
								<IconButton style={{ color: "#FF2D08" }} onClick={leaveRoom} title="Leave">
									<ExitToAppRoundedIcon />
								</IconButton>
							</li>
						</ul>

					</div>

				</nav>

				<div className="d-flex">
					<section className="mr-1 ml-1 mt-1" style={{ width: "100%" }}>
						<Editor
							height="65vh"
							width="100%"
							theme={theme}
							language={language}
							value={value}
							editorDidMount={handleEditorDidMount}
							onChange={handleEditorChange}
							loading={"Loading..."}
							options={{ fontSize: fontsize }}
						/>
					</section>
					<section className="ml-auto mr-2 d-flex" style={{ width: "30%" }}>
						<div className="mr-auto d-flex flex-column " style={{width: "25vw", height: "65vh", backgroundColor: " ", opacity: "90%"}}>
							<Messages messages={messages} nameOfUser={props.nameOfUser}>
							</Messages>
							<Input message={message} setMessage={setMessage} sendMessage={sendMessage}></Input>
						</div>
					</section>
				</div>
			</BrowserView>
		</>
	);

}

export default MyEditor;