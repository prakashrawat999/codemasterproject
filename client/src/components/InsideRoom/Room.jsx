import React, { useState } from 'react';
import MyEditor from './../Editor/myEditor';
import Box from './../EditorBox/Box';
import axios from "axios";
import { useSnackbar } from 'notistack';
import 'react-reflex/styles.css'

const Room = (props) => {

	const socket = props.socket;


	const getLanguageVersion = {
		cpp17: "0",
		java: "3",
		python3: "3",
		go: "3",
		nodejs: "3",
	};
	const getLanguage = {
		cpp: "cpp17",
		java: "java",
		python: "python3",
		go: "go",
		javascript: "nodejs",
	};

	const [input, setInput] = useState("");
	const [languageInRoom, setlanguageInRoom] = useState("cpp");
	const [output, setoutput] = useState("");
	const [codeInRoom, setcodeInRoom] = useState("");
	const [stats, setstats] = useState("");
	const [RoomFontSize, setRoomFontSize] = useState("");
	const [RoomTheme, setRoomTheme] = useState("vs-dark");
	const [isError, setisError] = useState(false)
	const { enqueueSnackbar } = useSnackbar();

	const runCode = async () => {
		const script = codeInRoom;
		console.log("script:" + script);
		console.log("language in room-->" + languageInRoom);
		const language = getLanguage[languageInRoom];
		const versionIndex = getLanguageVersion[language]
		const stdin = input;
		console.log("languageinRunCode" + language);
		console.log("versionIndexinRunCode" + versionIndex);
		console.log("stdininRunCode" + stdin);



		const response = await axios({
			method: "POST",
			url: `http://localhost:5000/execute`,
//			url: `https://codemasterpro.herokuapp.com/execute`,
			data: {
				script: script,
				language: language,
				stdin: stdin,
				versionIndex: versionIndex
			},
			responseType: "json",
		});

		if (response.status === 200) {
			console.log(response);
			console.log(response.data);
			const data = response.data;
			if (data.memory === null || data.cpu === null) {
				console.log("in true");
				setisError(true);
				enqueueSnackbar('Compilation Error 😢', {
					variant: "warning"
				})
				setoutput(data.output.substr(1))
			} else {
				console.log("in false");
				setisError(false);
				enqueueSnackbar('Successfully Executed 😄', {
					variant: "success"
				})
				setoutput(data.output);
			}
			const statement1 = `Memory used: ${data.memory} kilobyte(s).\n`
			const statement2 = `CPU time: ${data.cpuTime} sec(s).`
			var sta = statement1.concat(statement2);
			console.log(isError + "--")
			setstats(sta);

		}
		else {
			enqueueSnackbar('Some Error occurred', {
				variant: "error"
			})
		}
	}

	return (
		<div>
			<div className="d-flex">
				<MyEditor
					socket={socket}
					nameOfUser={props.nameOfUser}
					setIsDisconnected={props.setIsDisconnected}
					setRoomTheme={setRoomTheme}
					setRoomFontSize={setRoomFontSize}
					runcode={runCode}
					setcodeInRoom={setcodeInRoom}
					setlanguageInRoom={setlanguageInRoom}
				>
				</MyEditor>
			</div>

			<div className="d-flex">
				<div className="ml-1 mt-1" style={{ width: "30%" }}>
					<Box 
					feature="Stats" 
					theme={RoomTheme} 
					value={stats} 
					fontSize={RoomFontSize} />
				</div>
				<div className="ml-2 mt-1" style={{ width: "43.4%" }}>
					<Box 
					feature={isError ? "Error" : "Output"} 
					theme={RoomTheme} 
					value={output} 
					fontSize={RoomFontSize} />
				</div>
			</div>
		</div>
	)
}

export default Room
