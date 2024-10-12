import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useRegisterHook from "@/hooks/register";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function AgentRegister() {
  const {register} = useRegisterHook();

  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName] = useState('')
  const [email,setEmail] = useState('')
  const [agentId,setAgentId] = useState('')

  const submitHandler = (e) => {
    e.preventDefault();
    console.log({firstName,lastName,email})
    register({role:"agent",firstName,lastName,email,agentId})
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center pt-4">
        <div>
          <h1 className="text-4xl font-Roboto my-1 font-semibold text-[#19355e]">
            Agent Register
          </h1>
        </div>
        <div className="border-2 border-black p-4 w-[500px] rounded">
          <form className="flex flex-col w-full space-y-4" onSubmit={submitHandler}>
            {/* First Name Field */}
            <div className="flex items-center justify-between">
              <Label className="text-xl w-[120px]" htmlFor="firstName">
                First Name
              </Label>
              <Input
                type="text"
                name="firstName"
                className="w-[300px]"
                placeholder="Enter first name"
                required
                onChange={e => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name Field */}
            <div className="flex items-center justify-between">
              <Label className="text-xl w-[120px]" htmlFor="lastName">
                Last Name
              </Label>
              <Input
                type="text"
                name="lastName"
                className="w-[300px]"
                placeholder="Enter last name"
                required
                onChange={e => setLastName(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div className="flex items-center justify-between">
              <Label className="text-xl w-[120px]" htmlFor="email">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                className="w-[300px]"
                placeholder="Enter email"
                required
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* Customer ID Field */}
            <div className="flex items-center justify-between">
              <Label className="text-xl w-[120px]" htmlFor="customerId">
                AgentId
              </Label>
              <Input
                type="text"
                name="customerId"
                className="w-[300px]"
                placeholder="Enter Agent ID"
                onChange={e => setAgentId(e.target.value)}
              />
            </div>
            <hr />
            <div className="flex items-center justify-between">
              <Button className="border-2 border-[#3eabd6] text-[#19355e] rounded hover:bg-[#3eabd6] hover:text-white duration-300">
                Submit
              </Button>
              <Link to="/auth/agent/login" className="hover:underline">
                Login
              </Link>
            </div>
          </form>
          <div className="mt-4">
          <p>
            If you are an Customer of Branch International{" "}
            <Link to="/auth/customer/login" className="hover:underline">
              Click here:{" "}
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
