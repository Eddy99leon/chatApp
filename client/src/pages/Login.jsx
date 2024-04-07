import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeRequest } from "../utils/axios";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const HandelLogin = () => {
    makeRequest
      .post("/api/auths/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        localStorage.setItem("userData", JSON.stringify(response.data));
        navigate("/");
        console.log("Utilisateur connecter avec succes");
      })
      .catch((error) => {
        console.log("Erreur lors du connection:", error);
      });
    setEmail("");
    setPassword("");
  };

  return (
    <div className="w-full h-[650px] flex items-center justify-center">
      <div className="flex flex-col gap-3 w-[400px]">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 text-lg bg-gray-700 border-none outline-none rounded-lg"
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 text-lg bg-gray-700 border-none outline-none rounded-lg"
          placeholder="Password"
        />
        <div className="text-gray-400 text-lg">
          Pas encore de compte?{" "}
          <Link to="/registre" className="text-white font-bold">
            s'inscrire
          </Link>
        </div>
        <button
          onClick={HandelLogin}
          className="p-3 bg-violet-800 text-black font-bold text-lg rounded-lg"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
};

export default Login;
