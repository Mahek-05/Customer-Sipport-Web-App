import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useLoginHook from "@/hooks/login";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CustomerLogin() {

  const [username,setUserName] = useState("");
  const {login,error,data} = useLoginHook();

  const submitHandler = (e) => {
    e.preventDefault();
    login({role:"customer",username})
    if(data) {
      console.log(data);
    } 
    if(error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center pt-4">
      <div>
        <h1 className="text-4xl font-Roboto my-1 font-semibold text-[#19355e]">Customer Login</h1>
      </div>
      <div className="border-2 border-black p-4 w-[500px] rounded">
        <form className="flex flex-col w-full space-y-4" onSubmit={submitHandler}>
          {/* Email Field */}

          {/* Customer ID Field */}
          <div className="flex items-center justify-between">
            <Label className="text-xl w-[120px]" htmlFor="customerId">Customer ID</Label>
            <Input type="text" name="customerId" className="w-[300px]" placeholder="Enter customer ID" onChange={e => setUserName(e.target.value)}/>
          </div>
          <hr />
          <div className="flex items-center justify-between">
            <Button className="border-2 border-[#3eabd6] text-[#19355e] rounded hover:bg-[#3eabd6] hover:text-white duration-300" >Submit</Button>
            <Link to="/auth/customer/register" className="hover:underline" >Register</Link>
          </div>
        </form>
        <div className="mt-4">
          <p>If you are an Agent at Branch International <Link to="/auth/agent/login" className="hover:underline">Click here: </Link></p>
        </div>
      </div>
    </div>
  );
}

