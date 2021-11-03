import { useRouter } from 'next/router';
import {
  Grid,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Typography
} from '@material-ui/core';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import {
  CustomLenderFields,
  IFieldProps,
  LenderFields,
  LenderGetResponse,
  LenderGetResponseExtended,
  LenderPostResponse,
} from 'lib/types';
import {
  getControlTypeByFieldName,
  getValueByName,
  getValueByType,
  isExtendedResponse,
  isLenderField,
} from 'lib/utils';

const LenderNamePage: NextPage = () => {
  const router = useRouter();
  const [formFields, setFormFormFields] = useState<
    LenderGetResponse | LenderGetResponseExtended
  >();

  const [state, setState] = useState<{}>();
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    const lenderSlug = router.query.lenderName?.toString();
    lenderSlug && handleFetchPosts(lenderSlug);
  }, [router]);

  useEffect(() => {
    formFields && setState(getInitialStateObjectBySlug());
  }, [formFields]);

  useEffect(() => {
    missingFields.length > 0 &&
      alert(`Please provide mandatory fields ${missingFields.join(', ')}`);
  }, [missingFields]);

  const handleFetchPosts = async (lenderSlug: string) => {
    const postsResponse = await fetch(`/api/lenders/${lenderSlug}`);
    const postsData = await postsResponse.json();
    setFormFormFields(postsData);
  };

  const getInitialStateObjectBySlug = () => {
    if (isExtendedResponse(formFields)) {
      return formFields.fields
        .map((i) => ({
          name: i.name,
          value: getValueByType(i.type),
          isRequired: i.required,
        }))
        .reduce(
          (obj, item) => Object.assign(obj, { [item.name]: item.value }),
          {},
        );
    }
    if (formFields) {
      return formFields.fields
        .map((i) => ({
          name: i.toString(),
          value: getValueByName(i),
          isRequired: false,
        }))
        .reduce(
          (obj, item) => Object.assign(obj, { [item.name]: item.value }),
          {},
        );
    }
  };

  const isValidData = (data: {} | undefined) => {
    if (!isExtendedResponse(formFields)) return true;
    const requiredFields = formFields.fields
      .filter((item) => item.required)
      .map((i) => i.name);
    const missingFields = [];
    if (data) {
      for (let [key, value] of Object.entries(data)) {
        if (
          requiredFields.indexOf(key) !== -1 &&
          (value === '' || value === false)
        )
          missingFields.push(key);
      }
    }
    setMissingFields(missingFields);
    return missingFields.length > 0 ? false : true;
  };

  const handleSubmit = async () => {
    if (isValidData(state)) {
      const lenderSlug = router.query.lenderName?.toString();
      const postsResponse = await fetch(`/api/lenders/${lenderSlug}`, {
        method: 'POST',
        body: JSON.stringify(state),
      });
      const response: Promise<LenderPostResponse> = postsResponse.json();
      alert(`The decision is ${(await response).decision}`);
    }
  };

  const CustomTextField = ({ type = 'text', details }: IFieldProps) => {
    if (isLenderField(details))
      return (
        <TextField
          id="outlined-basic"
          required={details.required}
          type={type}
          label={details.name}
          variant="outlined"
          fullWidth
          onChange={(e) =>
            setState({ ...state, [details.name]: e.target.value })
          }
        />
      );
    return (
      <TextField
        id="outlined-basic"
        required={false}
        type={type}
        label={details}
        variant="outlined"
        fullWidth
        onChange={(e) => setState({ ...state, [details]: e.target.value })}
      />
    );
  };

  const CustomRadioGroup = ({ type, details }: IFieldProps) => {
    const isLender = isLenderField(details);

    const getOptions = () => {
      if (isLender && details && (details as LenderFields).options) {
        const options = (details as LenderFields).options || [];
        return options.map((i: string) => (
          <FormControlLabel
            value={i}
            control={
              <Radio
                onChange={(e) => setState({ ...state, gender: e.target.value })}
              />
            }
            label={i}
          />
        ));
      }
    };
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup row aria-label={type} name="row-radio-buttons-group">
          {!isLender && (
            <>
              <FormControlLabel
                value="female"
                control={
                  <Radio
                    onChange={(e) =>
                      setState({ ...state, gender: e.target.value })
                    }
                  />
                }
                label="Female"
              />
              <FormControlLabel
                value="male"
                control={
                  <Radio
                    onChange={(e) =>
                      setState({ ...state, gender: e.target.value })
                    }
                  />
                }
                label="Male"
              />
            </>
          )}
          <>{isLender && getOptions()}</>
        </RadioGroup>
      </FormControl>
    );
  };

  const CustomCheckBox = ({ details }: IFieldProps) => {
    if (!isLenderField(details))
      return (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) =>
                  setState({ ...state, [details]: e.target.checked })
                }
              />
            }
            label={details}
          />
        </FormGroup>
      );

    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              required={details.required}
              onChange={(e) =>
                setState({ ...state, [details.name]: e.target.checked })
              }
            />
          }
          label={details.name}
        />
      </FormGroup>
    );
  };

  const FieldMapper = new Map();
  FieldMapper.set('text', CustomTextField);
  FieldMapper.set('radio', CustomRadioGroup);
  FieldMapper.set('checkbox', CustomCheckBox);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '600px' }}>
        <Grid container spacing={2}>
          <Grid item lg={12}>
            <div style={{ backgroundColor: '#1976d2', textAlign: 'center', color: 'white' }}>
              <Typography variant="h6" color="inherit" component="div">
                {`Apply loan for ${router.query.lenderName
                  ?.toString()
                  .toUpperCase()
                  .replace('-', ' ')}`}
              </Typography>
            </div>
          </Grid>
          {formFields &&
            formFields.fields &&
            formFields.fields.map((i: CustomLenderFields | LenderFields) => {
              const fieldType = getControlTypeByFieldName(i);
              return (
                fieldType && (
                  <Grid item lg={12}>
                    {FieldMapper.get(fieldType[1])({
                      type: fieldType[2],
                      details: i,
                    })}
                  </Grid>
                )
              );
            })}
          <Grid item lg={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default LenderNamePage;
