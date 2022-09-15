import React, { Component } from "react";
import { TheInput } from "./TheInput";

type FormError = { name: string; message: string };
type FormInput = { name: string; age: number; height: number; hobbies: string };

type Props = {
  header: string;
  validate: (input: any) => boolean;
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
      input: { name: "", age: 0, height: 0, hobbies: "" },
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
    const { header } = this.props;
    return (
      <div className="w-full h-full flex-col-center">
        <form
          className="h-[70%] w-[100%] md:w-[70%] text-base font-normal flex-col-center bg-red-100"
          onSubmit={this.handleSubmit}
        >
          <div className="text-lg font-bold font-serif">{header}</div>
          <TheInput
            error={this.state.error}
            handleChange={this.handleChange}
            field={"name"}
            input={this.state.input}
            type={"text"}
          />
          <TheInput
            error={this.state.error}
            handleChange={this.handleChange}
            field={"age"}
            input={this.state.input}
            type={"number"}
          />
          <TheInput
            error={this.state.error}
            handleChange={this.handleChange}
            field={"height"}
            input={this.state.input}
            type={"number"}
          />
          <TheInput
            error={this.state.error}
            handleChange={this.handleChange}
            field={"hobbies"}
            input={this.state.input}
            type={"text"}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default TheForm;
