import React from "react";
import { TheInput } from "./TheInput";
import { TheButton } from './../TheButton';

type FormError = { name: string; message: string };
type FormInput = any ;

type Props = {
  header: string;
  validate: (input: any) => boolean;
  input :FormInput
};

type State = {
  value: string;
  input: FormInput;
  error: FormError;
};

class TheForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: "",
      input: this.props.input,
      error: { name: "", message: "" },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValid = this.isValid.bind(this);
    this.setError = this.setError.bind(this);
  }
  setError(error: FormError) {
    this.setState({ error: error });
  }
  isValid() {
    return this.props.validate({
      input: this.state.input,
      setError: this.setError,
    });
  }
  async handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    console.log("value == ", value);
    this.setState({
      input: { ...this.state.input, [event.target.id]: value },
    });
    // this.setError({name:"",message:""})
  }

  async handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Ainput: ", this.state.input);
    if (this.isValid()) {
      console.log("the error ", this.state.error);
    }

    // this.setError({ name: "", message: "" });
    console.log("A name was submitted: ", this.state.input);
  }

  render() {
 const inputs = Object.keys(this.state.input);
    return (
      <div className="w-full h-full flex-col-center">
        <form
          className="h-[70%] w-[90%] md:w-[70%] text-base font-normal flex-col-center 
          border-2 rounded-md shadow-md shadow-slate-600"
          onSubmit={this.handleSubmit} >
          <div className="text-lg font-bold font-serif">{this.props.header}</div>
          {
            inputs&&inputs.map((item,index)=>{
            return <TheInput
            key ={index + item}
            error={this.state.error}
            handleChange={this.handleChange}
            field={item}
            input={this.state.input}
            type={"text"}
          />;
            })
          }

          <TheButton
            label="Submit"
            onClick={() => console.log("hey")}
            radius="5px"
            border={"1px  solid"}
          />
        </form>
      </div>
    );
  }
}

export default TheForm;
