type Input = { name: string; age: number; height: number; hobbies: string };
type FormError = { name: string; message: string };

interface Validate{
input:Input;
setError:(error: FormError)=>void
}

export const validate = ({ input, setError }: Validate) => {
  if(input.hobbies === ""){
        setError({ name: "hobbies", message: "hobies cant be empty" });
        return false;
  }
    if (input.name === "") {
      setError({ name: "name", message: "name cant be empty" });
      return false;
    }   
  if (input.age < 5) {
    setError({ name: "age", message: "age has to be > 5" });
    return false;
  }
  if (input.height < 5) {
    setError({ name: "height", message: "height has to be > 4" });
    return false;
  }
  // no errors found in validation
  setError({ name: "", message: "" });
  return true;
};
