import { useState, useEffect, useRef, useContext } from "react";
import _ from "lodash";
import * as yup from "yup";
import {
  Button,
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthContext } from "../../context/AuthContext";
import CsvComponent from "./Csv";

const FormContainer = styled("div")({
  width: "70%",
  height: "90vh",
});

const StyledField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const createEmailTemplate = (values) => {
  const templates = [
    {
      id: 1,
      subject: `Press and Media Opportunities for ${values.to_company}`,
      content: `
                <p>
                    Hi ${values.to_name},
                </p>
                <p>
                    Thanks for connecting with us. We appreciate your brand and have been following your success!
                </p>
                <p>
                    We've helped our clients achieve amazing results, such as getting them over 500+ press features, hosting events, TV Interviews, Podcasts and gaining millions of social impressions. <a href="https://www.example.com" target="_blank">Here's a link</a> to our deck if you'd like to see some of our past work.
                </p>
                <p>
                    Are you available for a quick chat this week, or you can schedule a time on my calendar using this <a href="https://www.example.com">link</a>.
                </p>
                <p>
                    Looking forward to hearing from you!
                </p>
            `,
    },
    {
      id: 2,
      subject: `Press and Media Opportunities for ${values.to_company}`,
      content: `
                <p>
                    Hi ${values.to_name},
                </p>
                <p>
                    My name is ${values.sender_name}, I am the Account Director at AmazingCo. Our team asked me to personally reach out to you and see who is the best contact on your team to discuss strategies for increasing your brand's exposure with press and media opportunities?
                </p>
                <p>
                    We have a successful track record of assisting clients in securing 500+ press features, orchestrating events, TV Interviews, Podcasts and generating millions of social impressions for them. <a href="https://www.example.com" target="_blank">Here's a link</a> to our deck showcasing some of our past work.
                </p>
                <p>
                    Are you available for a quick chat this week? Or if you could direct me to the appropriate person on your team, that would be greatly appreciated.
                </p>
                <p>
                    Thank you so much!
                </p>
            `,
    },
  ];
  return templates;
};

const validationSchema = yup.object({
  from_name: yup.string().required("Sender Name is required"),
  to_email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  to_name: yup.string().required("Recipient Name is required"),
  to_company: yup.string().required("Recipient Company is required"),
  subject: yup
    .string()
    .test("useTemplate", "Subject is required", function (value) {
      const { useTemplate } = this.parent;
      return useTemplate ? true : !!value;
    }),
  message: yup
    .string()
    .test("useTemplate", "Message is required", function (value) {
      const { useTemplate } = this.parent;
      return useTemplate ? true : !!value;
    }),
});

const formFields = [
  { id: "from_name", label: "From" },
  { id: "to_email", label: "Recipient Email" },
  { id: "to_name", label: "Recipient Name" },
  { id: "to_company", label: "Company Name" },
  { id: "subject", label: "Subject" },
  { id: "message", label: "Message", multiline: true, rows: 4 },
];

const TemplateCarousel = ({ templates, setSelectedTemplate }) => {
  return (
    <Carousel
      showThumbs={false}
      onChange={(index) => setSelectedTemplate(templates[index])}
    >
      {templates.map((template) => (
        <div key={template.id}>
          <Card>
            <CardContent>
              <div>
                <strong>Subject:</strong> {template.subject}
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: template.content,
                }}
              />
            </CardContent>
          </Card>
        </div>
      ))}
    </Carousel>
  );
};

const EmailFormComponent = ({
  onSubmit,
  handleSubmit,
  register,
  errors,
  useTemplate,
  templates,
  setSelectedTemplate,
  isBulk,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {formFields.map((field) =>
        isBulk &&
        ["to_email", "to_name", "to_company"].includes(
          field.id
        ) ? null : field.id === "message" && useTemplate ? (
          <TemplateCarousel
            templates={templates}
            setSelectedTemplate={setSelectedTemplate}
          />
        ) : field.id === "subject" && useTemplate ? null : (
          <StyledField
            key={field.id}
            fullWidth
            name={field.id}
            label={field.label}
            {...register(field.id)}
            error={!!errors[field.id]}
            helperText={errors[field.id]?.message}
            {...(field.multiline && {
              multiline: true,
              rows: field.rows,
            })}
          />
        )
      )}
      {!isBulk ? (
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      ) : null}
    </form>
  );
};

const EmailForm = () => {
  const [isBulk, setIsBulk] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { uid } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const formValues = watch();
  const prevFormValuesRef = useRef();
  const useTemplate = watch("useTemplate");

  useEffect(() => {
    prevFormValuesRef.current = formValues;
  }, [formValues]);
  const prevFormValues = prevFormValuesRef.current;

  useEffect(() => {
    if (!_.isEqual(formValues, prevFormValues)) {
      const newTemplates = createEmailTemplate(formValues);
      setTemplates(createEmailTemplate(formValues));
      setSelectedTemplate(newTemplates[0]);
    }
  }, [formValues, prevFormValues]);

  const onSubmit = async (values) => {
    const emailTemplate = {
      from_email: "test@mg.shauno.co",
      from_name: values.from_name,
      to_email: values.to_email,
      to_name: values.to_name,
      to_company: values.to_company,
      subject:
        useTemplate && selectedTemplate
          ? selectedTemplate.subject
          : values.subject,
      message:
        useTemplate && selectedTemplate
          ? selectedTemplate.content
          : values.message,
    };

    const data = {
      uid: uid,
      emailTemplates: emailTemplate,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/send`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert(`Email sent successfully: ${response.data}`);
        reset();
      } else {
        alert(`Failed to send email: ${response.data}`);
      }
    } catch (error) {
      console.error(
        "There has been a problem with your login operation:",
        error
      );
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"center"}
        gap={2}
        marginTop={5}
        marginBottom={2}
        width={"100%"}
      >
        <Button
          variant={isBulk ? "outlined" : "contained"}
          color="primary"
          onClick={() => setIsBulk(false)}
        >
          Single Email
        </Button>
        <Button
          variant={isBulk ? "contained" : "outlined"}
          color="primary"
          onClick={() => setIsBulk(true)} // Add this line
        >
          Bulk Email
        </Button>
      </Box>
      <FormControlLabel
        control={<Switch {...register("useTemplate")} color="primary" />}
        label="Use Template"
      />
      <FormContainer>
        {isBulk ? (
          <>
            <EmailFormComponent
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
              register={register}
              errors={errors}
              useTemplate={useTemplate}
              templates={templates}
              setSelectedTemplate={setSelectedTemplate}
              isBulk={isBulk}
            />
            <CsvComponent
              templates={templates}
              setSelectedTemplate={setSelectedTemplate}
            />
          </>
        ) : (
          <EmailFormComponent
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            register={register}
            errors={errors}
            useTemplate={useTemplate}
            templates={templates}
            setSelectedTemplate={setSelectedTemplate}
            isBulk={isBulk}
          />
        )}
      </FormContainer>
    </>
  );
};

export default EmailForm;
