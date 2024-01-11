import { useState, useContext } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import axios from "axios";
import CsvDropzone from "./FileDropZone";
import { AuthContext } from "../../context/AuthContext";

const CsvComponent = ({
  templates,
  setSelectedTemplate,
  setPreviewTemplate,
}) => {
  const [file, setFile] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { uid } = useContext(AuthContext);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/process-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setDataList(response.data.results);
      setEmailTemplates(response.data.emailTemplates);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendCsvEmails = async () => {
    setIsSending(true);
    const data = { user_id: uid, emailTemplates };
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/send`, data, {
        headers: {
          "Auth-Key": process.env.REACT_APP_MY_AUTH_KEY,
        },
      });
      alert("Emails sent successfully");
      setIsSending(false);
      setEmailTemplates([]);
      setDataList([]);
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      alert("Failed to send emails");
    }
  };

  return (
    <>
      <CsvDropzone
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setFile={setFile}
      />
      <Box display={"flex"} justifyContent={"center"} margin={4} gap>
        <Button variant="contained" color="primary" onClick={handleUpload}>
          Extract Data
        </Button>
        {emailTemplates.length > 0 && dataList.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendCsvEmails}
            disabled={isSending}
          >
            Send Emails
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} style={{ maxHeight: 440 }}>
        <Table  aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.first_name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.company}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer
        component={Paper}
        style={{ maxHeight: 440, marginTop: "20px" }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emailTemplates.map((template, index) => (
              <TableRow key={index}>
                <TableCell>{template.email}</TableCell>
                <TableCell>{template.subject}</TableCell>
                <TableCell>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: template.message,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CsvComponent;
